import express from "express";
import { auth } from "../middleware/verify.js";
import {
  createElection,
  editElection,
  getAdminElection,
  getElection,
  publishElection,
} from "../controllers/election.js";
import { ElectionData } from "../controllers/user.js";
const routes = express.Router({
  mergeParams: true,
});

routes.post("/createelection", auth, createElection);
routes.patch("/editelection/:electionid", auth, editElection);
routes.get("/myelections", auth, getAdminElection);
routes.get("/electiondetails/:electionid", auth, getElection);
routes.patch("/publishelection/:positionid/:electionid", auth, publishElection);
routes.get("/electiondata/:electionid", ElectionData);

export default routes;
