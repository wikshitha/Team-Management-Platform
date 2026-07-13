import prisma from "../config/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getRoles = asyncHandler(async (req, res) => {
  const roles = await prisma.role.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          users: true,
        },
      },
    },
  });

  return res.status(200).json({
    success: true,
    count: roles.length,
    data: {
      roles,
    },
  });
});