import express from "express";
import { json } from "body-parser";
import cors from "cors";
import { router as itemsRouter } from "./routers/items";
import { router as ordersRouter } from "./routers/orders";

export const app = express();

app.use(cors());

app.use((req, _, next) => {
    console.log(new Date(), req.method, req.url);
    next();
});
 
app.use(json());

app.use("/items", itemsRouter);
app.use("/orders", ordersRouter);

app.use(express.static("public"));
