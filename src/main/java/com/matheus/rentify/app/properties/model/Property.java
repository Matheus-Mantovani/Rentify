package com.matheus.rentify.app.properties.model;

import com.matheus.rentify.app.shared.model.City;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "properties")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "property_id", nullable = false)
    private Long id;

    @Column(name = "address", length = 255, nullable = false)
    private String address;

    @Column(name = "address_complement", length = 100)
    private String addressComplement;

    @Column(name = "neighborhood", length = 100)
    private String neighborhood;

    @Column(name = "postal_code", length = 8, nullable = false, columnDefinition = "CHAR")
    private String postalCode;

    @ManyToOne
    @JoinColumn(name = "city_fk")
    private City city;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PropertyStatusEnum status;

    @Column(name = "current_market_value", precision = 10, scale = 2)
    private BigDecimal currentMarketValue;

    @Column(name = "condo_fee", precision = 10, scale = 2)
    private BigDecimal condoFee;

    @Column(name = "property_tax_value", precision = 10, scale = 2)
    private BigDecimal propertyTaxValue;

    @Column(name = "registration_number", length = 50)
    private String registrationNumber;

    @Lob
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;


}