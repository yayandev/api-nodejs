import jwt from "jsonwebtoken";
import { TokenBlack } from "./Token.js";

export const verifyToken = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    if (TokenBlack.includes(token)) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: error.message,
      success: false,
    });
  }
};
