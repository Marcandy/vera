package com.vera.api.web;

import com.vera.api.domain.VisitStatus;
import com.vera.api.service.VisitService;
import com.vera.api.domain.CapturedLocation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * The two endpoints of the vertical slice.
 *
 * The mock service layer was the design document for this: getVisits and
 * getVisitById in src/services/visitService.js already had these signatures,
 * which is why nothing in the React app has to change when its internals start
 * calling fetch.
 *
 * The controller only translates HTTP. It does not decide anything: no rules
 * here, no queries here, and no entities leaving here.
 */
@RestController
@RequestMapping("/api/visits")
public class VisitController {

    private final VisitService visitService;

    public VisitController(VisitService visitService) {
        this.visitService = visitService;
    }

    /**
     * GET /api/visits?status=&q=&caregiverId=&patientId=
     *
     * status arrives as its wire label ("ready to bill"), so it is parsed here
     * rather than bound directly: an unknown value is a 400 through the
     * IllegalArgumentException mapping, not an empty list pretending to be an
     * answer.
     */
    @GetMapping
    public List<VisitDto> list(@RequestParam(required = false) String status,
                               @RequestParam(required = false) String q,
                               @RequestParam(required = false) Long caregiverId,
                               @RequestParam(required = false) Long patientId) {

        VisitStatus parsedStatus = (status == null || status.isBlank())
                ? null
                : VisitStatus.fromLabel(status);

        return visitService.search(parsedStatus, q, caregiverId, patientId)
                .stream()
                .map(VisitDto::from)
                .toList();
    }

    /**
     * GET /api/visits/counts. Its own endpoint because it answers a different
     * question from the list: the chips count the whole collection while the
     * list shows one slice of it.
     *
     * Declared before the /{id} mapping matters less than it looks, since Spring
     * prefers the literal path over the variable one, but the two would collide
     * if the id were a String.
     */
    @GetMapping("/counts")
    public VisitService.VisitCounts counts() {
        return visitService.counts();
    }

    /** GET /api/visits/{id}. A missing visit is a 404, decided in the service. */
    @GetMapping("/{id}")
    public VisitDto byId(@PathVariable Long id) {
        return VisitDto.from(visitService.getById(id));
    }

    /**
     * The mutations are sub-resources named for the event that causes them, not
     * a generic PATCH of a status field. POST /visits/3/check-in says what
     * happened; PATCH {"status":"in progress"} would let a client name any
     * destination it liked and put the rule back on the wrong side of the wire.
     */
    @PostMapping("/{id}/check-in")
    public VisitDto checkIn(@PathVariable Long id, @RequestBody(required = false) VisitRequests.CheckIn body) {
        CapturedLocation location = (body == null || body.available() == null)
                ? null
                : new CapturedLocation(body.available(), body.latitude(), body.longitude(),
                        body.accuracy(), body.reason(), body.source());

        return VisitDto.from(visitService.checkIn(id, location));
    }

    @PostMapping("/{id}/check-out")
    public VisitDto checkOut(@PathVariable Long id, @RequestBody VisitRequests.CheckOut body) {
        return VisitDto.from(visitService.checkOut(id, body.assessment(), body.signature()));
    }

    @PostMapping("/{id}/evidence")
    public VisitDto supplyEvidence(@PathVariable Long id, @RequestBody VisitRequests.Evidence body) {
        return VisitDto.from(visitService.supplyEvidence(id, body.assessment(), body.signature()));
    }

    @PostMapping("/{id}/claim")
    public VisitDto submitClaim(@PathVariable Long id) {
        return VisitDto.from(visitService.submitClaim(id));
    }
}
