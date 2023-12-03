import express from "express";
import { verifyToken } from "../middlewares/Auth.js";
import {
  AddSkill,
  DeleteSkill,
  EditSkill,
  GetSkill,
  GetSkillById,
} from "../controllers/skillController.js";
import { upload } from "../utils/multer.js";
const skillRoute = express.Router();

skillRoute.get("/skills", GetSkill);
skillRoute.post("/skills", upload.single("file"), verifyToken, AddSkill);
skillRoute.put("/skills/:id", upload.single("file"), verifyToken, EditSkill);
skillRoute.delete("/skills/:id", verifyToken, DeleteSkill);
skillRoute.get("/skills/:id", GetSkillById);
export default skillRoute;
