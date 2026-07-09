import { NavLink, Outlet } from "react-router";
import styles from "./Layout.module.css";

const navLinkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;

const Layout = () => {
    return (
        <div className={styles.shell}>
            <h1 className={styles.brand}>Vera</h1>

            <aside className={styles.sidebar}>
                <nav>
                    <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                    <NavLink to="/caregivers" className={navLinkClass}>Caregivers</NavLink>
                    <NavLink to="/billing" className={navLinkClass}>Billing</NavLink>
                </nav>
            </aside>

            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
