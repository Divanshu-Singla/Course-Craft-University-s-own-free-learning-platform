# LMS Project - Viva Questions & Answers

## General Project Questions

### Q1: What is your project about?
**Answer:** My project is a Learning Management System (LMS) called "CourseCraft" that allows trainers to create courses and exams, and learners to enroll, learn, and take exams. It includes features like course management, lesson viewing, exam taking, certificate generation, and email notifications. The system supports three user roles: Admin, Trainer, and Learner.

### Q2: What problem does your project solve?
**Answer:** It provides an online platform for education where trainers can share knowledge through structured courses, and learners can access quality education from anywhere. It automates exam grading, certificate generation, and course management, making online learning efficient and accessible.

### Q3: What are the main features of your project?
**Answer:**
- User authentication with three roles (Admin, Trainer, Learner)
- Course creation and management by trainers
- Lesson management with video/image content
- Enrollment system for learners
- Timed exam system with auto-grading
- Certificate generation for passed exams
- Email notifications for contact forms
- Admin dashboard for user management
- File uploads to cloud storage (Cloudinary)

---

## Technology Stack Questions

### Q4: Why did you choose the MERN stack?
**Answer:** MERN (MongoDB, Express, React, Node.js) is a powerful full-stack JavaScript solution. Using JavaScript across the entire stack improves development efficiency, code reusability, and team collaboration. MongoDB offers flexible schema design, React provides excellent UI performance, Express simplifies backend routing, and Node.js enables non-blocking, event-driven architecture perfect for handling multiple concurrent users.

### Q5: What is React and why did you use it?
**Answer:** React is a JavaScript library for building user interfaces developed by Facebook. I used React because:
- **Component-Based Architecture:** Reusable components like CourseCard, Navbar
- **Virtual DOM:** Efficient rendering and better performance
- **Rich Ecosystem:** Large community and extensive libraries
- **Declarative UI:** Easier to understand and debug
- **Context API:** Built-in state management without external libraries

### Q6: What is Node.js and its advantages?
**Answer:** Node.js is a JavaScript runtime built on Chrome's V8 engine that executes JavaScript on the server side. Advantages:
- **Non-blocking I/O:** Handles multiple requests efficiently
- **Single Language:** JavaScript for both frontend and backend
- **NPM Ecosystem:** Millions of packages available
- **Scalability:** Event-driven architecture handles concurrent connections
- **Fast Execution:** V8 engine compiles JavaScript to machine code

### Q7: Why MongoDB instead of SQL databases?
**Answer:** MongoDB is a NoSQL database that stores data in flexible JSON-like documents. I chose it because:
- **Flexible Schema:** Easy to modify structure without migrations
- **Scalability:** Horizontal scaling with sharding
- **JSON Format:** Natural fit with JavaScript/Node.js
- **Fast Development:** Quick iterations during development
- **Complex Data:** Handles nested structures like exam questions easily

### Q8: What is Express.js?
**Answer:** Express.js is a minimal and flexible Node.js web application framework. It provides:
- **Routing:** Easy route management (GET, POST, PUT, DELETE)
- **Middleware:** Request processing pipeline
- **HTTP Utilities:** Simplified request/response handling
- **Template Engines:** Support for various view engines
- **Large Community:** Extensive middleware ecosystem

---

## Frontend Questions

### Q9: What is Vite and why did you use it?
**Answer:** Vite is a modern frontend build tool that's significantly faster than traditional bundlers like Webpack. Benefits:
- **Lightning Fast HMR:** Hot Module Replacement in milliseconds
- **Instant Server Start:** Uses native ES modules
- **Optimized Build:** Rollup-based production builds
- **Out-of-the-box Support:** TypeScript, JSX, CSS pre-processors
- **Better Development Experience:** Faster iteration cycles

