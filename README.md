<div align="center">

# 🚀 Team Management Platform

### A Full-Stack Project & Team Task Management Platform

A modern enterprise-ready project management system that enables organizations to manage users, projects, teams, tasks, comments, and notifications through secure Role-Based Access Control (RBAC).

Built with **Next.js**, **Node.js**, **Express.js**, **Prisma ORM**, and **PostgreSQL**.

</div>

---

# 📖 Project Overview

The **Team Management Platform** is a full-stack web application designed to simplify project collaboration inside an organization.

The platform supports three different user roles:

- **Administrator**
- **Project Manager**
- **Team Member**

Each role has its own dashboard, permissions, and responsibilities.

Administrators manage the organization by creating users, assigning roles, monitoring projects, and viewing system-wide analytics.

Project Managers create and manage projects, assign Team Members, create tasks, monitor progress, and coordinate work.

Team Members can access their assigned projects, update task progress, collaborate using comments, receive notifications, and manage their own profile.

The system follows a secure REST API architecture using JWT authentication and Role-Based Access Control (RBAC), ensuring that every API and page is accessible only to authorized users.

---

# ✨ Features

## 🔐 Authentication & Authorization

- Secure Login using JWT Authentication
- Password hashing with bcrypt
- Protected API routes
- Role-Based Access Control (RBAC)
- Current authenticated user endpoint
- Change password
- Profile management

---

## 👥 User Management (Administrator)

- Create users
- Update user details
- Delete users
- Activate / Deactivate users
- Assign user roles
- Search users
- Filter by role
- Filter by status
- Pagination

---

## 📁 Project Management

- Create projects
- Edit project details
- Delete projects (Administrator)
- View project details
- Search projects
- Filter by status
- Filter by priority
- Pagination
- Project statistics

---

## 👨‍💻 Team Management

- View Team Members
- Search Team Members
- Assign Team Members to projects
- Remove Team Members from projects
- Prevent duplicate assignments
- View project members

---

## ✅ Task Management

- Create tasks
- Edit tasks
- Delete tasks
- Assign tasks to Team Members
- Update task status
- View project tasks
- View personal tasks
- Task filtering
- Task priority management
- Due date tracking

---

## 💬 Comments

- Add comments
- Edit own comments
- Delete own comments
- View task discussions

---

## 🔔 Notifications

- Task assignment notifications
- Task status notifications
- Comment notifications
- Read/Unread status
- Notification counter
- Notification center

---

## 📊 Dashboards

### Administrator Dashboard

- User statistics
- Project statistics
- Task statistics
- Task status distribution
- Priority distribution
- Recent users
- Recent projects

### Project Manager Dashboard

- Managed projects
- Team statistics
- Project progress
- Task statistics
- Recent tasks
- Recent projects

### Team Member Dashboard

- Assigned projects
- Assigned tasks
- Upcoming tasks
- Notifications
- Personal task statistics

---

## 📱 Responsive UI

- Desktop support
- Tablet support
- Mobile support
- Responsive sidebar
- Modern dashboard layout

---

# 🛠 Tech Stack Summary

## Frontend

| Technology | Why it was chosen |
|------------|-------------------|
| **Next.js 16 (App Router)** | Provides a scalable React framework with modern routing, layouts, and excellent performance. |
| **React 19** | Component-based UI development with improved rendering performance. |
| **TypeScript** | Improves code quality through static typing and better developer tooling. |
| **Tailwind CSS** | Enables rapid development of a clean, responsive, and maintainable user interface without writing custom CSS for every component. |
| **Axios** | Simplifies communication with the backend API using reusable HTTP clients and interceptors. |
| **React Hook Form** | Efficient form management with minimal re-renders and built-in validation support. |
| **React Hot Toast** | Lightweight and user-friendly notification system for success and error messages. |
| **Recharts** | Used to build interactive dashboard charts including task status and priority analytics. |
| **React Icons** | Provides a consistent set of modern icons for improving UI usability and appearance. |

---

## Backend

| Technology | Why it was chosen |
|------------|-------------------|
| **Node.js** | Fast JavaScript runtime suitable for scalable REST APIs. |
| **Express.js** | Lightweight framework for building structured backend APIs. |
| **Prisma ORM** | Type-safe database access with simplified queries, migrations, and schema management. |
| **PostgreSQL** | Reliable relational database offering strong consistency and scalability. |
| **JWT (jsonwebtoken)** | Provides secure stateless authentication for protecting API endpoints. |
| **bcrypt** | Securely hashes passwords before storing them in the database. |
| **Vitest** | Fast testing framework used for backend unit testing. |

---

## Development Tools

| Tool | Purpose |
|------|---------|
| Git | Version Control |
| GitHub | Source Code Management |
| GitHub Actions | Continuous Integration (CI) |
| VS Code | Development Environment |
| Prisma Studio | Database inspection |
| Postman | API testing |

