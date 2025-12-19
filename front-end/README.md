# CourseCraft - University's Free Learning Platform (Frontend)

A modern, responsive Learning Management System built with React and Vite for Chitkara University.

## 🚀 Features

### Core Functionality
- **User Authentication** - Login/Register with JWT-based authentication
- **Role-Based Access** - Learner, Trainer, Admin, and Examinee roles
- **Course Management** - Browse, enroll, and track course progress
- **Lesson Viewer** - Dedicated page for viewing course lessons with video/image support
- **Progress Tracking** - Real-time course completion tracking with visual progress bars
- **Exam System** - Create, take, and manage exams with results
- **Profile Management** - Update user details, profile picture, and change password

### Pages & Routes
- **Home** - Landing page with course carousel and featured content
- **Courses** - Browse all available courses with search and filters
- **Course Details** - View course information, syllabus, and enroll
- **Lesson Viewer** (`/learn/:id`) - Watch lessons and track progress
- **Exams** - Take exams and view results
- **News** - Latest news with category filters (Technology, Business, Science, Health)
- **About Us** - Information about CourseCraft platform
- **Contact** - Contact form with email notification
- **Profile** - User dashboard with enrolled courses and exam results
- **Admin Dashboard** - Manage users, courses, and exams

### UI/UX Features
- **Dark Navbar & Footer** - Consistent gray-900 theme
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Loading Screens** - Animated loading states with gradient branding
- **Toast Notifications** - Real-time feedback for user actions
- **Network Status** - Offline detection with visual indicators
- **Smooth Animations** - Framer Motion for page transitions

### External Integrations
- **NewsAPI** - Live news feed with category filters
- **Cloudinary** - Image and video hosting
- **Nodemailer** - Email notifications for contact form

## 🛠️ Tech Stack

- **React 18.3.1** - UI library
- **Vite 6.0.5** - Build tool and dev server
- **React Router 7.3.0** - Client-side routing
- **Tailwind CSS 4.0.8** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Toastify** - Toast notifications
- **js-cookie** - Cookie management

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Environment Variables

The frontend connects to the backend API at `http://localhost:5000` by default.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation with dark theme
│   ├── Footer.jsx      # Footer with links
│   ├── CourseCard.jsx  # Course display card
│   ├── CourseProgressBar.jsx
│   ├── EnrolledCourses.jsx
│   ├── ExamResults.jsx
│   └── ...
├── pages/              # Route pages
│   ├── Home.jsx
│   ├── Courses.jsx
│   ├── CourseDetails.jsx
│   ├── LessonViewer.jsx    # Lesson viewing page
│   ├── NewsPage.jsx        # News feed with API
│   ├── Profile.jsx
│   ├── ExamList.jsx
│   ├── StartExam.jsx
│   ├── AboutUsPage.jsx
│   ├── ContactPage.jsx
│   ├── AdminDashboard.jsx
│   └── ...
├── contexts/           # React Context API
│   ├── AuthContext.jsx
│   ├── CourseContext.jsx
│   ├── ExamContext.jsx
│   └── UserContext.jsx
├── hooks/              # Custom React hooks
│   └── useNetworkStatus.js
├── utils/              # Utility functions
│   └── networkStore.js
├── App.jsx            # Main app component
└── main.jsx           # Entry point
```

## 🎨 Key Features Breakdown

### Course System
- Separate course details landing page and lesson viewer
- Progress tracking with thin progress bars
- "Continue Learning" button for enrolled students
- Video/image lesson content support
- Mark lessons as complete functionality

### News Integration
- Live news feed using NewsAPI
- Category filters: Technology, Business, Science, Health
- Responsive card layout with images
- External links to full articles
- Loading states and error handling

### Contact System
- Contact form with server-side email notifications
- Admin receives notification emails
- Users receive auto-reply confirmation
- Non-blocking email sending (DB save is priority)

### User Experience
- Consistent dark navbar (gray-900) matching footer
- Smooth page transitions with lazy loading
- Offline detection with toast notifications
- Mobile-responsive design throughout
- Search functionality in navbar

## 🔗 API Endpoints Used

### Backend API (`http://localhost:5000/api`)
- `/auth/*` - Authentication
- `/users/*` - User management
- `/courses/*` - Course operations
- `/lessons/*` - Lesson management
- `/exams/*` - Exam system
- `/contact` - Contact form submission
- `/admin/*` - Admin operations

### External APIs
- **NewsAPI** - `https://newsapi.org/v2/top-headlines`

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎯 Future Enhancements

- Dark mode toggle for entire site
- Certificate generation for course completion
- Live video classes integration
- AI-powered chatbot for student support
- Multi-language support
- Social media integration

## 📄 License

This project is part of Chitkara University's learning platform initiative.
