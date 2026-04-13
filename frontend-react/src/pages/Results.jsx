import React from "react";
import { useLocation } from "react-router-dom";
import PDFDownloadButton from "../components/PDFDownloadButton";

function Results() {
  const { state } = useLocation();

  // Debug logging
  console.log("Full state received:", state);

  // Extract data from different possible response structures
  const result = state?.data?.pipeline_result || state?.pipeline_result;
  const pdfBase64 = state?.data?.pdf_base64 || state?.pdf_base64;
  const summary = result?.summary;
  const decision = result?.agents?.agent6?.output;

  console.log("PDF Base64 present:", pdfBase64 ? "Yes" : "No");
  console.log("Result:", result);
  console.log("Decision:", decision);

  if (!result) {
    return (
      <div className="fade-in">
        <div className="card" style={{ textAlign: "center", padding: "60px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <h2>No Results Found</h2>
          <p style={{ color: "#5a5a6e", marginTop: "8px" }}>
            Please upload an image first.
          </p>
          <a
            href="/upload"
            className="btn-primary"
            style={{ display: "inline-block", marginTop: "24px" }}
          >
            Go to Upload
          </a>
        </div>
      </div>
    );
  }

  const getCaseConfig = () => {
    switch (decision?.case) {
      case "CANCER_DETECTED":
        return {
          icon: "🔴",
          title: "Cancer Detected",
          subtitle: "Immediate Clinical Action Required",
          bgGradient: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
          borderColor: "#dc2626",
          textColor: "#991b1b",
        };
      case "ESOPHAGITIS":
        return {
          icon: "🟡",
          title: "Esophagitis Detected",
          subtitle: "Treatment Required (Not Cancer)",
          bgGradient: "linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)",
          borderColor: "#f97316",
          textColor: "#9a3412",
        };
      case "NO_CANCER":
        return {
          icon: "🟢",
          title: "No Cancer Detected",
          subtitle: "Positive Result - Routine Follow-up",
          bgGradient: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
          borderColor: "#16a34a",
          textColor: "#14532d",
        };
      case "POST_RESECTION":
        return {
          icon: "🔵",
          title: "Post-Resection",
          subtitle: "Follow-up Surveillance Required",
          bgGradient: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
          borderColor: "#2563eb",
          textColor: "#1e3a8a",
        };
      case "AI_UNCERTAIN":
        return {
          icon: "⚠️",
          title: "Uncertain Result",
          subtitle: "Specialist Review Required",
          bgGradient: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
          borderColor: "#d97706",
          textColor: "#78350f",
        };
      default:
        return {
          icon: "ℹ️",
          title: "Analysis Complete",
          subtitle: "Review Results",
          bgGradient: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
          borderColor: "#4f46e5",
          textColor: "#3730a3",
        };
    }
  };

  const caseConfig = getCaseConfig();
  const confidence = summary?.confidence || 0;
  const confidenceClass =
    confidence >= 85
      ? "confidence-high"
      : confidence >= 60
        ? "confidence-medium"
        : "confidence-low";

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1a1a2e" }}>
          Analysis Results
        </h1>
        <p style={{ color: "#5a5a6e", marginTop: "4px" }}>
          AI-powered clinical assessment report
        </p>
      </div>

      {/* Case Banner */}
      <div
        style={{
          background: caseConfig.bgGradient,
          borderLeft: `4px solid ${caseConfig.borderColor}`,
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontSize: "32px" }}>{caseConfig.icon}</span>
          <div>
            <h2 style={{ color: caseConfig.textColor, margin: 0 }}>
              {caseConfig.title}
            </h2>
            <p style={{ color: caseConfig.textColor, opacity: 0.8, margin: 0 }}>
              {caseConfig.subtitle}
            </p>
          </div>
        </div>
        <p style={{ color: caseConfig.textColor, marginTop: "12px" }}>
          {decision?.message}
        </p>
      </div>

      {/* Two Column Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        {/* Left Column - Prediction Summary */}
        <div className="card">
          <h3 style={{ marginBottom: "20px", fontSize: "18px" }}>
            Prediction Summary
          </h3>

          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "#5a5a6e" }}>Finding</span>
              <span
                style={{ fontWeight: "600", color: caseConfig.borderColor }}
              >
                {summary?.prediction}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "#5a5a6e" }}>Confidence</span>
              <span style={{ fontWeight: "600" }}>
                {confidence.toFixed(1)}%
              </span>
            </div>

            <div className="confidence-gauge" style={{ marginTop: "8px" }}>
              <div
                className={`confidence-fill ${confidenceClass}`}
                style={{ width: `${confidence}%` }}
              ></div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "16px",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "#5a5a6e" }}>Risk Level</span>
              <span
                className={`badge ${
                  summary?.risk_level === "HIGH"
                    ? "badge-high-risk"
                    : summary?.risk_level === "MODERATE"
                      ? "badge-moderate-risk"
                      : "badge-low-risk"
                }`}
              >
                {summary?.risk_level}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#5a5a6e" }}>Action Required</span>
              <span style={{ fontWeight: "600" }}>{decision?.action}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Next Steps */}
        <div className="card">
          <h3 style={{ marginBottom: "20px", fontSize: "18px" }}>Next Steps</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {decision?.next_steps?.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    background: "#eef2f6",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#0B2F9E",
                  }}
                >
                  {idx + 1}
                </div>
                <p style={{ flex: 1, margin: 0, lineHeight: "1.5" }}>{step}</p>
              </div>
            ))}
            {(!decision?.next_steps || decision.next_steps.length === 0) && (
              <p style={{ color: "#5a5a6e" }}>
                No specific next steps identified.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Clinical Recommendation */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "16px", fontSize: "18px" }}>
          Clinical Recommendation
        </h3>
        <p style={{ color: "#2c2c3a", lineHeight: "1.6" }}>
          {decision?.recommendation ||
            decision?.message ||
            "Based on the AI analysis, please follow the recommended next steps above."}
        </p>
      </div>

      {/* PDF Download Button */}
      <PDFDownloadButton pdfBase64={pdfBase64} outputCase={decision?.case} />
    </div>
  );
}

export default Results;
