# Vera

Home care agency management built around one idea: a caregiver's verified visit should become a billing-ready record without anyone chasing paperwork. Verified care becomes money.

## Why

Small home care agencies mostly run on software that is broad, expensive, and disconnected. From interviews with agency owners in Philadelphia, their top pain points were managing caregiver onboarding documents, knowing when caregivers are actually with patients, and collecting patient signatures. Vera focuses on one clean, connected flow from scheduled visit to billable record, built caregiver-first, because caregivers are the bulk of the workforce and the source of every record the office depends on.

The visit verification core is modeled on Electronic Visit Verification (EVV), which is federally required for Medicaid-funded home care under the 21st Century Cures Act.

**Demo disclaimer:** this is a portfolio MVP inspired by EVV. It is not certified EVV software, it makes no HIPAA claims, and all data is fictional. Data lives in memory and resets on refresh by design.

## What it does

**For the administrator:**

- Dashboard: every visit with its pipeline status, needs-review visits first
- Visit detail: check-in and check-out times, assessment, and signature; a flagged visit derives and lists exactly what evidence is missing
- Billing: ready-to-bill visits with hours worked and estimated cost, totaled into a claims table
- Caregivers: team roster, add-caregiver form, and a per-caregiver onboarding document checklist (signed, pending, expiring) with a derived cleared-to-work badge

**For the caregiver (phone-width surface, one primary action per screen):**

- Check in on arrival; the system stamps the time (location is mocked in this MVP)
- Check out with a visit assessment and the patient's typed signature
- Checking out without a signature warns first, then flags the visit for review instead of blocking the caregiver from leaving
- Missing evidence can be supplied later, which is the only way a flagged visit becomes billable

## The visit pipeline

```
scheduled → in progress → ready to bill → billed
                        ↘ needs review ↗
```

Every transition has a cause: check-in, check-out with an evidence check, evidence supplied, charge (future). Three rules are enforced in the service layer:

1. A visit is billable only when all four pieces of evidence exist: check-in time, check-out time, assessment, signature. Anything missing routes it to needs review.
2. Only supplying the missing evidence clears a flag. There is no admin override, because clicking a button does not create a signature.
3. Timestamps are stamped by the system when the event happens, never typed by a user. A typed timestamp would be fabricated evidence.

## Architecture

- Vite + React (JavaScript), React Router, CSS Modules. No UI libraries.
- All data access goes through a service layer (`src/services`). Components never import mock data directly. The services expose async functions with realistic latency, so a real backend can replace the mock internals without changing a single component.
- Mutations are domain verbs (`checkInVisit`, `checkOutVisit`, `supplyEvidence`, `addCaregiver`), and state transition rules live inside them, not in components.
- Derived state over stored flags: the missing-evidence panel and the cleared-to-work badge are computed from the data at render time, so they can never disagree with the record.

## Running locally

```
npm install
npm run dev
```

Production build: `npm run build`.

## Manual testing

Automated testing was out of scope for this phase, so testing is a scripted manual pass run before each merge:

| Scenario | Steps | Expected |
|---|---|---|
| Check-in | Open a scheduled visit's caregiver flow, tap Check In | Status moves to in progress everywhere; time recorded |
| Check-out, full evidence | Fill assessment and signature, check out | Visit becomes ready to bill; Billing total increases |
| Check-out, no signature | Leave signature blank, check out | Warning appears; Check Out Anyway flags the visit needs review |
| Supply evidence | Open a flagged visit's caregiver flow, add the missing signature | Visit becomes ready to bill; Billing updates |
| Unresolvable visit | Open a visit missing its check-out time | Panel explains office follow-up is needed; visit stays flagged |
| Add caregiver | Submit the form with name and phone | Caregiver appears in the roster with pending documents; form clears |
| Add caregiver, blank name | Submit with no name | Inline error from the service; nothing added |
| Unknown routes | Visit a bad URL or a bad visit id | 404 page inside the app shell; not-found message with a way back |

## Roadmap

- Deploy to Vercel
- A distinct status between verified and billable once payer and authorization rules arrive with a real backend
- Persistence: localStorage first, then a real API behind the same service contracts
- Real browser geolocation at check-in, with a mock fallback for bad signal
- Drawn signature capture
- A caregiver home screen ("my visits today") and role-based views
- Patient records: standing concerns, and prescriptions under a future skilled-care path
- Stripe test-mode payment for verified visits
- Automated tests: Vitest and React Testing Library for services and components, Playwright for the visit flow end to end
