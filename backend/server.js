// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!', timestamp: new Date() });
});

// Future routes for levels, users, and scores can be added here
// app.use('/api/levels', require('./routes/levels'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
