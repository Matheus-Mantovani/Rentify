package com.matheus.rentify.app.properties.controller;

import com.matheus.rentify.app.properties.dto.request.PropertyRequestDTO;
import com.matheus.rentify.app.properties.dto.response.PropertyDetailsResponseDTO;
import com.matheus.rentify.app.properties.dto.response.PropertyResponseDTO;
import com.matheus.rentify.app.properties.service.PropertyService;
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
@RequestMapping("/api/properties")
@Tag(name = "Properties", description = "Endpoints for managing properties")
public class PropertyController {

    private final PropertyService propertyService;

    @Autowired
    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @PostMapping
    @Operation(summary = "Create a new property")
    public ResponseEntity<PropertyDetailsResponseDTO> createProperty(@Valid @RequestBody PropertyRequestDTO requestDTO) {
        PropertyDetailsResponseDTO createdDto = propertyService.createProperty(requestDTO);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdDto.id())
                .toUri();

        return ResponseEntity.created(location).body(createdDto);
    }

    @GetMapping
    @Operation(summary = "Get all properties (summary view)")
    public ResponseEntity<List<PropertyResponseDTO>> getAllProperties() {
        List<PropertyResponseDTO> properties = propertyService.getAllProperties();
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/details")
    @Operation(summary = "Get all properties (detailed view)")
    public ResponseEntity<List<PropertyDetailsResponseDTO>> getAllPropertiesDetails() {
        List<PropertyDetailsResponseDTO> properties = propertyService.getAllPropertiesDetails();
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single property by ID (detailed view)")
    public ResponseEntity<PropertyDetailsResponseDTO> getPropertyDetailsById(@PathVariable Long id) {
        PropertyDetailsResponseDTO property = propertyService.getPropertyDetailsById(id);
        return ResponseEntity.ok(property);
    }

    @GetMapping("/{id}/summary")
    @Operation(summary = "Get a single property by ID (summary view)")
    public ResponseEntity<PropertyResponseDTO> getPropertySummaryById(@PathVariable Long id) {
        PropertyResponseDTO property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(property);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing property by ID")
    public ResponseEntity<PropertyDetailsResponseDTO> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyRequestDTO requestDTO) {

        PropertyDetailsResponseDTO updatedDto = propertyService.updateProperty(id, requestDTO);
        return ResponseEntity.ok(updatedDto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a property by ID")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }
}