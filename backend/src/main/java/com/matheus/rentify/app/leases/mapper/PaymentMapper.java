package com.matheus.rentify.app.leases.mapper;

import com.matheus.rentify.app.leases.dto.request.PaymentRequestDTO;
import com.matheus.rentify.app.leases.dto.response.PaymentResponseDTO;
import com.matheus.rentify.app.leases.model.Lease;
import com.matheus.rentify.app.leases.model.Payment;
import com.matheus.rentify.app.leases.repository.LeaseRepository;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class PaymentMapper {

    @Autowired
    protected LeaseRepository leaseRepository;

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "lease", source = "leaseId")
    })
    public abstract Payment toEntity(PaymentRequestDTO dto);

    @Mappings({
            @Mapping(target = "leaseId", source = "entity.lease.id")
    })
    public abstract PaymentResponseDTO toResponseDTO(Payment entity);

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "lease", source = "leaseId")
    })
    public abstract void updateEntityFromDto(PaymentRequestDTO dto, @MappingTarget Payment entity);

    protected Lease leaseIdToLease(Long leaseId) {
        if(leaseId == null) {
            throw new IllegalArgumentException("Lease ID can not be null.");
        }
        return leaseRepository.findById(leaseId)
                .orElseThrow(() -> new EntityNotFoundException("Lease not found with id: " + leaseId));
    }

}
