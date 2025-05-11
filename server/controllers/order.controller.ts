import Order from "../models/order.model";
import Item from "../models/item.model";
import { Request, Response } from "express";

export async function checkout(req: Request, res: Response) {
    try {
        const userId = req.session.userId;
        const { items } = req.body; // items: [{ item: itemId, quantity }]
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "No items provided." });
        }
        // Validate items and check availability
        const itemDocs = await Promise.all(
            items.map(async (orderItem) => {
                const item = await Item.findById(orderItem.item);
                if (!item || item.status !== "available") {
                    throw new Error(`Item not available: ${orderItem.item}`);
                }
                if (orderItem.quantity > item.maxQuantity) {
                    throw new Error(`Quantity exceeds max for item: ${item.name}`);
                }
                return item;
            })
        );
        // Mark items as sold (for simplicity, mark all as sold)
        await Promise.all(
            itemDocs.map((item) => {
                item.status = "sold";
                return item.save();
            })
        );
        const order = await Order.create({ user: userId, items });
        res.status(201).json(order);
    } catch (err: any) {
        res.status(400).json({ error: err.message || "Checkout failed." });
    }
}

export async function getOrders(req: Request, res: Response) {
    try {
        const userId = req.session.userId;
        const orders = await Order.find({ user: userId }).populate({
            path: "items.item",
            model: "Item",
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch orders." });
    }
}
