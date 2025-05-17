import { useState } from "react";
import { Main } from "../components/Main";
import { type Item } from "../models/item";
import { PrimaryButton } from "../components/PrimaryButton";

import styles from "./NewOrder.module.scss";
import { useLoaderData } from "react-router";

export function NewOrder() {
    const [order, setOrder] = useState<Record<string, number>>({});
    const [step, setStep] = useState<"order" | "delivery" | "payment" | "done">("order");
    const [delivery, setDelivery] = useState({ name: "", address: "", phone: "" });
    const [payment, setPayment] = useState({ card: "", expiry: "", cvv: "" });

    function addToOrder(itemId: string) {
        setOrder({
            ...order,
            [itemId]: (order[itemId] ?? 0) + 1
        });
    }

    function handlePlaceOrder() {
        setStep("delivery");
    }

    function handleDeliverySubmit(e: React.FormEvent) {
        e.preventDefault();
        setStep("payment");
    }

    function handlePaymentSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStep("done");
    }

    return (
        <Main large>
            <h1>New order</h1>
            <div className={styles.container}>
                <article className={styles.menu}>
                    <h2>Menu</h2>
                    {step === "order" && <ItemsList onAddToOrderClick={addToOrder} />}
                </article>
                <article className={styles.summmary}>
                    <h2>Order summary</h2>
                    <OrderSummary
                        order={order}
                        step={step}
                        onPlaceOrder={handlePlaceOrder}
                        delivery={delivery}
                        setDelivery={setDelivery}
                        onDeliverySubmit={handleDeliverySubmit}
                        payment={payment}
                        setPayment={setPayment}
                        onPaymentSubmit={handlePaymentSubmit}
                    />
                </article>
            </div>
        </Main>
    );
}

type ItemsListProps = { onAddToOrderClick(itemId: string): void };
function ItemsList({ onAddToOrderClick }: ItemsListProps) {
    const items = useLoaderData<Item[]>();

    if (!items) {
        return (
            <p>Loading items...</p>
        );
    }

    return (
        <ul>
            {items.map((item) => <li key={item.id} className={styles.menuItem}>
                <MenuItem {...item} onAddToOrderClick={() => onAddToOrderClick(item.id)} />
            </li>)}
        </ul>
    );
}

type MenuItemProps = Item & { onAddToOrderClick(): void }
function MenuItem({ imgSrc, name, description, priceInAgorot, onAddToOrderClick }: MenuItemProps) {
    return (
        <>
            <img src={imgSrc} alt="" />
            <h3>{name}</h3>
            <p>{description}</p>
            <p>{priceInAgorot / 100}₪</p>
            <PrimaryButton onClick={onAddToOrderClick}>Add to order</PrimaryButton>
        </>
    );
}

