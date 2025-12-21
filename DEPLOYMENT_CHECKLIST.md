# Quick Deployment Checklist

## ✅ Before Deployment
- [ ] Push all code to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Cloudinary account setup
- [ ] Gmail app password generated

## 🚀 Deployment Steps

### 1. Deploy Backend (Render)
- [ ] Create Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set build: `cd back-end && npm install`
- [ ] Set start: `cd back-end && npm start`
- [ ] Add all environment variables (see DEPLOYMENT_GUIDE.md)
- [ ] Deploy and copy backend URL

### 2. Deploy Frontend (Vercel)
- [ ] Update `front-end/.env` with backend URL
- [ ] Commit and push changes
- [ ] Create project on Vercel
- [ ] Set root directory: `front-end`
- [ ] Add `VITE_API_URL` environment variable
- [ ] Deploy and copy frontend URL

### 3. Final Configuration
- [ ] Update `CLIENT_URL` in Render with frontend URL
- [ ] Test health endpoint: `https://your-backend.onrender.com/api/auth/health`
- [ ] Visit frontend and test features

## 📝 Environment Variables

### Backend (Render):
```
NODE_ENV=production
PORT=5000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<random_32_char_string>
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your_gmail>
EMAIL_PASS=<gmail_app_password>
CLIENT_URL=<your_frontend_url>
```

### Frontend (Vercel):
```
VITE_API_URL=<your_backend_url>/api
```

## 🧪 Testing Checklist
- [ ] Register new user
- [ ] Login
- [ ] Upload profile picture
- [ ] Create course (trainer)
- [ ] Enroll in course
- [ ] Take exam
- [ ] Generate certificate
- [ ] Receive email

## 🔗 Important URLs
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Cloudinary**: https://cloudinary.com
- **Render**: https://dashboard.render.com
- **Vercel**: https://vercel.com
- **Gmail App Password**: https://myaccount.google.com/apppasswords

---

**See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions**
