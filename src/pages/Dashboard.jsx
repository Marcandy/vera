import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getVisits } from "../services/visitService";
import { VISIT_STATUS } from "../utils/status";
import { countByStatus, sumCost } from "../utils/visits";
import { formatCurrency, formatDateTime } from "../utils/format";
import { visitsNeedingAttention } from "../utils/attention";
import { useNow } from "../hooks/useNow";
import AttentionFlag from "../components/AttentionFlag";
import LoadError from "../components/LoadError";
import styles from "./Dashboard.module.css";

// Denise's stated need is knowing what wants her within five seconds of
// landing. A list of ten visits does not answer that; it makes her read.
// These two tiles are the only ones she can act on, which is why they sit
// apart from the rest and why the pipeline counts below them are quieter.
const ACTIONABLE = [
    {
        status: VISIT_STATUS.NEEDS_REVIEW,
        title: "Need review",
        blurb: "Missing evidence is holding these out of billing",
    },
    {
        status: VISIT_STATUS.READY_TO_BILL,
        title: "Ready to bill",
        blurb: "Verified and waiting on a claim",
    },
];

const PIPELINE = [
    { status: VISIT_STATUS.IN_PROGRESS, title: "In progress" },
    { status: VISIT_STATUS.SCHEDULED, title: "Scheduled" },
    { status: VISIT_STATUS.BILLED, title: "Billed" },
];

const Dashboard = () => {
    const [visitList, setVisitList] = useState(null);
    const [loadError, setLoadError] = useState(null);
    // Bumping this re-runs the effect, which is what Try again needs: the
    // request is the effect's job, so retrying means asking for the effect
    // again rather than calling the service from a handler.
    const [reloadKey, setReloadKey] = useState(0);

    // The counts below answer what is in the pipeline. This answers what is
    // going wrong right now, which the pipeline cannot see: a visit sitting
    // scheduled past its appointment still counts as scheduled.
    const now = useNow();

    useEffect(() => {
        let stale = false;
        async function fetchData() {
            try {
                const visits = await getVisits();
                if (!stale) {
                    setVisitList(visits);
                    setLoadError(null);
                }
            } catch (err) {
                // Without this the promise rejects into nothing and the page
                // sits on "Loading..." for as long as anyone leaves it open.
                if (!stale) setLoadError(err.message);
            }
        }
        fetchData();
        return () => { stale = true; };
    }, [reloadKey]);

    if (loadError) return (
        <LoadError
            message={`The dashboard could not load. ${loadError}`}
            onRetry={() => setReloadKey((key) => key + 1)}
        />
    );

    if (visitList === null) return <p>Loading...</p>

    // Derived at render from the records themselves, so a count can never
    // disagree with the list it summarizes.
    const counts = countByStatus(visitList);
    const needsAttention = visitsNeedingAttention(visitList, now);
    const readyToBillTotal = sumCost(
        visitList.filter((visit) => visit.status === VISIT_STATUS.READY_TO_BILL)
    );

    if (visitList.length === 0) {
        return (
            <section className={styles.dashboard}>
                <h3>Dashboard</h3>
                <p className={styles.emptyState}>
                    No visits yet. Once visits are scheduled, this is where
                    what needs your attention will show up.
                </p>
            </section>
        );
    }

    return (
        <section className={styles.dashboard}>
            <h3>Dashboard</h3>

            <div className={styles.actionRow}>
                {ACTIONABLE.map(({ status, title, blurb }) => (
                    <Link
                        key={status}
                        to={`/visits?status=${encodeURIComponent(status)}`}
                        className={styles.actionTile}
                    >
                        <span className={styles.tileCount}>{counts[status] ?? 0}</span>
                        <span className={styles.tileTitle}>{title}</span>
                        <span className={styles.tileBlurb}>{blurb}</span>
                    </Link>
                ))}

                <Link to="/billing" className={styles.moneyTile}>
                    <span className={styles.tileCount}>{formatCurrency(readyToBillTotal)}</span>
                    <span className={styles.tileTitle}>Ready to claim</span>
                    <span className={styles.tileBlurb}>Verified care not yet submitted</span>
                </Link>
            </div>

            {needsAttention.length > 0 && (
                <div className={styles.nudgePanel}>
                    <h4 className={styles.nudgeTitle}>Needs a nudge</h4>
                    <ul className={styles.nudgeList}>
                        {needsAttention.map(({ visit, attention }) => (
                            <li key={visit.id} className={styles.nudgeRow}>
                                <Link to={`/visits/${visit.id}`} className={styles.nudgeLink}>
                                    {visit.patientName}
                                </Link>
                                <span className={styles.nudgeMeta}>
                                    {visit.caregiverName} · {formatDateTime(visit.appointmentTime)}
                                </span>
                                <AttentionFlag attention={attention} />
                            </li>
                        ))}
                    </ul>
                    <p className={styles.nudgeNote}>
                        Derived from the clock, not stored. A punch the office
                        enters later is a manual edit, so the cheapest fix is the
                        caregiver making it.
                    </p>
                </div>
            )}

            <h4 className={styles.sectionTitle}>Everything else</h4>
            <div className={styles.pipelineRow}>
                {PIPELINE.map(({ status, title }) => (
                    <Link
                        key={status}
                        to={`/visits?status=${encodeURIComponent(status)}`}
                        className={styles.pipelineTile}
                    >
                        <span className={styles.pipelineCount}>{counts[status] ?? 0}</span>
                        <span className={styles.pipelineTitle}>{title}</span>
                    </Link>
                ))}
            </div>

            <p className={styles.allLink}>
                <Link to="/visits">See all {visitList.length} visits</Link>
            </p>
        </section>
    );
}

export default Dashboard;
