require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set in .env');
  process.exit(1);
}

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
