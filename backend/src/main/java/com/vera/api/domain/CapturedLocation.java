package com.vera.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

/**
 * Where the device said it was at check-in. METADATA, never evidence: it can
 * never block billing, which is why nothing here is required.
 *
 * Embedded rather than its own table because a location has no identity of its
 * own and is never queried apart from its visit.
 *
 * `available` false with a `reason` is a real recorded outcome, not a failure
 * to record: a caregiver who refused the permission prompt still produced a
 * billable visit, and the record says which it was rather than inventing
 * coordinates.
 */
@Embeddable
public class CapturedLocation {

    @Column(name = "location_available")
    private Boolean available;

    @Column(name = "location_latitude")
    private Double latitude;

    @Column(name = "location_longitude")
    private Double longitude;

    @Column(name = "location_accuracy")
    private Double accuracy;

    /** "denied", "unavailable", "timeout", "unsupported". Null when available. */
    @Column(name = "location_reason")
    private String reason;

    /** "gps" or "mock". Which authority produced the fix. */
    @Column(name = "location_source")
    private String source;

    protected CapturedLocation() {
    }

    public CapturedLocation(Boolean available, Double latitude, Double longitude,
                            Double accuracy, String reason, String source) {
        this.available = available;
        this.latitude = latitude;
        this.longitude = longitude;
        this.accuracy = accuracy;
        this.reason = reason;
        this.source = source;
    }

    public Boolean getAvailable() {
        return available;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public Double getAccuracy() {
        return accuracy;
    }

    public String getReason() {
        return reason;
    }

    public String getSource() {
        return source;
    }
}
