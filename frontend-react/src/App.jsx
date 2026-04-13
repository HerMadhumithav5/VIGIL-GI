import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import PatientUpload from "./pages/PatientUpload";
import Results from "./pages/Results";
import AIResults from "./pages/AIResults";
import PatientHistory from "./pages/PatientHistory";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<PatientUpload />} />
            <Route path="/results" element={<Results />} />
            <Route path="/ai-results" element={<AIResults />} />
            <Route path="/history" element={<PatientHistory />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
