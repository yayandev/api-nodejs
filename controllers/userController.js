import { db } from "../utils/prisma.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { TokenBlack } from "../middlewares/Token.js";
import fs from "fs";
export const Register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    const users = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (users) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        success: false,
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (!newUser) {
      return res.status(500).json({
        message: "Failed to register user",
        success: false,
      });
    }

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Email or password is incorrect!",
        success: false,
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(404).json({
        message: "Email or password is incorrect!",
        success: false,
      });
    }

    const dataToken = {
      id: user.id,
      name: user.name,
      email: user.email,
      profile_picture: user.profile_picture,
    };

    const token = jwt.sign(dataToken, process.env.JWT_SECRET);

    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      token: token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_picture: user.profile_picture,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const Profile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile_picture: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "User profile",
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const Logout = async (req, res) => {
  try {
    // blacklist token
    const token = req.headers.authorization.split(" ")[1];

    TokenBlack.push(token);

    res.status(200).json({
      message: "User logged out successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isMatch = await bcryptjs.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect",
        success: false,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        success: false,
      });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    if (!updatedUser) {
      return res.status(500).json({
        message: "Failed to change password",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Password changed successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: true,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const body = req.body;
    const { name } = body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
      },
    });

    if (!updatedUser) {
      return res.status(500).json({
        message: "Failed to update profile",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getMyProject = async (req, res) => {
  try {
    const { userId } = req.params;

    const projects = await db.project.findMany({
      where: {
        authorId: userId,
      },
    });

    return res.status(200).json({
      message: "Projects found successfully",
      success: true,
      data: projects,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const image =
      "https" + "://" + req.get("host") + "/uploads/" + req.file.filename;

    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        profile_picture: image,
        id_profile_picture: req.file.filename,
      },
    });

    if (!updatedUser) {
      return res.status(500).json({
        message: "Failed to update profile picture",
        success: false,
      });
    }

    const oldImage = user.profile_picture;

    if (oldImage !== "default.png") {
      const filename = user.id_profile_picture;
      // delete image in directory
      fs.unlinkSync(`./public/uploads/${filename}`);
    }

    return res.status(200).json({
      message: "Profile picture updated successfully",
      success: true,
      data: image,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const resetProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const filename = user.id_profile_picture;

    if (filename !== "default.png") {
      // delete image in directory
      fs.unlinkSync(`./public/uploads/${filename}`);
    }

    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        profile_picture: "default.png",
        id_profile_picture: "default.png",
      },
    });

    if (!updatedUser) {
      return res.status(500).json({
        message: "Failed to reset profile picture",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Profile picture reset successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const changeEmail = async (req, res) => {
  try {
    const userId = req.user.id;

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Password is incorrect",
        success: false,
      });
    }

    const validateEmail = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (validateEmail) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        email,
      },
    });

    if (!updatedUser) {
      return res.status(500).json({
        message: "Failed to change email",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Email changed successfully",
      success: true,
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        profile_picture: updatedUser.profile_picture,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const statistiks = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        _count: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User statistics",
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
