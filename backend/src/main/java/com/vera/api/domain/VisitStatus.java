package com.vera.api.domain;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * The visit's position in the pipeline, named for the event that produced it.
 * This is the Java side of src/utils/status.js, and the two must agree exactly:
 * the browser compares these strings.
 *
 * Two different names for the same value, on purpose. The enum CONSTANT is what
 * the database stores, via @Enumerated(EnumType.STRING) on the entity, because
 * a name is stable and readable in a query. The LABEL is what the API emits,
 * because the frontend's vocabulary has spaces in it and predates this class.
 *
 * Never persist an enum by ordinal. Reordering these constants would silently
 * rewrite the meaning of every row already stored.
 */
public enum VisitStatus {

    SCHEDULED("scheduled"),
    IN_PROGRESS("in progress"),
    NEEDS_REVIEW("needs review"),
    READY_TO_BILL("ready to bill"),
    BILLED("billed");

    private final String label;

    VisitStatus(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    /**
     * Parses the wire form back into the enum. Used for the ?status= query
     * parameter, which is untrusted input: an unknown value throws rather than
     * silently matching nothing, so a typo in a URL is a 400 and not an empty
     * list that looks like a real answer.
     */
    public static VisitStatus fromLabel(String label) {
        for (VisitStatus status : values()) {
            if (status.label.equals(label)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown visit status: " + label);
    }
}
