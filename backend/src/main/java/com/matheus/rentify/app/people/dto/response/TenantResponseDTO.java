package com.matheus.rentify.app.people.dto.response;

import com.matheus.rentify.app.people.model.MaritalStatusEnum;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Data Transfer Object for responding with public tenant details.
 * Provides a safe view of the Tenant entity, omitting sensitive data like CPF/RG.
 */
public record TenantResponseDTO(

        @Schema(description = "Unique identifier of the tenant.", example = "77")
        Long id,

        @Schema(description = "Full name of the tenant.", example = "João da Silva")
        String fullName,

        @Schema(description = "Tenant's contact phone number.", example = "+5516999998888")
        String phone,

        @Schema(description = "Tenant's contact email address.", example = "joao.silva@example.com")
        String email,

        @Schema(description = "Tenant's profession.", example = "Software Engineer")
        String profession,

        @Schema(description = "Tenant's marital status.", example = "Married")
        MaritalStatusEnum maritalStatus,

        @Schema(description = "Name of the tenant's city of residence.", example = "Araraquara")
        String cityName,

        @Schema(description = "Code of the state where the tenant resides.", example = "SP")
        String stateCode
) {
}