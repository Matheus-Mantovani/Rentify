package com.matheus.rentify.app.people.mapper;

import com.matheus.rentify.app.people.dto.request.TenantRequestDTO;
import com.matheus.rentify.app.people.dto.response.TenantDetailsResponseDTO;
import com.matheus.rentify.app.people.dto.response.TenantResponseDTO;
import com.matheus.rentify.app.people.model.Tenant;
import com.matheus.rentify.app.shared.model.City;
import com.matheus.rentify.app.shared.repository.CityRepository;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class TenantMapper {

    @Autowired
    protected CityRepository cityRepository;

    @Mappings({
            @Mapping(target = "city", source = "cityId"),
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "deletedAt", ignore = true)
    })
    public abstract Tenant toEntity(TenantRequestDTO dto);

    @Mappings({
            @Mapping(target = "cityName", source = "entity.city.cityName"),
            @Mapping(target = "stateCode", source = "entity.city.state.stateCode")
    })
    public abstract TenantResponseDTO toResponseDTO(Tenant entity);

    @Mappings({
            @Mapping(target = "cityName", source = "entity.city.cityName"),
            @Mapping(target = "stateCode", source = "entity.city.state.stateCode")
    })
    public abstract TenantDetailsResponseDTO toDetailsResponseDTO(Tenant entity);

    @Mappings({
            @Mapping(target = "city", source = "cityId"),
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "deletedAt", ignore = true)
    })
    public abstract void updateEntityFromDto(TenantRequestDTO dto, @MappingTarget Tenant entity);

    protected City cityIdToCity(Long cityId) {
        if(cityId == null) {
            throw new IllegalArgumentException("City ID can not be null.");
        }
        return cityRepository.findById(cityId)
                .orElseThrow(() -> new EntityNotFoundException("City not found with id: " + cityId));
    }
}
