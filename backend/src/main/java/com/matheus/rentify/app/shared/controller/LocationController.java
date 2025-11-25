package com.matheus.rentify.app.shared.controller;

import com.matheus.rentify.app.shared.dto.response.CityResponseDTO;
import com.matheus.rentify.app.shared.dto.response.StateResponseDTO;
import com.matheus.rentify.app.shared.model.State;
import com.matheus.rentify.app.shared.service.LocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@Tag(name = "Locations", description = "Endpoints for retrieving states and cities")
public class LocationController {

    private final LocationService locationService;

    @Autowired
    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/states")
    @Operation(summary = "Get all states")
    public ResponseEntity<List<StateResponseDTO>> getAllState() {
        return ResponseEntity.ok(locationService.getAllStates());
    }

    @GetMapping("/cities")
    @Operation(summary = "Get cities for a specific state")
    public ResponseEntity<List<CityResponseDTO>> getAllCitiesByState(@RequestParam Long stateId) {
        return ResponseEntity.ok(locationService.getAllCitiesByState(stateId));
    }
}
