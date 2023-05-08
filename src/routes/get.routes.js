
import {getPoll, getChoice, getResult} from "../controllers/get.controllers.js";
import { Router } from "express";

const pollGetRouter = Router();

pollGetRouter.get("/poll", getPoll);
pollGetRouter.get("/poll/:id/choice", getChoice);
pollGetRouter.get("/poll/:id/result", getResult);

export default pollGetRouter;
