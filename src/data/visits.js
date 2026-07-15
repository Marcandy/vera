// Mock visit data. Components NEVER import this file directly
// all access goes through src/services/visitService.js.
// Evidence fields (checkInTime, checkOutTime, assessment, signature):
// null = not captured. "What's missing" on a needs-review visit is
// DERIVED from these nulls, never stored as a separate list.
// patientConcern is NOT evidence: null = patient raised nothing
// (normal), so it never blocks billing or shows as "missing".
// estimatedCost is a NUMBER (dollars); format as currency at render.
// MVP collapse: stored flat; later derived from hours x payer rate.
export const visits = [
    {
        id: 1,
        patientName: "Eleanor Whitfield",
        caregiverName: "Marcus Reed",
        appointmentTime: "2026-07-07T14:00",
        status: "needs review",
        estimatedCost: 34,
        checkInTime: "2026-07-07T14:02",
        checkOutTime: "2026-07-07T15:01",
        assessment: "Patient alert and in good spirits. Assisted with bathing and lunch. Mild swelling in left ankle, family notified.",
        patientConcern: "Worried about managing the stairs alone at night; asked if evening visits could start earlier.",
        signature: null
    },
    {
        id: 2,
        patientName: "Samuel Okafor",
        caregiverName: "Dana Alvarez",
        appointmentTime: "2026-07-07T16:30",
        status: "needs review",
        estimatedCost: 51,
        checkInTime: "2026-07-07T16:33",
        checkOutTime: null,
        assessment: "Medication reminder completed. Prepared dinner, patient ate half portion.",
        patientConcern: null,
        signature: null
    },
    {
        id: 3,
        patientName: "Rosa Delgado",
        caregiverName: "Marcus Reed",
        appointmentTime: "2026-07-07T09:00",
        status: "ready to bill",
        estimatedCost: 52.5,
        checkInTime: "2026-07-07T08:58",
        checkOutTime: "2026-07-07T10:30",
        assessment: "Morning routine assistance. Vitals stable, patient walked to mailbox and back without difficulty.",
        patientConcern: "Freezer stopped working and she is worried about meals for the weekend.",
        signature: "Rosa Delgado"
    },
    {
        id: 4,
        patientName: "Harold Brennan",
        caregiverName: "Keisha Thompson",
        appointmentTime: "2026-07-07T11:30",
        status: "ready to bill",
        estimatedCost: 56,
        checkInTime: "2026-07-07T11:29",
        checkOutTime: "2026-07-07T13:05",
        assessment: "Physical therapy exercises completed, full set. Patient reports less knee pain than last week.",
        patientConcern: null,
        signature: "Harold Brennan"
    },
    {
        id: 8,
        patientName: "Dorothy Chen",
        caregiverName: "Keisha Thompson",
        appointmentTime: "2026-07-07T10:00",
        status: "ready to bill",
        estimatedCost: 63,
        checkInTime: "2026-07-07T09:58",
        checkOutTime: "2026-07-07T11:45",
        assessment: "Wound dressing changed per care plan. Range-of-motion exercises completed, patient tolerated well.",
        patientConcern: null,
        signature: "Dorothy Chen"
    },
    {
        id: 5,
        patientName: "Miriam Katz",
        caregiverName: "Dana Alvarez",
        appointmentTime: "2026-07-08T08:00",
        status: "in progress",
        estimatedCost: 42,
        checkInTime: "2026-07-08T08:04",
        checkOutTime: null,
        assessment: null,
        patientConcern: null,
        signature: null
    },
    {
        id: 9,
        patientName: "Walter Osei",
        caregiverName: "Dana Alvarez",
        appointmentTime: "2026-07-08T11:00",
        status: "in progress",
        estimatedCost: 47,
        checkInTime: "2026-07-08T11:05",
        checkOutTime: null,
        assessment: null,
        patientConcern: null,
        signature: null
    },
    {
        id: 6,
        patientName: "George Antonelli",
        caregiverName: "Keisha Thompson",
        appointmentTime: "2026-07-08T13:00",
        status: "scheduled",
        estimatedCost: 38.5,
        checkInTime: null,
        checkOutTime: null,
        assessment: null,
        patientConcern: null,
        signature: null
    },
    {
        id: 10,
        patientName: "Agnes Romano",
        caregiverName: "Marcus Reed",
        appointmentTime: "2026-07-09T09:30",
        status: "scheduled",
        estimatedCost: 40,
        checkInTime: null,
        checkOutTime: null,
        assessment: null,
        patientConcern: "Wants help reorganizing the medication cabinet; labels are too small to read.",
        signature: null
    },
    {
        id: 7,
        patientName: "Pearl Jackson",
        caregiverName: "Marcus Reed",
        appointmentTime: "2026-07-07T08:00",
        status: "billed",
        estimatedCost: 45.5,
        checkInTime: "2026-07-07T07:57",
        checkOutTime: "2026-07-07T09:15",
        assessment: "Overnight recap reviewed. Breakfast and morning medications administered on schedule.",
        patientConcern: "Asked whether the same caregiver can come Fridays, prefers familiar faces.",
        signature: "P. Jackson (daughter)"
    }
];
