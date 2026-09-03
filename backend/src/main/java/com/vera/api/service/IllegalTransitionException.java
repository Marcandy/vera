package com.vera.api.service;

/**
 * A write the visit's current state does not allow: checking in something
 * already in progress, billing something that is not verified. Mapped to 409
 * Conflict, because the request was well formed and the state was wrong.
 */
public class IllegalTransitionException extends RuntimeException {

    public IllegalTransitionException(String message) {
        super(message);
    }
}
