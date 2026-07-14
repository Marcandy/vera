import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import StatusPill from '../components/StatusPill';
import { getVisitById } from '../services/visitService';
import styles from './VisitDetail.module.css';

// Evidence fields checked for the needs-review panel, in pipeline order.
// patientConcern is deliberately absent — null there is normal, not missing.
const EVIDENCE_LABELS = [
    { field: 'checkInTime', label: 'Check-in time' },
    { field: 'checkOutTime', label: 'Check-out time' },
    { field: 'assessment', label: 'Visit assessment' },
    { field: 'signature', label: 'Patient signature' },
];

const formatDateTime = (isoString) =>
    new Date(isoString).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });

const formatTime = (isoString) =>
    isoString
        ? new Date(isoString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        : '—';

const VisitDetail = () => {
    const { visitId } = useParams();

    const [visit, setVisit] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return (<p>Loading...</p>);

    if (!visit) return (<p>Visit not found. <Link to="/dashboard">Back to visits</Link></p>);

    const missingEvidence = EVIDENCE_LABELS.filter(({ field }) => visit[field] === null);

    return (
        <section className={styles.visitDetail}>
            <Link to="/dashboard" className={styles.backLink}>← Back to visits</Link>

            <div className={styles.headerRow}>
                <h3>{visit.patientName}</h3>
                <StatusPill status={visit.status} />
                <Link to={`/caregiver/visits/${visit.id}`} className={styles.caregiverFlowLink}>
                    Caregiver flow →
                </Link>
            </div>

            {visit.status === 'needs review' && (
                <div className={styles.missingPanel}>
                    <h4>Missing evidence</h4>
                    <ul>
                        {missingEvidence.map(({ field, label }) => (
                            <li key={field}>{label}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className={styles.card}>
                <dl>
                    <dt>Caregiver</dt>
                    <dd>{visit.caregiverName}</dd>

                    <dt>Appointment</dt>
                    <dd>{formatDateTime(visit.appointmentTime)}</dd>

                    <dt>Check-in</dt>
                    <dd>{formatTime(visit.checkInTime)}</dd>

                    <dt>Check-out</dt>
                    <dd>{formatTime(visit.checkOutTime)}</dd>
                </dl>
            </div>

            {visit.assessment && (
                <div className={styles.card}>
                    <h4>Assessment</h4>
                    <p>{visit.assessment}</p>
                </div>
            )}

            {visit.patientConcern && (
                <div className={styles.card}>
                    <h4>Patient concern</h4>
                    <p>{visit.patientConcern}</p>
                </div>
            )}

            {visit.signature && (
                <div className={styles.signatureBox}>
                    <h4>Patient signature</h4>
                    <p className={styles.signatureName}>{visit.signature}</p>
                </div>
            )}
        </section>
    );
};

export default VisitDetail;
