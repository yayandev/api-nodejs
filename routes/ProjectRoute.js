import {
  AddProject,
  deleteOne,
  getAllProjects,
  getOneProject,
} from "../controllers/ProjectController.js";
import express from "express";
import { upload } from "../utils/multer.js";
import { verifyToken } from "../middlewares/Auth.js";
const ProjectRoute = express.Router();

ProjectRoute.post("/projects", upload.single("file"), verifyToken, AddProject);
ProjectRoute.get("/projects", getAllProjects);
ProjectRoute.get("/projects/:id", getOneProject);
ProjectRoute.delete("/projects/:id", verifyToken, deleteOne);

export default ProjectRoute;
