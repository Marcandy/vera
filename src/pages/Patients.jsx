import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getPatients } from "../services/patientService";
import styles from "./Patients.module.css";

const Patients = () => {
    const [patientList, setPatientList] = useState(null);

    useEffect(() => {
        let stale = false;
        async function fetchPatients() {
            const results = await getPatients();
            if (!stale) setPatientList(results);
        }
        fetchPatients();
        return () => { stale = true; };
    }, []);

    if (patientList === null) return <p>Loading...</p>

    return (
        <section className={styles.patients}>
            <h3 className={styles.title}>Patients</h3>

            {patientList.length === 0 ? (
                <p className={styles.emptyState}>
                    No patients yet. Patients appear here once they are on the
                    schedule.
                </p>
            ) : (
                <ul className={styles.roster}>
                    {patientList.map((patient) => (
                        <li key={patient.id}>
                            <Link to={`/patients/${patient.id}`} className={styles.cardLink}>
                                <article className={styles.patientCard}>
                                    <h4 className={styles.patientName}>{patient.name}</h4>
                                    <p className={styles.address}>{patient.address}</p>
                                    <p className={styles.phone}>{patient.phone}</p>
                                </article>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default Patients;
