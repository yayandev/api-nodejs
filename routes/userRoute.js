import express from "express";
import {
  Login,
  Logout,
  Profile,
  Register,
  changeEmail,
  changePassword,
  getMyProject,
  resetProfilePicture,
  updateProfile,
  updateProfilePicture,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/Auth.js";
import { upload } from "../utils/multer.js";

const userRoute = express.Router();

userRoute.post("/register", Register);

userRoute.post("/login", Login);
userRoute.get("/profile", verifyToken, Profile);
userRoute.get("/myprojects/:userId", getMyProject);
userRoute.put("/profile", verifyToken, updateProfile);
userRoute.delete("/logout", verifyToken, Logout);
userRoute.put("/change-password", verifyToken, changePassword);
userRoute.put(
  "/profile/picture",
  verifyToken,
  upload.single("file"),
  updateProfilePicture
);
userRoute.put("/profile/picture/reset", verifyToken, resetProfilePicture);
userRoute.put("/profile/email", verifyToken, changeEmail);

export default userRoute;
