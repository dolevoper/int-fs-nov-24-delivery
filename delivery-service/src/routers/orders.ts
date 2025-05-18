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
