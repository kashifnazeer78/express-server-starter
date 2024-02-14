import {NextFunction, Request, Response} from "express";
import Jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import {db} from "../../config/database";

export const requireAdminAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        if (!token) {
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        const decoded = Jwt.verify(token, process.env.JWT_SECRET || "secret");

        if (typeof decoded === "string") {
            res.status(401).json({message: "Unauthorized"});
            return;
        }

        const admin = await db.admin.findUnique({
            where: {
                email: decoded.email
            }
        });

        if (admin) next();
        else {
            res.status(401).json({message: "Unauthorized"});
        }
    } catch (error) {
        res.status(401).json({message: "Unauthorized"});
    }
})
