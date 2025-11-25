package com.matheus.rentify.app.people.service;

import com.matheus.rentify.app.leases.repository.LeaseGuarantorRepository;
import com.matheus.rentify.app.people.dto.request.GuarantorRequestDTO;
import com.matheus.rentify.app.people.dto.response.GuarantorDetailsResponseDTO;
import com.matheus.rentify.app.people.dto.response.GuarantorResponseDTO;
import com.matheus.rentify.app.people.mapper.GuarantorMapper;
import com.matheus.rentify.app.people.model.Guarantor;
import com.matheus.rentify.app.people.repository.GuarantorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GuarantorService {

    private final GuarantorRepository guarantorRepository;
    private final LeaseGuarantorRepository leaseGuarantorRepository;
    private final GuarantorMapper guarantorMapper;

    @Autowired
    public GuarantorService(GuarantorRepository guarantorRepository, LeaseGuarantorRepository leaseGuarantorRepository, GuarantorMapper guarantorMapper) {
        this.guarantorRepository = guarantorRepository;
        this.leaseGuarantorRepository = leaseGuarantorRepository;
        this.guarantorMapper = guarantorMapper;
    }

    @Transactional
    public GuarantorDetailsResponseDTO createGuarantor(GuarantorRequestDTO requestDTO) {
        Guarantor guarantor = guarantorMapper.toEntity(requestDTO);
        Guarantor savedGuarantor = guarantorRepository.save(guarantor);

        return guarantorMapper.toDetailsResponseDto(savedGuarantor);
    }

    @Transactional(readOnly = true)
    public List<GuarantorResponseDTO> getAllGuarantors() {
        return guarantorRepository.findAll()
                .stream()
                .map(guarantorMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<GuarantorDetailsResponseDTO> getAllGuarantorsDetails() {
        return guarantorRepository.findAll()
                .stream()
                .map(guarantorMapper::toDetailsResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public GuarantorResponseDTO getGuarantorById(Long id) {
        Guarantor guarantor = findGuarantorByIdOrThrow(id);
        return guarantorMapper.toResponseDto(guarantor);
    }

    @Transactional(readOnly = true)
    public GuarantorDetailsResponseDTO getGuarantorDetailsById(Long id) {
        Guarantor guarantor = findGuarantorByIdOrThrow(id);
        return guarantorMapper.toDetailsResponseDto(guarantor);
    }

    @Transactional
    public GuarantorDetailsResponseDTO updateGuarantor(Long id, GuarantorRequestDTO requestDTO) {
        Guarantor existingGuarantor = findGuarantorByIdOrThrow(id);

        guarantorMapper.updateEntityFromDto(requestDTO, existingGuarantor);

        Guarantor updatedGuarantor = guarantorRepository.save(existingGuarantor);

        return guarantorMapper.toDetailsResponseDto(updatedGuarantor);
    }

    @Transactional
    public void deleteGuarantor(Long id) {
        Guarantor guarantor = findGuarantorByIdOrThrow(id);

        boolean hasActiveLeases = leaseGuarantorRepository.existsByGuarantorId(id);

        if(hasActiveLeases) {
            throw new IllegalStateException("Cannot delete guarantor with ID " + id + " because he/she has associated active leases");
        }

        guarantorRepository.delete(guarantor);
    }

    private Guarantor findGuarantorByIdOrThrow(Long id) {
        return guarantorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Guarantor not found with id: " + id));
    }
}
