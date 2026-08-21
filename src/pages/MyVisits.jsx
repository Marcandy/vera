import { useEffect, useState } from "react";
import { Link } from "react-router";
import VisitCard from "../components/VisitCard";
import { getVisitsByCaregiver } from "../services/visitService";
import { useSession } from "../context/sessionContext";
import styles from "./MyVisits.module.css";

// Chronological, not by attention rank. The dashboard orders by what needs
// Denise to act; a caregiver works through a day in the order it happens.
const byAppointment = (a, b) => a.appointmentTime.localeCompare(b.appointmentTime);

const MyVisits = () => {
    const { user, loading } = useSession();

    const [visitList, setVisitList] = useState(null);

    // The caregiver id comes from the session, never from the URL. A route
    // like /my-visits?caregiverId=3 would let anyone read a colleague's
    // patients by typing, and the server-side version of that mistake is a
    // controller trusting a client-supplied actor instead of the principal.
    const caregiverId = user?.caregiverId ?? null;

    useEffect(() => {
        if (caregiverId === null) return;

        let stale = false;
        async function fetchVisits() {
            const visits = await getVisitsByCaregiver(caregiverId);
            if (!stale) setVisitList(visits);
        }
        fetchVisits();
        return () => { stale = true; };
    }, [caregiverId]);

    // While the session is still unknown, user is null but nobody is signed
    // out yet. Answering here would flash "nobody is signed in" at a
    // caregiver who is, on every refresh. This is what the third state is for.
    if (loading) return <p>Loading...</p>

    // Two different reasons for an empty screen, and they need different
    // answers. Nobody signed in is not the same as signed in without a
    // caregiver record, and telling a visitor that "your account" lacks
    // something claims an account they do not have.
    if (!user) {
        return (
            <section className={styles.myVisits}>
                <h3>My visits</h3>
                <p className={styles.emptyState}>
                    Nobody is signed in, so there is no schedule to show.
                    <br />
                    <Link to="/">Sign in</Link> to see your visits.
                </p>
            </section>
        );
    }

    // An admin has no caregiver record, so an empty visit list would be a
    // misleading answer to a question they cannot ask.
    if (caregiverId === null) {
        return (
            <section className={styles.myVisits}>
                <h3>My visits</h3>
                <p className={styles.emptyState}>
                    This view belongs to a caregiver, and your account is not
                    linked to a caregiver record. The{" "}
                    <Link to="/visits">visit list</Link> has every visit in
                    the agency.
                </p>
            </section>
        );
    }

    if (visitList === null) return <p>Loading...</p>

    return (
        <section className={styles.myVisits}>
            <h3>My visits</h3>
            <p className={styles.subtitle}>Signed in as {user.name}</p>

            {visitList.length === 0 ? (
                <p className={styles.emptyState}>
                    No visits are assigned to you yet. Scheduled visits will
                    appear here.
                </p>
            ) : (
                <ul className={styles.visitList}>
                    {[...visitList].sort(byAppointment).map((visit) => (
                        <li key={visit.id}>
                            <Link
                                to={`/caregiver/visits/${visit.id}`}
                                className={styles.cardLink}
                            >
                                <VisitCard visit={visit} />
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default MyVisits;
