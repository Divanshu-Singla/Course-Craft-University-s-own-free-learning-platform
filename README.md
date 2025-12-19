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

- 🎓 **Multi-role Support**: Learner, Trainer, Admin, and Examinee roles
- 📚 **Course Management**: Create, manage, and enroll in courses with multimedia content
- 📖 **Dedicated Lesson Viewer**: Separate page for viewing lessons with progress tracking
- 📝 **Examination System**: Practice tests and certification exams with automatic grading
- 📰 **News Integration**: Live news feed with NewsAPI (Technology, Business, Science, Health)
- 📧 **Email Notifications**: Automated contact form notifications with Gmail SMTP
- 🔐 **Secure Authentication**: JWT-based authentication with role-based access control
- ☁️ **Cloud Storage**: Cloudinary integration for media files and videos
- 📱 **Responsive Design**: Modern UI with Tailwind CSS and Framer Motion animations
- 🌑 **Consistent Theme**: Dark navbar and footer (gray-900) with professional look

---

## ✨ Features

### For Learners
- Browse and search available courses by category
- Enroll in free and paid courses
- Access course lessons with video/image content (dedicated lesson viewer page)
- Track course progress with visual progress bars
- Take practice tests and certification exams
- View exam results and download certificates
- Track enrolled courses and exam history
- Update profile and privacy settings
- Stay updated with latest news in Technology, Business, Science, and Health

### For Trainers
- Create and manage courses with multimedia lessons
- Upload course thumbnails, videos, and images
- Define course syllabus and prerequisites
- Create exams with multiple-choice questions
- Set exam time limits, marks, and difficulty levels
- View created courses and exams
- Track course enrollment statistics

### For Admins
- Dashboard with system statistics (users, courses, exams)
- Approve or reject pending courses
- Manage users (view, ban, unban)
- View and manage all courses and exams
- Access payment and enrollment reports
- Content moderation and quality control

### For Examinees
- Access to examination features
- View exam results and performance analytics
- Optional course enrollment (upgradeable)

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **PDF Generation**: PDFKit
- **Email Service**: Nodemailer (Gmail SMTP configured)
- **External APIs**: NewsAPI for live news feed
- **Security**: bcryptjs for password hashing

### Frontend
- **Framework**: React v18.3.1
- **Build Tool**: Vite v6.0.5
- **Routing**: React Router DOM v7.3.0
- **Styling**: Tailwind CSS v4.0.8
- **UI Components**: Headless UI, Lucide React, React Icons
- **Animations**: Framer Motion v12.4.7
- **State Management**: Context API
- **HTTP Client**: Axios v1.8.1
- **Notifications**: React Toastify, React Hot Toast
- **Cookies**: js-cookie
- **External APIs**: NewsAPI for news integration

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

# Email Configuration (Gmail SMTP)
EMAIL_USER=divanshusingla2005@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password

# NewsAPI Configuration (for news feed)
NEWS_API_KEY=your_newsapi_key_from_newsapi.org
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
- ✅ Enroll in courses (free/paid)
- ✅ Access course content
- ✅ Take exams
- ✅ View results and certificates
- ❌ Cannot create courses or exams

### Trainer
- ✅ All learner permissions
- ✅ Create and manage courses
- ✅ Upload course content (videos, images)
- ✅ Create and manage exams
- ✅ View course enrollment statistics
- ❌ Cannot approve courses (requires admin)

### Admin
- ✅ Full system access
- ✅ Approve/reject courses
- ✅ Manage all users
- ✅ Ban/unban users
- ✅ View all courses and exams
- ✅ Access dashboard analytics
- ✅ Content moderation

### Examinee
- ✅ Take exams
- ✅ View exam results
- ✅ Download certificates
- ⚠️ Limited course enrollment (upgradeable)

---

## 🗄️ Database Schema

### User Model
```javascript
{
  fullName: String,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: Enum ['learner', 'trainer', 'examinee', 'admin'],
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
  // Role-specific fields
  qualification: String,
  degree: String,
  profession: String,
  enrolledCourses: [ObjectId],
  enrolledExams: [ObjectId],
  isBanned: Boolean,
  isDeleted: Boolean
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
  code: String,
  subject: String,
  category: String,
  timeLimit: Number,
  numQuestions: Number,
  totalMarks: Number,
  type: Enum ['Practice Test', 'Certification Exam'],
  questions: [ObjectId],
  createdBy: ObjectId,
  randomized: Boolean,
  expiryDate: Date,
  attemptsLimit: Number,
  restrictCopyPaste: Boolean
}
```

### Question Model
```javascript
{
  exam: ObjectId,
  text: String,
  options: [String],
  correctAnswer: String,
  marks: Number,
  negativeMarking: Number,
  difficulty: Enum ['Easy', 'Medium', 'Hard'],
  explanation: String
}
```

### Result Model
```javascript
{
  user: ObjectId,
  exam: ObjectId,
  examType: String,
  obtainedMarks: Number,
  correctAnswers: Number,
  incorrectAnswers: Number,
  totalQuestions: Number,
  percentage: Number,
  passed: Boolean,
  certificateUrl: String,
  submittedAt: Date
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
│   │   │   ├── LessonViewer.jsx    # Dedicated lesson viewing page
│   │   │   ├── Login.jsx
│   │   │   ├── NewsPage.jsx        # News feed with NewsAPI
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

1. **NewsAPI Rate Limits**: Free tier limited to 100 requests/day (consider upgrading for production)
2. **Certificate Generation**: Planned feature for future release
3. **Mobile Responsiveness**: Some admin pages may need UI improvements for mobile devices

---

## 🔮 Future Enhancements

- [ ] Certificate generation for course completion
- [ ] Dark mode toggle for entire application
- [ ] Real-time notifications using WebSockets
- [ ] Advanced analytics dashboard
- [ ] Course rating and review system
- [ ] Discussion forums for courses
- [ ] Live video streaming for classes
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] AI-powered course recommendations
- [ ] Gamification features (badges, leaderboards)
- [ ] Integration with third-party LMS tools

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

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**CourseCraft Development Team**

For questions or support, please contact:
- Email: support@coursecraft.com
- GitHub Issues: [Create an issue](https://github.com/yourusername/coursecraft/issues)

---

## 🙏 Acknowledgments

- MongoDB for database
- Cloudinary for media storage
- React and Node.js communities
- All contributors and testers

---

## 📊 Project Status

**Current Version**: 1.0.0  
**Status**: ✅ Active Development  
**Last Updated**: November 2025

---

**⭐ If you find this project useful, please give it a star!**
