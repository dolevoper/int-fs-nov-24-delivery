import { dbClient } from "./db";

type Order = {
    id: string,
    orderingUserId: string,
    phase: string,
    restaurant: string,
    items: { itemId: string, quantity: number }[],
    createdAt: number,
    lastUpdatedAt: number,
};

export async function createOrder(order: Order) {
    
    console.log("Creating order with details:", order);

    try {
        if (!order.id || !order.orderingUserId || !order.phase || !order.restaurant || !order.items || order.items.length === 0) {
            throw new Error("Invalid order data");
        }
        if (typeof order.createdAt !== "number" || typeof order.lastUpdatedAt !== "number") {
            throw new Error("Invalid timestamps");
        }
        await dbClient.execute(
          `INSERT INTO orders (id, orderingUserId, phase, restaurant, createdAt, lastUpdatedAt)
           VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [order.id, order.orderingUserId, order.phase, order.restaurant]
        );        
        console.log("Order created in orders table");
        
        if (order.items.length > 0) {
          const placeholders = order.items.map(() => "(?, ?, ?)").join(", ");
          console.log("Inserting items into orderItems table with placeholders:", placeholders);
          const values = order.items.flatMap(item => [order.id, item.itemId, item.quantity]);
          console.log("Inserting items into orderItems table with values:", values);
          await dbClient.execute(
            `INSERT INTO orderItems (orderId, itemId, quantity) VALUES ${placeholders}`,
            values
          );
        }
        console.log("items created in orderItems table");
        console.log(`SQL query createOrder executed successfully for orderId: ${order.id}`);
    } catch (error) {
        console.error("Error creating order:", error);
        throw error; 
    }    
}

export async function listOrders(userId: string) {
    const res = await dbClient.execute(`SELECT * FROM orders WHERE orderingUserId = "${userId}"`);

    return res.rows;
}

export async function getOrderDetails(orderId: string) {
   
    try{
        const res = await dbClient.execute(`
            SELECT *
            FROM orders 
            LEFT JOIN orderItems 
            ON orders.id = orderId
            LEFT JOIN items 
            ON itemId = items.id
            WHERE orders.id = ?
        `, [orderId]);

        return {
            id: res.rows[0].id,
            phase: res.rows[0].phase,
            restaurant: res.rows[0].restaurant,
            createdAt: res.rows[0].createdAt,
            lastUpdatedAt: res.rows[0].lastUpdatedAt,
            items: res.rows.map(({ name, description, previewImageUrl, priceInAgorot, quantity }) => ({
                item: {
                    name,
                    description,
                    previewImageUrl,
                    priceInAgorot,
                },
                quantity,})),};

    }catch (error) {
        console.error("Error executing getOrderDetails query:", error);
        throw error;
    }      
    
}
