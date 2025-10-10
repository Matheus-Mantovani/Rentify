package com.matheus.rentify.app.people;

import com.matheus.rentify.app.people.model.Guarantor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GuarantorRepository extends JpaRepository<Guarantor, Long> {
}
