import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { Main } from "../components/Main";
import { apiClient } from "../models/apiClient";
import { type Item } from "../models/item";
import { PrimaryButton } from "../components/PrimaryButton";

import styles from "./NewOrder.module.scss";

export function NewOrder() {
    const [order, setOrder] = useState<Record<string, number>>({});

    function addToOrder(itemId: string) {
        setOrder({
            ...order,
            [itemId]: (order[itemId] ?? 0) + 1
        });
    }

    return (
        <Main large>
            <h1>New order</h1>
            <div className={styles.container}>
                <article className={styles.menu}>
                    <h2>Menu</h2>
                    <ItemsList onAddToOrderClick={addToOrder} />
                </article>
                <article className={styles.summmary}>
                    <h2>Order summary</h2>
                    <OrderSummary order={order} />
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
function MenuItem({ previewImageUrl, name, description, priceInAgorot, onAddToOrderClick }: MenuItemProps) {
    return (
        <>
            <img src={previewImageUrl} alt="" />
            <h3>{name}</h3>
            <p>{description}</p>
            <p>{priceInAgorot / 100}₪</p>
            <PrimaryButton onClick={onAddToOrderClick}>Add to order</PrimaryButton>
        </>
    );
}

type OrderSummaryProps = { order: Record<string, number> };
function OrderSummary({ order }: OrderSummaryProps) {
    const items = useLoaderData<Item[]>();
    const navigate = useNavigate();

    if (Object.keys(order).length === 0) {
        return <p>Let's add some items to your order!</p>;
    }

    return (
        <>
            <ul>
                {Object.entries(order).map(([id, quantity]) => {
                    const item = items?.find((item) => item.id === id);

                    return (
                        <li key={id} className={styles.orderEntry}>
                            <span>{item?.name}</span>
                            <span>x{quantity}</span>
                            <span>{(item?.priceInAgorot ?? 0) * quantity / 100}₪</span>
                        </li>
                    );
                })}
            </ul>
            <PrimaryButton onClick={async () => {
                try {
                    await apiClient.post("/orders", {
                        phase: "received",
                        restaurant: "INT cafe",
                        items: Object.entries(order).map(([itemId, quantity]) => ({ itemId, quantity })),
                    });

                    navigate("/order-history");
                } catch (err) {
                    console.error(err);
                }
            }}>Place order</PrimaryButton>
        </>
    );
}
