import { useEffect, useState } from "react";
import { Main } from "../components/Main";
import { listOrders, timestampFormater, type OrderList } from "../models/order";

import styles from "./OrderHistory.module.scss";

export function OrderHistory() {
    const [orders, setOrders] = useState<OrderList>();
    const [error, setError] = useState<string>();

    useEffect(() => {
        let isCanceled = false;

        setOrders(undefined);
        setError(undefined);
        listOrders()
            .then((orders) => {
                if (isCanceled) {
                    return;
                }

                setOrders(orders);
            })
            .catch((error) => {
                if (isCanceled) {
                    return;
                }

                setError(error);
            });

            return () => {
                isCanceled = true;
            };
    }, []);

    if (error) {
        return (
            <Main>
                <h1>Order history</h1>
                <p>{error}</p>
            </Main>
        );
    }

    if (!orders) {
        return (
            <Main>
                <h1>Order history</h1>
                <p>Loading...</p>
            </Main>
        );
    }

    if (!orders.length) {
        return (
            <Main>
                <h1>Order history</h1>
                <p>No orders yet... Let's order something to eat!</p>
            </Main>
        );
    }

    return (
        <Main>
            <h1>Order history</h1>
            <ol>
                {orders
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((order) => <li key={order.id}><Order {...order} /></li>)}
            </ol>
        </Main>
    );
}

function Order({ phase, timestamp, restaurant }: OrderList[number]) {
    return (
        <article className={styles.order}>
            <p>{phase}</p>
            <time dateTime={timestamp.toString()}>{timestampFormater.format(timestamp)}</time>
            <p>{restaurant}</p>
            <a className={styles.goToDetails} href="#">See details</a>
        </article>
    );
}
