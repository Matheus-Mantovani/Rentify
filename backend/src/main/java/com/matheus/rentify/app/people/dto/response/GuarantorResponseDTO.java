package com.matheus.rentify.app.people.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Data Transfer Object for providing a summary of a guarantor.
 * Intended for lists and contexts where sensitive data is not required.
 */
public record GuarantorResponseDTO(
        @Schema(description = "Unique identifier of the guarantor.", example = "101")
        Long id,

        @Schema(description = "Full name of the guarantor.", example = "Maria Oliveira")
        String fullName,

        @Schema(description = "Guarantor's contact phone number.", example = "+5511988887777")
        String phone,

        @Schema(description = "Guarantor's contact email address.", example = "maria.oliveira@example.com")
        String email
) {
}