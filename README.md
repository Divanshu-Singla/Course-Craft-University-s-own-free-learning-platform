# 🎓 CourseCraft - Learning Management System

![CourseCraft](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Node](https://img.shields.io/badge/Node-v18+-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![MongoDB](https://img.shields.io/badge/MongoDB-8.11.0-green)
![Express](https://img.shields.io/badge/Express-Latest-lightgrey)

> A comprehensive, full-stack Learning Management System built with the MERN stack, featuring course management, lesson creation, exam system, and certificate generation.

**🌐 Live Demo:**  
- **Frontend:** [https://course-craft-university-s-own-free-eight.vercel.app](https://course-craft-university-s-own-free-eight.vercel.app)  
- **Backend:** [https://course-craft-university-s-own-free-iipg.onrender.com](https://course-craft-university-s-own-free-iipg.onrender.com)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [User Roles & Permissions](#user-roles--permissions)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Study Resources](#study-resources)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

**CourseCraft** is a production-ready, full-featured Learning Management System (LMS) designed for modern online education. Built with the MERN stack (MongoDB, Express, React, Node.js), it provides a comprehensive platform where trainers can create and manage courses, and learners can enroll, learn, and earn certificates.

### 🎯 Project Highlights

- 🎓 **Multi-Role System**: Learner, Trainer, and Admin with secure role-based access control
- 📚 **Course Management**: Complete CRUD operations with multimedia support
- 📖 **Lesson Management**: Separate lesson creation and deletion with video/image uploads
- 📝 **Exam System**: Timed exams with auto-grading and instant results
- 🎖️ **Certificate Generation**: Automatic certificates upon exam completion
- 📧 **Email Service**: Dual-method email (Resend API + Gmail SMTP fallback)
- 🔐 **Secure Authentication**: JWT-based auth with httpOnly cookies
- ☁️ **Cloud Storage**: Cloudinary CDN for all media files
- 📱 **Responsive Design**: Modern UI with Framer Motion animations
- 🔄 **Auto-Deployment**: CI/CD pipeline with GitHub integration
- 🛡️ **Admin Dashboard**: User management, statistics, and system monitoring

---

## ✨ Key Features

### 👨‍🎓 For Learners
- ✅ Browse and search courses with advanced filtering
- ✅ Enroll in courses with one-click enrollment
- ✅ Access dedicated lesson viewer with video/image content
- ✅ Track progress with visual progress indicators
- ✅ Take timed exams with auto-grading
- ✅ View detailed results and correct answers
- ✅ Download certificates upon exam completion
- ✅ Update profile details and change password
- ✅ Manage enrolled courses and exam history
- ✅ Responsive design for mobile and desktop

### 👨‍🏫 For Trainers
- ✅ Create courses with rich multimedia content
- ✅ Upload thumbnails, videos, and images via Cloudinary
- ✅ **Add/Delete lessons** with dedicated UI on course details page
- ✅ Define course syllabus, prerequisites, and certification options
- ✅ Create exams with multiple-choice questions
- ✅ Set exam duration, passing marks, and difficulty levels
- ✅ **Edit course details** (lessons managed separately)
- ✅ View and manage all created courses and exams
- ✅ Track enrolled students
- ✅ Professional dashboard for content management

### 👨‍💼 For Admins
- ✅ **Auto-created admin account** (admin@gmail.com / admin) on server startup
- ✅ Comprehensive dashboard with system statistics
- ✅ User management (view all users)
- ✅ View all courses and exams in the system
- ✅ System monitoring and analytics
- ✅ Secure admin panel with sidebar navigation
- ⚠️ **Admin role cannot be registered** publicly (security feature)

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer 8+)
- **Framework**: Express.js (RESTful API architecture)
- **Database**: MongoDB with Mongoose 8.11.0 (ODM)
- **Authentication**: JWT (JSON Web Tokens) with httpOnly cookies
- **File Upload**: Multer with multer-storage-cloudinary
- **Cloud Storage**: Cloudinary CDN (images, videos, automatic optimization)
- **Email Service**: 
  - **Primary**: Resend API (100 emails/day free tier)
  - **Fallback**: Gmail SMTP via Nodemailer
  - **Auto-detection**: Switches based on EMAIL_API_KEY presence
- **Security**: 
  - bcrypt (password hashing with 10 salt rounds)
  - CORS configuration 18.3.1 (Component-based architecture)
- **Build Tool**: Vite 6.0.5 (Lightning-fast HMR and optimized builds)
- **Routing**: React Router DOM 7.3.0
- **Styling**: CSS with modern features
- **Animations**: Framer Motion 12.4.7 (smooth transitions and animations)
- **State Management**: Context API
  - AuthContext (user authentication and authorization)
  - CourseContext (course data and operations)
  - ExamContext (exam management and submission)
  - UserContext (user profile and enrollment)
  - AdminContext (admin operations)
- **HTTP Client**: Axios 1.8.1 (with interceptors for tokens)
- **Cookie Management**: js-cookie (for JWT token storage)
- **UI Features**: 
  - Custom hooks (useNetworkStatus)
  - Protected routes with role verification
  - Responsive design for all devices
  - Loading states and error handlingContext API (AuthContext, CourseContext, ExamContext, UserContext, AdminContext)
- **HTTP Client**: Axios v1.8.1
- **Notifications**: React Toastify
- **Cookies**: js-cookie

---

## 🏗️ System Architecture

```
┌─────────────────┐
│   React Client  │
│   (Vite + React)│
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│  Express Server │
│   (Node.js)     │
└────┬───────┬────┘
     │       │
     │       └──────────┐
     │                  │
┌───� Quick Start

### Prerequisites
- **Node.js** v18+ and npm
- **MongoDB** (local or MongoDB Atlas)
- **Cloudinary** account (free tier)
- **Resend** account (optional, for email API)
- **Git** for version control

### One-Command Setup

```bash
# Clone the repository
git clone https://github.com/Divanshu-Singla/LMS.git
cd LMS

# Backend setup
cd back-end
npm install
# Create .env file and configure (see Environment Variables section)
npm start

# Frontend setup (in a new terminal)
cd ../front-end
npm install
npm run dev
```

✅ **Backend**: http://localhost:5000  
✅ **Frontend**: http://localhost:5173

---

## 📦 Installation

### Step-by-Step Backend Setup

```bash
cd back-end
npm install
```

**Create `.env` file:**
```bash
# Copy the environment template
touch .env`.env` Configuration

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=5000
NODE_ENV=development

# ============================================
# DATABASE (MongoDB)
# ============================================
# Local MongoDB
MONGO_URI=mongodb://localhost:27017/coursecraft

# OR MongoDB Atlas (Production)
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/coursecraft?retryWrites=true&w=majority

# ============================================
# AUTHENTICATION
# ============================================
JWT_SECRET=your_super_secure_random_jwt_secret_key_min_32_characters

# ============================================
# CLOUDINARY (File Storage)
# ============================================
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# ============================================
# EMAIL SERVICE (Dual Method Support)
# ============================================
# Method 1: Resend API (Primary - Recommended for production)
EMAIL_API_KEY=re_YourResendAPIKey
EMAIL_FROM=CourseCraft <onboarding@resend.dev>
ADMIN_EMAIL=your-admin-email@gmail.com

# Method 2: Gmail SMTP (Fallback - if EMAIL_API_KEY not set)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-specific-password

# Email auto-detection:
# - If EMAIL_API_KEY exists → Uses Resend API
# - If EMAIL_API_KEY missing → Falls back to Gmail SMTP

# ============================================
# ADMIN ACCOUNT (Auto-created on startup)
# ============================================
# Default credentials: admin@gmail.com / admin
# Change password after first login!
```

### Frontend Environment Variables

**Vercel Deployment:**
Set in Vercel dashboard → Project Settings → Environment Variables:

```env
VITE_API_URL=https://course-craft-university-s-own-free-iipg.onrender.com
```

**Local Development:**
Frontend automatically uses `http://localhost:5000` in development mode.

### 📝 Important Notes

1. **JWT_SECRET**: Must be at least 32 characters for security
2. **EMAIL_API_KEY**: Get free key from [Resend.com](https://resend.com) (100 emails/day)
3. **Gmail App Password**: If using SMTP, enable 2FA and generate app-specific password
4. **Cloudinary**: Sign up at [cloudinary.com](https://cloudinary.com) for free tier (25GB storage)
5. **Admin Account**: Auto-created as `admin@gmail.com` with password `admin` on first server start install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/couall lessons for course | Yes |
| POST | `/api/lessons/create/:courseId` | Create new lesson | Yes (Trainer) |
| DELETE | `/api/lessons/delete/:lessonId` | Delete lesson | Yes (Trainer) |

**Note:** Lesson management separated from course updates for better maintainability.
# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password

# Stripe Configuration (Optional - for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Frontend (vite.config.js)

Configure proxy in `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/change-password` | Change password | Yes |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update user profile | Yes |
| GET | `/api/users/:id` | Get user by ID | Yes (Admin) |

### Course Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/courses/create-course` | Create new course | Yes (Trainer) |
| GET | `/api/courses/all-approved` | Get all approved courses | No |
| GET | `/api/courses/pending` | Get pending courses | Yes (Admin) |
| GET | `/api/courses/trainer` | Get trainer's courses | Yes (Trainer) |
| GET | `/api/courses/enrolled` | Get enrolled courses | Yes |
| GET | `/api/courses/:id` | Get course by ID | No |
| POST | `/api/courses/enroll/:courseId` | Enroll in course | Yes |
| PATCH | `/api/courses/:courseId` | Update course | Yes (Trainer/Admin) |
| PUT | `/api/courses/approval/:courseId` | Approve/reject course | Yes (Admin) |
| DELETE | `/api/courses/:courseId` | Delete course | Yes (Trainer/Admin) |

### Lesson Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/lessons/:courseId` | Get lessons for course | Yes |
| POST | `/api/lessons` | Create lesson | Yes (Trainer) |
| PUT | `/api/lessons/:lessonId` | Update lesson | Yes (Trainer) |
| DELETE | `/api/lessons/:lessonId` | Delete lesson | Yes (Trainer) |

### Exam Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/exams/create` | Create exam | Yes (Trainer) |
| POST | `/api/exams/add-questions` | Add questions to exam | Yes (Trainer) |
| GET | `/api/exams` | Get all exams | Yes |
| GET | `/api/exams/:examId` | Get exam by ID | Yes |
| GET | `/api/exams/:examId/questions` | Get exam questions | Yes |
| POST | `/api/exams/:examId/submit` | Submit exam | Yes |
| GET | `/api/exams/:examId/certificate` | Generate certificate | Yes |
| PUT | `/api/exams/:examId` | Update exam | Yes (Trainer) |
| DELETE | `/api/exams/:examId` | Delete exam | Yes (Trainer) |

### Certificate Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/certificates/check/:courseId` | Check certificate eligibility | Yes |
| GET | `/api/certificates/generate/:courseId` | Generate and download certificate | Yes |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/stats` | Get dashboard statistics | Yes (Admin) |
| PUT | `/api/admin/users/:userId/ban` | Ban user | Yes (Admin) |
| PUT | `/api/admin/users/:userId/unban` | Unban user | Yes (Admin) |

### Contact Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/contact` | Submit contact form (sends email to admin & auto-reply to user) | No |

---

## 👥 User Roles & Permissions

### Learner
- ✅ Browse and search courses
- ✅ Enroll in courses
- ✅ Access course content and lessons
- ✅ Track progress with visual progress bars
- ✅ Take exams
- ✅ View exam results
- ✅ Receive and manage notifications
- ✅ Update profile and change password
- ❌ Cannot create courses or exams

### Trainer
- ✅ All learner permissions
- ✅ Create and manage courses with multimedia
- ✅ Upload course thumbnails, videos, and images
- ✅ Create and manage exams with questions
- ✅ Edit courses and exams with professional forms
- ✅ Delete own courses and exams
- ✅ View created courses and exams in dashboard
- ✅ Receive notifications for course updates

### Admin
- ✅ Full system access
- ✅ View dashboard with system statistics (users excluding admins, courses, exams)
- ✅ Manage all users (view, ban, unban)
- ✅ View all courses in the system
- ✅ View all exams in the system
- ✅ Access comprehensive admin panel

---

## 🗄️ Database Schema

### User Model
```javascript
{
  fullName: String,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: Enum ['learner', 'trainer', 'admin'],
  profilePicture: String,
  phoneNumber: String,
  gender: Enum ['Male', 'Female', 'Other'],
  dateOfBirth: Date,
  address: {
    local: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  },
  qualification: String,
  degree: String,
  profession: String,
  bio: String,
  githubUrl: String,
  linkedinUrl: String,
  enrolledCourses: [ObjectId],
  notifications: [{
    message: String,
    createdAt: Date
  }],
  isBanned: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Course Model
```javascript
{
  title: String,
  description: String,
  category: String,
  thumbnail: String,
  price: Number,
  duration: Number,
  lessons: [ObjectId],
  prerequisites: [String],
  courseLevel: Enum ['Beginner', 'Intermediate', 'Advance'],
  certificationAvailable: Boolean,
  status: Enum ['pending', 'approved', 'rejected'],
  approvedBy: ObjectId,
  trainer: ObjectId,
  syllabus: [{
    title: String,
    description: String
  }],
  reviews: [{
    userId: ObjectId,
    comment: String,
    rating: Number
  }]
}
```

### Exam Model
```javascript
{
  title: String,
  subject: String,
  category: String,
  timeLimit: Number (in minutes),
  numQuestions: Number,
  totalMarks: Number,
  type: Enum ['Beginner', 'Moderate', 'Advanced'],
  questions: [ObjectId],
  createdBy: ObjectId (Trainer),
  date: Date,
  duration: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Question Model
```javascript
{
  exam: ObjectId,
  text: String,
  options: [String] (4 options),
  correctOption: Number (index 0-3),
  createdAt: Date,
  updatedAt: Date
}
```

### Result Model
```javascript
{
  user: ObjectId,
  exam: ObjectId,
  score: Number,
  totalMarks: Number,
  percentage: Number,
  passed: Boolean,
  answers: [{
    question: ObjectId,
    selectedOption: Number,
    isCorrect: Boolean
  }],
  submittedAt: Date,
  createdAt: Date
}
```

---

## 📁 Project Structure

```
LMS/
│
├── back-end/
│   ├── config/
│   │   ├── cloudinary.js      # Cloudinary configuration
│   │   └── db.js               # MongoDB connection
│   │
│   ├── controllers/
│   │   ├── adminController.js  # Admin operations
│   │   ├── authController.js   # Authentication logic
│   │   ├── certificateController.js # Certificate generation
│   │   ├── courseController.js # Course CRUD operations
│   │   ├── examController.js   # Exam management
│   │   ├── lessonController.js # Lesson management
│   │   ├── paymentController.js # Payment processing
│   │   └── userController.js   # User management
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js   # JWT verification & RBAC
│   │   ├── errorMiddleware.js  # Global error handler
│   │   └── multerConfig.js     # File upload configuration
│   │
│   ├── models/
│   │   ├── Contact.js          # Contact form schema
│   │   ├── Course.js           # Course schema
│   │   ├── Enrollment.js       # Enrollment schema
│   │   ├── Exam.js             # Exam schema
│   │   ├── Lesson.js           # Lesson schema
│   │   ├── Question.js         # Question schema
│   │   ├── Result.js           # Result schema
│   │   └── User.js             # User schema
│   │
│   ├── routes/
│   │   ├── adminRoutes.js      # Admin endpoints
│   │   ├── authRoutes.js       # Auth endpoints
│   │   ├── certificateRoutes.js # Certificate endpoints
│   │   ├── contactRoutes.js    # Contact endpoints
│   │   ├── courseRoutes.js     # Course endpoints
│   │   ├── examRoutes.js       # Exam endpoints
│   │   ├── lessonRoutes.js     # Lesson endpoints
│   │   ├── paymentRoutes.js    # Payment endpoints
│   │   └── userRoutes.js       # User endpoints
│   │
│   ├── utils/
│   │   ├── certificateTemplate.js # Certificate HTML template
│   │   ├── emailService.js     # Email utilities
│   │   ├── generateToken.js    # JWT token generation
│   │   └── logger.js           # Logging utility
│   │
│   ├── scripts/
│   │   └── removeAdminUser.js  # Admin user script
│   │
│   ├── public/
│   │   └── images/             # Static images
│   │
│   ├── package.json
│   ├── server.js               # Entry point
│   └── .env                    # Environment variables
│
├── front-end/
│   ├── public/                 # Static assets
│   │
│   ├── src/
│   │   ├── assets/             # Images, icons, SVGs
│   │   │
│   │   ├── components/
│   │   │   ├── AllCourses.jsx
│   │   │   ├── Carousel.jsx
│   │   │   ├── CertificateButton.jsx
│   │   │   ├── CourseCard.jsx
│   │   │   ├── CourseCategories.jsx
│   │   │   ├── EnrolledCourses.jsx
│   │   │   ├── ExamResults.jsx
**Terminal 1 - Start MongoDB** (if running locally):
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

**Terminal 2 - Start Backend:**
```bash
cd back-end
npm start
```
✅ Server running at `http://localhost:5000`  
✅ Admin account auto-created: `admin@gmail.com` / `admin`

**Terminal 3 - Start Frontend:**
```bash
cd front-end
npm run dev
```
✅ Frontend running at `http://localhost:5173`

### Production Build

```bash
# Build frontend
cd front-end
npm run build

# Output directory: dist/
# Deploy dist/ to Vercel/Netlify/any static hosting

# Backend deployment
# Use Render.com, Railway, or any Node.js hosting
# Co**Password Security**: bcrypt hashing with 10 salt rounds
- ✅ **JWT Authentication**: Tokens stored in httpOnly cookies (prevents XSS)
- ✅ **Role-Based Access Control**: Three-tier permission system (Learner, Trainer, Admin)
- ✅ **Admin Protection**: Admin role cannot be registered publicly (auto-created on startup)
- ✅ **Protected Routes**: Backend and frontend route protection
- ✅ **CORS Configuration**: Specific origin whitelisting
- ✅ **Input Validation**: Server-side validation for all inputs
- ✅ **File Upload Security**: Type and size restrictions on uploads
- ✅ **MongoDB Injection Prevention**: Mongoose query sanitization
- ✅ **Error Handling**: Secure error messages (no sensitive data exposure)ng dedicated buttons on course details page
5. **Create Exam** for the course
6. **Enroll** (as Learner) and take exam
7. **Download Certificate** upon passing │   │   ├── ContactPage.jsx
│   │   │   ├── CourseDetails.jsx
│   │   │   ├── CourseForm.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── CreateExam.jsx
│   │   │   ├── EditExam.jsx
│   │   │   ├── ExamList.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── StartExam.jsx
│   │   │   ├── TrainerCourseDetails.jsx
│   │   │   └── UpdateCourseModal.jsx
│   │   │
│   │   ├── utils/
│   │   │   └── networkStore.js
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx             # Main app component
│   │   ├── index.css
│   │   └── main.jsx            # Entry point
│   │
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
│
└── README.md                   # This file
```

---

## 🚀 Running the Application

### Development Mode

1. **Start MongoDB** (if running locally)
```bash
mongod
```

**Authentication:**
- [x] User registration (Learner/Trainer only)
- [x] User login with JWT token
- [x] Admin auto-creation on server startup
- [x] Protected route access control
- [x] Password change functionality

**Course Management:**
- [x] Course creation by trainer
- [x] Course update (without lesson editing)
- [x] Course deletion
- [x] Course enrollment by learner

**Lesson Management:**
- [x] Lesson creation with file upload
- [x] Lesson deletion with Cloudinary cleanup
- [x] Video/image playback in lesson viewer
File Upload Size**: Limited by Cloudinary free tier (25GB storage, 25GB bandwidth/month)
2. **Email Rate Limits**: Resend free tier limited to 100 emails/day
3. **Render Free Tier**: Backend may sleep after inactivity (30 seconds cold start)
4. **Certificate Format**: HTML download only (users can print to PDF from browser)
5. **Lesson Order**: Manual ordering not yet implemented (displays in creation order
- [x] Timed exam taking
- [x] Auto-grading and result calculation
- [x] Result display with correct answers

**Certificate System:**
- [x] Certificate generation upon exam pass
- [x] Certificate download functionality

**Email Service:**
- [x] Contact form submission
- [x] Admin notification email
- [x] User auto-reply email
- [x] API and SMTP method auto-detection

**Admin Features:**
- [x] Dashboard statistics
- [x] User list display
- [x] Course and exam overview
4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Production Build

```bash
# Build frontend
cd front-end
npm run build

# The build files will be in front-end/dist
# Serve them using a static server or integrate with backend
### High Priority
- [ ] Pagination for courses, exams, and users (performance optimization)
- [ ] Search and filter functionality (by category, level, trainer)
- [ ] Lesson reordering (drag-and-drop interface)
- [ ] Server-side PDF generation for certificates
- [ ] Progress tracking (lesson completion percentage)

### Medium Priority
- [ ] Course rating and review system
- [ ] Discussion forums for courses
- [ ] Real-time notifications using WebSockets
- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Advanced analytics dashboard for trainers
- [ ] Dark mode toggle

### Long-term Vision
- [ ] Live video streaming for classes (WebRTC)
- [ ] Mobile app (React Native)
- [ ] Multi-language support (i18n)
- [🚢 Deployment

### Backend Deployment (Render.com)

1. **Create Render Account** and connect GitHub
2. **New Web Service** → Select repository
3. **Configuration:**
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment: Node
4. **Environment Variables:** Add all from `.env` file
5. **Deploy:** Automatic on git push to master

### Frontend Deployment (Vercel)

1. **Import Project** from GitHub
2. **Configuration:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Environment Variables:**
   - `VITE_API_URL=your-render-backend-url`
4. **Deploy:** Automatic on git push to master

### Database Hosting (MongoDB Atlas)

1. **Create Cluster** (M0 Free Tier)
2. **Create Database User**
3. **Network Access:** Allow from anywhere (0.0.0.0/0)
4. **Get Connection String** and add to backend env vars

### Post-Deployment Steps

1. ✅ Test backend health: `https://your-backend.onrender.com/api/auth/current`
2. ✅ Verify admin auto-creation in Render logs
3. ✅ Test frontend connectivity to backend
4. ✅ Test email service (contact form)
5. ✅ Test file upload to Cloudinary
6. ✅ Update CORS origin in backend to frontend URL

---

## 📚 Study Resources

For exam preparation and deep understanding of the project:

📁 **[deployguidefiles/study/](deployguidefiles/study/)**
- **[PROJECT_WORKFLOW.md](deployguidefiles/study/PROJECT_WORKFLOW.md)**: Complete system architecture, workflows, and technical documentation
- **[VIVA_QUESTIONS.md](deployguidefiles/study/VIVA_QUESTIONS.md)**: 75+ viva questions with detailed answers covering all technologies

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

### How to Contribute

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/your-username/LMS.git`
3. **Create branch**: `git checkout -b feature/AmazingFeature`
4. **Commit changes**: `git commit -m 'Add some AmazingFeature'`
5. **Push to branch**: `git push origin feature/AmazingFeature`
6. **Open Pull Request**

### Code Style Guidelines

- Follow existing code structure
- Use ESLint configuration provided
- Comment complex logic
- Test before submitting PR
- Follow React and Node.js best practices

---

## 📄 License

This project is open source and available for educational purposes.

---

## 👨‍💻 Author

**Divanshu Singla**

- GitHub: [@Divanshu-Singla](https://github.com/Divanshu-Singla)
- Email: divanshusingl2005@gmail.com

---

## 🙏 Acknowledgments

Special thanks to:

- **MongoDB** for robust NoSQL database solution
- **Cloudinary** for seamless media CDN and storage
- **Resend** for reliable email API service
- **Render & Vercel** for free hosting services
- **React & Node.js** communities for excellent documentation
- **Express.js** for minimalist web framework
- **Framer Motion** for beautiful animations
- **Vite** for lightning-fast build tool

---

## 📊 Project Status

**Current Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: December 21, 2025  
**Live Since**: December 2025

---

## 📞 Support

If you have any questions or need help:

1. 📧 Email: divanshusingl2005@gmail.com
2. 🐛 Issues: [GitHub Issues](https://github.com/Divanshu-Singla/LMS/issues)
3. 📚 Documentation: Check `deployguidefiles/study/` folder

---

**⭐ If you find this project useful, please give it a star!**

**Made with ❤️ for better online education

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style Guidelines

- Use ESLint configuration provided
- Follow React best practices
- Write clean, commented code
- Test before submitting PR

---

## 📄 License

This project is part of a learning platform initiative.

---

## 👨‍💻 Author

**Divanshu Singla**

GitHub: [Divanshu-Singla](https://github.com/Divanshu-Singla)

---

## 🙏 Acknowledgments

- MongoDB for robust database solution
- Cloudinary for seamless media storage
- React and Node.js communities
- Express.js for backend framework
- Tailwind CSS for utility-first styling
- Framer Motion for smooth animations

---

## 📊 Project Status

**Current Version**: 1.0.0  
**Status**: ✅ Active Development  
**Last Updated**: December 2025

---

**⭐ If you find this project useful, please give it a star!**
