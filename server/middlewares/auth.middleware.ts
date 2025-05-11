import { Request, Response, NextFunction } from "express";

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.status(401).json({ error: "Unauthorized: Please log in." });
}
