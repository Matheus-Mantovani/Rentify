package com.matheus.rentify.app.people.dto.response;

import com.matheus.rentify.app.people.model.MaritalStatusEnum;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Detailed Data Transfer Object for responding with full guarantor information.
 * This DTO includes sensitive data and should be used in secure, permission-controlled endpoints.
 */
public record GuarantorDetailsResponseDTO(
        @Schema(description = "Unique identifier of the guarantor.", example = "101")
        Long id,

        @Schema(description = "Full name of the guarantor.", example = "Maria Oliveira")
        String fullName,

        @Schema(description = "Guarantor's CPF (Brazilian individual taxpayer registry).", example = "987.654.321-00")
        String cpf,

        @Schema(description = "Guarantor's RG (national identity card number).", example = "98.765.432-1")
        String rg,

        @Schema(description = "Guarantor's contact phone number.", example = "+5511988887777")
        String phone,

        @Schema(description = "Guarantor's contact email address.", example = "maria.oliveira@example.com")
        String email,

        @Schema(description = "Guarantor's profession.", example = "Doctor")
        String profession,

        @Schema(description = "Guarantor's marital status.", example = "Single")
        MaritalStatusEnum maritalStatus,

        @Schema(description = "Guarantor's city of birth.", example = "Campinas")
        String cityOfBirth,

        @Schema(description = "Guarantor's nationality.", example = "Brazilian")
        String nationality,

        @Schema(description = "Name of the guarantor's city of residence.", example = "São Paulo")
        String cityName,

        @Schema(description = "Code of the state where the guarantor resides.", example = "SP")
        String stateCode
) {
}