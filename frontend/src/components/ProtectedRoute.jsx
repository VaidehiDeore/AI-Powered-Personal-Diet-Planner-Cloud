import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading, firebaseConfigured } = useAuth();
  const location = useLocation();

  if (loading) return <div className="screen-loader">Loading your workspace…</div>;

  // Local demo mode can be entered from the landing page without Firebase.
  if (!firebaseConfigured) return <Outlet />;

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
