package com.matheus.rentify.app.leases.model;

public enum PaymentMethodEnum {
    BANK_SLIP("Bank slip"),
    PIX("PIX"),
    WIRE_TRANSFER("Wire transfer"),
    CREDIT_CARD("Credit card"),
    CASH("Cash"),
    OTHER("Other");

    private final String name;

    PaymentMethodEnum(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
