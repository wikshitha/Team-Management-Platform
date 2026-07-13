import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  getPaginationValues,
  isValidEmail,
  isValidPassword,
  normalizeEmail,
  normalizeName,
} from "../utils/validators.js";

const userPublicSelect = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  status: true,
  roleId: true,
  role: {
    select: {
      id: true,
      name: true,
      description: true,
    },
  },
  createdAt: true,
  updatedAt: true,
};

const findRoleByIdentifier = async ({ roleId, roleName }) => {
  if (roleId) {
    return prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });
  }

  if (roleName) {
    return prisma.role.findUnique({
      where: {
        name: roleName.trim().toUpperCase(),
      },
    });
  }

  return null;
};

const countActiveAdministrators = async () => {
  return prisma.user.count({
    where: {
      status: "ACTIVE",
      role: {
        name: "ADMIN",
      },
    },
  });
};

export const getUsers = asyncHandler(async (req, res) => {
  const {
    search = "",
    role = "",
    status = "",
    page: pageValue = "1",
    limit: limitValue = "10",
  } = req.query;

  const { page, limit, skip } = getPaginationValues(
    pageValue,
    limitValue
  );

  const where = {};

  if (typeof search === "string" && search.trim()) {
    where.OR = [
      {
        name: {
          contains: search.trim(),
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search.trim(),
          mode: "insensitive",
        },
      },
    ];
  }

  if (typeof role === "string" && role.trim()) {
    where.role = {
      name: role.trim().toUpperCase(),
    };
  }

  if (typeof status === "string" && status.trim()) {
    const normalizedStatus = status.trim().toUpperCase();

    if (!["ACTIVE", "INACTIVE"].includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Status must be ACTIVE or INACTIVE.",
      });
    }

    where.status = normalizedStatus;
  }

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where,
      select: userPublicSelect,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.user.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  return res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        limit,
        totalItems: totalUsers,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      ...userPublicSelect,
      _count: {
        select: {
          createdProjects: true,
          projectMembers: true,
          assignedTasks: true,
          createdTasks: true,
          comments: true,
          notifications: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

export const createUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    roleId,
    roleName,
    status = "ACTIVE",
    avatar,
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and password are required.",
    });
  }

  if (!roleId && !roleName) {
    return res.status(400).json({
      success: false,
      message: "A roleId or roleName is required.",
    });
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Name must contain at least 2 characters.",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid email address.",
    });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least 8 characters.",
    });
  }

  const normalizedStatus = String(status).trim().toUpperCase();

  if (!["ACTIVE", "INACTIVE"].includes(normalizedStatus)) {
    return res.status(400).json({
      success: false,
      message: "Status must be ACTIVE or INACTIVE.",
    });
  }

  const normalizedEmail = normalizeEmail(email);

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "A user with this email address already exists.",
    });
  }

  const role = await findRoleByIdentifier({
    roleId,
    roleName,
  });

  if (!role) {
    return res.status(400).json({
      success: false,
      message: "The selected role does not exist.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: normalizeName(name),
      email: normalizedEmail,
      password: hashedPassword,
      avatar:
        typeof avatar === "string" && avatar.trim()
          ? avatar.trim()
          : null,
      status: normalizedStatus,
      roleId: role.id,
    },
    select: userPublicSelect,
  });

  return res.status(201).json({
    success: true,
    message: "User created successfully.",
    data: {
      user,
    },
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, avatar } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!existingUser) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  const updateData = {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must contain at least 2 characters.",
      });
    }

    updateData.name = normalizeName(name);
  }

  if (email !== undefined) {
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const userWithEmail = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        NOT: {
          id,
        },
      },
    });

    if (userWithEmail) {
      return res.status(409).json({
        success: false,
        message: "Another user already uses this email address.",
      });
    }

    updateData.email = normalizedEmail;
  }

  if (avatar !== undefined) {
    if (avatar !== null && typeof avatar !== "string") {
      return res.status(400).json({
        success: false,
        message: "Avatar must be a valid URL string or null.",
      });
    }

    updateData.avatar =
      typeof avatar === "string" && avatar.trim()
        ? avatar.trim()
        : null;
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Provide at least one field to update.",
    });
  }

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: updateData,
    select: userPublicSelect,
  });

  return res.status(200).json({
    success: true,
    message: "User updated successfully.",
    data: {
      user: updatedUser,
    },
  });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Status is required.",
    });
  }

  const normalizedStatus = String(status).trim().toUpperCase();

  if (!["ACTIVE", "INACTIVE"].includes(normalizedStatus)) {
    return res.status(400).json({
      success: false,
      message: "Status must be ACTIVE or INACTIVE.",
    });
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      role: true,
    },
  });

  if (!targetUser) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  if (
    targetUser.id === req.user.id &&
    normalizedStatus === "INACTIVE"
  ) {
    return res.status(400).json({
      success: false,
      message: "You cannot deactivate your own account.",
    });
  }

  if (
    targetUser.role.name === "ADMIN" &&
    targetUser.status === "ACTIVE" &&
    normalizedStatus === "INACTIVE"
  ) {
    const activeAdministratorCount =
      await countActiveAdministrators();

    if (activeAdministratorCount <= 1) {
      return res.status(400).json({
        success: false,
        message:
          "The final active Administrator cannot be deactivated.",
      });
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: normalizedStatus,
    },
    select: userPublicSelect,
  });

  return res.status(200).json({
    success: true,
    message: `User ${
      normalizedStatus === "ACTIVE" ? "activated" : "deactivated"
    } successfully.`,
    data: {
      user: updatedUser,
    },
  });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { roleId, roleName } = req.body;

  if (!roleId && !roleName) {
    return res.status(400).json({
      success: false,
      message: "A roleId or roleName is required.",
    });
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      role: true,
    },
  });

  if (!targetUser) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  const newRole = await findRoleByIdentifier({
    roleId,
    roleName,
  });

  if (!newRole) {
    return res.status(400).json({
      success: false,
      message: "The selected role does not exist.",
    });
  }

  if (targetUser.roleId === newRole.id) {
    return res.status(400).json({
      success: false,
      message: "The user already has this role.",
    });
  }

  if (targetUser.id === req.user.id) {
    return res.status(400).json({
      success: false,
      message: "You cannot change your own Administrator role.",
    });
  }

  if (
    targetUser.role.name === "ADMIN" &&
    targetUser.status === "ACTIVE" &&
    newRole.name !== "ADMIN"
  ) {
    const activeAdministratorCount =
      await countActiveAdministrators();

    if (activeAdministratorCount <= 1) {
      return res.status(400).json({
        success: false,
        message:
          "The final active Administrator cannot be assigned another role.",
      });
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      roleId: newRole.id,
    },
    select: userPublicSelect,
  });

  return res.status(200).json({
    success: true,
    message: "User role updated successfully.",
    data: {
      user: updatedUser,
    },
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (id === req.user.id) {
    return res.status(400).json({
      success: false,
      message: "You cannot delete your own account.",
    });
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      role: true,
      _count: {
        select: {
          createdProjects: true,
          createdTasks: true,
        },
      },
    },
  });

  if (!targetUser) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  if (
    targetUser.role.name === "ADMIN" &&
    targetUser.status === "ACTIVE"
  ) {
    const activeAdministratorCount =
      await countActiveAdministrators();

    if (activeAdministratorCount <= 1) {
      return res.status(400).json({
        success: false,
        message: "The final active Administrator cannot be deleted.",
      });
    }
  }

  if (
    targetUser._count.createdProjects > 0 ||
    targetUser._count.createdTasks > 0
  ) {
    return res.status(409).json({
      success: false,
      message:
        "This user owns project or task records and cannot be deleted. Deactivate the account instead.",
    });
  }

  await prisma.user.delete({
    where: {
      id,
    },
  });

  return res.status(200).json({
    success: true,
    message: "User deleted successfully.",
  });
});