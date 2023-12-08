import express from "express";
import { verifyToken } from "../middlewares/Auth.js";
import { upload } from "../utils/multer.js";
import {
  deleteFile,
  getFile,
  getFiles,
  uploadFile,
} from "../controllers/FilesController.js";

const FilesRoute = express.Router();

FilesRoute.get("/files", verifyToken, getFiles);
FilesRoute.get("/files/:id", verifyToken, getFile);
FilesRoute.post("/files", verifyToken, upload.single("file"), uploadFile);
FilesRoute.delete("/files/:id", verifyToken, deleteFile);

export default FilesRoute;
