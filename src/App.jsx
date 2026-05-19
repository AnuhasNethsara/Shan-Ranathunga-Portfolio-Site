import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SiteDataProvider } from "./context/SiteDataContext";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Public Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Portfolio from "./components/Portfolio";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

// Admin Components
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import HeroManager from "./admin/pages/HeroManager";
import AboutManager from "./admin/pages/AboutManager";
import PortfolioManager from "./admin/pages/PortfolioManager";
import ServicesManager from "./admin/pages/ServicesManager";
import TestimonialsManager from "./admin/pages/TestimonialsManager";
import ContactInfoManager from "./admin/pages/ContactInfoManager";
import MessagesInbox from "./admin/pages/MessagesInbox";
import Settings from "./admin/pages/Settings";

// Custom Cursor component with lagging neon glow
const CustomCursor = () => {
  const [hidden, setHidden] = useState(true);
  const [hovered, setHovered] = useState(false);

  // Motion physics spring values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 };
  const cursorSpringX = useSpring(cursorX, springConfig);
  const cursorSpringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (hidden) setHidden(false);
    };

    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    // Track clickable items for hover scaling effects
    const addHoverEffect = () => setHovered(true);
    const removeHoverEffect = () => setHovered(false);

    const updateClickableListeners = () => {
      const clickables = document.querySelectorAll("a, button, select, input, textarea, [role='button'], .cursor-pointer");
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", addHoverEffect);
        el.addEventListener("mouseleave", removeHoverEffect);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    
    // Initial run and repeated interval to grab dynamic items on tab change
    updateClickableListeners();
    const interval = setInterval(updateClickableListeners, 1000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      clearInterval(interval);
    };
  }, [cursorX, cursorY, hidden]);

  if (hidden) return null;

  return (
    <>
      {/* 1. Core Pointer dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-[#38BDF8] rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_12px_#38BDF8]"
        style={{ x: cursorX, y: cursorY }}
      />
      {/* 2. Lagging Spring glow ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-[#007BFF]/50 rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 bg-[#007BFF]/5 shadow-[0_0_15px_rgba(0,123,255,0.15)]"
        style={{ x: cursorSpringX, y: cursorSpringY }}
        animate={{
          scale: hovered ? 1.6 : 1,
          borderColor: hovered ? "#38BDF8" : "rgba(0, 123, 255, 0.5)"
        }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
      />
    </>
  );
};

// Main Single Page Portfolio wrapper assembly
const PublicPortfolio = () => {
  // Page load scroll reveal or analytics tracking can happen here
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#F5F5F5]">
      <Navbar />
      <Hero />
      <About />
      <Portfolio />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <SiteDataProvider>
      <Router>
        {/* Custom interactive cursor layer */}
        <CustomCursor />

        <Routes>
          {/* Public site root */}
          <Route path="/" element={<PublicPortfolio />} />

          {/* Locked admin login Gate */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Secure Admin Portal layouts */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="hero" element={<HeroManager />} />
            <Route path="about" element={<AboutManager />} />
            <Route path="portfolio" element={<PortfolioManager />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="testimonials" element={<TestimonialsManager />} />
            <Route path="contact" element={<ContactInfoManager />} />
            <Route path="messages" element={<MessagesInbox />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Wildcard Fallbacks */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </SiteDataProvider>
  );
}

export default App;
