import { NavLink, Outlet } from "react-router";
import styles from "./Layout.module.css";

const navLinkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;

const Layout = () => {
    return (
        <div className={styles.shell}>
            <h1 className={styles.brand}>
                <svg className={styles.logo} viewBox="0 0 120 100" aria-hidden="true">
                    <path d="M 20 44 L 52 82" stroke="#2f9e44" strokeWidth="17" strokeLinecap="round" fill="none" />
                    <path d="M 52 82 L 100 14" stroke="#1971c2" strokeWidth="17" strokeLinecap="round" fill="none" />
                    <circle cx="52" cy="82" r="8" fill="#1971c2" />
                    <circle cx="52" cy="82" r="4.5" fill="#69db7c" />
                </svg>
                Vera
            </h1>

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
