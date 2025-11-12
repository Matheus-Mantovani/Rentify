package com.matheus.rentify.app.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

/**
 * Data Transfer Object for user login.
 */
public record LoginRequestDTO(

        @Schema(description = "Username used for login.", example = "matheus", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Username cannot be blank.")
        String username,

        @Schema(description = "Password for login.", example = "strongPassword123", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Password cannot be blank.")
        String password
) {}