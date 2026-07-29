"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Sparkles, Bot, Zap, Heart, Coffee, Globe2 } from "lucide-react";

export default function LandingPage({ onLogin }: { onLogin: (email: string, name: string) => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      onLogin(email, name);
    }
  };

  return (
    <div className="landing-shell">
      <div className="ambient-bg"><i /><i /><i /></div>
      
      <header className="landing-nav">
        <div className="brand-lockup">
          <span className="brand-glyph"><i /><i /><b>✦</b></span>
          <strong>tandem<span>°</span></strong>
        </div>
        <button className="nav-cta" onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}>
          Join the galaxy
        </button>
      </header>

      <main className="landing-content">
        <section className="hero-section">
          <motion.div 
            className="pip-hero-container"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="pip-hero">
              <span className="pip-ear left" />
              <span className="pip-ear right" />
              <span className="pip-face">
                <i className="eye left" /><i className="eye right" />
                <b className="pip-mouth" />
                <em>✦</em>
              </span>
              <span className="pip-feet"><i /><i /></span>
            </div>
            <motion.div 
              className="pip-bubble"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
            >
              "Your coworkers aren't robots. (Except me, I'm literally a bot)."
            </motion.div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Work with people, <br />
            <span className="gradient-text">not just profiles.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Tandem is the personality-driven workspace for teams who 
            actually want to like each other. Decode vibes, send coffe signals, 
            and find your work soulmates.
          </motion.p>

          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="stat-pill"><Zap size={14} /> 83% less awkward zooms</div>
            <div className="stat-pill"><Heart size={14} /> 100% more team lore</div>
            <div className="stat-pill"><Coffee size={14} /> Infinite coffee signals</div>
          </motion.div>
        </section>

        <section className="feature-grid">
          <div className="landing-card purple">
            <Sparkles className="card-icon" />
            <h3>Personality Lore</h3>
            <p>Go beyond job titles. Are you a "Calm Chaos Controller" or a "Launch Day Addict"?</p>
          </div>
          <div className="landing-card mint">
            <Globe2 className="card-icon" />
            <h3>Team Galaxy</h3>
            <p>A live, interactive map of your team's vibes. Drag, drop, and discover clusters.</p>
          </div>
          <div className="landing-card pink">
            <Bot className="card-icon" />
            <h3>Pip, Your Sidekick</h3>
            <p>An AI that actually knows you. Friendly reminders to touch grass included.</p>
          </div>
        </section>

        <section id="signup" className="signup-section">
          <div className="glass-card signup-card">
            <h2>Ready to evolve?</h2>
            <p>Join Arc & Co. and claim your unique work archetype.</p>
            
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="input-group">
                <label>What do humans call you?</label>
                <input 
                  type="text" 
                  placeholder="e.g. Hammad Safi" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Your digital coordinates</label>
                <input 
                  type="email" 
                  placeholder="hello@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="signup-button"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Enter the Galaxy 
                <motion.span animate={{ x: isHovered ? 5 : 0 }}>
                  <ArrowRight size={18} />
                </motion.span>
              </button>
            </form>
            <p className="form-footer">No boring passwords. Just vibes and magic links.</p>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>© 2026 Tandem° — Built with questionable amounts of caffeine.</p>
      </footer>
    </div>
  );
}
