#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";

interface Answers {
  projectName: string;
  useCors: boolean;
  useDotenv: boolean;
  useAuth: boolean;
}

async function main() {
  console.log(chalk.blue("🚀 Welcome to TypeScript Backend CLI asfda!"));

  // Get the project name from command-line argument
  const projectArg = process.argv[2]; // e.g., types-backend myapp → "myapp"

  // Check for -y flag (auto mode)
  const autoMode = process.argv.includes("-y");

  let answers: Answers;

  if (autoMode) {
    console.log(
      chalk.yellow("⚡ Running in auto mode with default settings...")
    );
    answers = {
      projectName: projectArg || "backend", // Use CLI argument or default to "backend"
      useCors: true,
      useDotenv: true,
      useAuth: true,
    };
  } else {
    // Get user input if no project name is provided
    answers = await inquirer.prompt<Answers>([
      {
        name: "projectName",
        message: "Enter project name:",
        default: projectArg || "backend",
        when: !projectArg, // Ask only if no argument is given
        type: "input", // Explicitly specify type
      },
      {
        type: "confirm",
        name: "useCors",
        message: "Include CORS?",
        default: true,
      },
      {
        type: "confirm",
        name: "useDotenv",
        message: "Include dotenv?",
        default: true,
      },
      {
        type: "confirm",
        name: "useAuth",
        message:
          "Include authentication packages (cookie-parser, jsonwebtoken, bcrypt)?",
        default: true,
      },
    ]);
  }

  const projectName = projectArg || answers.projectName;

  // Create project folder
  const projectPath = path.join(process.cwd(), projectName);
  fs.mkdirSync(projectPath, { recursive: true });
  process.chdir(projectPath);

  console.log(chalk.green(`📂 Creating project: ${projectName}`));

  // Initialize package.json
  console.log(chalk.green("📦 Initializing package.json..."));
  execSync("npm init -y");

  // Install dependencies
  console.log(chalk.green("📥 Installing dependencies..."));
  let dependencies = ["express", "mongoose"];
  if (answers.useCors) dependencies.push("cors");
  if (answers.useDotenv) dependencies.push("dotenv");
  if (answers.useAuth)
    dependencies.push("jsonwebtoken", "cookie-parser", "bcrypt");

  execSync(`npm i ${dependencies.join(" ")}`, { stdio: "ignore" });

  // Install dev dependencies
  console.log(chalk.green("🛠️  Installing dev dependencies..."));
  let devDependencies = [
    "@types/node",
    "@types/express",
    "typescript",
    "nodemon",
    "concurrently",
  ];
  if (answers.useCors) devDependencies.push("@types/cors");
  if (answers.useAuth)
    devDependencies.push(
      "@types/jsonwebtoken",
      "@types/cookie-parser",
      "@types/bcrypt"
    );

  execSync(`npm i -D ${devDependencies.join(" ")}`);

  // Create folder structure
  console.log(chalk.green("📂 Creating folder structure..."));
  const folders = [
    "src/config",
    "src/constants",
    "src/controllers",
    "src/helpers",
    "src/middlewares",
    "src/models",
    "src/routes",
    "src/types",
    "src/utils",
  ];
  folders.forEach((folder) => fs.mkdirSync(folder, { recursive: true }));

  // Create app.ts file
  fs.writeFileSync(
    "src/app.ts",
    `import express from "express";
    ${answers.useCors ? 'import cors from "cors";' : ""}
    ${answers.useDotenv ? 'import dotenv from "dotenv";' : ""}
    ${answers.useAuth ? 'import cookieParser from "cookie-parser";' : ""}

    // MongoDB connection
    import { connectDB } from "./config/db.js";

    const app = express();

    ${answers.useDotenv ? 'dotenv.config({ path: ".env" });' : ""}

    ${
      answers.useCors
        ? `app.use(
      cors({
        origin: [
          \`\${process.env.FRONTEND_URL_DEV}\`,
          \`\${process.env.FRONTEND_URL_PROD}\`
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      })
    );`
        : ""
    }

    connectDB();

    // Middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    ${answers.useAuth ? "app.use(cookieParser());" : ""}

    // Routes
    app.get("/", (_, res) => {
      res.send("Hello World");
    });

    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, () => {
      console.log(\`Server is running on http://localhost:\${PORT}\`);
    });
    `
  );

  // Create .gitignore
  const gitignoreContent = ["node_modules", "dist"];
  if (answers.useDotenv) gitignoreContent.push(".env");
  fs.writeFileSync(".gitignore", gitignoreContent.join("\n"));

  // Create tsconfig.json
  const tsConfig = {
    compilerOptions: {
      target: "ES2020",
      module: "NodeNext",
      rootDir: "src",
      moduleResolution: "NodeNext",
      outDir: "dist",
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      strict: true,
      skipLibCheck: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
    },
  };
  fs.writeFileSync("tsconfig.json", JSON.stringify(tsConfig, null, 2));

  // Update package.json
  const packageJsonPath = "package.json";
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  packageJson.name = projectName;

  const updatedPackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    main: "dist/app.js",
    type: "module",
    scripts: {
      start: "node dist/app.js",
      build: "tsc",
      dev: 'concurrently "tsc -w" "npx nodemon dist/app.js"',
    },
    keywords: packageJson.keywords,
    author: packageJson.author,
    license: packageJson.license,
    dependencies: packageJson.dependencies,
    devDependencies: packageJson.devDependencies,
  };

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(updatedPackageJson, null, 2)
  );

  // Create .env and .env.example if dotenv is enabled
  if (answers.useDotenv) {
    fs.writeFileSync(
      ".env",
      "PORT=3000\nMONGODB_URI=\nFRONTEND_URL_DEV=http://localhost:5173\nFRONTEND_URL_PROD=http://localhost:5174\n"
    );
    fs.writeFileSync(
      ".env.example",
      "PORT=\nMONGODB_URI=\nFRONTEND_URL_DEV=\nFRONTEND_URL_PROD=\n"
    );
  }

  // Create db.ts in config folder
  fs.writeFileSync(
    "src/config/db.ts",
    `import mongoose from "mongoose";

    const connectDB = async (): Promise<typeof mongoose | void> => {
      try {
        if (!process.env.MONGODB_URI) {
          throw new Error("MONGODB_URI is not defined in environment variables");
        }

        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
        return connection;
      } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
      }
    };

    export { connectDB };
    `
  );

  console.log(chalk.green(`🎉 You are good to go ! 🚀`));
}

main().catch((error) => console.error(chalk.red("❌ Error:", error)));
