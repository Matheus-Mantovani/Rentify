package com.matheus.rentify.app.properties.model;

public enum PropertyStatusEnum {
    AVAILABLE("Available"),
    RENTED("Rented"),
    UNDER_MAINTENCE("Under maintence"),
    INACTIVE("Inactive");

    private final String name;

    PropertyStatusEnum(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
