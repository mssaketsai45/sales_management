# Sales Management System - Deployment Guide

## 📋 Prerequisites
- GitHub account (code is already pushed)
- MongoDB Atlas account (free tier)
- Vercel account (free tier) OR Render account (free tier)

---

## 🗄️ Step 1: Deploy Database (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Cluster
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/Login (free tier available)
3. Click **"Create a New Cluster"**
4. Choose **FREE** tier (M0 Sandbox)
5. Select region closest to you
6. Click **"Create Cluster"** (takes 3-5 minutes)

### 1.2 Create Database User
1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **Password** authentication
4. Username: `salesapp` (or your choice)
5. Generate secure password (save it!)
6. Set permissions: **Read and write to any database**
7. Click **"Add User"**

### 1.3 Whitelist IP Address
1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for deployment)
4. Confirm: `0.0.0.0/0`
5. Click **"Confirm"**

### 1.4 Get Connection String
1. Go to **Database** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` with your database username
5. Replace `<password>` with your database password
6. **Save this connection string!** You'll need it for backend deployment.

### 1.5 Import Your Data
```bash
# In your local machine
cd backend
node src/utils/importData.js
```
OR use MongoDB Compass to connect and import the CSV data.

---

## 🔧 Step 2: Deploy Backend

### Option A: Deploy to Vercel (Recommended)

#### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

#### 2.2 Deploy Backend
```bash
cd backend
vercel
```

#### 2.3 Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → `sales-management-backend`
- **Which directory?** → `./` (current)
- **Override settings?** → No

#### 2.4 Add Environment Variables 
After deployment, go to your Vercel dashboard:
1. Select your backend project
2. Go to **Settings** → **Environment Variables**
3. Add these variables:
   ```
   MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/sales_management
   CORS_ORIGIN = *
   NODE_ENV = production
   ```
4. Click **"Save"**
5. Go to **Deployments** → Redeploy the latest deployment

#### 2.5 Get Backend URL
Your backend URL will be: `https://sales-management-backend.vercel.app`
**Save this URL!** You'll need it for frontend deployment.
### Option B: Deploy to Render

#### 2.1 Create Web Service
1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `mssaketsai45/sales_management`
4. Configure:
   - **Name**: `sales-management-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

#### 2.2 Add Environment Variables
In the Environment tab, add:
```
MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/sales_management
CORS_ORIGIN = *
NODE_ENV = production
```

#### 2.3 Deploy
Click **"Create Web Service"** (takes 2-3 minutes)

Your backend URL will be: `https://sales-management-backend.onrender.com`


## 🎨 Step 3: Deploy Frontend

### Option A: Deploy to Vercel

#### 3.1 Update Environment Variable
Before deploying, you need to set the backend URL:

**Local .env file (for build):**
Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

#### 3.2 Deploy Frontend
```bash
cd frontend
vercel
```

#### 3.3 Follow prompts:
- **Set up and deploy?** → Yes
- **Project name?** → `sales-management-frontend`
- **Which directory?** → `./`
- **Override settings?** → No

#### 3.4 Add Environment Variable in Vercel
1. Go to Vercel dashboard → Frontend project
2. **Settings** → **Environment Variables**
3. Add:
   ```
   VITE_API_URL = https://your-backend-url.vercel.app/api
   ```
4. Redeploy

Your frontend URL: `https://sales-management-frontend.vercel.app`

---

### Option B: Deploy to Render

#### 3.1 Create Static Site
1. Go to Render → **"New +"** → **"Static Site"**
2. Connect repository: `mssaketsai45/sales_management`
3. Configure:
   - **Name**: `sales-management-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

#### 3.2 Add Environment Variable
```
VITE_API_URL = https://sales-management-backend.onrender.com/api
```

#### 3.3 Deploy
Click **"Create Static Site"**

Your frontend URL: `https://sales-management-frontend.onrender.com`

---

## ✅ Step 4: Verify Deployment

### 4.1 Test Backend
Visit: `https://your-backend-url/health`

Should return:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### 4.2 Test Frontend
1. Visit your frontend URL
2. Check if sales data loads
3. Test filters, search, sorting
4. Check browser console for errors

---

## 🔄 Step 5: Update Backend CORS (Important!)

Once frontend is deployed, update backend CORS for security:

1. Go to backend project settings (Vercel/Render)
2. Update environment variable:
   ```
   CORS_ORIGIN = https://your-frontend-url.vercel.app
   ```
3. Redeploy backend

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` is correct (must end with `/api`)
- Check backend CORS allows frontend domain
- Check browser console for CORS errors

### MongoDB connection fails
- Verify connection string is correct
- Check IP whitelist includes `0.0.0.0/0`
- Verify database user credentials

### Build fails
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📝 Quick Reference

**Environment Variables Summary:**

**Backend (.env):**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sales_management
CORS_ORIGIN=https://your-frontend-url.vercel.app
NODE_ENV=production
PORT=5000
```

**Frontend (.env.production):**
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

---

## 🎉 You're Done!

Your application is now live:
- **Frontend**: https://your-frontend-url.vercel.app
- **Backend API**: https://your-backend-url.vercel.app
- **Database**: MongoDB Atlas Cloud

---

## 💰 Cost Breakdown

- **MongoDB Atlas (M0)**: FREE (512MB storage)
- **Vercel (Hobby)**: FREE (100GB bandwidth/month)
- **Render (Free tier)**: FREE (750 hours/month)

**Total Cost: $0** 🎉
