import express from "express";
import { addPosts, getAllPosts } from "../controllers/PostController.js";
import { upload } from "../utils/multer.js";

const PostRoute = express.Router();

PostRoute.get("/posts", getAllPosts);
PostRoute.post("/posts", upload.single("file"), addPosts);

export default PostRoute;
