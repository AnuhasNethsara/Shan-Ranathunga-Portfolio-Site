import React, { useState } from "react";
import { useSiteData } from "../../context/SiteDataContext";
import { Save, AlertCircle, CheckCircle, Smartphone, Monitor } from "lucide-react";
import { motion } from "framer-motion";

const HeroManager = () => {
  const { hero, saveHeroData } = useSiteData();

  // Local state to track forms before save
  const [availabilityBadge, setAvailabilityBadge] = useState(hero.availabilityBadge || "");
  const [name, setName] = useState(hero.name || "");
  const [title, setTitle] = useState(hero.title || "");
  const [description, setDescription] = useState(hero.description || "");
  const [button1Label, setButton1Label] = useState(hero.button1Label || "");
  const [button1ScrollTarget, setButton1ScrollTarget] = useState(hero.button1ScrollTarget || "");
  const [button2Label, setButton2Label] = useState(hero.button2Label || "");
  const [button2ScrollTarget, setButton2ScrollTarget] = useState(hero.button2ScrollTarget || "");

  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");

  // Visual Mock preview viewport mode
  const [previewDevice, setPreviewDevice] = useState("desktop");

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !title.trim() || !description.trim()) {
      setAlertType("error");
      setAlertMsg("Name, H1 Title, and description are required.");
      return;
    }

    setSaving(true);
    setAlertMsg("");

    try {
      await saveHeroData({
        availabilityBadge: availabilityBadge.trim(),
        name: name.trim(),
        title: title.trim(),
        description: description.trim(),
        button1Label: button1Label.trim(),
        button1ScrollTarget: button1ScrollTarget.trim(),
        button2Label: button2Label.trim(),
        button2ScrollTarget: button2ScrollTarget.trim(),
      });
      setAlertType("success");
      setAlertMsg("Hero landing configurations successfully saved!");
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
          Hero Manager
        </h2>
        <p className="text-textMuted text-xs md:text-sm font-light">
          Modify the primary landing statement of your single-page portfolio, complete with immediate visual feedback preview.
        </p>
      </div>

      {/* Save Notification banner */}
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

      {/* Side-by-Side Splits */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Editing Fields */}
        <form onSubmit={handleSave} className="xl:col-span-6 flex flex-col gap-6">
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col gap-5">
            <h3 className="font-sora text-base font-bold text-white tracking-tight border-b border-white/5 pb-3">
              Configure Landing Information
            </h3>

            {/* Availability badge */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSoft uppercase tracking-wider">Availability Badge</label>
              <input
                type="text"
                placeholder="e.g. ✦ Available for Freelance"
                value={availabilityBadge}
                onChange={(e) => setAvailabilityBadge(e.target.value)}
                className="glass-input p-3.5 text-xs font-light"
              />
            </div>

            {/* Name (H1) */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSoft uppercase tracking-wider">H1 Name Header</label>
              <input
                type="text"
                required
                placeholder="e.g. Shan Ranathunga"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input p-3.5 text-xs font-light"
              />
            </div>

            {/* Title (H2) */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSoft uppercase tracking-wider">H2 Subtitle / Profession</label>
              <input
                type="text"
                required
                placeholder="e.g. Freelance Graphic Designer & Visual Artist"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-input p-3.5 text-xs font-light"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSoft uppercase tracking-wider">Narrative Description</label>
              <textarea
                required
                rows={3}
                placeholder="Briefly state your specialties and scope..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass-input p-3.5 text-xs font-light resize-none"
              />
            </div>

            {/* Action Button 1 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textSoft uppercase tracking-wider">Button 1 Label</label>
                <input
                  type="text"
                  value={button1Label}
                  onChange={(e) => setButton1Label(e.target.value)}
                  className="glass-input p-3.5 text-xs font-light"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textSoft uppercase tracking-wider">Button 1 Target</label>
                <input
                  type="text"
                  placeholder="e.g. portfolio"
                  value={button1ScrollTarget}
                  onChange={(e) => setButton1ScrollTarget(e.target.value)}
                  className="glass-input p-3.5 text-xs font-light"
                />
              </div>
            </div>

            {/* Action Button 2 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textSoft uppercase tracking-wider">Button 2 Label</label>
                <input
                  type="text"
                  value={button2Label}
                  onChange={(e) => setButton2Label(e.target.value)}
                  className="glass-input p-3.5 text-xs font-light"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textSoft uppercase tracking-wider">Button 2 Target</label>
                <input
                  type="text"
                  placeholder="e.g. contact"
                  value={button2ScrollTarget}
                  onChange={(e) => setButton2ScrollTarget(e.target.value)}
                  className="glass-input p-3.5 text-xs font-light"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="mt-2 w-full px-5 py-3.5 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white font-sora font-semibold tracking-wider uppercase text-xs transition-all duration-350 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={14} />
              {saving ? "Saving Changes..." : "Publish Hero Changes"}
            </button>
          </div>
        </form>

        {/* RIGHT COLUMN: Visual Mock Preview */}
        <div className="xl:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sora font-bold text-white uppercase tracking-wider flex items-center gap-1">
              Live Mock Preview
            </span>
            <div className="flex items-center gap-2 p-1 rounded-lg border border-white/5 bg-[#111827]/40">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1.5 rounded-md ${previewDevice === "desktop" ? "bg-[#007BFF] text-white" : "text-textMuted hover:text-white"}`}
                title="Desktop View"
              >
                <Monitor size={14} />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1.5 rounded-md ${previewDevice === "mobile" ? "bg-[#007BFF] text-white" : "text-textMuted hover:text-white"}`}
                title="Mobile View"
              >
                <Smartphone size={14} />
              </button>
            </div>
          </div>

          {/* Visual container mock */}
          <div 
            className={`border border-white/10 rounded-2xl overflow-hidden bg-[#0A0A0A] bg-grid-glow relative transition-all duration-300 ${
              previewDevice === "mobile" ? "max-w-[320px] mx-auto h-[480px]" : "w-full aspect-[16/10]"
            } flex items-center justify-center`}
          >
            {/* Glowing orbs */}
            <div className="absolute top-[10%] left-[10%] w-[100px] md:w-[200px] h-[100px] md:h-[200px] rounded-full bg-[#007BFF]/10 blur-[50px]" />
            <div className="absolute bottom-[10%] right-[10%] w-[100px] md:w-[150px] h-[100px] md:h-[150px] rounded-full bg-[#38BDF8]/5 blur-[40px]" />

            <div className="p-6 text-center relative z-10 flex flex-col items-center gap-3">
              {/* Badge */}
              {availabilityBadge && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#38BDF8]/20 bg-[#38BDF8]/5 text-[9px] font-semibold text-[#38BDF8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                  <span>{availabilityBadge}</span>
                </div>
              )}

              {/* H1 */}
              <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight mt-1">
                {name || "SHAN RANATHUNGA"}
              </h1>

              {/* H2 */}
              <h2 className="text-xs md:text-sm font-bold text-[#38BDF8] max-w-md">
                {title || "Freelance Graphic Designer"}
              </h2>

              {/* Description */}
              <p className="text-[10px] md:text-xs text-textMuted max-w-sm font-light leading-relaxed">
                {description || "Description paragraph text..."}
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-2.5 mt-2">
                {button1Label && (
                  <span className="px-4 py-2 rounded-full bg-[#007BFF] text-white text-[9px] font-semibold">
                    {button1Label}
                  </span>
                )}
                {button2Label && (
                  <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white text-[9px] font-semibold">
                    {button2Label}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroManager;