---

# 📂 Folder Structure

```text
Team-Management-Platform/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── server.js
│   │   └── app.js
│   ├── tests/
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── context/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   ├── public/
│   ├── package.json
│   └── .env.example
│
├── .github/
│   └── workflows/
│
├── README.md
└── LICENSE
```

---

## 📚 Project Documentation

| Document | Link |
|----------|------|
| 🌐 API Documentation (Fern) | https://wikshitha-s-team.docs.buildwithfern.com |
| 📋 Feature Completion Report | [docs/FeatureReport.md](docs/FeatureReport.md) |
| 🚀 CI/CD Workflow | [docs/CI-CD.md](docs/CI-CD.md) |
| 🤖 AI Usage Disclosure | [docs/AI_USAGE_DISCLOSURE.md](docs/AI_USAGE_DISCLOSURE.md) |

---

## 📐 System Diagrams

| Diagram | Link |
|---------|------|
| 🗂️ Entity Relationship Diagram (ERD) | [docs/diagrams/ERD.png](docs/diagrams/ERD.png) |
| 👥 Use Case Diagram | [docs/diagrams/UseCaseDiagram.png](docs/diagrams/UseCaseDiagram.png) |
| 🏗️ System Architecture Diagram | [docs/diagrams/ArchitectureDiagram.png](docs/diagrams/ArchitectureDiagram.png) |

---

# ⚙️ Setup Instructions

## Prerequisites

Before running the project, ensure the following software is installed:

- Node.js (v20 or later)
- npm
- PostgreSQL (v15 or later)
- Git
- Prisma CLI (installed automatically with dependencies)

Verify the installations:

```bash
node -v
npm -v
git --version
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/wikshitha/Team-Management-Platform.git

cd Team-Management-Platform
```

---

# Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

### Configure Environment Variables

Create a `.env` file inside the **backend** directory.

Example:

```env
PORT=5000

DATABASE_URL="postgresql://postgres:password@localhost:5432/team_management"

JWT_SECRET=your_super_secret_key

JWT_EXPIRES_IN=7d
```

---

### Generate Prisma Client

```bash
npx prisma generate
```

---

### Run Database Migrations

```bash
npx prisma migrate dev
```

---

### Seed Initial Data

```bash
npm run prisma:seed
```

This creates:

- Administrator
- Project Manager
- Team Member roles

It also creates an initial Administrator account for first-time login.

---

### Start Backend

Development Mode

```bash
npm run dev
```

Backend will run at:

```text
http://localhost:5000
```

---

# Frontend Setup

Open another terminal.

Navigate to the frontend folder.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

---

### Configure Environment Variables

Create a `.env.local` file.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### Start Frontend

```bash
npm run dev
```

Frontend will run at

```text
http://localhost:3000
```

---

# Running Tests

Backend Unit Tests

```bash
npm test
```

Frontend Quality Checks

```bash
npm run lint

npm run build
```

---

# 🌍 Environment Variables

## Backend

| Variable | Description |
|-----------|-------------|
| PORT | Backend server port |
| DATABASE_URL | PostgreSQL connection string |
| JWT_SECRET | Secret key used to sign JWT tokens |
| JWT_EXPIRES_IN | JWT expiration duration |

Example

```env
PORT=5000

DATABASE_URL="postgresql://postgres:password@localhost:5432/team_management"

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=7d
```

---

## Frontend

| Variable | Description |
|-----------|-------------|
| NEXT_PUBLIC_API_URL | Base URL of the backend REST API |

Example

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

# 🗄 Database Schema

The application uses **PostgreSQL** with **Prisma ORM**.

### Main Entities

### Role

Stores the available system roles.

- Administrator
- Project Manager
- Team Member

Relationship

```
Role
   │
   └────────── User
```

---

### User

Stores user information and authentication details.

Each user belongs to one role.

A user can

- create projects
- be assigned to projects
- be assigned tasks
- write comments
- receive notifications

---

### Project

Represents a project created by a Project Manager or Administrator.

A project contains

- Team Members
- Tasks

---

### ProjectMember

One project can have many Team Members.

One Team Member can belong to many projects.

```
User

   ▲

   │

ProjectMember

   │

   ▼

Project
```

---

### Task

Represents work assigned inside a project.

Each task belongs to one project.

Each task may be assigned to one Team Member.

---

### Comment

Stores discussions related to tasks.

Each comment belongs to

- one task
- one user

---

### Notification

Stores user notifications.

Examples

- Task Assigned
- Task Status Updated
- New Comment

Each notification belongs to exactly one user.

---

### Database Relationships