### Q10: Explain Context API and its usage in your project.
**Answer:** Context API is React's built-in state management solution that allows sharing data across components without prop drilling. I used 5 contexts:
- **AuthContext:** User authentication state, login/logout functions
- **CourseContext:** All courses data, fetch and update functions
- **ExamContext:** Exam data and submission logic
- **UserContext:** User profile and enrollment management
- **AdminContext:** Admin-specific data and functions

Each context provides data and functions to child components via useContext hook.

### Q11: What is React Router and how did you implement it?
**Answer:** React Router is a library for handling navigation in single-page applications. Implementation:
- **BrowserRouter:** Wraps the entire app
- **Routes & Route:** Define path-to-component mappings
- **Protected Routes:** Custom component checking authentication and role
- **Navigate:** Programmatic navigation after actions
- **useNavigate hook:** Navigation within components

Example: `<Route path="/courses/:id" element={<CourseDetails />} />`

### Q12: What are React Hooks you used?
**Answer:**
- **useState:** Managing component state (form inputs, loading states)
- **useEffect:** Side effects (fetching data, cleanup)
- **useContext:** Accessing context data (AuthContext, CourseContext)
- **useNavigate:** Programmatic navigation
- **Custom Hooks:** useNetworkStatus for online/offline detection

### Q13: How did you implement form handling?
**Answer:** Forms handled with controlled components:
1. State variables for each input field
2. onChange handlers update state
3. onSubmit prevents default, validates data
4. FormData created for file uploads
5. Axios POST request with data
6. Success/error handling with user feedback
7. State reset after successful submission

---

## Backend Questions

### Q14: Explain the MVC architecture in your project.
**Answer:** MVC (Model-View-Controller) separates application logic:
- **Models:** MongoDB schemas (User, Course, Lesson, Exam, Result) - define data structure
- **Controllers:** Business logic functions (authController, courseController) - handle requests
- **Routes:** API endpoints connecting URLs to controllers - define API structure
- **View:** React frontend (separate application) - user interface

This separation improves maintainability and scalability.

### Q15: What is middleware and examples from your project?
**Answer:** Middleware functions process requests before reaching controllers. My middleware:
- **authMiddleware:** Verifies JWT token, attaches user to request
- **errorMiddleware:** Catches errors, sends formatted responses
- **multerConfig:** Handles file uploads, configures Cloudinary storage
- **roleCheck:** Validates user role (admin, trainer, learner)

Middleware executes in order: `app.use(cors()) → authMiddleware → controller`

### Q16: Explain your authentication system.
**Answer:** JWT-based authentication:
1. **Registration:** Password hashed with bcrypt (10 salt rounds), user saved
2. **Login:** Credentials verified, JWT generated with user ID and role
3. **Token Storage:** Stored in httpOnly cookie (prevents XSS attacks)
4. **Protected Routes:** authMiddleware verifies token, extracts user
5. **Logout:** Cookie cleared on client and server
6. **Expiration:** Token expires after set duration (24 hours)

### Q17: How does role-based access control work?
**Answer:** Three roles with specific permissions:
- **Learner:** View courses, enroll, take exams, view certificates
- **Trainer:** Create courses/lessons/exams, manage own content, view students
- **Admin:** Manage users, view all content, access dashboard

Implementation:
- Role stored in User model
- authMiddleware attaches user to request
- Controllers check `req.user.role`
- Frontend hides/shows UI based on role

### Q18: Explain Mongoose and its role.
**Answer:** Mongoose is an ODM (Object Data Modeling) library for MongoDB. Features used:
- **Schemas:** Define data structure with types and validations
- **Models:** Classes for creating and querying documents
- **Validation:** Built-in validators (required, unique, enum)
- **Middleware:** Pre/post hooks (e.g., password hashing before save)
- **Population:** Joining related documents (course with lessons)
- **Queries:** Chainable query methods (find, update, delete)

---

## Database Questions

