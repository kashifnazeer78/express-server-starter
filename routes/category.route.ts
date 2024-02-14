import express from "express";
import passport from "passport";
const router = express.Router();

import {decodeToken} from "../middlewares/auth/decodeToken";

import * as categoryController from "../controllers/category.controller";

router.use(passport.authenticate("jwt", {session: false}), decodeToken);

router.post("/create", categoryController.createCategory);

export default router
