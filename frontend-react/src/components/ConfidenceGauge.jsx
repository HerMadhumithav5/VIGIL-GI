import React from "react";

function ConfidenceGauge({ confidence }) {
  const getColor = () => {
    if (confidence >= 85) return "#4caf50";
    if (confidence >= 60) return "#ff9800";
    return "#f44336";
  };

  const getLabel = () => {
    if (confidence >= 85) return "HIGH";
    if (confidence >= 60) return "MEDIUM";
    return "LOW";
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "5px",
        }}
      >
        <span>Confidence Score</span>
        <span style={{ color: getColor(), fontWeight: "bold" }}>
          {getLabel()}
        </span>
      </div>
      <div
        style={{
          background: "#e0e0e0",
          borderRadius: "25px",
          height: "30px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${confidence}%`,
            background: getColor(),
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: "10px",
            color: "white",
            fontWeight: "bold",
            transition: "width 0.5s ease",
          }}
        >
          {confidence.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}

export default ConfidenceGauge;
