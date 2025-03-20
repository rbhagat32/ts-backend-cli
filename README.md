# 🚀 TypeScript Backend CLI

A CLI tool to quickly generate an **Express.js backend** with **TypeScript**, **MongoDB**, and essential configurations.

## ⚡ Installation

You can install the CLI globally using **npm** or **npx**:

```sh
# Install globally (optional)
npm install -g types-backend

# OR run directly using npx
npx types-backend
```

## 📦 Features

✅ **Generates a structured TypeScript backend**  
✅ **Includes Express.js, Mongoose, and essential middlewares**  
✅ **Configures TypeScript, Nodemon, and Concurrently for development**  
✅ **Optionally adds authentication, CORS, and dotenv support**  
✅ **Creates a ready-to-use folder structure**  
✅ **Supports automatic setup with `-y` flag**

## 🚀 Usage

1️⃣ Create a new project

```sh
npx types-backend
```

2️⃣ Run in Auto Mode (`-y`)

```sh
npx types-backend -y
```

3️⃣ Give project name through CLI

```sh
npx types-backend myapp
```

4️⃣ Custom Setup with Prompts

```sh
You will be prompted for:

-   Project name
-   Whether to include CORS
-   Whether to include dotenv
-   Whether to include authentication (JWT, bcrypt, cookie-parser)
```

5️⃣ Starting the Development Server

```sh
Just follow these 3 steps:
-   Add your MONGODB_URI in .env file
-   Open terminal in newly created backend folder
-   npm run dev
```

## 🛠️ Project Structure

```sh
myapp/
│── src/
│   ├── config/         # Configuration files (e.g., database)
│	│	├──db.ts		# MongoDB connection setup
│   ├── constants/      # Constant values
│   ├── controllers/    # Route handlers
│   ├── helpers/        # Helper functions
│   ├── middlewares/    # Express middlewares
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── types/          # TypeScript types
│   ├── utils/          # Reusable utilities
│   ├── app.ts          # Main server file
│── .gitignore          # Ignore node_modules and environment files
│── tsconfig.json       # TypeScript configuration
│── package.json        # Project metadata & dependencies
│── .env                # Environment variables (if dotenv is included)

```

## 🤝 Contributing

Want to improve this CLI? Feel free to **fork** the project, make changes, and submit a **pull request (PR)**.

### Steps to Contribute:

1.  Fork this repository.
2.  Clone your fork locally.
3.  Create a new branch for your feature/fix.
4.  Commit your changes and push them.
5.  Submit a pull request for review.

## 📜 License

This project is **open-source** and available under the **ISC License**.

## 👨‍💻 Author

**Raghav Bhagat**  
🔗 GitHub: _[https://github.com/rbhagat32]_  
🔗 LinkedIn: _[https://www.linkedin.com/in/rbhagat32]_
