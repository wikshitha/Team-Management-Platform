import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import {
  isValidEmail,
  isValidPassword,
  normalizeEmail,
} from "../utils/validators.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid email address.",
    });
  }

  const normalizedEmail = normalizeEmail(email);

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    include: {
      role: true,
    },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  if (user.status !== "ACTIVE") {
    return res.status(403).json({
      success: false,
      message: "Your account is inactive. Contact an administrator.",
    });
  }

  const token = generateToken(user);

  return res.status(200).json({
    success: true,
    message: "Login successful.",
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        role: {
          id: user.role.id,
          name: user.role.name,
          description: user.role.description,
        },
        createdAt: user.createdAt,
      },
    },
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message:
        "Current password, new password, and password confirmation are required.",
    });
  }

  if (!isValidPassword(newPassword)) {
    return res.status(400).json({
      success: false,
      message: "The new password must contain at least 8 characters.",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "The new password and confirmation do not match.",
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      success: false,
      message:
        "The new password must be different from the current password.",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  const currentPasswordMatches = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!currentPasswordMatches) {
    return res.status(401).json({
      success: false,
      message: "The current password is incorrect.",
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Password changed successfully.",
  });
});