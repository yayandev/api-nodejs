import { db } from "../utils/prisma.js";

export const AddSkill = async (req, res) => {
  try {
    const authorId = req.user.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    const skill = await db.skill.create({
      data: {
        name,
        authorId,
      },
    });

    if (!skill) {
      return res.status(400).json({
        message: "Skill not created",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Skill created successfully",
      success: true,
      data: skill,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const GetSkill = async (req, res) => {
  try {
    const skills = await db.skill.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return res.status(200).json({
      message: "Skills found successfully",
      success: true,
      data: skills,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const DeleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await db.skill.delete({
      where: {
        id,
      },
    });

    if (!skill) {
      return res.status(400).json({
        message: "Skill not deleted",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Skill deleted successfully",
      success: true,
      data: skill,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
