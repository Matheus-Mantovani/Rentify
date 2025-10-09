package com.matheus.rentify.app.people.model;

public enum MaritalStatusEnum {
    SINGLE("Single"),
    MARRIED("Married"),
    DIVORCED("Divorced"),
    WIDOWED("Widowed"),
    STABLE_UNION("Stable union");

    private final String name;

    MaritalStatusEnum(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
