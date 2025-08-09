package com.collge.ADMIN_SERVICE.exception;

public class AdminServiceException extends RuntimeException{

    private static final long serialVersionUID = 1L;

    public AdminServiceException(String message) {
        super(message);
    }

    public AdminServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
