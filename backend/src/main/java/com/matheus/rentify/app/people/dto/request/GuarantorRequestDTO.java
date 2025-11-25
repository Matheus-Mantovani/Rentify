package com.matheus.rentify.app.people.dto.request;

import com.matheus.rentify.app.people.model.MaritalStatusEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object for creating or updating a guarantor.
 */
public record GuarantorRequestDTO(

        @Schema(description = "Full name of the guarantor.", example = "Maria Oliveira", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Full name cannot be blank.")
        @Size(max = 255)
        String fullName,

        @Schema(description = "Guarantor's CPF (Brazilian individual taxpayer registry), 11 digits without formatting.", example = "98765432100", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "CPF cannot be blank.")
        @Pattern(regexp = "\\d{11}", message = "CPF must contain exactly 11 digits.")
        String cpf,

        @Schema(description = "Guarantor's RG (national identity card number).", example = "98.765.432-1")
        @Size(max = 20)
        String rg,

        @Schema(description = "Guarantor's contact phone number.", example = "+5511988887777")
        @Size(max = 20)
        String phone,

        @Schema(description = "Guarantor's contact email address.", example = "maria.oliveira@example.com")
        @Email(message = "Email should be valid.")
        @Size(max = 100)
        String email,

        @Schema(description = "Guarantor's profession.", example = "Doctor")
        @Size(max = 100)
        String profession,

        @Schema(description = "Guarantor's marital status.", example = "Single", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Marital status cannot be null.")
        MaritalStatusEnum maritalStatus,

        @Schema(description = "Guarantor's city of birth.", example = "Campinas")
        @Size(max = 50)
        String cityOfBirth,

        @Schema(description = "Guarantor's nationality.", example = "Brazilian")
        @Size(max = 50)
        String nationality,

        @Schema(description = "ID of the guarantor's city of residence.", example = "512")
        @NotNull(message = "City ID cannot be null.")
        Long cityId
) {
}