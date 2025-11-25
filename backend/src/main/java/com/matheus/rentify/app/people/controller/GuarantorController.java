package com.matheus.rentify.app.people.controller;

import com.matheus.rentify.app.people.dto.request.GuarantorRequestDTO;
import com.matheus.rentify.app.people.dto.response.GuarantorDetailsResponseDTO;
import com.matheus.rentify.app.people.dto.response.GuarantorResponseDTO;
import com.matheus.rentify.app.people.service.GuarantorService;
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
@RequestMapping("/api/guarantors")
@Tag(name = "Guarantors", description = "Endpoint for managing guarantors")
public class GuarantorController {

    private final GuarantorService guarantorService;

    @Autowired
    public GuarantorController(GuarantorService guarantorService) {
        this.guarantorService = guarantorService;
    }

    @PostMapping
    @Operation(summary = "Create a new guarantor")
    public ResponseEntity<GuarantorDetailsResponseDTO> createGuarantor(@Valid @RequestBody GuarantorRequestDTO requestDTO) {
        GuarantorDetailsResponseDTO createdDto = guarantorService.createGuarantor(requestDTO);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdDto.id())
                .toUri();

        return ResponseEntity.created(location).body(createdDto);
    }

    @GetMapping
    @Operation(summary = "Get all guarantors (summary view)")
    public ResponseEntity<List<GuarantorResponseDTO>> getAllGuarantors() {
        List<GuarantorResponseDTO> guarantors = guarantorService.getAllGuarantors();
        return ResponseEntity.ok(guarantors);
    }

    @GetMapping("/details")
    @Operation(summary = "Get all guarantors (detailed view)")
    public ResponseEntity<List<GuarantorDetailsResponseDTO>> getAllGuarantorsDetails() {
        List<GuarantorDetailsResponseDTO> guarantors = guarantorService.getAllGuarantorsDetails();
        return ResponseEntity.ok(guarantors);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single guarantor by ID (detailed view)")
    public ResponseEntity<GuarantorDetailsResponseDTO> getGuarantorDetailsById(@PathVariable Long id) {
        GuarantorDetailsResponseDTO guarantor = guarantorService.getGuarantorDetailsById(id);
        return ResponseEntity.ok(guarantor);
    }

    @GetMapping("/{id}/summary")
    @Operation(summary = "Get a single guarantor by ID (summary view)")
    public ResponseEntity<GuarantorResponseDTO> getGuarantorById(@PathVariable Long id) {
        GuarantorResponseDTO guarantor = guarantorService.getGuarantorById(id);
        return ResponseEntity.ok(guarantor);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing guarantor by ID")
    public ResponseEntity<GuarantorDetailsResponseDTO> updateGuarantor(
            @PathVariable Long id,
            @Valid @RequestBody GuarantorRequestDTO requestDTO) {

        GuarantorDetailsResponseDTO updatedGuarantor = guarantorService.updateGuarantor(id, requestDTO);

        return ResponseEntity.ok(updatedGuarantor);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a guarantor by ID")
    public ResponseEntity<Void> deleteGuarantor(@PathVariable Long id) {
        guarantorService.deleteGuarantor(id);
        return ResponseEntity.noContent().build();
    }
}
