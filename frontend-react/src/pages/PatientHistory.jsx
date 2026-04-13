import React, { useState, useEffect } from "react";
import axios from "axios";

function PatientHistory() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/history");
      setPatients(response.data.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete patient record for ${name}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/patient/${id}`);
        fetchPatients();
      } catch (error) {
        alert("Failed to delete");
      }
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prediction?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getRiskClass = (risk) => {
    if (risk === "HIGH") return "badge-high-risk";
    if (risk === "MODERATE") return "badge-moderate-risk";
    return "badge-low-risk";
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1a1a2e" }}>
          Patient History
        </h1>
        <p style={{ color: "#5a5a6e", marginTop: "4px" }}>
          View and manage all patient diagnoses
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Search by patient name or diagnosis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "12px",
            border: "1px solid #e4e6eb",
            fontSize: "14px",
            outline: "none",
            transition: "all 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#0B2F9E")}
          onBlur={(e) => (e.target.style.borderColor = "#e4e6eb")}
        />
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center" }}>Loading...</div>
        ) : filteredPatients.length === 0 ? (
          <div
            style={{ padding: "60px", textAlign: "center", color: "#5a5a6e" }}
          >
            No patients found. Upload an image to get started.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Prediction</th>
                <th>Confidence</th>
                <th>Risk</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient._id}>
                  <td style={{ fontWeight: "500" }}>
                    {patient.patientName || "Unknown"}
                  </td>
                  <td>{patient.patientAge || "-"}</td>
                  <td>
                    <span
                      className={`badge ${
                        patient.prediction?.includes("polyps")
                          ? "badge-cancer"
                          : patient.prediction === "esophagitis"
                            ? "badge-esophagitis"
                            : "badge-normal"
                      }`}
                    >
                      {patient.prediction || "-"}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: "500" }}>
                      {patient.confidence?.toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${getRiskClass(patient.riskLevel)}`}
                    >
                      {patient.riskLevel || "LOW"}
                    </span>
                  </td>
                  <td style={{ color: "#5a5a6e" }}>
                    {new Date(patient.timestamp).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        handleDelete(patient._id, patient.patientName)
                      }
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "18px",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "#fee2e2")
                      }
                      onMouseLeave={(e) => (e.target.style.background = "none")}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary Stats */}
      {filteredPatients.length > 0 && (
        <div
          style={{
            marginTop: "16px",
            textAlign: "right",
            color: "#5a5a6e",
            fontSize: "13px",
          }}
        >
          Showing {filteredPatients.length} of {patients.length} records
        </div>
      )}
    </div>
  );
}

export default PatientHistory;
