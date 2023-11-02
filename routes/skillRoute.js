import express from "express";
import { verifyToken } from "../middlewares/Auth.js";
import {
  AddSkill,
  DeleteSkill,
  GetSkill,
} from "../controllers/skillController.js";
const skillRoute = express.Router();

skillRoute.get("/skills", verifyToken, GetSkill);
skillRoute.post("/skills", verifyToken, AddSkill);
skillRoute.delete("/skills/:id", verifyToken, DeleteSkill);
export default skillRoute;
