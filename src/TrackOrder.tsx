import { useEffect, useState } from "react";
import styles from "./TrackOrder.module.scss";
import cover from "./assets/order-status-cover.jpg";
import { getOrderById, orderPhases  } from "../src/services/orderService";
import type {Order, OrderPhase}  from "../src/services/orderService";
import { Spinner } from "./Spinner";

// 1. Show loading even when an order was previously loaded
// 2. Show error message on rejection
// 3. Find and fix the bug

const timestampFormater = new Intl.DateTimeFormat("he", {
    timeStyle: "short",
    dateStyle: "short",
});

type TrackOrderProps = {
    orderId: string,
    setLoading: (loading: boolean) => void;
};
export function TrackOrder({ orderId, setLoading }: TrackOrderProps) {
    const [order, setOrder] = useState<Order>();
    const [error, setError] = useState<string>();    

    useEffect(() => {
        async function fetchOrder() {
            setOrder(undefined);
            setError(undefined);
            setLoading(true);
            try {
                const fetchedOrder = await getOrderById(orderId);
                setOrder(fetchedOrder);
            } catch (error) {
                if (error === "404") {
                    setError(`Order ${orderId} was not found.`);
                } else if (error === "User not logged in") {
                    setError("User not logged in. Please log in to handle orders.");
                }
            } finally {                
                setLoading(false);
            }
        }
        fetchOrder();
    }, [orderId]);

    if (error) {
        return (
            <main className={styles.container}>
                <h1>Your order status</h1>
                <p>{error}</p>
            </main>
        );
    }

    if (!order) {
        return (
            <main className={styles.container}>
                <h1>Your order status</h1>
                <Spinner/>
                <p>Loading...</p>
            </main>
        )
    }

    return (
        <main className={styles.container}>
            <h1>Your order status</h1>
            {/* {loading && <Spinner/>}  */}
            <img src={cover} className={styles.cover} alt="" />
            <Steps phase={order.phase} />
            <article>
                <p>Order number: <span>{order.id}</span></p>
                <p>Ordered from: <span>{order.restaurant}</span></p>
                <p>Ordered on: <time dateTime={order.timestamp.toString()}>{timestampFormater.format(order.timestamp)}</time></p>
            </article>
            <details>
                <summary>Order details</summary>
                <ul>
                    {order.items.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </details>
        </main>
    );
}

type StepsProps = {
    phase: OrderPhase;
};
function Steps({ phase }: StepsProps) {
    const currentStep = orderPhases.indexOf(phase);

    function isActive(step: OrderPhase) {
        return orderPhases.indexOf(step) <= currentStep;
    }

    return (
        <div className={styles.stepsContainer} style={{ "--step": currentStep }}>
            <div className={styles.step} data-active={isActive("received")}>We got your order!</div>
            <div className={styles.step} data-active={isActive("opened")}>The restaurant has seen your order</div>
            <div className={styles.step} data-active={isActive("making")}>Your order is in the making</div>
            <div className={styles.step} data-active={isActive("ready")}>The order is ready for pick-up</div>
            <div className={styles.step} data-active={isActive("picked-up")}>The courier is on the way with your food</div>
            <div className={styles.step} data-active={isActive("arrived")}>Bon appetite!</div>
        </div>
    );
}
