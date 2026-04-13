const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ MONGODB CONNECTION ============
const MONGODB_URI = "mongodb://localhost:27017/vigil-gi";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ============ MONGODB SCHEMA ============
const PatientSchema = new mongoose.Schema({
  patientName: { type: String, default: "Unknown" },
  patientAge: { type: Number, default: 0 },
  patientGender: { type: String, default: "unknown" },
  region: { type: String, default: "unknown" },
  prediction: { type: String, default: "unknown" },
  confidence: { type: Number, default: 0 },
  riskLevel: { type: String, default: "LOW" },
  action: { type: String, default: "REVIEW" },
  urgency: { type: String, default: "SCHEDULED" },
  message: { type: String, default: "" },
  nextSteps: { type: [String], default: [] },
  outputCase: { type: String, default: "UNKNOWN" },
  timestamp: { type: Date, default: Date.now },
});

const Patient = mongoose.model("Patient", PatientSchema);

// ============ MULTER SETUP ============
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// ============ API ENDPOINTS ============

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Node.js Backend",
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Get all history
app.get("/api/history", async (req, res) => {
  try {
    const patients = await Patient.find().sort({ timestamp: -1 });
    res.json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete patient
app.delete("/api/patient/:id", async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Main prediction endpoint
app.post("/api/predict", upload.single("image"), async (req, res) => {
  let imageFile = req.file;

  try {
    const { age, gender, region, name } = req.body;

    if (!imageFile) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Forward to Python backend
    const formData = new FormData();
    formData.append("file", fs.createReadStream(imageFile.path));
    formData.append("age", age || "50");
    formData.append("gender", gender || "unknown");
    formData.append("region", region || "unknown");
    formData.append("name", name || "Unknown");

    const pythonResponse = await axios.post(
      "http://localhost:8000/api/predict",
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 60000,
      },
    );

    const summary = pythonResponse.data.pipeline_result?.summary || {};
    const agent6 =
      pythonResponse.data.pipeline_result?.agents?.agent6?.output || {};

    // Save to MongoDB
    const newPatient = new Patient({
      patientName: name || "Unknown",
      patientAge: parseInt(age) || 0,
      patientGender: gender || "unknown",
      region: region || "unknown",
      prediction: summary.prediction || "unknown",
      confidence: summary.confidence || 0,
      riskLevel: summary.risk_level || "LOW",
      action: agent6.action || "REVIEW",
      urgency: agent6.urgency || "SCHEDULED",
      message: agent6.message || "",
      nextSteps: agent6.next_steps || [],
      outputCase: agent6.case || "UNKNOWN",
    });

    await newPatient.save();
    console.log("✅ Patient saved to MongoDB");

    // Clean up uploaded file
    if (imageFile && fs.existsSync(imageFile.path)) {
      fs.unlinkSync(imageFile.path);
    }

    res.json({
      success: true,
      data: pythonResponse.data,
      scanId: newPatient._id,
      message: "Prediction completed and saved",
    });
  } catch (error) {
    console.error("Error:", error.message);

    if (imageFile && fs.existsSync(imageFile.path)) {
      try {
        fs.unlinkSync(imageFile.path);
      } catch (e) {}
    }

    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Node.js backend running on http://localhost:${PORT}`);
});
