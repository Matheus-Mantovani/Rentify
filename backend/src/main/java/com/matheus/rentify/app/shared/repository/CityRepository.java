package com.matheus.rentify.app.shared.repository;

import com.matheus.rentify.app.shared.model.City;
import com.matheus.rentify.app.shared.model.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    Optional<City> findByCityNameAndState(String cityName, State state);
    List<City> findByStateId(Long stateId);
}
