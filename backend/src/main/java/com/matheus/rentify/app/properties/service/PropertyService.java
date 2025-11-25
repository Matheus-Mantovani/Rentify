package com.matheus.rentify.app.properties.service;

import com.matheus.rentify.app.history.repository.PropertyFinancialsHistoryRepository;
import com.matheus.rentify.app.history.repository.PropertyValueHistoryRepository;
import com.matheus.rentify.app.history.model.PropertyFinancialsHistory;
import com.matheus.rentify.app.history.model.PropertyValueHistory;
import com.matheus.rentify.app.leases.repository.LeaseRepository;
import com.matheus.rentify.app.properties.repository.PropertyRepository;
import com.matheus.rentify.app.properties.dto.request.PropertyRequestDTO;
import com.matheus.rentify.app.properties.dto.response.PropertyDetailsResponseDTO;
import com.matheus.rentify.app.properties.dto.response.PropertyResponseDTO;
import com.matheus.rentify.app.properties.mapper.PropertyMapper;
import com.matheus.rentify.app.properties.model.Property;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyValueHistoryRepository valueHistoryRepository;
    private final PropertyFinancialsHistoryRepository financialsHistoryRepository;
    private final LeaseRepository leaseRepository;
    private final PropertyMapper propertyMapper;

    @Autowired
    public PropertyService(PropertyRepository propertyRepository, PropertyValueHistoryRepository valueHistoryRepository, PropertyFinancialsHistoryRepository financialsHistoryRepository, LeaseRepository leaseRepository, PropertyMapper propertyMapper) {
        this.propertyRepository = propertyRepository;
        this.valueHistoryRepository = valueHistoryRepository;
        this.financialsHistoryRepository = financialsHistoryRepository;
        this.leaseRepository = leaseRepository;
        this.propertyMapper = propertyMapper;
    }

    @Transactional
    public PropertyDetailsResponseDTO createProperty(PropertyRequestDTO requestDTO) {
        Property property = propertyMapper.toEntity(requestDTO);
        Property savedProperty = propertyRepository.save(property);

        if(savedProperty.getCurrentMarketValue() != null) {
            saveValueHistory(savedProperty, savedProperty.getCurrentMarketValue());
        }

        if(savedProperty.getCondoFee() != null || savedProperty.getPropertyTaxValue() != null) {
            saveFinancialsHistory(savedProperty, savedProperty.getCondoFee(), savedProperty.getPropertyTaxValue());
        }

        return propertyMapper.toDetailsResponseDTO(savedProperty);
    }

    @Transactional(readOnly = true)
    public List<PropertyResponseDTO> getAllProperties() {
        return propertyRepository.findAll()
                .stream()
                .map(propertyMapper::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PropertyDetailsResponseDTO> getAllPropertiesDetails() {
        return propertyRepository.findAll()
                .stream()
                .map(propertyMapper::toDetailsResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public PropertyResponseDTO getPropertyById(Long id) {
        Property property = findPropertyByIdOrThrow(id);
        return propertyMapper.toResponseDTO(property);
    }

    @Transactional(readOnly = true)
    public PropertyDetailsResponseDTO getPropertyDetailsById(Long id) {
        Property property = findPropertyByIdOrThrow(id);
        return propertyMapper.toDetailsResponseDTO(property);
    }

    @Transactional
    public PropertyDetailsResponseDTO updateProperty(Long id, PropertyRequestDTO propertyRequestDTO) {
        Property existingProperty = findPropertyByIdOrThrow(id);

        boolean marketValueChanged = propertyRequestDTO.currentMarketValue() != null && !Objects.equals(propertyRequestDTO.currentMarketValue(), existingProperty.getCurrentMarketValue());
        boolean financialsChanged = (propertyRequestDTO.condoFee() != null && !Objects.equals(propertyRequestDTO.condoFee(), existingProperty.getCondoFee()))
                                    || (propertyRequestDTO.propertyTaxValue() != null && !Objects.equals(propertyRequestDTO.propertyTaxValue(), existingProperty.getPropertyTaxValue()));

        if(marketValueChanged) {
            saveValueHistory(existingProperty, propertyRequestDTO.currentMarketValue());
        }
        if(financialsChanged) {
            saveFinancialsHistory(existingProperty, propertyRequestDTO.condoFee(), propertyRequestDTO.propertyTaxValue());
        }

        propertyMapper.updateEntityFromDto(propertyRequestDTO, existingProperty);

        Property updatedProperty = propertyRepository.save(existingProperty);

        return propertyMapper.toDetailsResponseDTO(updatedProperty);
    }

    @Transactional
    public void deleteProperty(Long id) {
        Property property = findPropertyByIdOrThrow(id);

        boolean hasActiveLeases = leaseRepository.existsByPropertyId(property.getId());

        if(hasActiveLeases) {
            throw new IllegalStateException("Cannot delete property with ID " + id + " because it has associated active leases.");
        }

        propertyRepository.delete(property);
    }

    private Property findPropertyByIdOrThrow(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found with id: " + id));
    }

    private void saveValueHistory(Property property, BigDecimal newValue) {
        PropertyValueHistory historyRecord = new PropertyValueHistory();
        historyRecord.setProperty(property);
        historyRecord.setPropertyValue(newValue);
        historyRecord.setRecordDate(LocalDate.now());
        valueHistoryRepository.save(historyRecord);
    }

    private void saveFinancialsHistory(Property property, BigDecimal newCondoFee, BigDecimal newTaxValue) {
        PropertyFinancialsHistory historyRecord = new PropertyFinancialsHistory();
        historyRecord.setProperty(property);
        historyRecord.setCondoFee(newCondoFee);
        historyRecord.setPropertyTaxValue(newTaxValue);
        historyRecord.setRecordDate(LocalDate.now());
        financialsHistoryRepository.save(historyRecord);
    }
}
