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
    id: string;
    phase: OrderPhase;
    timestamp: number;
    restaurant: string;
    items: string[];
};

export async function getOrderById(id: string): Promise<Order> {
    const order = localStorage.getItem(id);

    await new Promise<void>((resolve, reject) => {
        const delay = (Math.random() * 2000) + 700;

        return setTimeout(() => {
            const userId = localStorage.getItem("userId");
            if (id === "404" || !order) {
                reject("404");
            } else if (!userId) {
                reject("User not logged in");
            } else {
                resolve();
            }
        }, delay);
    });    
    
    if (!order) {
        throw new Error("404");
    }
    return JSON.parse(order) as Order;
}

export async function setOrderById(id: string, phase : number): Promise<void> {
    await new Promise<void>((resolve, reject) => {
        const delay = (Math.random() * 2000) + 700;

        return setTimeout(() => {
            const userId = localStorage.getItem("userId");
            if (id === "404") {
                reject("404");
            } else if (!userId) {
                reject("User not logged in");
            } else {
                resolve();
            }
        }, delay);
    });

    const order = await getOrderById(id);
    order.phase = orderPhases[phase];
    console.log("order", order);

    localStorage.setItem(id, JSON.stringify(order));
   
}