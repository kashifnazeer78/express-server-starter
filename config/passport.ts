import dotenv from "dotenv";

dotenv.config();

import passport from "passport";
import {Strategy as JWTStrategy, ExtractJwt, StrategyOptions} from 'passport-jwt';
import * as Jwt from "jsonwebtoken";
import {db} from "./database";


const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || "secret",
}

passport.use(new JWTStrategy(opts, async (jwtPayload: Jwt.JwtPayload, done) => {
    try {
        const user = await db.member.findUnique({where: {email: jwtPayload.email}});
        if (user) {
            const refreshTokenFromDB = await db.token.findFirst({where: {memberId: user.id}});

            if (!refreshTokenFromDB)
                return done(null, false);

            const refreshPayload = Jwt.verify(refreshTokenFromDB.refreshToken, process.env.REFRESH_SECRET || "refreshSecret");

            if (typeof refreshPayload !== 'string' && refreshPayload.email !== jwtPayload.email)
                return done(null, false);

            const tokenExpiration = jwtPayload.exp && new Date(jwtPayload.exp * 1000);
            const now = new Date();
            const timeDifference = tokenExpiration && tokenExpiration.getTime() - now.getTime();

            if (timeDifference && timeDifference > 0 && timeDifference < 30 * 60 * 1000) {
                const payloadNew = {
                    id: user.id,
                    email: user.email,
                };
                const newToken = Jwt.sign(payloadNew, process.env.SECRET || 'secret', {
                    expiresIn: "6h",
                });

                return done(null, {user, newToken});
            }
            return done(null, {user});
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error);
    }
}));
