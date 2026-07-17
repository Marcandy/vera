import { useState } from "react";
import styles from "./Homepage.module.css";
import { useNavigate } from "react-router";

const Homepage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    function handleLogin(e) {
        e.preventDefault();
        navigate("/dashboard");
    }
    return (
        <div className={styles.page}>
            <h1 className={styles.brand}>Vera</h1>

            <section className={styles.home}>
                <div className={styles.intro}>
                    <h2 className={styles.title}>Verified Care</h2>
                    <p className={styles.lead}>
                        Vera is a workspace for small home care agencies. Caregivers
                        check in at the patient's home, complete a short assessment,
                        and capture the patient's signature. Every verified visit
                        becomes a billing-ready record, with no chasing paperwork.
                    </p>
                </div>

                <form className={styles.loginCard} onSubmit={handleLogin}>
                    <h3 className={styles.loginTitle}>Sign in</h3>
                    <div className={styles.field}>
                        <label className={styles.fieldLabel} htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className={styles.fieldInput}
                            placeholder="denise@agency.com"
                            autoComplete="email"
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.fieldLabel} htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className={styles.fieldInput}
                            placeholder="Password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className={styles.signInButton}>Sign In</button>
                    <p className={styles.demoNote}>
                        Demo app: sign-in is simulated, no account needed.
                    </p>
                </form>
            </section>

            <footer className={styles.pageFooter}>
                Vera: an EVV-inspired portfolio demo. All data is fictional.
            </footer>
        </div>
    );
};

export default Homepage;
