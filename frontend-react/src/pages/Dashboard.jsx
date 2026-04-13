import React, { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    avgConfidence: 0,
    highRiskCount: 0,
    cancerCount: 0,
  });
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/history");
      const data = response.data.data || [];

      const cancerCount = data.filter(
        (p) =>
          p.prediction?.includes("polyps") ||
          p.prediction === "dyed-lifted-polyps",
      ).length;

      const highRiskCount = data.filter((p) => p.riskLevel === "HIGH").length;
      const avgConfidence = data.length
        ? data.reduce((sum, p) => sum + (p.confidence || 0), 0) / data.length
        : 0;

      setStats({
        totalPatients: data.length,
        avgConfidence: avgConfidence.toFixed(1),
        highRiskCount,
        cancerCount,
      });
      setRecentScans(data.slice(0, 5));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Patients",
      value: stats.totalPatients,
      icon: "👥",
      color: "#0B2F9E",
    },
    {
      label: "Avg Confidence",
      value: `${stats.avgConfidence}%`,
      icon: "🎯",
      color: "#16a34a",
    },
    {
      label: "High Risk Cases",
      value: stats.highRiskCount,
      icon: "⚠️",
      color: "#dc2626",
    },
    {
      label: "Cancer Detected",
      value: stats.cancerCount,
      icon: "🔬",
      color: "#ea580c",
    },
  ];

  const agents = [
    {
      name: "Input Processor",
      status: "Active",
      icon: "📷",
      desc: "Image validation & preprocessing",
    },
    {
      name: "NBI Transformer",
      status: "Active",
      icon: "🎨",
      desc: "Narrow Band Imaging simulation",
    },
    {
      name: "EfficientNet-B5",
      status: "Active",
      icon: "🧠",
      desc: "Feature extraction & classification",
    },
    {
      name: "MC Dropout",
      status: "Active",
      icon: "🎲",
      desc: "Uncertainty quantification (20 passes)",
    },
    {
      name: "Risk Scorer",
      status: "Active",
      icon: "⚠️",
      desc: "Patient risk assessment",
    },
    {
      name: "Decision Router",
      status: "Active",
      icon: "🔄",
      desc: "Clinical decision routing",
    },
  ];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1a1a2e" }}>
          Clinical Dashboard
        </h1>
        <p style={{ color: "#5a5a6e", marginTop: "4px" }}>
          Welcome to VIGIL-GI Clinical AI Framework
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="card"
            style={{ textAlign: "center", padding: "20px" }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>
              {stat.icon}
            </div>
            <div
              style={{ fontSize: "28px", fontWeight: "700", color: stat.color }}
            >
              {stat.value}
            </div>
            <div
              style={{ fontSize: "13px", color: "#5a5a6e", marginTop: "4px" }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Agent Pipeline */}
      <div className="card" style={{ marginBottom: "32px" }}>
        <h3 style={{ marginBottom: "20px", fontSize: "18px" }}>
          AI Agent Pipeline
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          {agents.map((agent, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                background: "#f8f9fa",
                borderRadius: "12px",
              }}
            >
              <div style={{ fontSize: "24px" }}>{agent.icon}</div>
              <div>
                <div style={{ fontWeight: "600", fontSize: "14px" }}>
                  {agent.name}
                </div>
                <div style={{ fontSize: "11px", color: "#5a5a6e" }}>
                  {agent.desc}
                </div>
                <span style={{ fontSize: "10px", color: "#16a34a" }}>
                  ● {agent.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Scans */}
      <div className="card">
        <h3 style={{ marginBottom: "20px", fontSize: "18px" }}>Recent Scans</h3>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : recentScans.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "40px", color: "#5a5a6e" }}
          >
            No scans yet. Upload an image to get started.
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Prediction</th>
                  <th>Confidence</th>
                  <th>Risk</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentScans.map((scan) => (
                  <tr key={scan._id}>
                    <td>{scan.patientName || "Unknown"}</td>
                    <td>{scan.prediction}</td>
                    <td>{scan.confidence?.toFixed(1)}%</td>
                    <td>
                      <span className={`badge ${getRiskClass(scan.riskLevel)}`}>
                        {scan.riskLevel}
                      </span>
                    </td>
                    <td>{new Date(scan.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function getRiskClass(risk) {
  if (risk === "HIGH") return "badge-high-risk";
  if (risk === "MODERATE") return "badge-moderate-risk";
  return "badge-low-risk";
}

export default Dashboard;
