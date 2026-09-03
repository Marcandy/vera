package com.vera.api.web;

import com.vera.api.service.IllegalTransitionException;
import com.vera.api.service.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * The service's guards become HTTP status codes here, in ONE place, rather than
 * as try/catch in every controller method.
 *
 * The mapping the mock already implies:
 *   a record that is not there            -> 404
 *   an illegal status transition          -> 409, when the writes are ported
 *   input the domain refuses              -> 400
 */
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiError> notFound(NotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiError(404, ex.getMessage()));
    }

    /**
     * The request was fine and the state was wrong: checking in a visit already
     * in progress, billing one that is not verified. 409, not 400, and not 422.
     */
    @ExceptionHandler(IllegalTransitionException.class)
    public ResponseEntity<ApiError> conflict(IllegalTransitionException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ApiError(409, ex.getMessage()));
    }

    /** An unparseable status label or id. The request was wrong, not the server. */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> badRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiError(400, ex.getMessage()));
    }
}
