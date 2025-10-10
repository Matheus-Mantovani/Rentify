package com.matheus.rentify.app.properties.model;

public enum MaintenanceStatusEnum {
    PENDING("Pending"),
    IN_PROGRESS("In progress"),
    COMPLETED("Completed"),
    CANCELED("Canceled");

    private final String name;

    MaintenanceStatusEnum(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
