import express from "express";
import {
  createVote,
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
  "/upload/:electionid",
  upload.single("csvFile"),
  auth,
  uploadVoters
);
routes.post("/sendelectioncode/:electioncode", sendElectionCode);
routes.post("/createvotes/:electionid/positionid:", createVote);

export default routes;
