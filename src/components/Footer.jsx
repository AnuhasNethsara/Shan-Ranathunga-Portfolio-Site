import React, { useState, useRef } from "react";
import { useSiteData } from "../context/SiteDataContext";

// Pixel-perfect vector SVGs for missing Lucide brand icons
const InstagramIcon = ({ size = 16, className = "" }) => (
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

const FacebookIcon = ({ size = 16, className = "" }) => (
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

const WhatsAppIcon = ({ size = 16, className = "" }) => (
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
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const BehanceIcon = ({ size = 16, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 11.5a1.5 1.5 0 0 1-1.5 1.5H16a1.5 1.5 0 0 1-1.5-1.5V10h6.5v1.5z" />
    <path d="M14.5 10H21" />
    <path d="M9 13.5a1.5 1.5 0 0 1-1.5 1.5H3V3h4.5a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 7.5 9h-3" />
    <path d="M3 9h4.5A1.5 1.5 0 0 1 9 10.5v1.5a1.5 1.5 0 0 1-1.5 1.5H3" />
    <path d="M16 6.5h3.5" />
  </svg>
);

const LinkedInIcon = ({ size = 16, className = "" }) => (
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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Footer = () => {
  const { contactInfo } = useSiteData();
  const footerRef = useRef(null);
  
  // Mouse position spotlight tracking state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleScrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-[#0A0A0A] overflow-hidden pt-24 pb-12 transition-all border-t border-white/5"
    >
      {/* Dynamic Layered Spotlight hover glows */}
      {isHovered && (
        <>
          {/* Broad outer aura */}
          <div
            className="absolute pointer-events-none transition-opacity duration-500 blur-[130px] rounded-full w-[400px] h-[400px] bg-[#007BFF]/8 z-0"
            style={{
              left: mousePos.x - 200,
              top: mousePos.y - 200,
            }}
          />
          {/* Intense inner spotlight core */}
          <div
            className="absolute pointer-events-none transition-opacity duration-500 blur-[70px] rounded-full w-[150px] h-[150px] bg-[#38BDF8]/6 z-0"
            style={{
              left: mousePos.x - 75,
              top: mousePos.y - 75,
            }}
          />
        </>
      )}

      {/* Futuristic top boundary edge glow */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#007BFF]/35 to-transparent z-10" />

      {/* Visual background ambient light orbs */}
      <div className="absolute -top-[10%] left-[5%] w-[250px] h-[250px] rounded-full bg-[#007BFF]/5 blur-[95px] pointer-events-none" />
      <div className="absolute bottom-0 right-[5%] w-[300px] h-[300px] rounded-full bg-[#38BDF8]/4 blur-[105px] pointer-events-none" />

      {/* Floating particles background system */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-[15%] left-[12%] w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse-slow blur-[0.5px]" />
        <div className="absolute top-[48%] left-[7%] w-2 h-2 rounded-full bg-[#007BFF]/60 animate-float blur-[1px]" />
        <div className="absolute top-[75%] left-[38%] w-1 h-1 rounded-full bg-[#38BDF8] animate-pulse-slow" />
        <div className="absolute top-[22%] right-[14%] w-2.5 h-2.5 rounded-full bg-[#007BFF]/30 animate-float blur-[1.5px]" />
        <div className="absolute top-[68%] right-[9%] w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse-slow blur-[0.5px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-20 border-b border-white/5">
          
          {/* Left Area (About & Agency Branding) */}
          <div className="md:col-span-5 flex flex-col gap-4 text-left">
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); handleScrollTo("home"); }}
              className="font-sora text-3xl font-bold tracking-tight text-white flex items-center gap-0.5 group"
            >
              Shan<span className="text-[#38BDF8] drop-shadow-[0_0_8px_#38BDF8] transition-transform group-hover:scale-125">.</span>
            </a>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold font-sora text-[#38BDF8] uppercase tracking-wider">
                Freelance Graphic Designer & Creative Visual Artist
              </span>
              <p className="text-xs text-textMuted font-light leading-relaxed max-w-sm">
                Creating visuals that turn ideas into powerful digital experiences. Specialized in custom brand identities, high-end UI layouts, and interactive visual design.
              </p>
            </div>
          </div>

          {/* Center Area (Quick Navigation Deck) */}
          <div className="md:col-span-4 flex flex-col gap-5 md:items-center">
            <div className="flex flex-col gap-4 text-left md:items-center w-full">
              <span className="text-xs font-bold text-textSoft uppercase tracking-widest font-sora">
                Navigation
              </span>
              <div className="flex flex-col md:items-center gap-3">
                <a
                  href="#home"
                  onClick={(e) => { e.preventDefault(); handleScrollTo("home"); }}
                  className="group relative text-xs text-textMuted hover:text-white transition-all font-light tracking-wide py-0.5"
                >
                  Home
                  <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#38BDF8] shadow-[0_0_8px_#38BDF8] transition-all duration-300 group-hover:w-full" />
                </a>
                <a
                  href="#about"
                  onClick={(e) => { e.preventDefault(); handleScrollTo("about"); }}
                  className="group relative text-xs text-textMuted hover:text-white transition-all font-light tracking-wide py-0.5"
                >
                  About
                  <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#38BDF8] shadow-[0_0_8px_#38BDF8] transition-all duration-300 group-hover:w-full" />
                </a>
                <a
                  href="#portfolio"
                  onClick={(e) => { e.preventDefault(); handleScrollTo("portfolio"); }}
                  className="group relative text-xs text-textMuted hover:text-white transition-all font-light tracking-wide py-0.5"
                >
                  Portfolio
                  <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#38BDF8] shadow-[0_0_8px_#38BDF8] transition-all duration-300 group-hover:w-full" />
                </a>
                <a
                  href="#services"
                  onClick={(e) => { e.preventDefault(); handleScrollTo("services"); }}
                  className="group relative text-xs text-textMuted hover:text-white transition-all font-light tracking-wide py-0.5"
                >
                  Services
                  <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#38BDF8] shadow-[0_0_8px_#38BDF8] transition-all duration-300 group-hover:w-full" />
                </a>
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); handleScrollTo("contact"); }}
                  className="group relative text-xs text-textMuted hover:text-white transition-all font-light tracking-wide py-0.5"
                >
                  Contact
                  <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#38BDF8] shadow-[0_0_8px_#38BDF8] transition-all duration-300 group-hover:w-full" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Area (Social Vectors Dock) */}
          <div className="md:col-span-3 flex flex-col gap-4 md:items-end text-left md:text-right">
            <span className="text-xs font-bold text-textSoft uppercase tracking-widest font-sora">
              Connect
            </span>
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a
                href={contactInfo?.instagram || "https://instagram.com/shan_ranathunga"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-white/5 bg-[#111827]/40 hover:bg-[#007BFF]/10 text-textMuted hover:text-[#38BDF8] hover:border-[#38BDF8]/40 transition-all duration-350 hover:-translate-y-1 hover:shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                aria-label="Instagram Profile"
              >
                <InstagramIcon size={16} />
              </a>

              {/* Facebook */}
              <a
                href={contactInfo?.facebook || "https://facebook.com/shan_designs"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-white/5 bg-[#111827]/40 hover:bg-[#007BFF]/10 text-textMuted hover:text-[#38BDF8] hover:border-[#38BDF8]/40 transition-all duration-350 hover:-translate-y-1 hover:shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                aria-label="Facebook Profile"
              >
                <FacebookIcon size={16} />
              </a>

              {/* WhatsApp */}
              <a
                href={contactInfo?.whatsapp ? `https://wa.me/${contactInfo.whatsapp}` : "https://wa.me/"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-white/5 bg-[#111827]/40 hover:bg-[#007BFF]/10 text-textMuted hover:text-[#38BDF8] hover:border-[#38BDF8]/40 transition-all duration-350 hover:-translate-y-1 hover:shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                aria-label="WhatsApp Contact"
              >
                <WhatsAppIcon size={16} />
              </a>

              {/* Behance */}
              <a
                href={contactInfo?.behance || "https://behance.net/shan_ranathunga"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-white/5 bg-[#111827]/40 hover:bg-[#007BFF]/10 text-textMuted hover:text-[#38BDF8] hover:border-[#38BDF8]/40 transition-all duration-350 hover:-translate-y-1 hover:shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                aria-label="Behance Portfolio"
              >
                <BehanceIcon size={16} />
              </a>

              {/* LinkedIn */}
              <a
                href={contactInfo?.linkedin || "https://linkedin.com/in/shan_ranathunga"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-white/5 bg-[#111827]/40 hover:bg-[#007BFF]/10 text-textMuted hover:text-[#38BDF8] hover:border-[#38BDF8]/40 transition-all duration-350 hover:-translate-y-1 hover:shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                aria-label="LinkedIn Profile"
              >
                <LinkedInIcon size={16} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="w-full pt-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
          {/* Copyright Area */}
          <div className="flex flex-col gap-1 sm:items-start">
            <p className="text-[11px] text-textMuted font-light">
              © {new Date().getFullYear()} Anuhas Nethsara. All Rights Reserved.
            </p>
          </div>

          {/* Development Credit & Quote Area */}
          <div className="flex flex-col gap-1 items-center sm:items-end">
            <p className="text-[11px] text-textMuted font-light">
              Website designed & developed by{" "}
              <a
                href="https://kengsl.indevs.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#38BDF8] font-medium transition-colors hover:underline"
              >
                Anuhas Nethsara
              </a>
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-textMuted/40 italic font-light">
              <span>"Crafted with ❤️ by Anuhas Nethsara"</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_5px_#38BDF8] animate-pulse" />
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
