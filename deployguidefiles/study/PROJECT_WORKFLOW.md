# LMS Project - Complete Working & Workflow Documentation

## Project Overview

**Project Name:** CourseCraft - Learning Management System  
**Type:** Full Stack Web Application  
**Purpose:** Online platform for course management, learning, and examination

---

## Technology Stack

### Frontend
- **Framework:** React 18.3.1
- **Build Tool:** Vite 6.0.5
- **Routing:** React Router DOM
- **Styling:** CSS, Framer Motion (animations)
- **HTTP Client:** Axios 1.8.1
- **State Management:** Context API (AuthContext, CourseContext, ExamContext, AdminContext, UserContext)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose 8.11.0
- **Authentication:** JWT (JSON Web Tokens) with bcrypt
- **File Upload:** Multer with Cloudinary storage
- **Email Service:** Resend API (primary), Nodemailer SMTP (fallback)

### Cloud Services
- **Database Hosting:** MongoDB Atlas (M0 Free Tier)
- **File Storage:** Cloudinary (images and videos)
- **Backend Hosting:** Render.com (free tier)
- **Frontend Hosting:** Vercel
- **Email API:** Resend (100 emails/day free tier)

---

## System Architecture

### 1. User Roles & Permissions

#### Learner
- Browse and view all courses
- Enroll in courses
- Watch lessons
- Take exams
- View results and certificates
- Update profile

#### Trainer
- Create and manage courses
- Create and manage lessons (add/delete)
- Create and manage exams
- View enrolled students
- Update course details

#### Admin
- View all users
- Manage user roles
- View all courses and exams
- Access admin dashboard
- **Auto-created on server startup:** admin@gmail.com / admin

---

## Application Workflow

### 2. User Management Flow

#### Registration Process
1. User navigates to `/register`
2. Fills form: name, email, password, role (Learner/Trainer only)
3. Frontend validates inputs
4. POST request to `/api/auth/register`
5. Backend validates data, checks email uniqueness
6. Password hashed with bcrypt
7. User document created in MongoDB
8. Success response returned
9. User redirected to login page

#### Login Process
1. User enters email and password
2. POST request to `/api/auth/login`
3. Backend verifies credentials
4. JWT token generated with user ID and role
5. Token stored in httpOnly cookie
6. User data stored in AuthContext
7. User redirected based on role:
   - Admin → `/admin`
   - Trainer → `/profile` (with trainer view)
   - Learner → `/` (home)

#### Authentication Middleware
```javascript
// Protects routes requiring authentication
authMiddleware checks:
1. JWT token in cookies
2. Token validity and expiration
3. User exists in database
4. Attaches user object to request
```

---

### 3. Course Management Flow

#### Course Creation (Trainer Only)
1. Trainer navigates to course form
2. Fills course details:
   - Title, description, category
   - Duration, level, prerequisites
   - Certification enabled/disabled
   - Thumbnail image
   - Syllabus (array of topics)
3. FormData created with all fields
4. POST to `/api/courses/create`
5. Backend validates trainer role
6. Thumbnail uploaded to Cloudinary
7. Course document created with trainer ID
8. Success response with course ID
9. Trainer redirected to course details

#### Course Display
1. GET `/api/courses` fetches all courses
2. CourseContext stores courses array
3. Components map over courses:
   - AllCourses: Grid of all courses
   - EnrolledCourses: Filtered by enrollment
   - TrainerCourses: Filtered by creator
4. CourseCard component displays each course

#### Course Enrollment (Learner Only)
1. Learner clicks "Enroll" button
2. POST to `/api/users/enroll/:courseId`
3. Backend checks:
   - User is learner
   - Not already enrolled
4. Course ID added to user's enrolledCourses array
5. Frontend refreshes user data
6. Button changes to "View Lessons"

#### Course Update (Trainer Only)
1. Trainer opens UpdateCourseModal
2. Form pre-filled with current data
3. Trainer edits fields (except lessons)
4. PUT to `/api/courses/update/:courseId`
5. Backend validates ownership
6. New files uploaded to Cloudinary if provided
7. Course document updated
8. Old files deleted from Cloudinary if replaced
9. **Note:** Lessons managed separately

