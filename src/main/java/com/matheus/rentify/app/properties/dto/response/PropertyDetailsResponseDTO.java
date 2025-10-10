package com.matheus.rentify.app.properties.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.matheus.rentify.app.properties.model.PropertyStatusEnum;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

/**
 * Detailed Data Transfer Object for responding with full property information.
 * This DTO includes all fields, including administrative and internal data,
 * and should be used in secure, permission-controlled endpoints.
 */
public record PropertyDetailsResponseDTO(

        @Schema(description = "Unique identifier of the property.", example = "42")
        Long id,

        // --- Location ---
        @Schema(description = "Full street address of the property.", example = "123 Main St, Apt 4B")
        String address,

        @Schema(description = "Additional address information, like block or building name.", example = "Block C, Sunshine Residence")
        String addressComplement,

        @Schema(description = "Neighborhood where the property is located.", example = "Downtown")
        String neighborhood,

        @Schema(description = "Brazilian Postal Code (CEP).", example = "14800000")
        String postalCode,

        @Schema(description = "Name of the city where the property is located.", example = "Araraquara")
        String cityName,

        @Schema(description = "Code of the state where the property is located.", example = "SP")
        String stateCode,

        // --- Details and Costs ---
        @Schema(description = "Current availability status of the property.", example = "RENTED")
        PropertyStatusEnum status,

        @Schema(description = "Current market value of the property.", example = "450000.00")
        BigDecimal currentMarketValue,

        @Schema(description = "Monthly condo fee value, if applicable.", example = "350.50")
        BigDecimal condoFee,

        @Schema(description = "Annual property tax (IPTU) value.", example = "1200.00")
        BigDecimal propertyTaxValue,

        // --- Administrative Details ---
        @Schema(description = "Official property registration number from the registry office.", example = "matrícula 98765")
        String registrationNumber,

        @Schema(description = "General observations and internal notes about the property.")
        String notes
) {
}