# CourseCraft - Learning Management System

![CourseCraft](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Node](https://img.shields.io/badge/Node-v14+-brightgreen)
![React](https://img.shields.io/badge/React-v18.3.1-61dafb)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [User Roles & Permissions](#user-roles--permissions)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

**CourseCraft** is a full-featured Learning Management System (LMS) designed to facilitate online education through course creation, enrollment, and examination. The platform supports multiple user roles and provides a comprehensive ecosystem for trainers to share knowledge and learners to acquire new skills.

### Key Highlights

- 🎓 **Multi-role Support**: Learner, Trainer, and Admin roles (Examinee role removed)
- 📚 **Course Management**: Create, manage, and enroll in courses with multimedia content
- 📖 **Dedicated Lesson Viewer**: Separate page for viewing lessons with progress tracking
- 📝 **Examination System**: Create and take exams with automatic grading and results
- 📧 **Email Notifications**: Automated notifications via Nodemailer
- 🔐 **Secure Authentication**: JWT-based authentication with role-based access control
- ☁️ **Cloud Storage**: Cloudinary integration for images and videos
- 📱 **Responsive Design**: Modern UI with Tailwind CSS and Framer Motion animations
- 🔔 **Notification System**: User notifications with delete functionality
- 🎨 **Professional Forms**: Styled create/edit forms for courses and exams with consistent design

---

## ✨ Features

### For Learners
- Browse and search available courses with search functionality
- Enroll in courses and track enrollment
- Access course lessons with video/image content (dedicated lesson viewer page)
- Track course progress with visual progress bars
- Continue learning from where you left off
- Take exams and view results immediately
- Track enrolled courses and exam history in profile
- Update profile details and change password
- Receive and manage notifications
- View detailed exam results

### For Trainers
- Create and manage courses with multimedia lessons
- Upload course thumbnails, lesson videos, and images
- Define course syllabus with modules and prerequisites
- Create exams with multiple-choice questions
- Set exam time limits, total marks, and difficulty levels (Beginner, Moderate, Advanced)
- Edit existing courses and exams with professional styled forms
- View and manage created courses with detailed trainer dashboard
- View and manage created exams
- Delete courses and exams
- Access notifications for course updates

### For Admins
- Dashboard with system statistics (non-admin users count, courses, exams)
- Manage users - view all users with their details
- Ban and unban users functionality
- View all courses in the system
- View all exams in the system
- Access to comprehensive admin panel with sidebar navigation

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer for handling multipart/form-data
- **Cloud Storage**: Cloudinary for images and videos
- **Email Service**: Nodemailer for contact form and notifications
- **Security**: bcryptjs for password hashing
- **Middleware**: Custom auth middleware with role-based access control
- **Error Handling**: Custom error middleware

### Frontend
- **Framework**: React v18.3.1
- **Build Tool**: Vite v6.0.5
- **Routing**: React Router DOM v7.3.0
- **Styling**: Tailwind CSS v4.0.8
- **UI Components**: React Icons (FiUsers, FiBook, FiClipboard)
- **Animations**: Framer Motion v12.4.7
- **State Management**: Context API (AuthContext, CourseContext, ExamContext, UserContext, AdminContext)
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
┌────▼────┐      ┌──────▼────────┐
│ MongoDB │      │   Cloudinary  │
│ Database│      │  Media Storage│
└─────────┘      └───────────────┘
```

### Data Flow
1. **User Authentication**: JWT tokens stored in cookies
2. **Course Creation**: Trainers upload → Pending approval → Admin approves → Public
3. **Enrollment**: Enrollment record → Access granted
4. **Exam Flow**: Fetch questions → Submit answers → Auto-grading → Certificate generation

---

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account

### Backend Setup

```bash
# Navigate to backend directory
cd back-end

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables (see below)
# Start the server
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd front-end

# Install dependencies
npm install

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
MONGO_URI=mongodb://localhost:27017/coursecraft
# OR use MongoDB Atlas
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/coursecraft

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
│   │   ├── courseController.js # Course CRUD operations
│   │   ├── examController.js   # Exam management
│   │   ├── lessonController.js # Lesson management
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
│   │   ├── contactRoutes.js    # Contact endpoints
│   │   ├── courseRoutes.js     # Course endpoints
│   │   ├── examRoutes.js       # Exam endpoints
│   │   ├── lessonRoutes.js     # Lesson endpoints
│   │   └── userRoutes.js       # User endpoints
│   │
│   ├── utils/
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
│   │   │   ├── CourseCard.jsx
│   │   │   ├── CourseCategories.jsx
│   │   │   ├── EnrolledCourses.jsx
│   │   │   ├── ExamResults.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MousePointer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ScrollToTopButton.jsx
│   │   │   ├── Slider.jsx
│   │   │   ├── Testimonial.jsx
│   │   │   ├── TrainerCourses.jsx
│   │   │   ├── TrainerExams.jsx
│   │   │   ├── UpdateUserDetails.jsx
│   │   │   ├── UserDetails.jsx
│   │   │   ├── UsersList.jsx
│   │   │   └── VideoPlayer.jsx
│   │   │
│   │   ├── contexts/
│   │   │   ├── AdminContext.jsx
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CourseContext.jsx
│   │   │   ├── ExamContext.jsx
│   │   │   └── UserContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useNetworkStatus.js
│   │   │
│   │   ├── pages/
│   │   │   ├── AboutUsPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminExamList.jsx
│   │   │   ├── ChangePassword.jsx
│   │   │   ├── ContactPage.jsx
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

2. **Start Backend**
```bash
cd back-end
npm start
```

3. **Start Frontend**
```bash
cd front-end
npm run dev
```

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
```

---

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Protected routes and API endpoints
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ Secure cookie handling
- ✅ File upload restrictions
- ✅ MongoDB injection prevention

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Course creation by trainer
- [ ] Course approval by admin
- [ ] Course enrollment by learner
- [ ] Lesson access after enrollment
- [ ] Exam creation and question addition
- [ ] Exam taking and submission
- [ ] Certificate generation
- [ ] Admin dashboard statistics
- [ ] User ban/unban functionality

---

## 🐛 Known Issues & Limitations

1. **Certificate Generation**: Not yet implemented
2. **Mobile Responsiveness**: All pages are responsive but some forms may benefit from further optimization
3. **File Upload Size**: Limited by Cloudinary free tier constraints

---

## 🔮 Future Enhancements

- [ ] Certificate generation for course completion
- [ ] Dark mode toggle for entire application
- [ ] Real-time notifications using WebSockets
- [ ] Advanced analytics dashboard for trainers
- [ ] Course rating and review system
- [ ] Discussion forums for courses
- [ ] Live video streaming for classes
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] AI-powered course recommendations
- [ ] Gamification features (badges, leaderboards)
- [ ] Payment gateway integration (Stripe)
- [ ] Export reports (PDF, Excel)

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
