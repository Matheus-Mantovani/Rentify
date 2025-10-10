package com.matheus.rentify.app.people.dto.response;

import com.matheus.rentify.app.people.model.MaritalStatusEnum;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Detailed Data Transfer Object for responding with full tenant information.
 * This DTO includes sensitive data like CPF and RG and should be used in secure,
 * permission-controlled endpoints.
 */
public record TenantDetailsResponseDTO(

        @Schema(description = "Unique identifier of the tenant.", example = "77")
        Long id,

        @Schema(description = "Full name of the tenant.", example = "João da Silva")
        String fullName,

        @Schema(description = "Tenant's CPF (Brazilian individual taxpayer registry).", example = "123.456.789-00")
        String cpf,

        @Schema(description = "Tenant's RG (national identity card number).", example = "12.345.678-9")
        String rg,

        @Schema(description = "Tenant's contact phone number.", example = "+5516999998888")
        String phone,

        @Schema(description = "Tenant's contact email address.", example = "joao.silva@example.com")
        String email,

        @Schema(description = "Tenant's profession.", example = "Software Engineer")
        String profession,

        @Schema(description = "Tenant's marital status.", example = "Married")
        MaritalStatusEnum maritalStatus,

        @Schema(description = "Tenant's city of birth.", example = "Araraquara")
        String cityOfBirth,

        @Schema(description = "Tenant's nationality.", example = "Brazilian")
        String nationality,

        @Schema(description = "Name of the tenant's city of residence.", example = "São Paulo")
        String cityName,

        @Schema(description = "Code of the state where the tenant resides.", example = "SP")
        String stateCode
) {
}