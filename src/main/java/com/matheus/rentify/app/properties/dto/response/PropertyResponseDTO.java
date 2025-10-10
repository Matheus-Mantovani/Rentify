package com.matheus.rentify.app.properties.dto.response;

import com.matheus.rentify.app.properties.model.PropertyStatusEnum;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

/**
 * Data Transfer Object for responding with public property details.
 * Provides a safe, flattened, and client-friendly view of a Property.
 */
public record PropertyResponseDTO(

        @Schema(description = "Unique identifier of the property.", example = "42")
        Long id,

        @Schema(description = "Full street address of the property.", example = "123 Main St, Apt 4B")
        String address,

        @Schema(description = "Neighborhood where the property is located.", example = "Downtown")
        String neighborhood,

        @Schema(description = "Brazilian Postal Code (CEP).", example = "14800000")
        String postalCode,

        @Schema(description = "Name of the city where the property is located.", example = "Araraquara")
        String cityName,

        @Schema(description = "Code of the state where the property is located.", example = "SP")
        String stateCode,

        @Schema(description = "Current availability status of the property.", example = "Available")
        PropertyStatusEnum propertyStatus,

        @Schema(description = "Monthly condo fee value, if applicable.", example = "350.50")
        BigDecimal condoFee
) {
}