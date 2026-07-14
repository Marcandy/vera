import styles from "./Caregivers.module.css";

const Caregivers = () => {
    return (
        <section className={styles.caregivers}>
            <h3 className={styles.title}>Caregivers</h3>
            <p className={styles.emptyState}>
                No caregivers yet. Your team roster will live here. Add a
                caregiver to start tracking their onboarding documents
                (signed, pending, expiring) and see who is cleared to work.
            </p>
        </section>
    );
};

export default Caregivers;
