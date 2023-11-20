import { db } from "../utils/prisma.js";
import fs from "fs";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await db.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

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
    const body = req.body;

    if (!body) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    const file = req.file;

    const { title, content } = body;

    if (!title || !content || !file) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    const image =
      req.protocol + "://" + req.get("host") + "/uploads/" + file.filename;

    const id_image = file.filename;

    const authorId = req.user.id;

    if (!authorId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const newPost = await db.post.create({
      data: {
        title,
        content,
        image,
        id_image,
        authorId,
      },
    });

    if (!newPost) {
      return res.status(400).json({
        message: "Post not created",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Post created successfully",
      success: true,
      data: newPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const body = req.body;
    const file = req.file;

    const id = req.params.id;
    const authorId = req.user.id;

    const post = await db.post.findUnique({
      where: {
        id: id,
      },
    });

    if (authorId !== post.authorId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    const { title, content } = body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    if (!file) {
      const updatePost = await db.post.update({
        where: {
          id: id,
        },
        data: {
          title,
          content,
        },
      });

      return res.status(200).json({
        message: "Post updated successfully",
        success: true,
        data: updatePost,
      });
    }

    const oldImage = post.id_image;

    fs.unlinkSync("./public/uploads/" + oldImage);

    const image =
      req.protocol + "://" + req.get("host") + "/uploads/" + file.filename;

    const id_image = file.filename;

    const updatePost = await db.post.update({
      where: {
        id: id,
      },
      data: {
        title,
        content,
        image,
        id_image,
      },
    });

    return res.status(200).json({
      message: "Post updated successfully",
      success: true,
      data: updatePost,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;

    const authorId = req.user.id;

    const post = await db.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    if (authorId !== post.authorId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const oldImage = post.id_image;

    fs.unlinkSync("./public/uploads/" + oldImage);

    const deletePost = await db.post.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
      data: deletePost,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getOnePosts = async (req, res) => {
  try {
    const id = req.params.id;

    const post = await db.post.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Post fetched successfully",
      success: true,
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const searchPost = async (req, res) => {
  try {
    const search = req.params.q;

    if (!search) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    const posts = await db.post.findMany({
      where: {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Posts fetched successfully",
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

export const getPostByAuthor = async (req, res) => {
  try {
    const authorId = req.params.authorId;

    if (!authorId) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    const author = await db.user.findUnique({
      where: {
        id: authorId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!author) {
      return res.status(404).json({
        message: "Author not found",
        success: false,
      });
    }

    const posts = await db.post.findMany({
      where: {
        authorId: authorId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Posts fetched successfully",
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
