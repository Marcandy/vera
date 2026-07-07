import styles from './StatusPill.module.css'

const STATUS_CLASSES = {
    "pending": styles.pending,
    "complete": styles.complete,
    "needs review": styles.needsReview,
    "ready to bill": styles.readyToBill
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