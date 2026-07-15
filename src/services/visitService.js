import { visits } from "../data/visits";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const getVisits = async () => {
    await delay(300);
    return visits
}


export const getVisitById = async (id) => {
    await delay(200);

    return visits.find((visit) => visit.id === Number(id));
}

export const checkInVisit = async (id) => {
    await delay(300);

    const idx = visits.findIndex((visit) => visit.id === Number(id));
    if (idx === -1) {
        throw new Error(`Visit ${id} not found`)
    }

    if (visits[idx].status !== 'scheduled') {
       throw new Error(`Cannot check in a visit that is ${visits[idx].status}`)
    }

    visits[idx] = {...visits[idx],
        status: "in progress",
        checkInTime: new Date().toISOString()
    }

    return visits[idx];

}

export const checkOutVisit = async (id, { assessment, signature }) => {
    await delay(300);

    const idx = visits.findIndex((visit) => visit.id === Number(id));
    if (idx === -1) {
        throw new Error(`Visit ${id} not found`)
    }

    if (visits[idx].status !== "in progress" ) {
        throw new Error (`Cannot check out a visit that is ${visits[idx].status}`);
    }
     
    // empty string is not evidence, null is what the frontend will read
    const cleanAssessment = assessment?.trim() ? assessment.trim() : null;
    const cleanSignature = signature?.trim() ? signature.trim() : null;

    const updated = {
        ...visits[idx],
        assessment: cleanAssessment,
        signature: cleanSignature,
        checkOutTime: new Date().toISOString(),
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