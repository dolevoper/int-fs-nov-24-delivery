import { Link, useNavigate } from "react-router";
import { apiClient, setRefreshToken, setToken } from "../models/apiClient";
import { useCenterRoot } from "../hooks/useCenterRoot";
import { Main } from "../components/Main";
import { PrimaryButton } from "../components/PrimaryButton";
import { Input } from "../components/Input";
import { PasswordInput } from "../components/PasswordInput";

import styles from "./Login.module.scss";

export function Login() {
    const navigate = useNavigate();

    useCenterRoot();

    async function login(formData: FormData) {
        const user = Object.fromEntries(formData);
        const res = await apiClient.post("/login", user);

        const { accessToken, refreshToken } = res.data;

        setToken(accessToken);
        setRefreshToken(refreshToken);
        navigate("/");
    }

    return (
        <>
            <nav className={styles.nav}>
                <Link to="/register">Register</Link>
            </nav>
            <Main fitContent>
                <h1>Login</h1>
                <form className={styles.form} action={login}>
                    <Input type="email" id="email" label="Email" name="email" required />
                    <PasswordInput id="password" label="Password" name="password" required />
                    <PrimaryButton>Login</PrimaryButton>
                </form>
            </Main>
        </>
    );
}
