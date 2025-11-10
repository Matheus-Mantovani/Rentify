package com.matheus.rentify.app.people.model;

import com.matheus.rentify.app.shared.model.City;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tenants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tenant_id", nullable = false)
    private Long id;

    @Column(name = "full_name", length = 255, nullable = false)
    private String fullName;

    @Column(name = "cpf", length = 11, nullable = false, unique = true, columnDefinition = "CHAR")
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
}
