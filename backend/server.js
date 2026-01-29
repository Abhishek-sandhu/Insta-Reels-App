const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const reelsRouter = require('./routes/reels');
const { router: authRouter } = require('./routes/auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/reels', reelsRouter);
app.use('/api/posts', require('./routes/posts'));

// Serve frontend static files
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// Catch-all handler: send back index.html for client-side routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
