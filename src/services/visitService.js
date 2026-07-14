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