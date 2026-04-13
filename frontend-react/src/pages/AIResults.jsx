import React from "react";

function AIResults() {
  const metrics = [
    {
      label: "Validation Accuracy",
      value: "93.9%",
      change: "+2.3%",
      color: "#16a34a",
    },
    { label: "Sensitivity", value: "92.1%", change: "+1.8%", color: "#0B2F9E" },
    { label: "Specificity", value: "94.2%", change: "+1.5%", color: "#ea580c" },
    { label: "AUC Score", value: "0.962", change: "+0.02", color: "#7c3aed" },
  ];

  const confidenceDist = [
    {
      level: "HIGH (>85%)",
      percentage: 72,
      color: "#16a34a",
      desc: "Direct treatment",
    },
    {
      level: "MEDIUM (60-85%)",
      percentage: 20,
      color: "#f97316",
      desc: "Further review",
    },
    {
      level: "LOW (<60%)",
      percentage: 8,
      color: "#dc2626",
      desc: "Escalate to specialist",
    },
  ];

  const classPerformance = [
    { class: "Polyps", precision: "94.2%", recall: "93.1%", f1: "93.6%" },
    { class: "Esophagitis", precision: "95.1%", recall: "94.3%", f1: "94.7%" },
    { class: "Normal Cecum", precision: "93.5%", recall: "94.2%", f1: "93.8%" },
  ];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1a1a2e" }}>
          AI Model Performance
        </h1>
        <p style={{ color: "#5a5a6e", marginTop: "4px" }}>
          EfficientNet-B5 trained on Kvasir dataset (5,000 images)
        </p>
      </div>

      {/* Metrics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {metrics.map((m, i) => (
          <div key={i} className="card" style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "28px", fontWeight: "700", color: m.color }}
            >
              {m.value}
            </div>
            <div style={{ fontSize: "13px", marginTop: "4px" }}>{m.label}</div>
            <span style={{ fontSize: "11px", color: "#16a34a" }}>
              ↑ {m.change}
            </span>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {/* Confidence Distribution */}
        <div className="card">
          <h3 style={{ marginBottom: "20px", fontSize: "18px" }}>
            Confidence Distribution
          </h3>
          {confidenceDist.map((item, i) => (
            <div key={i} style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <span>{item.level}</span>
                <span style={{ fontWeight: "600" }}>{item.percentage}%</span>
              </div>
              <div
                style={{
                  background: "#eef2f6",
                  borderRadius: "10px",
                  height: "8px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${item.percentage}%`,
                    background: item.color,
                    height: "100%",
                  }}
                ></div>
              </div>
              <p
                style={{ fontSize: "11px", color: "#5a5a6e", marginTop: "4px" }}
              >
                {item.desc}
              </p>
            </div>
          ))}
          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              background: "#fef3c7",
              borderRadius: "8px",
            }}
          >
            <p style={{ fontSize: "12px", color: "#78350f" }}>
              🔍 Key Insight: 8% low-confidence cases flagged for specialist
              review — clinical safety net
            </p>
          </div>
        </div>

        {/* Class Performance */}
        <div className="card">
          <h3 style={{ marginBottom: "20px", fontSize: "18px" }}>
            Class-wise Performance
          </h3>
          <div className="table-container">
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Precision</th>
                  <th>Recall</th>
                  <th>F1-Score</th>
                </tr>
              </thead>
              <tbody>
                {classPerformance.map((c, i) => (
                  <tr key={i}>
                    <td>{c.class}</td>
                    <td>{c.precision}</td>
                    <td>{c.recall}</td>
                    <td>{c.f1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Training Progress */}
      <div className="card">
        <h3 style={{ marginBottom: "16px", fontSize: "18px" }}>
          Training Progress
        </h3>
        <div
          style={{
            background: "#f0f2f5",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <p>Model trained for 10 epochs on Kvasir dataset</p>
          <p style={{ fontSize: "13px", color: "#5a5a6e", marginTop: "4px" }}>
            Validation accuracy: 85% → 93.9%
          </p>
          <div
            style={{
              marginTop: "16px",
              background: "#eef2f6",
              borderRadius: "10px",
              height: "8px",
            }}
          >
            <div
              style={{
                width: "93.9%",
                background: "#0B2F9E",
                height: "100%",
                borderRadius: "10px",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIResults;
