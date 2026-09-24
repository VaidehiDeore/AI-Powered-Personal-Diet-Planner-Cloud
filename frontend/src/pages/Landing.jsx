import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Cloud, ShieldCheck, Sparkles, BarChart3, Database, Upload } from "lucide-react";

export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Link className="brand" to="/">
          <div className="brand-mark"><Sparkles size={19} /></div>
          <div><strong>NutriCloud</strong><span>Cloud diet planner</span></div>
        </Link>
        <div className="nav-actions">
          <Link to="/login" className="text-link">Sign in</Link>
          <Link to="/register" className="primary-button">Get started <ArrowRight size={16} /></Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="pill"><Sparkles size={14} /> AI-assisted wellness planning</div>
          <h1>Plan meals with a <span>cloud-powered</span> personal workspace.</h1>
          <p>Build a profile, generate educational meal-plan examples, track intake, save plans and keep optional files in one secure cloud-oriented application.</p>
          <div className="hero-actions">
            <Link to="/register" className="primary-button large">Create your workspace <ArrowRight size={18} /></Link>
            <Link to="/login" className="secondary-button large">Explore demo</Link>
          </div>
          <p className="tiny-note">Educational/general-wellness demonstration — not medical advice.</p>
        </div>
        <div className="hero-panel">
          <div className="mock-window">
            <div className="mock-top"><span></span><span></span><span></span><em>Dashboard</em></div>
            <div className="mock-content">
              <div className="mock-greeting"><div><small>GOOD MORNING</small><h3>Your plan is ready.</h3></div><div className="mock-avatar">V</div></div>
              <div className="mock-stats"><div><b>2,140</b><small>Daily kcal</small></div><div><b>128g</b><small>Protein</small></div><div><b>72%</b><small>Target progress</small></div></div>
              <div className="mock-meal"><div className="food-dot"></div><div><b>Breakfast</b><small>Oats, banana & yogurt</small></div><strong>520 kcal</strong></div>
              <div className="mock-meal"><div className="food-dot"></div><div><b>Lunch</b><small>Paneer bowl & vegetables</small></div><strong>680 kcal</strong></div>
              <div className="mock-meal"><div className="food-dot"></div><div><b>Dinner</b><small>Dal, rice & salad</small></div><strong>590 kcal</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        {[
          [Sparkles, "Personalized planning", "Use goals, activity and dietary preferences to create structured meal examples."],
          [Cloud, "Cloud-first architecture", "Authentication, Firestore and object storage are designed into the workflow."],
          [ShieldCheck, "Security by identity", "User-scoped records, protected APIs and environment-based configuration."],
          [BarChart3, "Track progress", "Log intake and surface simple target-versus-actual summaries."],
          [Database, "Structured data", "Profiles, plans, foods and intake are kept separate for maintainability."],
          [Upload, "File workspace", "Upload optional demo meal or food files and manage their metadata."]
        ].map(([Icon, title, text]) => (
          <div className="feature-card" key={title}><Icon size={22}/><h3>{title}</h3><p>{text}</p></div>
        ))}
      </section>
    </div>
  );
}
