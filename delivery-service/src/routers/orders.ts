import { Router } from "express";
import { Order } from "../models/order";

export const router = Router();

router.post("/", async (req, res) => {
    try {
        await Order.create(req.body);

        res.status(201);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
});

router.get("/", async (_, res) => {
    try {
        const orders = await Order.find();

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
});

router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("items.itemId");

        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
});
