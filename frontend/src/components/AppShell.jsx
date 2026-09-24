import React from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  Sparkles,
  FolderOpen,
  Utensils,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth, firebaseConfigured } from "../firebase";
import { useAuth } from "../context/AuthContext";

const links = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/profile", "Profile", UserRound],
  ["/generate", "Generate plan", Sparkles],
  ["/intake", "Daily intake", Utensils],
  ["/plans", "Saved plans", FolderOpen]
];

export default function AppShell() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  async function logout() {
    if (firebaseConfigured && auth) {
      await signOut(auth);
    }
    navigate("/");
  }

  return (
    <div className="app-layout">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={19} />
          </div>

          <div>
            <strong>NutriCloud</strong>
            <span>Personal planner</span>
          </div>
        </div>

        <nav>
          {links.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-mini">
            <div className="avatar">
              {(user?.displayName || "D").slice(0, 1).toUpperCase()}
            </div>

            <div>
              <strong>{user?.displayName || "Demo User"}</strong>
              <span>{user?.email || "Local simulation"}</span>
            </div>
          </div>

          <button className="ghost-button full" onClick={logout}>
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="main-area">
        <button
          className="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>

        <Outlet />
      </main>
    </div>
  );
}
