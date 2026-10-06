const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Student = require("./models/Student");

const app = express();


// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());


// =========================
// MONGODB CONNECTION
// =========================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error);
  });


// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.send("Student CRUD API is running");
});


// =========================
// CREATE STUDENT
// POST /api/students
// =========================

app.post("/api/students", async (req, res) => {
  try {
    const student = new Student({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      course: req.body.course
    });

    const savedStudent = await student.save();

    res.status(201).json(savedStudent);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
});


// =========================
// READ STUDENTS
// GET /api/students
// =========================

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find().sort({
      createdAt: -1
    });

    res.json(students);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
});


// =========================
// UPDATE STUDENT
// PUT /api/students/:id
// =========================

app.put("/api/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        course: req.body.course
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json(updatedStudent);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
});


// =========================
// DELETE STUDENT
// DELETE /api/students/:id
// =========================

app.delete("/api/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(
      req.params.id
    );

    if (!deletedStudent) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json({
      message: "Student deleted successfully"
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
});


// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});