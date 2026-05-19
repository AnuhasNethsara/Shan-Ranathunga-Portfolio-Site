import React, { useState } from "react";
import { useSiteData } from "../../context/SiteDataContext";
import { Save, Mail, MessageSquare, MessageCircle, CheckCircle, AlertCircle } from "lucide-react";

// Pixel-perfect vector SVGs for missing Lucide brand icons
const InstagramIcon = ({ size = 13, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 13, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
import { motion } from "framer-motion";

const ContactInfoManager = () => {
  const { contactInfo, saveContactInfo } = useSiteData();

  // Local state managers
  const [email, setEmail] = useState(contactInfo.email || "");
  const [whatsapp, setWhatsapp] = useState(contactInfo.whatsapp || "");
  const [instagram, setInstagram] = useState(contactInfo.instagram || "");
  const [facebook, setFacebook] = useState(contactInfo.facebook || "");
  const [discord, setDiscord] = useState(contactInfo.discord || "");
  const [showDiscord, setShowDiscord] = useState(contactInfo.showDiscord ?? true);

  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");

  const handleSave = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setAlertType("error");
      setAlertMsg("Email address coordinates are required.");
      return;
    }

    setSaving(true);
    setAlertMsg("");

    try {
      await saveContactInfo({
        email: email.trim(),
        whatsapp: whatsapp.trim(),
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        discord: discord.trim(),
        showDiscord
      });
      setAlertType("success");
      setAlertMsg("Contact info configurations successfully saved!");
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
          Contact Info Manager
        </h2>
        <p className="text-textMuted text-xs md:text-sm font-light">
          Configure the active social coordinate URLs and address targets showing in your public Contact section.
        </p>
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

      {/* Form Grid */}
      <form onSubmit={handleSave} className="max-w-2xl w-full">
        <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col gap-6 shadow-2xl">
          <h3 className="font-sora text-base font-bold text-white tracking-tight border-b border-white/5 pb-3">
            Coordinate Channels
          </h3>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-textSoft uppercase tracking-wider flex items-center gap-1.5">
              <Mail size={13} className="text-[#38BDF8]" />
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. shan.designs@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input p-3.5 text-xs font-light"
            />
          </div>

          {/* WhatsApp */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-textSoft uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare size={13} className="text-green-400" />
              WhatsApp Number
            </label>
            <input
              type="text"
              placeholder="e.g. +94771234567"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="glass-input p-3.5 text-xs font-light"
            />
          </div>

          {/* Instagram */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-textSoft uppercase tracking-wider flex items-center gap-1.5">
              <InstagramIcon size={13} className="text-[#E1306C]" />
              Instagram URL
            </label>
            <input
              type="url"
              placeholder="e.g. https://instagram.com/shan.designs"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="glass-input p-3.5 text-xs font-light"
            />
          </div>

          {/* Facebook */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-textSoft uppercase tracking-wider flex items-center gap-1.5">
              <FacebookIcon size={13} className="text-[#1877F2]" />
              Facebook URL
            </label>
            <input
              type="url"
              placeholder="e.g. https://facebook.com/shan.designs"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="glass-input p-3.5 text-xs font-light"
            />
          </div>

          {/* Discord */}
          <div className="flex flex-col gap-3 p-4 rounded-xl border border-white/5 bg-white/5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <MessageCircle size={13} className="text-[#5865F2]" />
                Discord Server tag
              </label>
              
              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => setShowDiscord(!showDiscord)}
                className={`w-9 h-5 rounded-full relative transition-colors duration-250 shrink-0 ${
                  showDiscord ? "bg-[#007BFF]" : "bg-gray-700"
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] left-[3px] transition-transform duration-250 ${
                  showDiscord ? "translate-x-4" : "translate-x-0"
                }`} />
              </button>
            </div>
            
            <input
              type="text"
              disabled={!showDiscord}
              placeholder="e.g. shan_designs#9999"
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              className="glass-input p-3.5 text-xs font-light disabled:opacity-30"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="mt-2 w-full px-5 py-3.5 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white font-sora font-semibold tracking-wider uppercase text-xs transition-all duration-350 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? "Saving Coordinates..." : "Publish Contact Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactInfoManager;
