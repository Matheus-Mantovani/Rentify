package com.matheus.rentify.app.leases.service;

import com.matheus.rentify.app.leases.dto.request.LeaseGuarantorRequestDTO;
import com.matheus.rentify.app.leases.dto.response.LeaseGuarantorResponseDTO;
import com.matheus.rentify.app.leases.mapper.LeaseGuarantorMapper;
import com.matheus.rentify.app.leases.model.LeaseGuarantor;
import com.matheus.rentify.app.leases.repository.LeaseGuarantorRepository;
import com.matheus.rentify.app.leases.repository.LeaseRepository;
import com.matheus.rentify.app.people.repository.GuarantorRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public class LeaseGuarantorService {

    private final LeaseGuarantorRepository leaseGuarantorRepository;
    private final LeaseRepository leaseRepository;
    private final GuarantorRepository guarantorRepository;
    private final LeaseGuarantorMapper leaseGuarantorMapper;

    @Autowired
    public LeaseGuarantorService(LeaseGuarantorRepository leaseGuarantorRepository, LeaseRepository leaseRepository, GuarantorRepository guarantorRepository, LeaseGuarantorMapper leaseGuarantorMapper) {
        this.leaseGuarantorRepository = leaseGuarantorRepository;
        this.leaseRepository = leaseRepository;
        this.guarantorRepository = guarantorRepository;
        this.leaseGuarantorMapper = leaseGuarantorMapper;
    }

    @Transactional
    public LeaseGuarantorResponseDTO createLeaseGuarantor(LeaseGuarantorRequestDTO requestDTO) {
        System.out.println("=========================================11111111111");
        System.out.println(requestDTO.leaseGuarantorStatus());
        System.out.println("=========================================");

        if(!leaseRepository.existsById(requestDTO.leaseId())) {
            throw new IllegalArgumentException("Lease not found with id: " + requestDTO.leaseId());
        }
        if(!guarantorRepository.existsById(requestDTO.guarantorId())) {
            throw new IllegalArgumentException("Guarantor not found with id: " + requestDTO.guarantorId());
        }
        if(leaseGuarantorRepository.existsByLeaseIdAndGuarantorId(requestDTO.leaseId(), requestDTO.guarantorId())) {
            throw new IllegalStateException("Guarantor already linked with this lease");
        }


        LeaseGuarantor leaseGuarantor = leaseGuarantorMapper.toEntity(requestDTO);

        System.out.println("=========================================222222222");
        System.out.println(leaseGuarantor.getLeaseGuarantorStatus());
        System.out.println("=========================================");

        LeaseGuarantor savedLeaseGuarantor = leaseGuarantorRepository.save(leaseGuarantor);

        System.out.println("=========================================");
        System.out.println(savedLeaseGuarantor.getLeaseGuarantorStatus());
        System.out.println("=========================================");

        return leaseGuarantorMapper.toResponseDTO(savedLeaseGuarantor);
    }

    @Transactional(readOnly = true)
    public List<LeaseGuarantorResponseDTO> getGuarantorsByLeaseId(Long leaseId) {
        if(!leaseRepository.existsById(leaseId)) {
            throw new IllegalArgumentException("Lease not found with id: " + leaseId);
        }

        return leaseGuarantorRepository.findByLeaseId(leaseId)
                .stream()
                .map(leaseGuarantorMapper::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public LeaseGuarantorResponseDTO getLeaseGuarantorById(Long id) {
        LeaseGuarantor leaseGuarantor = findLeaseGuarantorByIdOrThrow(id);
        return leaseGuarantorMapper.toResponseDTO(leaseGuarantor);
    }

    @Transactional
    public LeaseGuarantorResponseDTO updateLeaseGuarantor(Long id, LeaseGuarantorRequestDTO requestDTO) {
        LeaseGuarantor existingLeaseGuarantor = findLeaseGuarantorByIdOrThrow(id);

        leaseGuarantorMapper.updateEntityFromDto(requestDTO, existingLeaseGuarantor);

        LeaseGuarantor updatedLeaserGuarantor = leaseGuarantorRepository.save(existingLeaseGuarantor);

        return leaseGuarantorMapper.toResponseDTO(updatedLeaserGuarantor);
    }

    @Transactional
    public void deleteLeaseGuarantor(Long id) {
        LeaseGuarantor leaseGuarantor = findLeaseGuarantorByIdOrThrow(id);

        leaseGuarantorRepository.delete(leaseGuarantor);
    }

    private LeaseGuarantor findLeaseGuarantorByIdOrThrow(Long id) {
        return leaseGuarantorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("LeaseGuarantor not found with id: " + id));
    }
}
