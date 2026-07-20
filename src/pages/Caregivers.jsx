import { useEffect, useState } from "react";
import styles from "./Caregivers.module.css";
import StatusPill from "../components/StatusPill";
import SignatureField from "../components/SignatureField";
import { addCaregiver, getCaregivers, signDocument } from "../services/caregiverService";

// cleared to work is derived from the documents, never stored
const isCleared = (caregiver) =>
    caregiver.documents.every((doc) => doc.status === "signed");

const Caregivers = () => {
    const [caregiverList, setCaregiverList] = useState(null);
    
    const [error, setError] = useState(null);
    const [adding, setAdding] = useState(false);
    const [firstLast, setFirstLast] = useState("");
    const [phone, setPhone] = useState("");

    // which row's sign form is open: null or { caregiverId, docName }, one at a time
    const [signingDoc, setSigningDoc] = useState(null);
    const [signatureValue, setSignatureValue] = useState("");
    const [signing, setSigning] = useState(false);
    const [signError, setSignError] = useState(null);

    useEffect(()=> {
        let stale = false;
        async function fetchGiverData() {
            const caregiverData = await getCaregivers();
            if(!stale) {
                setCaregiverList(caregiverData);
            }
        }
        fetchGiverData();
        return () => { stale = true };
    }, [])

    async function handleAddCaregiver(e) {
        e.preventDefault();
        setError(null);
        setAdding(true);
        try {
            const added = await addCaregiver({ name: firstLast, phone});
            setCaregiverList([...caregiverList, added]);
            setFirstLast("");
            setPhone("");
        } catch(err) {
            setError(err.message);
        } finally {
            setAdding(false);
        }
    }

    async function handleSignDocument(caregiverId, docName) {
        setSignError(null);
        setSigning(true);

        try {
            const updated = await signDocument(caregiverId, docName, signatureValue);
            setCaregiverList((prev) =>
                prev.map((c) => (c.id === updated.id ? updated : c))
            )
            setSigningDoc(null);
            setSignatureValue("");
        } catch (err) {
            setSignError(err.message);
        } finally {
            setSigning(false);
        }
    }

    if (caregiverList === null) return (<p>Loading...</p>);

    return (
        <section className={styles.caregivers}>
            <h3 className={styles.title}>Caregivers</h3>
            
            <form className={styles.addForm} onSubmit={handleAddCaregiver}>
                <h4 className={styles.addTitle}>Add a caregiver</h4>
                <div className={styles.fieldRow}>
                    <div className={styles.field}>
                        <label className={styles.fieldLabel} htmlFor="name">Full name</label>
                        <input
                            id="name"
                            type="text"
                            className={styles.fieldInput}
                            placeholder="First and last name"
                            value={firstLast}
                            onChange={(e) => setFirstLast(e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.fieldLabel} htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            type="tel"
                            className={styles.fieldInput}
                            placeholder="215-555-0100"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>
                {error && <p className={styles.errorNote}>{error}</p>}
                <button type="submit" className={styles.addButton} disabled={adding}>
                    {adding ? "Adding..." : "Add Caregiver"}
                </button>
            </form>

            {caregiverList.length === 0 ? (
                <p className={styles.emptyState}>
                    No caregivers yet. Add your first caregiver above to start
                    tracking their onboarding documents (signed, pending,
                    expiring) and see who is cleared to work.
                </p>
            ) : (
                <ul className={styles.roster}>
                    {caregiverList.map((caregiver) => (
                        <li key={caregiver.id} className={styles.caregiverCard}>
                            <div className={styles.cardHeader}>
                                <h4 className={styles.caregiverName}>{caregiver.name}</h4>
                                {isCleared(caregiver) ? (
                                    <span className={styles.clearedBadge}>Cleared to work</span>
                                ) : (
                                    <span className={styles.notClearedBadge}>Documents outstanding</span>
                                )}
                            </div>
                            <p className={styles.caregiverPhone}>{caregiver.phone}</p>

                            <ul className={styles.docList}>
                                {caregiver.documents.map((doc) => {
                                    const isSigningThis =
                                        signingDoc?.caregiverId === caregiver.id &&
                                        signingDoc?.docName === doc.name;

                                    return (
                                        <li key={doc.name} className={styles.docRow}>
                                            <div className={styles.docRowLine}>
                                                <span className={styles.docName}>{doc.name}</span>
                                                {doc.signature && (
                                                    <span className={styles.signedName}>{doc.signature}</span>
                                                )}
                                                <span className={styles.rowActions}>
                                                    <StatusPill status={doc.status} />
                                                    {doc.status === "pending" && (
                                                        <button
                                                            type="button"
                                                            className={styles.signButton}
                                                            onClick={() => {
                                                                setSigningDoc({ caregiverId: caregiver.id, docName: doc.name });
                                                                setSignatureValue("");
                                                                setSignError(null);
                                                            }}
                                                        >
                                                            Sign
                                                        </button>
                                                    )}
                                                </span>
                                            </div>

                                            {isSigningThis && (
                                                <div className={styles.signForm}>
                                                    <SignatureField
                                                        id={`sign-${caregiver.id}-${doc.name}`}
                                                        label={`Signature for ${doc.name}`}
                                                        value={signatureValue}
                                                        onChange={setSignatureValue}
                                                    />
                                                    {signError && <p className={styles.errorNote}>{signError}</p>}
                                                    <div className={styles.signActions}>
                                                        <button
                                                            type="button"
                                                            className={styles.captureButton}
                                                            onClick={() => handleSignDocument(caregiver.id, doc.name)}
                                                            disabled={signing}
                                                        >
                                                            {signing ? "Capturing..." : "Capture signature"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={styles.cancelButton}
                                                            onClick={() => setSigningDoc(null)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default Caregivers;
