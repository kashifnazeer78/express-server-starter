import express from "express";

const router = express.Router();

import * as categoryController from "../controllers/category.controller";

router.post("/create", categoryController.createCategory);

export default router
