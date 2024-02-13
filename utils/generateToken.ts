import jwt from "jsonwebtoken";

export const generateToken = async (user: any) => {
    const payload = {
        id: user.id,
        email: user.email
    }
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {expiresIn: "6h"});
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET || 'refreshSecret', {
        expiresIn: "7d",
    });
    return {accessToken, refreshToken};
}