### Q19: Explain your database schema design.
**Answer:** I have 7 main collections:
1. **Users:** Stores user credentials, role, enrolled courses
2. **Courses:** Course details, trainer reference, lesson array
3. **Lessons:** Lesson content, video/image URLs, course reference
4. **Exams:** Exam details, questions array, course reference
5. **Results:** Student answers, score, pass/fail status
6. **Contacts:** Contact form submissions
7. **Questions:** Exam questions (embedded in Exam model)

Relationships established using ObjectId references and populated when needed.

### Q20: What are MongoDB indexing and its benefits?
**Answer:** Indexes improve query performance by creating a data structure that allows quick lookups. In my project:
- **Unique Index on User.email:** Ensures no duplicate emails, fast login queries
- **Index on Course.trainer:** Fast retrieval of trainer's courses
- **Compound Index on Result (student + exam):** Quick results lookup

Without indexes, MongoDB scans entire collections (slow). With indexes, direct document access (fast).

### Q21: How do you handle relationships in MongoDB?
**Answer:** Two approaches:
1. **Embedding:** Store related data within document (exam questions in exam)
   - Pros: Single query, atomic updates
   - Cons: Document size limits, data duplication
   
2. **Referencing:** Store ObjectId of related document
   - Pros: No duplication, smaller documents
   - Cons: Multiple queries (use populate())
   
I used referencing for courses-lessons, users-courses and embedding for exam questions.

---

## File Upload & Cloud Storage Questions

### Q22: How does file upload work in your project?
**Answer:** File upload process:
1. User selects file in form (thumbnail, lesson video)
2. Frontend validates file type and size
3. FormData created with file and other fields
4. POST request with `multipart/form-data` content type
5. Multer middleware intercepts on backend
6. File streamed to Cloudinary storage
7. Cloudinary returns secure URL
8. URL saved in MongoDB
9. File accessible via CDN

### Q23: Why did you choose Cloudinary?
**Answer:** Cloudinary is a cloud-based media management platform. Benefits:
- **Free Tier:** 25GB storage, 25GB bandwidth
- **Global CDN:** Fast content delivery worldwide
- **Automatic Optimization:** Image/video compression
- **Transformations:** Resize, crop, format conversion on-the-fly
- **Easy Integration:** SDK for Node.js
- **Secure Storage:** URLs with secure tokens
- **No Server Storage:** Saves server disk space

### Q24: What is Multer?
**Answer:** Multer is a Node.js middleware for handling `multipart/form-data` (file uploads). Configuration:
- **Storage:** multer-storage-cloudinary for direct Cloudinary upload
- **File Filter:** Accepts images (jpg, png) and videos (mp4, avi)
- **Field Name:** `upload.single('video')` or `upload.any()` for flexible fields
- **Size Limit:** Can configure maximum file size
- **Error Handling:** Catches invalid file types or size exceeded

---

## API & Communication Questions

### Q25: What is REST API and how did you implement it?
**Answer:** REST (Representational State Transfer) is an architectural style for APIs. Principles followed:
- **Resource-Based URLs:** `/api/courses`, `/api/exams/:id`
- **HTTP Methods:** GET (read), POST (create), PUT (update), DELETE (delete)
- **Stateless:** Each request independent, no server-side sessions
- **JSON Format:** Request/response bodies in JSON
- **Status Codes:** 200 (success), 201 (created), 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error)

### Q26: What is Axios and why use it over fetch?
**Answer:** Axios is a promise-based HTTP client. Advantages over fetch:
- **Automatic JSON Parsing:** No need for `.json()` call
- **Request Interceptors:** Attach tokens automatically
- **Response Interceptors:** Global error handling
- **Timeout Support:** Set request timeout
- **Cancel Requests:** Abort pending requests
- **Browser Compatibility:** Works in older browsers
- **Error Handling:** Rejects on HTTP error status

Configuration: Base URL set globally, withCredentials for cookies.

