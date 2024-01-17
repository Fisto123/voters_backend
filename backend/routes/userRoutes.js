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

routes.delete("/deletevoter/:userid", auth, deleteVoter);
routes.delete("/deleteelection/:electionid", auth, deleteElection);
routes.delete("/deleteposition/:positionid", auth, deleteposition);
routes.delete(
  "/deleteCandidate/:candidateid/:electionid",
  auth,
  deleteCandidate
);

//voters routes
export default routes;
