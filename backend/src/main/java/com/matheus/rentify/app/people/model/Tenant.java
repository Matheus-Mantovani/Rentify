package com.matheus.rentify.app.people.model;

import com.matheus.rentify.app.shared.model.City;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "tenants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE tenants SET deleted_at = CURRENT_TIMESTAMP WHERE tenant_id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tenant_id", nullable = false)
    private Long id;

    @Column(name = "full_name", length = 255, nullable = false)
    private String fullName;

    @Column(name = "cpf", nullable = false, unique = true, columnDefinition = "CHAR(11)")
    private String cpf;

    @Column(name = "rg", length = 20)
    private String rg;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "profession", length = 100)
    private String profession;

    @Enumerated(EnumType.STRING)
    @Column(name = "marital_status")
    private MaritalStatusEnum maritalStatus;

    @Column(name = "city_of_birth", length = 50)
    private String cityOfBirth;

    @Column(name = "nationality", length = 50)
    private String nationality;

    @ManyToOne
    @JoinColumn(name = "city_fk")
    private City city;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}