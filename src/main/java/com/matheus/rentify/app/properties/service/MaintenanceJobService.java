package com.matheus.rentify.app.properties.service;

import com.matheus.rentify.app.properties.dto.request.MaintenanceJobRequestDTO;
import com.matheus.rentify.app.properties.dto.response.MaintenanceJobResponseDTO;
import com.matheus.rentify.app.properties.mapper.MaintenanceJobMapper;
import com.matheus.rentify.app.properties.model.MaintenanceJob;
import com.matheus.rentify.app.properties.repository.MaintenanceJobRepository;
import com.matheus.rentify.app.properties.repository.PropertyRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaintenanceJobService {

    private final MaintenanceJobRepository maintenanceJobRepository;
    private final PropertyRepository propertyRepository;
    private final MaintenanceJobMapper maintenanceJobMapper;

    @Autowired
    public MaintenanceJobService(MaintenanceJobRepository maintenanceJobRepository, PropertyRepository propertyRepository, MaintenanceJobMapper maintenanceJobMapper) {
        this.maintenanceJobRepository = maintenanceJobRepository;
        this.propertyRepository = propertyRepository;
        this.maintenanceJobMapper = maintenanceJobMapper;
    }

    @Transactional
    public MaintenanceJobResponseDTO createJob(MaintenanceJobRequestDTO requestDTO) {
        if (!propertyRepository.existsById(requestDTO.propertyId())) {
            throw new EntityNotFoundException("Property not found with id: " + requestDTO.propertyId());
        }

        MaintenanceJob job = maintenanceJobMapper.toEntity(requestDTO);
        MaintenanceJob savedJob = maintenanceJobRepository.save(job);
        return maintenanceJobMapper.toResponseDTO(savedJob);
    }

    @Transactional(readOnly = true)
    public MaintenanceJobResponseDTO getJobById(Long id) {
        MaintenanceJob job = findJobByIdOrThrow(id);
        return maintenanceJobMapper.toResponseDTO(job);
    }

    @Transactional(readOnly = true)
    public List<MaintenanceJobResponseDTO> getJobs(Long propertyId) {
        List<MaintenanceJob> jobs;

        if (propertyId != null) {
            if (!propertyRepository.existsById(propertyId)) {
                throw new EntityNotFoundException("Property not found with id: " + propertyId);
            }
            jobs = maintenanceJobRepository.findByPropertyIdOrderByRequestDateDesc(propertyId);
        } else {
            jobs = maintenanceJobRepository.findAll(Sort.by(Sort.Direction.DESC, "requestDate"));
        }

        return jobs.stream()
                .map(maintenanceJobMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MaintenanceJobResponseDTO updateJob(Long id, MaintenanceJobRequestDTO requestDTO) {
        MaintenanceJob existingJob = findJobByIdOrThrow(id);

        if (!propertyRepository.existsById(requestDTO.propertyId())) {
            throw new EntityNotFoundException("Property not found with id: " + requestDTO.propertyId());
        }

        maintenanceJobMapper.updateEntityFromDto(requestDTO, existingJob);
        MaintenanceJob updatedJob = maintenanceJobRepository.save(existingJob);
        return maintenanceJobMapper.toResponseDTO(updatedJob);
    }

    @Transactional
    public void deleteJob(Long id) {
        if (!maintenanceJobRepository.existsById(id)) {
            throw new EntityNotFoundException("MaintenanceJob not found with id: " + id);
        }
        maintenanceJobRepository.deleteById(id);
    }

    private MaintenanceJob findJobByIdOrThrow(Long id) {
        return maintenanceJobRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("MaintenanceJob not found with id: " + id));
    }
}