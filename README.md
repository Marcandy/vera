# Vera

Vera is a workspace for small home care agencies: one place to manage visits, caregivers, and the record of care each patient receives. Every visit is backed by evidence (who was there, when, and what care was delivered), so the moment a visit is verified, the claim is ready to submit. No chasing paperwork, no double data entry.

**Live demo:** [vera-homecare.vercel.app](https://vera-homecare.vercel.app)

## Why

Small home care agencies mostly run on software that is broad, expensive, and disconnected. From interviews with agency owners in Philadelphia, their top pain points were managing caregiver onboarding documents, knowing when caregivers are actually with patients, and collecting patient signatures. Vera focuses on one clean, connected flow from scheduled visit to billable record, built caregiver-first, because caregivers are the bulk of the workforce and the source of every record the office depends on.

The visit verification core is modeled on Electronic Visit Verification (EVV), which is federally required for Medicaid-funded home care under the 21st Century Cures Act.

**Demo disclaimer:** this is a portfolio MVP inspired by EVV. It is not certified EVV software, it makes no HIPAA claims, and all data is fictional. Data lives in memory and resets on refresh by design.

## What it does

**For the administrator:**

- Dashboard: visits needing a nudge (a check-in that never happened, a visit still running long past its expected end), plus what needs attention right now, as counts of flagged and billable visits plus the dollar value waiting on a claim; every tile drills into the filtered list
- Visit list: every visit with its pipeline status, filtered by status and sorted by attention or by date. Filters live in the URL, so a filtered view is shareable and survives the back button
- Visit detail: check-in and check-out times, assessment, and signature; a flagged visit derives and lists exactly what evidence is missing
- Billing: ready-to-bill visits with hours worked and estimated cost, one-click mock claim submission, and a submitted-claims register with claim references
- Patients: roster of everyone receiving care, and a patient record with their address, contact, what they need help with in general, and their full care history
- Caregivers: team roster, add-caregiver form, and a per-caregiver onboarding document checklist (signed, pending, expiring) with a derived cleared-to-work badge; pending documents accept a cursive signature capture

**For the caregiver (phone-width surface, one primary action per screen):**

- My visits: the day's assigned visits, in the order they happen. The caregiver id comes from the session and never from the URL, so there is no address to type that reveals a colleague's patients
- Check in on arrival; the system stamps the time and records the device's location when the caregiver allows it. A refused or unreachable location is recorded as unavailable, with the reason, and never blocks the check-in
- Check out with a visit assessment and the patient's typed signature
- Checking out without a signature warns first, then flags the visit for review instead of blocking the caregiver from leaving
- Missing evidence can be supplied later, which is the only way a flagged visit becomes billable
- A visit whose punch is overdue is flagged on the caregiver's own list while they can still fix it, because a time the office enters afterwards counts as a manual edit

**Around the app:**

- Home: product intro and a simulated sign-in. Two demo accounts, `denise@agency.com` (administrator) and `marcus@agency.com` (caregiver), with any password. The password is required but never checked, and the app says so
- Roles: the administrator sees the visit list, caregivers, and billing; a caregiver sees only their own schedule. The session survives a refresh and there is no route guarding, because there is no real authentication to guard with
- About: the home care industry in numbers, from cited primary sources
- Responsive layout: tablet breakpoint, and a phone breakpoint where the sidebar collapses behind a menu button

## The visit pipeline

```
scheduled → in progress → ready to bill → billed
                        ↘ needs review ↗
```

Every transition has a cause: check-in, check-out with an evidence check, evidence supplied, claim submission. Three rules are enforced in the service layer:

1. A visit is billable only when all four pieces of evidence exist: check-in time, check-out time, assessment, signature. Anything missing routes it to needs review.
2. Only supplying the missing evidence clears a flag. There is no admin override, because clicking a button does not create a signature.
3. Timestamps are stamped by the system when the event happens, never typed by a user. A typed timestamp would be fabricated evidence.

## Architecture

- Vite + React (JavaScript), React Router, CSS Modules. No UI libraries.
- All data access goes through a service layer (`src/services`). Components never import mock data directly. The services expose async functions with realistic latency, so a real backend can replace the mock internals without changing a single component.
- Mutations are domain verbs (`checkInVisit`, `checkOutVisit`, `supplyEvidence`, `submitClaim`, `addCaregiver`, `signDocument`), and state transition rules live inside them, not in components.
- Every read surface handles a failed request: the failure is kept in state, rendered as its own thing, and retryable without reloading the page. A failed request is checked before a not-found result, because both leave the record empty and only one of them means the record does not exist.
- Derived state over stored flags: attention flags are computed from the clock and thresholds rather than stored on the visit, so nothing has to be written when a visit becomes late. `attentionFor` takes the current instant as a parameter instead of reading the clock, which keeps it pure and testable at fixed times. The dashboard counts, the missing-evidence panel, and the cleared-to-work badge are computed from the data at render time, so they can never disagree with the record.
- Demo timestamps are anchored to the day the app is opened rather than written as fixed dates (`src/data/demoDay.js`). A seed full of literal dates is honest only the week it is written: two months on, every scheduled visit read as a late check-in and every visit in progress as a forgotten check-out, so the attention flags flagged all of them and meant nothing. The offsets place exactly one late check-in and one overrunning visit on today, and one line freezes the whole seed to a fixed moment when a real backend takes the data over.
- `locationService` sits alongside the data services but is a device adapter, not a repository: no backend will ever replace it, because the device is the only authority on where it is. It resolves a result object rather than rejecting, since a refused permission is an ordinary outcome of a real check-in and not an exception.
- The signed-in user is the only thing in React Context. Server data stays out of it: visits in Context would be a cache with no invalidation or staleness policy. The session stores a user id and rehydrates through the service on boot, the same shape a real client uses when it trades a token for `GET /api/auth/me`, which is why the session has three states rather than two: unknown, none, and a user.
- Visits reference patients and caregivers by id, with the names denormalized alongside for display. Names collide and change; ids do not, and both are the foreign keys a relational schema needs.
- Facts live at the level they are true at: what a patient needs help with in general belongs to the patient, what they raised during one visit belongs to that visit. Same words, different lifetimes.

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
| Check-in, location allowed | Allow the browser's location prompt | Coordinates and accuracy recorded; caregiver flow and visit detail both show them |
| Check-in, location refused | Block or dismiss the location prompt | Check-in still succeeds; both surfaces read Unavailable with the reason, never a placeholder position |
| Check-out, full evidence | Fill assessment and signature, check out | Visit becomes ready to bill; Billing total increases |
| Check-out, no signature | Leave signature blank, check out | Warning appears; Check Out Anyway flags the visit needs review |
| Supply evidence | Open a flagged visit's caregiver flow, add the missing signature | Visit becomes ready to bill; Billing updates |
| Unresolvable visit | Open a visit missing its check-out time | Panel explains office follow-up is needed; visit stays flagged |
| Add caregiver | Submit the form with name and phone | Caregiver appears in the roster with pending documents; form clears |
| Add caregiver, blank name | Submit with no name | Inline error from the service; nothing added |
| Unknown routes | Visit a bad URL or a bad visit id | 404 page inside the app shell; not-found message with a way back |
| Dashboard tiles | Click Need review on the dashboard | Lands on the visit list filtered to needs review, chip shown active |
| Filter deep link | Open /visits?status=billed directly, then reload | One visit shown both times; the filter is in the URL, not in component state |
| Bad filter in the URL | Open /visits?status=bogus | Falls back to the unfiltered list rather than a blank screen |
| Empty filter result | Filter to a status with no visits | Message naming that status, with a control to show all visits |
| Demo sign-in, admin | Sign in as `denise@agency.com` | Lands on the dashboard; nav shows visit list, caregivers, billing |
| Demo sign-in, caregiver | Sign in as `marcus@agency.com` | Lands on My visits with four visits; nav shows only My visits |
| Unknown account | Sign in with any other email | Inline error from the service; stays on the home page |
| Session persistence | Sign in, then reload the page | Still signed in, same role, with no flash of the signed-out view |
| Sign out | Use the banner control | Returns to the home page; reloading does not restore the session |
| Submit claim | On Billing, submit a ready-to-bill claim | Confirmation with a claim reference; row moves to Submitted claims; both totals update |
| Sign document | On Caregivers, sign a pending document | Signature renders in cursive; pill flips to signed; badge flips to cleared when it was the last one |
| Expiring document | Check an expiring document's row | No Sign button; expiring is not signable by design |
| Late check-in flag | View a scheduled visit whose appointment passed more than 15 minutes ago | Card and dashboard show a late check-in flag; the status pill still reads scheduled |
| Missing check-out flag | View a visit in progress more than 2 hours past check-in | Flagged missing check-out; needs-review and billed visits are never flagged |
| Flags update without a reload | Leave the dashboard open across a threshold | The flag appears on the next minute tick |
| Patient record | Open a patient from the roster | Address, contact, standing concerns, and every visit on record newest first |
| Patient round trip | From a visit, click the patient name, then a visit in their history | Reaches the patient record and back into a visit |
| Unknown patient | Open /patients/999 | Not-found message with a way back, not a crash |
| Failed load | Simulate a failing read on any list or detail page | The page names the failure and offers Try again; it never sits on Loading |
| Retry | Recover the connection and press Try again | The page loads without a browser refresh and the error clears |
| Failure is not not-found | Fail the read on a visit or patient page | Reads as could-not-load, never as "not found" |
| Responsive | Narrow the window below 640px | Sidebar collapses behind the menu button; menu opens, navigates, and closes |

## Roadmap

- A distinct status between verified and billable once payer and authorization rules arrive with a real backend
- Persistence: localStorage first, then a real API behind the same service contracts
- Location at check-out as well as check-in, and a review surface that surfaces visits whose location was never captured
- Drawn signature capture
- Document expiration dates, with the expiring status derived from them and a renewal flow
- Real authentication: hashed passwords, a token, and server-side authorization, replacing the demo sign-in
- Prescriptions and medication reconciliation on the patient record, under a future skilled-care path
- Real claim submission and remittance (837 and 835) to a payer or clearinghouse, replacing the mock
- Stripe test-mode collection for private-pay clients
- Automated tests: Vitest and React Testing Library for services and components, Playwright for the visit flow end to end
