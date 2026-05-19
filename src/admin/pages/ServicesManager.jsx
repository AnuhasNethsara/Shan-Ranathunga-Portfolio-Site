import React, { useState } from "react";
import { useSiteData } from "../../context/SiteDataContext";
import * as LucideIcons from "lucide-react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  X, 
  CheckCircle,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper dynamic icon
const DynamicIcon = ({ name, ...props }) => {
  const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;
  return <IconComponent {...props} />;
};

// Popular icons to recommend
const recommendedIcons = [
  "Layers",
  "Youtube",
  "Sparkles",
  "Megaphone",
  "Globe",
  "Palette",
  "Brush",
  "Video",
  "Flame",
  "PenTool",
  "Award",
  "Monitor"
];

const ServicesManager = () => {
  const { services, addService, editService, deleteService, reorderServices } = useSiteData();

  // Modal Control
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // null means adding

  // Form Fields
  const [title, setTitle] = useState("");
  const [iconName, setIconName] = useState("Sparkles");
  const [description, setDescription] = useState("");

  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");

  // Add Project
  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setIconName("Sparkles");
    setDescription("");
    setShowModal(true);
  };

  // Edit Project
  const handleOpenEdit = (serv) => {
    setEditingId(serv.id);
    setTitle(serv.title || "");
    setIconName(serv.iconName || "Sparkles");
    setDescription(serv.description || "");
    setShowModal(true);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Title and description are required.");
      return;
    }

    setSaving(true);
    setAlertMsg("");

    try {
      const payload = {
        title: title.trim(),
        iconName: iconName.trim(),
        description: description.trim()
      };

      if (editingId) {
        await editService(editingId, payload);
        setAlertType("success");
        setAlertMsg("Service edited successfully!");
      } else {
        await addService(payload);
        setAlertType("success");
        setAlertMsg("New service card published successfully!");
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setAlertType("error");
      setAlertMsg("Failed to save service: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this service card?")) {
      try {
        await deleteService(id);
        setAlertType("success");
        setAlertMsg("Service card successfully deleted!");
      } catch (err) {
        console.error(err);
        setAlertType("error");
        setAlertMsg("Failed to delete service: " + err.message);
      }
    }
  };

  // Move
  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const copy = [...services];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    try {
      await reorderServices(copy);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-sora text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Services Manager
          </h2>
          <p className="text-textMuted text-xs md:text-sm font-light">
            Build and optimize the visual services that appear inside the public 2x2 grid.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white font-sora font-semibold text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-md shrink-0"
        >
          <Plus size={15} />
          Add New Service
        </button>
      </div>

      {/* Notification banner */}
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

      {/* Grid structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((serv, idx) => (
          <div
            key={serv.id}
            className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 shadow-lg flex flex-col justify-between gap-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-[#38BDF8]">
                <DynamicIcon name={serv.iconName || "Sparkles"} size={22} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-sora text-base font-bold text-white tracking-tight leading-tight">{serv.title}</h3>
                <span className="text-[10px] text-textMuted font-mono">Icon: {serv.iconName}</span>
                <p className="text-textMuted text-xs font-light leading-relaxed mt-2">
                  {serv.description}
                </p>
              </div>
            </div>

            {/* Actions footer */}
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              {/* Order */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMove(idx, -1)}
                  disabled={idx === 0}
                  className="p-1.5 rounded bg-white/5 text-textMuted hover:text-white disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={() => handleMove(idx, 1)}
                  disabled={idx === services.length - 1}
                  className="p-1.5 rounded bg-white/5 text-textMuted hover:text-white disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown size={12} />
                </button>
              </div>

              {/* Edit/Delete */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(serv)}
                  className="p-2 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                  title="Edit Service"
                >
                  <Edit size={13} />
                </button>
                <button
                  onClick={() => handleDelete(serv.id)}
                  className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                  title="Delete Service"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="md:col-span-2 text-center py-16 border border-dashed border-white/5 rounded-2xl bg-white/5 flex flex-col items-center gap-3">
            <HelpCircle size={32} className="text-textMuted/30" />
            <span className="text-textMuted font-light text-xs">No services added yet.</span>
          </div>
        )}
      </div>

      {/* ADD / EDIT SERVICE LIGHTBOX MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative max-w-lg w-full rounded-2xl glass-card shadow-2xl p-6 md:p-8 z-10 border border-white/10"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-white/5 text-textMuted hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <h3 className="font-sora text-base font-bold text-white tracking-tight border-b border-white/5 pb-3 mb-5">
                {editingId ? "Edit Service Card" : "Add New Service Card"}
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-textSoft uppercase tracking-wider">Service Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Social Media Design"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="glass-input p-3 text-xs font-light"
                  />
                </div>

                {/* Icon Name with Recommended grid */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-textSoft uppercase tracking-wider">Lucide Icon Name</label>
                    <div className="flex items-center gap-1.5 text-xs text-[#38BDF8] font-semibold">
                      <span className="text-[10px] text-textMuted font-mono">Live Preview:</span>
                      <div className="p-1 rounded bg-white/5">
                        <DynamicIcon name={iconName} size={14} />
                      </div>
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sparkles"
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="glass-input p-3 text-xs font-light"
                  />

                  {/* Recommendations */}
                  <div className="flex flex-col gap-2 mt-1.5">
                    <span className="text-[9px] font-bold text-textMuted uppercase tracking-wider">Popular Graphics Icons:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {recommendedIcons.map((rec) => (
                        <button
                          key={rec}
                          type="button"
                          onClick={() => setIconName(rec)}
                          className={`px-2 py-1 rounded text-[9px] font-medium border transition-colors flex items-center gap-1 ${
                            iconName === rec
                              ? "bg-[#007BFF]/20 border-[#007BFF] text-white"
                              : "bg-white/5 border-white/5 text-textMuted hover:text-white"
                          }`}
                        >
                          <DynamicIcon name={rec} size={10} />
                          {rec}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-textSoft uppercase tracking-wider">Service Scope Description</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="List the exact visual assets provided (e.g., Instagram posts, stories, stories grids, ad carousels)..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="glass-input p-3 text-xs font-light resize-none leading-relaxed"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-3 w-full px-5 py-3 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white font-sora font-semibold tracking-wider uppercase text-[10px] transition-all duration-350 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? "Publishing Service..." : editingId ? "Save Service Edits" : "Publish Service Card"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ServicesManager;
