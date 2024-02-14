import jwt from "jsonwebtoken";
import {db} from "../config/database";

export const generateToken = async (user: any) => {
    const payload = {
        id: user.id,
        email: user.email
    }
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {expiresIn: "6h"});
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET || 'refreshSecret', {
        expiresIn: "7d",
    });

    const token = await db.token.findFirst({
        where: {
            memberId: user.id
        }
    });

    if (token) {
        await db.token.delete({
            where: {
                id: token.id
            }
        });
    }

    await db.token.create({
        data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            memberId: user.id
        }
    });

    return {accessToken, refreshToken};
}