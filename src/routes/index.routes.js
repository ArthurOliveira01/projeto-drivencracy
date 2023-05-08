import pollPostRouter from "./post.routes.js";
import pollGetRouter from "./get.routes.js";
import { Router } from "express";

const router = Router();

router.use(pollGetRouter);
router.use(pollPostRouter);

export default router;