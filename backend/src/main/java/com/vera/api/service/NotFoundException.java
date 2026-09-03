package com.vera.api.service;

/**
 * A record that does not exist. Mapped to 404 in one place, by
 * ApiExceptionHandler, rather than by try/catch in every controller.
 */
public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }
}
