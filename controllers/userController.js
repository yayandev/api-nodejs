import { db } from "../utils/prisma.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { TokenBlack } from "../middlewares/Token.js";

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
