package com.matheus.rentify.app.shared.dto.response;

public record CityResponseDTO(
        Long id,
        String cityName,
        String stateCode
) {
}
