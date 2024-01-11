import express from "express";
import { auth } from "../middleware/verify.js";
import { createElection, editElection } from "../controllers/election.js";
const routes = express.Router({
  mergeParams: true,
});

routes.post("/createelection", auth, createElection);
routes.patch("/editelection/:electionid", auth, editElection);

export default routes;
