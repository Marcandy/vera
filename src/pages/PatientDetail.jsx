import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import StatusPill from "../components/StatusPill";
import { getPatientById } from "../services/patientService";
import { getVisitsByPatient } from "../services/visitService";
import { formatDateTime, formatCurrency } from "../utils/format";
import styles from "./PatientDetail.module.css";

// Most recent first: a care history is read backwards from now, unlike a
// caregiver's day, which is read forwards.
const byMostRecent = (a, b) => b.appointmentTime.localeCompare(a.appointmentTime);

const PatientDetail = () => {
    const { patientId } = useParams();

    const [patient, setPatient] = useState(null);
    const [visitList, setVisitList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let stale = false;
        async function fetchAll() {
            // Both requests go out together rather than one after the other.
            // They do not depend on each other, so awaiting them in sequence
            // would spend two round trips to learn two independent facts.
            const [foundPatient, theirVisits] = await Promise.all([
                getPatientById(patientId),
                getVisitsByPatient(patientId),
            ]);
            if (!stale) {
                setPatient(foundPatient ?? null);
                setVisitList(theirVisits);
                setLoading(false);
            }
        }
        fetchAll();
        return () => { stale = true; };
    }, [patientId]);

    if (loading) return (<p>Loading...</p>);

    if (!patient) return (
        <p>Patient not found. <Link to="/patients">Back to patients</Link></p>
    );

    const history = [...visitList].sort(byMostRecent);

    return (
        <section className={styles.patientDetail}>
            <Link to="/patients" className={styles.backLink}>← Back to patients</Link>

            <h3 className={styles.title}>{patient.name}</h3>

            <div className={styles.card}>
                <dl>
                    <dt>Address</dt>
                    <dd>{patient.address}</dd>

                    <dt>Phone</dt>
                    <dd>{patient.phone}</dd>
                </dl>
            </div>

            {patient.standingConcerns && (
                <div className={styles.card}>
                    <h4>What they need help with</h4>
                    <p>{patient.standingConcerns}</p>
                    <p className={styles.note}>
                        True across every visit. What a patient raises during a
                        single visit is recorded on that visit instead.
                    </p>
                </div>
            )}

            <h4 className={styles.sectionTitle}>Care history</h4>
            {history.length === 0 ? (
                <p className={styles.emptyState}>
                    No visits recorded for this patient yet.
                </p>
            ) : (
                <ul className={styles.historyList}>
                    {history.map((visit) => (
                        <li key={visit.id} className={styles.historyRow}>
                            <Link to={`/visits/${visit.id}`} className={styles.historyLink}>
                                {formatDateTime(visit.appointmentTime)}
                            </Link>
                            <span className={styles.historyMeta}>{visit.caregiverName}</span>
                            <span className={styles.historyCost}>{formatCurrency(visit.estimatedCost)}</span>
                            <StatusPill status={visit.status} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default PatientDetail;
