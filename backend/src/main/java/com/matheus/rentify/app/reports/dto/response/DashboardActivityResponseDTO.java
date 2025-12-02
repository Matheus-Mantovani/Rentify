package com.matheus.rentify.app.reports.dto.response;

import com.matheus.rentify.app.reports.model.ActivityTypeEnum;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object for the dashboard's recent activities feed.
 * Aggregates different types of events (payments, maintenance, lease expirations) into a unified structure for the UI.
 */
public record DashboardActivityResponseDTO(
        @Schema(description = "Type of activity to determine icon/color", example = "PAYMENT")
        ActivityTypeEnum type,

        @Schema(description = "Main title of the activity", example = "João's payment received")
        String title,

        @Schema(description = "Secondary information like address", example = "Rua das Flores, 123")
        String subtitle,

        @Schema(description = "Financial value if applicable", example = "1500.00")
        BigDecimal value,

        @Schema(description = "Date of the event", example = "28-11-2024")
        LocalDate date,

        @Schema(description = "ID of the original entity (PaymentID, JobID, LeaseID)", example = "10")
        Long relatedId,

        @Schema(description = "Calculated days remaining (only for expiring leases)", example = "15")
        Long daysRemaining
) {}