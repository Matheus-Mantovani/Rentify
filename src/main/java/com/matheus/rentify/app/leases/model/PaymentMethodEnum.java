package com.matheus.rentify.app.leases.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum PaymentMethodEnum {
    BANK_SLIP,
    PIX,
    WIRE_TRANSFER,
    CREDIT_CARD,
    CASH,
    OTHER
}
