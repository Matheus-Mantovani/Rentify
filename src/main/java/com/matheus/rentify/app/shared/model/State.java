package com.matheus.rentify.app.shared.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "states")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class State {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "state_id", nullable = false)
    private Long id;

    @Column(name = "state_code", nullable = false, unique = true, columnDefinition = "CHAR(2)")
    private String stateCode;

    @Column(name = "state_name", length = 50)
    private String stateName;
}
