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
    timestamp: number,
    restaurant: string,
    items: string[],
};

const orders: Record<Order["id"], Order> = {
    "111111": { id: "111111", timestamp: new Date(2025, 4, 7, 19).valueOf(), restaurant: "a nice place", phase: "arrived", items: [] },
    "222222": { id: "222222", timestamp: new Date(2025, 4, 7, 19, 30).valueOf(), restaurant: "a nice place", phase: "arrived", items: [] },
    "333333": { id: "333333", timestamp: new Date(2025, 4, 7, 20).valueOf(), restaurant: "a nice place", phase: "arrived", items: [] },
    "444444": { id: "444444", timestamp: new Date(2025, 4, 11, 19).valueOf(), restaurant: "a nice place", phase: "received", items: [] },
    "555555": { id: "555555", timestamp: new Date(2025, 4, 11, 19, 5).valueOf(), restaurant: "a nice place", phase: "opened", items: [] },
};

export type OrderList = Omit<Order, "items">[];

export async function listOrders(): Promise<OrderList> {
    await randomDelay();

    return Object.values(orders);
}

export async function getOrderById(id: string): Promise<Order> {
    await randomDelay();

    if (!(id in orders)) {
        throw new Error(`Order ${id} not found.`);
    }

    return orders[id];
}

export const timestampFormater = new Intl.DateTimeFormat("he", {
    timeStyle: "short",
    dateStyle: "short",
});

const randomDelay = () => new Promise<void>((resolve) => {
    const delay = (Math.random() * 2000) + 700;

    return setTimeout(
        () => {
            resolve();
        },
        delay
    );
});
