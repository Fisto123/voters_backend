import express from "express";
import {
  addVoters,
  deleteElectionVoters,
  deleteVoter,
  editVoter,
  getElectionVoter,
  getVoterStat,
  sendElectionCode,
  uploadVoters,
} from "../controllers/voters.js";
import { auth } from "../middleware/verify.js";
import multer from "multer";

const routes = express.Router({
  mergeParams: true,
});

const upload = multer({ dest: "uploads/" }); // Specify the destination folder

routes.post(
  "/uploadvoters/:electionid",
  upload.single("csvFile"),
  auth,
  uploadVoters
);
routes.post("/sendelectioncode/:electionid", auth, sendElectionCode);
routes.get("/votersstat/:electionid", auth, getVoterStat);
routes.get("/electionvoters/:electionid", auth, getElectionVoter);
routes.delete("/deleteelectionvoters/:electionid", auth, deleteElectionVoters);
routes.delete("/deletevoter/:voterid/:electionid", auth, deleteVoter);
routes.patch("/editvoter/:voterid", auth, editVoter);
routes.post("/addvoters/:electionid", auth, addVoters);

export default routes;
