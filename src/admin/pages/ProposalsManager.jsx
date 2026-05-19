import React, { useState } from "react";
import { useSiteData } from "../../context/SiteDataContext";
import { 
  ClipboardList, 
  Check, 
  X, 
  CheckCircle2, 
  Clock, 
  Building, 
  User, 
  Mail, 
  ArrowRight,
  Filter,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProposalsManager = () => {
  const { proposals, updateProposalStatus } = useSiteData();
  const [filter, setFilter] = useState("all");
  const [selectedProposal, setSelectedProposal] = useState(null);

  // Status-based color selectors
  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      case "rejected":
        return "bg-red-500/10 border-red-500/20 text-red-400";
      case "completed":
        return "bg-[#007BFF]/10 border-[#007BFF]/20 text-[#38BDF8]";
      default:
        return "bg-amber-500/10 border-amber-500/20 text-amber-400";
    }
  };

  // Filter proposals list
  const filteredProposals = proposals.filter(p => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8 text-[#F5F5F5]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-widest font-sora flex items-center gap-1.5">
            <ClipboardList size={12} /> Design & Project Requests
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sora">
            Project Proposals Manager
          </h2>
          <p className="text-textMuted text-xs font-light">
            Review detailed client requirements, evaluate project scope budgets, and coordinate workflows.
          </p>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
        <span className="text-[10px] font-bold text-textSoft uppercase tracking-wider flex items-center gap-1.5 mr-2">
          <Filter size={12} /> Filter Proposals:
        </span>
        {["all", "pending", "approved", "completed", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-xs font-semibold capitalize font-sora transition-all cursor-pointer ${
              filter === status
                ? "bg-[#007BFF] text-white shadow-md shadow-[#007BFF]/20 font-bold"
                : "border border-white/5 bg-white/5 text-textSoft hover:border-white/15"
            }`}
          >
            {status === "all" ? "Show All" : status === "approved" ? "Accepted" : status === "rejected" ? "Declined" : status}
          </button>
        ))}
      </div>

      {/* MAIN CONTAINER CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LIST COLUMN */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <h3 className="font-sora text-sm font-bold text-white tracking-tight">
            Incoming Proposals Queue ({filteredProposals.length})
          </h3>

          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {filteredProposals.map((prop) => (
              <div
                key={prop.id}
                onClick={() => setSelectedProposal(prop)}
                className={`glass-card p-5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-4 relative group ${
                  selectedProposal?.id === prop.id 
                    ? "border-[#38BDF8] bg-white/5 shadow-md shadow-[#38BDF8]/5" 
                    : "border-white/5 hover:border-white/15 hover:bg-white/3"
                }`}
              >
                <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-widest text-[#38BDF8] bg-[#38BDF8]/5 border border-[#38BDF8]/10 px-2.5 py-0.5 rounded-full font-bold self-start">
                      {prop.serviceType}
                    </span>
                    <h4 className="font-sora text-sm font-semibold text-white tracking-tight leading-snug group-hover:text-[#38BDF8] transition-colors mt-1.5">
                      {prop.title}
                    </h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-extrabold tracking-wider border shrink-0 ${getStatusStyle(prop.status)}`}>
                    {prop.status === "approved" ? "Accepted" : prop.status === "rejected" ? "Declined" : prop.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] text-textMuted font-light">
                  <div className="flex items-center gap-1.5 truncate">
                    <User size={11} className="text-[#38BDF8] shrink-0" />
                    <span className="truncate">{prop.clientName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Building size={11} className="text-[#38BDF8] shrink-0" />
                    <span className="truncate">{prop.budget}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end text-right">
                    <span className="text-[10px] text-[#38BDF8] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Inspect <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredProposals.length === 0 && (
              <div className="text-center py-16 border border-dashed border-white/5 rounded-2xl bg-white/5 flex flex-col items-center gap-3">
                <ClipboardList size={32} className="text-textMuted/30" />
                <span className="text-textMuted font-light text-xs">No project proposals found matching criteria.</span>
              </div>
            )}
          </div>
        </div>

        {/* DETAILS COLUMN */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {selectedProposal ? (
              <motion.div
                key={selectedProposal.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-6"
              >
                <div className="border-b border-white/5 pb-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Proposal Details</span>
                    <span className={`px-3 py-1 rounded-full text-[9px] uppercase font-bold tracking-wider border ${getStatusStyle(selectedProposal.status)}`}>
                      {selectedProposal.status === "approved" ? "Accepted" : selectedProposal.status === "rejected" ? "Declined" : selectedProposal.status}
                    </span>
                  </div>
                  <h3 className="font-sora text-base font-extrabold text-white tracking-tight leading-snug">
                    {selectedProposal.title}
                  </h3>
                </div>

                {/* Meta details */}
                <div className="flex flex-col gap-3 p-4 rounded-2xl border border-white/5 bg-[#0F172A]/30 text-xs font-light text-textSoft">
                  <div className="flex items-center gap-2.5">
                    <User size={13} className="text-[#38BDF8]" />
                    <span>Client: <strong className="text-white font-medium">{selectedProposal.clientName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail size={13} className="text-[#38BDF8]" />
                    <span>Email: <strong className="text-white font-medium break-all">{selectedProposal.clientEmail}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ClipboardList size={13} className="text-[#38BDF8]" />
                    <span>Scope category: <strong className="text-white font-medium">{selectedProposal.serviceType}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Building size={13} className="text-[#38BDF8]" />
                    <span>Requested budget: <strong className="text-white font-medium text-emerald-400">{selectedProposal.budget}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock size={13} className="text-[#38BDF8]" />
                    <span>Launch timeline: <strong className="text-white font-medium">{selectedProposal.timeline}</strong></span>
                  </div>
                </div>

                {/* Outline */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-textSoft uppercase tracking-wider">Project Outline Specs</span>
                  <div className="p-4 rounded-2xl border border-white/5 bg-white/2 text-xs font-light leading-relaxed max-h-[220px] overflow-y-auto text-textSoft whitespace-pre-line">
                    {selectedProposal.description}
                  </div>
                </div>

                {/* WORKFLOW CONTROLS */}
                <div className="border-t border-white/5 pt-5 flex flex-col gap-3 mt-2">
                  <span className="text-[10px] font-bold text-textSoft uppercase tracking-wider text-center">Update Operations Workflow</span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProposal.status === "pending" && (
                      <>
                        <button
                          onClick={() => {
                            updateProposalStatus(selectedProposal.id, "approved");
                            setSelectedProposal(prev => ({ ...prev, status: "approved" }));
                          }}
                          className="px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-950/20"
                        >
                          <Check size={14} /> Accept
                        </button>
                        <button
                          onClick={() => {
                            updateProposalStatus(selectedProposal.id, "rejected");
                            setSelectedProposal(prev => ({ ...prev, status: "rejected" }));
                          }}
                          className="px-4 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-sora font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-950/20"
                        >
                          <X size={14} /> Decline
                        </button>
                      </>
                    )}

                    {selectedProposal.status === "approved" && (
                      <button
                        onClick={() => {
                          updateProposalStatus(selectedProposal.id, "completed");
                          setSelectedProposal(prev => ({ ...prev, status: "completed" }));
                        }}
                        className="px-4 py-3 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white font-sora font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 col-span-2 cursor-pointer shadow-md shadow-blue-950/20"
                      >
                        <CheckCircle2 size={14} /> Mark Operations Completed
                      </button>
                    )}

                    {selectedProposal.status === "completed" && (
                      <div className="p-3.5 rounded-full border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 font-sora font-bold text-xs uppercase tracking-wider text-center col-span-2 flex items-center justify-center gap-2 animate-pulse">
                        <CheckCircle2 size={14} /> Fully Accomplished & Archived
                      </div>
                    )}

                    {selectedProposal.status === "rejected" && (
                      <div className="p-3.5 rounded-full border border-red-500/10 bg-red-500/5 text-red-400 font-sora font-bold text-xs uppercase tracking-wider text-center col-span-2 flex items-center justify-center gap-2">
                        <X size={14} /> Declined & Closed
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl bg-white/3 flex flex-col items-center gap-3">
                <Eye size={36} className="text-textMuted/30" />
                <h4 className="font-sora text-sm font-bold text-white tracking-tight">Review Inspector Pane</h4>
                <p className="text-textMuted text-xs font-light max-w-xs leading-relaxed">
                  Select a project proposal from the incoming queue on the left to inspect budget figures, timeline boundaries, and technical parameters.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};

export default ProposalsManager;
