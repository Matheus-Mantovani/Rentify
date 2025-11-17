package com.matheus.rentify.app.history.model;

import com.matheus.rentify.app.properties.model.Property;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "property_value_history")
@Getter
@Setter
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
