import express from "express";
import { auth } from "../middleware/verify.js";
import {
  createCandidates,
  updateCandidatePicture,
} from "../controllers/candidate.js";
const routes = express.Router({
  mergeParams: true,
});

routes.post("/addcandidates/:electionid/:positionid", auth, createCandidates);
routes.patch(
  "/uploadcandidatepicture/:candidateid/:electionid/:positionid",
  auth,
  updateCandidatePicture
);

export default routes;
