package com.matheus.rentify.app.landlord.dto.request;

import com.matheus.rentify.app.people.model.MaritalStatusEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object for creating or updating a landlord profile.
 */
public record LandlordProfileRequestDTO(

        @Schema(description = "Friendly name to identify the profile internally.", example = "My Holding Company", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Profile alias is required.")
        @Size(max = 50, message = "Profile alias cannot exceed 50 characters.")
        String profileAlias,

        @Schema(description = "Indicates if this is the default profile for new contracts.", example = "true")
        Boolean isDefault,

        @Schema(description = "Full legal name of the landlord (Individual or Company).", example = "Matheus Real Estate LLC", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Full name is required.")
        @Size(max = 255, message = "Full name cannot exceed 255 characters.")
        String fullName,

        @Schema(description = "Landlord's nationality.", example = "Brazilian", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Nationality is required.")
        @Size(max = 50, message = "Nationality cannot exceed 50 characters.")
        String nationality,

        @Schema(description = "Landlord's marital status.", example = "MARRIED", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Marital status is required.")
        MaritalStatusEnum maritalStatus,

        @Schema(description = "Landlord's profession.", example = "Business Administrator", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Profession is required.")
        @Size(max = 100, message = "Profession cannot exceed 100 characters.")
        String profession,

        @Schema(description = "Landlord's RG (National ID).", example = "12.345.678-9", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "RG is required.")
        @Size(max = 20, message = "RG cannot exceed 20 characters.")
        String rg,

        @Schema(description = "Landlord's Tax ID (CPF or CNPJ).", example = "12.345.678/0001-90", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "CPF/CNPJ is required.")
        @Size(max = 20, message = "CPF/CNPJ cannot exceed 20 characters.")
        String cpfCnpj,

        @Schema(description = "Specific email for this landlord profile.", example = "contact@holding.com")
        @Email(message = "Invalid email format.")
        @Size(max = 100, message = "Email cannot exceed 100 characters.")
        String email,

        @Schema(description = "Specific phone number for this landlord profile.", example = "+5511999998888")
        @Size(max = 20, message = "Phone cannot exceed 20 characters.")
        String phone,

        @Schema(description = "Full legal address for the contract.", example = "Av. Paulista, 1000, São Paulo - SP", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Full address is required.")
        @Size(max = 255, message = "Full address cannot exceed 255 characters.")
        String fullAddress,

        @Schema(description = "PIX key for receiving payments.", example = "12.345.678/0001-90")
        @Size(max = 100, message = "PIX key cannot exceed 100 characters.")
        String pixKey,

        @Schema(description = "Bank account details (Agency, Account, Bank Name).", example = "Bank: Inter, Ag: 0001, Acc: 12345-6")
        String bankDetails
) {
}