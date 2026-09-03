package com.vera.api.domain;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * What care was delivered. The Java side of src/utils/serviceType.js, and the
 * sixth EVV data element: the one the visit record used to be missing entirely.
 *
 * Same split as VisitStatus. The constant is persisted, the label goes on the
 * wire.
 */
public enum ServiceType {

    PERSONAL_CARE("personal care"),
    HOMEMAKER("homemaker"),
    COMPANION_CARE("companion care"),
    RESPITE_CARE("respite care");

    private final String label;

    ServiceType(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }
}
