import { AddProject } from "../controllers/ProjectController.js";
import express from "express";
import uploader from "../utils/multer.js";
const ProjectRoute = express.Router();

ProjectRoute.post("/projects", uploader.single("file"), AddProject);

export default ProjectRoute;
