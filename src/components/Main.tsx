import type { PropsWithChildren } from "react";

import styles from "./Main.module.scss";

type MainProps = {
    large?: boolean;
};
export function Main({ large, children }: PropsWithChildren<MainProps>) {
    return (
        <main className={styles.root} data-large={large}>{children}</main>
    );
}
