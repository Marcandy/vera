import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getVisits } from "../services/visitService";
import styles from "./Billing.module.css";

const formatDate = (isoString) =>
    new Date(isoString).toLocaleString("en-US", {
        month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
    });

const formatCurrency = (amount) =>
    amount.toLocaleString("en-US", { style: "currency", currency: "USD" });

// hours between two ISO strings; Date minus Date yields milliseconds
const hoursBetween = (checkIn, checkOut) =>
    ((new Date(checkOut) - new Date(checkIn)) / 3600000).toFixed(1);

const Billing = () => {

    const [ readyToBillVisits, setReadyToBill] = useState(null);
    // loading guardrail
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        async function fetchVisits () {
            const results = await getVisits();
            const filteredVisit = results.filter((visit) => {
                return visit.status === "ready to bill"
            })

            setReadyToBill(filteredVisit);
            setLoading(false);
        }

        fetchVisits();

    }, [])

    if (loading) return <p>Loading...</p>

    if (readyToBillVisits.length === 0) {
        return (
            <section className={styles.billing}>
                <h3>Billing</h3>
                <p className={styles.emptyState}>
                    No visits are ready to bill yet. Verified visits appear
                    here once their evidence is complete.
                </p>
            </section>
        );
    }

    const total = readyToBillVisits.reduce(
        (sum, visit) => sum + visit.estimatedCost, 0
    );

    return (
        <section className={styles.billing}>
            <h3>Billing</h3>

            <table className={styles.claimsTable}>
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Date</th>
                        <th className={styles.amountCol}>Hours</th>
                        <th className={styles.amountCol}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {readyToBillVisits.map((visit) => (
                        <tr key={visit.id}>
                            <td>
                                <Link to={`/visits/${visit.id}`} className={styles.patientLink}>
                                    {visit.patientName}
                                </Link>
                            </td>
                            <td>{formatDate(visit.appointmentTime)}</td>
                            <td className={styles.amountCol}>
                                {hoursBetween(visit.checkInTime, visit.checkOutTime)}
                            </td>
                            <td className={styles.amountCol}>
                                {formatCurrency(visit.estimatedCost)}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3}>
                            Total ({readyToBillVisits.length} visit{readyToBillVisits.length > 1 ? "s" : ""})
                        </td>
                        <td className={styles.amountCol}>{formatCurrency(total)}</td>
                    </tr>
                </tfoot>
            </table>
        </section>
    );
}

export default Billing;
