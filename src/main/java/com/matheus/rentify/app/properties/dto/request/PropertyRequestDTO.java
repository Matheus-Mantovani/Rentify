package com.matheus.rentify.app.properties.dto.request;

import com.matheus.rentify.app.properties.model.PropertyStatusEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/**
 * Data Transfer Object for creating or updating a property.
 * This record captures all the necessary information provided by the client.
 */
public record PropertyRequestDTO(

        @Schema(description = "Full street address of the property.", example = "123 Main St, Apt 4B", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Address cannot be blank.")
        @Size(max = 255, message = "Address cannot exceed 255 characters.")
        String address,

        @Schema(description = "Additional address information, like block or building name.", example = "Block C, Sunshine Residence")
        @Size(max = 100, message = "Address complement cannot exceed 100 characters.")
        String addressComplement,

        @Schema(description = "Neighborhood where the property is located.", example = "Downtown", requiredMode = Schema.RequiredMode.REQUIRED)
        @Size(max = 100, message = "Neighborhood cannot exceed 100 characters.")
        String neighborhood,

        @Schema(description = "Brazilian Postal Code (CEP), must contain exactly 8 digits.", example = "14800000", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Postal code cannot be blank.")
        @Pattern(regexp = "\\d{8}", message = "Postal code must have exactly 8 digits.")
        String postalCode,

        @Schema(description = "ID of the city where the property is located.", example = "487", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "City ID cannot be null.")
        Long cityId,

        @Schema(description = "Current status of the property.", example = "AVAILABLE", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Status cannot be null.")
        PropertyStatusEnum status,

        @Schema(description = "Monthly condo fee value, if applicable. Cannot be negative.", example = "350.50")
        @PositiveOrZero(message = "Condo fee must be a positive value or zero.")
        BigDecimal condoFee,

        @Schema(description = "Annual property tax (IPTU) value. Cannot be negative.", example = "1200.00")
        @PositiveOrZero(message = "Property tax value must be a positive value or zero.")
        BigDecimal propertyTaxValue,

        @Schema(description = "Official property registration number from the registry office.", example = " matrícula 98765")
        @Size(max = 50, message = "Registration number cannot exceed 50 characters.")
        String registrationNumber,

        @Schema(description = "General observations about the property.")
        String notes
) {
}