package com.matheus.rentify.app.leases.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum GuaranteeTypeEnum {
    GUARANTOR_WITH_PROPERTY("Guarantor with property"),
    LEASE_INSURANCE("Lease insurance"),
    SECURITY_DEPOSIT("Security deposit"),
    CAPITALIZATION_BOND("Capitalization bond"),
    OTHER("Other");

    private final String name;

    GuaranteeTypeEnum(String name) {
        this.name = name;
    }

    @JsonValue
    public String getName() {
        return name;
    }
}
