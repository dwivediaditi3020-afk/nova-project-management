# NOVA – Team Productivity Platform

> Plan. Collaborate. Deliver.

NOVA is a full-stack project management web application designed to help teams create projects, manage tasks, collaborate with team members, and track project progress from a single platform.

## Features

- User registration and login
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes
- Create, update, view, and delete projects
- Project status tracking
- Start and due dates
- Team member management
- Create, update, and delete tasks
- Assign tasks to team members
- Task status and priority management
- Task due dates
- Task comments
- Project activity history
- Project progress tracking
- Responsive design for desktop, tablet, and mobile

## Tech Stack

### Frontend
- React
- Vite
- Bootstrap
- Axios
- React Router
- React Icons

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB Atlas
- Mongoose

### Authentication
- JWT
- bcryptjs

### Deployment
- Vercel – Frontend
- Render – Backend
- MongoDB Atlas – Database

## Application Flow

```text
React + Vite
     ↓
Axios
     ↓
Express.js REST API
     ↓
Authentication & Authorization
     ↓
MongoDB Atlas
Project Structure
nova-project-management/
│
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── package.json
├── package-lock.json
├── vercel.json
└── README.md
REST API
Authentication
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
DELETE /api/auth/me
Projects
POST   /api/projects
GET    /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/:id/members
GET    /api/projects/:id/progress
Tasks
POST   /api/tasks
GET    /api/tasks/project/:projectId
PUT    /api/tasks/:id
DELETE /api/tasks/:id
Comments
POST   /api/comments/:taskId
GET    /api/comments/:taskId
Activity
GET    /api/activity/project/:projectId
Authentication

NOVA uses JWT-based authentication.

Passwords are securely hashed using bcrypt before being stored in the database.

Protected API requests include the JWT token in the Authorization header:

Authorization: Bearer <JWT_TOKEN>
Local Setup
1. Clone the repository
git clone https://github.com/dwivediaditi3020-afk/nova-project-management.git
cd nova-project-management
2. Install frontend dependencies
npm install
3. Start the frontend
npm run dev

Frontend:

http://localhost:5173
4. Setup the backend
cd server
npm install

Create a .env file inside the server folder:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
5. Start the backend
npm start

Backend:

http://localhost:5000

Do not commit .env files or sensitive credentials to GitHub.

Testing

The application has been tested for:

User registration
User login
Protected routes
Project management
Team member management
Task management
Task assignment
Comments
Activity history
Project progress tracking
Page refresh and navigation
Responsive layouts
Deployment

The NOVA frontend is deployed on Vercel.

The backend is deployed on Render.

MongoDB Atlas is used as the production database.

Live Links

Website:
https://nova-project-management-murex.vercel.app/

Backend API:
https://nova-project-management-vcyt.onrender.com/

GitHub:
https://github.com/dwivediaditi3020-afk/nova-project-management

Future Improvements
Real-time notifications
Advanced task filtering and search
Drag-and-drop task management
Email notifications
Role-based permissions
Dashboard analytics
File attachments
Automated testing
CI/CD pipeline
Developer

Aditi Dwivedi

NOVA is a full-stack project management web application built using React, Node.js, Express.js, MongoDB, JWT authentication, and REST APIs.
