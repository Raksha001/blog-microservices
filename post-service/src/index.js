const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*',
}));
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

// Create post
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

// Get all posts with pagination
app.get('/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    console.log(req);
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();
    const totalPages = Math.ceil(total / limit);
    

    res.json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts: total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get post by ID
app.get('/posts/:id', async (req, res) => {
  try {
    console.log(req.params)
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid post ID format' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update post
app.put('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user is the author of the post
    if (post.authorId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid post ID format' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete post
app.delete('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user is the author of the post
    if (post.authorId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid post ID format' });
    }
    res.status(500).json({ error: error.message });
  }
});

mongoose.connect('mongodb+srv://2023sl93085:0tKe6jT35kDBtZT1@cluster0.rn0hc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
app.listen(3003, () => console.log('Post service running on port 3003'));