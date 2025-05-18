import type { PropsWithChildren } from "react";

import styles from "./Main.module.scss";

type MainProps = {
    large?: boolean;
    overflow?: boolean;
};
export function Main({ large, overflow, children }: PropsWithChildren<MainProps>) {
    return (
        <main className={styles.root} data-large={large} data-overflow={overflow}>{children}</main>
    );
}
