import express from "express";
import { auth } from "../middleware/verify.js";
import {
  createElection,
  editElection,
  editElectionDate,
  electionReport,
  getAdminElection,
  getElection,
  getResultStatus,
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
routes.patch("/publishelection/:electionid", auth, publishElection);
routes.get("/electiondata/:electionid", auth, ElectionData);
routes.patch("/editelectiondate/:electionid", auth, editElectionDate);
routes.get("/electionreport/:electionid", auth, electionReport);
routes.get("/resultviewstatus/:electionid", auth, getResultStatus);

export default routes;
