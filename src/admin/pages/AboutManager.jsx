import React, { useState } from "react";
import { useSiteData } from "../../context/SiteDataContext";
import { 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Upload, 
  Plus, 
  X, 
  ArrowLeft, 
  ArrowRight,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";

const AboutManager = () => {
  const { about, saveAboutData } = useSiteData();

  // Local state managers
  const [paragraph, setParagraph] = useState(about.paragraph || "");
  const [avatar, setAvatar] = useState(about.avatar || "");
  const [skills, setSkills] = useState(about.skills || []);
  const [cvLink, setCvLink] = useState(about.cvLink || "");

  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");

  // Read upload, compress to WebP, and convert to Base64
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setAlertType("error");
        setAlertMsg("Original file exceeds 5MB. Use a smaller image.");
        return;
      }
      
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (ev) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 800;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) { height = (height / width) * maxDim; width = maxDim; }
            else { width = (width / height) * maxDim; height = maxDim; }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(img, 0, 0, width, height);
          setAvatar(canvas.toDataURL("image/webp", 0.75));
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Add tag
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) {
      setNewSkill("");
      return;
    }
    setSkills([...skills, newSkill.trim()]);
    setNewSkill("");
  };

  // Delete tag
  const handleDeleteSkill = (skillToDelete) => {
    setSkills(skills.filter(s => s !== skillToDelete));
  };

  // Move skill (reorder dragging simulation)
  const handleMoveSkill = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= skills.length) return;

    const copy = [...skills];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setSkills(copy);
  };

  // Submit all
  const handleSave = async (e) => {
    e.preventDefault();
    if (!paragraph.trim()) {
      setAlertType("error");
      setAlertMsg("About narrative bio is required.");
      return;
    }

    setSaving(true);
    setAlertMsg("");

    try {
      await saveAboutData({
        paragraph: paragraph.trim(),
        avatar,
        skills,
        cvLink: cvLink.trim()
      });
      setAlertType("success");
      setAlertMsg("About section configurations successfully saved!");
    } catch (err) {
      console.error(err);
      setAlertType("error");
      setAlertMsg("Failed to save changes: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="font-sora text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          About Manager
        </h2>
        <p className="text-textMuted text-xs md:text-sm font-light">
          Manage your personal biography statement, profile photograph base64 values, skill pill tags, and resume links.
        </p>
      </div>

      {/* Notification */}
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

      {/* Grid divisions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Columns: Photo and Bio Forms */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <form onSubmit={handleSave} className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col gap-6">
            <h3 className="font-sora text-base font-bold text-white tracking-tight border-b border-white/5 pb-3">
              Configure About Information
            </h3>

            {/* Profile Avatar Uploader */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl border border-white/5 bg-white/5">
              <div className="w-24 h-24 rounded-full overflow-hidden border border-white/10 shrink-0 bg-[#0A0A0A] flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt="About Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-textMuted font-light">No Image</span>
                )}
              </div>
              
              <div className="flex flex-col gap-2 flex-grow w-full">
                <span className="text-xs font-bold text-white">Profile Photo</span>
                <span className="text-[10px] text-textMuted font-light">
                  Select a JPG or PNG picture. Replaced immediately and converted to a local Base64 string under 2MB.
                </span>
                
                <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs text-white font-semibold cursor-pointer transition-all self-start">
                  <Upload size={14} className="text-[#38BDF8]" />
                  <span>Choose Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Bio textarea */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSoft uppercase tracking-wider">Biography Narrative (Rich Bio)</label>
              <textarea
                required
                rows={6}
                placeholder="Write your professional summary details..."
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
                className="glass-input p-3.5 text-xs font-light resize-none leading-relaxed"
              />
            </div>

            {/* CV Resume link */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSoft uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={13} className="text-[#38BDF8]" />
                Resume (CV) Document Link URL
              </label>
              <input
                type="text"
                placeholder="e.g. # or an absolute PDF link URL"
                value={cvLink}
                onChange={(e) => setCvLink(e.target.value)}
                className="glass-input p-3.5 text-xs font-light"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="mt-2 w-full px-5 py-3.5 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white font-sora font-semibold tracking-wider uppercase text-xs transition-all duration-350 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={14} />
              {saving ? "Saving Changes..." : "Publish About Changes"}
            </button>
          </form>
        </div>

        {/* Right Columns: Skills Tag Manager */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col gap-5">
            <h3 className="font-sora text-base font-bold text-white tracking-tight border-b border-white/5 pb-3">
              Skills Tag Builder
            </h3>

            {/* Add Skill tag inline form */}
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                placeholder="Add new skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="glass-input p-3 flex-grow text-xs font-light"
              />
              <button
                type="submit"
                className="p-3 rounded-lg bg-[#007BFF] text-white hover:bg-blue-600 transition-colors shadow-md flex items-center justify-center"
              >
                <Plus size={16} />
              </button>
            </form>

            {/* Reorderable Skills tag list */}
            <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
              {skills.map((skill, index) => (
                <div
                  key={skill}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/5"
                >
                  <span className="text-xs font-semibold text-textSoft">{skill}</span>
                  
                  <div className="flex items-center gap-1.5">
                    {/* Move up */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveSkill(index, -1)}
                      className="p-1 rounded bg-white/5 text-textMuted hover:text-white disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowLeft size={12} className="rotate-90" />
                    </button>
                    {/* Move down */}
                    <button
                      type="button"
                      disabled={index === skills.length - 1}
                      onClick={() => handleMoveSkill(index, 1)}
                      className="p-1 rounded bg-white/5 text-textMuted hover:text-white disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowRight size={12} className="rotate-90" />
                    </button>
                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(skill)}
                      className="p-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-white transition-colors"
                      title="Delete Skill"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))}

              {skills.length === 0 && (
                <span className="text-center py-6 text-textMuted font-light text-xs">
                  No skill tags defined yet.
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutManager;
