import express from "express";
import {
  activateUser,
  deactivateUser,
  register,
  updateProfilePicture,
} from "../controllers/auth.js";
const routes = express.Router({
  mergeParams: true,
});

routes.post("/register", register);
routes.patch("/activateuser", activateUser);
routes.patch("/deactivateuser", deactivateUser);
routes.patch("/updateprofilepicture/:userid", updateProfilePicture);

export default routes;
