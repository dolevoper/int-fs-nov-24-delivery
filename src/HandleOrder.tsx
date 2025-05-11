import { useEffect, useState } from "react";
import styles from "./HandleOrder.module.scss";
import cover from "./assets/order-status-cover.jpg";
import { getOrderById, setOrderById, orderPhases  } from "../src/services/orderService";
import type {Order, OrderPhase}  from "../src/services/orderService";
import { Spinner } from "./Spinner";

// 1. Show loading even when an order was previously loaded
// 2. Show error message on rejection
// 3. Find and fix the bug

const timestampFormater = new Intl.DateTimeFormat("he", {
    timeStyle: "short",
    dateStyle: "short",
});

type HandleOrderProps = {
    orderId: string,
    setLoading: (loading: boolean) => void;
    loading: boolean;
};
export function HandleOrder({ orderId, setLoading, loading }: HandleOrderProps) {
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
                <h1>Handle order:</h1>
                <p>{error}</p>
            </main>
        );
    }

    if (!order) {
        return (
            <main className={styles.container}>
                <h1>Handle order:</h1>
                <Spinner/>
                <p>Loading...</p>
            </main>
        );
    }

    function updatePhase(updatedPhase: number) {
        if (!order) return;

        console.log("updatedPhase", updatedPhase);

        const updatedOrder = { ...order, phase: orderPhases[updatedPhase] };
        setOrder(updatedOrder);
        
        setLoading(true);

        async function setOrderPhase() {
            try {
                await setOrderById(orderId, updatedPhase);
            } catch (error) {
                if (error === "404") {
                    setError(`Order ${orderId} was not found.`);
                }
            } finally {                
                setLoading(false);
            }
        }

        setOrderPhase();
    }

    return (
        <main className={styles.container}>
            <h1>Handle order:</h1>
            <img src={cover} className={styles.cover} alt="" />
            {loading && <Spinner/>} 
            <Steps phase={order.phase} updatePhase={updatePhase} loading={loading} />
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
    updatePhase: (updatedPhase: number) => void;
    loading: boolean;
};
function Steps({ phase, updatePhase, loading}: StepsProps) {
    const currentStep = orderPhases.indexOf(phase);

    function isActive(step: OrderPhase) {
        return orderPhases.indexOf(step) <= currentStep;
    }

    return (
        <div className={styles.stepsContainer} style={{ "--step": currentStep }}>              
            <div className={styles.step} data-active={isActive("received")}>
                <button disabled={loading} onClick={() => updatePhase(0)}>We got your order!</button>
            </div>
            <div className={styles.step} data-active={isActive("opened")}>
                <button disabled={loading} onClick={() => updatePhase(1)}>The restaurant has seen your order</button>
            </div>
            <div className={styles.step} data-active={isActive("making")}>
                <button disabled={loading} onClick={() => updatePhase(2)}>Your order is in the making</button>
            </div>
            <div className={styles.step} data-active={isActive("ready")}>
                <button disabled={loading} onClick={() => updatePhase(3)}>The order is ready for pick-up</button> 
            </div>
            <div className={styles.step} data-active={isActive("picked-up")}>
                <button disabled={loading} onClick={() => updatePhase(4)}>The courier is on the way with your food</button>
            </div>
            <div className={styles.step} data-active={isActive("arrived")}>
                <button disabled={loading} onClick={() => updatePhase(5)}>Bon appetite!</button>
            </div>
        </div>
    );
}
