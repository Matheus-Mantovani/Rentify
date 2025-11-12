package com.matheus.rentify.app.auth.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Data Transfer Object for the login response, containing the authentication token.
 */
public record LoginResponseDTO(

        @Schema(description = "The JWT authentication token.", example = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYXRoZXVzIiwiaWF0IjoxNzMxNDQyMzUzLCJleHAiOjE3MzE1Mjg3NTN9.abc123xyz...")
        String token
) {}