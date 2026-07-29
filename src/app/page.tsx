"use client";

import { useState, useEffect } from "react";
import LandingPage from "./landing-page";
import TandemDashboard from "./tandem-dashboard";

export default function HomePage() {
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("tandem_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email: string, name: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/tandem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signup", email, name }),
      });
      const data = await response.json();
      if (data.ok) {
        setUser(data.user);
        localStorage.setItem("tandem_user", JSON.stringify(data.user));
      } else {
        alert(data.error || "Signup failed. Pip is confused.");
      }
    } catch (error) {
      console.error("Signup error", error);
      alert("Something went wrong. The vibes are off.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("tandem_user");
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="ambient-bg"><i /><i /><i /></div>
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
        <p>Syncing your digital essence…</p>
      </div>
    );
  }

  if (!user) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return <TandemDashboard user={user} onLogout={handleLogout} />;
}
