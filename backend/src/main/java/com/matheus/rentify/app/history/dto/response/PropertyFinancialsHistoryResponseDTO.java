package com.matheus.rentify.app.history.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object for responding with a historical record of a property's financials.
 */
public record PropertyFinancialsHistoryResponseDTO(

        @Schema(description = "Unique identifier of the history record.", example = "301")
        Long id,

        @Schema(description = "ID of the property being tracked.", example = "42")
        Long propertyId,

        @Schema(description = "Address of the property for context.", example = "123 Main St, Apt 4B")
        String propertyAddress,

        @Schema(description = "The condo fee value on the record date.", example = "350.50")
        BigDecimal condoFee,

        @Schema(description = "The annual property tax value on the record date.", example = "1200.00")
        BigDecimal propertyTaxValue,

        @Schema(description = "The date from which these financial values were effective.", example = "01-01-2024")
        @JsonFormat(pattern = "dd-MM-yyyy")
        LocalDate recordDate
) {
}