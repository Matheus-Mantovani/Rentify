package com.matheus.rentify.app.shared.service;

import com.matheus.rentify.app.shared.dto.response.CityResponseDTO;
import com.matheus.rentify.app.shared.dto.response.StateResponseDTO;
import com.matheus.rentify.app.shared.repository.CityRepository;
import com.matheus.rentify.app.shared.repository.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LocationService {

    private final StateRepository stateRepository;
    private final CityRepository cityRepository;

    @Autowired
    public LocationService(StateRepository stateRepository, CityRepository cityRepository) {
        this.stateRepository = stateRepository;
        this.cityRepository = cityRepository;
    }

    @Transactional(readOnly = true)
    public List<StateResponseDTO> getAllStates() {
        return stateRepository.findAll()
                .stream()
                .map(state -> new StateResponseDTO(state.getId(), state.getStateCode(), state.getStateName()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CityResponseDTO> getAllCitiesByState(Long stateId) {
        return cityRepository.findByStateId(stateId)
                .stream()
                .map(city -> new CityResponseDTO(city.getId(), city.getCityName(), city.getState().getStateCode()))
                .toList();
    }
}
