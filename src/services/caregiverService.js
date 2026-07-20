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

export const signDocument = async (caregiverId, documentName, signature) => {
    await delay(300)

    const idx = caregivers.findIndex((caregiver) => caregiver.id === Number(caregiverId));
    if (idx === -1) {
        throw new Error(`Caregiver ${caregiverId} not found`)
    }

    const doc = caregivers[idx].documents.find((d) => d.name === documentName);
    if (!doc) {
        throw new Error(`Document ${documentName} not found`);
    }
    
    if (doc.status === 'signed') {
        throw new Error(`${documentName} is already signed`);
    }

    if (!signature?.trim()) {
        throw new Error("Signature is required");
    }

    const updated = {
        ...caregivers[idx],
        documents: caregivers[idx].documents.map((d) =>
            d.name === documentName
                ? {...d, status: "signed", 
                    signature: signature.trim(), 
                    signedAt: new Date().toISOString()
                }
                : d
        ),
    }

    caregivers[idx] = updated;
    return updated;
}