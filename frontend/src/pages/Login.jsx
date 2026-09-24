import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firebaseConfigured } from "../firebase";
import { LogIn, Sparkles } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      if (firebaseConfigured) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        localStorage.setItem("local_demo_user", JSON.stringify({ email, displayName: "Demo User" }));
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return <AuthCard title="Welcome back" subtitle="Sign in to continue your planning workspace." onSubmit={submit} error={error}
    fields={<>
      <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com"/></label>
      <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••"/></label>
    </>}
    button="Sign in" footer={<span>New here? <Link to="/register">Create an account</Link></span>}
  />;
}

function AuthCard({ title, subtitle, fields, onSubmit, button, footer, error }) {
  return <div className="auth-page">
    <div className="auth-brand"><div className="brand-mark"><Sparkles size={18}/></div><strong>NutriCloud</strong></div>
    <div className="auth-card">
      <div className="auth-heading"><div className="auth-icon"><LogIn size={20}/></div><h1>{title}</h1><p>{subtitle}</p></div>
      <form onSubmit={onSubmit} className="form-stack">{fields}{error && <div className="error-box">{error}</div>}<button className="primary-button full large" type="submit">{button}</button></form>
      <div className="auth-footer">{footer}</div>
    </div>
  </div>;
}
