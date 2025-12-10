package com.matheus.rentify.app.leases.dto.response;

import com.matheus.rentify.app.leases.model.LeaseStatusEnum;
import com.matheus.rentify.app.leases.model.MoveOutConditionEnum;
import com.matheus.rentify.app.people.dto.response.TenantDetailsResponseDTO;
import com.matheus.rentify.app.people.dto.response.TenantResponseDTO;
import com.matheus.rentify.app.properties.dto.response.PropertyResponseDTO;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object for responding with lease contract details.
 * It composes other DTOs to provide a rich and safe view of the lease and its related entities.
 */
public record LeaseResponseDTO(

        @Schema(description = "Unique identifier of the lease contract.", example = "15")
        Long id,

        @Schema(description = "Status of the lease", example = "ACTIVE")
        LeaseStatusEnum status,

        @Schema(description = "Details of the leased property.")
        PropertyResponseDTO property,

        @Schema(description = "Summary of the tenant on the lease.")
        TenantDetailsResponseDTO tenant,

        @Schema(description = "Name of the property owner/landlord.", example = "Carlos Souza")
        String landlordName,

        @Schema(description = "Day of the month the payment is due.", example = "10")
        Integer paymentDueDay,

        @Schema(description = "The date the lease agreement begins.", example = "2025-11-01")
        LocalDate startDate,

        @Schema(description = "The date the lease agreement ends.", example = "2026-10-31")
        LocalDate endDate,

        @Schema(description = "Base monthly rent value.", example = "2200.50")
        BigDecimal baseRentValue,

        @Schema(description = "Value of the security deposit, if any.", example = "4401.00")
        BigDecimal securityDepositValue,

        @Schema(description = "Value of the painting fee, if any.", example = "1000.00")
        BigDecimal paintingFeeValue,

        @Schema(description = "Rent value written in words, for legal documents.", example = "Two thousand, two hundred reais and fifty cents")
        String rentValueInWords,

        @Schema(description = "Security deposit value written in words.", example = "Four thousand, four hundred and one reais")
        String depositValueInWords,

        @Schema(description = "Painting fee value written in words.", example = "One thousand reais")
        String paintingFeeInWords,

        @Schema(description = "Date the tenant moved out.", example = "2025-10-08")
        LocalDate moveOutDate,

        @Schema(description = "Condition of the property upon move-out.", example = "GOOD")
        MoveOutConditionEnum moveOutCondition,

        @Schema(description = "Reason for the tenant moving out.", example = "End of contract")
        String moveOutReason
) {
}