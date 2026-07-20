package com.axher.backend.shared.exception;

public class RoleNotFoundException extends RuntimeException{
    public RoleNotFoundException(String msg) {
        super(msg);
    }
}