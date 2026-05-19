import React from "react";
import { useSiteData } from "../../context/SiteDataContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  Layers, 
  MessageSquareHeart, 
  Mail, 
  PlusCircle, 
  Eye, 
  CheckCircle, 
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { portfolio, services, testimonials, messages, markMessageRead } = useSiteData();
  const navigate = useNavigate();

  const totalProjects = portfolio.length;
  const totalServices = services.length;
  const totalTestimonials = testimonials.length;
  const unreadMessages = messages.filter(m => m.status === "unread").length;
  
  // Last 3 messages preview
  const recentMessages = messages.slice(0, 3);

  const stats = [
    { name: "Total Projects", value: totalProjects, icon: Briefcase, color: "text-[#38BDF8]", bg: "bg-[#38BDF8]/5", border: "border-[#38BDF8]/10" },
    { name: "Services Offered", value: totalServices, icon: Layers, color: "text-[#007BFF]", bg: "bg-[#007BFF]/5", border: "border-[#007BFF]/10" },
    { name: "Client Testimonials", value: totalTestimonials, icon: MessageSquareHeart, color: "text-purple-400", bg: "bg-purple-500/5", border: "border-purple-500/10" },
    { name: "Unread Inbox Messages", value: unreadMessages, icon: Mail, color: unreadMessages > 0 ? "text-yellow-400" : "text-textMuted", bg: "bg-yellow-500/5", border: "border-yellow-500/10", unreadBadge: unreadMessages > 0 },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Upper greetings */}
      <div className="flex flex-col gap-2">
        <h2 className="font-sora text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Dashboard Overview
        </h2>
        <p className="text-textMuted text-xs md:text-sm font-light">
          Welcome back, Shan. Here is a high-level summary of your database metrics and recent client inquiries.
        </p>
      </div>

      {/* Grid Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`glass-card p-6 rounded-2xl border ${stat.border} flex items-center justify-between relative overflow-hidden`}
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs text-textMuted font-medium">{stat.name}</span>
                <span className="font-sora text-3xl font-black text-white">{stat.value}</span>
              </div>
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} shadow-md`}>
                <Icon size={22} />
              </div>
              {stat.unreadBadge && (
                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Middle contents Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Quick Actions Shortcuts (Left) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col gap-5">
            <h3 className="font-sora text-base font-bold text-white tracking-tight">
              Quick Shortcuts
            </h3>
            
            <div className="flex flex-col gap-3">
              <Link
                to="/admin/portfolio"
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/5 text-xs text-textSoft hover:text-white hover:bg-white/10 hover:border-[#38BDF8]/20 transition-all font-medium"
              >
                <span className="flex items-center gap-2">
                  <PlusCircle size={15} className="text-[#38BDF8]" />
                  Add New Project
                </span>
                <Briefcase size={14} className="text-textMuted" />
              </Link>

              <Link
                to="/admin/services"
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/5 text-xs text-textSoft hover:text-white hover:bg-white/10 hover:border-[#007BFF]/20 transition-all font-medium"
              >
                <span className="flex items-center gap-2">
                  <PlusCircle size={15} className="text-[#007BFF]" />
                  Add New Service
                </span>
                <Layers size={14} className="text-textMuted" />
              </Link>

              <Link
                to="/admin/testimonials"
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/5 text-xs text-textSoft hover:text-white hover:bg-white/10 hover:border-purple-500/20 transition-all font-medium"
              >
                <span className="flex items-center gap-2">
                  <PlusCircle size={15} className="text-purple-400" />
                  Add New Testimonial
                </span>
                <MessageSquareHeart size={14} className="text-textMuted" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent messages (Right) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="font-sora text-base font-bold text-white tracking-tight">
                Recent Message Inquiries
              </h3>
              <Link to="/admin/messages" className="text-xs font-semibold text-[#38BDF8] hover:underline">
                View All Inbox ({messages.length})
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 flex flex-col gap-3 relative transition-all ${
                    msg.status === "unread" ? "border-[#38BDF8]/20 bg-[#38BDF8]/5" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-sora text-sm font-bold text-white leading-none">{msg.name}</span>
                        {msg.status === "unread" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]" />
                        )}
                      </div>
                      <span className="text-[10px] text-textMuted mt-1 block">{msg.email} | {msg.projectType}</span>
                    </div>

                    {/* Mark Read quick link */}
                    {msg.status === "unread" && (
                      <button
                        onClick={() => markMessageRead(msg.id, true)}
                        className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] hover:underline flex items-center gap-1 shrink-0"
                        title="Mark message as read"
                      >
                        <CheckCircle size={12} />
                        Mark Read
                      </button>
                    )}
                  </div>

                  <p className="text-textSoft font-light text-xs line-clamp-2 leading-relaxed">
                    "{msg.message}"
                  </p>

                  <span className="text-[9px] text-textMuted/60 font-light block self-end">
                    {new Date(msg.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              ))}

              {recentMessages.length === 0 && (
                <div className="text-center py-8 border border-dashed border-white/5 rounded-xl text-textMuted font-light text-xs flex flex-col items-center gap-3">
                  <MessageSquare size={24} className="text-textMuted/30" />
                  <span>No client message inquiries submitted yet.</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
