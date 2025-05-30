import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { apiClient, setToken } from "../models/apiClient";
import { useCenterRoot } from "../hooks/useCenterRoot";
import { Main } from "../components/Main";
import { PrimaryButton } from "../components/PrimaryButton";
import { Input } from "../components/Input";
import { PasswordInput } from "../components/PasswordInput";

import styles from "./Register.module.scss";
import { isAxiosError } from "axios";

export function Register() {
    const [registerError, setRegisterError] = useState("");
    const navigate = useNavigate();

    useCenterRoot();

    async function register(formData: FormData) {
        try {
            const user = Object.fromEntries(formData);
            const res = await apiClient.post("/register", user);

            const { token } = res.data;

            setToken(token);
            navigate("/");
        } catch (err) {
            if (!isAxiosError(err) || err.status !== 409) {
                throw err;
            }

            setRegisterError("Email already taken.");
        }
    }

    return (
        <>
            <nav className={styles.nav}>
                <Link to="/login">Login</Link>
            </nav>
            <Main fitContent>
                <h1>Register</h1>
                <form className={styles.form} action={register}>
                    <Input type="email" id="email" label="Email" name="email" required />
                    <Input id="fullName" label="Full name" name="fullName" required />
                    <SetPasswordField />
                    <PrimaryButton>Register</PrimaryButton>
                    {registerError && <p className={styles.errorMessage}>{registerError}</p>}
                </form>
            </Main>
        </>
    );
}

function SetPasswordField() {
    const [password, setPassword] = useState("");

    return (
        <>
            <PasswordInput
                id="password"
                label="Password"
                name="password"
                minLength={8}
                required
                onInput={(e) => setPassword(e.currentTarget.value)}
                value={password}
            />
            <PasswordRules password={password} />
        </>
    );
}

type PasswordRulesProps = { password: string };
function PasswordRules({ password }: PasswordRulesProps) {
    return (
        <ul className={styles.passwordRules}>
            <li className={password.length >= 8 ? styles.satisfied : undefined}>8 characters long</li>
            <li className={password.match(/[a-z]/) ? styles.satisfied : undefined}>1 lowercase letter</li>
            <li className={password.match(/[A-Z]/) ? styles.satisfied : undefined}>1 uppercase letter</li>
            <li className={password.match(/[0-9]/) ? styles.satisfied : undefined}>1 digit</li>
        </ul>
    );
}
