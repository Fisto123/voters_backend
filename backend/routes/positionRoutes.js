import express from "express";
import { auth } from "../middleware/verify.js";
import { EditPosition, createPosition } from "../controllers/position.js";
const routes = express.Router({
  mergeParams: true,
});

routes.post("/addpositions/:electionid", auth, createPosition);
routes.patch("/editposition/:positionid", auth, EditPosition);

export default routes;
