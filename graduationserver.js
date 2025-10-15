const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/graduationDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const StudentSchema = new mongoose.Schema({
  name: String,
  regNo: String,
  department: String,
  gradYear: Number,
  status: { type: String, enum: ["Graduated", "In Progress"], default: "In Progress" },
});

const Student = mongoose.model("Student", StudentSchema);

app.get("/api/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.post("/api/students", async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.json(student);
});

app.put("/api/students/:id", async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete("/api/students/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Start server
app.listen(3000, () => console.log("✅ Server running at http://localhost:3000"));
