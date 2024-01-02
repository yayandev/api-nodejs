import express from "express";
import {
  createEducation,
  deleteEducation,
  getEducation,
  getEducationById,
} from "../controllers/EducationController.js";
import { verifyToken } from "../middlewares/Auth.js";
import { upload } from "../utils/multer.js";

const EducationRoute = express.Router();
EducationRoute.get("/education", getEducation);
EducationRoute.get("/education/:id", getEducationById);
EducationRoute.delete("/education/:id", verifyToken, deleteEducation);
EducationRoute.post(
  "/education",
  upload.single("file"),
  verifyToken,
  createEducation
);
export default EducationRoute;
