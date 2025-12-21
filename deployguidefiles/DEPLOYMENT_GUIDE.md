# 🚀 LMS Project Deployment Guide - Render

## Prerequisites
- [x] GitHub account with your code pushed
- [x] MongoDB Atlas account (free tier)
- [x] Cloudinary account (free tier)
- [x] Gmail account for email service

---

## 📋 Step-by-Step Deployment

### **STEP 1: Prepare Your Repository**

1. **Ensure all files are committed:**
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

2. **Verify these files exist:**
- ✅ `render.yaml` (root folder)
- ✅ `back-end/.env.example`
- ✅ `front-end/.env.example`

---

### **STEP 2: Setup MongoDB Atlas**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a **FREE** cluster (M0 Sandbox)
3. Create database user:
   - Username: `lms_user`
   - Password: Generate secure password
4. **Whitelist all IPs:**
   - Network Access → Add IP → `0.0.0.0/0` (Allow from anywhere)
5. **Get connection string:**
   - Click "Connect" → "Connect your application"
   - Copy connection string: `mongodb+srv://lms_user:<password>@cluster0.xxxxx.mongodb.net/`
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://lms_user:password@cluster0.xxxxx.mongodb.net/lms_db`

---

### **STEP 3: Setup Cloudinary**

1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for FREE account
3. Go to Dashboard
4. Copy these values:
   - **Cloud Name**: `dxxxxxxxx`
   - **API Key**: `123456789012345`
   - **API Secret**: `xxxxxxxxxxxxxxxxxxxx`

---

### **STEP 4: Setup Gmail App Password**

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to **App Passwords**
4. Select:
   - App: Mail
   - Device: Other (Custom name) → "LMS Backend"
5. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

---

### **STEP 5: Deploy Backend on Render**

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. Click **"New +"** → **"Web Service"**
3. **Connect GitHub repository:**
   - Click "Connect account" if first time
   - Select your LMS repository
