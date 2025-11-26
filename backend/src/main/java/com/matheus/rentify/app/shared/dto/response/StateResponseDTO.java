package com.matheus.rentify.app.shared.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Data Transfer Object for responding with state (federative unit) details.
 * Used for location lookups.
 */
public record StateResponseDTO(
        @Schema(description = "Unique identifier of the state.", example = "25")
        Long id,

        @Schema(description = "Two-letter abbreviation code of the state.", example = "SP")
        String stateCode,

        @Schema(description = "Full name of the state.", example = "São Paulo")
        String stateName
) {
}