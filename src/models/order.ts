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

export async function listOrders() {
    return [];
}

export async function getOrderById(id: string): Promise<Order> {
    await new Promise<void>((resolve, reject) => {
        const delay = id === "112335" ? 500 : (Math.random() * 2000) + 700;

        return setTimeout(
            () => {
                if (id === "404") {
                    reject();
                } else {
                    resolve();
                }
            },
            delay
        );
    });

    return {
        id,
        phase: "making",
        timestamp: new Date(2025, 4, 7, 19).valueOf(),
        restaurant: "A nice place",
        items: [
            "Burger",
            "Fries",
            "Soda",
        ],
    };
}
