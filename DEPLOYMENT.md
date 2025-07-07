# 🚀 SkillFull Deployment Guide

This guide will help you deploy the SkillFull application with the frontend on Vercel and backend on Render.

## 📋 Prerequisites

- GitHub account with your SkillFull repository
- MongoDB Atlas account (free tier available)
- Vercel account
- Render account

## 🔧 Backend Deployment (Render)

### 1. Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Get your connection string (replace `<password>` with your actual password)

### 2. Deploy on Render
1. Go to [Render.com](https://render.com) and create an account
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `skillfull-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3. Environment Variables
Add these environment variables in Render:

```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/skillfull
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=https://your-vercel-app.vercel.app
PORT=3001
NODE_ENV=production
```

### 4. Deploy
- Click "Create Web Service"
- Note your backend URL (e.g., `https://skillfull-backend.onrender.com`)

## 🎨 Frontend Deployment (Vercel)

### 1. Deploy on Vercel
1. Go to [Vercel.com](https://vercel.com) and create an account
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2. Environment Variables
Add this environment variable in Vercel:
```
VITE_BACKEND_URL=https://your-backend-url.onrender.com
```

### 3. Deploy
- Click "Deploy"
- Vercel will automatically build and deploy your frontend
- Note your frontend URL (e.g., `https://skillfull-frontend.vercel.app`)

## 🔄 Update Backend with Frontend URL

After getting your Vercel URL, update the `FRONTEND_URL` environment variable in Render with your actual Vercel URL.

## 🧪 Testing the Deployment

1. **Test Backend Health**: Visit `https://your-backend-url.onrender.com/health`
2. **Test Frontend**: Visit your Vercel URL
3. **Test Authentication**: Try logging in with Google
4. **Test Real-time Features**: Create a request and test messaging

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your backend CORS includes your Vercel domain
2. **Socket Connection Issues**: Check that Socket.io CORS is properly configured
3. **MongoDB Connection**: Verify your MongoDB Atlas connection string
4. **Environment Variables**: Ensure all environment variables are set correctly

### Debug Steps:
1. Check Render logs for backend errors
2. Check Vercel build logs for frontend errors
3. Test API endpoints directly using Postman or similar
4. Check browser console for frontend errors

## 📝 Environment Variables Reference

### Backend (Render)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend.vercel.app
PORT=3001
NODE_ENV=production
```

### Frontend (Vercel)
```
VITE_BACKEND_URL=https://your-backend.onrender.com
```

## 🎉 Success!

Once deployed, your SkillFull application will be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

Users can now create help requests, accept them, and communicate in real-time! 