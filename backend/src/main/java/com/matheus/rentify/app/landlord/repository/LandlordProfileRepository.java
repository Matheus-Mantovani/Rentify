package com.matheus.rentify.app.landlord.repository;

import com.matheus.rentify.app.auth.model.User;
import com.matheus.rentify.app.landlord.model.LandlordProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LandlordProfileRepository extends JpaRepository<LandlordProfile, Long> {

    /**
     * Finds all landlord profiles associated with a specific user.
     *
     * @param user The authenticated user.
     * @return A list of profiles.
     */
    List<LandlordProfile> findAllByUser(User user);

    /**
     * Finds the default landlord profile for a specific user.
     * Used to pre-fill contract data.
     *
     * @param user The authenticated user.
     * @return The default profile, if set.
     */
    Optional<LandlordProfile> findByUserAndIsDefaultTrue(User user);
}