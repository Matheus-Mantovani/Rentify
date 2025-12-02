package com.matheus.rentify.app.shared.repository;

import com.matheus.rentify.app.shared.model.City;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    List<City> findByStateId(Long stateId);
    Optional<City> findByCityName(String cityName);
    @Query("SELECT c FROM City c WHERE lower(c.cityName) LIKE lower(concat(:name, '%')) AND (:stateId IS NULL OR c.state.id = :stateId)")
    List<City> searchCities(@Param("name") String name, @Param("stateId") Long stateId, Pageable pageable);
}
