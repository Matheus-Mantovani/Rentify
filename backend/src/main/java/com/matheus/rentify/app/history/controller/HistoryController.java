package com.matheus.rentify.app.history.controller;

import com.matheus.rentify.app.history.dto.response.LeaseHistoryResponseDTO;
import com.matheus.rentify.app.history.dto.response.PropertyFinancialsHistoryResponseDTO;
import com.matheus.rentify.app.history.dto.response.PropertyValueHistoryResponseDTO;
import com.matheus.rentify.app.history.service.HistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@Tag(name = "History", description = "Endpoint to lookup history tables")
public class HistoryController {

    private final HistoryService historyService;

    @Autowired
    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping("/leases")
    @Operation(summary = "Get all archived leases")
    public ResponseEntity<List<LeaseHistoryResponseDTO>> getArchivedLeases() {
        List<LeaseHistoryResponseDTO> leases = historyService.getArchivedLeases();
        return ResponseEntity.ok(leases);
    }

    @GetMapping("/properties/{id}/valuations")
    @Operation(summary = "Get the market value of a property by ID")
    public ResponseEntity<List<PropertyValueHistoryResponseDTO>> getPropertyValuationHistory(@PathVariable Long id) {
        List<PropertyValueHistoryResponseDTO> propertyValuation = historyService.getPropertyValueHistory(id);
        return ResponseEntity.ok(propertyValuation);
    }

    @GetMapping("/properties/{id}/financials")
    @Operation(summary = "Get the financials history of a property by ID")
    public ResponseEntity<List<PropertyFinancialsHistoryResponseDTO>> getPropertyFinancialsHistory(@PathVariable Long id) {
        List<PropertyFinancialsHistoryResponseDTO> propertyFinancials = historyService.getPropertyFinancialsHistory(id);
        return ResponseEntity.ok(propertyFinancials);
    }
}
