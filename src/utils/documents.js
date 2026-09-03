import { DOCUMENT_STATUS } from "./status";

// POLICY, not fact. How close to its expiry date a document starts asking to
// be renewed. It sits here as a named constant for the same reason the
// attention thresholds do: it is the agency's rule about when to start
// chasing paperwork, not a property of any document, and a real product
// makes it configurable per document type.
export const RENEWAL_WINDOW_DAYS = 30;

const DAY = 86400000;

// `now` is a parameter and never read from the clock in here, matching
// attentionFor. A function that calls Date.now() itself cannot be tested at a
// chosen instant without faking global time, and it hides that its answer
// changes underneath the caller. The expiring window in particular is only
// meaningful relative to some instant, so the instant belongs in the
// signature.
//
// This is the file that ended the last stored judgment in the app. The seed
// used to assert status: "expiring", which was a fact about the day someone
// typed it rather than about the document, and nothing made it wrong again
// when the date passed.
export const documentStatus = (document, now) => {
    // Received means the office actually has something: a signature it
    // captured, or a file it was sent. Until then there is nothing to expire.
    const received = Boolean(document.signature || document.fileName);
    if (!received) return DOCUMENT_STATUS.PENDING;

    // A completed background check does not lapse. Modelling that as a very
    // distant date would be a lie that eventually comes true.
    if (!document.expiresAt) return DOCUMENT_STATUS.SIGNED;

    const expires = new Date(document.expiresAt).getTime();

    if (expires <= now) return DOCUMENT_STATUS.EXPIRED;
    if (expires <= now + RENEWAL_WINDOW_DAYS * DAY) return DOCUMENT_STATUS.EXPIRING;

    return DOCUMENT_STATUS.SIGNED;
};

// What actually stops someone working. EXPIRING is deliberately NOT in here:
// a card that lapses in three weeks is valid today, and a caregiver who is
// legally cleared to see patients should not read as blocked because the
// office has a renewal to chase. That distinction is the whole reason
// EXPIRED had to become a real state; while "expiring" was the worst thing
// that could happen to a document, blocking on it was the only way to make
// it mean anything.
const BLOCKS_CLEARANCE = [DOCUMENT_STATUS.PENDING, DOCUMENT_STATUS.EXPIRED];

export const isClearedToWork = (caregiver, now) =>
    !caregiver.documents.some((document) =>
        BLOCKS_CLEARANCE.includes(documentStatus(document, now))
    );

// Counts for the roster, so a summary row can say what is wrong without
// rendering every document. Derived at render like every other count in the
// app: a stored tally can disagree with the list it counts, and then someone
// has to decide which one is lying.
export const documentSummary = (caregiver, now) => {
    const summary = {
        total: caregiver.documents.length,
        [DOCUMENT_STATUS.SIGNED]: 0,
        [DOCUMENT_STATUS.PENDING]: 0,
        [DOCUMENT_STATUS.EXPIRING]: 0,
        [DOCUMENT_STATUS.EXPIRED]: 0,
    };

    for (const document of caregiver.documents) {
        summary[documentStatus(document, now)] += 1;
    }

    return summary;
};

// Whole days until expiry, rounded away from zero, so "expires in 1 day"
// covers the last few hours rather than reading as zero. Negative once the
// date has passed, which is what "18 days ago" needs.
//
// The sign is taken from the raw difference rather than from the rounded
// result. Math.ceil of a small negative number is -0, and -0 >= 0 is true, so
// a document that lapsed last night would have rendered as expiring "in 0
// days" instead of having expired.
export const daysUntil = (isoString, now) => {
    const difference = new Date(isoString).getTime() - now;

    return difference >= 0
        ? Math.ceil(difference / DAY)
        : -Math.ceil(-difference / DAY);
};
