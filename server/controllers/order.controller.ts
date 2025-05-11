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
                return { item, quantity: orderItem.quantity };
            })
        );
        // Update item quantities and status
        await Promise.all(
            itemDocs.map(async ({ item, quantity }) => {
                item.maxQuantity -= quantity;
                if (item.maxQuantity <= 0) {
                    item.status = "sold";
                    item.maxQuantity = 0;
                }
                await item.save();
            })
        );

        // Create the order
        const orderItems = itemDocs.map(({ item, quantity }) => ({
            item: item._id,
            quantity,
        }));
        const order = new Order({ user: userId, items: orderItems });
        await order.save();

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
        // sort orders by createdAt descending
        orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch orders." });
    }
}
