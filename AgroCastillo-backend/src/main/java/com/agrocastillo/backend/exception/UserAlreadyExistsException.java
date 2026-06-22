package com.agrocastillo.backend.exception;

public class UserAlreadyExistsException extends RuntimeException {
    
    public UserAlreadyExistsException(String mensaje) {
        super(mensaje);
    }
    
    public UserAlreadyExistsException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}
