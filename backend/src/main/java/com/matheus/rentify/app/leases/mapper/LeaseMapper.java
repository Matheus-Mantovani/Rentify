package com.matheus.rentify.app.leases.mapper;

import com.matheus.rentify.app.leases.dto.request.LeaseRequestDTO;
import com.matheus.rentify.app.leases.dto.request.LeaseTerminationRequestDTO;
import com.matheus.rentify.app.leases.dto.response.LeaseResponseDTO;
import com.matheus.rentify.app.leases.model.Lease;
import com.matheus.rentify.app.people.mapper.TenantMapper;
import com.matheus.rentify.app.people.model.Tenant;
import com.matheus.rentify.app.people.repository.TenantRepository;
import com.matheus.rentify.app.properties.mapper.PropertyMapper;
import com.matheus.rentify.app.properties.model.Property;
import com.matheus.rentify.app.properties.repository.PropertyRepository;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = {PropertyMapper.class, TenantMapper.class})
public abstract class LeaseMapper {

    @Autowired
    protected PropertyRepository propertyRepository;

    @Autowired
    protected TenantRepository tenantRepository;

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "rentValueInWords", ignore = true),
            @Mapping(target = "depositValueInWords", ignore = true),
            @Mapping(target = "paintingFeeInWords", ignore = true),
            @Mapping(target = "status", ignore = true),
            @Mapping(target = "moveOutDate", ignore = true),
            @Mapping(target = "moveOutCondition", ignore = true),
            @Mapping(target = "moveOutReason", ignore = true),
            @Mapping(target = "property", source = "propertyId"),
            @Mapping(target = "tenant", source = "tenantId")
    })
    public abstract Lease toEntity(LeaseRequestDTO dto);

    public abstract LeaseResponseDTO toResponseDTO(Lease entity);

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "rentValueInWords", ignore = true),
            @Mapping(target = "depositValueInWords", ignore = true),
            @Mapping(target = "paintingFeeInWords", ignore = true),
            @Mapping(target = "status", ignore = true),
            @Mapping(target = "moveOutDate", ignore = true),
            @Mapping(target = "moveOutCondition", ignore = true),
            @Mapping(target = "moveOutReason", ignore = true),
            @Mapping(target = "property", source = "propertyId"),
            @Mapping(target = "tenant", source = "tenantId")
    })
    public abstract void updateEntityFromDto(LeaseRequestDTO dto, @MappingTarget Lease entity);

    @Mappings({
            @Mapping(target = "status", constant = "TERMINATED"),
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "property", ignore = true),
            @Mapping(target = "tenant", ignore = true),
            @Mapping(target = "landlordName", ignore = true),
            @Mapping(target = "paymentDueDay", ignore = true),
            @Mapping(target = "startDate", ignore = true),
            @Mapping(target = "endDate", ignore = true),
            @Mapping(target = "baseRentValue", ignore = true),
            @Mapping(target = "securityDepositValue", ignore = true),
            @Mapping(target = "paintingFeeValue", ignore = true),
            @Mapping(target = "rentValueInWords", ignore = true),
            @Mapping(target = "depositValueInWords", ignore = true),
            @Mapping(target = "paintingFeeInWords", ignore = true)
    })
    public abstract void terminateLease(LeaseTerminationRequestDTO dto, @MappingTarget Lease entity);

    protected Property propertyIdToProperty(Long propertyId) {
        if(propertyId == null) {
            throw new IllegalArgumentException("Property ID can not be null");
        }
        return propertyRepository.findById(propertyId)
                .orElseThrow(() -> new EntityNotFoundException("Property not found with id: " + propertyId));
    }

    protected Tenant tenantIdToTenant(Long tenantId) {
        if(tenantId == null) {
            throw new IllegalArgumentException("Tenant ID can not be null");
        }
        return tenantRepository.findById(tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found with id: " + tenantId));
    }
}
