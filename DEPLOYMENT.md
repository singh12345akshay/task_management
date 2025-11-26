# Deployment Guide

This guide covers deploying both frontend and backend to various platforms.

## Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend) - Recommended

#### Backend Deployment (Railway)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Node.js
   - Add environment variables:
     ```
     PORT=5000
     MONGODB_URI=your-mongodb-atlas-connection-string
     JWT_SECRET=your-secret-key-change-in-production
     ```
   - Railway will provide a URL like: `https://your-app.railway.app`

#### Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click "New Project" → Import your repository
   - Set Root Directory to `frontend`
   - Framework Preset: Vite
   - Add Environment Variable:
     ```
     VITE_API_URL=https://your-app.railway.app/api
     ```
   - Click Deploy

---

### Option 2: Netlify (Frontend) + Render (Backend)

#### Backend Deployment (Render)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - Name: `task-management-backend`
     - Root Directory: `backend`
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Add Environment Variables:
     ```
     PORT=5000
     MONGODB_URI=your-mongodb-atlas-connection-string
     JWT_SECRET=your-secret-key-change-in-production
     ```
   - Click "Create Web Service"
   - Render will provide URL: `https://your-app.onrender.com`

#### Frontend Deployment (Netlify)

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Build settings:
     - Base directory: `frontend`
     - Build command: `npm run build`
     - Publish directory: `frontend/dist`
   - Add Environment Variable:
     ```
     VITE_API_URL=https://your-app.onrender.com/api
     ```
   - Click "Deploy site"

---

### Option 3: Both on Vercel

#### Backend on Vercel

1. **Create `vercel.json` in backend folder** (already created)
2. **Deploy Backend**
   - Go to Vercel dashboard
   - Import repository
   - Set Root Directory to `backend`
   - Add environment variables
   - Deploy

#### Frontend on Vercel

1. **Deploy Frontend**
   - Create new project in Vercel
   - Set Root Directory to `frontend`
   - Add environment variable with backend URL
   - Deploy

---

## Important Steps Before Deployment

### 1. CORS Configuration

The backend CORS is already configured to work with:
- Local development (localhost:3000)
- Environment variable `FRONTEND_URL`
- Vercel deployments (auto-detected)
- Netlify deployments (auto-detected)

You can also set `FRONTEND_URL` environment variable in your backend deployment:
```
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 2. Use MongoDB Atlas

- Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get connection string
- Add to backend environment variables

### 3. Update Frontend API URL

- Set `VITE_API_URL` environment variable in deployment platform
- Should point to your deployed backend URL

### 4. Update Backend Environment Variables

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A strong secret key
- `PORT`: Usually auto-set by platform (5000 for reference)

---

## Post-Deployment Checklist

- [ ] Backend is accessible and returns data
- [ ] Frontend can connect to backend API
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] MongoDB connection is working
- [ ] Authentication works (sign up/sign in)
- [ ] All features work as expected

---

## Troubleshooting

### CORS Errors
- Add your frontend URL to backend CORS origins
- Check backend allows credentials if needed

### API Connection Issues
- Verify `VITE_API_URL` is set correctly
- Check backend URL is accessible
- Ensure backend is running

### MongoDB Connection Issues
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check connection string is correct
- Ensure database user has proper permissions

