import { caregivers } from "../data/caregivers";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const getCaregivers = async () => {
    await delay(300);

    return caregivers
}

export const addCaregiver = async ({ name, phone }) => {
    await delay(300);
    if(!name?.trim()) throw new Error("Caregiver name is required");

    const newCaregiver = {
    id: Math.max(...caregivers.map((c) => c.id)) + 1,
    name,
    phone,
    documents: [
        { name: "State ID", status: "pending" },
        { name: "Background Check", status: "pending" },
        { name: "CPR Certification", status: "pending" },
        { name: "TB Test", status: "pending" }
    ]
   }
   caregivers.push(newCaregiver);
   return newCaregiver;
}