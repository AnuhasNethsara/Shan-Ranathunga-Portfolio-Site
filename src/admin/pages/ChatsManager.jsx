import React, { useState, useEffect, useRef } from "react";
import { useSiteData } from "../../context/SiteDataContext";
import { 
  MessageSquare, 
  Send, 
  User, 
  Mail,
  Sparkles,
  Search,
  MessageCircle,
  Trash2,
  Paperclip,
  Image,
  X,
  FileText,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ChatsManager = () => {
  const { 
    chats, 
    sendChatMessageWithAttachment, 
    markChatsAsRead, 
    deleteChatMessage, 
    deleteEntireChatThread,
    compressAndUploadImage,
    firebaseActive
  } = useSiteData();

  const [selectedClientId, setSelectedClientId] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [sending, setSending] = useState(false);
  const [confirmDeleteThread, setConfirmDeleteThread] = useState(false);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll inside chat board
  useEffect(() => {
    if (selectedClientId) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats, selectedClientId]);

  // Mark messages as read when selecting thread
  useEffect(() => {
    if (selectedClientId) {
      markChatsAsRead(selectedClientId);
    }
  }, [selectedClientId, chats]);

  // Process unique clients from chats list
  const uniqueClients = React.useMemo(() => {
    const clientsMap = {};
    (chats || []).forEach(msg => {
      const clientId = msg.senderId === "admin" ? msg.recipientId : msg.senderId;
      const clientName = msg.senderId === "admin" ? null : msg.senderName;
      const clientEmail = msg.senderId === "admin" ? null : msg.senderEmail;

      if (!clientsMap[clientId]) {
        clientsMap[clientId] = {
          id: clientId,
          name: clientName || "Client",
          email: clientEmail || "",
          lastMessage: msg.attachment ? "📎 Attachment" : msg.text,
          lastTimestamp: msg.createdAt,
          unreadCount: 0
        };
      } else {
        if (clientName && clientsMap[clientId].name === "Client") {
          clientsMap[clientId].name = clientName;
        }
        if (clientEmail && !clientsMap[clientId].email) {
          clientsMap[clientId].email = clientEmail;
        }
        if (new Date(msg.createdAt) > new Date(clientsMap[clientId].lastTimestamp)) {
          clientsMap[clientId].lastMessage = msg.attachment ? "📎 Attachment" : msg.text;
          clientsMap[clientId].lastTimestamp = msg.createdAt;
        }
      }

      if (msg.senderId === clientId && msg.recipientId === "admin" && msg.unread) {
        clientsMap[clientId].unreadCount += 1;
      }
    });

    return Object.values(clientsMap).sort((a, b) => new Date(b.lastTimestamp) - new Date(a.lastTimestamp));
  }, [chats]);

  // Filter clients by search query
  const filteredClients = uniqueClients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Active client object
  const activeClient = uniqueClients.find(c => c.id === selectedClientId);

  // Filter messages for selected client
  const activeThread = chats.filter(
    msg => (msg.senderId === selectedClientId && msg.recipientId === "admin") || 
           (msg.senderId === "admin" && msg.recipientId === selectedClientId)
  );

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be under 10MB.");
      return;
    }

    setAttachmentFile(file);
    
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setAttachmentPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setAttachmentPreview(null);
    }
  };

  const clearAttachment = () => {
    setAttachmentFile(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!chatMessage.trim() && !attachmentFile) || !selectedClientId) return;

    setSending(true);
    try {
      let attachment = null;
      if (attachmentFile) {
        attachment = await compressAndUploadImage(attachmentFile);
      }
      await sendChatMessageWithAttachment(chatMessage.trim(), selectedClientId, attachment);
      setChatMessage("");
      clearAttachment();
    } catch (err) {
      console.error(err);
      alert("Failed to send message: " + err.message);
    } finally {
      setSending(false);
    }
  };

  // Handle delete entire thread
  const handleDeleteThread = async () => {
    if (!selectedClientId) return;
    try {
      await deleteEntireChatThread(selectedClientId);
      setSelectedClientId(null);
      setConfirmDeleteThread(false);
    } catch (err) {
      alert("Failed to delete thread: " + err.message);
    }
  };

  // Render attachment in message bubble
  const renderAttachment = (attachment) => {
    if (!attachment) return null;
    
    if (attachment.type?.startsWith("image")) {
      return (
        <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="block mt-2">
          <img 
            src={attachment.url} 
            alt={attachment.name} 
            className="max-w-[240px] rounded-lg border border-white/10 shadow-md hover:opacity-90 transition-opacity"
          />
        </a>
      );
    }
    
    return (
      <a 
        href={attachment.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 mt-2 p-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-[10px]"
      >
        <FileText size={14} className="text-[#38BDF8] shrink-0" />
        <span className="truncate text-textSoft">{attachment.name}</span>
        <Download size={12} className="text-textMuted shrink-0 ml-auto" />
      </a>
    );
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8 text-[#F5F5F5]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-widest font-sora flex items-center gap-1.5">
            <MessageSquare size={12} className="animate-pulse" /> Client Collaboration Sync
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sora">
            Client Collaboration Chats
          </h2>
          <p className="text-textMuted text-xs font-light">
            Real-time chat boards with registered clients. Attach files (auto-compressed to WebP).
          </p>
        </div>
      </div>

      {/* DUAL WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CLIENT LISTING */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search clients by name/email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input pl-10 pr-4 py-2.5 text-xs font-light"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
          </div>

          <h3 className="font-sora text-sm font-bold text-white tracking-tight mt-2">
            Active Client Threads ({filteredClients.length})
          </h3>

          <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
            {filteredClients.map((client) => {
              const isActive = client.id === selectedClientId;
              return (
                <div
                  key={client.id}
                  onClick={() => setSelectedClientId(client.id)}
                  className={`glass-card p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 relative group ${
                    isActive 
                      ? "border-[#38BDF8] bg-white/5 shadow-md shadow-[#38BDF8]/5" 
                      : "border-white/5 hover:border-white/10 hover:bg-white/2"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate min-w-0">
                    <div className="w-10 h-10 rounded-full border border-white/10 bg-[#0F172A] flex items-center justify-center shrink-0">
                      <User size={16} className="text-[#38BDF8]" />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <h4 className="font-sora text-xs font-bold text-white tracking-tight truncate">
                        {client.name}
                      </h4>
                      <span className="text-[10px] text-textMuted font-light truncate">
                        {client.lastMessage}
                      </span>
                    </div>
                  </div>

                  {client.unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#38BDF8] text-[#0A0A0A] font-sora font-extrabold text-[9px] shadow-[0_0_8px_rgba(56,189,248,0.5)] shrink-0 animate-bounce">
                      {client.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}

            {filteredClients.length === 0 && (
              <div className="text-center py-16 border border-dashed border-white/5 rounded-2xl bg-white/5 flex flex-col items-center gap-3">
                <MessageSquare size={32} className="text-textMuted/30" />
                <span className="text-textMuted font-light text-xs">No active chat channels found.</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CHAT INTERFACE */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedClientId && activeClient ? (
              <motion.div
                key={selectedClientId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card rounded-2xl border border-white/5 shadow-2xl flex flex-col h-[65vh] overflow-hidden"
              >
                {/* Active chat header */}
                <div className="h-16 bg-white/3 border-b border-white/5 px-6 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#0F172A] border border-white/5 flex items-center justify-center">
                      <User size={14} className="text-[#38BDF8]" />
                    </div>
                    <div>
                      <h4 className="font-sora text-xs font-bold text-white tracking-tight">{activeClient.name}</h4>
                      <span className="text-[10px] text-textMuted font-light flex items-center gap-1.5 mt-0.5">
                        <Mail size={10} /> {activeClient.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase font-extrabold tracking-widest text-[#38BDF8] bg-[#38BDF8]/5 border border-[#38BDF8]/10 px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles size={10} className="animate-pulse" /> Live
                    </span>
                    
                    {/* Delete Thread */}
                    {confirmDeleteThread ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={handleDeleteThread}
                          className="px-2.5 py-1.5 rounded-lg bg-red-500 text-white text-[9px] font-bold uppercase cursor-pointer"
                        >
                          Delete All
                        </button>
                        <button
                          onClick={() => setConfirmDeleteThread(false)}
                          className="px-2.5 py-1.5 rounded-lg border border-white/10 text-textMuted text-[9px] font-bold uppercase cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteThread(true)}
                        className="p-2 rounded-lg border border-white/5 text-textMuted hover:text-red-400 hover:border-red-500/20 transition-all cursor-pointer"
                        title="Delete entire thread"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages Board */}
                <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4">
                  {activeThread.map((msg) => {
                    const isMe = msg.senderId === "admin";
                    return (
                      <div 
                        key={msg.id}
                        className={`flex flex-col max-w-[75%] gap-1 group relative ${isMe ? "self-end items-end" : "self-start items-start"}`}
                      >
                        {/* Sender details and time */}
                        <span className="text-[9px] text-textMuted font-light px-1 flex items-center gap-2">
                          {isMe ? "You" : activeClient.name} • {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          {/* Delete single message */}
                          <button
                            onClick={() => deleteChatMessage(msg.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-textMuted hover:text-red-400 cursor-pointer"
                            title="Delete message"
                          >
                            <Trash2 size={10} />
                          </button>
                        </span>
                        {/* Bubble */}
                        <div 
                          className={`p-3 rounded-2xl text-xs font-light leading-relaxed ${
                            isMe 
                              ? "bg-[#007BFF] text-white rounded-tr-none shadow-md shadow-[#007BFF]/10 font-medium" 
                              : "bg-[#1E293B] text-textSoft rounded-tl-none border border-white/5"
                          }`}
                        >
                          {msg.text && <span>{msg.text}</span>}
                          {renderAttachment(msg.attachment)}
                        </div>
                      </div>
                    );
                  })}

                  {activeThread.length === 0 && (
                    <div className="flex-grow flex flex-col items-center justify-center gap-3 opacity-30 text-center py-10">
                      <MessageSquare size={32} className="text-[#38BDF8]" />
                      <h5 className="font-sora text-xs font-bold text-white">Start the Discussion</h5>
                      <p className="text-[10px] text-textMuted max-w-xs font-light">
                        Send a message to introduce project plans or clarify designs with this client.
                      </p>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Attachment Preview */}
                {attachmentFile && (
                  <div className="px-4 py-2 border-t border-white/5 bg-white/2 flex items-center gap-3">
                    {attachmentPreview ? (
                      <img src={attachmentPreview} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
                        <FileText size={16} className="text-textMuted" />
                      </div>
                    )}
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[10px] font-semibold text-white truncate">{attachmentFile.name}</span>
                      <span className="text-[9px] text-textMuted">{(attachmentFile.size / 1024).toFixed(1)} KB → WebP compressed</span>
                    </div>
                    <button onClick={clearAttachment} className="ml-auto p-1.5 rounded-lg hover:bg-white/10 text-textMuted hover:text-red-400 transition-colors cursor-pointer">
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Reply Composer */}
                <form onSubmit={handleSendMessage} className="h-16 border-t border-white/5 px-4 flex items-center gap-3 shrink-0 bg-white/2">
                  {/* File attach button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-full border border-white/5 text-textMuted hover:text-[#38BDF8] hover:border-[#38BDF8]/20 transition-all cursor-pointer"
                    title="Attach file (images auto-compressed to WebP)"
                  >
                    <Paperclip size={14} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <input
                    type="text"
                    placeholder="Write your message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-grow glass-input px-4 py-2.5 text-xs font-light"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || (!chatMessage.trim() && !attachmentFile)}
                    className="p-2.5 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white shadow-md transition-all shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </motion.div>
            ) : (
              <div className="text-center py-24 border border-dashed border-white/5 rounded-3xl bg-white/3 flex flex-col items-center gap-3">
                <MessageCircle size={36} className="text-textMuted/30" />
                <h4 className="font-sora text-sm font-bold text-white tracking-tight">Collaboration Chat Console</h4>
                <p className="text-textMuted text-xs font-light max-w-xs leading-relaxed">
                  Select a client session from the thread queue to review chat histories and send real-time replies with file attachments.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};

export default ChatsManager;
