const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

mongoose.connect('mongodb://127.0.0.1:27017/chatdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const messageSchema = new mongoose.Schema({
  name: String,
  text: String,
  time: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ time: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).send(err);
  }
});

io.on('connection', socket => {
  console.log('New user connected');

  Message.find().sort({ time: 1 }).then(msgs => {
    socket.emit('history', msgs);
  });
  socket.on('chat message', async msg => {
    const newMessage = new Message(msg);
    await newMessage.save();
    io.emit('chat message', newMessage); // broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
