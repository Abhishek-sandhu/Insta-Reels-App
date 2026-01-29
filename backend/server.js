const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const reelsRouter = require('./routes/reels');
const { router: authRouter } = require('./routes/auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Auth routes
app.use('/api/auth', authRouter);
// API routes
app.use('/api/reels', reelsRouter);
app.use('/api/posts', require('./routes/posts'));

// Serve frontend static files (if needed)
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
