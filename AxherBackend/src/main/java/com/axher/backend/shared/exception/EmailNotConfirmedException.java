package com.axher.backend.shared.exception;

public class EmailNotConfirmedException extends RuntimeException {
    private final String email;
    public EmailNotConfirmedException(String message, String email) {
        super(message);
        this.email = email;
    }
    public String getEmail() {
        return email;
    }
}

