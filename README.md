# Hostel Management System

A comprehensive system for managing hostel operations, including room management, complaints, leave requests, and more.

Deployed links: 

Student - https://heroic-moxie-62de3b.netlify.app/

Admin - https://benevolent-beignet-f59257.netlify.app/

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hostel-management
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_NAME=Hostel Management System
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

## Default Admin Account

After starting the application for the first time, an admin account will be created with the following credentials:

- Email: admin@hostel.com
- Password: admin123

## Features

- User Authentication (Admin/Student)
- Room Management
- Complaint System
- Leave Request Management
- Student Profile Management
- Real-time Notifications
- Responsive Design

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, MongoDB
- Authentication: JWT

## API Documentation

The API documentation is available at `http://localhost:5000/api-docs` when running the backend server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 
