package com.matheus.rentify.app.leases.model;

import com.matheus.rentify.app.people.model.Tenant;
import com.matheus.rentify.app.properties.model.Property;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "leases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Lease {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lease_id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_fk")
    private Property property;

    @ManyToOne
    @JoinColumn(name = "tenant_fk")
    private Tenant tenant;

    @Column(name = "landlord_name", length = 100)
    private String landlordName;

    @Column(name = "payment_due_day")
    private int paymentDueDay;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "base_rent_value", precision = 10, scale = 2)
    private BigDecimal baseRentValue;

    @Column(name = "rent_value_in_words", length = 255)
    private String rentValueInWords;

    @Column(name = "security_deposit_value", precision = 10, scale = 2)
    private BigDecimal securityDepositValue;

    @Column(name = "deposit_value_in_words", length = 255)
    private String depositValueInWords;

    @Column(name = "painting_fee_value", precision = 10, scale = 2)
    private BigDecimal paintingFeeValue;

    @Column(name = "painting_fee_in_words", length = 255)
    private String paintingFeeInWords;
}
