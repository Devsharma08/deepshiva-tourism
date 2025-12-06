import React from "react";

const BentoStats = ({ stats }) => {
  return (
    <div style={styles.grid}>
      <Card label="Yearly Visitors" value={stats?.visitors} icon="✈️" color="#e3f2fd" />
      <Card label="Rating" value={stats?.rating} icon="⭐" color="#fff3e0" />
      <Card label="Best Season" value={stats?.bestTime} icon="📅" color="#e8f5e9" />
      <Card label="Avg Temp" value={stats?.avgTemp} icon="🌡️" color="#fce4ec" />
    </div>
  );
};

const Card = ({ label, value, icon, color }) => (
  <div style={{ ...styles.card, background: color }}>
    <span style={styles.icon}>{icon}</span>
    <h3 style={styles.value}>{value}</h3>
    <p style={styles.label}>{label}</p>
  </div>
);

const styles = {
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "20px", padding: "40px 10%", marginTop: "-50px", position: "relative", zIndex: 20 },
  card: { padding: "20px", borderRadius: "20px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", transition: "transform 0.2s" },
  icon: { fontSize: "2rem", marginBottom: "10px", display: "block" },
  value: { margin: "0", fontSize: "1.5rem", color: "#333" },
  label: { margin: "5px 0 0", color: "#666", fontSize: "0.9rem", textTransform: "uppercase" }
};

export default BentoStats;