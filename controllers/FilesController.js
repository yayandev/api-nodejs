import { db } from "../utils/prisma.js";
import fs from "fs";

export const getFiles = async (req, res) => {
  try {
    const userID = req.user.id;

    const files = await db.files.findMany({
      where: {
        authorId: userID,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Files found successfully",
      success: true,
      data: files,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getFile = async (req, res) => {
  try {
    const id = req.params.id;

    const file = await db.files.findUnique({
      where: {
        id,
      },
    });

    if (!file) {
      return res.status(404).json({
        message: "File not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "File found successfully",
      success: true,
      data: file,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const uploadFile = async (req, res) => {
  try {
    const authorId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    const path =
      "https" + "://" + req.get("host") + "/uploads/" + file.filename;
    const type = file.mimetype;
    const name = file.filename;

    const newFile = await db.files.create({
      data: {
        path,
        type,
        name,
        authorId,
      },
    });

    if (!newFile) {
      return res.status(400).json({
        message: "File not uploaded",
        success: false,
      });
    }

    return res.status(200).json({
      message: "File uploaded successfully",
      success: true,
      data: newFile,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const id = req.params.id;

    const file = await db.files.findUnique({
      where: {
        id,
      },
    });

    if (!file) {
      return res.status(404).json({
        message: "File not found",
        success: false,
      });
    }

    if (file.authorId !== req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const path = "./public/uploads/" + file.name;

    const deletedFile = await db.files.delete({
      where: {
        id,
      },
    });

    if (!deletedFile) {
      return res.status(400).json({
        message: "File not deleted",
        success: false,
      });
    }

    fs.unlinkSync(path);

    return res.status(200).json({
      message: "File deleted successfully",
      success: true,
      data: deletedFile,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
