import React, { useState } from "react";
import { useSiteData } from "../context/SiteDataContext";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X, Tag, Wrench } from "lucide-react";
import { defaultData } from "../data/defaultData";

const categories = ["All", "Thumbnails", "Social Media", "Branding", "Posters", "Logos", "UI"];

const Portfolio = () => {
  const { portfolio } = useSiteData();
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  const activePortfolio = (portfolio && portfolio.length > 0) ? portfolio : defaultData.portfolio;

  // Filter projects list
  const filteredProjects = activeFilter === "All"
    ? activePortfolio
    : activePortfolio.filter(proj => proj.category?.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section id="portfolio" className="py-24 bg-[#0A0A0A] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-widest font-sora font-semibold text-[#38BDF8]">
            Creative Showcase
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sora">
            My Portfolio Projects
          </h2>
          <p className="text-textMuted font-light leading-relaxed text-sm md:text-base mt-2">
            Explore premium graphic concepts, YouTube templates, UI mockups, and corporate branding identity systems built for world-class clients.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full border border-white/5 bg-[#111827]/40 backdrop-blur-md max-w-full overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold font-sora uppercase tracking-wider relative transition-all duration-300 ${
                  activeFilter === cat ? "text-white" : "text-textMuted hover:text-white"
                }`}
              >
                {activeFilter === cat && (
                  <motion.div
                    layoutId="activeFilterTab"
                    className="absolute inset-0 bg-[#007BFF] rounded-full -z-10 shadow-[0_0_12px_rgba(0,123,255,0.4)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio bento grid layout */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className="group relative rounded-2xl overflow-hidden glass-card aspect-[16/10] cursor-pointer"
              >
                {/* Visual Thumbnail */}
                <div className="w-full h-full relative overflow-hidden bg-[#111827]">
                  {proj.image ? (
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-textMuted">
                      No Preview
                    </div>
                  )}
                  {/* Subtle ambient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
                </div>

                {/* Hover Reveal Cover Overlay */}
                <div className="absolute inset-0 bg-[#0A0A0A]/80 opacity-0 group-hover:opacity-100 transition-all duration-350 flex flex-col justify-between p-6">
                  {/* Category Tag */}
                  <div className="flex items-center gap-1.5 self-start px-3 py-1.5 rounded-full border border-[#38BDF8]/20 bg-[#38BDF8]/10 text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">
                    <Tag size={10} />
                    <span>{proj.category}</span>
                  </div>

                  {/* Eye symbol */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-full bg-[#007BFF] text-white shadow-2xl scale-75 group-hover:scale-100 transition-all duration-300">
                    <Eye size={24} />
                  </div>

                  {/* Title & brief text */}
                  <div>
                    <h3 className="font-sora text-lg font-bold text-white tracking-tight leading-tight">
                      {proj.title}
                    </h3>
                    <p className="text-textMuted text-xs font-light mt-1 line-clamp-1">
                      Click to examine full workspace design details
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state handler */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 border border-dashed border-white/5 rounded-2xl bg-[#111827]/10"
          >
            <p className="text-textMuted font-light text-sm">
              No design projects added to the "{activeFilter}" category yet.
            </p>
          </motion.div>
        )}

        {/* Full Project examination Lightbox Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Back backdrop shade */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-[#0A0A0A]/90 backdrop-blur-md"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                transition={{ type: "spring", duration: 0.45 }}
                className="relative max-w-4xl w-full max-h-[90vh] rounded-3xl overflow-y-auto no-scrollbar glass-card shadow-2xl z-10 border border-white/10"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 p-2 rounded-full border border-white/10 text-textMuted hover:text-white bg-[#0A0A0A]/85 hover:bg-white/5 transition-all z-20"
                  aria-label="Close details modal"
                >
                  <X size={20} />
                </button>

                {/* Main Visual Image Hero */}
                <div className="w-full aspect-[16/9] relative bg-[#111827]">
                  {selectedProject.image ? (
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-textMuted">
                      No visual representation available
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                </div>

                {/* Details Section */}
                <div className="p-8 md:p-10 flex flex-col gap-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#38BDF8]/20 bg-[#38BDF8]/10 text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
                      <Tag size={12} />
                      {selectedProject.category}
                    </span>
                    <span className="text-xs text-textMuted font-light">
                      Freelance Production Release
                    </span>
                  </div>

                  <h3 className="font-sora text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {selectedProject.title}
                  </h3>

                  <div className="border-t border-white/5 pt-6 grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left: description */}
                    <div className="md:col-span-8">
                      <h4 className="font-sora text-sm font-semibold text-white uppercase tracking-wider mb-2">
                        Project Overview
                      </h4>
                      <p className="text-textMuted font-light leading-relaxed text-sm md:text-base">
                        {selectedProject.description || "No project description provided."}
                      </p>
                    </div>

                    {/* Right: tools */}
                    <div className="md:col-span-4 flex flex-col gap-4">
                      <div>
                        <h4 className="font-sora text-sm font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <Wrench size={14} className="text-[#38BDF8]" />
                          Tools Applied
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.tools ? (
                            Array.isArray(selectedProject.tools) ? (
                              selectedProject.tools.map((t, idx) => (
                                <span key={idx} className="px-3 py-1 rounded-md text-xs font-medium bg-white/5 border border-white/5 text-textSoft">
                                  {t}
                                </span>
                              ))
                            ) : (
                              selectedProject.tools.split(",").map((t, idx) => (
                                <span key={idx} className="px-3 py-1 rounded-md text-xs font-medium bg-white/5 border border-white/5 text-textSoft">
                                  {t.trim()}
                                </span>
                              ))
                            )
                          ) : (
                            <span className="text-xs text-textMuted font-light">None stated</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default Portfolio;
