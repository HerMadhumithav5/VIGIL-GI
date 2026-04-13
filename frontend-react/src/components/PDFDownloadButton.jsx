import React from "react";

function PDFDownloadButton({ pdfBase64, outputCase }) {
  const handleDownload = () => {
    console.log(
      "Download clicked, pdfBase64:",
      pdfBase64 ? "Present" : "Missing",
    );

    if (!pdfBase64) {
      alert("PDF report not available. Please ensure backend is running.");
      return;
    }

    try {
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `VIGIL-GI_Report_${new Date().toISOString().slice(0, 19)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log("PDF download started");
    } catch (error) {
      console.error("Download error:", error);
      alert("Error generating PDF. Check console for details.");
    }
  };

  const getButtonColor = () => {
    if (outputCase === "CANCER_DETECTED") return "#dc3545";
    if (outputCase === "NO_CANCER") return "#28a745";
    if (outputCase === "ESOPHAGITIS") return "#f97316";
    return "#0B2F9E";
  };

  return (
    <button
      onClick={handleDownload}
      style={{
        width: "100%",
        padding: "12px 24px",
        background: getButtonColor(),
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "20px",
        transition: "all 0.2s",
      }}
    >
      📄 Download Clinical Report (PDF)
    </button>
  );
}

export default PDFDownloadButton;
