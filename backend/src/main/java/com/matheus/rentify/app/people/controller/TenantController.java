package com.matheus.rentify.app.people.controller;

import com.matheus.rentify.app.people.dto.request.TenantRequestDTO;
import com.matheus.rentify.app.people.dto.response.TenantDetailsResponseDTO;
import com.matheus.rentify.app.people.dto.response.TenantResponseDTO;
import com.matheus.rentify.app.people.service.TenantService;
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
@RequestMapping("/api/tenants")
@Tag(name = "Tenants", description = "Endpoint for managing tenants")
public class TenantController {

    private final TenantService tenantService;

    @Autowired
    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @PostMapping
    @Operation(summary = "Create a new tenant")
    public ResponseEntity<TenantDetailsResponseDTO> createTenant(@Valid @RequestBody TenantRequestDTO requestDTO) {
        TenantDetailsResponseDTO createdDto = tenantService.createTenant(requestDTO);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdDto.id())
                .toUri();

        return ResponseEntity.created(location).body(createdDto);
    }

    @GetMapping
    @Operation(summary = "Get all tenants (summary view)")
    public ResponseEntity<List<TenantResponseDTO>> getAllTenants() {
        List<TenantResponseDTO> tenants = tenantService.getAllTenants();
        return ResponseEntity.ok(tenants);
    }

    @GetMapping("/details")
    @Operation(summary = "Get all tenants (detailed view)")
    public ResponseEntity<List<TenantDetailsResponseDTO>> getAllTenantsDetails() {
        List<TenantDetailsResponseDTO> tenants = tenantService.getAllTenantsDetails();
        return ResponseEntity.ok(tenants);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single tanant by ID (detailed view)")
    public ResponseEntity<TenantDetailsResponseDTO> getTenantDetailsById(@PathVariable Long id) {
        TenantDetailsResponseDTO tenant = tenantService.getTenantDetailsById(id);
        return ResponseEntity.ok(tenant);
    }

    @GetMapping("/{id}/summary")
    @Operation(summary = "Get a single tenant by ID (summary view)")
    public ResponseEntity<TenantResponseDTO> getTenantById(@PathVariable Long id) {
        TenantResponseDTO tenant = tenantService.getTenantById(id);
        return ResponseEntity.ok(tenant);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing tenant by ID")
    public ResponseEntity<TenantDetailsResponseDTO> updateTenant(
            @PathVariable Long id,
            @Valid @RequestBody TenantRequestDTO requestDTO) {

        TenantDetailsResponseDTO updatedDto = tenantService.updateTenant(id, requestDTO);

        return ResponseEntity.ok(updatedDto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a tenant by ID")
    public ResponseEntity<Void> deleteTenant(@PathVariable Long id) {
        tenantService.deleteTenant(id);
        return ResponseEntity.noContent().build();
    }
}
