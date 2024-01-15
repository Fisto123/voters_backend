import express from "express";
import {
  deleteCandidate,
  deleteElection,
  deleteVoter,
  deleteposition,
} from "../controllers/user.js";
import { auth } from "../middleware/verify.js";
const routes = express.Router({
  mergeParams: true,
});

routes.patch("/deletevoter/:userid", auth, deleteVoter);
routes.patch("/deleteelection/:electionid", auth, deleteElection);
routes.patch("/deleteposition/:positionid/:electionid", auth, deleteposition);
routes.patch(
  "/deleteCandidate/:candidateid/:electionid",
  auth,
  deleteCandidate
);

//voters routes
export default routes;
