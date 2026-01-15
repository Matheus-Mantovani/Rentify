package com.matheus.rentify.app.landlord.controller;

import com.matheus.rentify.app.auth.model.User;
import com.matheus.rentify.app.auth.repository.UserRepository;
import com.matheus.rentify.app.landlord.dto.request.LandlordProfileRequestDTO;
import com.matheus.rentify.app.landlord.dto.response.LandlordProfileResponseDTO;
import com.matheus.rentify.app.landlord.service.LandlordProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/landlord-profiles")
@Tag(name = "Landlord Profiles", description = "Endpoints for managing landlord profiles (User-specific)")
public class LandlordProfileController {

    private final LandlordProfileService service;
    private final UserRepository userRepository;

    @Autowired
    public LandlordProfileController(LandlordProfileService service, UserRepository userRepository) {
        this.service = service;
        this.userRepository = userRepository;
    }

    @PostMapping
    @Operation(summary = "Create a new landlord profile")
    public ResponseEntity<LandlordProfileResponseDTO> createProfile(
            @Valid @RequestBody LandlordProfileRequestDTO requestDTO,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);
        LandlordProfileResponseDTO createdDto = service.createProfile(requestDTO, user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdDto.id())
                .toUri();

        return ResponseEntity.created(location).body(createdDto);
    }

    @GetMapping
    @Operation(summary = "Get all profiles for the authenticated user")
    public ResponseEntity<List<LandlordProfileResponseDTO>> getAllMyProfiles(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<LandlordProfileResponseDTO> profiles = service.getAllProfilesByUser(user);
        return ResponseEntity.ok(profiles);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single profile by ID")
    public ResponseEntity<LandlordProfileResponseDTO> getProfileById(
            @PathVariable Long id,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);
        LandlordProfileResponseDTO profile = service.getProfileById(id, user);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing profile")
    public ResponseEntity<LandlordProfileResponseDTO> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody LandlordProfileRequestDTO requestDTO,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);
        LandlordProfileResponseDTO updatedDto = service.updateProfile(id, requestDTO, user);
        return ResponseEntity.ok(updatedDto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete (Soft Delete) a profile by ID")
    public ResponseEntity<Void> deleteProfile(
            @PathVariable Long id,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);
        service.deleteProfile(id, user);
        return ResponseEntity.noContent().build();
    }

    private User getAuthenticatedUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Authenticated user not found in database: " + username));
    }
}