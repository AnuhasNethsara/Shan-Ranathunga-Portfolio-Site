import React, { useState } from "react";
import { useSiteData } from "../context/SiteDataContext";
import { 
  Mail, 
  MessageSquare, 
  MessageCircle, 
  Send,
  CheckCircle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Pixel-perfect vector SVGs for missing Lucide brand icons
const InstagramIcon = ({ size = 20, className = "" }) => (
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

const FacebookIcon = ({ size = 20, className = "" }) => (
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

const Contact = () => {
  const { contactInfo, addInboxMessage } = useSiteData();
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("Thumbnails");
  const [message, setMessage] = useState("");
  
  // Submission visual alert status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    
    // Package and submit to React state / Cloud data provider
    await addInboxMessage({
      name: name.trim(),
      email: email.trim(),
      projectType,
      message: message.trim()
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
      
      // Clear inputs
      setName("");
      setEmail("");
      setProjectType("Thumbnails");
      setMessage("");
    }, 800);
  };

  const projectTypes = [
    "Thumbnails",
    "Social Media",
    "Branding",
    "Posters",
    "Logos",
    "UI Concepts",
    "Other Freelance Project"
  ];

  // Helper to generate dynamic WhatsApp links
  const getWhatsAppLink = (number) => {
    const cleaned = number.replace(/[+-\s]/g, "");
    return `https://wa.me/${cleaned}?text=Hi%20Shan,%20I'd%20like%20to%20hire%20you%20for%20a%20graphic%20design%20project!`;
  };

  return (
    <section id="contact" className="py-24 bg-[#111827]/40 relative overflow-hidden">
      {/* Visual background lights */}
      <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#38BDF8]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-15%] w-[300px] h-[300px] rounded-full bg-[#007BFF]/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-widest font-sora font-semibold text-[#38BDF8]">
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sora">
            Let's Create Together
          </h2>
          <p className="text-textMuted font-light leading-relaxed text-sm md:text-base mt-2">
            Have a design idea, advertising campaign, branding inquiry, or thumbnail commission? Send me a message below.
          </p>
        </div>

        {/* Two Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Coordinates */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h3 className="font-sora text-xl font-bold text-white tracking-tight">
              Contact Channels
            </h3>
            <p className="text-textMuted text-sm font-light leading-relaxed">
              Reach out through email, slide into my Instagram DMs, or start a WhatsApp chat. I usually reply within a couple of business hours.
            </p>

            <div className="flex flex-col gap-4 mt-2">
              {/* Email */}
              {contactInfo.email && (
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="glass-card glass-card-hover p-5 rounded-xl flex items-center gap-4 group"
                >
                  <div className="p-3.5 rounded-lg bg-[#007BFF]/10 text-[#007BFF] group-hover:bg-[#007BFF] group-hover:text-white transition-all shadow-md">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block">Email Address</span>
                    <span className="text-sm font-medium text-white group-hover:text-[#38BDF8] transition-colors">{contactInfo.email}</span>
                  </div>
                </a>
              )}

              {/* WhatsApp */}
              {contactInfo.whatsapp && (
                <a
                  href={getWhatsAppLink(contactInfo.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card glass-card-hover p-5 rounded-xl flex items-center gap-4 group"
                >
                  <div className="p-3.5 rounded-lg bg-[#10B981]/10 text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-all shadow-md">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block">WhatsApp Direct Chat</span>
                    <span className="text-sm font-medium text-white group-hover:text-[#10B981] transition-colors">{contactInfo.whatsapp}</span>
                  </div>
                </a>
              )}

              {/* Instagram */}
              {contactInfo.instagram && (
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card glass-card-hover p-5 rounded-xl flex items-center gap-4 group"
                >
                  <div className="p-3.5 rounded-lg bg-[#E1306C]/10 text-[#E1306C] group-hover:bg-[#E1306C] group-hover:text-white transition-all shadow-md">
                    <InstagramIcon size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block">Instagram DM</span>
                    <span className="text-sm font-medium text-white group-hover:text-[#E1306C] transition-colors">@shan.designs</span>
                  </div>
                </a>
              )}

              {/* Facebook */}
              {contactInfo.facebook && (
                <a
                  href={contactInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card glass-card-hover p-5 rounded-xl flex items-center gap-4 group"
                >
                  <div className="p-3.5 rounded-lg bg-[#1877F2]/10 text-[#1877F2] group-hover:bg-[#1877F2] group-hover:text-white transition-all shadow-md">
                    <FacebookIcon size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block">Facebook Business Page</span>
                    <span className="text-sm font-medium text-white group-hover:text-[#1877F2] transition-colors">Shan Designs</span>
                  </div>
                </a>
              )}

              {/* Discord */}
              {contactInfo.showDiscord && contactInfo.discord && (
                <div className="glass-card p-5 rounded-xl flex items-center gap-4">
                  <div className="p-3.5 rounded-lg bg-[#5865F2]/10 text-[#5865F2] shadow-md">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block">Discord Server Tag</span>
                    <span className="text-sm font-medium text-white">{contactInfo.discord}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Glassmorphic Project Dispatch Form */}
          <div className="lg:col-span-7">
            <form 
              onSubmit={handleSubmit}
              className="glass-card p-8 md:p-10 rounded-2xl flex flex-col gap-6 border border-white/5 shadow-2xl relative"
            >
              <h3 className="font-sora text-xl font-bold text-white tracking-tight">
                Send a Message
              </h3>

              {/* Name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="form-name" className="text-xs font-bold text-textSoft uppercase tracking-wider">Your Name</label>
                <input
                  id="form-name"
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input p-4 text-sm font-light"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="form-email" className="text-xs font-bold text-textSoft uppercase tracking-wider">Email Address</label>
                <input
                  id="form-email"
                  type="email"
                  required
                  placeholder="e.g. john@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input p-4 text-sm font-light"
                />
              </div>

              {/* Project Type Select */}
              <div className="flex flex-col gap-2">
                <label htmlFor="form-project-type" className="text-xs font-bold text-textSoft uppercase tracking-wider">Project Type Interest</label>
                <select
                  id="form-project-type"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="glass-input p-4 text-sm font-light cursor-pointer appearance-none bg-surface"
                >
                  {projectTypes.map((type) => (
                    <option key={type} value={type} className="bg-[#0A0A0A] text-white">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="form-message" className="text-xs font-bold text-textSoft uppercase tracking-wider">Project Description</label>
                <textarea
                  id="form-message"
                  required
                  rows={5}
                  placeholder="Describe your design specifications, scope, goals, and delivery timelines..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="glass-input p-4 text-sm font-light resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full px-6 py-4 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white font-sora font-semibold tracking-wider uppercase text-xs transition-all duration-350 hover:shadow-[0_0_20px_rgba(0,123,255,0.4)] flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>Send Message Inquiry</span>
                    <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Success Notification Alert Modal Popup */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-[#0A0A0A]/90 backdrop-blur-md"
            />
            
            {/* Modal popup */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-sm w-full p-8 rounded-2xl glass-card border border-[#38BDF8]/20 z-10 flex flex-col items-center text-center gap-4"
            >
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/5 text-textMuted hover:text-white transition-colors"
                aria-label="Close success modal"
              >
                <X size={16} />
              </button>

              <div className="p-4 rounded-full bg-[#10B981]/15 text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-bounce mt-2">
                <CheckCircle size={36} />
              </div>

              <h4 className="font-sora text-xl font-bold text-white tracking-tight">
                Message Received!
              </h4>
              
              <p className="text-textMuted font-light text-xs leading-relaxed">
                Thank you for reaching out. Your project proposal has been successfully dispatched to Shan's inbox. Expect a response shortly!
              </p>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full mt-2 px-5 py-3 rounded-full bg-[#1F2937]/50 border border-white/5 text-white font-sora font-semibold text-xs tracking-wider uppercase hover:bg-white/5 transition-all"
              >
                Close Window
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Contact;
