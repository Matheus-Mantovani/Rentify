package com.matheus.rentify.app.properties.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "maintenance_jobs")
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_fk", nullable = false)
    private Property property;

    @Column(name = "service_description", nullable = false, length = 255)
    private String serviceDescription;

    @Column(name = "request_date")
    private LocalDate requestDate;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    @Column(name = "total_cost", precision = 10, scale = 2)
    private BigDecimal totalCost;

    @Column(name = "service_provider", length = 100)
    private String serviceProvider;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MaintenanceStatus status;
}
