import { ApiError, request } from "./http";

// THE SWAP. Every function below kept its name, its arguments and its return
// value; only the insides changed, from filtering an array in memory to asking
// a Spring Boot API the same question. Nothing above this file moved: not
// Dashboard, not Visits, not Billing, not MyVisits, not VisitDetail, not
// PatientDetail, not CaregiverDetail, not CaregiverVisit.
//
// That is the whole argument for a service layer, and it is now a fact about
// this repository rather than a claim about it.
//
// The 300ms fake delay is gone. It existed to make the mock behave like a
// network, and there is a network now.

// GET /api/visits, with the filters as query parameters. An absent filter means
// no restriction, which is what the server does too.
export const getVisits = async ({ status, q, caregiverId, patientId } = {}) =>
    request("/visits", { params: { status, q, caregiverId, patientId } });

// GET /api/visits/counts. Still its own request for the same reason it always
// was: the chips count the whole collection while the list shows one slice.
export const getVisitCounts = async () => request("/visits/counts");

// GET /api/visits/{id}.
//
// A missing visit comes back as undefined, NOT as a thrown error, because that
// is the contract VisitDetail was written against: it renders a not-found page
// when the value is falsy and a retryable failure when the call throws. Those
// are two different answers and the 404 is the one that is not a failure.
export const getVisitById = async (id) => {
    try {
        return await request(`/visits/${id}`);
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) return undefined;
        throw error;
    }
};

// Filtering by id, never by name. Kept as named verbs because the two doors
// differ in AUTHORIZATION rather than in query: an admin reads any caregiver's
// visits this way, while a caregiver reading their own becomes
// GET /api/visits/mine, where the server takes the id from the principal.
//
// The guard stays client side as well as server side. It is not the security
// boundary, it just fails immediately instead of spending a round trip to be
// told the same thing.
export const getVisitsByCaregiver = async (caregiverId) => {
    if (caregiverId == null || caregiverId === "") {
        throw new Error("A caregiver id is required");
    }

    return getVisits({ caregiverId });
};

export const getVisitsByPatient = async (patientId) => {
    if (patientId == null || patientId === "") {
        throw new Error("A patient id is required");
    }

    return getVisits({ patientId });
};

// The mutations are sub-resources named for the event that causes them. The
// transition guards and the four field evidence check now run in the Java
// service: they used to run here, which meant they were suggestions.
//
// Note what is NOT sent: no caregiver id and no timestamps. The server stamps
// the clock, because a time the caller could author is not evidence, and with
// real authentication the actor comes from the token rather than the body.
export const checkInVisit = async (id, location) =>
    request(`/visits/${id}/check-in`, { method: "POST", body: location ?? {} });

export const checkOutVisit = async (id, { assessment, signature }) =>
    request(`/visits/${id}/check-out`, { method: "POST", body: { assessment, signature } });

export const supplyEvidence = async (id, { assessment, signature }) =>
    request(`/visits/${id}/evidence`, { method: "POST", body: { assessment, signature } });

export const submitClaim = async (id) =>
    request(`/visits/${id}/claim`, { method: "POST" });
