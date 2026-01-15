package com.matheus.rentify.app.landlord.model;

import com.matheus.rentify.app.auth.model.User;
import com.matheus.rentify.app.people.model.MaritalStatusEnum;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "landlord_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE landlord_profiles SET deleted_at = CURRENT_TIMESTAMP WHERE profile_id = ?")
@SQLRestriction("deleted_at IS NULL")
public class LandlordProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_fk", nullable = false)
    private User user;

    @Column(name = "profile_alias", length = 50, nullable = false)
    private String profileAlias;

    @Column(name = "is_default")
    private Boolean isDefault = false;

    @Column(name = "full_name", length = 255, nullable = false)
    private String fullName;

    @Column(name = "nationality", length = 50, nullable = false)
    private String nationality;

    @Enumerated(EnumType.STRING)
    @Column(name = "marital_status", nullable = false)
    private MaritalStatusEnum maritalStatus;

    @Column(name = "profession", length = 100, nullable = false)
    private String profession;

    @Column(name = "rg", length = 20, nullable = false)
    private String rg;

    @Column(name = "cpf_cnpj", length = 20, nullable = false)
    private String cpfCnpj;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "full_address", length = 255, nullable = false)
    private String fullAddress;

    @Column(name = "pix_key", length = 100)
    private String pixKey;

    @Column(name = "bank_details", columnDefinition = "TEXT")
    private String bankDetails;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}