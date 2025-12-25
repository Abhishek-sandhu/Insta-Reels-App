// Script to remove posts with missing media files from MongoDB
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Post = require('./models/Post');

mongoose.connect('mongodb://localhost:27017/insta_reels');

async function cleanPosts() {
  const posts = await Post.find();
  let removed = 0;
  for (const p of posts) {
    if (p.mediaUrl && p.mediaUrl.startsWith('/uploads/')) {
      const file = path.join(__dirname, 'uploads', path.basename(p.mediaUrl));
      if (!fs.existsSync(file)) {
        console.log('Removing post with missing file:', p.mediaUrl);
        await Post.deleteOne({ _id: p._id });
        removed++;
      }
    }
  }
  console.log(`Cleanup complete. Removed ${removed} posts.`);
  mongoose.disconnect();
}

cleanPosts();
