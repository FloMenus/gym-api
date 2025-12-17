import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import express from "express";
import routes from "./routes";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/", routes);

async function main(): Promise<void> {
  try {
    console.log("Starting API...");

    await prisma.$connect();
    console.log("Database connection OK");

    const server = app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
      console.log("API is ready!");
    });

    server.on("error", (error) => {
      console.error("Server Errors:", error);
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received, closing server...");
      server.close(() => {
        prisma.$disconnect();
      });
    });
  } catch (error) {
    console.error("Errors in main:", error);
    process.exit(1);
  }
}

main();
