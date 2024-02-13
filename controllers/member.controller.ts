import asyncHandler from "express-async-handler"
import {Request, Response} from "express";
import bcrypt from "bcryptjs";
import {db} from "../config/database";
import {generateToken} from "../utils/generateToken";

export const signUp = asyncHandler(async (req: Request, res: Response) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await db.member.create({
        data: {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        }
    })

    const {accessToken, refreshToken} = await generateToken(user);

    await db.token.create({
        data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            memberId: user.id
        }
    });

    res.status(200).json({
        accessToken,
        refreshToken,
        accessTokenUpdatedAt: new Date().toLocaleString(),
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.scope
        }
    });
});


module.exports = {
    signUp
}