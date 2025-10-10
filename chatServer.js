const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/chatdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

const MessageSchema = new mongoose.Schema({
  name: String,
  text: String,
  time: { type: Date, default: Date.now }
});
const Message = mongoose.model("Message", MessageSchema);


app.get("/api/messages", async (req, res) => {
  const messages = await Message.find().sort({ time: 1 }).limit(100);
  res.json(messages);
});


io.on("connection", async (socket) => {
  console.log("User connected");

  const oldMessages = await Message.find().sort({ time: 1 }).limit(100);
  socket.emit("history", oldMessages);

  socket.on("chat message", async (msg) => {
    const newMsg = new Message(msg);
    await newMsg.save();
    io.emit("chat message", newMsg); 
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
