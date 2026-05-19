import React, { useState, useEffect } from "react";
import { useSiteData } from "../context/SiteDataContext";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", id: "home" },
  { name: "About", id: "about" },
  { name: "Portfolio", id: "portfolio" },
  { name: "Services", id: "services" },
  { name: "Contact", id: "contact" }
];

const Navbar = () => {
  const { settings, currentUser } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Scroll spy and glass background trigger
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Section intersection checker
      const scrollPosition = window.scrollY + 200;
      for (const link of navLinks) {
        const section = document.getElementById(link.id);
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-350 ${
          scrolled
            ? "py-4 bg-[#0A0A0A]/75 backdrop-blur-md border-b border-white/5 shadow-lg"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, "home")}
            className="font-sora text-2xl font-bold tracking-tight text-white flex items-center gap-0.5"
          >
            Shan<span className="text-[#38BDF8] drop-shadow-[0_0_8px_#38BDF8] text-3xl font-extrabold leading-none">.</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleLinkClick(e, link.id)}
                className={`font-sora text-sm font-medium transition-colors relative duration-200 py-1 ${
                  activeSection === link.id
                    ? "text-[#38BDF8] nav-active-dot font-semibold"
                    : "text-textMuted hover:text-white"
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Call to Action & Admin Link */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser && (
              <a
                href="/admin/dashboard"
                className="text-xs px-3 py-1.5 rounded-md border border-[#38BDF8]/20 bg-[#38BDF8]/10 text-[#38BDF8] font-medium hover:bg-[#38BDF8]/20 transition-all"
              >
                Dashboard
              </a>
            )}
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, "contact")}
              className="text-xs uppercase font-sora font-semibold tracking-wider px-5 py-2.5 rounded-full bg-[#007BFF] text-white hover:bg-blue-600 transition-all duration-350 hover:shadow-[0_0_15px_rgba(0,123,255,0.4)] flex items-center gap-1 group"
            >
              Hire Me
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Hamburger Menu Toggle (Mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-all"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-[73px] left-0 w-full bg-[#0A0A0A] border-b border-white/5 z-40 md:hidden overflow-hidden glass-card shadow-2xl"
          >
            <div className="flex flex-col py-6 px-8 gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleLinkClick(e, link.id)}
                  className={`font-sora text-lg font-medium py-1.5 border-b border-white/5 transition-all ${
                    activeSection === link.id
                      ? "text-[#38BDF8] pl-2 font-semibold"
                      : "text-textMuted hover:text-white"
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 mt-4">
                {currentUser && (
                  <a
                    href="/admin/dashboard"
                    className="py-2.5 rounded-lg text-center border border-[#38BDF8]/20 bg-[#38BDF8]/5 text-[#38BDF8] font-medium"
                  >
                    Go to Admin Dashboard
                  </a>
                )}
                <a
                  href="#contact"
                  onClick={(e) => handleLinkClick(e, "contact")}
                  className="py-3 rounded-full text-center bg-[#007BFF] text-white font-sora font-semibold text-sm hover:shadow-lg transition-all"
                >
                  Hire Me Now
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
