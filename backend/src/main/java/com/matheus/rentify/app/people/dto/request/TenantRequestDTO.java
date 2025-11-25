package com.matheus.rentify.app.people.dto.request;

import com.matheus.rentify.app.people.model.MaritalStatusEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object for creating or updating a tenant.
 */
public record TenantRequestDTO(

        @Schema(description = "Full name of the tenant.", example = "João da Silva", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Full name cannot be blank.")
        @Size(max = 255)
        String fullName,

        @Schema(description = "Tenant's CPF (Brazilian individual taxpayer registry), 11 digits without formatting.", example = "12345678901", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "CPF cannot be blank.")
        @Pattern(regexp = "\\d{11}", message = "CPF must contain exactly 11 digits.")
        String cpf,

        @Schema(description = "Tenant's RG (national identity card number).", example = "12.345.678-9")
        @Size(max = 20)
        String rg,

        @Schema(description = "Tenant's contact phone number.", example = "+5516999998888")
        @Size(max = 20)
        String phone,

        @Schema(description = "Tenant's contact email address.", example = "joao.silva@example.com")
        @Email(message = "Email should be valid.")
        @Size(max = 100)
        String email,

        @Schema(description = "Tenant's profession.", example = "Software Engineer")
        @Size(max = 100)
        String profession,

        @Schema(description = "Tenant's marital status.", example = "Married", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Marital status cannot be null.")
        MaritalStatusEnum maritalStatus,

        @Schema(description = "Tenant's city of birth.", example = "Araraquara")
        @Size(max = 50)
        String cityOfBirth,

        @Schema(description = "Tenant's nationality.", example = "Brazilian")
        @Size(max = 50)
        String nationality,

        @Schema(description = "ID of the tenant's city of residence.", example = "487")
        @NotNull(message = "City ID cannot be null.")
        Long cityId
) {
}