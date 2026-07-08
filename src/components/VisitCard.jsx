import StatusPill from './StatusPill';
import styles from './VisitCard.module.css';

const VisitCard = ({ visit }) => {
    return (
        <article className={styles.visitCard}>
            <h3> {visit.patientName}</h3>
            <dl>
                <dt>Caregiver</dt>
                <dd>{visit.caregiverName}</dd>

                <dt>Scheduled</dt>
                <dd>{visit.scheduledAt}</dd>
            </dl>
            
            <StatusPill status={visit.status}/>
        </article>
    )
}

export default VisitCard;