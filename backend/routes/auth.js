const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret'; // Change to env var in production

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name = '', bio = '', avatarUrl = '' } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields required.' });
    }
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(400).json({ message: 'User already exists.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed, name, bio, avatarUrl });
    res.status(201).json({ message: 'User registered.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'All fields required.' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({
      token,
      user: {
        username: user.username,
        email: user.email,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username email name bio avatarUrl');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({
      username: user.username,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update current user profile
router.patch('/me', auth, async (req, res) => {
  try {
    const { name, bio, avatarUrl } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, select: 'username email name bio avatarUrl' }
    );
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({
      username: user.username,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Auth middleware
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token.' });
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token.' });
  }
}

module.exports = { router, auth };
