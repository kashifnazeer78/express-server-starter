import asyncHandler from "express-async-handler"
import {Request, Response} from "express";

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    res.status(201).json("Category created");
});


module.exports = {
    createCategory
}