# Student Management System

A full-stack Web Application built with the MERN Stack (MongoDB, Express, React, Node.js) for managing students and administrators.

## 🚀 Features
- **Role-based Login**: Separate access for Students and Admins.
- **Admin Dashboard**: Manage students, view statistics, and handle administrative tasks.
- **Student Portal**: View marks, attendance, and personal details.
- **Modern UI**: Built with React and Tailwind CSS for a responsive, premium experience.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## 📂 Project Structure
```
Student Management/
├── client/     # Frontend (React + Vite)
├── server/     # Backend (Node + Express)
└── README.md   # Project Documentation
```

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Installed and running locally)

### 1. Setup Backend
Open a terminal and run:
```bash
cd server
npm install        # Install dependencies
npm start          # Start the server (Runs on port 5000)
```
> **Note**: Ensure MongoDB is running before starting the server.

### 2. Setup Frontend
Open a **new** terminal and run:
```bash
cd client
npm install        # Install dependencies
npm run dev        # Start the development server
```
The application will be available at [http://localhost:5173](http://localhost:5173).

## 🔧 Environment Variables
**Server (`/server/.env`)**
```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/student_management
```

## 📝 Usage
- **Home Page**: Choose to login as Admin or Student.
- **Admin Login**: Use admin credentials (to be set up).
- **Student Login**: Use student ID and password.

## 📜 Scripts
- `npm start` (Server): Runs the backend with Nodemon.
- `npm run dev` (Client): Runs the frontend with Vite.
