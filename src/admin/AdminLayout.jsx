import React, { useState, useEffect } from "react";
import { useSiteData } from "../context/SiteDataContext";
import { Outlet, useNavigate, Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Menu, Globe, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = () => {
  const { currentUser, loading, isAdmin } = useSiteData();
  const navigate = useNavigate();
  
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Protected route check
  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        navigate("/admin/login");
      } else if (!isAdmin) {
        navigate("/portal");
      }
    }
  }, [currentUser, loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-[#38BDF8]">
        <div className="flex flex-col items-center gap-4">
          <span className="w-12 h-12 rounded-full border-4 border-t-[#38BDF8] border-white/5 animate-spin" />
          <span className="font-sora text-sm font-semibold uppercase tracking-wider">Verifying Session...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="min-h-screen flex bg-[#0A0A0A] text-[#F5F5F5] overflow-hidden">
      
      {/* 1. DESKTOP ADJACENT SIDEBAR */}
      <div className="hidden md:block">
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* 2. MOBILE DRAWER NAVIGATION MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#0A0A0A]/85 backdrop-blur-sm"
            />
            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-72 bg-[#0F172A] h-full shadow-2xl"
            >
              <AdminSidebar collapsed={false} setCollapsed={() => {}} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. RIGHT VIEWPORT MAIN BODY CONTENT */}
      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-y-auto bg-[#070A13]">
        
        {/* Top Title Bar */}
        <header className="h-16 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg border border-white/5 text-textMuted hover:text-white hover:bg-white/5 md:hidden"
              aria-label="Open navigation sidebar"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-sora text-sm md:text-base font-bold text-white tracking-tight">
              Administrative Control Workspace
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* View Site */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-textMuted hover:text-white px-3.5 py-2 rounded-full border border-white/5 bg-white/5 transition-all"
            >
              <Globe size={13} />
              <span>View Site</span>
            </a>

            {/* Profile Avatar indicator */}
            <div className="flex items-center gap-2 p-1 px-3 rounded-full border border-white/5 bg-white/5 text-xs text-textSoft">
              <User size={13} className="text-[#38BDF8]" />
              <span className="font-medium hidden sm:inline">{currentUser.email}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Nested View content */}
        <main className="flex-grow p-6 md:p-10 max-w-7xl w-full mx-auto pb-24">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