---

### 4. Lesson Management Flow

#### Lesson Creation (Trainer Only)
1. Trainer opens course details page
2. Clicks "Add New Lesson" button
3. Modal opens with form:
   - Title (required)
   - Description (required)
   - Video/Image file (required)
4. File selected and validated
5. FormData created with lesson data
6. POST to `/api/lessons/create/:courseId`
7. Backend validates:
   - Trainer owns the course
   - Required fields present
8. File uploaded to Cloudinary (video or image)
9. Lesson document created
10. Lesson ID added to course.lessons array
11. Course updated with new lesson
12. Success response returned
13. Course data refreshed on frontend

#### Lesson Deletion (Trainer Only)
1. Trainer clicks delete icon on lesson
2. Confirmation dialog appears
3. DELETE to `/api/lessons/delete/:lessonId`
4. Backend validates ownership
5. Media file deleted from Cloudinary
6. Lesson ID removed from course.lessons array
7. Lesson document deleted from database
8. Success response returned
9. Course data refreshed on frontend

#### Lesson Viewing (Enrolled Learners)
1. Learner clicks "Show Lessons" on enrolled course
2. LessonViewer page loads
3. GET to `/api/lessons/:courseId`
4. Backend returns all lessons for course
5. Lessons displayed in order
6. VideoPlayer component handles video playback
7. Navigation between lessons available
8. Progress tracked (if implemented)

---

### 5. Exam Management Flow

#### Exam Creation (Trainer Only)
1. Trainer navigates to "Create Exam"
2. Fills exam details:
   - Title, description
   - Course selection
   - Duration (minutes)
   - Passing marks
   - Questions array with:
     - Question text
     - 4 options
     - Correct answer
     - Marks
3. POST to `/api/exams/create`
4. Backend validates trainer role
5. Exam document created with questions
6. Success response returned
7. Trainer redirected to exams list

#### Taking Exam (Enrolled Learners)
1. Learner navigates to exam list
2. Clicks "Start Exam" on available exam
3. StartExam page loads:
   - Timer starts countdown
   - One question displayed at a time
   - Options as radio buttons
4. Learner selects answers
5. On submit or time expires:
   - POST to `/api/exams/submit/:examId`
   - Answers array sent to backend
6. Backend calculates score:
   - Compares answers with correct ones
   - Sums marks for correct answers
7. Result document created:
   - Student ID
   - Exam ID
   - Score, total marks
   - Pass/fail status
   - Individual answers
8. Result displayed immediately
9. Certificate generated if passed and certification enabled

---

### 6. Certificate Generation Flow

1. Learner passes exam with certification enabled
2. Certificate button appears on profile
3. Click "Download Certificate"
4. POST to `/api/certificates/generate/:examId`
5. Backend validates:
   - User took exam
   - User passed exam
   - Course has certification enabled
6. Certificate template created:
   - User name
   - Course title
   - Date of completion
   - Certificate ID
7. PDF generated (or image)
8. Certificate URL returned
9. Download initiated in browser

---

### 7. Email Service Workflow

#### Contact Form Email
1. User fills contact form (name, email, message)
2. POST to `/api/contact/send`
3. Backend receives request
4. Message saved to Contact collection
5. Email service triggered:
   - **Admin Notification:**
     - To: divanshusingl2005@gmail.com
     - Subject: "New Contact Form Submission"
     - Body: User's name, email, message
   - **User Auto-Reply:**
     - To: User's email
     - Subject: "Thank you for contacting us"
     - Body: Confirmation message
6. Email method auto-detected:
   - If EMAIL_API_KEY exists → Use Resend API
   - Else → Use Gmail SMTP
7. Success/failure logged
8. Response sent to frontend regardless of email status

#### Email Method Detection
```javascript
const EMAIL_METHOD = process.env.EMAIL_API_KEY ? 'api' : 'smtp';

// API Method (Resend)
- POST to https://api.resend.com/emails
- Headers: Authorization: Bearer [API_KEY]
- Body: { from, to, subject, html }

// SMTP Method (Gmail)
- Uses nodemailer transporter
- Authenticates with Gmail credentials
- Sends via SMTP protocol
```

