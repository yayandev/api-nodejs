import express from "express";
import {
  Login,
  Logout,
  Profile,
  Register,
  changePassword,
  getMyProject,
  updateProfile,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/Auth.js";

const userRoute = express.Router();

userRoute.post("/register", Register);

userRoute.post("/login", Login);
userRoute.get("/profile", verifyToken, Profile);
userRoute.get("/myprojects/:userId", getMyProject);
userRoute.put("/profile", verifyToken, updateProfile);
userRoute.delete("/logout", verifyToken, Logout);
userRoute.put("/change-password", verifyToken, changePassword);

export default userRoute;
