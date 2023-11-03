import cloudinary from "../utils/cloduinary.js";
import { db } from "../utils/prisma.js";
export const AddProject = async (req, res) => {
  try {
    const body = req.body;
    const file = await req.file;
    const { title, description, skills } = body;
    const authorId = req.user.id;

    if (!title || !description || !skills || !file) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, async (error, result) => {
        if (error) {
          return res.status(500).json({
            message: error.message,
            success: false,
          });
        }

        const { public_id, secure_url } = result;

        const newProject = await db.project.create({
          data: {
            title,
            description,
            skilsIds: JSON.parse(skills),
            authorId,
            image: secure_url,
            id_image: public_id,
          },
        });

        if (!newProject) {
          return res.status(400).json({
            message: "Project not created",
            success: false,
          });
        }

        res.json({
          message: "File uploaded successfully",
          success: true,
          data: newProject,
        });
      })
      .end(file.buffer);
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

    const deleteImageResult = await cloudinary.uploader.destroy(id_image);

    if (!deleteImageResult) {
      return res.json({
        message: "Project not deleted",
        error: "Failed to delete image",
        success: false,
      });
    }

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
      deleteImageResult,
    });
  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
};
