import VisitCard from "./VisitCard";
import styles from "./Dashboard.module.css";

const VISITS = [
    { id: 1, patientName: "Eleanor Whitfield", caregiverName: "Marcus Reed",     appointmentTime: "2026-07-07T14:00", status: "needs review" },
    { id: 2, patientName: "Samuel Okafor",     caregiverName: "Dana Alvarez",    appointmentTime: "2026-07-07T16:30", status: "needs review" },
    { id: 3, patientName: "Rosa Delgado",      caregiverName: "Marcus Reed",     appointmentTime: "2026-07-07T09:00", status: "ready to bill" },
    { id: 4, patientName: "Harold Brennan",    caregiverName: "Keisha Thompson", appointmentTime: "2026-07-07T11:30", status: "ready to bill" },
    { id: 5, patientName: "Miriam Katz",       caregiverName: "Dana Alvarez",    appointmentTime: "2026-07-08T08:00", status: "in progress" },
    { id: 6, patientName: "George Antonelli",  caregiverName: "Keisha Thompson", appointmentTime: "2026-07-08T13:00", status: "scheduled" },
    { id: 7, patientName: "Pearl Jackson",     caregiverName: "Marcus Reed",     appointmentTime: "2026-07-07T08:00", status: "billed" }
];

const Dashboard = () => {
    return (
        <section className={styles.dashboard}>
            <h3>Visits</h3>

            <ul className={styles.visitList}>
                {VISITS.map((visit) => (
                    <li key={visit.id}>
                        <VisitCard visit={visit} />
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default Dashboard;
