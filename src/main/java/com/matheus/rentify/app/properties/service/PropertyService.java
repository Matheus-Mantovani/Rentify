package com.matheus.rentify.app.properties.service;

import com.matheus.rentify.app.properties.dto.request.PropertyRequestDTO;
import com.matheus.rentify.app.properties.dto.response.PropertyDetailsResponseDTO;
import com.matheus.rentify.app.properties.dto.response.PropertyResponseDTO;

import java.util.List;

public interface PropertyService {

    PropertyDetailsResponseDTO createProperty(PropertyRequestDTO requestDTO);

    List<PropertyResponseDTO> getAllProperties();

    List<PropertyDetailsResponseDTO> getAllPropertiesDetails();

    PropertyResponseDTO getPropertyById(Long id);

    PropertyDetailsResponseDTO getPropertyDetailsById(Long id);

    PropertyDetailsResponseDTO updateProperty(Long id, PropertyRequestDTO propertyRequestDTO);

    void deleteProperty(Long id);
}
