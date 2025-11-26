package com.matheus.rentify.app.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object for registering a new user.
 */
public record RegisterRequestDTO(

        @Schema(description = "Full name of the user.", example = "Matheus Mantovani", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Full name cannot be blank.")
        @Size(min = 3, max = 255, message = "Full name must be between 3 and 255 characters.")
        String fullName,

        @Schema(description = "Username for login (must be unique).", example = "matheus", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Username cannot be blank.")
        @Size(min = 3, max = 100, message = "Username must be between 3 and 100 characters.")
        String username,

        @Schema(description = "User's email address (must be unique).", example = "matheus@rentify.com", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Email cannot be blank.")
        @Email(message = "Email should be valid.")
        @Size(max = 100)
        String email,

        @Schema(description = "User's password (min 8 characters).", example = "strongPassword123", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Password cannot be blank.")
        @Size(min = 8, message = "Password must be at least 8 characters long.")
        String password
) {}