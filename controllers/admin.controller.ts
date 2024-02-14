import asyncHandler from "express-async-handler";
import {Request, Response} from "express";
import {db} from "../config/database";
import bcrypt from "bcryptjs";
import {generateToken} from "../utils/generateToken";


/**
 * @route POST /admin/signin
 */
export const signUp = asyncHandler(async (req: Request, res: Response) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await db.admin.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            }
        })

        res.status(201).json({
            message: "Account created successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});

/**
 * @route POST /admin/signin
 */
export const signIn = asyncHandler(async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const existingUser = await db.admin.findUnique({
            where: {
                email: email
            }
        });

        if (!existingUser) {
            res.status(404).json({
                message: "Invalid credentials"
            });
            return
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordCorrect) {
            res.status(400).json({
                message: "Invalid credentials"
            });
            return
        }

        const {accessToken} = await generateToken(existingUser);

        res.status(200).json({
            accessToken,
            accessTokenUpdatedAt: new Date().toLocaleString(),
            user: {
                id: existingUser.id,
                name: existingUser.name,
                email: existingUser.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
})
