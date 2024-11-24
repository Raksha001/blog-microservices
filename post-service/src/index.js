// post-service/src/index.js
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  authorId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, 'your_jwt_secret');
    req.userId = verified.userId;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

app.post('/posts', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      authorId: req.userId
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

mongoose.connect('mongodb+srv://2023sl93085:0tKe6jT35kDBtZT1@cluster0.rn0hc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
app.listen(3001, () => console.log('Post service running on port 3001'));