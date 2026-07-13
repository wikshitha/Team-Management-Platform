import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (
    !authorizationHeader ||
    !authorizationHeader.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required.",
    });
  }

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required.",
    });
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Authentication token has expired.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid authentication token.",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decodedToken.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      status: true,
      role: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "The user belonging to this token no longer exists.",
    });
  }

  if (user.status !== "ACTIVE") {
    return res.status(403).json({
      success: false,
      message: "Your account is inactive. Contact an administrator.",
    });
  }

  req.user = user;

  next();
});