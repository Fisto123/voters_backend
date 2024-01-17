import express from "express";
import { auth } from "../middleware/verify.js";
import {
  createCandidate,
  getCandidates,
  updateCandidatePicture,
} from "../controllers/candidate.js";
const routes = express.Router({
  mergeParams: true,
});

routes.post("/addcandidate/:electionid/:positionid", auth, createCandidate);
routes.patch(
  "/uploadcandidatepicture/:candidateid/:electionid/:positionid",
  auth,
  updateCandidatePicture
);
routes.get("/candidates/:positionid", auth, getCandidates);

export default routes;
