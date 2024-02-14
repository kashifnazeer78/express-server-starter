import express from "express";
const router = express.Router();

import * as adminController from "../controllers/admin.controller";
import {signUpSignInLimiter} from "../middlewares/limiter/limiter";
import {signUpValidator, signUpValidatorHandler} from "../middlewares/member/memberValidator";

// TODO: Remove admin signup route for production
router.post("/signup", signUpSignInLimiter, signUpValidator,signUpValidatorHandler,adminController.signUp);
router.post("/signin", signUpSignInLimiter,adminController.signIn);


export default router;