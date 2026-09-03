package com.vera.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * A visit: the record that turns delivered care into a billable claim.
 *
 * THE ENTITY HOLDS RELATIONS, NOT NAMES. The mock carried caregiverName and
 * patientName denormalized beside the ids, which is right for something that
 * gets sent to a browser and wrong for a row in a table: the name would then
 * live in two places and they would eventually disagree. VisitDto puts the
 * names back for the client. Entity in, DTO out.
 *
 * Both relations are LAZY. @ManyToOne is EAGER by default, which turns a list
 * of fourteen visits into twenty nine queries; the repository asks for them
 * with JOIN FETCH instead, so a list is one query.
 *
 * Every timestamp is an Instant, stored as TIMESTAMP WITH TIME ZONE. Not
 * LocalDateTime: that silently discards the zone, and the legal claim an EVV
 * record makes is about WHEN care happened. Philadelphia shifts an hour twice
 * a year, so a naive column is a record that changes meaning in March.
 *
 * Evidence fields are nullable on purpose. Null means never captured, and the
 * missing-evidence panel derives from those nulls rather than from a stored
 * list of what is wrong.
 */
@Entity
@Table(name = "visits")
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "caregiver_id", nullable = false)
    private Caregiver caregiver;

    @Column(name = "appointment_time", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private Instant appointmentTime;

    /**
     * STRING, never ORDINAL. Persisting the position of a constant means that
     * inserting a new status, or reordering the enum, rewrites the history of
     * every row already written without touching the database.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private VisitStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false, length = 32)
    private ServiceType serviceType;

    /**
     * BigDecimal, never double. This is currency: binary floating point cannot
     * represent 0.10, and a claim whose lines do not add up to its total is a
     * claim that gets rejected.
     */
    @Column(name = "estimated_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal estimatedCost;

    @Column(name = "check_in_time", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private Instant checkInTime;

    @Embedded
    private CapturedLocation checkInLocation;

    @Column(name = "check_out_time", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private Instant checkOutTime;

    @Column(length = 2000)
    private String assessment;

    /**
     * What the patient raised during THIS visit. Not evidence: null means they
     * raised nothing, which is normal and never blocks billing.
     */
    @Column(name = "patient_concern", length = 2000)
    private String patientConcern;

    private String signature;

    /** Both exist only once a claim has been submitted. */
    @Column(name = "claim_id")
    private String claimId;

    @Column(name = "submitted_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private Instant submittedAt;

    protected Visit() {
    }

    public Visit(Patient patient, Caregiver caregiver, Instant appointmentTime, VisitStatus status,
                 ServiceType serviceType, BigDecimal estimatedCost, Instant checkInTime,
                 Instant checkOutTime, String assessment, String patientConcern, String signature,
                 String claimId, Instant submittedAt) {
        this.patient = patient;
        this.caregiver = caregiver;
        this.appointmentTime = appointmentTime;
        this.status = status;
        this.serviceType = serviceType;
        this.estimatedCost = estimatedCost;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.assessment = assessment;
        this.patientConcern = patientConcern;
        this.signature = signature;
        this.claimId = claimId;
        this.submittedAt = submittedAt;
    }

    // Mutators, deliberately dumb. They record what the service decided; they do
    // not decide anything themselves. The transition rules live in VisitService
    // because a rule spread between the entity and the service is a rule nobody
    // can find, and this is the layer a controller must never reach past.

    public void recordCheckIn(Instant when, CapturedLocation location) {
        this.checkInTime = when;
        this.checkInLocation = location;
        this.status = VisitStatus.IN_PROGRESS;
    }

    public void recordCheckOut(Instant when, String assessment, String signature) {
        this.checkOutTime = when;
        this.assessment = assessment;
        this.signature = signature;
    }

    public void recordEvidence(String assessment, String signature) {
        this.assessment = assessment;
        this.signature = signature;
    }

    public void recordClaim(String claimId, Instant submittedAt) {
        this.claimId = claimId;
        this.submittedAt = submittedAt;
        this.status = VisitStatus.BILLED;
    }

    public void setStatus(VisitStatus status) {
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Patient getPatient() {
        return patient;
    }

    public Caregiver getCaregiver() {
        return caregiver;
    }

    public Instant getAppointmentTime() {
        return appointmentTime;
    }

    public VisitStatus getStatus() {
        return status;
    }

    public ServiceType getServiceType() {
        return serviceType;
    }

    public BigDecimal getEstimatedCost() {
        return estimatedCost;
    }

    public Instant getCheckInTime() {
        return checkInTime;
    }

    public CapturedLocation getCheckInLocation() {
        return checkInLocation;
    }

    public Instant getCheckOutTime() {
        return checkOutTime;
    }

    public String getAssessment() {
        return assessment;
    }

    public String getPatientConcern() {
        return patientConcern;
    }

    public String getSignature() {
        return signature;
    }

    public String getClaimId() {
        return claimId;
    }

    public Instant getSubmittedAt() {
        return submittedAt;
    }
}
