import { db } from "../utils/prisma.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await db.post.findMany();

    return res.status(200).json({
      message: "Posts found successfully",
      success: true,
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const addPosts = async (req, res) => {
  try {
    const file = req.file;

    res.json({
      file,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
