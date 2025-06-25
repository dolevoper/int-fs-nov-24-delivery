import { Router } from "express";
import { createOrder, getOrderDetails, listOrders } from "../models/order";
import { randomUUID } from "crypto";

export const router = Router();

router.post("/", async (req, res) => {
    try {
        const createdAt = Date.now();

        await createOrder({
            id: randomUUID(),
            orderingUserId: req.auth.sub,
            createdAt: createdAt,
            lastUpdatedAt: createdAt,
            ...req.body
        });

        res.status(201);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
});

router.get("/", async (req, res) => {
    try {
        const orders = await listOrders(req.auth.sub);

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
});

router.get("/:id", async (req, res) => {
    try {
        const order = await getOrderDetails(req.params.id);

        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
});
