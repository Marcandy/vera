import styles from './StatusPill.module.css'

const STATUS_CLASSES = {
    "scheduled": styles.scheduled,
    "in progress": styles.inProgress,
    "needs review": styles.needsReview,
    "ready to bill": styles.readyToBill,
    "billed": styles.billed,
    "signed": styles.signed,
    "pending": styles.pending,
    "expiring": styles.expiring
}

const StatusPill = ({ status }) => {
    return (
                                        //if undefined give empty give '' as class 
        <span className={`${styles.statusPill} ${STATUS_CLASSES[status] ?? ""}`}>
           {status}
        </span>
    )
}

export default StatusPill;