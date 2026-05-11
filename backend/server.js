// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB Connection
// Set a fallback to a local MongoDB for development
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/git_game';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!', timestamp: new Date() });
});

// Middleware
const authMiddleware = require('./middleware/auth');

// Controllers
const progressController = require('./controllers/progressController');
const levelController = require('./controllers/levelController');

// API Routes
app.get('/api/user/progress', authMiddleware, progressController.getProgress);
app.post('/api/user/progress', authMiddleware, progressController.updateProgress);
app.put('/api/user/settings', authMiddleware, progressController.updateSettings);

app.get('/api/levels', authMiddleware, levelController.getLevels);
app.get('/api/levels/:levelId', authMiddleware, levelController.getLevelById);
app.post('/api/levels/:levelId/validate', authMiddleware, levelController.validateCommand);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
