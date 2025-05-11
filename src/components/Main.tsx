import type { PropsWithChildren } from "react";

import styles from "./Main.module.scss";

export function Main({ children }: PropsWithChildren) {
    return (
        <main className={styles.root}>{children}</main>
    );
}
