const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
const tsConfigPath = path.join(projectRoot, "next.config.ts");

if (fs.existsSync(tsConfigPath)) {
  try {
    fs.rmSync(tsConfigPath);
    console.log("Removed unsupported next.config.ts before build.");
  } catch (error) {
    console.error("Failed to remove next.config.ts. Please delete it manually.", error);
    process.exit(1);
  }
}

if (!process.env.DATABASE_URL) {
  const fallbackUrl = "postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public";
  process.env.DATABASE_URL = fallbackUrl;
  console.log("DATABASE_URL was not set. Using placeholder value for Prisma client generation.");
}

const prismaBinary = path.join(
  projectRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "prisma.cmd" : "prisma"
);

try {
  execSync(`${prismaBinary} generate`, { stdio: "inherit" });
} catch (error) {
  console.error("Prisma client generation failed.", error);
  process.exit(1);
}
