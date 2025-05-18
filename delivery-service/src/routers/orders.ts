import { Router } from "express";
import { Order } from "../models/order";
import { Types } from "mongoose";

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
        const [order] = await Order.aggregate([
            { $match: { _id: new Types.ObjectId(req.params.id) } },
            { $lookup: {
                from: "items",
                localField: "items.itemId",
                foreignField: "_id",
                as: "items",
                let: { items: "$items" },
                pipeline: [
                    { $replaceWith: {
                        item: "$$ROOT",
                        quantity: {
                            $arrayElemAt: ["$$items.quantity", {
                                $indexOfArray: ["$$items.itemId", "$$ROOT._id"],
                            }],
                        },
                    } },
                ],
            } },
        ]);

        if (!order) {
            res.status(404);
            res.send(`Order ${req.params.id} not found`);
            return;
        }

        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
});
