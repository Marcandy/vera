import StatusPill from './StatusPill';
import styles from './VisitCard.module.css';

const formatAppointment = (isoString) =>
    new Date(isoString).toLocaleString("en-US", {
        month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
    });

const VisitCard = ({ visit }) => {
    return (
        <article className={styles.visitCard}>
            <h4>{visit.patientName}</h4>
            <dl>
                <dt>Caregiver</dt>
                <dd>{visit.caregiverName}</dd>

                <dt>Appointment</dt>
                <dd>{formatAppointment(visit.appointmentTime)}</dd>
            </dl>

            <StatusPill status={visit.status}/>
        </article>
    )
}

export default VisitCard;
