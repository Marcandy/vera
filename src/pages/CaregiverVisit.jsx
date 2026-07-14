import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import StatusPill from "../components/StatusPill";
import { checkInVisit, getVisitById } from "../services/visitService";
import styles from "./CaregiverVisit.module.css";

const formatDateTime = (isoString) =>
    new Date(isoString).toLocaleString("en-US", {
        month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
    });

const formatTime = (isoString) =>
    isoString
        ? new Date(isoString).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
        : "—";

const CaregiverVisit = () => {
    const { visitId } = useParams();

    const [visit, setVisit] = useState(null);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);
    const [checkingIn, setCheckingIn] = useState(false);

    useEffect(() => {
        let stale = false;
        async function fetchData() {
            const result = await getVisitById(Number(visitId));
            if (!stale) {
                setVisit(result ?? null);
                setLoading(false);
            }
        }
        fetchData();
        return () => { stale = true; };
    }, [visitId]);

    async function handleCheckIn () {
        setError(null);
        setCheckingIn(true);
        try {
            const newVisit = await checkInVisit(visit.id);
            setVisit(newVisit)
        } catch (err) {
            setError(err.message);
        } finally {
            setCheckingIn(false);
        }
    }

    if (loading) return (<p>Loading...</p>);

    if (!visit) return (<p>Visit not found. <Link to="/dashboard">Back to visits</Link></p>);

    return (
        <section className={styles.caregiverVisit}>
            <Link to={`/visits/${visit.id}`} className={styles.backLink}>← Back to visit detail</Link>

            <p className={styles.roleBanner}>Caregiver check-in</p>

            <div className={styles.headerRow}>
                <h3 className={styles.title}>{visit.patientName}</h3>
                <StatusPill status={visit.status} />
            </div>

            <dl className={styles.meta}>
                <dt>Appointment</dt>
                <dd>{formatDateTime(visit.appointmentTime)}</dd>

                <dt>Caregiver</dt>
                <dd>{visit.caregiverName}</dd>
            </dl>

            {visit.status === "scheduled" && (
                <>
                    <button onClick={handleCheckIn} className={styles.checkInButton} disabled={checkingIn}>
                        {checkingIn ? "Checking in..." : "Check In"}
                    </button>
                    <p className={styles.mockNote}>Location is mocked in this MVP. Check-in records the time.</p>
                </>
            )}
            {error && <p className={styles.errorNote}>{error}</p> }

            {visit.status === "in progress" && (
                <div className={styles.checkedInCard}>
                    <p className={styles.checkedInTime}>Checked in at {formatTime(visit.checkInTime)}</p>
                    <p className={styles.mockLocation}>Location: verified (mock)</p>
                    <p className={styles.nextStep}>
                        Assessment and patient signature are captured at check-out.
                    </p>
                </div>
            )}

            {!["scheduled", "in progress"].includes(visit.status) && (
                <p className={styles.closedNote}>
                    This visit is {visit.status} — no caregiver actions available.
                </p>
            )}
        </section>
    );
};

export default CaregiverVisit;
