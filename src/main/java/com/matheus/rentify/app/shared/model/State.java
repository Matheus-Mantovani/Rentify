package com.matheus.rentify.app.shared.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "states")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class State {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "state_id", nullable = false)
    private Long id;

    @Column(name = "state_code", length = 2, nullable = false, unique = true, columnDefinition = "CHAR")
    private String stateCode;

    @Column(name = "state_name", length = 50)
    private String stateName;
}
