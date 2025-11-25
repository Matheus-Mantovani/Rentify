package com.matheus.rentify.app.properties.mapper;

import com.matheus.rentify.app.properties.dto.request.MaintenanceJobRequestDTO;
import com.matheus.rentify.app.properties.dto.response.MaintenanceJobResponseDTO;
import com.matheus.rentify.app.properties.model.MaintenanceJob;
import com.matheus.rentify.app.properties.model.Property;
import com.matheus.rentify.app.properties.repository.PropertyRepository;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class MaintenanceJobMapper {

    @Autowired
    protected PropertyRepository propertyRepository;

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "property", source = "propertyId")
    })
    public abstract MaintenanceJob toEntity(MaintenanceJobRequestDTO dto);

    @Mappings({
            @Mapping(target = "propertyId", source = "entity.property.id"),
            @Mapping(target = "propertyAddress", source = "entity.property.address")
    })
    public abstract MaintenanceJobResponseDTO toResponseDTO(MaintenanceJob entity);

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "property", source = "propertyId")
    })
    public abstract void updateEntityFromDto(MaintenanceJobRequestDTO dto, @MappingTarget MaintenanceJob entity);

    protected Property propertyIdToProperty(Long propertyId) {
        if (propertyId == null) {
            throw new IllegalArgumentException("Property ID cannot be null.");
        }
        return propertyRepository.findById(propertyId)
                .orElseThrow(() -> new EntityNotFoundException("Property not found with id: " + propertyId));
    }
}