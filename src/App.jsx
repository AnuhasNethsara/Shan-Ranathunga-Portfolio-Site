import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SiteDataProvider, useSiteData } from "./context/SiteDataContext";

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
import ClientPortal from "./components/ClientPortal";
import ProposalsManager from "./admin/pages/ProposalsManager";
import ChatsManager from "./admin/pages/ChatsManager";
import ClientsManager from "./admin/pages/ClientsManager";


// Premium Maintenance Splash Page
const MaintenanceMode = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] px-6 relative overflow-hidden text-center">
      {/* Background orbs */}
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-[#007BFF]/10 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-[#38BDF8]/5 blur-[120px] pointer-events-none" />

      {/* Dynamic particles */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[15%] w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse blur-[0.5px]" />
        <div className="absolute top-[60%] left-[10%] w-2 h-2 rounded-full bg-[#007BFF]/60 animate-float" />
        <div className="absolute top-[30%] right-[20%] w-1 h-1 rounded-full bg-[#38BDF8]" />
        <div className="absolute top-[80%] right-[15%] w-1.5 h-1.5 rounded-full bg-[#007BFF]/40 animate-pulse blur-[0.5px]" />
      </div>

      {/* Main card */}
      <div className="max-w-md w-full glass-card p-10 rounded-3xl border border-white/5 shadow-2xl relative z-10 flex flex-col gap-6 items-center">
        <span className="font-sora text-4xl font-bold tracking-tight text-white">
          Shan<span className="text-[#38BDF8] drop-shadow-[0_0_8px_#38BDF8]">.</span>
        </span>
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#38BDF8] bg-[#38BDF8]/5 border border-[#38BDF8]/10 px-3.5 py-1.5 rounded-full">
          Creative Refinement
        </span>
        
        <div className="flex flex-col gap-2.5">
          <h2 className="font-sora text-xl font-extrabold text-white">Portfolio Scheduled Updates</h2>
          <p className="text-xs text-textMuted font-light leading-relaxed">
            Shan Ranathunga's visual space is currently undergoing scheduled visual refinements and structural updates. We are working hard to enhance your browsing experience. Please check back shortly!
          </p>
        </div>

        {/* Custom luxury spinner */}
        <div className="relative w-12 h-12 flex items-center justify-center mt-2">
          <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
          <div className="absolute inset-0 border-2 border-[#007BFF] border-t-transparent rounded-full animate-spin" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8] animate-pulse" />
        </div>

        <p className="text-[10px] text-textMuted/40 uppercase tracking-widest font-light border-t border-white/5 pt-4 w-full mt-2">
          Designed with creativity
        </p>
      </div>

      {/* Tiny Administrative backdoor entrance portal key lock */}
      <a 
        href="/admin/login" 
        className="absolute bottom-8 right-8 p-3 rounded-full border border-white/5 hover:border-white/15 bg-white/5 hover:bg-white/10 text-textMuted hover:text-white transition-all shadow-lg cursor-pointer"
        title="Admin Entrance Gate"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </a>
    </div>
  );
};

// Main Single Page Portfolio wrapper assembly
const PublicPortfolio = () => {
  const { settings, currentUser } = useSiteData();
  const isMaintenance = settings?.isMaintenanceMode ?? false;
  const isAdmin = currentUser !== null;

  if (isMaintenance && !isAdmin) {
    return <MaintenanceMode />;
  }

  return (
    <div className={`relative min-h-screen bg-[#0A0A0A] text-[#F5F5F5] ${isMaintenance && isAdmin ? "pt-9" : ""}`}>
      {/* Dynamic top sticky warning bar for testing admins */}
      {isMaintenance && isAdmin && (
        <div className="fixed top-0 left-0 w-full bg-[#D97706]/95 backdrop-blur-md text-white text-[10px] font-bold text-center py-2 z-[9999] tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg border-b border-orange-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          <span>Maintenance Mode is Active Globally. Public visitors see the locked splash card.</span>
        </div>
      )}
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
            <Route path="proposals" element={<ProposalsManager />} />
            <Route path="chats" element={<ChatsManager />} />
            <Route path="clients" element={<ClientsManager />} />
          </Route>

          {/* Client Portal */}
          <Route path="/portal" element={<ClientPortal />} />

          {/* Wildcard Fallbacks */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </SiteDataProvider>
  );
}

export default App;
