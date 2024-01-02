import { db } from "../utils/prisma.js";
import fs from "fs";
export const getEducation = async (req, res) => {
  try {
    const education = await db.education.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profile_picture: true,
          },
        },
      },
    });
    return res.status(200).json({
      message: "Education found successfully",
      success: true,
      data: education,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getEducationById = async (req, res) => {
  try {
    const id = req.params.id;

    const education = await db.education.findUnique({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profile_picture: true,
          },
        },
      },
    });

    if (!education) {
      return res.status(404).json({
        message: "Education not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Education found successfully",
      success: true,
      data: education,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const createEducation = async (req, res) => {
  try {
    const body = req.body;
    const { name, description, time, link } = body;

    const authorId = req.user.id;

    const file = req.file;

    if (!name || !description || !time || !link || !file) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    const image =
      "https" + "://" + req.get("host") + "/uploads/" + file.filename;

    const id_image = file.filename;

    const education = await db.education.create({
      data: {
        name,
        description,
        authorId,
        image,
        id_image,
        time,
        link,
      },
    });

    if (!education) {
      return res.status(400).json({
        message: "Education not created",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Education created successfully",
      success: true,
      data: education,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const education = await db.education.findUnique({
      where: {
        id,
      },
    });

    if (!education) {
      return res.status(404).json({
        message: "Education not found",
        success: false,
      });
    }

    const image = education.id_image;

    if (image) {
      fs.unlinkSync("./public/uploads/" + image);
    }

    const deletedEducation = await db.education.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Education deleted successfully",
      success: true,
      data: deletedEducation,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
