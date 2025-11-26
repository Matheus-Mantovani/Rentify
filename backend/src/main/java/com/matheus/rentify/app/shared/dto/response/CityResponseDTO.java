package com.matheus.rentify.app.shared.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Data Transfer Object for responding with city details.
 * Used for location lookups and address forms.
 */
public record CityResponseDTO(
        @Schema(description = "Unique identifier of the city.", example = "487")
        Long id,

        @Schema(description = "Full name of the city.", example = "Araraquara")
        String cityName,

        @Schema(description = "Abbreviation code of the state the city belongs to.", example = "SP")
        String stateCode
) {
}