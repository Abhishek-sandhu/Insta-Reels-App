const express = require('express');
const router = express.Router();

// Example public video URLs
const videoUrls = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://www.w3schools.com/html/movie.mp4',
  'https://filesamples.com/samples/video/mp4/sample_640x360.mp4',
  'https://filesamples.com/samples/video/mp4/sample_960x400.mp4',
  'https://www.w3schools.com/html/mov_bbb.ogg',
  // YouTube Shorts
  'https://www.youtube.com/embed/FBixhNjWZLk',
  'https://www.youtube.com/embed/xnf-kYqm8Fg',
  'https://www.youtube.com/embed/OE9_SxNed6E',
  'https://www.youtube.com/embed/a_TQiKxsjmw',
];

const captions = [
  'Epic waterfall in Iceland!',
  'Sunset over the ocean.',
  'Timelapse of busy city streets.',
  'Cute puppies playing in the park.',
  'Morning walk through the old city streets.',
  'Pour-over in slow motion. ☕',
  'Clouds rolling over the ridge.',
  'Motorbike ride through neon streets.',
  'Looping shots of traffic at blue hour.',
  'Color grading test on new footage.',
];

const hashtagsList = [
  ['waterfall', 'nature', 'travel'],
  ['sunset', 'ocean', 'relax'],
  ['city', 'timelapse', 'urban'],
  ['puppies', 'animals', 'cute'],
  ['morningwalk', 'streets', 'travel'],
  ['coffee', 'slowmo', 'aesthetic'],
  ['mountains', 'clouds', 'timelapse'],
  ['neon', 'ride', 'night'],
  ['loop', 'city', 'bluehour'],
  ['colorgrading', 'cinematic', 'bts'],
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const reels = [
  {
    id: 'r1',
    username: 'your_username',
    userInitials: 'YU',
    caption: 'My latest upload: Check this out!',
    hashtags: ['latest', 'upload', 'video'],
    likes: 0,
    comments: 0,
    shares: 0,
    timeAgo: 'Just now',
    audio: 'Original audio',
    videoUrl: 'https://www.youtube.com/embed/_X5ExbdTUbM',
  },
  {
    id: 'r2',
    username: 'your_username',
    userInitials: 'YU',
    caption: 'Second latest upload: Don’t miss it!',
    hashtags: ['latest', 'upload', 'video'],
    likes: 0,
    comments: 0,
    shares: 0,
    timeAgo: 'Just now',
    audio: 'Original audio',
    videoUrl: 'https://www.youtube.com/embed/QzFaXA9bLG0',
  },
  ...Array.from({ length: 118 }, (_, i) => ({
    id: `r${i + 3}`,
    username: `user${(i % 20) + 1}`,
    userInitials: `U${(i % 20) + 1}`,
    caption: getRandom(captions),
    hashtags: getRandom(hashtagsList),
    likes: Math.floor(Math.random() * 50000),
    comments: Math.floor(Math.random() * 1000),
    shares: Math.floor(Math.random() * 300),
    timeAgo: `${Math.floor(Math.random() * 30) + 1}d ago`,
    audio: `Audio track ${(i % 10) + 1}`,
    videoUrl: getRandom(videoUrls),
  })),
];

router.get('/', (req, res) => {
  res.json(reels);
});

module.exports = router;
