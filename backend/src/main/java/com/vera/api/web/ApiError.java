package com.vera.api.web;

/**
 * One error shape for every failure. The React app already renders err.message,
 * so the field is named to match what it reads.
 */
public record ApiError(int status, String message) {
}