```text
Role
 │
 └──────── User
               │
               ├──────────── Project
                                 │
                                 ├──────────── ProjectMember
                                 │
                                 └──────────── Task
                                              │
                                              ├──────── Comment
                                              │
                                              └──────── Notification
```

---

# 📝 Assumptions

The following assumptions were made during the implementation of the system.

### User Management

- Every user must belong to exactly one role.
- Email addresses are unique across the system.
- Passwords are securely hashed before storage.
- Only Administrators can create, update, activate, deactivate, or delete users.

---

### Project Management

- Every project has exactly one creator.
- Only Administrators and Project Managers can create projects.
- Project Managers can manage only the projects they created.
- Administrators can manage every project.

---

### Team Assignment

- Only Team Members can be assigned to projects.
- Duplicate project-member assignments are prevented.
- A Team Member can belong to multiple projects.

---

### Task Management

- Every task belongs to exactly one project.
- A task may remain unassigned.
- Only Team Members assigned to the project can receive task assignments.

---

### Comments

- Users can comment only on tasks they are authorized to access.
- Users can edit or delete only their own comments.

---

### Notifications

- Notifications are automatically created for supported system events.
- Notifications remain available until marked as read.

---

### Authentication

- JWT authentication is required for all protected API endpoints.
- Unauthorized requests return **401 Unauthorized**.
- Requests from authenticated users without sufficient permissions return **403 Forbidden**.

---

# 👥 User Roles

The Team Management Platform implements **Role-Based Access Control (RBAC)** to ensure users can only access the features relevant to their responsibilities.

---

## 👑 Administrator

The Administrator has full access to the system.

### Permissions

- View Administrator Dashboard
- Create users
- Edit users
- Activate/Deactivate users
- Delete users
- Assign user roles
- View all projects
- Create projects
- Edit projects
- Delete projects
- View all tasks
- Manage all tasks
- View notifications
- Update profile
- Change password

---

## 📁 Project Manager

Project Managers are responsible for managing the projects they create.

### Permissions

- View Project Manager Dashboard
- Create projects
- Edit owned projects
- View project details
- Search Team Members
- Assign Team Members to projects
- Remove Team Members from projects
- Create tasks
- Edit tasks
- Delete tasks
- Assign tasks to project members
- View task comments
- View notifications
- Update profile
- Change password

Project Managers **cannot**

- Manage users
- Change user roles
- Delete users
- Manage projects created by other Project Managers

---

## 👨‍💻 Team Member

Team Members interact only with work assigned to them.

### Permissions

- View Team Member Dashboard
- View assigned projects
- View assigned tasks
- Update task status
- Add comments
- Edit own comments
- Delete own comments
- View notifications
- Update profile
- Change password

Team Members **cannot**

- Create projects
- Manage users
- Assign Team Members
- Create tasks
- Delete projects
- Delete tasks
- Access Administrator or Project Manager pages

---

# 🔐 Authentication

The application uses **JWT (JSON Web Token)** authentication together with **Role-Based Access Control (RBAC)**.

---

## Login Flow

1. User enters email and password.
2. Backend validates the credentials.
3. Password is verified using **bcrypt**.
4. A JWT token containing the user's ID and role is generated.
5. The token is returned to the frontend.
6. The frontend stores the token.
7. Every protected API request automatically includes the JWT token in the Authorization header.
8. Backend middleware validates the token before processing the request.

---

## Protected Routes

All protected API endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## Authorization Middleware

The backend verifies:

- Valid JWT token
- Authenticated user
- User role

Unauthorized requests return:

```text
401 Unauthorized
```

Insufficient permissions return:

```text
403 Forbidden
```

---

# 🌐 API Endpoints

## Authentication

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Current authenticated user |
| PUT | `/api/auth/change-password` | Change password |

---

## Users (Administrator)

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/users` | Get all users |
| POST | `/api/users` | Create user |
| GET | `/api/users/:id` | Get user details |
| PUT | `/api/users/:id` | Update user |
| PATCH | `/api/users/:id/status` | Activate / Deactivate user |
| DELETE | `/api/users/:id` | Delete user |

---

## Projects

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/projects` | Get projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Project details |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

---

## Project Members

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/projects/:id/members` | Get project members |
| GET | `/api/projects/:id/available-members` | Get available Team Members |
| POST | `/api/projects/:id/members` | Assign Team Member |
| DELETE | `/api/projects/:id/members/:userId` | Remove Team Member |

---

## Team Members

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/team-members` | Search Team Members |

---

## Tasks

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/tasks` | Get tasks |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Task details |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/status` | Update task status |
| DELETE | `/api/tasks/:id` | Delete task |

---

## Comments

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/tasks/:id/comments` | Get task comments |
| POST | `/api/tasks/:id/comments` | Add comment |
| PUT | `/api/comments/:id` | Edit comment |
| DELETE | `/api/comments/:id` | Delete comment |

---

## Notifications

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/notifications` | Get notifications |
| GET | `/api/notifications/unread-count` | Get unread count |
| PATCH | `/api/notifications/:id/read` | Mark notification as read |
| PATCH | `/api/notifications/read-all` | Mark all notifications as read |

