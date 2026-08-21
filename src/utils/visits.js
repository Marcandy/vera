// Derivations over a list of visits. Extracted from Billing when the
// dashboard needed the same money total: two screens computing a dollar
// figure with two copies of the same reduce is how they start disagreeing.
export const sumCost = (list) =>
    list.reduce((total, visit) => total + visit.estimatedCost, 0);

// Counts keyed by status, derived at render and never stored, for the same
// reason the missing-evidence panel is derived: a stored count can disagree
// with the records it counts, and then you have to decide which one lies.
export const countByStatus = (list) =>
    list.reduce((counts, visit) => {
        counts[visit.status] = (counts[visit.status] ?? 0) + 1;
        return counts;
    }, {});