---

### 8. File Upload Flow

#### Image/Video Upload Process
1. User selects file in form (thumbnail, lesson video)
2. Frontend validates file type and size
3. FormData created with file
4. POST request with multipart/form-data
5. Multer middleware intercepts:
   - Validates file type
   - Streams to Cloudinary
6. Cloudinary returns secure URL
7. URL stored in database
8. File accessible via CDN

#### File Deletion
1. When resource deleted (course, lesson)
2. Backend extracts public_id from Cloudinary URL
3. Cloudinary delete API called
4. File removed from cloud storage
5. Database reference deleted

---

### 9. Database Schema

#### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['learner', 'trainer', 'admin'],
  enrolledCourses: [ObjectId ref Course],
  createdAt: Date
}
```

#### Course Model
```javascript
{
  title: String,
  description: String,
  category: String,
  trainer: ObjectId ref User,
  thumbnail: String (Cloudinary URL),
  lessons: [ObjectId ref Lesson],
  syllabus: [String],
  duration: String,
  level: String,
  prerequisites: String,
  certification: Boolean,
  createdAt: Date
}
```

#### Lesson Model
```javascript
{
  title: String,
  description: String,
  course: ObjectId ref Course,
  videoUrl: String (Cloudinary URL),
  imageUrl: String (Cloudinary URL),
  order: Number,
  createdAt: Date
}
```

#### Exam Model
```javascript
{
  title: String,
  description: String,
  course: ObjectId ref Course,
  trainer: ObjectId ref User,
  duration: Number (minutes),
  passingMarks: Number,
  questions: [{
    question: String,
    options: [String] (4 options),
    correctAnswer: Number (index),
    marks: Number
  }],
  createdAt: Date
}
```

#### Result Model
```javascript
{
  student: ObjectId ref User,
  exam: ObjectId ref Exam,
  score: Number,
  totalMarks: Number,
  passed: Boolean,
  answers: [{
    questionId: ObjectId,
    selectedAnswer: Number,
    isCorrect: Boolean
  }],
  completedAt: Date
}
```

---

### 10. API Endpoints Summary

#### Authentication Routes
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/logout` - User logout
- GET `/api/auth/current` - Get current user

#### Course Routes
- GET `/api/courses` - Get all courses
- GET `/api/courses/:id` - Get single course
- POST `/api/courses/create` - Create course (Trainer)
- PUT `/api/courses/update/:id` - Update course (Trainer)
- DELETE `/api/courses/delete/:id` - Delete course (Trainer)

#### Lesson Routes
- GET `/api/lessons/:courseId` - Get all lessons for course
- POST `/api/lessons/create/:courseId` - Create lesson (Trainer)
- DELETE `/api/lessons/delete/:lessonId` - Delete lesson (Trainer)

#### Exam Routes
- GET `/api/exams` - Get all exams
- GET `/api/exams/:id` - Get single exam
- GET `/api/exams/created` - Get trainer's exams (Trainer)
- POST `/api/exams/create` - Create exam (Trainer)
- PUT `/api/exams/update/:id` - Update exam (Trainer)
- DELETE `/api/exams/delete/:id` - Delete exam (Trainer)
- POST `/api/exams/submit/:id` - Submit exam answers (Learner)