### Q27: How does CORS work and why is it needed?
**Answer:** CORS (Cross-Origin Resource Sharing) is a security mechanism that allows or restricts resources requested from another domain. 

**Problem:** Frontend (Vercel) and backend (Render) on different origins - browser blocks requests.

**Solution:** Backend sends CORS headers:
```javascript
cors({
  origin: 'https://frontend-url.vercel.app',
  credentials: true
})
```

This tells browser: "This origin is allowed to access my resources with credentials."

---

## Email Service Questions

### Q28: How did you implement email functionality?
**Answer:** Dual-method email service:
1. **Primary - API Method (Resend):**
   - API_KEY present → Use Resend API
   - POST to `https://api.resend.com/emails`
   - Bearer token authentication
   - JSON body with from, to, subject, html
   
2. **Fallback - SMTP Method (Gmail):**
   - No API_KEY → Use Gmail SMTP
   - Nodemailer with Gmail transporter
   - SMTP authentication with email/password
   - App-specific password required

Auto-detection based on environment variable presence.

### Q29: Why use API for emails instead of SMTP?
**Answer:** 
- **Reliability:** SMTP often blocked on free hosting (Render free tier)
- **Speed:** API calls faster than SMTP connection
- **Rate Limits:** Better handling of throttling
- **Deliverability:** Better inbox placement
- **Monitoring:** API provides delivery tracking
- **Scalability:** Easier to scale with high volume

Resend provides 100 free emails/day, sufficient for contact forms.

### Q30: What is Nodemailer?
**Answer:** Nodemailer is a Node.js module for sending emails. Features:
- **Multiple Transports:** SMTP, API, Sendmail, Stream
- **HTML Content:** Rich email formatting
- **Attachments:** Send files with emails
- **OAuth2:** Gmail authentication
- **Template Support:** Dynamic content with variables

Used for contact form notifications and auto-replies.

---

## Security Questions

### Q31: What security measures did you implement?
**Answer:**
1. **Password Hashing:** Bcrypt with 10 salt rounds, never store plain text
2. **JWT Authentication:** Secure token-based auth, httpOnly cookies
3. **Input Validation:** Validate all user inputs, sanitize data
4. **CORS Configuration:** Restrict origins, allow only frontend URL
5. **Role-Based Access:** Check permissions before allowing actions
6. **SQL Injection Prevention:** Mongoose escapes queries automatically
7. **XSS Prevention:** httpOnly cookies, React escapes output
8. **File Upload Validation:** Check file types, limit sizes
9. **Environment Variables:** Sensitive data in .env, not in code
10. **HTTPS:** Secure connections (Render and Vercel provide SSL)

### Q32: What is bcrypt and how does it work?
**Answer:** Bcrypt is a password hashing library with built-in salt. Process:
1. **Hashing:** `bcrypt.hash(password, 10)` - 10 is salt rounds (2^10 iterations)
2. **Salt:** Random data added to password before hashing (prevents rainbow table attacks)
3. **One-Way:** Cannot decrypt hashed password (irreversible)
4. **Comparison:** `bcrypt.compare(plainPassword, hashedPassword)` returns true/false
5. **Slow by Design:** Computational cost prevents brute force attacks

More salt rounds = slower but more secure.

### Q33: What is JWT and how does it work?
**Answer:** JWT (JSON Web Token) is a compact, self-contained way to transmit information securely. Structure:
- **Header:** Algorithm and token type (HS256, JWT)
- **Payload:** User data (id, role, email) - not sensitive data
- **Signature:** Encrypted with secret key, verifies token integrity

Process:
1. User logs in with credentials
2. Server creates JWT with user ID and role
3. JWT sent to client (stored in httpOnly cookie)
4. Client sends JWT with each request
5. Server verifies signature and extracts user data
6. No database lookup needed for every request

---

## Deployment Questions

