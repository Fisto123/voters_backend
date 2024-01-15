import express from "express";
import { createVote } from "../controllers/ballot.js";

const routes = express.Router({
  mergeParams: true,
});

routes.post(
  "/createvotes/:electionid/:positionid/:voterid/:candidateid",
  createVote
);

export default routes;
