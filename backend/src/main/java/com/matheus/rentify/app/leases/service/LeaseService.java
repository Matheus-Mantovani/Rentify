package com.matheus.rentify.app.leases.service;

import com.matheus.rentify.app.history.model.LeaseHistory;
import com.matheus.rentify.app.history.model.MoveOutConditionEnum;
import com.matheus.rentify.app.history.repository.LeaseHistoryRepository;
import com.matheus.rentify.app.leases.dto.request.LeaseRequestDTO;
import com.matheus.rentify.app.leases.dto.request.LeaseTerminationRequestDTO;
import com.matheus.rentify.app.leases.dto.response.LeaseResponseDTO;
import com.matheus.rentify.app.leases.mapper.LeaseMapper;
import com.matheus.rentify.app.leases.model.Lease;
import com.matheus.rentify.app.leases.repository.LeaseRepository;
import com.matheus.rentify.app.properties.model.Property;
import com.matheus.rentify.app.properties.model.PropertyStatusEnum;
import com.matheus.rentify.app.properties.repository.PropertyRepository;
import com.matheus.rentify.app.shared.util.MonetaryConverter;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class LeaseService {

    private final LeaseRepository leaseRepository;
    private final PropertyRepository propertyRepository;
    private final LeaseHistoryRepository leaseHistoryRepository;
    private final LeaseMapper leaseMapper;

    @Autowired
    public LeaseService(LeaseRepository leaseRepository, PropertyRepository propertyRepository, LeaseHistoryRepository leaseHistoryRepository, LeaseMapper leaseMapper) {
        this.leaseRepository = leaseRepository;
        this.propertyRepository = propertyRepository;
        this.leaseHistoryRepository = leaseHistoryRepository;
        this.leaseMapper = leaseMapper;
    }

    @Transactional
    public LeaseResponseDTO createLease(LeaseRequestDTO requestDTO) {
        Lease lease = leaseMapper.toEntity(requestDTO);
        Property property = findPropertyByIdOrThrow(requestDTO.propertyId());

        if(property.getStatus() != PropertyStatusEnum.AVAILABLE) {
            throw new IllegalStateException("Property with id: " + property.getId() + " is not available. Current status: " + property.getStatus());
        }

        updateMonetaryWords(lease);

        Lease savedLease = leaseRepository.save(lease);
        property.setStatus(PropertyStatusEnum.RENTED);
        propertyRepository.save(property);

        return leaseMapper.toResponseDTO(savedLease);
    }

    @Transactional(readOnly = true)
    public List<LeaseResponseDTO> getAllLeases() {
        List<Lease> leases = leaseRepository.findAll();
        return leases.stream()
                .map(leaseMapper::toResponseDTO)
                .toList();
    }


    @Transactional(readOnly = true)
    public LeaseResponseDTO getLeaseById(Long id) {
        Lease lease = findLeaseByIdOrThrow(id);
        return leaseMapper.toResponseDTO(lease);
    }

    @Transactional
    public LeaseResponseDTO updateLease(Long id, LeaseRequestDTO requestDTO) {
        Lease existingLease = findLeaseByIdOrThrow(id);

        leaseMapper.updateEntityFromDto(requestDTO, existingLease);

        updateMonetaryWords(existingLease);

        Lease updatedLease = leaseRepository.save(existingLease);

        return leaseMapper.toResponseDTO(updatedLease);
    }

    @Transactional
    public void terminateAndArchiveLease(Long leaseId, LeaseTerminationRequestDTO requestDTO) {
        Lease lease = findLeaseByIdOrThrow(leaseId);

        LeaseHistory historyRecord = leaseMapper.toLeaseHistory(requestDTO, lease);
        historyRecord.setArchivedAt(LocalDateTime.now(ZoneId.of("America/Sao_Paulo")));

        Property property = findPropertyByIdOrThrow(lease.getProperty().getId());

        if(requestDTO.moveOutCondition() == MoveOutConditionEnum.NEEDS_REPAIRS) {
            property.setStatus(PropertyStatusEnum.UNDER_MAINTENANCE);
        } else {
            property.setStatus(PropertyStatusEnum.AVAILABLE);
        }

        propertyRepository.save(property);
        leaseHistoryRepository.save(historyRecord);
        leaseRepository.delete(lease);
    }

    private Lease findLeaseByIdOrThrow(Long id) {
        return leaseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lease not found with id: " + id));
    }

    private Property findPropertyByIdOrThrow(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found with id: " + id));
    }

    private void updateMonetaryWords(Lease lease) {
        if (lease.getBaseRentValue() != null) {
            lease.setRentValueInWords(MonetaryConverter.convert(lease.getBaseRentValue()));
        } else {
            lease.setRentValueInWords(null);
        }

        if (lease.getSecurityDepositValue() != null) {
            lease.setDepositValueInWords(MonetaryConverter.convert(lease.getSecurityDepositValue()));
        } else {
            lease.setDepositValueInWords(null);
        }

        if (lease.getPaintingFeeValue() != null) {
            lease.setPaintingFeeInWords(MonetaryConverter.convert(lease.getPaintingFeeValue()));
        } else {
            lease.setPaintingFeeInWords(null);
        }
    }
}