type OrderSummaryProps = {
    order: Record<string, number>;
    step: string;
    onPlaceOrder: () => void;
    delivery: { name: string; address: string; phone: string };
    setDelivery: React.Dispatch<React.SetStateAction<{ name: string; address: string; phone: string }>>;
    onDeliverySubmit: (e: React.FormEvent) => void;
    payment: { card: string; expiry: string; cvv: string };
    setPayment: React.Dispatch<React.SetStateAction<{ card: string; expiry: string; cvv: string }>>;
    onPaymentSubmit: (e: React.FormEvent) => void;
};
function OrderSummary({
    order,
    step,
    onPlaceOrder,
    delivery,
    setDelivery,
    onDeliverySubmit,
    payment,
    setPayment,
    onPaymentSubmit
}: OrderSummaryProps) {
    const items = useLoaderData<Item[]>();
    const orderEntries = Object.entries(order);
    const orderedItems = orderEntries.map(([id, quantity]) => {
        const item = items?.find((item) => item.id === id);
        return { ...item, quantity };
    });
    const total = orderedItems.reduce((sum, item) => sum + ((item?.priceInAgorot ?? 0) * item.quantity), 0);

    if (orderEntries.length === 0) {
        return <p>Let's add some items to your order!</p>;
    }

    if (step === "order") {
        return (
            <>
                <ul>
                    {orderedItems.map((item) => (
                        <li key={item?.id} className={styles.orderEntry}>
                            <span>{item?.name}</span>
                            <span>x{item.quantity}</span>
                            <span>{(item?.priceInAgorot ?? 0) * item.quantity / 100}₪</span>
                        </li>
                    ))}
                </ul>
                <PrimaryButton onClick={onPlaceOrder}>Place order</PrimaryButton>
            </>
        );
    }

    if (step === "delivery") {
        return (
            
            <>
                <h3>Order details</h3>
                <ul>
                    {orderedItems.map((item) => (
                        <li key={item?.id} className={styles.orderEntry}>
                            <span>{item?.name}</span>
                            <span>x{item.quantity}</span>
                            <span>{(item?.priceInAgorot ?? 0) * item.quantity / 100}₪</span>
                        </li>
                    ))}
                </ul>
                <p>
                    <strong>Total to pay: {total / 100}₪</strong>
                </p>
            <form onSubmit={onDeliverySubmit}>
                <h3>Delivery details</h3>
                <div className={styles.formGroup}>
                <label>
                    Name:
                    <input
                        required
                        value={delivery.name}
                        onChange={e => setDelivery(d => ({ ...d, name: e.target.value }))}
                    />
                </label>
                </div>
                <div className={styles.formGroup}>
                <label>
                    Address:
                    <input
                        required
                        value={delivery.address}
                        onChange={e => setDelivery(d => ({ ...d, address: e.target.value }))}
                    />
                </label>
                </div>
                <div className={styles.formGroup}>
                <label>
                    Phone:
                    <input
                        required
                        value={delivery.phone}
                        onChange={e => setDelivery(d => ({ ...d, phone: e.target.value }))}
                    />
                </label>
                </div>
                <PrimaryButton>Continue to payment</PrimaryButton>
            </form>
            </>
        );
    }

    if (step === "payment") {
        const deliveryDate = new Date(Date.now()).toLocaleString(); 
        return (
            <>
                <h3>Order details</h3>
                <ul>
                    {orderedItems.map((item) => (
                        <li key={item?.id} className={styles.orderEntry}>
                            <span>{item?.name}</span>
                            <span>x{item.quantity}</span>
                            <span>{(item?.priceInAgorot ?? 0) * item.quantity / 100}₪</span>
                        </li>
                    ))}
                </ul>
                <p>
                    <strong>Delivery for: {delivery.name}, {delivery.address}, {delivery.phone}</strong>
                </p>
                <p>
                    <strong>Delivery date: {deliveryDate}</strong>
                </p>
                <p>
                    <strong>Total to pay: {total / 100}₪</strong>
                </p>
                <form onSubmit={onPaymentSubmit}>
                    <h3>Credit card details</h3>
                    <div className={styles.formGroup}>
                    <label>
                        Card number:
                        <input
                            required
                            value={payment.card}
                            onChange={e => setPayment(p => ({ ...p, card: e.target.value }))}
                        />
                    </label>
                    </div>
                    <div className={styles.formGroup}>
                    <label>
                        Expiry date:
                        <input
                            required
                            value={payment.expiry}
                            onChange={e => setPayment(p => ({ ...p, expiry: e.target.value }))}
                        />
                    </label>
                    </div>
                    <div className={styles.formGroup}>
                    <label>
                        CVV:
                        <input
                            required
                            value={payment.cvv}
                            onChange={e => setPayment(p => ({ ...p, cvv: e.target.value }))}
                        />
                    </label>
                    </div>
                    <PrimaryButton>Pay</PrimaryButton>
                </form>
            </>
        );
    }

    if (step === "done") {
        return <p>Thank you for your order!</p>;
    }

    return null;
}