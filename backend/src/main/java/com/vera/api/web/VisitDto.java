package com.vera.api.web;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.vera.api.domain.CapturedLocation;
import com.vera.api.domain.ServiceType;
import com.vera.api.domain.Visit;
import com.vera.api.domain.VisitStatus;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * What a visit looks like on the wire.
 *
 * This is the contract the React app already consumes, field for field. Entities
 * are never returned directly: the entity holds relations, this holds the ids
 * AND the names beside them, so a list of visits needs no second request to say
 * who they are for. Denormalizing for the client and normalizing for the table
 * are both right, which is the whole reason the two shapes are separate.
 *
 * TIMESTAMPS ARE PINNED TO ONE FORMAT. Instant's default serialization drops
 * trailing zeros, so a whole second becomes "2026-09-02T18:00:00Z" while a
 * fractional one becomes "...:00.500Z". The browser sorts these lists with
 * localeCompare on the raw string, and "." sorts before "Z", so a mixed feed
 * would order the day wrong without failing anywhere. The explicit pattern
 * matches JavaScript's toISOString() exactly.
 */
public record VisitDto(
        Long id,
        Long patientId,
        String patientName,
        Long caregiverId,
        String caregiverName,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
        Instant appointmentTime,

        VisitStatus status,
        ServiceType serviceType,
        BigDecimal estimatedCost,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
        Instant checkInTime,

        LocationDto checkInLocation,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
        Instant checkOutTime,

        String assessment,
        String patientConcern,
        String signature,
        String claimId,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
        Instant submittedAt
) {

    /**
     * Location as the client reads it. An unavailable fix keeps its reason, so
     * review can tell a refused permission from a device that was never asked.
     */
    public record LocationDto(
            Boolean available,
            Double latitude,
            Double longitude,
            Double accuracy,
            String reason,
            String source
    ) {
        static LocationDto from(CapturedLocation location) {
            // Null stays null rather than becoming an empty object. The client
            // reads a missing location as "not captured", and an object whose
            // fields are all null would read as a capture that failed.
            if (location == null || location.getAvailable() == null) {
                return null;
            }

            return new LocationDto(
                    location.getAvailable(),
                    location.getLatitude(),
                    location.getLongitude(),
                    location.getAccuracy(),
                    location.getReason(),
                    location.getSource()
            );
        }
    }

    public static VisitDto from(Visit visit) {
        return new VisitDto(
                visit.getId(),
                visit.getPatient().getId(),
                visit.getPatient().getName(),
                visit.getCaregiver().getId(),
                visit.getCaregiver().getName(),
                visit.getAppointmentTime(),
                visit.getStatus(),
                visit.getServiceType(),
                visit.getEstimatedCost(),
                visit.getCheckInTime(),
                LocationDto.from(visit.getCheckInLocation()),
                visit.getCheckOutTime(),
                visit.getAssessment(),
                visit.getPatientConcern(),
                visit.getSignature(),
                visit.getClaimId(),
                visit.getSubmittedAt()
        );
    }
}
