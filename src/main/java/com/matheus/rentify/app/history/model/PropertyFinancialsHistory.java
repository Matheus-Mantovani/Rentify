package com.matheus.rentify.app.history.model;

import com.matheus.rentify.app.properties.model.Property;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "property_financials_history")
@NoArgsConstructor
@AllArgsConstructor
public class PropertyFinancialsHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_fk", nullable = false)
    private Property property;

    @Column(name = "condo_fee", precision = 10, scale = 2)
    private BigDecimal condoFee;

    @Column(name = "property_tax_value", precision = 10, scale = 2)
    private BigDecimal propertyTaxValue;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;
}
