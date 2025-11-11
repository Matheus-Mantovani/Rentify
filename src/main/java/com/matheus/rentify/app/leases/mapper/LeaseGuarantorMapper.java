package com.matheus.rentify.app.leases.mapper;

import com.matheus.rentify.app.leases.dto.request.LeaseGuarantorRequestDTO;
import com.matheus.rentify.app.leases.dto.response.LeaseGuarantorResponseDTO;
import com.matheus.rentify.app.leases.model.Lease;
import com.matheus.rentify.app.leases.model.LeaseGuarantor;
import com.matheus.rentify.app.leases.repository.LeaseRepository;
import com.matheus.rentify.app.people.mapper.GuarantorMapper;
import com.matheus.rentify.app.people.model.Guarantor;
import com.matheus.rentify.app.people.repository.GuarantorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = {GuarantorMapper.class})
public abstract class LeaseGuarantorMapper {

    @Autowired
    protected LeaseRepository leaseRepository;

    @Autowired
    protected GuarantorRepository guarantorRepository;

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "lease", source = "leaseId"),
            @Mapping(target = "guarantor", source = "guarantorId")
    })
    public abstract LeaseGuarantor toEntity(LeaseGuarantorRequestDTO dto);

    @Mappings({
            @Mapping(target = "leaseId", source = "entity.lease.id"),
            @Mapping(target = "guarantor", source = "entity.guarantor")
    })
    public abstract LeaseGuarantorResponseDTO toResponseDTO(LeaseGuarantor entity);

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "lease", source = "leaseId"),
            @Mapping(target = "guarantor", source = "guarantorId")
    })
    public abstract void updateEntityFromDto(LeaseGuarantorRequestDTO dto, @MappingTarget LeaseGuarantor entity);

    protected Lease leaseIdToLease(Long leaseId) {
        if(leaseId == null) {
            throw new IllegalArgumentException("Lease ID must not be null.");
        }
        return leaseRepository.findById(leaseId)
                .orElseThrow(() -> new EntityNotFoundException("Lease not found with id: " + leaseId));
    }

    protected Guarantor guarantorIdToGuarantor(Long guarantorId) {
        if(guarantorId == null) {
            throw new IllegalArgumentException("Lease ID must not be null.");
        }
        return guarantorRepository.findById(guarantorId)
                .orElseThrow(() -> new EntityNotFoundException("Guarantor not found with id: " + guarantorId));
    }
}
