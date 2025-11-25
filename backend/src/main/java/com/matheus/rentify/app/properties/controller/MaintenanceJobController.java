package com.matheus.rentify.app.properties.controller;

import com.matheus.rentify.app.properties.dto.request.MaintenanceJobRequestDTO;
import com.matheus.rentify.app.properties.dto.response.MaintenanceJobResponseDTO;
import com.matheus.rentify.app.properties.service.MaintenanceJobService;
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
@RequestMapping("/api/maintenance-jobs")
@Tag(name = "Maintenance Jobs", description = "Endpoints for managing property maintenance")
public class MaintenanceJobController {

    private final MaintenanceJobService maintenanceJobService;

    @Autowired
    public MaintenanceJobController(MaintenanceJobService maintenanceJobService) {
        this.maintenanceJobService = maintenanceJobService;
    }

    @PostMapping
    @Operation(summary = "Create a new maintenance job")
    public ResponseEntity<MaintenanceJobResponseDTO> createJob(@Valid @RequestBody MaintenanceJobRequestDTO requestDTO) {
        MaintenanceJobResponseDTO createdDto = maintenanceJobService.createJob(requestDTO);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdDto.id())
                .toUri();

        return ResponseEntity.created(location).body(createdDto);
    }

    @GetMapping
    @Operation(summary = "Get all maintenance jobs, optionally filtered by propertyId")
    public ResponseEntity<List<MaintenanceJobResponseDTO>> getJobs(@RequestParam(required = false) Long propertyId) {
        List<MaintenanceJobResponseDTO> jobs = maintenanceJobService.getJobs(propertyId);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single maintenance job by ID")
    public ResponseEntity<MaintenanceJobResponseDTO> getJobById(@PathVariable Long id) {
        MaintenanceJobResponseDTO job = maintenanceJobService.getJobById(id);
        return ResponseEntity.ok(job);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing maintenance job by ID")
    public ResponseEntity<MaintenanceJobResponseDTO> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody MaintenanceJobRequestDTO requestDTO) {

        MaintenanceJobResponseDTO updatedDto = maintenanceJobService.updateJob(id, requestDTO);
        return ResponseEntity.ok(updatedDto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a maintenance job by ID")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        maintenanceJobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
}