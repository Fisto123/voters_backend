import express from "express";
import {
  VoterResultView,
  createVote,
  voteResult,
  votelog,
} from "../controllers/ballot.js";
import { auth } from "../middleware/verify.js";
import { getVoterStat } from "../controllers/voters.js";

const routes = express.Router({
  mergeParams: true,
});

routes.post("/createvotes/:electionid", auth, createVote);
routes.get("/electionresult/:electionid", auth, voteResult);
routes.get("/votelog/:electionid", auth, votelog);
routes.get("/voterselectionresult/:electionid", auth, VoterResultView);

export default routes;
//if voterid is in election link
