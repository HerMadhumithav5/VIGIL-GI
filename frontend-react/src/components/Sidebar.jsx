import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const navItems = [
    { path: "/", name: "Dashboard", icon: "📊" },
    { path: "/upload", name: "New Scan", icon: "📤" },
    { path: "/results", name: "Results", icon: "📈" },
    { path: "/ai-results", name: "AI Performance", icon: "🧠" },
    { path: "/history", name: "Patient History", icon: "📋" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🩺</span>
          <span className="logo-text">VIGIL-GI</span>
        </div>
        <p className="logo-subtitle">Clinical AI Framework</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-version">v1.0.0</div>
        <div className="sidebar-status">
          <span className="status-dot"></span>
          System Online
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
