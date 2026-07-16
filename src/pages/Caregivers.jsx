import { useEffect, useState } from "react";
import styles from "./Caregivers.module.css";
import { addCaregiver, getCaregivers } from "../services/caregiverService";

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
                            <h4 className={styles.caregiverName}>{caregiver.name}</h4>
                            <p className={styles.caregiverPhone}>{caregiver.phone}</p>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default Caregivers;
