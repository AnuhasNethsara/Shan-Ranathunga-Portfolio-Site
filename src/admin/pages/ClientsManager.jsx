import React, { useState, useEffect } from "react";
import { useSiteData } from "../../context/SiteDataContext";
import { 
  Users, 
  Shield, 
  ShieldOff, 
  Trash2, 
  Search, 
  UserCog, 
  Mail, 
  Calendar,
  Crown,
  User,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ClientsManager = () => {
  const { 
    clients, 
    loadClients, 
    updateClientRole, 
    deleteClient, 
    authorizedEmails, 
    addAdminEmail, 
    deleteAdminEmail 
  } = useSiteData();

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadClients();
      setLoading(false);
    };
    init();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 4000);
  };

  const handleRoleChange = async (clientId, newRole) => {
    setActionLoading(clientId);
    try {
      await updateClientRole(clientId, newRole);
      showAlert("success", `Role updated to "${newRole}" successfully.`);
    } catch (err) {
      showAlert("error", "Failed to update role: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleGrantAdmin = async (client) => {
    setActionLoading(client.id);
    try {
      await addAdminEmail(client.email);
      await updateClientRole(client.id, "admin");
      showAlert("success", `${client.email} granted admin access.`);
    } catch (err) {
      showAlert("error", err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeAdmin = async (client) => {
    setActionLoading(client.id);
    try {
      await deleteAdminEmail(client.email);
      await updateClientRole(client.id, "client");
      showAlert("success", `Admin access revoked for ${client.email}.`);
    } catch (err) {
      showAlert("error", err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClient = async (clientId) => {
    setActionLoading(clientId);
    try {
      await deleteClient(clientId);
      setConfirmDelete(null);
      showAlert("success", "Client account removed.");
    } catch (err) {
      showAlert("error", "Failed to delete client: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredClients = clients.filter(c =>
    (c.displayName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.role || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAdminEmail = (email) => authorizedEmails.some(e => e.toLowerCase() === email?.toLowerCase());

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8 text-[#F5F5F5]">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-widest font-sora flex items-center gap-1.5">
            <Users size={12} className="animate-pulse" /> User Management Console
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sora">
            Clients & Permissions
          </h2>
          <p className="text-textMuted text-xs font-light">
            View all registered clients, manage roles, grant or revoke admin access.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-textMuted bg-white/5 border border-white/5 px-3 py-1.5 rounded-full">
            {clients.length} Total Users
          </span>
          <span className="text-[10px] font-bold text-[#38BDF8] bg-[#38BDF8]/5 border border-[#38BDF8]/10 px-3 py-1.5 rounded-full">
            {authorizedEmails.length} Admins
          </span>
        </div>
      </div>

      {/* ALERT */}
      <AnimatePresence>
        {alert.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-3 p-4 rounded-xl border text-xs font-medium ${
              alert.type === "success" 
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" 
                : "border-red-500/20 bg-red-500/10 text-red-400"
            }`}
          >
            {alert.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full glass-input pl-10 pr-4 py-3 text-xs font-light"
        />
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
      </div>

      {/* CLIENTS TABLE */}
      {loading ? (
        <div className="text-center py-16 text-textMuted text-xs">Loading clients...</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredClients.map((client) => {
            const clientIsAdmin = isAdminEmail(client.email);
            return (
              <motion.div
                key={client.id}
                layout
                className="glass-card p-5 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-white/10 transition-all"
              >
                {/* Client Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-11 h-11 rounded-full border flex items-center justify-center shrink-0 ${
                    clientIsAdmin 
                      ? "border-[#38BDF8]/30 bg-[#38BDF8]/10" 
                      : "border-white/10 bg-[#0F172A]"
                  }`}>
                    {clientIsAdmin ? <Crown size={16} className="text-[#38BDF8]" /> : <User size={16} className="text-textMuted" />}
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <h4 className="font-sora text-sm font-bold text-white tracking-tight truncate flex items-center gap-2">
                      {client.displayName || "Unnamed User"}
                      {clientIsAdmin && (
                        <span className="text-[9px] uppercase font-extrabold tracking-widest text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-2 py-0.5 rounded-full">Admin</span>
                      )}
                    </h4>
                    <div className="flex items-center gap-3 text-[10px] text-textMuted font-light">
                      <span className="flex items-center gap-1"><Mail size={10} /> {client.email}</span>
                      {client.createdAt && (
                        <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(client.createdAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Role selector */}
                  <select
                    value={client.role || "client"}
                    onChange={(e) => handleRoleChange(client.id, e.target.value)}
                    disabled={actionLoading === client.id}
                    className="glass-input px-3 py-2 text-[10px] font-semibold rounded-lg"
                  >
                    <option value="client">Client</option>
                    <option value="vip">VIP Client</option>
                    <option value="admin">Admin</option>
                  </select>

                  {/* Grant/Revoke Admin */}
                  {clientIsAdmin ? (
                    <button
                      onClick={() => handleRevokeAdmin(client)}
                      disabled={actionLoading === client.id}
                      className="p-2.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                      title="Revoke Admin Access"
                    >
                      <ShieldOff size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleGrantAdmin(client)}
                      disabled={actionLoading === client.id}
                      className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                      title="Grant Admin Access"
                    >
                      <Shield size={14} />
                    </button>
                  )}

                  {/* Delete */}
                  {confirmDelete === client.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        disabled={actionLoading === client.id}
                        className="px-3 py-2 rounded-lg bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-3 py-2 rounded-lg border border-white/10 text-textMuted text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(client.id)}
                      className="p-2.5 rounded-lg border border-white/5 bg-white/5 text-textMuted hover:text-red-400 hover:border-red-500/20 transition-all cursor-pointer"
                      title="Delete Client"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}

          {filteredClients.length === 0 && (
            <div className="text-center py-16 border border-dashed border-white/5 rounded-2xl bg-white/5 flex flex-col items-center gap-3">
              <Users size={32} className="text-textMuted/30" />
              <span className="text-textMuted font-light text-xs">
                {searchQuery ? "No clients match your search." : "No registered clients yet."}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientsManager;
