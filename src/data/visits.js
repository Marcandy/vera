// Mock visit data. Components NEVER import this file directly
// all access goes through src/services/visitService.js.
// Evidence fields (checkInTime, checkOutTime, assessment, signature):
// null = not captured. "What's missing" on a needs-review visit is
// DERIVED from these nulls, never stored as a separate list.
// patientConcern is NOT evidence: null = patient raised nothing
// (normal), so it never blocks billing or shows as "missing".
// patientId and caregiverId are FOREIGN KEYS; the matching names sit beside
// them, denormalized for display.
// caregiverId is the FOREIGN KEY; caregiverName is denormalized beside it
// for display. Both belong here on purpose: the id is identity and is what
// filtering and, later, a JPA relation join on, while the name spares every
// list a second lookup. That is what an API returns, a DTO rather than a
// raw entity row.
// checkInLocation is METADATA, never evidence: it can never block billing.
// null = never captured, which is what every seed visit is. A real capture
// stores the whole locationService result, including the reason when the
// device could not give a fix, so review can tell "denied" from "not asked".
// estimatedCost is a NUMBER (dollars); format as currency at render.
// MVP collapse: stored flat; later derived from hours x payer rate.
// claimId and submittedAt exist only once a claim is submitted (billed).
import { VISIT_STATUS } from "../utils/status";

