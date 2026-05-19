import React, { useState } from "react";
import { useSiteData } from "../../context/SiteDataContext";
import { 
  Mail, 
  Search, 
  Trash2, 
  CheckCircle, 
  Circle, 
  X, 
  Eye, 
  AlertCircle,
  Clock,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MessagesInbox = () => {
  const { messages, markMessageRead, deleteInboxMessage } = useSiteData();

  // Selected message details lightbox modal
  const [selectedMsg, setSelectedMsg] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, read, unread
  const [typeFilter, setTypeFilter] = useState("all");

  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");

  // Dynamically extract active project types submitted in inbox to populate dropdown
  const uniqueProjectTypes = ["all", ...new Set(messages.map(m => m.projectType))];

  // Filter messages list
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = 
      msg.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "read" && msg.status === "read") ||
      (statusFilter === "unread" && msg.status === "unread");

    const matchesType = 
      typeFilter === "all" || 
      msg.projectType?.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleOpenMessage = (msg) => {
    setSelectedMsg(msg);
    if (msg.status === "unread") {
      markMessageRead(msg.id, true);
    }
  };

  const handleToggleRead = async (id, currentStatus) => {
    try {
      await markMessageRead(id, currentStatus === "unread");
      // If modal is open on this active message, update state representation
      if (selectedMsg && selectedMsg.id === id) {
        setSelectedMsg(prev => ({ ...prev, status: currentStatus === "unread" ? "read" : "unread" }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to permanently delete this client inquiry?")) {
      try {
        await deleteInboxMessage(id);
        setAlertType("success");
        setAlertMsg("Message successfully deleted!");
        if (selectedMsg && selectedMsg.id === id) {
          setSelectedMsg(null);
        }
      } catch (err) {
        console.error(err);
        setAlertType("error");
        setAlertMsg("Failed to delete: " + err.message);
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="font-sora text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Client Inbox
        </h2>
        <p className="text-textMuted text-xs md:text-sm font-light">
          Examine and manage inbound client inquiries, project scopes, and creative consultations.
        </p>
      </div>

      {/* Alert banner */}
      {alertMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 p-4 rounded-xl border text-xs font-medium ${
            alertType === "success"
              ? "border-[#10B981]/20 bg-[#10B981]/10 text-green-400"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}
        >
          {alertType === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{alertMsg}</span>
        </motion.div>
      )}

      {/* Search & Filtering Row Controls */}
      <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center gap-4 shadow-lg w-full">
        {/* Search */}
        <div className="relative flex-grow w-full">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
          <input
            type="text"
            placeholder="Search by client name, email, or message contents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input pl-11 pr-4 py-3 text-xs font-light w-full"
          />
        </div>

        {/* Filters Wrapper */}
        <div className="flex items-center gap-3 w-full md:w-auto self-stretch md:self-auto">
          {/* Status Select */}
          <div className="relative w-full md:w-40 shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="glass-input px-3.5 py-3 text-xs font-light cursor-pointer w-full bg-surface"
            >
              <option value="all" className="bg-[#0A0A0A] text-white">All Statuses</option>
              <option value="unread" className="bg-[#0A0A0A] text-white">Unread Only</option>
              <option value="read" className="bg-[#0A0A0A] text-white">Read Only</option>
            </select>
          </div>

          {/* Project Type Select */}
          <div className="relative w-full md:w-48 shrink-0">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="glass-input px-3.5 py-3 text-xs font-light cursor-pointer w-full bg-surface"
            >
              <option value="all" className="bg-[#0A0A0A] text-white">All Project Types</option>
              {uniqueProjectTypes.filter(t => t !== "all").map((type) => (
                <option key={type} value={type} className="bg-[#0A0A0A] text-white">
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Messages List grid layout */}
      <div className="flex flex-col gap-4">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            onClick={() => handleOpenMessage(msg)}
            className={`glass-card glass-card-hover p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer relative transition-all ${
              msg.status === "unread" ? "border-[#38BDF8]/20 bg-[#38BDF8]/5 shadow-md shadow-[#38BDF8]/3" : ""
            }`}
          >
            {/* Left: Identity Coordinates */}
            <div className="flex items-center gap-4 max-w-sm w-full shrink-0">
              <div className={`p-3 rounded-xl border shrink-0 shadow-md ${
                msg.status === "unread" ? "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/20" : "bg-white/5 text-textMuted border-white/5"
              }`}>
                <Mail size={18} />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-sora text-sm font-bold text-white truncate leading-none">{msg.name}</span>
                  {msg.status === "unread" && (
                    <span className="px-2 py-0.5 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/20 text-[8px] font-bold text-[#38BDF8] tracking-widest uppercase">New</span>
                  )}
                </div>
                <span className="text-[10px] text-textMuted truncate">{msg.email}</span>
              </div>
            </div>

            {/* Middle: Brief message slice & project type */}
            <div className="flex-grow flex flex-col gap-1.5 min-w-0">
              <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider self-start px-2 py-0.5 rounded bg-white/5 border border-white/5">
                {msg.projectType}
              </span>
              <p className="text-textSoft text-xs font-light line-clamp-1 leading-relaxed">
                {msg.message}
              </p>
            </div>

            {/* Right: Date coordinates & Action triggers */}
            <div className="flex items-center gap-6 shrink-0 justify-between md:justify-end">
              <div className="flex items-center gap-1.5 text-[10px] text-textMuted/60 font-light">
                <Clock size={12} />
                <span>
                  {new Date(msg.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Mark Read/Unread toggler */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleToggleRead(msg.id, msg.status); }}
                  className={`p-2 rounded bg-white/5 transition-colors ${
                    msg.status === "unread" ? "text-yellow-400 hover:text-white" : "text-textMuted hover:text-[#38BDF8]"
                  }`}
                  title={msg.status === "unread" ? "Mark as Read" : "Mark as Unread"}
                >
                  {msg.status === "unread" ? <CheckCircle size={14} /> : <Circle size={14} />}
                </button>
                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => handleDelete(msg.id, e)}
                  className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                  title="Delete message"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="text-center py-16 border border-dashed border-white/5 rounded-2xl bg-white/5 flex flex-col items-center gap-3">
            <Mail size={32} className="text-textMuted/30" />
            <span className="text-textMuted font-light text-xs">No matching message inquiries found in the inbox.</span>
          </div>
        )}
      </div>

      {/* FULL MESSAGE DETAILS LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedMsg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMsg(null)}
              className="absolute inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative max-w-xl w-full rounded-2xl glass-card shadow-2xl p-6 md:p-8 z-10 border border-white/10 flex flex-col gap-6"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedMsg(null)}
                className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-white/5 text-textMuted hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <h3 className="font-sora text-base font-bold text-white tracking-tight border-b border-white/5 pb-3">
                Client Inquiry Details
              </h3>

              <div className="flex flex-col gap-4">
                {/* Meta details list */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-white/5 bg-white/5 text-xs font-light leading-relaxed">
                  <div>
                    <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block">Client Name</span>
                    <span className="text-white font-medium">{selectedMsg.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block">Project Scope</span>
                    <span className="text-[#38BDF8] font-semibold uppercase">{selectedMsg.projectType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block">Email Coordinate</span>
                    <a href={`mailto:${selectedMsg.email}`} className="text-white font-medium hover:underline block truncate">{selectedMsg.email}</a>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block">Dispatched Date</span>
                    <span className="text-white font-medium">
                      {new Date(selectedMsg.date).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                </div>

                {/* Message body */}
                <div className="flex flex-col gap-1.5 mt-2">
                  <span className="text-xs font-bold text-textSoft uppercase tracking-wider">Inquiry Body</span>
                  <div className="p-4 rounded-xl border border-white/5 bg-white/5 text-xs md:text-sm font-light leading-relaxed text-textSoft max-h-60 overflow-y-auto italic">
                    "{selectedMsg.message}"
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => handleToggleRead(selectedMsg.id, selectedMsg.status)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold tracking-wide transition-all ${
                    selectedMsg.status === "unread" 
                      ? "border-yellow-500/20 bg-yellow-500/5 text-yellow-400 hover:bg-yellow-500/10" 
                      : "border-white/10 bg-white/5 text-textMuted hover:text-white"
                  }`}
                >
                  {selectedMsg.status === "unread" ? "Mark Message Read" : "Mark Message Unread"}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(selectedMsg.id)}
                  className="px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-semibold text-xs tracking-wide hover:bg-red-500 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <Trash2 size={13} />
                  Delete Inbound Inquiry
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MessagesInbox;
