import { NavLink, Outlet } from "react-router";
import styles from "./Layout.module.css";

const navLinkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;

const Layout = () => {
    return (
        <div className={styles.shell}>
            <h1 className={styles.brand}>
                {/* <svg className={styles.logo} viewBox="0 0 120 100" aria-hidden="true">
                    <path d="M 20 44 L 52 82" stroke="#2f9e44" strokeWidth="17" strokeLinecap="round" fill="none" />
                    <path d="M 52 82 L 100 14" stroke="#1971c2" strokeWidth="17" strokeLinecap="round" fill="none" />
                    <circle cx="52" cy="82" r="8" fill="#1971c2" />
                    <circle cx="52" cy="82" r="4.5" fill="#69db7c" />
                </svg> */}
                {/* TEMP: proposed logo beside the current one for comparison; delete the loser */}
                <svg className={styles.logo} viewBox="0 0 140 100" aria-hidden="true">
                    <rect x="8" y="18" width="124" height="64" rx="32" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="6" />
                    <path d="M 44 50 L 64 70" fill="none" stroke="#ff6b5c" strokeWidth="11" strokeLinecap="round" />
                    <path d="M 64 70 L 102 32" fill="none" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" />
                    <circle cx="64" cy="70" r="7" fill="#ffffff" />
                    <circle cx="64" cy="70" r="4" fill="#ff6b5c" />
                </svg>
                Vera

                
            </h1>

            <aside className={styles.sidebar}>
                <nav>
                    <NavLink to="/dashboard" className={navLinkClass}>Visitlist</NavLink>
                    <NavLink to="/caregivers" className={navLinkClass}>Caregivers</NavLink>
                    <NavLink to="/billing" className={navLinkClass}>Billing</NavLink>
                </nav>
            </aside>

            <main className={styles.content}>
                <Outlet />
            </main>

            <footer className={styles.footer}>
                <span>Vera: an EVV-inspired portfolio demo. All data is fictional.</span>
                <nav className={styles.footerLinks}>
                    <a
                        className={styles.footerLink}
                        href="https://www.medicaid.gov/medicaid/home-community-based-services/guidance/electronic-visit-verification-evv/index.html"
                        target="_blank"
                        rel="noreferrer"
                    >
                        What is EVV?
                    </a>
                </nav>
            </footer>
        </div>
    );
};

export default Layout;
