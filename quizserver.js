const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/quizdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));


const answerSchema = new mongoose.Schema({
  question: String,
  userAnswer: String,
  correctAnswer: String
});

const quizSchema = new mongoose.Schema({
  name: String,
  score: Number,
  answers: [answerSchema],
  submittedAt: { type: Date, default: Date.now }
});

const Quiz = mongoose.model('Quiz', quizSchema);

app.post('/submit', async (req, res) => {
  try {
    const quizData = new Quiz(req.body);
    await quizData.save();
    res.status(200).json({ message: 'Quiz submitted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/submissions', async (req, res) => {
  try {
    const submissions = await Quiz.find().sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
