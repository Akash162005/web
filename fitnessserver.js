
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/fitdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' MongoDB connected to fitdb'))
.catch(err => console.error(' MongoDB error:', err));

const WorkoutSchema = new mongoose.Schema({
  activity: { type: String, required: true },
  duration: { type: Number, required: true }, 
  calories: { type: Number },
  date: { type: Date, default: Date.now },
  notes: { type: String }
});

const Workout = mongoose.model('Workout', WorkoutSchema);

app.post('/api/workouts', async (req, res) => {
  try {
    const workout = new Workout(req.body);
    const saved = await workout.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/workouts', async (req, res) => {
  try {
    const data = await Workout.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/workouts/:id', async (req, res) => {
  try {
    const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/workouts/:id', async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => res.send('Fitness Tracker API Running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
