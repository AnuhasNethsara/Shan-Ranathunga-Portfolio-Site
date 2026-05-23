import React, { useState } from "react";
import { useSiteData } from "../../context/SiteDataContext";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  X, 
  CheckCircle,
  AlertCircle,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["Thumbnails", "Social Media", "Branding", "Posters", "Logos", "UI"];

const PortfolioManager = () => {
  const { portfolio, addProject, editProject, deleteProject, reorderProjects } = useSiteData();

  // Modal Control
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // null means adding

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Thumbnails");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [tools, setTools] = useState("");

  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");

  // Open modal for Adding
  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setCategory("Thumbnails");
    setImage("");
    setDescription("");
    setTools("");
    setShowModal(true);
  };

  // Open modal for Editing
  const handleOpenEdit = (proj) => {
    setEditingId(proj.id);
    setTitle(proj.title || "");
    setCategory(proj.category || "Thumbnails");
    setImage(proj.image || "");
    setDescription(proj.description || "");
    
    // Tools can be array or string
    if (proj.tools) {
      setTools(Array.isArray(proj.tools) ? proj.tools.join(", ") : proj.tools);
    } else {
      setTools("");
    }
    setShowModal(true);
  };

  // Read upload, compress to WebP, and convert to Base64
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Original file size exceeds 5MB limit. Please use a smaller image.");
        return;
      }
      
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (ev) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = (height / width) * maxDim;
              width = maxDim;
            } else {
              width = (width / height) * maxDim;
              height = maxDim;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to WebP at 70% quality — keeps it well under Firestore's 1MB field limit
          const dataUrl = canvas.toDataURL("image/webp", 0.7);
          setImage(dataUrl);
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
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

    // Standardize tools
    const toolsArray = tools.split(",")
      .map(t => t.trim())
      .filter(t => t !== "");

    try {
      const payload = {
        title: title.trim(),
        category,
        image,
        description: description.trim(),
        tools: toolsArray
      };

      if (editingId) {
        await editProject(editingId, payload);
        setAlertType("success");
        setAlertMsg("Portfolio project successfully edited!");
      } else {
        await addProject(payload);
        setAlertType("success");
        setAlertMsg("New portfolio project successfully published!");
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setAlertType("error");
      setAlertMsg("Failed to save project: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this portfolio project?")) {
      try {
        await deleteProject(id);
        setAlertType("success");
        setAlertMsg("Project successfully deleted!");
      } catch (err) {
        console.error(err);
        setAlertType("error");
        setAlertMsg("Failed to delete project: " + err.message);
      }
    }
  };

  // Move / Sort
  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= portfolio.length) return;

    const copy = [...portfolio];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    
    try {
      await reorderProjects(copy);
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
            Portfolio Manager
          </h2>
          <p className="text-textMuted text-xs md:text-sm font-light">
            Add, edit, delete, or reorder design projects inside your public bento portfolio grid.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white font-sora font-semibold text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-md shrink-0"
        >
          <Plus size={15} />
          Add New Project
        </button>
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

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {portfolio.map((proj, idx) => (
          <div
            key={proj.id}
            className="glass-card rounded-2xl overflow-hidden border border-white/5 shadow-lg flex flex-col justify-between"
          >
            {/* Visual Header */}
            <div>
              <div className="w-full aspect-[16/10] bg-[#0A0A0A] relative border-b border-white/5 overflow-hidden">
                {proj.image ? (
                  <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-textMuted text-xs font-light">No Image</span>
                )}
                
                {/* Category overlay label */}
                <span className="absolute top-3 left-3 text-[9px] font-bold text-[#38BDF8] uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#0F172A]/85 border border-[#38BDF8]/20">
                  {proj.category}
                </span>
              </div>

              {/* Text Info */}
              <div className="p-5 flex flex-col gap-2">
                <h3 className="font-sora text-sm font-bold text-white tracking-tight leading-tight">{proj.title}</h3>
                <p className="text-textMuted text-xs font-light line-clamp-2 leading-relaxed">
                  {proj.description || "No description provided."}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {proj.tools && (Array.isArray(proj.tools) ? proj.tools : proj.tools.split(",")).map((t, index) => (
                    <span key={index} className="px-2 py-0.5 rounded text-[9px] font-medium bg-white/5 border border-white/5 text-textSoft">
                      {t.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="px-5 pb-5 pt-3 border-t border-white/5 flex items-center justify-between">
              {/* Move / Reorder */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMove(idx, -1)}
                  disabled={idx === 0}
                  className="p-1.5 rounded bg-white/5 text-textMuted hover:text-white disabled:opacity-30"
                  title="Move Left/Up"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={() => handleMove(idx, 1)}
                  disabled={idx === portfolio.length - 1}
                  className="p-1.5 rounded bg-white/5 text-textMuted hover:text-white disabled:opacity-30"
                  title="Move Right/Down"
                >
                  <ArrowDown size={12} />
                </button>
              </div>

              {/* Edit / Delete */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(proj)}
                  className="p-2 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                  title="Edit Project"
                >
                  <Edit size={13} />
                </button>
                <button
                  onClick={() => handleDelete(proj.id)}
                  className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                  title="Delete Project"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {portfolio.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3 text-center py-16 border border-dashed border-white/5 rounded-2xl bg-white/5 flex flex-col items-center gap-3">
            <Briefcase size={32} className="text-textMuted/30" />
            <span className="text-textMuted font-light text-xs">No portfolio projects added yet.</span>
          </div>
        )}
      </div>

      {/* ADD / EDIT PROJECT LIGHTBOX MODAL */}
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
              className="relative max-w-xl w-full rounded-2xl overflow-y-auto no-scrollbar max-h-[90vh] glass-card shadow-2xl p-6 md:p-8 z-10 border border-white/10"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-white/5 text-textMuted hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <h3 className="font-sora text-base font-bold text-white tracking-tight border-b border-white/5 pb-3 mb-5">
                {editingId ? "Edit Design Project" : "Add New Design Project"}
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Image Base64 Uploader */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5">
                  <div className="w-24 h-16 rounded-md overflow-hidden bg-[#0A0A0A] shrink-0 flex items-center justify-center border border-white/10">
                    {image ? (
                      <img src={image} alt="Upload Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] text-textMuted font-light">Preview</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 w-full flex-grow">
                    <span className="text-xs font-bold text-white">Project Visual Thumbnail</span>
                    <label className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded bg-[#007BFF] hover:bg-blue-600 text-[10px] font-semibold text-white cursor-pointer transition-colors self-start">
                      <Upload size={12} />
                      Choose File
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-textSoft uppercase tracking-wider">Project Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Esports Branding"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="glass-input p-3 text-xs font-light"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-textSoft uppercase tracking-wider">Category Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="glass-input p-3 text-xs font-light cursor-pointer appearance-none bg-surface"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#0A0A0A] text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tools Used */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-textSoft uppercase tracking-wider">Tools Applied (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="Photoshop, Illustrator, Color Theory"
                    value={tools}
                    onChange={(e) => setTools(e.target.value)}
                    className="glass-input p-3 text-xs font-light"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-textSoft uppercase tracking-wider">Project Overview Description</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide a detailed visual commentary..."
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
                  {saving ? "Publishing Project..." : editingId ? "Save Project Edits" : "Publish Project"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PortfolioManager;
