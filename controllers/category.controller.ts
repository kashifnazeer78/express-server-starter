import asyncHandler from "express-async-handler"
import {Request, Response} from "express";
import {db} from "../config/database";

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const {name, parentId = null} = req.body;
    if (!name) {
        res.status(400).json("Category name is required");
        return
    }

    const category = await db.category.findFirst({
        where: {
            name
        }
    });

    if (category) {
        res.status(400).json("Category already exists");
        return
    }

    try {
        await db.category.create({
            data: {
                name,
                parentId
            }
        });

        res.status(201).json("Category created");
    } catch (err) {
        res.status(500).json("Something went wrong");
    }
});
