import express from "express";
import { auth } from "../middleware/verify.js";
import {
  AdminPositions,
  EditPosition,
  createPosition,
  getPosition,
} from "../controllers/position.js";
const routes = express.Router({
  mergeParams: true,
});

routes.post("/addpositions/:electionid", auth, createPosition);
routes.patch("/editposition/:positionid", auth, EditPosition);
routes.get("/positions/:electionid", auth, AdminPositions);
routes.get("/positiondetails/:positionid/:electionid", auth, getPosition);

export default routes;
