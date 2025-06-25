import { Router } from "express";
import { getAll } from "../models/item";

export const router = Router();

router.get("/", async (_, res) => {
    try {
        const items = await getAll();

        res.json(items);
    } catch (err) {
        console.error(err);

        res.status(500);
        res.end();
    }
});
