import Item from "../models/item.model";
import { Request, Response } from "express";

export async function getItems(req: Request, res: Response) {
    try {
        const { name, minPrice, maxPrice, type,limit } = req.query;
        const filter: any = { status: "available" };
        if (name) filter.name = { $regex: name, $options: "i" };
        if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
        if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
        if (type) filter.type = type;
        let items = await Item.find(filter).populate("seller", "username");

        if (limit) {
            items = items.slice(0, Number(limit));
        }

        res.json(items);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch items." });
    }
}

export async function getItemById(req: Request, res: Response) {
    try {
        const item = await Item.findById(req.params.id).populate("seller", "username");
        if (!item) return res.status(404).json({ error: "Item not found." });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch item." });
    }
}

export async function getUserItems(req: Request, res: Response) {
    try {
        const items = await Item.find({ seller: req.session.userId });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user items." });
    }
}

export async function createItem(req: Request, res: Response) {
    try {
        const { name, description, image, price, type, maxQuantity } = req.body;
        if (!name || !description || !price || !type) {
            return res.status(400).json({ error: "Missing required fields." });
        }
        const item = await Item.create({
            name,
            description,
            image,
            price,
            type,
            maxQuantity: maxQuantity || 1,
            seller: req.session.userId,
        });
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ error: "Failed to create item." });
    }
}
