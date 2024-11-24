// comment-service/src/index.js
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const commentSchema = new mongoose.Schema({
  content: String,
  postId: mongoose.Schema.Types.ObjectId,
  authorId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

app.post('/posts/:postId/comments', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const comment = new Comment({
      content,
      postId: req.params.postId,
      authorId: req.userId
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/posts/:postId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

mongoose.connect('mongodb+srv://2023sl93085:0tKe6jT35kDBtZT1@cluster0.rn0hc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
app.listen(3002, () => console.log('Comment service running on port 3002'));