### Q34: How did you deploy your application?
**Answer:**
- **Backend:** Deployed on Render.com
  - Connected GitHub repository
  - Set build command: `npm install`
  - Set start command: `node server.js`
  - Configured environment variables
  - Auto-deploys on git push to master
  
- **Frontend:** Deployed on Vercel
  - Connected GitHub repository
  - Set build command: `npm run build`
  - Set output directory: `dist`
  - Configured VITE_API_URL environment variable
  - Auto-deploys on git push to master

- **Database:** MongoDB Atlas cloud database

### Q35: What is MongoDB Atlas?
**Answer:** MongoDB Atlas is a fully-managed cloud database service. Features:
- **Managed Service:** No server maintenance, automatic backups
- **Global Clusters:** Deploy in multiple regions
- **Scalability:** Easy vertical and horizontal scaling
- **Security:** Built-in encryption, network isolation, authentication
- **Free Tier:** M0 with 512MB storage, perfect for learning
- **Monitoring:** Built-in performance metrics and alerts
- **Connection String:** Simple connection from any application

### Q36: What are environment variables and why use them?
**Answer:** Environment variables store configuration values outside code. Benefits:
- **Security:** API keys not exposed in GitHub
- **Flexibility:** Different values for dev/production
- **Easy Changes:** Update without code changes
- **Team Collaboration:** Each developer uses own credentials

Examples: DATABASE_URL, JWT_SECRET, CLOUDINARY_KEY, EMAIL_API_KEY

Accessed in Node.js: `process.env.VARIABLE_NAME`

---

## Performance Questions

### Q37: How did you optimize application performance?
**Answer:**
1. **Virtual DOM (React):** Efficient UI updates
2. **Lazy Loading:** Load components on demand
3. **CDN (Cloudinary):** Fast media delivery globally
4. **Indexing (MongoDB):** Fast database queries
5. **Pagination:** Load limited data per request (can be implemented)
6. **Image Optimization:** Cloudinary auto-optimizes images
7. **Caching:** Browser caching for static assets
8. **Minification:** Vite minifies production build
9. **Code Splitting:** Vite automatically splits code

### Q38: What is Virtual DOM?
**Answer:** Virtual DOM is a lightweight JavaScript representation of actual DOM. How it works:
1. React creates virtual DOM tree
2. On state change, new virtual DOM created
3. React compares (diffing algorithm) old and new virtual DOM
4. Identifies minimal changes needed
5. Updates only changed parts in real DOM
6. Much faster than updating entire DOM

Example: If one list item changes, only that item re-renders, not entire list.

---

## Testing & Debugging Questions

### Q39: How did you test your application?
**Answer:**
1. **Manual Testing:** Testing each feature in browser
2. **Postman:** Testing API endpoints independently
3. **Console Logging:** Debugging with console.log statements
4. **Browser DevTools:** Inspecting network requests, React components
5. **Error Handling:** Try-catch blocks, error middleware
6. **Render Logs:** Monitoring server logs for errors
7. **MongoDB Compass:** Inspecting database records

### Q40: How do you debug errors in your application?
**Answer:**
1. **Frontend:** Browser console, React DevTools, network tab
2. **Backend:** Console logs, Render logs, error stack traces
3. **Database:** MongoDB Compass, query testing
4. **API:** Postman for testing endpoints
5. **Error Messages:** Descriptive error messages in responses
6. **Logger Utility:** Custom logger for structured logging

---

## Advanced Concepts Questions

### Q41: What is async/await and how did you use it?
**Answer:** Async/await is syntactic sugar for Promises, making asynchronous code look synchronous.

**Without async/await:**
```javascript
axios.get('/api/courses')
  .then(response => setData(response.data))
  .catch(error => console.error(error));
```

**With async/await:**
```javascript
try {
  const response = await axios.get('/api/courses');
  setData(response.data);
} catch (error) {
  console.error(error);
}
```

Used extensively for API calls, database queries, file uploads.

