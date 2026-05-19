import React, { useState, useEffect, useRef } from "react";
import { useSiteData } from "../context/SiteDataContext";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Send, 
  FolderPlus, 
  MessageSquare, 
  Star, 
  LogOut, 
  User, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  Folder, 
  Briefcase, 
  AlertCircle,
  Plus,
  ShieldCheck,
  Building
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ClientPortal = () => {
  const {
    currentUser,
    isClient,
    isAdmin,
    services,
    proposals,
    chats,
    registerClient,
    loginClient,
    loginClientWithGoogle,
    submitProposal,
    submitClientTestimonial,
    sendChatMessage,
    markChatsAsRead,
    logout,
    firebaseActive
  } = useSiteData();

  const navigate = useNavigate();
  
  // Tab states: 'proposals' | 'chat' | 'testimonial'
  const [activeTab, setActiveTab] = useState("proposals");
  
  // Auth Form states
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Proposal Form states
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [propTitle, setPropTitle] = useState("");
  const [propService, setPropService] = useState("");
  const [propBudget, setPropBudget] = useState("");
  const [propTimeline, setPropTimeline] = useState("");
  const [propDesc, setPropDesc] = useState("");
  const [proposalSubmitting, setProposalSubmitting] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState("");

  // Testimonial Form states
  const [rating, setRating] = useState(5);
  const [testimonialText, setTestimonialText] = useState("");
  const [testSubmitting, setTestSubmitting] = useState(false);
  const [testSuccess, setTestSuccess] = useState("");

  // Chat states
  const [chatMessage, setChatMessage] = useState("");
  const chatEndRef = useRef(null);

  // Redirect if admin attempts to use client portal
  useEffect(() => {
    if (currentUser && isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [currentUser, isAdmin, navigate]);

  // Read message count trigger
  useEffect(() => {
    if (currentUser && isClient && activeTab === "chat") {
      markChatsAsRead("admin");
    }
  }, [activeTab, chats, currentUser, isClient]);

  // Chat window auto-scrolling
  useEffect(() => {
    if (activeTab === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats, activeTab]);

  // Handle Authentication submit
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (isRegister && !displayName.trim()) return;

    setAuthError("");
    setAuthLoading(true);

    try {
      if (isRegister) {
        await registerClient(email.trim(), password, displayName.trim());
      } else {
        await loginClient(email.trim(), password);
      }
    } catch (err) {
      console.error(err);
      setAuthError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Google Auth
  const handleGoogleAuth = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      await loginClientWithGoogle();
    } catch (err) {
      console.error(err);
      setAuthError(err.message || "Failed to authenticate via Google account.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Proposal submission
  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    if (!propTitle.trim() || !propService || !propBudget.trim() || !propTimeline.trim() || !propDesc.trim()) {
      alert("All fields are required.");
      return;
    }

    setProposalSubmitting(true);
    setProposalSuccess("");

    try {
      await submitProposal({
        title: propTitle.trim(),
        serviceType: propService,
        budget: propBudget.trim(),
        timeline: propTimeline.trim(),
        description: propDesc.trim()
      });
      setProposalSuccess("Your project proposal was submitted successfully! Track status below.");
      // Reset form
      setPropTitle("");
      setPropService("");
      setPropBudget("");
      setPropTimeline("");
      setPropDesc("");
      setShowProposalForm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit proposal: " + err.message);
    } finally {
      setProposalSubmitting(false);
    }
  };

  // Handle Testimonial submission
  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    if (!testimonialText.trim()) return;

    setTestSubmitting(true);
    setTestSuccess("");

    try {
      await submitClientTestimonial({
        clientName: currentUser.displayName || currentUser.email.split("@")[0],
        rating,
        reviewText: testimonialText.trim(),
        avatar: ""
      });
      setTestSuccess("Thank you! Your review was sent for moderation.");
      setTestimonialText("");
      setRating(5);
    } catch (err) {
      console.error(err);
      alert("Failed to submit testimonial: " + err.message);
    } finally {
      setTestSubmitting(false);
    }
  };

  // Handle Chat message sending
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    try {
      await sendChatMessage(chatMessage.trim(), "admin");
      setChatMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to send message: " + err.message);
    }
  };

  // Filter client proposals
  const clientProposals = proposals.filter(p => p.clientId === currentUser?.uid);
  
  // Filter client chat thread (between active client and admin)
  const clientThread = chats.filter(
    msg => (msg.senderId === currentUser?.uid && msg.recipientId === "admin") || 
           (msg.senderId === "admin" && msg.recipientId === currentUser?.uid)
  );

  // Compute unread message count
  const unreadMessageCount = chats.filter(
    msg => msg.senderId === "admin" && msg.recipientId === currentUser?.uid && msg.unread
  ).length;

  // Render Status Badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">Accepted</span>;
      case "rejected":
        return <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-red-500/10 border border-red-500/20 text-red-400">Declined</span>;
      case "completed":
        return <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#007BFF]/10 border border-[#007BFF]/20 text-[#38BDF8]">Completed</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center gap-1"><Clock size={10} /> Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] bg-grid-glow relative text-[#F5F5F5] pb-24">
      {/* Background visual light orbs */}
      <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] rounded-full bg-[#007BFF]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-[#38BDF8]/5 blur-[100px] pointer-events-none" />

      {/* TOP HEADER */}
      <header className="h-20 border-b border-white/5 bg-[#0A0A0A]/60 backdrop-blur-md sticky top-0 z-40 px-6 md:px-12 flex items-center justify-between">
        <a 
          href="/" 
          className="flex items-center gap-2 text-xs font-sora font-semibold text-textMuted hover:text-white uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={14} /> Back to Website
        </a>

        {currentUser && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 p-1.5 px-3.5 rounded-full border border-white/5 bg-white/5 text-xs text-textSoft">
              <User size={13} className="text-[#38BDF8]" />
              <span className="font-medium font-sora">{currentUser.displayName || currentUser.email}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-full border border-red-500/10 bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-md"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-12 mt-12 relative z-10">
        
        {/* UNAUTHENTICATED CLIENT VIEW */}
        {!currentUser && (
          <div className="flex items-center justify-center min-h-[70vh]">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full glass-card p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-6"
            >
              <div className="text-center flex flex-col items-center gap-2">
                <span className="font-sora text-3xl font-bold tracking-tight text-white">
                  Shan<span className="text-[#38BDF8] drop-shadow-[0_0_8px_#38BDF8]">.</span>Portal
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#38BDF8] bg-[#38BDF8]/5 border border-[#38BDF8]/10 px-3.5 py-1 rounded-full">
                  {isRegister ? "Client Account Signup" : "Client Portal Sign In"}
                </span>
              </div>

              {authError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-medium"
                >
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{authError}</span>
                </motion.div>
              )}

              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                
                {isRegister && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-textSoft uppercase tracking-wider">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alice Johnson"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="glass-input p-3 text-xs font-light"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-textSoft uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input p-3 text-xs font-light"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-textSoft uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input p-3 text-xs font-light"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-2 px-6 py-3.5 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white font-sora font-semibold tracking-wider text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {authLoading ? "Verifying Credentials..." : isRegister ? "Sign Up Account" : "Access Workspace"}
                </button>
              </form>

              {firebaseActive && (
                <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
                  <button
                    onClick={handleGoogleAuth}
                    disabled={authLoading}
                    className="w-full px-5 py-3 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-sora font-semibold tracking-wider text-[10px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" opacity="0.9"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="currentColor" opacity="0.8"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="currentColor" opacity="0.9"/>
                    </svg>
                    Continue with Google
                  </button>
                </div>
              )}

              <div className="text-center border-t border-white/5 pt-4">
                <button
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-[11px] font-semibold text-[#38BDF8] hover:underline"
                >
                  {isRegister ? "Already registered? Login here" : "Don't have an account? Sign up here"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* AUTHENTICATED CLIENT DASHBOARD */}
        {currentUser && (
          <div className="flex flex-col gap-10">
            
            {/* WELCOME BLOCK */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-8">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-widest font-sora flex items-center gap-1.5">
                  <Sparkles size={12} className="animate-pulse" /> Client Collaboration Suite
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sora">
                  Hello, {currentUser.displayName || currentUser.email.split("@")[0]}
                </h2>
                <p className="text-textMuted text-xs font-light">
                  Submit project proposals, review active operations, and directly coordinate designs with Shan.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!firebaseActive && (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-400/5 border border-amber-400/20 px-3 py-1.5 rounded-full flex items-center gap-1">
                    <AlertCircle size={10} /> Local Demo Mode
                  </span>
                )}
                {firebaseActive && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/5 border border-emerald-400/20 px-3 py-1.5 rounded-full flex items-center gap-1">
                    <ShieldCheck size={11} /> Cloud Secured Session
                  </span>
                )}
              </div>
            </div>

            {/* TAB SELECTOR BAR */}
            <div className="flex border-b border-white/5">
              <button
                onClick={() => setActiveTab("proposals")}
                className={`py-4 px-6 text-sm font-semibold font-sora tracking-wide relative flex items-center gap-2 transition-colors ${
                  activeTab === "proposals" ? "text-white font-bold" : "text-textMuted hover:text-white"
                }`}
              >
                <Briefcase size={16} />
                Project Proposals
                {activeTab === "proposals" && (
                  <motion.div layoutId="activePortalTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#38BDF8]" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("chat")}
                className={`py-4 px-6 text-sm font-semibold font-sora tracking-wide relative flex items-center gap-2 transition-colors ${
                  activeTab === "chat" ? "text-white font-bold" : "text-textMuted hover:text-white"
                }`}
              >
                <MessageSquare size={16} />
                Live Chat
                {unreadMessageCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#38BDF8] text-[#0A0A0A] font-sora font-extrabold text-[9px] shadow-[0_0_8px_rgba(56,189,248,0.5)] animate-pulse shrink-0">
                    {unreadMessageCount}
                  </span>
                )}
                {activeTab === "chat" && (
                  <motion.div layoutId="activePortalTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#38BDF8]" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("testimonial")}
                className={`py-4 px-6 text-sm font-semibold font-sora tracking-wide relative flex items-center gap-2 transition-colors ${
                  activeTab === "testimonial" ? "text-white font-bold" : "text-textMuted hover:text-white"
                }`}
              >
                <Star size={16} />
                Submit Testimonial
                {activeTab === "testimonial" && (
                  <motion.div layoutId="activePortalTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#38BDF8]" />
                )}
              </button>
            </div>

            {/* PORTAL TAB WORKSPACES */}
            <div className="min-h-[45vh]">
              
              {/* TAB 1: PROPOSALS MANAGER */}
              {activeTab === "proposals" && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-sora text-lg font-bold text-white tracking-tight">Project Proposals History</h3>
                      <p className="text-textMuted text-xs font-light">Submit new creative requests and track their status.</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowProposalForm(!showProposalForm);
                        setProposalSuccess("");
                      }}
                      className="px-5 py-3 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white font-sora font-semibold text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-md self-start shrink-0 cursor-pointer"
                    >
                      {showProposalForm ? "View Proposals History" : (
                        <>
                          <Plus size={15} />
                          New Project Proposal
                        </>
                      )}
                    </button>
                  </div>

                  {proposalSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-medium"
                    >
                      <CheckCircle size={18} className="shrink-0" />
                      <span>{proposalSuccess}</span>
                    </motion.div>
                  )}

                  {/* PROPOSAL BUILDER FORM */}
                  {showProposalForm ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 shadow-xl"
                    >
                      <h4 className="font-sora text-sm font-bold text-white tracking-tight border-b border-white/5 pb-3 mb-6">
                        Draft Project Proposal Requirements
                      </h4>

                      <form onSubmit={handleProposalSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold text-textSoft uppercase tracking-wider">Project Concept Title</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Next-Gen Enterprise E-Commerce Platform Redesign"
                            value={propTitle}
                            onChange={(e) => setPropTitle(e.target.value)}
                            className="glass-input p-3 text-xs font-light"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-textSoft uppercase tracking-wider">Service Subcategory</label>
                          <select
                            required
                            value={propService}
                            onChange={(e) => setPropService(e.target.value)}
                            className="glass-input p-3 text-xs font-light"
                          >
                            <option value="">Choose Service category...</option>
                            {services.length > 0 ? services.map(s => (
                              <option key={s.id} value={s.title}>{s.title}</option>
                            )) : (
                              <>
                                <option value="Web Development">Web Design & Fullstack Development</option>
                                <option value="UI/UX Engineering">UX Research & UI Prototyping</option>
                                <option value="Brand Identity">Digital Brand Guidelines</option>
                                <option value="SaaS Architecture">SaaS Development</option>
                              </>
                            )}
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-textSoft uppercase tracking-wider">Project Timeline</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 6 - 8 Weeks (Immediate launch)"
                            value={propTimeline}
                            onChange={(e) => setPropTimeline(e.target.value)}
                            className="glass-input p-3 text-xs font-light"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-textSoft uppercase tracking-wider">Estimated Budget Limit</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. $5,000 - $8,000"
                            value={propBudget}
                            onChange={(e) => setPropBudget(e.target.value)}
                            className="glass-input p-3 text-xs font-light"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold text-textSoft uppercase tracking-wider">Project Outline & Technical Needs</label>
                          <textarea
                            required
                            rows={5}
                            placeholder="Describe your design specifications, reference websites, functional details, etc..."
                            value={propDesc}
                            onChange={(e) => setPropDesc(e.target.value)}
                            className="glass-input p-3 text-xs font-light resize-none leading-relaxed"
                          />
                        </div>

                        <div className="md:col-span-2 border-t border-white/5 pt-4 flex justify-end gap-3 mt-2">
                          <button
                            type="button"
                            onClick={() => setShowProposalForm(false)}
                            className="px-5 py-3 rounded-full border border-white/5 hover:bg-white/5 text-textSoft font-sora font-semibold text-xs tracking-wider uppercase transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={proposalSubmitting}
                            className="px-5 py-3 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white font-sora font-semibold text-xs tracking-wider uppercase transition-all shadow-md disabled:opacity-50 cursor-pointer"
                          >
                            {proposalSubmitting ? "Submitting requirements..." : "Submit Proposal Draft"}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  ) : (
                    /* PROPOSALS LIST GRID */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {clientProposals.map((prop) => (
                        <div
                          key={prop.id}
                          className="glass-card p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col justify-between gap-5 relative group"
                        >
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-3">
                              <span className="text-[9px] uppercase tracking-widest text-[#38BDF8] bg-[#38BDF8]/5 border border-[#38BDF8]/10 px-2.5 py-1 rounded-full font-bold">
                                {prop.serviceType}
                              </span>
                              {renderStatusBadge(prop.status)}
                            </div>

                            <h4 className="font-sora text-sm font-semibold text-white tracking-tight leading-snug">
                              {prop.title}
                            </h4>

                            <p className="text-textSoft text-xs font-light leading-relaxed line-clamp-3">
                              {prop.description}
                            </p>
                          </div>

                          <div className="border-t border-white/5 pt-3 grid grid-cols-2 gap-2 text-[10px] text-textMuted font-light">
                            <div className="flex items-center gap-1.5">
                              <Building size={11} className="text-[#38BDF8]" />
                              <span>Timeline: <strong className="text-white font-semibold">{prop.timeline}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Folder size={11} className="text-[#38BDF8]" />
                              <span>Budget: <strong className="text-white font-semibold">{prop.budget}</strong></span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {clientProposals.length === 0 && (
                        <div className="md:col-span-2 text-center py-16 border border-dashed border-white/5 rounded-2xl bg-white/5 flex flex-col items-center gap-3">
                          <Briefcase size={32} className="text-textMuted/30" />
                          <span className="text-textMuted font-light text-xs">No project proposals submitted yet.</span>
                          <button
                            onClick={() => setShowProposalForm(true)}
                            className="mt-2 text-xs font-semibold text-[#38BDF8] hover:underline flex items-center gap-1"
                          >
                            <Plus size={13} /> Submit your first proposal
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 2: LIVE CHAT COLLABORATION */}
              {activeTab === "chat" && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl border border-white/5 shadow-xl flex flex-col h-[55vh] overflow-hidden"
                >
                  {/* Chat thread header */}
                  <div className="h-14 bg-white/3 border-b border-white/5 px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <div>
                        <h4 className="font-sora text-xs font-bold text-white tracking-tight">Direct Sync Thread</h4>
                        <span className="text-[9px] text-[#38BDF8] uppercase font-bold tracking-widest">Coordinating with Shan</span>
                      </div>
                    </div>
                  </div>

                  {/* Messages Bubble Container */}
                  <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4">
                    {clientThread.map((msg) => {
                      const isMe = msg.senderId === currentUser.uid;
                      return (
                        <div 
                          key={msg.id}
                          className={`flex flex-col max-w-[75%] gap-1 ${isMe ? "self-end items-end" : "self-start items-start"}`}
                        >
                          {/* Sender label */}
                          <span className="text-[9px] text-textMuted font-light px-1">
                            {isMe ? "You" : "Shan Ranathunga"} • {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          {/* Chat bubble body */}
                          <div 
                            className={`p-3 rounded-2xl text-xs font-light leading-relaxed ${
                              isMe 
                                ? "bg-[#007BFF] text-white rounded-tr-none shadow-md shadow-[#007BFF]/10 font-medium" 
                                : "bg-[#1E293B] text-textSoft rounded-tl-none border border-white/5"
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}

                    {clientThread.length === 0 && (
                      <div className="flex-grow flex flex-col items-center justify-center gap-3 py-10 opacity-40 text-center">
                        <MessageSquare size={32} className="text-[#38BDF8]" />
                        <h5 className="font-sora text-xs font-bold text-white">Start the Discussion</h5>
                        <p className="text-[10px] text-textMuted max-w-xs font-light">
                          Say hi! Introduce your project parameters or raise questions directly in this private channel.
                        </p>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Footer message composer bar */}
                  <form onSubmit={handleSendChatMessage} className="h-16 border-t border-white/5 px-4 flex items-center gap-3 shrink-0 bg-white/2">
                    <input
                      type="text"
                      placeholder="Write your sync message details here..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-grow glass-input px-4 py-2.5 text-xs font-light"
                    />
                    <button
                      type="submit"
                      className="p-2.5 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white shadow-md transition-all shrink-0 cursor-pointer"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* TAB 3: SUBMIT COLLABORATIVE TESTIMONIAL */}
              {activeTab === "testimonial" && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-xl mx-auto"
                >
                  <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 shadow-xl flex flex-col gap-6">
                    <div className="text-center flex flex-col items-center gap-2 pb-2">
                      <span className="p-3 rounded-full bg-[#007BFF]/10 border border-[#007BFF]/15 text-[#38BDF8]">
                        <Star size={24} className="fill-[#38BDF8]" />
                      </span>
                      <h3 className="font-sora text-lg font-bold text-white tracking-tight mt-2">Publish Collaboration Feedback</h3>
                      <p className="text-textMuted text-xs font-light max-w-md leading-relaxed">
                        Share your narrative review and project score rating to be integrated into Shan's dynamic portfolio landing page.
                      </p>
                    </div>

                    {testSuccess && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-medium"
                      >
                        <CheckCircle size={18} className="shrink-0" />
                        <span>{testSuccess}</span>
                      </motion.div>
                    )}

                    <form onSubmit={handleTestimonialSubmit} className="flex flex-col gap-5">
                      
                      {/* Interactive rating selector */}
                      <div className="flex flex-col gap-2 items-center">
                        <label className="text-[10px] font-bold text-textSoft uppercase tracking-wider">Project Score Score (1 - 5)</label>
                        <div className="flex items-center gap-2 p-2 px-4 rounded-full border border-white/5 bg-[#111827]/30">
                          {Array.from({ length: 5 }).map((_, idx) => {
                            const starValue = idx + 1;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setRating(starValue)}
                                className="p-1 rounded hover:bg-white/5 text-[#F59E0B] transition-colors cursor-pointer"
                              >
                                <Star
                                  size={24}
                                  fill={starValue <= rating ? "#F59E0B" : "none"}
                                  stroke={starValue <= rating ? "#F59E0B" : "rgba(255,255,255,0.2)"}
                                  className={starValue <= rating ? "drop-shadow-[0_0_6px_#F59E0B]" : ""}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Testimonial text */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-textSoft uppercase tracking-wider">Review Narrative</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Tell us about your experience collaborating with Shan Ranathunga! What goals did the product design accomplish?"
                          value={testimonialText}
                          onChange={(e) => setTestimonialText(e.target.value)}
                          className="glass-input p-3 text-xs font-light resize-none leading-relaxed"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={testSubmitting}
                        className="w-full px-6 py-3.5 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white font-sora font-semibold tracking-wider text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md mt-2"
                      >
                        {testSubmitting ? "Publishing review..." : "Submit Testimonial for Review"}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ClientPortal;
