import styles from "./LogIn.module.scss";

export function LogIn() {
    function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);        
        const username = formData.get("username") as string;
        console.log("username", username);
        localStorage.setItem("userId", username);
    }

    return (
        <main className={styles.container}>
            <h1>Log In</h1>
            <form onSubmit={handleLogin}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
                <button type="submit">Log In</button>
            </form>
        </main>
    );
}