### Q42: What is event-driven architecture in Node.js?
**Answer:** Node.js uses an event loop and callbacks to handle asynchronous operations. Process:
1. Request received, added to event queue
2. Event loop picks request (non-blocking)
3. Long operations (DB query, file I/O) delegated to thread pool
4. Callback registered for completion
5. Event loop continues processing other requests
6. When operation completes, callback executed
7. Response sent to client

This allows handling thousands of concurrent connections with single thread.

### Q43: What is state management and why is it important?
**Answer:** State management handles application data flow. Important because:
- **Data Consistency:** Same data across components
- **Predictability:** Clear data flow, easier debugging
- **Performance:** Avoid unnecessary re-renders
- **Scalability:** Manage growing complexity

Used Context API for global state (auth, courses, exams) and useState for local component state (form inputs, modals).

---

## Challenges & Learnings Questions

### Q44: What was the biggest challenge in this project?
**Answer:** The biggest challenge was implementing the lesson management system. Initially, lesson editing was part of course update, but it became too complex with file uploads, validation, and state management. The solution was to separate lesson management completely - removing it from course updates and creating dedicated add/delete lesson endpoints. This simplified the codebase and improved maintainability.

### Q45: What would you improve in this project?
**Answer:**
1. **Pagination:** Limit courses/exams per page for better performance
2. **Search & Filters:** Find courses by category, level, trainer
3. **Progress Tracking:** Track lesson completion percentage
4. **Real-time Notifications:** WebSocket for instant updates
5. **Payment Integration:** Paid courses with Stripe/Razorpay
6. **Video Streaming:** Adaptive bitrate streaming for lessons
7. **Discussion Forum:** Student-teacher interaction
8. **Unit Testing:** Jest/Mocha for automated testing
9. **Admin Analytics:** Detailed statistics and graphs
10. **Mobile App:** React Native for iOS/Android

### Q46: What did you learn from this project?
**Answer:**
1. **Full-stack Development:** End-to-end application development
2. **Database Design:** Efficient schema design and relationships
3. **Authentication & Authorization:** Secure user management
4. **File Management:** Cloud storage and CDN integration
5. **API Design:** RESTful principles and best practices
6. **Deployment:** Cloud hosting and CI/CD pipelines
7. **Problem Solving:** Debugging complex issues
8. **State Management:** Context API and data flow
9. **Security:** Common vulnerabilities and prevention
10. **Version Control:** Git workflow and collaboration

---

## Scenario-Based Questions

### Q47: How would you handle 10,000 concurrent users?
**Answer:**
1. **Database:** Upgrade MongoDB Atlas tier, implement sharding
2. **Caching:** Use Redis for frequently accessed data
3. **Load Balancing:** Distribute traffic across multiple servers
4. **CDN:** Cloudinary already handles media, add Cloudflare for static assets
5. **Optimization:** Implement pagination, lazy loading, code splitting
6. **Horizontal Scaling:** Deploy multiple backend instances
7. **Database Indexing:** Optimize queries with proper indexes
8. **Monitoring:** Set up performance monitoring and alerts

### Q48: How would you implement a payment system?
**Answer:**
1. **Choose Gateway:** Stripe/Razorpay integration
2. **Backend:**
   - Install SDK: `npm install stripe`
   - Create payment routes: `/api/payments/create-checkout`
   - Generate payment session with course details
   - Webhook for payment confirmation
   - Update user's enrolledCourses on success
3. **Frontend:**
   - "Buy Course" button instead of "Enroll"
   - Redirect to Stripe checkout
   - Handle success/cancel redirects
4. **Database:**
   - Add `isPaid` field to Course model
   - Create Payment model: user, course, amount, status

### Q49: How would you add real-time chat?
**Answer:**
1. **Technology:** Socket.io for WebSocket connection
2. **Backend:**
   - Install: `npm install socket.io`
   - Initialize: `io = new Server(server, { cors: {...} })`
   - Handle events: connection, message, disconnect
   - Emit messages to specific rooms (course-based)
