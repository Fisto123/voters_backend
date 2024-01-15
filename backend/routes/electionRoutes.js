import express from "express";
import { auth } from "../middleware/verify.js";
import {
  createElection,
  editElection,
  publishElection,
} from "../controllers/election.js";
const routes = express.Router({
  mergeParams: true,
});

routes.post("/createelection", auth, createElection);
routes.patch("/editelection/:electionid", auth, editElection);
routes.patch("/publishelection/:positionid/:electionid", auth, publishElection);

export default routes;