#### User Routes
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/update` - Update user details
- POST `/api/users/enroll/:courseId` - Enroll in course (Learner)
- GET `/api/users/enrolled-courses` - Get enrolled courses (Learner)
- GET `/api/users/results` - Get exam results (Learner)

#### Admin Routes
- GET `/api/admin/users` - Get all users (Admin)
- PUT `/api/admin/users/:id/role` - Update user role (Admin)
- GET `/api/admin/stats` - Get dashboard statistics (Admin)

#### Certificate Routes
- GET `/api/certificates/generate/:examId` - Generate certificate
- GET `/api/certificates` - Get user's certificates

#### Contact Routes
- POST `/api/contact/send` - Send contact form

---

### 11. Security Implementation

#### Password Security
- Passwords hashed with bcrypt (salt rounds: 10)
- Never stored in plain text
- Compared using bcrypt.compare()

#### JWT Authentication
- Token generated on login
- Stored in httpOnly cookie (prevents XSS)
- Expires after set duration
- Verified on protected routes

#### Role-Based Access Control
- Middleware checks user role before allowing actions
- Trainer can only modify own resources
- Admin has elevated permissions
- Learner restricted to view and enroll

#### Input Validation
- Required fields checked on backend
- File types validated
- Email format validated
- SQL injection prevented by Mongoose

#### CORS Configuration
- Specific origin allowed (frontend URL)
- Credentials enabled for cookies
- Methods restricted to needed ones

---

### 12. Frontend State Management

#### Context Providers

**AuthContext**
- Current user data
- Login/logout functions
- Authentication status
- Token management

**CourseContext**
- All courses array
- Enrolled courses
- Fetch functions
- Loading states

**ExamContext**
- All exams array
- Created exams (trainer)
- Submit exam function
- Loading and error states

**UserContext**
- User profile data
- Update profile function
- Enrollment management

**AdminContext**
- User list
- Statistics
- Admin actions

#### Protected Routes
```javascript
<ProtectedRoute requiredRole="trainer">
  <TrainerDashboard />
</ProtectedRoute>
```
- Checks authentication
- Verifies user role
- Redirects if unauthorized

---

### 13. Deployment Architecture

#### Backend (Render)
- Auto-deploys from GitHub push
- Environment variables configured
- MongoDB Atlas connection string
- Cloudinary credentials
- Email API keys
- Automatic HTTPS

#### Frontend (Vercel)
- Auto-deploys from GitHub push
- Environment variable: VITE_API_URL
- Build command: `npm run build`
- Output directory: `dist`
- Automatic CDN distribution

#### Database (MongoDB Atlas)
- M0 free tier (512MB)
- Automatic backups
- Connection string in environment
- Network access from anywhere (0.0.0.0/0)

---

### 14. Key Features

✅ **User Management**
- Registration with role selection
- Secure authentication
- Profile management
- Password change

✅ **Course Management**
- Create/update/delete courses
- Rich course details
- Thumbnail images
- Syllabus management

✅ **Lesson Management**
- Add lessons to courses
- Video/image content
- Delete lessons
- Ordered display

✅ **Exam System**
- Create exams with multiple questions
- Timed exams
- Auto-grading
- Pass/fail status
- Results history

✅ **Certificate Generation**
- Automatic on exam pass
- Downloadable format
- Unique certificate IDs

✅ **Email Notifications**
- Contact form notifications
- Auto-replies
- API and SMTP support

✅ **File Management**
- Cloudinary integration
- Video and image uploads
- Automatic CDN delivery

✅ **Admin Panel**
- User management
- Statistics dashboard
- Role assignment

✅ **Responsive Design**
- Mobile-friendly
- Smooth animations
- Modern UI/UX

---

### 15. Production URLs

- **Frontend:** https://course-craft-university-s-own-free-eight.vercel.app
- **Backend:** https://course-craft-university-s-own-free-iipg.onrender.com
- **Database:** MongoDB Atlas (private connection string)
- **File Storage:** Cloudinary CDN

---

## Project Highlights

1. **Full MERN Stack Implementation** with modern best practices
2. **Role-Based Access Control** ensuring security and proper permissions
3. **Cloud-Native Architecture** using MongoDB Atlas, Cloudinary, Render, Vercel
4. **Automatic Email Service** with API fallback mechanism
5. **Real-Time File Upload** with progress and validation
6. **Comprehensive Exam System** with auto-grading and certificates
7. **Separated Concerns** - lessons managed independently from courses
8. **Admin Auto-Creation** for first-time setup convenience
9. **Responsive Design** working across all devices
10. **Production-Ready Deployment** with CI/CD pipeline via GitHub

---

**Last Updated:** December 21, 2025
