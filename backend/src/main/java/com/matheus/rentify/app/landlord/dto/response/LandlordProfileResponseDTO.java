package com.matheus.rentify.app.landlord.dto.response;

import com.matheus.rentify.app.people.model.MaritalStatusEnum;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Data Transfer Object for responding with landlord profile details.
 */
public record LandlordProfileResponseDTO(

        @Schema(description = "Unique identifier of the landlord profile.", example = "1")
        Long id,

        @Schema(description = "Friendly name to identify the profile internally.", example = "My Holding Company")
        String profileAlias,

        @Schema(description = "Indicates if this is the default profile for new contracts.", example = "true")
        Boolean isDefault,

        @Schema(description = "Full legal name of the landlord.", example = "Matheus Real Estate LLC")
        String fullName,

        @Schema(description = "Landlord's nationality.", example = "Brazilian")
        String nationality,

        @Schema(description = "Landlord's marital status.", example = "MARRIED")
        MaritalStatusEnum maritalStatus,

        @Schema(description = "Landlord's profession.", example = "Business Administrator")
        String profession,

        @Schema(description = "Landlord's RG (National ID).", example = "12.345.678-9")
        String rg,

        @Schema(description = "Landlord's Tax ID (CPF or CNPJ).", example = "12.345.678/0001-90")
        String cpfCnpj,

        @Schema(description = "Specific email for this landlord profile.", example = "contact@holding.com")
        String email,

        @Schema(description = "Specific phone number for this landlord profile.", example = "+5511999998888")
        String phone,

        @Schema(description = "Full legal address for the contract.", example = "Av. Paulista, 1000, São Paulo - SP")
        String fullAddress,

        @Schema(description = "PIX key for receiving payments.", example = "12.345.678/0001-90")
        String pixKey,

        @Schema(description = "Bank account details.", example = "Bank: Inter, Ag: 0001, Acc: 12345-6")
        String bankDetails
) {
}