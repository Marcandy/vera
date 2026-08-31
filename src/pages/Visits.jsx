import { Link, useSearchParams } from "react-router";
import VisitCard from "../components/VisitCard";
import styles from "./Visits.module.css";
import { getVisits } from "../services/visitService";
import { VISIT_STATUS, VISIT_STATUS_LIST, parseVisitStatus } from "../utils/status";
import { useEffect, useState } from "react";
import { useNow } from "../hooks/useNow";
import { attentionFor } from "../utils/attention";

// Denise's attention order, lowest rank first. This is a property of THIS
// screen, not of the collection, so it lives here and not in the service:
// the first two need her to act, the rest are just status.
const STATUS_RANK = {
    [VISIT_STATUS.NEEDS_REVIEW]: 0,
    [VISIT_STATUS.READY_TO_BILL]: 1,
    [VISIT_STATUS.IN_PROGRESS]: 2,
    [VISIT_STATUS.SCHEDULED]: 3,
    [VISIT_STATUS.BILLED]: 4,
};

// An unrecognized status means a broken pipeline, not a real position.
// It parks at the end; StatusPill is what fails visibly, by rendering bare.
const RANK_UNKNOWN = Number.MAX_SAFE_INTEGER;

// Oldest appointment first: the longest-waiting visit is the most urgent one
// in its group. ISO strings compare lexicographically, which is the reason
// the visit shape stores them as strings.
const byDate = (a, b) => a.appointmentTime.localeCompare(b.appointmentTime);

const byAttention = (a, b) => {
    const rankDiff =
        (STATUS_RANK[a.status] ?? RANK_UNKNOWN) - (STATUS_RANK[b.status] ?? RANK_UNKNOWN);

    if (rankDiff !== 0) return rankDiff;

    return byDate(a, b);
};

const SORTS = { attention: byAttention, date: byDate };

const Visits = () => {
    const [visitList, setVisitList] = useState(null);

    // Ticks so a visit crossing its threshold flags itself without a reload.
    const now = useNow();

    // Filter and sort live in the URL, not in useState. This is VIEW state:
    // what am I looking at. That makes it shareable, bookmarkable, and it
    // restores on the back button for free. Note the opposite call on
    // MyVisits, where the caregiver id must NEVER come from the URL: that is
    // identity, and identity a user can type is an authorization hole. Same
    // app, opposite answers, for different reasons.
    const [searchParams, setSearchParams] = useSearchParams();

    // The URL is untrusted input. ?status=bogus falls back to unfiltered
    // rather than rendering a blank list with nothing to explain it.
    const activeStatus = parseVisitStatus(searchParams.get("status"));
    const activeSort = SORTS[searchParams.get("sort")] ? searchParams.get("sort") : "attention";

    useEffect(() => {
        let stale = false;
        async function fetchData() {
            const visitListData = await getVisits();
            if (!stale) setVisitList(visitListData);
        }
        fetchData();
        return () => { stale = true; };
    }, []);

    // Replace rather than push: filtering is not a place you navigated to,
    // so twelve chip clicks should not mean twelve presses of the back button
    // to leave the page.
    const setParam = (key, value) => {
        const next = new URLSearchParams(searchParams);
        if (value === null) next.delete(key);
        else next.set(key, value);
        setSearchParams(next, { replace: true });
    };

    if (visitList === null) return <p>Loading...</p>

    // Filtering runs over the list already in hand. For ten rows a refetch on
    // every chip click would be slower and no more correct; with a real
    // backend and pagination this becomes a query parameter instead.
    const filtered = activeStatus
        ? visitList.filter((visit) => visit.status === activeStatus)
        : visitList;

    // Sort a COPY. getVisits() hands back the live seed array, so sorting in
    // place would reorder the data source every component reads from.
    const ordered = [...filtered].sort(SORTS[activeSort]);

    return (
        <section className={styles.visits}>
            <div className={styles.headerRow}>
                <h3>Visits</h3>
                <label className={styles.sortControl}>
                    Sort
                    <select
                        className={styles.sortSelect}
                        value={activeSort}
                        onChange={(e) => setParam("sort", e.target.value)}
                    >
                        <option value="attention">Needs attention first</option>
                        <option value="date">Soonest first</option>
                    </select>
                </label>
            </div>

            <div className={styles.filterBar} role="group" aria-label="Filter by status">
                <button
                    type="button"
                    className={activeStatus === null ? `${styles.chip} ${styles.chipActive}` : styles.chip}
                    aria-pressed={activeStatus === null}
                    onClick={() => setParam("status", null)}
                >
                    All ({visitList.length})
                </button>
                {VISIT_STATUS_LIST.map((status) => {
                    const count = visitList.filter((visit) => visit.status === status).length;
                    return (
                        <button
                            key={status}
                            type="button"
                            className={activeStatus === status ? `${styles.chip} ${styles.chipActive}` : styles.chip}
                            aria-pressed={activeStatus === status}
                            onClick={() => setParam("status", status)}
                        >
                            {status} ({count})
                        </button>
                    );
                })}
            </div>

            {visitList.length === 0 ? (
                <p className={styles.emptyState}>
                    No visits yet. Scheduled visits will appear here.
                </p>
            ) : ordered.length === 0 ? (
                // A filter matching nothing is a different fact from an empty
                // agency, and it needs its own way out.
                <p className={styles.emptyState}>
                    No visits are {activeStatus}.{" "}
                    <button type="button" className={styles.linkButton} onClick={() => setParam("status", null)}>
                        Show all visits
                    </button>
                </p>
            ) : (
                <ul className={styles.visitList}>
                    {ordered.map((visit) => (
                        <li key={visit.id}>
                            <Link to={`/visits/${visit.id}`} className={styles.cardLink}>
                                <VisitCard visit={visit} attention={attentionFor(visit, now)} />
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default Visits;
