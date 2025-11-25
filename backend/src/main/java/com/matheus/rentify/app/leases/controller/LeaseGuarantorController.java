package com.matheus.rentify.app.leases.controller;

import com.matheus.rentify.app.leases.dto.request.LeaseGuarantorRequestDTO;
import com.matheus.rentify.app.leases.dto.response.LeaseGuarantorResponseDTO;
import com.matheus.rentify.app.leases.service.LeaseGuarantorService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.ServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/lease-guarantors")
public class LeaseGuarantorController {

    private final LeaseGuarantorService leaseGuarantorService;

    @Autowired
    public LeaseGuarantorController(LeaseGuarantorService leaseGuarantorService) {
        this.leaseGuarantorService = leaseGuarantorService;
    }

    @PostMapping
    @Operation(summary = "Create a new lease guarantor")
    public ResponseEntity<LeaseGuarantorResponseDTO> createLeaseGuarantor(@Valid @RequestBody LeaseGuarantorRequestDTO requestDTO) {
        LeaseGuarantorResponseDTO createdDto = leaseGuarantorService.createLeaseGuarantor(requestDTO);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdDto.id())
                .toUri();

        return ResponseEntity.created(location).body(createdDto);
    }

    @GetMapping
    @Operation(summary = "Get all lease guarantors by leaseId")
    public ResponseEntity<List<LeaseGuarantorResponseDTO>> getGuarantorsForLease(@RequestParam Long leaseId, ServletResponse servletResponse) {
        List<LeaseGuarantorResponseDTO> leaseGuarantors = leaseGuarantorService.getGuarantorsByLeaseId(leaseId);
        return ResponseEntity.ok(leaseGuarantors);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single lease guarantor by ID")
    public ResponseEntity<LeaseGuarantorResponseDTO> getLeaseGuarantorById(@PathVariable Long id) {
        LeaseGuarantorResponseDTO leaseGuarantor = leaseGuarantorService.getLeaseGuarantorById(id);
        return ResponseEntity.ok(leaseGuarantor);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing lease guarantor by ID")
    public ResponseEntity<LeaseGuarantorResponseDTO> updateLeaseGuarantor(
            @PathVariable Long id,
            @Valid @RequestBody LeaseGuarantorRequestDTO requestDTO) {
        LeaseGuarantorResponseDTO updatedDto = leaseGuarantorService.updateLeaseGuarantor(id, requestDTO);
        return ResponseEntity.ok(updatedDto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a lease guarantor by ID")
    public ResponseEntity<Void> deleteLeaseGuarantor(@PathVariable Long id) {
        leaseGuarantorService.deleteLeaseGuarantor(id);
        return ResponseEntity.noContent().build();
    }
}
