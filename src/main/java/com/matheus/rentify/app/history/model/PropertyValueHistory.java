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
@Table(name = "property_value_history")
@NoArgsConstructor
@AllArgsConstructor
public class PropertyValueHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_fk", nullable = false)
    private Property property;

    @Column(name = "property_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal propertyValue;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;
}