3. **Frontend:**
   - Install: `npm install socket.io-client`
   - Connect to socket server
   - Listen for messages, emit on send
   - Display in chat UI component
4. **Database:**
   - Message model: sender, course, content, timestamp
   - Store history for persistence

### Q50: How would you implement video streaming?
**Answer:**
1. **HLS/DASH:** Convert videos to adaptive bitrate formats
2. **Cloudinary Streaming:** Use Cloudinary video streaming URLs
3. **Video.js Player:** Advanced player with quality selection
4. **DRM Protection:** Prevent unauthorized downloads
5. **Analytics:** Track watch time, completion rate
6. **Resume Playback:** Store last watched position
7. **Bandwidth Detection:** Adjust quality based on connection
8. **Buffering Optimization:** Preload upcoming segments

---

## Quick Fire Questions

**Q51: What is npm?**
Node Package Manager - manages project dependencies

**Q52: What is package.json?**
File containing project metadata, dependencies, scripts

**Q53: What is Git?**
Version control system for tracking code changes

**Q54: What is HTTPS?**
Secure HTTP protocol with SSL/TLS encryption

**Q55: What is JSON?**
JavaScript Object Notation - lightweight data interchange format

**Q56: What is API?**
Application Programming Interface - communication between software

**Q57: What is Status Code 404?**
Not Found - requested resource doesn't exist

**Q58: What is Status Code 500?**
Internal Server Error - something went wrong on server

**Q59: What is CRUD?**
Create, Read, Update, Delete - basic database operations

**Q60: What is Callback?**
Function passed as argument, executed after async operation

**Q61: What is Promise?**
Object representing eventual completion/failure of async operation

**Q62: What is Middleware?**
Function processing requests between client and controller

**Q63: What is Schema?**
Blueprint defining structure and constraints of data

**Q64: What is Cookie?**
Small data stored in browser, sent with requests

**Q65: What is Session?**
Server-side storage of user data across requests

**Q66: What is hashing?**
One-way conversion of data to fixed-length string

**Q67: What is encryption?**
Two-way conversion for secure data transmission

**Q68: What is CDN?**
Content Delivery Network - distributed servers for fast content delivery

**Q69: What is SPA?**
Single Page Application - loads once, updates dynamically

**Q70: What is Component?**
Reusable, self-contained piece of UI in React

---

## Project-Specific Deep Dive

### Q71: Walk me through the exam submission flow in detail.
**Answer:**
1. Learner clicks "Start Exam" on ExamList page
2. Navigate to `/start-exam/:examId`
3. StartExam component fetches exam details: GET `/api/exams/:examId`
4. Timer starts countdown from exam.duration minutes
5. Questions displayed one by one with 4 radio button options
6. User selects answers, stored in state: `{ questionId, selectedAnswer }`
7. On "Submit" button or timer expires:
   - Confirm dialog appears
   - POST to `/api/exams/submit/:examId` with answers array
8. **Backend Processing:**
   - Fetch exam with questions
   - Loop through user answers
   - Compare with `question.correctAnswer`
   - Calculate score: sum marks for correct answers
   - Determine pass/fail: score >= passingMarks
   - Create Result document with all details
   - Save to database
9. **Response:** Return score, totalMarks, passed, correct answers
10. Frontend displays result immediately
11. If passed and certification enabled, show "Download Certificate" button

### Q72: Explain the course enrollment to lesson viewing flow.
**Answer:**
1. **Enrollment:**
   - Learner on CourseDetails page, clicks "Enroll Now"
   - POST to `/api/users/enroll/:courseId`
   - Backend adds course ObjectId to user.enrolledCourses array
   - Response sent, frontend updates AuthContext
   - Button changes to "View Lessons"

