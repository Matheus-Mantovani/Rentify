package com.matheus.rentify.app.history.model;

public enum MoveOutConditionEnum {
    EXCELLENT("Excellent"),
    GOOD("Good"),
    FAIR("Fair"),
    NEEDS_REPAIRS("Need repairs");

    private final String name;

    MoveOutConditionEnum(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
