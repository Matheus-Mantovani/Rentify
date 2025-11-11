package com.matheus.rentify.app.properties.mapper;

import com.matheus.rentify.app.properties.dto.request.PropertyRequestDTO;
import com.matheus.rentify.app.properties.dto.response.PropertyDetailsResponseDTO;
import com.matheus.rentify.app.properties.dto.response.PropertyResponseDTO;
import com.matheus.rentify.app.properties.model.Property;
import com.matheus.rentify.app.properties.model.PropertyStatusEnum;
import com.matheus.rentify.app.shared.model.City;
import com.matheus.rentify.app.shared.model.State;
import com.matheus.rentify.app.shared.repository.CityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PropertyMapperTest {

    @Mock
    private CityRepository cityRepository;

    private PropertyMapper propertyMapper = Mappers.getMapper(PropertyMapper.class);

    private City mockCity;
    private State mockState;

    @BeforeEach
    void initEntities() {
        mockState = new State(1L, "SP", "São Paulo");
        mockCity = new City(487L, "Araraquara", mockState);

        propertyMapper.cityRepository = this.cityRepository;
    }


    @Test
    void shouldMapPropertyRequestDTOToPropertyEntity() {
        PropertyRequestDTO dto = new PropertyRequestDTO(
                "Rua Teste, 123", null, "Centro", "14800000",
                mockCity.getId(), PropertyStatusEnum.AVAILABLE,
                BigDecimal.valueOf(200000),
                BigDecimal.valueOf(100),
                BigDecimal.valueOf(500),
                "Reg123", "Notes test"
        );

        when(cityRepository.findById(mockCity.getId())).thenReturn(Optional.of(mockCity));

        Property entity = propertyMapper.toEntity(dto);

        assertThat(entity).isNotNull();
        assertThat(entity.getId()).isNull();
        assertThat(entity.getAddress()).isEqualTo(dto.address());
        assertThat(entity.getNeighborhood()).isEqualTo(dto.neighborhood());
        assertThat(entity.getPostalCode()).isEqualTo(dto.postalCode());
        assertThat(entity.getStatus()).isEqualTo(dto.status());
        assertThat(entity.getCurrentMarketValue()).isEqualTo(dto.currentMarketValue());
        assertThat(entity.getCondoFee()).isEqualTo(dto.condoFee());
        assertThat(entity.getPropertyTaxValue()).isEqualTo(dto.propertyTaxValue());
        assertThat(entity.getRegistrationNumber()).isEqualTo(dto.registrationNumber());
        assertThat(entity.getNotes()).isEqualTo(dto.notes());
        assertThat(entity.getCity()).isNotNull();
        assertThat(entity.getCity().getId()).isEqualTo(mockCity.getId());
        assertThat(entity.getCity().getCityName()).isEqualTo(mockCity.getCityName());

        verify(cityRepository, times(1)).findById(mockCity.getId());
    }

    @Test
    void shouldMapPropertyEntityToPropertyResponseDTO() {
        Property entity = new Property();
        entity.setId(42L);
        entity.setAddress("Rua Teste, 123");
        entity.setNeighborhood("Centro");
        entity.setPostalCode("14800000");
        entity.setCity(mockCity);
        entity.setStatus(PropertyStatusEnum.RENTED);
        entity.setCondoFee(BigDecimal.valueOf(100));

        PropertyResponseDTO dto = propertyMapper.toResponseDTO(entity);

        assertThat(dto).isNotNull();
        assertThat(dto.id()).isEqualTo(entity.getId());
        assertThat(dto.address()).isEqualTo(entity.getAddress());
        assertThat(dto.neighborhood()).isEqualTo(entity.getNeighborhood());
        assertThat(dto.postalCode()).isEqualTo(entity.getPostalCode());
        assertThat(dto.cityName()).isEqualTo(mockCity.getCityName());
        assertThat(dto.stateCode()).isEqualTo(mockState.getStateCode());
        assertThat(dto.status()).isEqualTo(entity.getStatus());
        assertThat(dto.condoFee()).isEqualTo(entity.getCondoFee());
    }

    @Test
    void shouldMapPropertyEntityToPropertyDetailsResponseDTO() {
        Property entity = new Property();
        entity.setId(42L);
        entity.setAddress("Rua Teste, 123");
        entity.setAddressComplement("Apto 10");
        entity.setNeighborhood("Centro");
        entity.setPostalCode("14800000");
        entity.setCity(mockCity);
        entity.setStatus(PropertyStatusEnum.RENTED);
        entity.setCondoFee(BigDecimal.valueOf(100));
        entity.setPropertyTaxValue(BigDecimal.valueOf(500));
        entity.setRegistrationNumber("Reg123");
        entity.setNotes("Notes test");
        entity.setCurrentMarketValue(BigDecimal.valueOf(200000));

        PropertyDetailsResponseDTO dto = propertyMapper.toDetailsResponseDTO(entity);

        assertThat(dto).isNotNull();
        assertThat(dto.id()).isEqualTo(entity.getId());
        assertThat(dto.address()).isEqualTo(entity.getAddress());
        assertThat(dto.addressComplement()).isEqualTo(entity.getAddressComplement());
        assertThat(dto.neighborhood()).isEqualTo(entity.getNeighborhood());
        assertThat(dto.postalCode()).isEqualTo(entity.getPostalCode());
        assertThat(dto.cityName()).isEqualTo(mockCity.getCityName());
        assertThat(dto.stateCode()).isEqualTo(mockState.getStateCode());
        assertThat(dto.status()).isEqualTo(entity.getStatus());
        assertThat(dto.condoFee()).isEqualTo(entity.getCondoFee());
        assertThat(dto.propertyTaxValue()).isEqualTo(entity.getPropertyTaxValue());
        assertThat(dto.registrationNumber()).isEqualTo(entity.getRegistrationNumber());
        assertThat(dto.notes()).isEqualTo(entity.getNotes());
        assertThat(dto.currentMarketValue()).isEqualTo(entity.getCurrentMarketValue());
    }

    @Test
    void shouldUpdateExistingPropertyFromDto() {
        Property existingEntity = new Property();
        existingEntity.setId(55L);
        existingEntity.setAddress("Endereço Antigo");
        existingEntity.setCity(new City(111L, "Cidade Antiga", null));
        existingEntity.setNotes("Nota antiga");

        PropertyRequestDTO updateDto = new PropertyRequestDTO(
                "Novo Endereço", "Comp", "Novo Bairro", "12345678",
                mockCity.getId(),
                PropertyStatusEnum.UNDER_MAINTENANCE,
                BigDecimal.valueOf(210000),
                BigDecimal.valueOf(150),
                BigDecimal.valueOf(600),
                "RegNovo", "Nova Nota"
        );

        when(cityRepository.findById(mockCity.getId())).thenReturn(Optional.of(mockCity));

        propertyMapper.updateEntityFromDto(updateDto, existingEntity);

        assertThat(existingEntity.getId()).isEqualTo(55L);
        assertThat(existingEntity.getAddress()).isEqualTo(updateDto.address());
        assertThat(existingEntity.getAddressComplement()).isEqualTo(updateDto.addressComplement());
        assertThat(existingEntity.getNeighborhood()).isEqualTo(updateDto.neighborhood());
        assertThat(existingEntity.getPostalCode()).isEqualTo(updateDto.postalCode());
        assertThat(existingEntity.getStatus()).isEqualTo(updateDto.status());
        assertThat(existingEntity.getCondoFee()).isEqualTo(updateDto.condoFee());
        assertThat(existingEntity.getPropertyTaxValue()).isEqualTo(updateDto.propertyTaxValue());
        assertThat(existingEntity.getRegistrationNumber()).isEqualTo(updateDto.registrationNumber());
        assertThat(existingEntity.getNotes()).isEqualTo(updateDto.notes());
        assertThat(existingEntity.getCity()).isNotNull();
        assertThat(existingEntity.getCity().getId()).isEqualTo(mockCity.getId());

        verify(cityRepository, times(1)).findById(mockCity.getId());
    }

}