export const visits = [
    {
        id: 1,
        patientId: 1,
        patientName: "Eleanor Whitfield",
        caregiverId: 1,
        caregiverName: "Marcus Reed",
        appointmentTime: "2026-07-07T14:00",
        status: VISIT_STATUS.NEEDS_REVIEW,
        estimatedCost: 34,
        checkInTime: "2026-07-07T14:02",
        checkInLocation: null,
        checkOutTime: "2026-07-07T15:01",
        assessment: "Patient alert and in good spirits. Assisted with bathing and lunch. Mild swelling in left ankle, family notified.",
        patientConcern: "Worried about managing the stairs alone at night; asked if evening visits could start earlier.",
        signature: null
    },
    {
        id: 2,
        patientId: 2,
        patientName: "Samuel Okafor",
        caregiverId: 2,
        caregiverName: "Dana Alvarez",
        appointmentTime: "2026-07-07T16:30",
        status: VISIT_STATUS.NEEDS_REVIEW,
        estimatedCost: 51,
        checkInTime: "2026-07-07T16:33",
        checkInLocation: null,
        checkOutTime: null,
        assessment: "Medication reminder completed. Prepared dinner, patient ate half portion.",
        patientConcern: null,
        signature: null
    },
    {
        id: 3,
        patientId: 3,
        patientName: "Rosa Delgado",
        caregiverId: 1,
        caregiverName: "Marcus Reed",
        appointmentTime: "2026-07-07T09:00",
        status: VISIT_STATUS.READY_TO_BILL,
        estimatedCost: 52.5,
        checkInTime: "2026-07-07T08:58",
        checkInLocation: null,
        checkOutTime: "2026-07-07T10:30",
        assessment: "Morning routine assistance. Vitals stable, patient walked to mailbox and back without difficulty.",
        patientConcern: "Freezer stopped working and she is worried about meals for the weekend.",
        signature: "Rosa Delgado"
    },
    {
        id: 4,
        patientId: 4,
        patientName: "Harold Brennan",
        caregiverId: 3,
        caregiverName: "Keisha Thompson",
        appointmentTime: "2026-07-07T11:30",
        status: VISIT_STATUS.READY_TO_BILL,
        estimatedCost: 56,
        checkInTime: "2026-07-07T11:29",
        checkInLocation: null,
        checkOutTime: "2026-07-07T13:05",
        assessment: "Physical therapy exercises completed, full set. Patient reports less knee pain than last week.",
        patientConcern: null,
        signature: "Harold Brennan"
    },
    {
        id: 8,
        patientId: 8,
        patientName: "Dorothy Chen",
        caregiverId: 3,
        caregiverName: "Keisha Thompson",
        appointmentTime: "2026-07-07T10:00",
        status: VISIT_STATUS.READY_TO_BILL,
        estimatedCost: 63,
        checkInTime: "2026-07-07T09:58",
        checkInLocation: null,
        checkOutTime: "2026-07-07T11:45",
        assessment: "Wound dressing changed per care plan. Range-of-motion exercises completed, patient tolerated well.",
        patientConcern: null,
        signature: "Dorothy Chen"
    },
    {
        id: 5,
        patientId: 5,
        patientName: "Miriam Katz",
        caregiverId: 2,
        caregiverName: "Dana Alvarez",
        appointmentTime: "2026-07-08T08:00",
        status: VISIT_STATUS.IN_PROGRESS,
        estimatedCost: 42,
        checkInTime: "2026-07-08T08:04",
        checkInLocation: null,
        checkOutTime: null,
        assessment: null,
        patientConcern: null,
        signature: null
    },
    {
        id: 9,
        patientId: 9,
        patientName: "Walter Osei",
        caregiverId: 2,
        caregiverName: "Dana Alvarez",
        appointmentTime: "2026-07-08T11:00",
        status: VISIT_STATUS.IN_PROGRESS,
        estimatedCost: 47,
        checkInTime: "2026-07-08T11:05",
        checkInLocation: null,
        checkOutTime: null,
        assessment: null,
        patientConcern: null,
        signature: null
    },
    {
        id: 6,
        patientId: 6,
        patientName: "George Antonelli",
        caregiverId: 3,
        caregiverName: "Keisha Thompson",
        appointmentTime: "2026-07-08T13:00",
        status: VISIT_STATUS.SCHEDULED,
        estimatedCost: 38.5,
        checkInTime: null,
        checkInLocation: null,
        checkOutTime: null,
        assessment: null,
        patientConcern: null,
        signature: null
    },
    {
        id: 10,
        patientId: 10,
        patientName: "Agnes Romano",
        caregiverId: 1,
        caregiverName: "Marcus Reed",
        appointmentTime: "2026-07-09T09:30",
        status: VISIT_STATUS.SCHEDULED,
        estimatedCost: 40,
        checkInTime: null,
        checkInLocation: null,
        checkOutTime: null,
        assessment: null,
        patientConcern: "Wants help reorganizing the medication cabinet; labels are too small to read.",
        signature: null
    },
    {
        id: 7,
        patientId: 7,
        patientName: "Pearl Jackson",
        caregiverId: 1,
        caregiverName: "Marcus Reed",
        appointmentTime: "2026-07-07T08:00",
        status: VISIT_STATUS.BILLED,
        estimatedCost: 45.5,
        checkInTime: "2026-07-07T07:57",
        checkInLocation: null,
        checkOutTime: "2026-07-07T09:15",
        assessment: "Overnight recap reviewed. Breakfast and morning medications administered on schedule.",
        patientConcern: "Asked whether the same caregiver can come Fridays, prefers familiar faces.",
        signature: "P. Jackson (daughter)",
        claimId: "clm_mock_7",
        submittedAt: "2026-07-07T17:42"
    },
    {
        id: 11,
        patientId: 1,
        patientName: "Eleanor Whitfield",
        caregiverId: 1,
        caregiverName: "Marcus Reed",
        appointmentTime: "2026-06-23T14:00",
        status: VISIT_STATUS.BILLED,
        estimatedCost: 34,
        checkInTime: "2026-06-23T13:58",
        checkInLocation: null,
        checkOutTime: "2026-06-23T15:04",
        assessment: "Bathing and lunch as usual. Ankle swelling unchanged from last week.",
        patientConcern: null,
        signature: "Eleanor Whitfield",
        claimId: "clm_mock_11",
        submittedAt: "2026-06-23T18:10"
    },
    {
        id: 12,
        patientId: 1,
        patientName: "Eleanor Whitfield",
        caregiverId: 3,
        caregiverName: "Keisha Thompson",
        appointmentTime: "2026-06-30T14:00",
        status: VISIT_STATUS.BILLED,
        estimatedCost: 34,
        checkInTime: "2026-06-30T14:05",
        checkInLocation: null,
        checkOutTime: "2026-06-30T15:07",
        assessment: "Covered for Marcus. Patient needed extra time on the stairs; no falls.",
        patientConcern: "Asked whether her regular caregiver would be back next week.",
        signature: "Eleanor Whitfield",
        claimId: "clm_mock_12",
        submittedAt: "2026-06-30T17:55"
    },
    {
        id: 13,
        patientId: 3,
        patientName: "Rosa Delgado",
        caregiverId: 1,
        caregiverName: "Marcus Reed",
        appointmentTime: "2026-06-25T09:00",
        status: VISIT_STATUS.BILLED,
        estimatedCost: 52.5,
        checkInTime: "2026-06-25T09:01",
        checkInLocation: null,
        checkOutTime: "2026-06-25T10:33",
        assessment: "Walked to the corner and back. Good spirits, no shortness of breath.",
        patientConcern: null,
        signature: "Rosa Delgado",
        claimId: "clm_mock_13",
        submittedAt: "2026-06-25T16:20"
    },
    {
        id: 14,
        patientId: 4,
        patientName: "Harold Brennan",
        caregiverId: 3,
        caregiverName: "Keisha Thompson",
        appointmentTime: "2026-06-29T11:30",
        status: VISIT_STATUS.BILLED,
        estimatedCost: 56,
        checkInTime: "2026-06-29T11:31",
        checkInLocation: null,
        checkOutTime: "2026-06-29T13:02",
        assessment: "Full physical therapy set completed. Reports stiffness in the morning only.",
        patientConcern: null,
        signature: "Harold Brennan",
        claimId: "clm_mock_14",
        submittedAt: "2026-06-29T17:40"
    }
];
