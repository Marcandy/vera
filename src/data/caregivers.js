// Mock caregiver data. Components NEVER import this file directly;
// all access goes through src/services/caregiverService.js.
// Document statuses: "signed" | "pending" | "expiring".
// A caregiver is cleared to work when every document is "signed";
// that judgment is DERIVED at render, never stored.
// Phone is a STRING: it's an identifier, not a quantity.
// Visits reference caregivers by name string for now (no id link);
// real foreign keys arrive with the backend.
export const caregivers = [
    {
        id: 1,
        name: "Marcus Reed",
        phone: "215-555-0142",
        documents: [
            { name: "State ID", status: "signed" },
            { name: "Background Check", status: "signed" },
            { name: "CPR Certification", status: "expiring" },
            { name: "TB Test", status: "signed" }
        ]
    },
    {
        id: 2,
        name: "Dana Alvarez",
        phone: "215-555-0187",
        documents: [
            { name: "State ID", status: "signed" },
            { name: "Background Check", status: "signed" },
            { name: "CPR Certification", status: "signed" },
            { name: "TB Test", status: "pending" }
        ]
    },
    {
        id: 3,
        name: "Keisha Thompson",
        phone: "215-555-0116",
        documents: [
            { name: "State ID", status: "signed" },
            { name: "Background Check", status: "signed" },
            { name: "CPR Certification", status: "signed" },
            { name: "TB Test", status: "signed" }
        ]
    },
    {
        id: 4,
        name: "Luis Rivera",
        phone: "215-555-0163",
        documents: [
            { name: "State ID", status: "signed" },
            { name: "Background Check", status: "pending" },
            { name: "CPR Certification", status: "pending" },
            { name: "TB Test", status: "pending" }
        ]
    },
    {
        id: 5,
        name: "Angela Brooks",
        phone: "215-555-0129",
        documents: [
            { name: "State ID", status: "signed" },
            { name: "Background Check", status: "signed" },
            { name: "CPR Certification", status: "pending" },
            { name: "TB Test", status: "expiring" }
        ]
    }
];
