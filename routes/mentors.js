const express = require("express");
const router = express.Router();
const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:258369@localhost:5432/mentor");
const multer = require("multer");
const path = require("path");

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Store uploaded images in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage });

// Insert mentor data with an image upload
router.post("/", upload.single("mentorImage"), async (req, res) => {
  try {
    const mentor = req.body; // Mentor data from the request body
    const image_url = req.file ? `uploads/${req.file.filename}` : ""; // Image URL from multer
    const query = "INSERT INTO mentors(id, image_url, name, rating, role, course, experience) VALUES($1, $2, $3, $4, $5, $6, $7)";

    await db.none(query, [
      mentor.id,
      image_url,
      mentor.name,
      mentor.rating,
      mentor.role,
      mentor.course,
      mentor.experience,
    ]);
    res.status(201).json({ message: "Mentor added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Retrieve all mentors' data as an array of objects
router.get("/", async (req, res) => {
  try {
    const mentors = await db.any("SELECT * FROM mentors");
    res.json(mentors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
