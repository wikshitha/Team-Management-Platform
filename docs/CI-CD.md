# 🚀 CI/CD Workflow

## Overview

This project uses **GitHub Actions** to automate Continuous Integration (CI). Every code change pushed to the repository is automatically validated to ensure the application builds successfully and passes quality checks before being merged.

Although Continuous Deployment (CD) is not configured for this project, the workflow is designed so deployment can easily be added in the future.

---

# CI/CD Pipeline

```
Developer
      │
      │ Push / Pull Request
      ▼
GitHub Repository
      │
      ▼
GitHub Actions
      │
      ├──────────────┐
      │              │
      ▼              ▼
Install         Install
Backend         Frontend
Dependencies    Dependencies
      │              │
      ▼              ▼
Run Tests      ESLint Check
      │              │
      └──────┬───────┘
             ▼
      Build Application
             │
             ▼
     CI Workflow Success
```

---

# Continuous Integration (CI)

The GitHub Actions workflow performs the following steps automatically whenever code is pushed or a Pull Request is created.

## 1. Checkout Repository

The latest source code is downloaded from GitHub.

```yaml
uses: actions/checkout@v4
```

---

## 2. Setup Node.js

The workflow installs the required Node.js version.

```yaml
uses: actions/setup-node@v4
```

Node Version

```
Node.js 22
```

---

## 3. Install Backend Dependencies

```bash
npm install
```

This installs all backend packages listed in **package.json**.

---

## 4. Run Backend Tests

```bash
npm test
```

Unit tests are executed using **Vitest**.

The current test suite includes:

- JWT Token generation
- Role authorization middleware
- Async handler utility

---

## 5. Install Frontend Dependencies

```bash
npm install
```

All frontend dependencies are installed.

---

## 6. Run ESLint

```bash
npm run lint
```

This checks the codebase for:

- Syntax errors
- React hook rules
- TypeScript issues
- Code quality problems

---

## 7. Build Frontend

```bash
npm run build
```

The production build is generated successfully to ensure there are no build-time errors.

---

# Workflow Triggers

The CI workflow runs automatically on:

- Push to `master`
- Pull Requests targeting `master`

Example:

```yaml
on:
  push:
    branches:
      - master

  pull_request:
    branches:
      - master
```

---

# Workflow File

Location:

```
.github/workflows/ci.yml
```

---

# Tools Used

| Tool | Purpose |
|-------|----------|
| GitHub Actions | CI Automation |
| Node.js | Runtime Environment |
| npm | Dependency Management |
| Vitest | Unit Testing |
| ESLint | Static Code Analysis |
| Next.js Build | Production Build Validation |

---

# Current CI Checks

The following validations are performed automatically:

- Repository checkout
- Node.js installation
- Backend dependency installation
- Backend unit tests
- Frontend dependency installation
- ESLint validation
- Next.js production build

---

# Continuous Deployment (CD)

Continuous Deployment is **not implemented** in this project.

The project is currently configured for **Continuous Integration only**.

The generated production build can be deployed manually to any supported hosting platform.

---

# Future Improvements

The CI/CD pipeline can be extended with:

- Automatic Docker image creation
- Docker Hub publishing
- Deployment to Render
- Deployment to AWS EC2
- Deployment to Azure App Service
- Deployment to Google Cloud Run
- Automated rollback
- End-to-end testing
- Code coverage reporting
- Security vulnerability scanning

---

# Summary

The implemented GitHub Actions workflow provides an automated Continuous Integration pipeline that ensures code quality by installing dependencies, running backend unit tests, performing frontend linting, and verifying successful production builds before code is merged into the main branch.