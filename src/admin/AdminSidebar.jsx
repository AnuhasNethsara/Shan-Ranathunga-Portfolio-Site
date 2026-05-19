import React from "react";
import { useSiteData } from "../context/SiteDataContext";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Type, 
  UserCog, 
  Briefcase, 
  Layers, 
  MessageSquareHeart, 
  Settings2, 
  Mail, 
  Settings, 
  Globe,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Hero Manager", path: "/admin/hero", icon: Type },
  { name: "About Manager", path: "/admin/about", icon: UserCog },
  { name: "Portfolio", path: "/admin/portfolio", icon: Briefcase },
  { name: "Services", path: "/admin/services", icon: Layers },
  { name: "Testimonials", path: "/admin/testimonials", icon: MessageSquareHeart },
  { name: "Contact Info", path: "/admin/contact", icon: Settings2 },
  { name: "Inbox", path: "/admin/messages", icon: Mail, badgeKey: "messages" },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const { messages, logout, firebaseActive } = useSiteData();
  const location = useLocation();

  // Count unread inbox messages
  const unreadCount = messages.filter(m => m.status === "unread").length;

  return (
    <div 
      className={`h-screen sticky top-0 bg-[#0F172A] border-r border-white/5 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Upper Logo / Banner */}
      <div>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          {!collapsed && (
            <Link to="/admin/dashboard" className="font-sora font-extrabold text-white text-lg tracking-tight">
              Shan<span className="text-[#38BDF8]">.</span>Admin
            </Link>
          )}
          {collapsed && (
            <Link to="/admin/dashboard" className="font-sora font-extrabold text-white text-lg mx-auto">
              S<span className="text-[#38BDF8]">.</span>
            </Link>
          )}

          {/* Collapser Toggle arrow */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg border border-white/5 text-textMuted hover:text-white hover:bg-white/5 hidden md:block"
            aria-label="Toggle sidebar collapse"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Database Mode indicator */}
        <div className="px-4 py-2 border-b border-white/5 bg-[#1E293B]/30 flex items-center justify-center">
          {collapsed ? (
            <span className={`w-2 h-2 rounded-full ${firebaseActive ? "bg-red-500 animate-pulse" : "bg-[#007BFF]"}`} />
          ) : (
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${firebaseActive ? "bg-red-500 animate-pulse" : "bg-[#007BFF]"}`} />
              <span className="text-[10px] font-semibold text-textMuted uppercase tracking-wider">
                {firebaseActive ? "Firebase Mode" : "LocalStorage Mode"}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Link Matrix */}
        <nav className="flex flex-col gap-1 p-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const hasBadge = item.badgeKey === "messages" && unreadCount > 0;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 p-3.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? "bg-[#007BFF] text-white font-semibold shadow-lg shadow-[#007BFF]/25"
                    : "text-textMuted hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                
                {!collapsed && (
                  <span className="truncate flex-grow">{item.name}</span>
                )}

                {/* Unread Inbox Badge counts */}
                {hasBadge && (
                  collapsed ? (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-[#38BDF8] text-[#0A0A0A] font-sora font-bold text-[10px] shadow-[0_0_8px_rgba(56,189,248,0.4)] shrink-0">
                      {unreadCount}
                    </span>
                  )
                )}

                {/* Collapsed Tooltip */}
                {collapsed && (
                  <span className="absolute left-full ml-4 px-3 py-2 rounded-md bg-[#0F172A] border border-white/5 text-white text-xs font-semibold tracking-wide whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Lower Actions & Logout */}
      <div className="p-3 border-t border-white/5 flex flex-col gap-1">
        {/* View Site link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3.5 p-3.5 rounded-xl text-sm text-textMuted hover:text-white hover:bg-white/5 group relative"
        >
          <Globe size={18} className="shrink-0" />
          {!collapsed && <span className="truncate">View Public Site</span>}
          {collapsed && (
            <span className="absolute left-full ml-4 px-3 py-2 rounded-md bg-[#0F172A] border border-white/5 text-white text-xs font-semibold tracking-wide whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
              View Public Site
            </span>
          )}
        </a>

        {/* Logout button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3.5 p-3.5 rounded-xl text-sm text-red-400 hover:text-white hover:bg-red-500/10 group relative transition-colors"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span className="truncate">Admin Logout</span>}
          {collapsed && (
            <span className="absolute left-full ml-4 px-3 py-2 rounded-md bg-red-950 border border-red-500/15 text-red-300 text-xs font-semibold tracking-wide whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
              Admin Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
