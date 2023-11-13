import express from "express";
import { getAllPosts } from "../controllers/PostController.js";

const PostRoute = express.Router();

PostRoute.get("/posts", getAllPosts);

export default PostRoute;
