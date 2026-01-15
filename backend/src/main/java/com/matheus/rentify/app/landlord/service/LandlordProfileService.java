package com.matheus.rentify.app.landlord.service;

import com.matheus.rentify.app.auth.model.User;
import com.matheus.rentify.app.landlord.dto.request.LandlordProfileRequestDTO;
import com.matheus.rentify.app.landlord.dto.response.LandlordProfileResponseDTO;
import com.matheus.rentify.app.landlord.mapper.LandlordProfileMapper;
import com.matheus.rentify.app.landlord.model.LandlordProfile;
import com.matheus.rentify.app.landlord.repository.LandlordProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LandlordProfileService {

    private final LandlordProfileRepository repository;
    private final LandlordProfileMapper mapper;

    @Autowired
    public LandlordProfileService(LandlordProfileRepository repository, LandlordProfileMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<LandlordProfileResponseDTO> getAllProfilesByUser(User user) {
        return repository.findAllByUser(user).stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LandlordProfileResponseDTO getProfileById(Long id, User user) {
        LandlordProfile profile = findProfileAndVerifyOwner(id, user);
        return mapper.toResponseDTO(profile);
    }

    @Transactional
    public LandlordProfileResponseDTO createProfile(LandlordProfileRequestDTO requestDTO, User user) {
        if (Boolean.TRUE.equals(requestDTO.isDefault())) {
            unsetPreviousDefault(user);
        }

        LandlordProfile profile = mapper.toEntity(requestDTO);
        profile.setUser(user);

        boolean hasProfiles = !repository.findAllByUser(user).isEmpty();
        if (!hasProfiles) {
            profile.setIsDefault(true);
        }

        LandlordProfile savedProfile = repository.save(profile);
        return mapper.toResponseDTO(savedProfile);
    }

    @Transactional
    public LandlordProfileResponseDTO updateProfile(Long id, LandlordProfileRequestDTO requestDTO, User user) {
        LandlordProfile existingProfile = findProfileAndVerifyOwner(id, user);

        if (Boolean.TRUE.equals(requestDTO.isDefault()) && !existingProfile.getIsDefault()) {
            unsetPreviousDefault(user);
        }

        mapper.updateEntityFromDto(requestDTO, existingProfile);

        LandlordProfile updatedProfile = repository.save(existingProfile);
        return mapper.toResponseDTO(updatedProfile);
    }

    @Transactional
    public void deleteProfile(Long id, User user) {
        LandlordProfile profile = findProfileAndVerifyOwner(id, user);
        repository.delete(profile);
    }


    private LandlordProfile findProfileAndVerifyOwner(Long id, User user) {
        LandlordProfile profile = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Landlord profile not found with ID: " + id));

        if (!profile.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to access this profile.");
        }
        return profile;
    }

    private void unsetPreviousDefault(User user) {
        repository.findByUserAndIsDefaultTrue(user).ifPresent(profile -> {
            profile.setIsDefault(false);
            repository.save(profile);
        });
    }
}