// analytics-service/src/index.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const viewSchema = new mongoose.Schema({
  postId: mongoose.Schema.Types.ObjectId,
  timestamp: { type: Date, default: Date.now }
});

const View = mongoose.model('View', viewSchema);

app.post('/posts/:postId/view', async (req, res) => {
  try {
    const view = new View({ postId: req.params.postId });
    await view.save();
    res.status(201).json({ message: 'View recorded' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/posts/:postId/views', async (req, res) => {
  try {
    const views = await View.countDocuments({ postId: req.params.postId });
    res.json({ views });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

mongoose.connect('mongodb+srv://2023sl93085:0tKe6jT35kDBtZT1@cluster0.rn0hc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
app.listen(3003, () => console.log('Analytics service running on port 3003'));