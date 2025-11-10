package com.matheus.rentify.app.people.mapper;

import com.matheus.rentify.app.people.dto.request.GuarantorRequestDTO;
import com.matheus.rentify.app.people.dto.response.GuarantorDetailsResponseDTO;
import com.matheus.rentify.app.people.dto.response.GuarantorResponseDTO;
import com.matheus.rentify.app.people.model.Guarantor;
import com.matheus.rentify.app.shared.model.City;
import com.matheus.rentify.app.shared.repository.CityRepository;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class GuarantorMapper {

    @Autowired
    protected CityRepository cityRepository;

    @Mappings({
            @Mapping(target = "city", source = "cityId"),
            @Mapping(target = "id", ignore = true)
    })
    public abstract Guarantor toEntity(GuarantorRequestDTO dto);

    public abstract GuarantorResponseDTO toResponseDto(Guarantor entity);

    @Mappings({
            @Mapping(target = "cityName", source = "entity.city.cityName"),
            @Mapping(target = "stateCode", source = "entity.city.state.stateCode")
    })
    public abstract GuarantorDetailsResponseDTO toDetailsResponseDto(Guarantor entity);

    @Mappings({
            @Mapping(target = "city", source = "cityId"),
            @Mapping(target = "id", ignore = true)
    })
    public abstract void updateEntityFromDto(GuarantorRequestDTO dto, @MappingTarget Guarantor entity);

    protected City cityIdToCity(Long cityId) {
        if(cityId == null) {
            throw new IllegalArgumentException("City ID can not be null.");
        }
        return cityRepository.findById(cityId)
                .orElseThrow(() -> new EntityNotFoundException("City not found with id: " + cityId));
    }
}
