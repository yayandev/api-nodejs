import express from "express";
import {
  addPosts,
  deletePost,
  getAllPosts,
  getOnePosts,
  updatePost,
} from "../controllers/PostController.js";
import { upload } from "../utils/multer.js";
import { verifyToken } from "../middlewares/Auth.js";

const PostRoute = express.Router();

PostRoute.get("/posts", getAllPosts);
PostRoute.get("/posts/:id", getOnePosts);
PostRoute.post("/posts", upload.single("file"), verifyToken, addPosts);
PostRoute.put("/posts/:id", upload.single("file"), verifyToken, updatePost);
PostRoute.delete("/posts/:id", verifyToken, deletePost);

export default PostRoute;
