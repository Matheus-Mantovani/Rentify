package com.matheus.rentify.app.leases.service;

import com.matheus.rentify.app.leases.dto.request.LeaseRequestDTO;
import com.matheus.rentify.app.leases.dto.request.LeaseTerminationRequestDTO;
import com.matheus.rentify.app.leases.dto.response.LeaseResponseDTO;
import com.matheus.rentify.app.leases.model.Lease;
import com.matheus.rentify.app.leases.model.LeaseStatusEnum;
import com.matheus.rentify.app.leases.model.MoveOutConditionEnum;
import com.matheus.rentify.app.leases.repository.LeaseRepository;
import com.matheus.rentify.app.people.model.Tenant;
import com.matheus.rentify.app.people.repository.TenantRepository;
import com.matheus.rentify.app.properties.model.Property;
import com.matheus.rentify.app.properties.model.PropertyStatusEnum;
import com.matheus.rentify.app.properties.repository.PropertyRepository;
import com.matheus.rentify.app.shared.model.City;
import com.matheus.rentify.app.shared.model.State;
import com.matheus.rentify.app.shared.repository.CityRepository;
import com.matheus.rentify.app.shared.repository.StateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
class LeaseServiceTest {

    @Autowired
    private LeaseService leaseService;

    @Autowired
    private LeaseRepository leaseRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private StateRepository stateRepository;

    private Property testProperty;
    private Tenant testTenant;
    private City testCity;
    private State testState;

    @BeforeEach
    void setUp() {
        leaseRepository.deleteAll();
        propertyRepository.deleteAll();
        tenantRepository.deleteAll();

        testState = new State();
        testState.setStateCode("SP");
        testState.setStateName("São Paulo");
        stateRepository.save(testState);

        testCity = new City();
        testCity.setCityName("Araraquara");
        testCity.setState(testState);
        cityRepository.save(testCity);

        testTenant = new Tenant();
        testTenant.setFullName("Test Tenant");
        testTenant.setCpf("12345678901");
        testTenant.setCity(testCity);
        tenantRepository.save(testTenant);

        testProperty = new Property();
        testProperty.setAddress("123 Test St");
        testProperty.setNeighborhood("Test Neighborhood");
        testProperty.setPostalCode("12345678");
        testProperty.setCity(testCity);
        testProperty.setStatus(PropertyStatusEnum.AVAILABLE);
        propertyRepository.save(testProperty);
    }

    @Test
    void createLease_ShouldChangePropertyStatusToRented_WhenPropertyIsAvailable() {
        LeaseRequestDTO requestDTO = new LeaseRequestDTO(
                testProperty.getId(), testTenant.getId(), "Test Landlord",
                10, LocalDate.now().plusDays(1), LocalDate.now().plusYears(1),
                new BigDecimal("1500.00"), null, null
        );

        LeaseResponseDTO createdDto = leaseService.createLease(requestDTO);

        assertThat(createdDto.id()).isNotNull();
        assertThat(createdDto.status()).isEqualTo(LeaseStatusEnum.ACTIVE);

        assertThat(leaseRepository.findById(createdDto.id())).isPresent();

        Property updatedProperty = propertyRepository.findById(testProperty.getId()).get();
        assertThat(updatedProperty.getStatus()).isEqualTo(PropertyStatusEnum.RENTED);
    }

    @Test
    void createLease_ShouldThrowException_WhenPropertyIsNotAvailable() {
        testProperty.setStatus(PropertyStatusEnum.RENTED);
        propertyRepository.save(testProperty);

        LeaseRequestDTO requestDTO = new LeaseRequestDTO(
                testProperty.getId(), testTenant.getId(), "Test Landlord",
                10, LocalDate.now().plusDays(1), LocalDate.now().plusYears(1),
                new BigDecimal("1500.00"), null, null
        );

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            leaseService.createLease(requestDTO);
        });

        assertThat(exception.getMessage()).contains("is not available. Current status: RENTED");
    }

    @Test
    void terminateAndArchiveLease_ShouldUpdateLeaseStatusToTerminated_andSetPropertyAvailable() {
        Lease lease = new Lease();
        lease.setProperty(testProperty);
        lease.setTenant(testTenant);
        lease.setPaymentDueDay(10);
        Lease activeLease = leaseRepository.save(lease);

        testProperty.setStatus(PropertyStatusEnum.RENTED);
        propertyRepository.save(testProperty);

        LeaseTerminationRequestDTO terminationDTO = new LeaseTerminationRequestDTO(
                LocalDate.now(),
                MoveOutConditionEnum.GOOD,
                "End of contract"
        );

        leaseService.terminateAndArchiveLease(activeLease.getId(), terminationDTO);

        Lease terminatedLease = leaseRepository.findById(activeLease.getId()).orElseThrow();

        assertThat(terminatedLease.getStatus()).isEqualTo(LeaseStatusEnum.TERMINATED);
        assertThat(terminatedLease.getMoveOutReason()).isEqualTo("End of contract");
        assertThat(terminatedLease.getMoveOutCondition()).isEqualTo(MoveOutConditionEnum.GOOD);
        assertThat(terminatedLease.getMoveOutDate()).isEqualTo(LocalDate.now());

        Property updatedProperty = propertyRepository.findById(testProperty.getId()).get();
        assertThat(updatedProperty.getStatus()).isEqualTo(PropertyStatusEnum.AVAILABLE);
    }

    @Test
    void terminateAndArchiveLease_ShouldSetPropertyToUnderMaintenance_WhenNeedsRepairs() {
        Lease lease = new Lease();
        lease.setProperty(testProperty);
        lease.setTenant(testTenant);
        lease.setPaymentDueDay(10);
        Lease activeLease = leaseRepository.save(lease);

        testProperty.setStatus(PropertyStatusEnum.RENTED);
        propertyRepository.save(testProperty);

        LeaseTerminationRequestDTO terminationDTO = new LeaseTerminationRequestDTO(
                LocalDate.now(),
                MoveOutConditionEnum.NEEDS_REPAIRS,
                "Tenant damaged plumbing"
        );

        leaseService.terminateAndArchiveLease(activeLease.getId(), terminationDTO);

        Lease terminatedLease = leaseRepository.findById(activeLease.getId()).orElseThrow();
        assertThat(terminatedLease.getStatus()).isEqualTo(LeaseStatusEnum.TERMINATED);

        Property updatedProperty = propertyRepository.findById(testProperty.getId()).get();
        assertThat(updatedProperty.getStatus()).isEqualTo(PropertyStatusEnum.UNDER_MAINTENANCE);
    }
}
