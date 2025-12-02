package com.matheus.rentify.app.properties.mapper;

import com.matheus.rentify.app.properties.dto.request.PropertyRequestDTO;
import com.matheus.rentify.app.properties.dto.response.PropertyDetailsResponseDTO;
import com.matheus.rentify.app.properties.dto.response.PropertyResponseDTO;
import com.matheus.rentify.app.properties.model.Property;
import com.matheus.rentify.app.shared.model.City;
import com.matheus.rentify.app.shared.repository.CityRepository;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class PropertyMapper {

    @Autowired
    protected CityRepository cityRepository;

    @Mappings({
            @Mapping(target = "city", source = "cityId"),
            @Mapping(target = "id", ignore = true)
    })
    public abstract Property toEntity(PropertyRequestDTO dto);

    @Mappings({
            @Mapping(target = "cityName", source = "entity.city.cityName"),
            @Mapping(target = "stateCode", source = "entity.city.state.stateCode")
    })
    public abstract PropertyResponseDTO toResponseDTO(Property entity);

    @Mappings({
            @Mapping(target = "cityName", source = "entity.city.cityName"),
            @Mapping(target = "stateCode", source = "entity.city.state.stateCode"),
            @Mapping(target = "cityId", source = "entity.city.id"),
            @Mapping(target = "stateId", source = "entity.city.state.id")
    })
    public abstract PropertyDetailsResponseDTO toDetailsResponseDTO(Property entity);

    @Mappings({
            @Mapping(target = "city", source = "cityId"),
            @Mapping(target = "id", ignore = true)
    })
    public abstract void updateEntityFromDto(PropertyRequestDTO dto, @MappingTarget Property entity);

    protected City cityIdToCity(Long cityId) {
        if (cityId == null) {
            throw new IllegalArgumentException("City ID can not be null.");
        }
        return cityRepository.findById(cityId)
                .orElseThrow(() -> new EntityNotFoundException("City not found with id: " + cityId));
    }
}