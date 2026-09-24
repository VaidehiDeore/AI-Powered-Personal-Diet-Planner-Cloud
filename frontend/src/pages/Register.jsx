import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, firebaseConfigured } from "../firebase";
import { UserPlus, Sparkles } from "lucide-react";

export default function Register() {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const navigate=useNavigate();

  async function submit(e) {
    e.preventDefault(); setError("");
    try {
      if (firebaseConfigured) {
        const cred = await createUserWithEmailAndPassword(auth,email,password);
        await updateProfile(cred.user,{displayName:name});
      } else {
        localStorage.setItem("local_demo_user",JSON.stringify({email,displayName:name}));
      }
      navigate("/profile");
    } catch(err){ setError(err.message); }
  }

  return <div className="auth-page">
    <div className="auth-brand"><div className="brand-mark"><Sparkles size={18}/></div><strong>NutriCloud</strong></div>
    <div className="auth-card">
      <div className="auth-heading"><div className="auth-icon"><UserPlus size={20}/></div><h1>Create workspace</h1><p>Set up your account and start with your wellness profile.</p></div>
      <form onSubmit={submit} className="form-stack">
        <label>Name<input value={name} onChange={e=>setName(e.target.value)} required placeholder="Your name"/></label>
        <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com"/></label>
        <label>Password<input type="password" minLength="6" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="At least 6 characters"/></label>
        {error && <div className="error-box">{error}</div>}
        <button className="primary-button full large" type="submit">Create account</button>
      </form>
      <div className="auth-footer">Already registered? <Link to="/login">Sign in</Link></div>
    </div>
  </div>;
}
