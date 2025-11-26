package com.matheus.rentify.app.reports.controller;

import com.matheus.rentify.app.reports.dto.response.*;
import com.matheus.rentify.app.reports.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports", description = "Analytical endpoints for dashboards and financial reports")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/dashboard-summary")
    @Operation(summary = "Get high-level dashboard metrics")
    public ResponseEntity<DashboardSummaryResponseDTO> getDashboardSummary() {
        return ResponseEntity.ok(reportService.getDashboardSummary());
    }

    @GetMapping("/financials")
    @Operation(summary = "Get monthly financial history (all time or filtered)")
    public ResponseEntity<List<MonthlyFinancialResponseDTO>> getFinancialHistory(
            @RequestParam(required = false) Integer year
    ) {
        return ResponseEntity.ok(reportService.getFinancialHistory(year));
    }

    @GetMapping("/leases/expiring")
    @Operation(summary = "Get active leases expiring within the next X days")
    public ResponseEntity<List<ExpiringLeaseResponseDTO>> getExpiringLeases(
            @RequestParam(required = false, defaultValue = "30") int days
    ) {
        List<ExpiringLeaseResponseDTO> expiringLeases = reportService.getExpiringLeases(days);
        return ResponseEntity.ok(expiringLeases);
    }

    @GetMapping("/late-payments")
    @Operation(summary = "Get tenants with overdue payments for a specific month")
    public ResponseEntity<List<LatePaymentResponseDTO>> getLatePayments(
            @RequestParam int referenceMonth,
            @RequestParam int referenceYear
    ) {
        return ResponseEntity.ok(reportService.getLatePayments(referenceMonth, referenceYear));
    }
}