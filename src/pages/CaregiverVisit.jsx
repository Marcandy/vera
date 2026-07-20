import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import StatusPill from "../components/StatusPill";
import { checkInVisit, checkOutVisit, getVisitById, supplyEvidence } from "../services/visitService";
import styles from "./CaregiverVisit.module.css";
import SignatureField from "../components/SignatureField";
import { formatDateTime, formatTime } from "../utils/format";

// Evidence fields for the needs-review supply panel, in pipeline order.
// Duplicated from VisitDetail for now; extraction is a parked card.
const EVIDENCE_LABELS = [
    { field: "checkInTime", label: "Check-in time" },
    { field: "checkOutTime", label: "Check-out time" },
    { field: "assessment", label: "Visit assessment" },
    { field: "signature", label: "Patient signature" },
];

const CaregiverVisit = () => {
    const { visitId } = useParams();

    const [visit, setVisit] = useState(null);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);
    const [checkingIn, setCheckingIn] = useState(false);
    const [checkingOut, setCheckingOut] = useState(false);

    const [assessment, setAssessment] = useState("");
    const [signature, setSignature] = useState("");
    const [confirmNoSignature, setConfirmNoSignature] = useState(false);


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

    async function handleCheckOut(e) {
        e.preventDefault();
        setError(null);

        //flag at door first to warn about submission without signature
        if (!signature.trim() && !confirmNoSignature) {
            setConfirmNoSignature(true);
            return;
        }

        setCheckingOut(true);
        try {
            const checkOutData = await checkOutVisit(visit.id, {assessment, signature});
            setVisit(checkOutData);
        } catch(err) {
            setError(err.message);
        } finally {
            setCheckingOut(false);
        }
    }

    async function handleSupplyEvidence(e) {
        e.preventDefault();
        setError(null);

        setCheckingOut(true);
        try {
            const updated = await supplyEvidence(visit.id, { assessment, signature });
            setVisit(updated);
        } catch (err) {
            setError(err.message);
        } finally {
            setCheckingOut(false);
        }
    }

    if (loading) return (<p>Loading...</p>);

    if (!visit) return (<p>Visit not found. <Link to="/dashboard">Back to visits</Link></p>);

    const missingSignature = !signature.trim();
    const showNoSignatureWarning = confirmNoSignature && missingSignature;
    const checkOutLabel = checkingOut
        ? "Checking out..."
        : showNoSignatureWarning ? "Check Out Anyway" : "Check Out";
    const missingEvidence = EVIDENCE_LABELS.filter(({ field }) => visit[field] === null);

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

                    <form className={styles.checkOutForm} onSubmit={handleCheckOut}>
                        <label className={styles.fieldLabel} htmlFor="assessment">Visit assessment</label>
                        <textarea
                            id="assessment"
                            className={styles.fieldInput}
                            rows={4}
                            placeholder="Care provided during this visit..."
                            value={assessment}
                            onChange={(e) => setAssessment(e.target.value)}
                        />

                        <SignatureField
                            id="signature"
                            label="Patient signature (typed)"
                            value={signature}
                            onChange={setSignature}
                            placeholder="Patient types their full name"
                        />

                        {/* warning state for signature*/
                            showNoSignatureWarning && (
                                <p className={styles.warningNote}>
                                    No patient signature. This visit will be flagged for review at check-out.
                                </p>
                            )
                        }

                        <button type="submit" className={styles.checkOutButton} disabled={checkingOut}>
                            {checkOutLabel}
                        </button>
                    </form>
                </div>
            )}

            {visit.status === "needs review" && (
                <div className={styles.supplyCard}>
                    <h4 className={styles.supplyTitle}>Missing evidence</h4>
                    <ul className={styles.missingList}>
                        {missingEvidence.map(({ field, label }) => (
                            <li key={field}>{label}</li>
                        ))}
                    </ul>

                    {visit.checkOutTime === null && (
                        <p className={styles.warningNote}>
                            Check-out time can't be added after a visit. This needs office follow-up.
                        </p>
                    )}

                    <form className={styles.checkOutForm} onSubmit={handleSupplyEvidence}>
                        {visit.assessment === null && (
                            <>
                                <label className={styles.fieldLabel} htmlFor="assessment">Visit assessment</label>
                                <textarea
                                    id="assessment"
                                    className={styles.fieldInput}
                                    rows={4}
                                    placeholder="Care provided during this visit..."
                                    value={assessment}
                                    onChange={(e) => setAssessment(e.target.value)}
                                />
                            </>
                        )}

                        {visit.signature === null && (
                            <>
                                <SignatureField
                                    id="signature"
                                    label="Patient signature (typed)"
                                    value={signature}
                                    onChange={setSignature}
                                    placeholder="Patient types their full name"
                                />
                            </>
                        )}

                        {/* pending flag + disabled */}
                        <button type="submit" className={styles.checkOutButton} disabled={checkingOut}>
                            { checkingOut ? "Submitting..." : "Submit Evidence" }
                        </button>
                    </form>
                </div>
            )}

            {!["scheduled", "in progress", "needs review"].includes(visit.status) && (
                <p className={styles.closedNote}>
                    This visit is {visit.status}. No caregiver actions available.
                </p>
            )}
        </section>
    );
};

export default CaregiverVisit;