4. **Configure Service:**
   - **Name**: `lms-backend`
   - **Region**: Oregon (US West) or closest to you
   - **Branch**: `master` (or `main` if that's your branch name)
   - **Root Directory**: `back-end`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"

   ```
   NODE_ENV = production
   PORT = 5000
   
   MONGODB_URI = mongodb+srv://lms_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/lms_db
   
   JWT_SECRET = your_super_secret_random_string_here_min_32_chars
   
   CLOUDINARY_CLOUD_NAME = your_cloud_name
   CLOUDINARY_API_KEY = your_api_key
   CLOUDINARY_API_SECRET = your_api_secret
   
   EMAIL_HOST = smtp.gmail.com
   EMAIL_PORT = 587
   EMAIL_USER = your-email@gmail.com
   EMAIL_PASS = your_16_char_app_password
   
   CLIENT_URL = https://your-frontend-url.vercel.app
   ```

   **⚠️ IMPORTANT:**
   - Replace ALL values with your actual credentials
   - JWT_SECRET: Generate random 32+ character string
   - CLIENT_URL: You'll update this after deploying frontend

6. **Click "Create Web Service"**
7. **Wait 3-5 minutes** for deployment
8. **Copy your backend URL:**
   - Example: `https://lms-backend-xxxx.onrender.com`
9. **Test backend:**
   - Visit: `https://lms-backend-xxxx.onrender.com/`
   - Should see: `{"message":"LMS Backend API",...}`

---

### **STEP 6: Deploy Frontend on Vercel**

1. **Update Frontend Environment:**
   - Edit `front-end/.env`:
   ```
   VITE_API_URL=https://lms-backend-xxxx.onrender.com/api
   ```
   - Replace with YOUR actual backend URL
   - Commit and push:
   ```bash
   git add front-end/.env
   git commit -m "Update API URL for production"
   git push origin main
   ```

2. **Go to [Vercel Dashboard](https://vercel.com/)**
3. Click **"Add New"** → **"Project"**
4. **Import Git Repository:**
   - Connect GitHub if first time
   - Select your LMS repository
5. **Configure Project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `front-end`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. **Environment Variables:**
   - Key: `VITE_API_URL`
   - Value: `https://lms-backend-xxxx.onrender.com/api`
7. **Click "Deploy"**
8. **Wait 2-3 minutes**
9. **Copy your frontend URL:**
   - Example: `https://lms-frontend-xxxx.vercel.app`

---

### **STEP 7: Update CORS Configuration**

1. **Go back to Render Dashboard**
2. Select `lms-backend` service
3. Go to **Environment** tab
4. **Update** `CLIENT_URL`:
   ```
   CLIENT_URL = https://lms-frontend-xxxx.vercel.app
   ```
5. Click **"Save Changes"**
6. Service will automatically redeploy

**OR** Update directly in code:

Edit `back-end/server.js`:
```javascript
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.CLIENT_URL,
    "https://lms-frontend-xxxx.vercel.app", // ✅ Add your Vercel URL here
];
```
Commit and push - Render will auto-deploy.

---

### **STEP 8: Test Your Application**

1. **Visit your frontend:** `https://lms-frontend-xxxx.vercel.app`
2. **Test these features:**
   - ✅ Register new user
   - ✅ Login
   - ✅ Browse courses
   - ✅ Upload profile picture
   - ✅ Create course (as trainer)
   - ✅ Take exam
   - ✅ Generate certificate

3. **Check backend logs:**
   - Render Dashboard → `lms-backend` → Logs
   - Look for errors

4. **Common issues:**
   - **CORS Error**: Update `CLIENT_URL` in Render env variables
   - **502 Bad Gateway**: Backend is starting (wait 30s on free tier)
   - **Image upload fails**: Check Cloudinary credentials
   - **Email not sending**: Verify Gmail app password

---

## 🔧 Post-Deployment Configuration

### **Custom Domain (Optional)**

**For Frontend (Vercel):**
1. Vercel Dashboard → Project → Settings → Domains
2. Add your domain: `lms.yourdomain.com`
3. Update DNS records as instructed

**For Backend (Render):**
1. Render Dashboard → Service → Settings → Custom Domain
2. Add domain: `api.yourdomain.com`
3. Update DNS records

### **Update Environment Variables:**
After adding custom domains, update:
- Backend `CLIENT_URL` → Your custom frontend domain
- Frontend `VITE_API_URL` → Your custom backend domain

---

## 📊 Monitoring & Maintenance

### **Check Backend Health:**
Visit: `https://your-backend.onrender.com/api/auth/health`
Should return: `{"status":"OK",...}`

### **View Logs:**
- **Render**: Dashboard → Service → Logs
- **Vercel**: Dashboard → Project → Deployments → View Function Logs

### **Free Tier Limitations:**
- **Render Free:**
  - Sleeps after 15 min inactivity
  - First request takes 30s to wake up
  - 750 hours/month (31.25 days)
  
- **Vercel Free:**
  - 100 GB bandwidth/month
  - Unlimited requests
  - No sleep time

### **To Prevent Sleep (Render):**
Use a service like [Cron-Job.org](https://cron-job.org):
- Create free account
- Add job: Hit `https://your-backend.onrender.com/api/auth/health` every 10 minutes

---

## 🐛 Troubleshooting

### **Backend won't start:**
1. Check Render logs for errors
2. Verify all environment variables are set
3. Check MongoDB connection string format
4. Ensure database user has read/write permissions

### **Frontend can't connect to backend:**
1. Verify `VITE_API_URL` in Vercel environment variables
2. Check CORS configuration in backend
3. Ensure backend is running (check health endpoint)

### **File uploads not working:**
1. Verify Cloudinary credentials
2. Check Render logs for upload errors
3. Test Cloudinary connection manually

### **502 Bad Gateway:**
- Render free tier cold start (wait 30 seconds)
- Backend crashed (check logs)

---

## 🎉 Success Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] MongoDB Atlas connected
- [ ] Cloudinary working
- [ ] Email service configured
- [ ] CORS configured properly
- [ ] Can register/login
- [ ] Can upload files
- [ ] Can take exams
- [ ] Can generate certificates

---

## 📱 Your Live URLs

**Frontend:** `https://lms-frontend-xxxx.vercel.app`
**Backend:** `https://lms-backend-xxxx.onrender.com`
**API Health:** `https://lms-backend-xxxx.onrender.com/api/auth/health`

---

## 💡 Tips

1. **Keep .env files secure** - Never commit actual .env files
2. **Use strong JWT_SECRET** - Generate random 32+ character string
3. **Monitor free tier usage** - Render: 750 hrs/month
4. **Set up error logging** - Use Render logs or external service
5. **Backup database** - MongoDB Atlas has automatic backups
6. **Test before announcing** - Try all features after deployment

---

## 🚨 Important Notes

- **First request to backend** may take 30s (free tier cold start)
- **Backend sleeps** after 15 min inactivity on free tier
- **Update CLIENT_URL** whenever frontend URL changes
- **MongoDB Atlas** automatically pauses after 60 days inactivity (free tier)

---

**Need help?** Check logs first:
- Render: Dashboard → Logs
- Vercel: Dashboard → Deployments → Function Logs
- Browser: DevTools → Console → Network tab

---

## 🎓 Next Steps After Deployment

1. Test all features thoroughly
2. Set up monitoring/alerts
3. Configure custom domains
4. Add analytics (Google Analytics)
5. Set up automated backups
6. Create staging environment
7. Implement Redis caching (future)

---

**🎉 Congratulations! Your LMS is now live!**
