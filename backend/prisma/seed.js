import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const seedDatabase = async () => {
  try {
    console.log("Starting database seed...");

    const adminRole = await prisma.role.upsert({
      where: {
        name: "ADMIN",
      },
      update: {},
      create: {
        name: "ADMIN",
        description:
          "Full access to users, projects, tasks, and system settings",
      },
    });

    const projectManagerRole = await prisma.role.upsert({
      where: {
        name: "PROJECT_MANAGER",
      },
      update: {},
      create: {
        name: "PROJECT_MANAGER",
        description:
          "Can create projects, manage project members, and manage project tasks",
      },
    });

    const teamMemberRole = await prisma.role.upsert({
      where: {
        name: "TEAM_MEMBER",
      },
      update: {},
      create: {
        name: "TEAM_MEMBER",
        description:
          "Can view assigned projects and update assigned task progress",
      },
    });

    const hashedPassword = await bcrypt.hash("Admin@123", 12);

    const adminUser = await prisma.user.upsert({
      where: {
        email: "admin@example.com",
      },
      update: {
        name: "System Administrator",
        status: "ACTIVE",
        roleId: adminRole.id,
      },
      create: {
        name: "System Administrator",
        email: "admin@example.com",
        password: hashedPassword,
        status: "ACTIVE",
        roleId: adminRole.id,
      },
    });

    console.log("Roles created:");
    console.log(`- ${adminRole.name}`);
    console.log(`- ${projectManagerRole.name}`);
    console.log(`- ${teamMemberRole.name}`);

    console.log("Default administrator created:");
    console.log(`- Email: ${adminUser.email}`);
    console.log("- Password: Admin@123");

    console.log("Database seed completed successfully.");
  } catch (error) {
    console.error("Database seed failed:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

seedDatabase();