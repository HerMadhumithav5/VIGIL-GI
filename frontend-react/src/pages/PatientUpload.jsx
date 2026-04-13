import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PatientUpload() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "male",
    region: "stomach",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !form.name || !form.age) {
      alert("Please fill all fields and select an image");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("image", image);
    data.append("name", form.name);
    data.append("age", form.age);
    data.append("gender", form.gender);
    data.append("region", form.region);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/predict",
        data,
      );
      navigate("/results", { state: response.data });
    } catch (error) {
      alert("Prediction failed. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1a1a2e" }}>
          New Patient Scan
        </h1>
        <p style={{ color: "#5a5a6e", marginTop: "4px" }}>
          Upload endoscopic image for AI analysis
        </p>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}
      >
        {/* Upload Form */}
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                Endoscopic Image
              </label>
              <div
                onClick={() => document.getElementById("imageInput").click()}
                style={{
                  border: "2px dashed #e4e6eb",
                  borderRadius: "12px",
                  padding: "40px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: "#fafbfc",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#0B2F9E")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#e4e6eb")
                }
              >
                <div style={{ fontSize: "48px", marginBottom: "8px" }}>📷</div>
                <p>Click to upload or drag & drop</p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#5a5a6e",
                    marginTop: "4px",
                  }}
                >
                  PNG, JPG, JPEG (max 20MB)
                </p>
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    marginTop: "16px",
                    borderRadius: "8px",
                  }}
                />
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  Patient Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  Age
                </label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  Gender
                </label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  style={inputStyle}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  GI Region
                </label>
                <select
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  style={inputStyle}
                >
                  <option value="stomach">Stomach</option>
                  <option value="esophagus">Esophagus</option>
                  <option value="colon">Colon</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%" }}
            >
              {loading ? "Processing..." : "Analyze Image"}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #0B2F9E 0%, #0EA5E9 100%)",
            color: "white",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "40px", marginBottom: "8px" }}>🩺</div>
            <h3 style={{ marginBottom: "8px" }}>About VIGIL-GI</h3>
            <p style={{ opacity: 0.9, fontSize: "14px", lineHeight: "1.5" }}>
              Our AI analyzes endoscopic images using 6 autonomous agents,
              providing confidence scores and clinical recommendations.
            </p>
          </div>
          <hr
            style={{ borderColor: "rgba(255,255,255,0.2)", margin: "16px 0" }}
          />
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <span>✅</span>
              <span>Uncertainty quantification</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <span>✅</span>
              <span>Patient risk scoring</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span>✅</span>
              <span>Clinical decision routing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #e4e6eb",
  fontSize: "14px",
  outline: "none",
  transition: "all 0.2s",
};

export default PatientUpload;
