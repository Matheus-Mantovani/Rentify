package com.matheus.rentify.app.people.service;

import com.matheus.rentify.app.leases.model.Lease;
import com.matheus.rentify.app.leases.model.LeaseStatusEnum;
import com.matheus.rentify.app.leases.repository.LeaseRepository;
import com.matheus.rentify.app.people.dto.request.TenantRequestDTO;
import com.matheus.rentify.app.people.dto.response.TenantDetailsResponseDTO;
import com.matheus.rentify.app.people.dto.response.TenantResponseDTO;
import com.matheus.rentify.app.people.mapper.TenantMapper;
import com.matheus.rentify.app.people.model.Tenant;
import com.matheus.rentify.app.people.repository.TenantRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TenantService {

    private final TenantRepository tenantRepository;
    private final LeaseRepository leaseRepository;
    private final TenantMapper tenantMapper;

    @Autowired
    public TenantService(TenantRepository tenantRepository, LeaseRepository leaseRepository, TenantMapper tenantMapper) {
        this.tenantRepository = tenantRepository;
        this.leaseRepository = leaseRepository;
        this.tenantMapper = tenantMapper;
    }

    @Transactional
    public TenantDetailsResponseDTO createTenant(TenantRequestDTO requestDTO) {
        String rawCpf = requestDTO.cpf().replaceAll("\\D", "");

        Optional<Tenant> existingTenantOpt = tenantRepository.findByCpfIncludingDeleted(rawCpf);

        if (existingTenantOpt.isPresent()) {
            Tenant existingTenant = existingTenantOpt.get();

            if (existingTenant.getDeletedAt() == null) {
                throw new IllegalStateException("Tenant with CPF " + rawCpf + " already exists.");
            }

            existingTenant.setDeletedAt(null);

            tenantMapper.updateEntityFromDto(requestDTO, existingTenant);

            existingTenant.setCpf(rawCpf);

            Tenant reactivatedTenant = tenantRepository.save(existingTenant);
            return tenantMapper.toDetailsResponseDTO(reactivatedTenant);
        }

        Tenant tenant = tenantMapper.toEntity(requestDTO);
        tenant.setCpf(rawCpf);

        Tenant savedTenant = tenantRepository.save(tenant);
        return tenantMapper.toDetailsResponseDTO(savedTenant);
    }

    @Transactional(readOnly = true)
    public List<TenantResponseDTO> getAllTenants() {
        return tenantRepository.findAll()
                .stream()
                .map(tenantMapper::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TenantDetailsResponseDTO> getAllTenantsDetails() {
        return tenantRepository.findAll()
                .stream()
                .map(tenantMapper::toDetailsResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public TenantResponseDTO getTenantById(Long id) {
        Tenant tenant = findTenantByIdOrThrow(id);
        return tenantMapper.toResponseDTO(tenant);
    }

    @Transactional(readOnly = true)
    public TenantDetailsResponseDTO getTenantDetailsById(Long id) {
        Tenant tenant = findTenantByIdOrThrow(id);
        return tenantMapper.toDetailsResponseDTO(tenant);
    }

    @Transactional
    public TenantDetailsResponseDTO updateTenant(Long id, TenantRequestDTO requestDTO) {
        Tenant existingTenant = findTenantByIdOrThrow(id);

        tenantMapper.updateEntityFromDto(requestDTO, existingTenant);

        Tenant updatedTenant = tenantRepository.save(existingTenant);

        return tenantMapper.toDetailsResponseDTO(updatedTenant);
    }

    @Transactional
    public void deleteTenant(Long id) {
        Tenant tenant = findTenantByIdOrThrow(id);
        List<Lease> activeLeases = findByTenantIdAndStatusOrThrow(id, LeaseStatusEnum.ACTIVE);

        if (!activeLeases.isEmpty()) {
            throw new IllegalStateException("Cannot delete tenant with ID " + id + " because they have active leases. Terminate the leases first.");
        }

        tenantRepository.delete(tenant);
    }

    private Tenant findTenantByIdOrThrow(Long id) {
        return tenantRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found with id: " + id));
    }

    private List<Lease> findByTenantIdAndStatusOrThrow(Long id, LeaseStatusEnum status) {
        return leaseRepository.findByTenantIdAndStatus(id, status);
    }
}