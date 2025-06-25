import { apiClient } from "./apiClient";
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
    id: string,
    phase: OrderPhase,
    createdAt: string,
    restaurant: string,
    items: { item: Item, quantity: number }[],
};

export type OrderList = Omit<Order, "items">[];

export async function listOrders(): Promise<OrderList> {
    const res = await apiClient.get("/orders");

    return res.data;
}

export async function getOrderById(id: string): Promise<Order> {
    const res = await apiClient.get(`/orders/${id}`);

    return res.data;
}

export const timestampFormater = new Intl.DateTimeFormat("he", {
    timeStyle: "short",
    dateStyle: "short",
});
