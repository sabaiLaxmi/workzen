const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/timesheets', require('./routes/timesheetRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/approvals', require('./routes/approvalRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Workzen API is running' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
