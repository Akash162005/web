const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/quizdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(' MongoDB connection error:', err));

const resultSchema = new mongoose.Schema({
  name: String,
  answers: Array,
  score: Number,
  date: { type: Date, default: Date.now }
});
const Result = mongoose.model('Result', resultSchema);


app.post('/submit', async (req, res) => {
  try {
    const { name, answers, score } = req.body;
    const newResult = new Result({ name, answers, score });
    await newResult.save();
    res.json({ message: 'Result saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving result', error });
  }
});

app.get('/results', async (req, res) => {
  try {
    const results = await Result.find();
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching results', error });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
