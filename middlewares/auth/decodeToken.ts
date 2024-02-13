import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken";

/**
 * NOTE: This middleware for decoding JWT is not necessary when using Passport's JWT strategy.
 * Passport handles token decoding and user extraction automatically.
 */

interface RequestWithUserId extends Request {
    userId?: string;
}

export const decodeToken = (req: RequestWithUserId, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        if (typeof decoded !== "string")
            req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({message: "Unauthorized"});
    }
};

