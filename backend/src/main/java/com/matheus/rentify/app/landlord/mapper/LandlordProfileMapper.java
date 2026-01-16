package com.matheus.rentify.app.landlord.mapper;

import com.matheus.rentify.app.landlord.dto.request.LandlordProfileRequestDTO;
import com.matheus.rentify.app.landlord.dto.response.LandlordProfileResponseDTO;
import com.matheus.rentify.app.landlord.model.LandlordProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public abstract class LandlordProfileMapper {

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "user", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "deletedAt", ignore = true)
    })
    public abstract LandlordProfile toEntity(LandlordProfileRequestDTO dto);

    public abstract LandlordProfileResponseDTO toResponseDTO(LandlordProfile entity);

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "user", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "deletedAt", ignore = true)
    })
    public abstract void updateEntityFromDto(LandlordProfileRequestDTO dto, @MappingTarget LandlordProfile entity);
}