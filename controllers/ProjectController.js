import { db } from "../utils/prisma.js";
import fs from "fs";
export const AddProject = async (req, res) => {
  try {
    const body = req.body;
    const file = req.file;
    const { title, description, skills, link_github, link_demo } = body;
    const authorId = req.user.id;

    if (
      !title ||
      !description ||
      !skills ||
      !file ||
      !link_github ||
      !link_demo
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    const image =
      "https" + "://" + req.get("host") + "/uploads/" + file.filename;

    const id_image = file.filename;

    const newProject = await db.project.create({
      data: {
        title,
        description,
        skilsIds: JSON.parse(skills),
        authorId,
        image,
        id_image,
        link_demo,
        link_github,
      },
    });

    if (!newProject) {
      return res.status(400).json({
        message: "Project not created",
        success: false,
      });
    }

    res.json({
      message: "Project created successfully",
      success: true,
      data: newProject,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await db.project.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        link_demo: true,
        link_github: true,
        author: {
          select: {
            id: true,
            name: true,
            profile_picture: true,
          },
        },
        skills: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      message: "Projects found successfully",
      success: true,
      data: projects,
    });
  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
};

export const getOneProject = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await db.project.findMany({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        link_demo: true,
        link_github: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        skills: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.json({
      message: "Project found successfully",
      success: true,
      data: project,
    });
  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const project = await db.project.findUnique({
      where: {
        id: id,
      },
    });

    if (!project) {
      return res.json({
        message: "Project not found",
        success: false,
      });
    }

    if (project.authorId !== userId) {
      return res.json({
        message: "You are not authorized to delete this project",
        success: false,
      });
    }

    // delete image in cloduinary

    const { id_image } = project;

    if (!id_image) {
      return res.json({
        message: "Project not deleted",
        error: "id image not found",
        success: false,
      });
    }

    // hapus image dari directory

    fs.unlinkSync("./public/uploads/" + id_image);

    const deleteProject = await db.project.delete({
      where: {
        id: id,
      },
    });

    if (!deleteProject) {
      return res.json({
        message: "Project not deleted",
        success: false,
      });
    }

    return res.json({
      message: "Project deleted successfully",
      success: true,
      data: project,
    });
  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const body = req.body;
    const file = await req.file;
    const id = req.params.id;
    const { title, description, skills, link_demo, link_github } = body;
    const authorId = req.user.id;

    if (!title || !description || !skills || !link_demo || !link_github) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    const project = await db.project.findUnique({
      where: {
        id: id,
      },
    });

    if (!project) {
      return res.json({
        message: "Project not found",
        success: false,
      });
    }

    if (project.authorId !== authorId) {
      return res.json({
        message: "You are not authorized to update this project",
        success: false,
      });
    }

    const idImageOld = project.id_image;

    if (file) {
      const image =
        "https" + "://" + req.get("host") + "/uploads/" + file.filename;

      const id_image = file.filename;

      const updateProject = await db.project.update({
        where: {
          id: id,
        },
        data: {
          title,
          description,
          skilsIds: JSON.parse(skills),
          authorId,
          image,
          id_image,
          link_demo,
          link_github,
        },
      });

      if (!updateProject) {
        return res.status(400).json({
          message: "Project not updated",
          success: false,
        });
      }

      fs.unlinkSync("./public/uploads/" + idImageOld);

      return res.json({
        message: "Project updated successfully",
        success: true,
        data: updateProject,
      });
    }

    const updateProject = await db.project.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        skilsIds: JSON.parse(skills),
        link_demo,
        link_github,
      },
    });

    if (!updateProject) {
      return res.json({
        message: "Project not updated",
        success: false,
      });
    }

    return res.json({
      message: "Project updated successfully",
      success: true,
      data: updateProject,
    });
  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
};
