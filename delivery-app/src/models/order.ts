import type { Item } from "./item";

export const orderPhases = [
    "received",
    "opened",
    "making",
    "ready",
    "picked-up",
    "arrived",
] as const;

export type OrderPhase = typeof orderPhases[number];

export type Order = {
    _id: string,
    phase: OrderPhase,
    createdAt: string,
    restaurant: string,
    items: { item: Item, quantity: number }[],
};

export type OrderList = Omit<Order, "items">[];

export async function listOrders(): Promise<OrderList> {
    const res = await fetch("http://localhost:5000/orders");

    return res.json();
}

export async function getOrderById(id: string): Promise<Order> {
    const res = await fetch(`http://localhost:5000/orders/${id}`);

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return res.json();
}

export const timestampFormater = new Intl.DateTimeFormat("he", {
    timeStyle: "short",
    dateStyle: "short",
});
