import styles from "./SignatureField.module.css";


const SignatureField = ({ id, label, value, onChange}) => {
    return (
        <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor={id}>
                {label}
            </label>
            <input
                id={id}
                type="text"
                autoComplete="off"
                className={styles.SignatureInput}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    ); 
};

export default SignatureField;
