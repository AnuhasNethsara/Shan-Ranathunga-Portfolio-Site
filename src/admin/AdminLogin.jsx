import React, { useState, useEffect } from "react";
import { useSiteData } from "../context/SiteDataContext";
import { useNavigate } from "react-router-dom";
import { Key, User, ShieldAlert, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const { login, currentUser } = useSiteData();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Wrong credentials shake trigger
  const [shakeCount, setShakeCount] = useState(0);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (currentUser) {
      navigate("/admin/dashboard");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setError("");
    setIsLoggingIn(true);

    try {
      await login(username.trim(), password.trim());
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Incorrect administrative credentials");
      setShakeCount(prev => prev + 1); // Triggers shake animation
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Framer Motion shake animation variants
  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, -5, 5, 0],
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] bg-grid-glow px-6 relative">
      {/* Background visual light orbs */}
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-[#007BFF]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-[#38BDF8]/5 blur-[120px] pointer-events-none" />

      {/* Back to Site Button */}
      <a
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-sora font-semibold text-textMuted hover:text-white uppercase tracking-wider transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Website
      </a>

      {/* Main Form container */}
      <motion.div
        animate={shakeCount > 0 ? "shake" : ""}
        variants={shakeVariants}
        className="max-w-md w-full glass-card p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative z-10 flex flex-col gap-6"
      >
        {/* Header logo & tags */}
        <div className="text-center flex flex-col items-center gap-2">
          <span className="font-sora text-3xl font-bold tracking-tight text-white">
            Shan<span className="text-[#38BDF8] drop-shadow-[0_0_8px_#38BDF8]">.</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#38BDF8] bg-[#38BDF8]/5 border border-[#38BDF8]/10 px-3 py-1 rounded-full">
            Admin Portal Gate
          </span>
        </div>

        {/* Error Alert Box */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-medium"
          >
            <ShieldAlert size={18} className="shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Username */}
          <div className="flex flex-col gap-2">
            <label htmlFor="login-username" className="text-xs font-bold text-textSoft uppercase tracking-wider flex items-center gap-1.5">
              <User size={13} className="text-[#38BDF8]" />
              Username
            </label>
            <input
              id="login-username"
              type="text"
              required
              placeholder="Enter admin name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glass-input p-4 text-sm font-light"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="login-password" className="text-xs font-bold text-textSoft uppercase tracking-wider flex items-center gap-1.5">
              <Key size={13} className="text-[#38BDF8]" />
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input p-4 text-sm font-light"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="mt-2 w-full px-6 py-4 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white font-sora font-semibold tracking-wider uppercase text-xs transition-all duration-350 hover:shadow-[0_0_20px_rgba(0,123,255,0.4)] flex items-center justify-center disabled:opacity-50"
          >
            {isLoggingIn ? "Authenticating Session..." : "Verify & Unlock Admin Access"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
