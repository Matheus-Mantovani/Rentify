package com.matheus.rentify.app.shared.exception;

import java.time.LocalDateTime;

public record ErrorResponse(
        int statusCode,
        String message,
        String path,
        LocalDateTime timestamp
) { }
