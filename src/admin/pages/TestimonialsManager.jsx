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
  Star,
  CheckCircle,
  AlertCircle,
  MessageSquareHeart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TestimonialsManager = () => {
  const { testimonials, addTestimonial, editTestimonial, deleteTestimonial, reorderTestimonials } = useSiteData();

  // Modal Control
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // null means adding

  // Form Fields
  const [clientName, setClientName] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [avatar, setAvatar] = useState("");

  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");

  // Open modal for Adding
  const handleOpenAdd = () => {
    setEditingId(null);
    setClientName("");
    setRating(5);
    setReviewText("");
    setAvatar("");
    setShowModal(true);
  };

  // Open modal for Editing
  const handleOpenEdit = (test) => {
    setEditingId(test.id);
    setClientName(test.clientName || "");
    setRating(test.rating || 5);
    setReviewText(test.reviewText || "");
    setAvatar(test.avatar || "");
    setShowModal(true);
  };

  // Read upload and convert to Base64
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        alert("Avatar size exceeds 1MB limit.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !reviewText.trim()) {
      alert("Client name and review content are required.");
      return;
    }

    setSaving(true);
    setAlertMsg("");

    try {
      const payload = {
        clientName: clientName.trim(),
        rating,
        reviewText: reviewText.trim(),
        avatar
      };

      if (editingId) {
        await editTestimonial(editingId, payload);
        setAlertType("success");
        setAlertMsg("Testimonial edited successfully!");
      } else {
        await addTestimonial(payload);
        setAlertType("success");
        setAlertMsg("New testimonial published successfully!");
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setAlertType("error");
      setAlertMsg("Failed to save testimonial: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this client testimonial?")) {
      try {
        await deleteTestimonial(id);
        setAlertType("success");
        setAlertMsg("Testimonial successfully deleted!");
      } catch (err) {
        console.error(err);
        setAlertType("error");
        setAlertMsg("Failed to delete testimonial: " + err.message);
      }
    }
  };

  // Move
  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;

    const copy = [...testimonials];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    try {
      await reorderTestimonials(copy);
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
            Testimonials Manager
          </h2>
          <p className="text-textMuted text-xs md:text-sm font-light">
            Review, add, edit, or sort reviews from clients showing on the public website.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white font-sora font-semibold text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-md shrink-0"
        >
          <Plus size={15} />
          Add Testimonial
        </button>
      </div>

      {/* Alert Banner */}
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

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((test, idx) => (
          <div
            key={test.id}
            className="glass-card p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col justify-between gap-5"
          >
            <div className="flex flex-col gap-4">
              {/* Star line */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < test.rating ? "#F59E0B" : "none"}
                    stroke={i < test.rating ? "#F59E0B" : "rgba(255,255,255,0.1)"}
                  />
                ))}
              </div>
              
              <p className="text-textSoft text-xs italic font-light leading-relaxed">
                "{test.reviewText}"
              </p>

              {/* Client Profile */}
              <div className="flex items-center gap-3 border-t border-white/5 pt-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0 bg-[#0A0A0A] flex items-center justify-center">
                  {test.avatar ? (
                    <img src={test.avatar} alt={test.clientName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-bold text-white uppercase">
                      {test.clientName ? test.clientName.split(" ").map(w => w[0]).join("") : "C"}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-sora text-xs font-semibold text-white tracking-tight">{test.clientName}</h4>
                  <span className="text-[9px] text-[#38BDF8] uppercase font-bold tracking-widest">Verified client</span>
                </div>
              </div>
            </div>

            {/* Actions footer */}
            <div className="flex items-center justify-between border-t border-white/5 pt-3">
              {/* Sort */}
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
                  disabled={idx === testimonials.length - 1}
                  className="p-1.5 rounded bg-white/5 text-textMuted hover:text-white disabled:opacity-30"
                  title="Move Right/Down"
                >
                  <ArrowDown size={12} />
                </button>
              </div>

              {/* Edit/Delete */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(test)}
                  className="p-2 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                  title="Edit Review"
                >
                  <Edit size={13} />
                </button>
                <button
                  onClick={() => handleDelete(test.id)}
                  className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                  title="Delete Review"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 text-center py-16 border border-dashed border-white/5 rounded-2xl bg-white/5 flex flex-col items-center gap-3">
            <MessageSquareHeart size={32} className="text-textMuted/30" />
            <span className="text-textMuted font-light text-xs">No client reviews added yet.</span>
          </div>
        )}
      </div>

      {/* ADD / EDIT TESTIMONIAL LIGHTBOX MODAL */}
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
                {editingId ? "Edit Client Review" : "Add Client Review"}
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {/* Avatar Photo Base64 Uploader */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-[#0A0A0A] shrink-0 flex items-center justify-center border border-white/10">
                    {avatar ? (
                      <img src={avatar} alt="Avatar Upload Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] text-textMuted font-light">Initials</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 w-full flex-grow">
                    <span className="text-xs font-bold text-white">Client Avatar Photo (Optional)</span>
                    <label className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded bg-[#007BFF] hover:bg-blue-600 text-[10px] font-semibold text-white cursor-pointer transition-colors self-start">
                      <Upload size={12} />
                      Choose File
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Client Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-textSoft uppercase tracking-wider">Client Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Chen"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="glass-input p-3 text-xs font-light"
                  />
                </div>

                {/* Star rating selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-textSoft uppercase tracking-wider">Star Rating (1 - 5)</label>
                  <div className="flex items-center gap-1.5 p-3 rounded-lg border border-white/5 bg-[#111827]/50">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const starValue = idx + 1;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setRating(starValue)}
                          className="p-1 rounded hover:bg-white/5 text-[#F59E0B] transition-colors"
                        >
                          <Star
                            size={20}
                            fill={starValue <= rating ? "#F59E0B" : "none"}
                            stroke={starValue <= rating ? "#F59E0B" : "rgba(255,255,255,0.2)"}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Review Text */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-textSoft uppercase tracking-wider">Review Narrative</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter the client's testimonial feedback commentary..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="glass-input p-3 text-xs font-light resize-none leading-relaxed"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-3 w-full px-5 py-3 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white font-sora font-semibold tracking-wider uppercase text-[10px] transition-all duration-350 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? "Publishing Review..." : editingId ? "Save Review Edits" : "Publish Client Review"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TestimonialsManager;
