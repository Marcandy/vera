import StatusPill from './StatusPill';
import { formatDateTime } from '../utils/format';
import styles from './VisitCard.module.css';

const VisitCard = ({ visit }) => {
    return (
        <article className={styles.visitCard}>
            <h4>{visit.patientName}</h4>
            <dl>
                <dt>Caregiver</dt>
                <dd>{visit.caregiverName}</dd>

                <dt>Appointment</dt>
                <dd>{formatDateTime(visit.appointmentTime)}</dd>
            </dl>

            <StatusPill status={visit.status}/>
        </article>
    )
}

export default VisitCard;
