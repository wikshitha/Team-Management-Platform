import "dotenv/config";
import app from "./app.js";
import prisma from "./config/prisma.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await prisma.$connect();

    console.log("PostgreSQL database connected successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`${signal} received. Closing application...`);

  await prisma.$disconnect();

  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();