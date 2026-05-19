import React, { useState } from "react";
import { useSiteData } from "../../context/SiteDataContext";
import { 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Upload, 
  Lock, 
  Eye,
  Settings2,
  Database,
  DatabaseZap
} from "lucide-react";
import { motion } from "framer-motion";

const Settings = () => {
  const { 
    settings, 
    saveSettings, 
    exportAllData, 
    importAllData, 
    changePassword,
    firebaseActive 
  } = useSiteData();

  // Local state managers for global features
  const [showAvailability, setShowAvailability] = useState(settings.showAvailability ?? true);
  const [showTestimonials, setShowTestimonials] = useState(settings.showTestimonials ?? true);

  // Local state managers for Password resets
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");

  // Save visibility toggles
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setAlertMsg("");

    try {
      await saveSettings({
        showAvailability,
        showTestimonials
      });
      setAlertType("success");
      setAlertMsg("Global display settings successfully saved!");
    } catch (err) {
      console.error(err);
      setAlertType("error");
      setAlertMsg("Failed to save settings: " + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  // Change password credentials
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setAlertType("error");
      setAlertMsg("Password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setAlertType("error");
      setAlertMsg("New password and confirmation password do not match.");
      return;
    }

    setSavingPassword(true);
    setAlertMsg("");

    try {
      if (firebaseActive) {
        // Firebase password resets trigger
        await changePassword(currentPassword.trim(), newPassword.trim());
      } else {
        // Local password resets
        if (!currentPassword.trim()) {
          setAlertType("error");
          setAlertMsg("Current password is required to verify changes.");
          setSavingPassword(false);
          return;
        }
        await changePassword(currentPassword.trim(), newPassword.trim());
      }
      setAlertType("success");
      setAlertMsg("Administrative credentials successfully updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setAlertType("error");
      setAlertMsg("Failed to update password: " + err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  // JSON exporter
  const handleExportBackup = () => {
    try {
      const dataPayload = exportAllData();
      const stringified = JSON.stringify(dataPayload, null, 2);
      
      const blob = new Blob([stringified], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `shan_portfolio_backup_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setAlertType("success");
      setAlertMsg("Database backup JSON successfully generated and downloaded!");
    } catch (err) {
      console.error(err);
      setAlertType("error");
      setAlertMsg("Failed to generate backup: " + err.message);
    }
  };

  // JSON importer file reader
  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!window.confirm("WARNING: Importing a backup file will completely overwrite all existing portfolio, services, testimonials, contact details, and inbox logs. Are you sure you want to proceed?")) {
        e.target.value = ""; // reset input
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          await importAllData(parsed);
          setAlertType("success");
          setAlertMsg("Database successfully imported, parsed, and synchronized!");
        } catch (err) {
          console.error(err);
          setAlertType("error");
          setAlertMsg("Failed to parse and import JSON: " + err.message);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="font-sora text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          System Settings & Backups
        </h2>
        <p className="text-textMuted text-xs md:text-sm font-light">
          Manage system layout settings, administer login credential resets, and create JSON backups.
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

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Layout Toggles & JSON backups */}
        <div className="flex flex-col gap-8">
          {/* Global Visibility */}
          <form onSubmit={handleSaveSettings} className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col gap-5">
            <h3 className="font-sora text-base font-bold text-white tracking-tight border-b border-white/5 pb-3 flex items-center gap-2">
              <Settings2 size={16} className="text-[#38BDF8]" />
              Display Features Visibility
            </h3>

            {/* Toggle availability */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5">
              <div>
                <span className="text-xs font-bold text-white block">Availability Landing Badge</span>
                <span className="text-[10px] text-textMuted font-light">Show availability badge at the top of Hero section.</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAvailability(!showAvailability)}
                className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${
                  showAvailability ? "bg-[#007BFF]" : "bg-gray-700"
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] left-[3px] transition-transform duration-250 ${
                  showAvailability ? "translate-x-4" : "translate-x-0"
                }`} />
              </button>
            </div>

            {/* Toggle testimonials */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5">
              <div>
                <span className="text-xs font-bold text-white block">Client Reviews Section</span>
                <span className="text-[10px] text-textMuted font-light">Show/hide client review carousel globally.</span>
              </div>
              <button
                type="button"
                onClick={() => setShowTestimonials(!showTestimonials)}
                className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${
                  showTestimonials ? "bg-[#007BFF]" : "bg-gray-700"
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] left-[3px] transition-transform duration-250 ${
                  showTestimonials ? "translate-x-4" : "translate-x-0"
                }`} />
              </button>
            </div>

            {/* Save */}
            <button
              type="submit"
              disabled={savingSettings}
              className="mt-2 w-full px-5 py-3 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white font-sora font-semibold tracking-wider uppercase text-xs transition-all duration-350 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={14} />
              {savingSettings ? "Saving Settings..." : "Save Visibility Settings"}
            </button>
          </form>

          {/* Backup Database */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col gap-5">
            <h3 className="font-sora text-base font-bold text-white tracking-tight border-b border-white/5 pb-3 flex items-center gap-2">
              <Database size={16} className="text-[#38BDF8]" />
              Database Backup Manager
            </h3>
            
            <p className="text-[11px] text-textMuted font-light leading-relaxed">
              Maintain full ownership of your data! Export a structured backup JSON file containing all portfolio works, services, testimonials, coordinates, and inbox inquiries, or import an existing file.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {/* Export Button */}
              <button
                type="button"
                onClick={handleExportBackup}
                className="px-5 py-3.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all"
              >
                <Download size={14} className="text-[#38BDF8]" />
                Export Backup JSON
              </button>

              {/* Import Button */}
              <label className="px-5 py-3.5 rounded-xl border border-[#38BDF8]/20 bg-[#38BDF8]/5 hover:bg-[#38BDF8]/10 text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all">
                <Upload size={14} className="text-[#38BDF8]" />
                Import Backup JSON
                <input
                  type="file"
                  accept="application/json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Security Password resets */}
        <div className="flex flex-col gap-8">
          <form onSubmit={handleResetPassword} className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col gap-5">
            <h3 className="font-sora text-base font-bold text-white tracking-tight border-b border-white/5 pb-3 flex items-center gap-2">
              <Lock size={16} className="text-[#38BDF8]" />
              Reset Admin Credentials
            </h3>

            {/* Current Password */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSoft uppercase tracking-wider">Current Password</label>
              <input
                type="password"
                required
                placeholder="Current administrative password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="glass-input p-3.5 text-xs font-light"
              />
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSoft uppercase tracking-wider">New Secure Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="glass-input p-3.5 text-xs font-light"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSoft uppercase tracking-wider">Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="glass-input p-3.5 text-xs font-light"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={savingPassword}
              className="mt-2 w-full px-5 py-3.5 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white font-sora font-semibold tracking-wider uppercase text-xs transition-all duration-350 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock size={14} />
              {savingPassword ? "Updating Password..." : "Update Security Credentials"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Settings;
