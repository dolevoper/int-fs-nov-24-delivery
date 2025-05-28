import { Link, Outlet, useNavigate } from "react-router";
import { clearRefreshToken, clearToken, getToken } from "./models/apiClient";
import { DefaultButton } from "./components/DefaultButton";

import styles from "./App.module.scss";

export function App() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}

export function Nav() {
  const navigate = useNavigate();

  return (
    <article  className={styles.navContainer}>
      <nav>
        <menu className={styles.appNav}>
          <li><Link to="/order-history">Order history</Link></li>
          <li><Link to="/new-order">New order</Link></li>
        </menu>
      </nav>
      <article className={styles.accountInfo}>
        <p>Hello {getUserName()}</p>
        <DefaultButton onClick={() => {
          clearToken();
          clearRefreshToken();
          navigate("/login");
        }}>Logout</DefaultButton>
      </article>
    </article>
  );
}

function getUserName() {
  const token = getToken();

  if (!token) {
    return "";
  }

  const [, encodedPayload] = token.split(".");
  const rawPayload = atob(encodedPayload);

  try {
    const payload = JSON.parse(rawPayload);

    return payload.userName;
  } catch {
    return "";
  }
}
