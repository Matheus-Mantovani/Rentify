package com.matheus.rentify.app.leases.mapper;

import com.matheus.rentify.app.history.model.LeaseHistory;
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
            @Mapping(target = "property", source = "propertyId"),
            @Mapping(target = "tenant", source = "tenantId")
    })
    public abstract Lease toEntity(LeaseRequestDTO dto);

    public abstract LeaseResponseDTO toResponseDTO(Lease entity);

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "property", source = "propertyId"),
            @Mapping(target = "tenant", source = "tenantId")
    })
    public abstract void updateEntityFromDto(LeaseRequestDTO dto, @MappingTarget Lease entity);

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "archivedAt", ignore = true)
    })
    public abstract LeaseHistory toLeaseHistory(LeaseTerminationRequestDTO terminationDTO, Lease lease);

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
