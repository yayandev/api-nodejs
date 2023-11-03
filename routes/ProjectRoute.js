import { AddProject } from "../controllers/ProjectController.js";
import express from "express";
import { upload } from "../utils/multer.js";
const ProjectRoute = express.Router();

ProjectRoute.post("/projects", upload.single("file"), AddProject);

export default ProjectRoute;
