# Task Management Application

A full-stack MERN application for managing tasks with user authentication and role-based access control.

## Features

- User authentication (Sign Up/Sign In)
- Task CRUD operations
- Role-based access (Admin/User)
- Only Admins can delete tasks
- Light/Dark theme switcher
- Responsive design with Material UI
- Pagination for task list

## Tech Stack

- **Frontend**: React.js, Material UI, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT

## Setup Instructions

### MongoDB Setup

You have two options for MongoDB:

#### Option 1: Local MongoDB Installation

1. **Install MongoDB Community Edition:**
   - **macOS**: `brew install mongodb-community` (using Homebrew)
   - **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - **Linux**: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB service:**
   - **macOS**: `brew services start mongodb-community`
   - **Windows**: MongoDB runs as a service automatically after installation
   - **Linux**: `sudo systemctl start mongod`

3. MongoDB will run on `mongodb://localhost:27017` by default

#### Option 2: MongoDB Atlas (Cloud - Recommended for Quick Start)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user and get your connection string
4. Update the `.env` file in the backend folder with your Atlas connection string:
   ```
   MONGODB_URI=""
   ```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (if using local MongoDB, it's already configured):
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your-secret-key-change-in-production
```

4. Make sure MongoDB is running (local) or your Atlas connection string is set

5. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

1. Sign up for a new account (you can choose Admin or User role)
2. Sign in with your credentials
3. Create, view, edit tasks
4. Admins can delete tasks, regular users cannot see the delete button
5. Toggle between light and dark themes using the switch in the header

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks (paginated)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin only)

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel, Netlify, Railway, and Render.

