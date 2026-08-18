import { Link } from "react-router";
import VisitCard from "../components/VisitCard";
import styles from "./Visits.module.css";
import { getVisits } from "../services/visitService";
import { VISIT_STATUS } from "../utils/status";
import { useEffect, useState } from "react";

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

// Tiebreak oldest appointment first: the longest-waiting visit is the most
// urgent one in its group. ISO strings compare lexicographically, which is
// the reason the visit shape stores them as strings.
const byAttention = (a, b) => {
    const rankDiff =
        (STATUS_RANK[a.status] ?? RANK_UNKNOWN) - (STATUS_RANK[b.status] ?? RANK_UNKNOWN);

    if (rankDiff !== 0) return rankDiff;

    return a.appointmentTime.localeCompare(b.appointmentTime);
};

const Visits = () => {
    const [ visitList, setVisitList ] = useState(null);

    useEffect(()=> {
        async function fetchData() {
            const visitListData = await getVisits();
            setVisitList(visitListData);

        }
        fetchData();
    },[])

    if(visitList === null) return <p>Loading...</p>
    if(visitList.length === 0) {
        return (
            <section className={styles.visits}>
                <h3>Visits</h3>
                <p className={styles.emptyState}>
                    No visits yet. Scheduled visits will appear here.
                </p>
            </section>
        );
    }

    // Sort a COPY. getVisits() hands back the live seed array, so sorting in
    // place would reorder the data source every component reads from.
    const orderedVisits = [...visitList].sort(byAttention);

    return (
        <section className={styles.visits}>
            <h3>Visits</h3>

            <ul className={styles.visitList}>
                {orderedVisits.map((visit) => (
                    <li key={visit.id}>
                        <Link
                            to={`/visits/${visit.id}`}
                            className={styles.cardLink}
                        >
                            <VisitCard visit={visit} />
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default Visits;
