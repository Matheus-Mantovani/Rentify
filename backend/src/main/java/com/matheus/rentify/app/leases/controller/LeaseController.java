package com.matheus.rentify.app.leases.controller;

import com.matheus.rentify.app.leases.dto.request.LeaseRequestDTO;
import com.matheus.rentify.app.leases.dto.request.LeaseTerminationRequestDTO;
import com.matheus.rentify.app.leases.dto.response.LeaseResponseDTO;
import com.matheus.rentify.app.leases.service.LeaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/leases")
@Tag(name = "Leases", description = "Endpoint for managing leases")
public class LeaseController {

    private final LeaseService leaseService;

    @Autowired
    public LeaseController(LeaseService leaseService) {
        this.leaseService = leaseService;
    }

    @PostMapping
    @Operation(summary = "Create a new lease contract")
    public ResponseEntity<LeaseResponseDTO> createLease(@Valid @RequestBody LeaseRequestDTO requestDTO) {
        LeaseResponseDTO createdDto = leaseService.createLease(requestDTO);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdDto.id())
                .toUri();

        return ResponseEntity.created(location).body(createdDto);
    }

    @GetMapping
    @Operation(summary = "Get all active leases")
    public ResponseEntity<List<LeaseResponseDTO>> getAllLeases() {
        List<LeaseResponseDTO> leases = leaseService.getAllLeases();
        return ResponseEntity.ok(leases);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single lease by ID")
    public ResponseEntity<LeaseResponseDTO> getLeaseById(@PathVariable Long id) {
        LeaseResponseDTO lease = leaseService.getLeaseById(id);
        return ResponseEntity.ok(lease);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing lease by ID")
    public ResponseEntity<LeaseResponseDTO> updateLease(
            @PathVariable Long id,
            @Valid @RequestBody LeaseRequestDTO requestDTO) {

        LeaseResponseDTO updatedLease = leaseService.updateLease(id, requestDTO);

        return ResponseEntity.ok(updatedLease);
    }

    @PostMapping("/{id}/terminate")
    @Operation(summary = "Terminate and archive an active lease")
    public ResponseEntity<Void> terminateLease(
            @PathVariable Long id,
            @Valid @RequestBody LeaseTerminationRequestDTO requestDTO) {
        leaseService.terminateAndArchiveLease(id, requestDTO);

        return ResponseEntity.noContent().build();
    }
}
