import User from "../models/user.model";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

export async function register(req: Request, res: Response) {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ error: "All fields are required." });
        }
        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            return res.status(409).json({ error: "Email or username already in use." });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashed, username });
        req.session.userId = user._id;
        res.status(201).json({ id: user._id, email: user.email, username: user.username });
    } catch (err) {
        res.status(500).json({ error: "Registration failed." });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required." });
        }
        const user = await User.findByEmail(email);
        if (!user) return res.status(401).json({ error: "Invalid credentials." });
        const match = await User.comparePassword(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid credentials." });
        req.session.userId = user._id;
        res.json({ id: user._id, email: user.email, username: user.username });
    } catch (err) {
        res.status(500).json({ error: "Login failed." });
    }
}

export async function getCurrentUser(req: Request, res: Response) {
    try {
        if (!req.session.userId) return res.status(401).json({ error: "Not logged in." });
        const user = await User.findById(req.session.userId).select("-password");
        if (!user) return res.status(404).json({ error: "User not found." });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Failed to get user." });
    }
}
