# Deployment Guide for Music Groovo

This guide will help you deploy the Music Groovo music app with the frontend on Vercel and backend on Render.

## Prerequisites

1. **MongoDB Atlas Account**: You'll need a MongoDB Atlas cluster
2. **Vercel Account**: For frontend deployment
3. **Render Account**: For backend deployment
4. **GitHub Account**: To connect your repositories

## Step 1: Backend Deployment on Render

### 1.1 Prepare MongoDB Atlas

1. Create a MongoDB Atlas account at [mongodb.com](https://mongodb.com)
2. Create a new cluster (free tier is sufficient)
3. Create a database user with read/write permissions
4. Get your connection string from the cluster dashboard
5. Add your IP address to the IP whitelist (or use 0.0.0.0/0 for all IPs)

### 1.2 Deploy Backend to Render

1. **Fork/Clone the Repository**
   ```bash
   git clone <your-repo-url>
   cd Sonify/backend
   ```

2. **Create a Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

3. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your backend code

4. **Configure the Service**
   - **Name**: `music-groovo-backend` (or your preferred name)
   - **Root Directory**: `Sonify/backend` (if your repo contains both frontend and backend)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid if needed)

5. **Set Environment Variables**
   Click on "Environment" tab and add:
   ```
   MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   PORT=1337
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your backend
   - Note the URL provided (e.g., `https://music-groovo-backend.onrender.com`)

### 1.3 Test Backend Deployment

1. Visit your backend URL + `/health` (e.g., `https://music-groovo-backend.onrender.com/health`)
2. You should see: `{"status":"OK","message":"Server is running"}`

## Step 2: Frontend Deployment on Vercel

### 2.1 Prepare Frontend

1. **Update Environment Variables**
   Create a `.env` file in the `Sonify/frontend` directory:
   ```
   VITE_BACKEND_URL=https://your-backend-url.onrender.com
   ```

2. **Test Locally**
   ```bash
   cd Sonify/frontend
   npm install
   npm run build
   npm run preview
   ```

### 2.2 Deploy to Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `Sonify/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Set Environment Variables**
   In the project settings, add:
   ```
   VITE_BACKEND_URL=https://your-backend-url.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - You'll get a URL like `https://your-app.vercel.app`

## Step 3: Update CORS and Final Configuration

### 3.1 Update Backend CORS

After getting your Vercel frontend URL, update the backend environment variable:
```
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

Redeploy the backend on Render.

### 3.2 Test the Complete Application

1. Visit your Vercel frontend URL
2. Try to register/login
3. Test uploading songs
4. Test creating playlists
5. Test playing music

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your MongoDB Atlas connection string
   - Ensure your IP is whitelisted
   - Verify database user credentials

2. **CORS Errors**
   - Make sure `FRONTEND_URL` is set correctly in backend
   - Check that the frontend URL matches exactly

3. **File Upload Issues**
   - Ensure the `uploads` directory exists in your backend
   - Check file permissions on Render

4. **Build Errors**
   - Check Node.js version compatibility
   - Ensure all dependencies are in `package.json`

### Environment Variables Reference

**Backend (Render)**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://your-frontend.vercel.app
PORT=1337
```

**Frontend (Vercel)**
```
VITE_BACKEND_URL=https://your-backend.onrender.com
```

## Security Considerations

1. **JWT Secret**: Use a strong, random string for JWT_SECRET
2. **MongoDB**: Use strong passwords and limit IP access
3. **Environment Variables**: Never commit `.env` files to Git
4. **HTTPS**: Both Vercel and Render provide HTTPS by default

## Monitoring

1. **Render Dashboard**: Monitor backend logs and performance
2. **Vercel Dashboard**: Monitor frontend builds and performance
3. **MongoDB Atlas**: Monitor database performance and usage

## Cost Considerations

- **Vercel**: Free tier includes 100GB bandwidth/month
- **Render**: Free tier includes 750 hours/month
- **MongoDB Atlas**: Free tier includes 512MB storage

## Support

If you encounter issues:
1. Check the logs in Render/Vercel dashboards
2. Verify all environment variables are set correctly
3. Test endpoints individually using tools like Postman
4. Check browser console for frontend errors 