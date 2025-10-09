package com.matheus.rentify.app.history.model;

import com.matheus.rentify.app.people.model.Tenant;
import com.matheus.rentify.app.properties.model.Property;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "leases_history")
@NoArgsConstructor
@AllArgsConstructor
public class LeaseHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id", nullable = false)
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

    @Column(name = "move_out_date")
    private LocalDate moveOutDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "move_out_condition")
    private MoveOutConditionEnum moveOutCondition;

    @Column(name = "move_out_reason", length = 100)
    private String moveOutReason;

    @Column(name = "archived_at", nullable = false)
    private LocalDateTime archievedAt;
}
