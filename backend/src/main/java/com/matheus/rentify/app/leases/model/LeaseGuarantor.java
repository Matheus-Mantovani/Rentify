package com.matheus.rentify.app.leases.model;

import com.matheus.rentify.app.people.model.Guarantor;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "lease_guarantors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaseGuarantor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lease_guarantor_id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lease_fk", nullable = false)
    private Lease lease;

    @ManyToOne
    @JoinColumn(name = "guarantor_fk", nullable = false)
    private Guarantor guarantor;

    @Column(name = "signature_date")
    private LocalDate signatureDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "lease_guarantor_status", nullable = false)
    private LeaseGuarantorStatusEnum leaseGuarantorStatus;

    @Column(name = "guarantee_value", precision = 10, scale = 2)
    private BigDecimal guaranteeValue;

    @Column(name = "guarantor_property_registration")
    private String guarantorPropertyRegistration;

    @Lob
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
