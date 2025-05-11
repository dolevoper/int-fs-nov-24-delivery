import { useEffect, useState } from "react";
import { Main } from "../components/Main";
import { listOrders, timestampFormater, type OrderList } from "../models/order";

import styles from "./OrderHistory.module.scss";

type OrderHistoryProps = { onSeeDetailsClick: (id: string) => void };
export function OrderHistory({ onSeeDetailsClick }: OrderHistoryProps) {
    const { error, orders } = useOrders();

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

    return (
        <Main>
            <h1>Order history</h1>
            <OrderList orders={orders} onSeeDetailsClick={onSeeDetailsClick} />
        </Main>
    );
}

type OrderListProps = { orders: OrderList, onSeeDetailsClick: (id: string) => void };
function OrderList({ orders, onSeeDetailsClick }: OrderListProps) {
    if (!orders.length) {
        return (
            <p>No orders yet... Let's order something to eat!</p>
        );
    }

    return (
        <ol>
            {orders
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((order) => <li key={order.id}><OrderListItem {...order} onSeeDetailsClick={() => onSeeDetailsClick(order.id)} /></li>)}
        </ol>
    );
}

type OrderListItemProps = OrderList[number] & { onSeeDetailsClick: () => void };
function OrderListItem({ phase, timestamp, restaurant, onSeeDetailsClick }: OrderListItemProps) {
    return (
        <article className={styles.order}>
            <p>{phase}</p>
            <time dateTime={timestamp.toString()}>{timestampFormater.format(timestamp)}</time>
            <p>{restaurant}</p>
            <a className={styles.goToDetails} href="#" onClick={(e) => {
                e.preventDefault();
                onSeeDetailsClick();
            }}>See details</a>
        </article>
    );
}

function useOrders() {
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

    return { orders, error };
}
