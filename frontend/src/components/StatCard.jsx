import React from "react";

export default function StatCard({ label, value, unit, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{Icon && <Icon size={18} />}</div>
      <span>{label}</span>
      <strong>{value}<small>{unit}</small></strong>
    </div>
  );
}
