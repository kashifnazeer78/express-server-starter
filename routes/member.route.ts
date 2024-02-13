import express from "express";

const router = express.Router();
import passport from "passport";

import * as memberController from "../controllers/member.controller";
import {decodeToken} from "../middlewares/auth/decodeToken";
import {signUpSignInLimiter} from "../middlewares/limiter/limiter";
import {signUpValidator, signUpValidatorHandler} from "../middlewares/member/memberValidator";

const requireAuth = passport.authenticate("jwt", {session: false});

router.post("/signup", signUpSignInLimiter, signUpValidator, signUpValidatorHandler, memberController.signUp);

export default router;