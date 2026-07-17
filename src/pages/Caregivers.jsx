import { useEffect, useState } from "react";
import styles from "./Caregivers.module.css";
import StatusPill from "../components/StatusPill";
import { addCaregiver, getCaregivers } from "../services/caregiverService";

// cleared to work is derived from the documents, never stored
const isCleared = (caregiver) =>
    caregiver.documents.every((doc) => doc.status === "signed");

const Caregivers = () => {
    const [caregiverList, setCaregiverList] = useState(null);
    
    const [error, setError] = useState(null);
    const [adding, setAdding] = useState(false);
    const [firstLast, setFirstLast] = useState("");
    const [phone, setPhone] = useState("");

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
                                {caregiver.documents.map((doc) => (
                                    <li key={doc.name} className={styles.docRow}>
                                        <span className={styles.docName}>{doc.name}</span>
                                        <StatusPill status={doc.status} />
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default Caregivers;
