import { visits } from "../data/visits";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const findIdx = (id) => {
    const idx = visits.findIndex((visit) => visit.id === Number(id));
    if (idx === -1) {
        throw new Error(`Visit ${id} not found`)
    }
    return idx;
}

export const getVisits = async () => {
    await delay(300);
    return visits
}


// Filtering by id, never by name: names collide and change, ids do not.
// This is GET /api/visits?caregiverId=1, and in Spring it is a repository
// query rather than a loop, which is why the filter belongs in the service
// and not in the page that renders the list.
export const getVisitsByCaregiver = async (caregiverId) => {
    await delay(300);

    return visits.filter((visit) => visit.caregiverId === Number(caregiverId));
}

export const getVisitById = async (id) => {
    await delay(300);

    return visits.find((visit) => visit.id === Number(id));
}

// The caller supplies the location because the device is the only authority
// on where it is; the service still stamps the clock itself, because a time a
// caller could author is not evidence. Location is metadata either way: it is
// never part of the four-field evidence check, so a caregiver whose phone
// refused permission still produces a billable visit.
export const checkInVisit = async (id, location) => {
    await delay(300);

    const idx = findIdx(id)

    if (visits[idx].status !== 'scheduled') {
       throw new Error(`Cannot check in a visit that is ${visits[idx].status}`)
    }

    visits[idx] = {...visits[idx],
        status: "in progress",
        checkInTime: new Date().toISOString(),
        checkInLocation: location ?? null
    }

    return visits[idx];

}

export const checkOutVisit = async (id, { assessment, signature }) => {
    await delay(300);

    const idx = findIdx(id)

    if (visits[idx].status !== "in progress" ) {
        throw new Error (`Cannot check out a visit that is ${visits[idx].status}`);
    }
     
    // empty string is not evidence, null is what the frontend will read
    const cleanAssessment = assessment?.trim() ? assessment.trim() : null;
    const cleanSignature = signature?.trim() ? signature.trim() : null;

    const MOCK_VISIT_MINUTES = 90;
    const checkOutTime = new Date(
        new Date(visits[idx].checkInTime).getTime() + MOCK_VISIT_MINUTES * 60000
    ).toISOString();

    const updated = {
        ...visits[idx],
        assessment: cleanAssessment,
        signature: cleanSignature,
        checkOutTime: checkOutTime,
    }

    // evidence check for four field

    const evidenceComplete = 
        updated.checkInTime && updated.checkOutTime &&
        updated.assessment && updated.signature;

    updated.status = evidenceComplete ? "ready to bill" : "needs review";

    visits[idx] = updated;
    // return the update object
    return updated;
}


export const supplyEvidence = async(id, {assessment, signature}) => {
    await delay(300)

    const idx = findIdx(id);

    if(visits[idx].status !== "needs review") {
        throw new Error(`Cannot supply evidence to a visit that is ${visits[idx].status}`);
    }

    // empty string is not evidence, null is for the frontend
    const cleanAssessment = assessment?.trim() ? assessment.trim() : null;
    const cleanSignature = signature?.trim() ? signature.trim() : null;

    // merge, supplying nothing keeps what exist
    const updated = {
        ...visits[idx],
        assessment: cleanAssessment ?? visits[idx].assessment,
        signature: cleanSignature ?? visits[idx].signature
    }

    // same evidence as checkout
    const evidenceComplete = 
        updated.checkInTime && updated.checkOutTime &&
        updated.assessment && updated.signature;

    updated.status = evidenceComplete ? "ready to bill" : "needs review";

    visits[idx] = updated;
    return updated
}

export const submitClaim = async (id) => {
    await delay(700);

    const idx = findIdx(id);

    if(visits[idx].status !== 'ready to bill') {
        throw new Error(`Cannot submit a claim for a visit that is ${visits[idx].status}`)
    }

    const updated = {
        ...visits[idx],
        status: 'billed',
        submittedAt: new Date().toISOString(),
        claimId: `clm_mock_${id}`
    }
    visits[idx] = updated;
    return updated;
}