2. **Viewing Lessons:**
   - Click "View Lessons"
   - Navigate to `/lesson-viewer/:courseId`
   - LessonViewer component fetches: GET `/api/lessons/:courseId`
   - Backend finds all lessons with matching course ID, populates course details
   - Lessons displayed in order with titles
   - Click on lesson loads video in VideoPlayer component
   - Video URL from Cloudinary loaded in HTML5 video element
   - Controls for play, pause, volume, fullscreen
   - Navigation buttons for next/previous lesson

### Q73: How does the admin auto-creation work?
**Answer:**
1. Server starts, connects to MongoDB
2. After successful connection, setTimeout waits 2 seconds
3. `createDefaultAdmin` function executed:
   - Check if user with email "admin@gmail.com" exists
   - If exists: Log "ℹ️ Admin account already exists"
   - If not exists:
     - Hash password "admin" with bcrypt
     - Create new User with: name="Admin", email="admin@gmail.com", password=hashed, role="admin"
     - Save to database
     - Log "✅ Default admin account created"
4. Admin can now login with these credentials
5. Public cannot register as admin (blocked in authController)
6. Ensures at least one admin account exists for system management

### Q74: Explain the file upload to Cloudinary process in detail.
**Answer:**
1. **Frontend:**
   - User selects file in input: `<input type="file" onChange={handleFileChange} />`
   - File stored in state: `const [file, setFile] = useState(null)`
   - On submit, FormData created:
     ```javascript
     const formData = new FormData();
     formData.append('title', title);
     formData.append('video', file);
     ```
   - POST request: `axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })`

2. **Backend - Multer Middleware:**
   - Request intercepted by multer: `upload.single('video')`
   - multer-storage-cloudinary configured:
     - cloudinary instance with API credentials
     - folder: 'lms-lessons'
     - allowed formats: ['jpg', 'png', 'mp4', 'avi']
     - resource_type: 'auto' (detects image/video)
   - File streamed directly to Cloudinary (not saved locally)
   - Cloudinary returns object with secure_url, public_id
   - Attached to req.file

3. **Backend - Controller:**
   - Extract file URL: `const videoUrl = req.file.path`
   - Save URL to database in Lesson/Course document
   - Return success response

4. **Deletion:**
   - Extract public_id from URL
   - Call cloudinary.uploader.destroy(public_id)
   - File removed from cloud storage

No files stored on server, all on Cloudinary CDN.

### Q75: How does the email service auto-detection work?
**Answer:**
```javascript
const EMAIL_METHOD = process.env.EMAIL_API_KEY ? 'api' : 'smtp';

async function sendEmail(to, subject, htmlContent) {
  if (EMAIL_METHOD === 'api') {
    return await sendViaAPI(to, subject, htmlContent);
  } else {
    return await sendViaSMTP(to, subject, htmlContent);
  }
}

async function sendViaAPI(to, subject, htmlContent) {
  const response = await axios.post('https://api.resend.com/emails', {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: subject,
    html: htmlContent
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
}

async function sendViaSMTP(to, subject, htmlContent) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: subject,
    html: htmlContent
  };
  
  return await transporter.sendMail(mailOptions);
}
```

If EMAIL_API_KEY exists in environment (Resend), use API method. Otherwise, fall back to Gmail SMTP. This provides reliability - if one fails, can switch to other.

---

**Total Questions: 75**
**Last Updated:** December 21, 2025

---

## Tips for Viva

1. **Be Confident:** Speak clearly about what you implemented
2. **Show Understanding:** Explain why you chose specific technologies
3. **Admit Unknowns:** If you don't know something, be honest
4. **Use Examples:** Reference specific parts of your code
5. **Discuss Challenges:** Talk about problems you solved
6. **Show Enthusiasm:** Express interest in learning more
7. **Know Your Code:** Be familiar with all files you wrote
8. **Prepare Demo:** Have a working demo ready
9. **Understand Flow:** Know how data flows through application
10. **Be Ready to Code:** They might ask you to write a function

**Good Luck! 🚀**
