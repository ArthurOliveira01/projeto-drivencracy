import {postPoll, postChoice, postVote} from "../controllers/post.controllers.js";
import {Router} from "express";

const pollPostRouter = Router();

pollPostRouter.post("/poll", postPoll);
pollPostRouter.post("/choice", postChoice);
pollPostRouter.post("/choice/:id/vote", postVote);

export default pollPostRouter;