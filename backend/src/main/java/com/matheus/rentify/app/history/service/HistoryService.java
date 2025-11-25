package com.matheus.rentify.app.history.service;

import com.matheus.rentify.app.history.dto.response.LeaseHistoryResponseDTO;
import com.matheus.rentify.app.history.dto.response.PropertyFinancialsHistoryResponseDTO;
import com.matheus.rentify.app.history.dto.response.PropertyValueHistoryResponseDTO;
import com.matheus.rentify.app.history.mapper.HistoryMapper;
import com.matheus.rentify.app.history.model.LeaseHistory;
import com.matheus.rentify.app.history.model.PropertyFinancialsHistory;
import com.matheus.rentify.app.history.model.PropertyValueHistory;
import com.matheus.rentify.app.history.repository.LeaseHistoryRepository;
import com.matheus.rentify.app.history.repository.PropertyFinancialsHistoryRepository;
import com.matheus.rentify.app.history.repository.PropertyValueHistoryRepository;
import com.matheus.rentify.app.properties.repository.PropertyRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HistoryService {

    private final LeaseHistoryRepository leaseHistoryRepository;
    private final PropertyValueHistoryRepository propertyValueHistoryRepository;
    private final PropertyFinancialsHistoryRepository propertyFinancialsHistoryRepository;
    private final PropertyRepository propertyRepository;
    private final HistoryMapper historyMapper;

    @Autowired
    public HistoryService(LeaseHistoryRepository leaseHistoryRepository, PropertyValueHistoryRepository propertyValueHistoryRepository, PropertyFinancialsHistoryRepository propertyFinancialsHistoryRepository, PropertyRepository propertyRepository, HistoryMapper historyMapper) {
        this.leaseHistoryRepository = leaseHistoryRepository;
        this.propertyValueHistoryRepository = propertyValueHistoryRepository;
        this.propertyFinancialsHistoryRepository = propertyFinancialsHistoryRepository;
        this.propertyRepository = propertyRepository;
        this.historyMapper = historyMapper;
    }

    @Transactional(readOnly = true)
    public List<LeaseHistoryResponseDTO> getArchivedLeases() {
        List<LeaseHistory> leases = leaseHistoryRepository.findAll();
        return leases.stream()
                .map(historyMapper::toLeaseHistoryResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PropertyValueHistoryResponseDTO> getPropertyValueHistory(Long propertyId) {
        if(!propertyRepository.existsById(propertyId)) {
            throw new EntityNotFoundException("Property not found with ID: " + propertyId);
        }

        List<PropertyValueHistory> propertyValues = propertyValueHistoryRepository.findByPropertyIdOrderByRecordDateDesc(propertyId);

        return propertyValues.stream()
                .map(historyMapper::toPropertyValueHistoryResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PropertyFinancialsHistoryResponseDTO> getPropertyFinancialsHistory(Long propertyId) {
        if(!propertyRepository.existsById(propertyId)) {
            throw new EntityNotFoundException("Property not found with ID: " + propertyId);
        }

        List<PropertyFinancialsHistory> propertyFinancials = propertyFinancialsHistoryRepository.findByPropertyIdOrderByRecordDateDesc(propertyId);

        return propertyFinancials.stream()
                .map(historyMapper::toPropertyFinancialsHistoryResponseDTO)
                .toList();
    }


}

