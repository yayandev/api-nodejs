import { db } from "../utils/prisma.js";
import fs from "fs";
export const AddSkill = async (req, res) => {
  try {
    const authorId = req.user.id;
    const { name } = req.body;
    const file = req.file;

    if (!name) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    if (file) {
      const image =
        "https" + "://" + req.get("host") + "/uploads/" + file.filename;
      const id_image = file.filename;

      const newSkill = await db.skill.create({
        data: {
          name,
          authorId,
          image,
          id_image,
        },
      });

      if (!newSkill) {
        return res.status(400).json({
          message: "Skill not created",
          success: false,
        });
      }

      return res.status(200).json({
        message: "Skill created successfully",
        success: true,
        data: newSkill,
      });
    }

    const newSkill = await db.skill.create({
      data: {
        name,
        authorId,
      },
    });

    if (!newSkill) {
      return res.status(400).json({
        message: "Skill not created",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Skill created successfully",
      success: true,
      data: newSkill,
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
    const take = Number(req.query.take) || 5;
    const skip = Number(req.query.skip) || 0;

    if (req.query.take === "all") {
      const skills = await db.skill.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          id_image: true,
        },
      });

      return res.status(200).json({
        message: "Skills found successfully",
        success: true,
        data: skills,
      });
    }

    const skills = await db.skill.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        id_image: true,
      },
      take,
      skip,
    });

    const jumlahSkill = await db.skill.count();

    const nextPage = jumlahSkill > skip + take ? true : false;

    return res.status(200).json({
      message: "Skills found successfully",
      success: true,
      data: skills,
      nextPage,
      jumlahSkill,
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

    const id_image = skill.id_image;

    if (id_image !== "default") {
      fs.unlinkSync(`./public/uploads/${id_image}`);
    }

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

export const EditSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const authorId = req.user.id;
    const file = req.file;

    if (!name) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    const skill = await db.skill.findUnique({
      where: {
        id,
      },
    });

    if (!skill) {
      return res.status(400).json({
        message: "Skill not found",
        success: false,
      });
    }

    if (authorId !== skill.authorId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    if (!file) {
      const updateSkill = await db.skill.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });

      if (!updateSkill) {
        return res.status(400).json({
          message: "Skill not updated",
          success: false,
        });
      }

      return res.status(200).json({
        message: "Skill updated successfully",
        success: true,
        data: updateSkill,
      });
    }

    const image =
      "https" + "://" + req.get("host") + "/uploads/" + file.filename;
    const id_image = file.filename;
    const oldImage = skill.id_image;

    const updateSkill = await db.skill.update({
      where: {
        id,
      },
      data: {
        name,
        image,
        id_image,
      },
    });

    if (!updateSkill) {
      return res.status(400).json({
        message: "Skill not updated",
        success: false,
      });
    }

    if (oldImage !== "default") {
      fs.unlinkSync("./public/uploads/" + oldImage);
    }

    return res.status(200).json({
      message: "Skill updated successfully",
      success: true,
      data: updateSkill,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const GetSkillById = async (req, res) => {
  try {
    const id = req.params.id;

    const skill = await db.skill.findUnique({
      where: {
        id,
      },
    });

    if (!skill) {
      return res.status(400).json({
        message: "Skill not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Skill found successfully",
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