---

## Dashboard

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/dashboard/admin` | Administrator dashboard |
| GET | `/api/dashboard/manager` | Project Manager dashboard |
| GET | `/api/dashboard/member` | Team Member dashboard |

---

## Profile

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/profile` | Get current profile |
| PUT | `/api/profile` | Update profile |

---

# 📊 Dashboard Features

The platform provides dedicated dashboards tailored to each user role.

---

## 👑 Administrator Dashboard

Provides an overview of the entire system.

### Summary Cards

- Total Users
- Active Users
- Total Projects
- Active Projects
- Total Tasks
- Completed Tasks
- Overdue Tasks

### Charts

- Task Status Distribution (Pie Chart)
- Task Priority Distribution (Bar Chart)

### Recent Activity

- Recently created users
- Recently created projects

---

## 📁 Project Manager Dashboard

Provides insights into projects managed by the current Project Manager.

### Summary Cards

- Total Projects
- Active Projects
- Team Members
- Total Tasks
- Completed Tasks
- Overdue Tasks

### Charts

- Project Status Distribution
- Task Status Distribution

### Recent Activity

- Recent projects
- Recent tasks

---

## 👨‍💻 Team Member Dashboard

Displays personal work and progress.

### Summary Cards

- Assigned Projects
- Assigned Tasks
- Tasks Completed
- Tasks In Progress
- Overdue Tasks
- Unread Notifications

### Charts

- Personal Task Status Distribution
- Personal Task Priority Distribution

### Recent Activity

- Upcoming Tasks
- Recent Notifications

---

The dashboard data is loaded dynamically from the backend using secure role-based API endpoints, ensuring that each user only sees information they are authorized to access.

---

# 🧪 Testing

The project includes automated backend tests and comprehensive manual testing to ensure reliability, security, and correctness.

---

## Backend Testing

The backend uses **Vitest** for unit testing.

### Tested Modules

- JWT Token Generation
- Authentication Middleware
- Role-Based Authorization Middleware
- Async Handler Utility

Run all backend tests:

```bash
npm test
```

Expected Output

```text
Test Files  3 passed
Tests       10 passed
```

---

## Frontend Validation

The frontend is validated using ESLint and a production build.

Run ESLint

```bash
npm run lint
```

Create Production Build

```bash
npm run build
```

These checks ensure:

- No TypeScript errors
- No ESLint errors
- Successful production compilation

---

## Manual Testing

The following workflows were manually verified.

### Administrator

- Login
- Dashboard
- User Management
- Project Management
- Task Management
- Search
- Pagination
- Role Assignment
- User Activation/Deactivation

---

### Project Manager

- Login
- Dashboard
- Create Project
- Assign Team Members
- Remove Team Members
- Create Tasks
- Assign Tasks
- Edit Tasks
- Delete Tasks

---

### Team Member

- Login
- View Assigned Projects
- View Assigned Tasks
- Update Task Status
- Add Comments
- View Notifications
- Update Profile
- Change Password

---

## Security Testing

Verified scenarios include:

- Invalid JWT Token
- Missing JWT Token
- Unauthorized Role Access
- Protected Routes
- API Authorization
- Duplicate Member Assignment Prevention

---

# 🚀 CI/CD

The project includes a **GitHub Actions** Continuous Integration workflow.

The workflow automatically runs whenever code is pushed or a Pull Request is opened.

### Workflow Steps

1. Checkout repository
2. Install Backend dependencies
3. Generate Prisma Client
4. Run Backend Tests
5. Install Frontend dependencies
6. Run ESLint
7. Build the Next.js application

### Benefits

- Prevents broken code from being merged.
- Automatically validates backend functionality.
- Ensures frontend builds successfully.
- Maintains code quality before deployment.

The workflow configuration is located at:

```text
.github/workflows/ci.yml
```

---

# 🔮 Future Improvements

The current implementation satisfies the assignment requirements. Future enhancements may include:

- Email notifications
- File attachments for tasks
- Real-time notifications using WebSockets
- Team chat
- Time tracking
- Multi-language support
- Dark mode
- Docker containerization
- Audit logs for administrative actions

---

# 👨‍💻 Author

**Wikshitha Umindu**

Computer Science Undergraduate

Eastern University, Sri Lanka

- GitHub: https://github.com/wikshitha
- LinkedIn: https://www.linkedin.com/in/wikshitha

---

# 📄 License

This project was developed for educational purposes.

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star on GitHub.

Built using **Next.js**, **Express.js**, **Prisma**, and **PostgreSQL**

</div>
