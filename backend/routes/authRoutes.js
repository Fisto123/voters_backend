import express from "express";
import {
  activateUser,
  deactivateUser,
  register,
  updateProfilePicture,
  adminLogin,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/auth.js";
const routes = express.Router({
  mergeParams: true,
});

routes.post("/createaccount", register);
routes.patch("/activateaccount", activateUser);
routes.patch("/deactivateaccount", deactivateUser);
routes.patch("/uploadprofilepicture/:userid", updateProfilePicture);
routes.post("/adminlogin", adminLogin);
routes.post("/requestforgotcode", forgotPassword);
routes.post("/resetpassword", resetPassword);
routes.patch("/changepassword", changePassword);

export default routes;
