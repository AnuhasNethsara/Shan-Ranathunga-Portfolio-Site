import React from "react";
import { useSiteData } from "../context/SiteDataContext";
import { Mail } from "lucide-react";

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

const Footer = () => {
  const { contactInfo } = useSiteData();

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
    <footer className="relative bg-[#0A0A0A] overflow-hidden pt-12 pb-8">
      {/* Top boundary gradient line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#007BFF]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-8 items-center">
        {/* Middle contents split */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
          
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleScrollTo("home"); }}
            className="font-sora text-2xl font-bold tracking-tight text-white flex items-center gap-0.5"
          >
            Shan<span className="text-[#38BDF8] drop-shadow-[0_0_8px_#38BDF8]">.</span>
          </a>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#home" onClick={(e) => { e.preventDefault(); handleScrollTo("home"); }} className="text-xs text-textMuted hover:text-white transition-colors font-sora uppercase tracking-wider font-semibold">Home</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); handleScrollTo("about"); }} className="text-xs text-textMuted hover:text-white transition-colors font-sora uppercase tracking-wider font-semibold">About</a>
            <a href="#portfolio" onClick={(e) => { e.preventDefault(); handleScrollTo("portfolio"); }} className="text-xs text-textMuted hover:text-white transition-colors font-sora uppercase tracking-wider font-semibold">Portfolio</a>
            <a href="#services" onClick={(e) => { e.preventDefault(); handleScrollTo("services"); }} className="text-xs text-textMuted hover:text-white transition-colors font-sora uppercase tracking-wider font-semibold">Services</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); handleScrollTo("contact"); }} className="text-xs text-textMuted hover:text-white transition-colors font-sora uppercase tracking-wider font-semibold">Contact</a>
          </div>

          {/* Social icons row */}
          <div className="flex items-center gap-3">
            {contactInfo.email && (
              <a
                href={`mailto:${contactInfo.email}`}
                className="p-2.5 rounded-full border border-white/5 bg-[#111827] text-textMuted hover:text-white hover:border-[#38BDF8]/40 transition-all hover:-translate-y-0.5"
                aria-label="Email Shan"
              >
                <Mail size={16} />
              </a>
            )}
            {contactInfo.instagram && (
              <a
                href={contactInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-white/5 bg-[#111827] text-textMuted hover:text-[#E1306C] hover:border-[#E1306C]/40 transition-all hover:-translate-y-0.5"
                aria-label="Shan's Instagram"
              >
                <InstagramIcon size={16} />
              </a>
            )}
            {contactInfo.facebook && (
              <a
                href={contactInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-white/5 bg-[#111827] text-textMuted hover:text-[#1877F2] hover:border-[#1877F2]/40 transition-all hover:-translate-y-0.5"
                aria-label="Shan's Facebook"
              >
                <FacebookIcon size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-xs text-textMuted font-light">
            © {new Date().getFullYear()} Shan Ranathunga. All rights reserved.
          </p>
          <p className="text-[10px] text-textMuted/40 font-light tracking-wide">
            Engineered with React + Tailwind CSS + Firebase Auth & Firestore
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
