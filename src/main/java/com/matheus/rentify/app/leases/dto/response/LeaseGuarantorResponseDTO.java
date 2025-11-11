package com.matheus.rentify.app.leases.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.matheus.rentify.app.leases.model.GuaranteeTypeEnum;
import com.matheus.rentify.app.leases.model.LeaseGuarantorStatusEnum;
import com.matheus.rentify.app.people.dto.response.GuarantorResponseDTO;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object for responding with the details of a lease-guarantor link.
 */
public record LeaseGuarantorResponseDTO(

        @Schema(description = "Unique identifier for the lease-guarantor link.", example = "201")
        Long id,

        @Schema(description = "ID of the lease contract.", example = "15")
        Long leaseId,

        @Schema(description = "Summary of the guarantor linked to the lease.")
        GuarantorResponseDTO guarantor,

        @Schema(description = "Type of guarantee provided.", example = "Guarantor with property")
        GuaranteeTypeEnum guaranteeType,

        @Schema(description = "The date the guarantor officially signed the contract.", example = "08-10-2025")
        @JsonFormat(pattern = "dd-MM-yyyy")
        LocalDate signatureDate,

        @Schema(description = "Lifecycle status of this guarantee.", example = "ACTIVE")
        LeaseGuarantorStatusEnum leaseGuarantorStatus,

        @Schema(description = "Monetary value associated with the guarantee, if applicable.", example = "5000.00")
        BigDecimal guaranteeValue,

        @Schema(description = "Property registration number used as collateral, if applicable.", example = "matrícula 98765")
        String guarantorPropertyRegistration,

        @Schema(description = "Any relevant observations about this specific guarantee.")
        String notes
) {
}