import { Link } from "react-router";
import VisitCard from "../components/VisitCard";
import styles from "./Dashboard.module.css";
import { getVisits } from "../services/visitService";
import { useEffect, useState } from "react";


const Dashboard = () => {
    const [ visitList, setVisitList ] = useState(null);

    useEffect(()=> {
        async function fetchData() {
            const visitListData = await getVisits();
            setVisitList(visitListData);

        }
        fetchData();
    },[])

    if(visitList === null) return <p>Loading...</p>
    if(visitList.length === 0) return <></> /*empty state */

    return (
        <section className={styles.dashboard}>
            <h3>Visits</h3>

            <ul className={styles.visitList}>
                {visitList.map((visit) => (
                    <li key={visit.id}>
                        <Link
                            to={`/visits/${visit.id}`}
                            className={styles.cardLink}
                        >
                            <VisitCard visit={visit} />
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default Dashboard;
