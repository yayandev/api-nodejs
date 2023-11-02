import express from "express";
import {
  Login,
  Logout,
  Profile,
  Register,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/Auth.js";

const userRoute = express.Router();

userRoute.post("/register", Register);

userRoute.post("/login", Login);
userRoute.get("/profile", verifyToken, Profile);
userRoute.delete("/logout", verifyToken, Logout);

export default userRoute;
