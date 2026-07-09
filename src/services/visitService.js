import { visits } from "../data/visits";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const getVisits = async () => {
    await delay(300);
    return visits
}


export const getVisitById = async (id) => {
    await delay(300);

    return visits.find((visit) => visit.id === id);
}