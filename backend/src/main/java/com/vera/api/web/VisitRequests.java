package com.vera.api.web;

/**
 * Request bodies for the visit mutations.
 *
 * Note what is NOT here: no caregiverId, and no timestamps. The server stamps
 * the clock because a time the caller could author is not evidence, and once
 * there is real authentication the actor comes from the principal. A mutation
 * that lets the client say who it is and when is the classic trust-the-client
 * hole, and it is easier to never add the field than to remember to ignore it.
 */
public final class VisitRequests {

    private VisitRequests() {
    }

    /**
     * The caller supplies the location because the device is the only authority
     * on where it is. It stays optional: location is metadata, never part of the
     * evidence check, so a refused permission still produces a billable visit.
     */
    public record CheckIn(Boolean available, Double latitude, Double longitude,
                          Double accuracy, String reason, String source) {
    }

    public record CheckOut(String assessment, String signature) {
    }

    public record Evidence(String assessment, String signature) {
    }
}
