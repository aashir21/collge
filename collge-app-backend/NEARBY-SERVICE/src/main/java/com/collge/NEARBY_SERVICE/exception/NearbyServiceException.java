package com.collge.NEARBY_SERVICE.exception;

public class NearbyServiceException extends RuntimeException{

    private static final long serialVersionUID = 1L;

    public NearbyServiceException(String message) {
        super(message);
    }

    public NearbyServiceException(String message, Throwable cause) {
        super(message, cause);
    }

}
