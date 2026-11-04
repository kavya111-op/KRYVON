# KRYVON — Setup Guide

This guide explains how to set up and run the KRYVON project locally.

## 1. Prerequisites

Before starting, install:

- Node.js (LTS version recommended)
- npm (included with Node.js)
- Git
- A code editor such as Visual Studio Code

Check your installations:

```bash
node -v
npm -v
git --version
```

## 2. Clone the Repository

```bash
git clone https://github.com/kavya111-op/KRYVON.git
cd KRYVON
```

## 3. Install Dependencies

Run:

```bash
npm install
```

This installs the dependencies listed in `package.json`.

## 4. Configure Environment Variables

Create a local `.env` file in the project root.

Use `.env.example` as a reference for the required variable names.

Add your own valid credentials to `.env` when required.

**Important:** Never upload `.env` or real API keys, passwords, or payment credentials to GitHub. Keep `.env` private.

## 5. Start the Development Server

Run:

```bash
npm run dev
```

The development command starts the application through `server.ts`.

Open the local address displayed in your terminal. The port and URL depend on the server configuration.

## 6. Build the Project

To create a production build, run:

```bash
npm run build
```

The generated production files are placed in the `dist/` directory.

## 7. TypeScript Check

To check the TypeScript code, run:

```bash
npm run lint
```

## 8. Start the Application

The project also provides:

```bash
npm start
```

This runs the application using the configured server entry point.

## 9. Troubleshooting

**Problem: Dependencies are missing**

Run:

```bash
npm install
```

**Problem: Port is already in use**

Check whether another application is using the configured port. Stop that process or configure an available port.

**Problem: Environment variable is missing**

Check that your local `.env` file contains the required variable names and valid values.

**Problem: Build fails**

Run:

```bash
npm run lint
npm run build
```

Review the error messages and fix the reported issues.

## 10. Important Notes

- Do not upload `node_modules/` or `dist/` to GitHub.
- Keep API keys and payment credentials private.
- Use `.env.example` to document required environment variables without exposing their values.
- Deployment configuration may vary depending on the hosting platform.

---

**Project:** KRYVON — AI-Powered Autonomous Commerce  
**Repository:** https://github.com/kavya111-op/KRYVON
