import express from "express";

import * as memberController from "../controllers/member.controller";
import {signUpSignInLimiter} from "../middlewares/limiter/limiter";
import {signUpValidator, signUpValidatorHandler} from "../middlewares/member/memberValidator";

const router = express.Router();

router.post("/signup", signUpSignInLimiter, signUpValidator, signUpValidatorHandler, memberController.signUp);
router.post("/signin", signUpSignInLimiter, memberController.signIn);

export default router;