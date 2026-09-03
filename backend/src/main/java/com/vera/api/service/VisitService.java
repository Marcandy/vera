package com.vera.api.service;

import com.vera.api.domain.CapturedLocation;
import com.vera.api.domain.Visit;
import com.vera.api.domain.VisitStatus;
import com.vera.api.repository.VisitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * The domain service: where the rules live.
 *
 * THIS IS THE POINT OF THE PORT. The evidence check and every status transition
 * guard used to run in the browser, which meant they were suggestions: anything
 * that could reach the service could move a visit straight to "ready to bill"
 * without a signature. A rule the client enforces is not a rule. They run here
 * now, and the client keeps its copy only so the UI can grey out a button
 * before the round trip.
 *
 * Not in the controller, which only speaks HTTP, and not in the entity, which
 * only records what was decided. A rule split across layers is a rule nobody
 * can find.
 */
@Service
public class VisitService {

    /**
     * DEMO BEHAVIOUR, carried over from the mock deliberately. A real check-out
     * stamps Instant.now(); this stamps ninety minutes after the check-in so a
     * visit completed during a two minute demo still bills a plausible number of
     * hours. It is the one place this service tells a small, clearly labelled
     * lie, and it is labelled here rather than hidden behind a constant name.
     */
    private static final long DEMO_VISIT_MINUTES = 90;

    private final VisitRepository visits;

    public VisitService(VisitRepository visits) {
        this.visits = visits;
    }

    @Transactional(readOnly = true)
    public List<Visit> search(VisitStatus status, String q, Long caregiverId, Long patientId) {
        // The LIKE pattern is built here rather than in the query so the
        // repository stays a plain comparison. Blank or whitespace-only is not
        // a search: it must mean "everything", not "match the empty string".
        String namePattern = (q == null || q.isBlank())
                ? null
                : "%" + q.trim().toLowerCase() + "%";

        return visits.search(status, namePattern, caregiverId, patientId);
    }

    /** Throws rather than returning an Optional, so the 404 is decided once. */
    @Transactional(readOnly = true)
    public Visit getById(Long id) {
        return visits.findByIdWithRelations(id)
                .orElseThrow(() -> new NotFoundException("Visit " + id + " not found"));
    }

    /**
     * The counts behind the filter chips. Every status appears, including the
     * ones with no visits: a chip reading "billed (0)" is information, while a
     * missing key would make the client invent a zero it was never told.
     */
    @Transactional(readOnly = true)
    public VisitCounts counts() {
        Map<VisitStatus, Long> byStatus = new EnumMap<>(VisitStatus.class);
        for (VisitStatus status : VisitStatus.values()) {
            byStatus.put(status, 0L);
        }

        long total = 0;
        for (Object[] row : visits.countByStatus()) {
            VisitStatus status = (VisitStatus) row[0];
            long count = (Long) row[1];
            byStatus.put(status, count);
            total += count;
        }

        return new VisitCounts(total, byStatus);
    }

    /** total plus a count per status, which is what the chips render. */
    public record VisitCounts(long total, Map<VisitStatus, Long> byStatus) {
    }

    /**
     * The caller supplies the location because the device is the only authority
     * on where it is. The SERVER stamps the clock, because a time the caller
     * could author is not evidence.
     */
    @Transactional
    public Visit checkIn(Long id, CapturedLocation location) {
        Visit visit = getById(id);
        requireStatus(visit, VisitStatus.SCHEDULED, "check in");

        visit.recordCheckIn(Instant.now(), location);
        return visit;
    }

    @Transactional
    public Visit checkOut(Long id, String assessment, String signature) {
        Visit visit = getById(id);
        requireStatus(visit, VisitStatus.IN_PROGRESS, "check out");

        Instant checkOutTime = visit.getCheckInTime()
                .plusSeconds(DEMO_VISIT_MINUTES * 60);

        visit.recordCheckOut(checkOutTime, blankToNull(assessment), blankToNull(signature));
        visit.setStatus(gradeEvidence(visit));
        return visit;
    }

    /**
     * Supplying what was missing. Merges rather than replaces: sending nothing
     * for a field keeps what is already there, so this can only ever add
     * evidence and never erase it.
     */
    @Transactional
    public Visit supplyEvidence(Long id, String assessment, String signature) {
        Visit visit = getById(id);
        requireStatus(visit, VisitStatus.NEEDS_REVIEW, "supply evidence to");

        visit.recordEvidence(
                firstPresent(blankToNull(assessment), visit.getAssessment()),
                firstPresent(blankToNull(signature), visit.getSignature()));
        visit.setStatus(gradeEvidence(visit));
        return visit;
    }

    @Transactional
    public Visit submitClaim(Long id) {
        Visit visit = getById(id);
        requireStatus(visit, VisitStatus.READY_TO_BILL, "submit a claim for");

        visit.recordClaim("clm_mock_" + visit.getId(), Instant.now());
        return visit;
    }

    /**
     * THE EVIDENCE RULE. Four fields, all required, and no other way to reach
     * READY_TO_BILL. There is deliberately no method that sets it directly and
     * no admin override: a visit missing a signature is held until a signature
     * exists, because clicking "resolve" on a missing signature does not create
     * one.
     */
    private VisitStatus gradeEvidence(Visit visit) {
        boolean complete = visit.getCheckInTime() != null
                && visit.getCheckOutTime() != null
                && hasText(visit.getAssessment())
                && hasText(visit.getSignature());

        return complete ? VisitStatus.READY_TO_BILL : VisitStatus.NEEDS_REVIEW;
    }

    private static void requireStatus(Visit visit, VisitStatus required, String action) {
        if (visit.getStatus() != required) {
            throw new IllegalTransitionException(
                    "Cannot " + action + " a visit that is " + visit.getStatus().getLabel());
        }
    }

    /** An empty string is not evidence. Null is what the client reads as missing. */
    private static String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }

    private static String firstPresent(String supplied, String existing) {
        return supplied != null ? supplied : existing;
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
