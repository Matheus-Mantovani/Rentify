package com.matheus.rentify.app.properties.service;

import com.matheus.rentify.app.history.repository.PropertyFinancialsHistoryRepository;
import com.matheus.rentify.app.history.repository.PropertyValueHistoryRepository;
import com.matheus.rentify.app.leases.model.Lease;
import com.matheus.rentify.app.leases.repository.LeaseRepository;
import com.matheus.rentify.app.people.model.Tenant;
import com.matheus.rentify.app.people.repository.TenantRepository;
import com.matheus.rentify.app.properties.dto.request.PropertyRequestDTO;
import com.matheus.rentify.app.properties.dto.response.PropertyDetailsResponseDTO;
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
class PropertyServiceTest {

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private PropertyRepository propertyRepository;
    @Autowired
    private TenantRepository tenantRepository;
    @Autowired
    private LeaseRepository leaseRepository;
    @Autowired
    private CityRepository cityRepository;
    @Autowired
    private StateRepository stateRepository;
    @Autowired
    private PropertyValueHistoryRepository valueHistoryRepository;
    @Autowired
    private PropertyFinancialsHistoryRepository financialsHistoryRepository;

    private City testCity;
    private Tenant testTenant;

    @BeforeEach
    void setUp() {
        State testState = new State();
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

        Property testProperty = new Property();
        testProperty.setAddress("123 Test St");
        testProperty.setNeighborhood("Test Neighborhood");
        testProperty.setPostalCode("12345678");
        testProperty.setCity(testCity);
        testProperty.setStatus(PropertyStatusEnum.AVAILABLE);
        propertyRepository.save(testProperty);
    }

    @Test
    void createProperty_shouldSavePropertyAndInitialHistory() {
        PropertyRequestDTO requestDTO = new PropertyRequestDTO(
                "123 Test St", null, "Centro", "14800000", testCity.getId(),
                PropertyStatusEnum.AVAILABLE, new BigDecimal("250000.00"),
                new BigDecimal("300.00"), new BigDecimal("120.00"),
                "Reg123", "Notes test"
        );

        PropertyDetailsResponseDTO response = propertyService.createProperty(requestDTO);

        assertThat(response.id()).isNotNull();
        assertThat(response.address()).isEqualTo("123 Test St");
        assertThat(response.currentMarketValue()).isEqualByComparingTo("250000.00");
        assertThat(response.condoFee()).isEqualByComparingTo("300.00");

        assertThat(propertyRepository.count()).isEqualTo(1);
        assertThat(valueHistoryRepository.count()).isEqualTo(1);
        assertThat(financialsHistoryRepository.count()).isEqualTo(1);
        assertThat(valueHistoryRepository.findAll().get(0).getPropertyValue()).isEqualByComparingTo("250000.00");
    }

    @Test
    void updateProperty_shouldCreateHistory_whenFinancialsChange() {
        Property property = createInitialProperty();
        long propertyId = property.getId();

        PropertyRequestDTO requestDTO = new PropertyRequestDTO(
                "456 New St", null, "Centro", "14800000", testCity.getId(),
                PropertyStatusEnum.AVAILABLE, new BigDecimal("300000.00"),
                new BigDecimal("350.00"),
                new BigDecimal("130.00"),
                "Reg123", "Notes test"
        );

        assertThat(valueHistoryRepository.count()).isEqualTo(0);
        assertThat(financialsHistoryRepository.count()).isEqualTo(0);

        propertyService.updateProperty(propertyId, requestDTO);

        Property updatedProperty = propertyRepository.findById(propertyId).get();
        assertThat(updatedProperty.getAddress()).isEqualTo("456 New St");
        assertThat(updatedProperty.getCurrentMarketValue()).isEqualByComparingTo("300000.00");

        assertThat(valueHistoryRepository.count()).isEqualTo(1);
        assertThat(financialsHistoryRepository.count()).isEqualTo(1);
        assertThat(financialsHistoryRepository.findAll().get(0).getCondoFee()).isEqualByComparingTo("350.00");
    }

    @Test
    void updateProperty_shouldNotCreateHistory_whenFinancialsAreTheSame() {
        Property property = createInitialProperty(new BigDecimal("250000.00"), new BigDecimal("300.00"));
        long propertyId = property.getId();

        PropertyRequestDTO requestDTO = new PropertyRequestDTO(
                "Updated Address", null, "New Neighborhood", "14800000", testCity.getId(),
                PropertyStatusEnum.AVAILABLE, new BigDecimal("250000.00"),
                new BigDecimal("300.00"),
                null,
                "Reg123", "Notes test"
        );

        assertThat(valueHistoryRepository.count()).isEqualTo(0);
        assertThat(financialsHistoryRepository.count()).isEqualTo(0);

        propertyService.updateProperty(propertyId, requestDTO);

        Property updatedProperty = propertyRepository.findById(propertyId).get();
        assertThat(updatedProperty.getAddress()).isEqualTo("Updated Address");
        assertThat(updatedProperty.getNeighborhood()).isEqualTo("New Neighborhood");

        assertThat(valueHistoryRepository.count()).isEqualTo(0);
        assertThat(financialsHistoryRepository.count()).isEqualTo(0);
    }

    @Test
    void deleteProperty_shouldFail_whenPropertyHasActiveLease() {
        Property property = createInitialProperty();

        Lease activeLease = new Lease();
        activeLease.setProperty(property);
        activeLease.setTenant(testTenant);
        activeLease.setStartDate(LocalDate.now());
        activeLease.setEndDate(LocalDate.now().plusYears(1));
        activeLease.setPaymentDueDay(1);
        leaseRepository.save(activeLease);

        property.setStatus(PropertyStatusEnum.RENTED);
        propertyRepository.save(property);

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            propertyService.deleteProperty(property.getId());
        });

        assertThat(exception.getMessage()).contains("because it has associated active leases");
        assertThat(propertyRepository.findById(property.getId())).isPresent();
    }

    @Test
    void deleteProperty_shouldSucceed_whenPropertyHasNoLeases() {
        Property property = createInitialProperty();
        long propertyId = property.getId();

        assertThat(leaseRepository.count()).isEqualTo(0);

        propertyService.deleteProperty(propertyId);

        assertThat(propertyRepository.findById(propertyId)).isEmpty();
        assertThat(propertyRepository.count()).isEqualTo(0);
    }


    private Property createInitialProperty() {
        return createInitialProperty(null, null);
    }

    private Property createInitialProperty(BigDecimal marketValue, BigDecimal condoFee) {
        Property p = new Property();
        p.setAddress("789 Old St");
        p.setNeighborhood("Old Village");
        p.setPostalCode("14801000");
        p.setCity(testCity);
        p.setStatus(PropertyStatusEnum.AVAILABLE);
        p.setCurrentMarketValue(marketValue);
        p.setCondoFee(condoFee);
        return propertyRepository.save(p);
    }
}