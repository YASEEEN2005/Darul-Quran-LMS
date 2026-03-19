const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('./config/passport'); // Initialize passport strategy

// Route imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const courseRoutes = require('./routes/course.routes');
const lessonRoutes = require('./routes/lesson.routes');
const examRoutes = require('./routes/exam.routes');
const progressRoutes = require('./routes/progress.routes');
const meetingRoutes = require('./routes/meeting.routes');

// Middleware imports
const { errorHandler, notFound } = require('./middlewares/error.middleware');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Initialize passport
app.use(passport.initialize());

// API Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);
app.use('/lessons', lessonRoutes);
app.use('/exams', examRoutes);
app.use('/progress', progressRoutes);
app.use('/meetings', meetingRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('LMS API API is running...');
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
