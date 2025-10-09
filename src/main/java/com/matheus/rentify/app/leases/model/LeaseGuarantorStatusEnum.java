package com.matheus.rentify.app.leases.model;

public enum LeaseGuarantorStatusEnum {
    PENDING("Pending"),
    ACTIVE("Active"),
    RELEASED("Released"),
    INACTIVE("Inactive");

    private final String name;

    LeaseGuarantorStatusEnum(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
