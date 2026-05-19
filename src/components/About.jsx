import React from "react";
import { useSiteData } from "../context/SiteDataContext";
import { Download, Award, ShieldCheck, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  const { about } = useSiteData();

  // Scroll reveal variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="about" className="py-24 bg-[#111827]/40 relative overflow-hidden">
      {/* Visual background lights */}
      <div className="absolute top-[30%] right-[-10%] w-[300px] h-[300px] rounded-full bg-[#007BFF]/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-15%] w-[350px] h-[350px] rounded-full bg-[#38BDF8]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
        >
          {/* Left Column: Glowing Profile Picture */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative group">
              {/* Outer pulsing neon glow border */}
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#007BFF] to-[#38BDF8] opacity-75 blur-md group-hover:opacity-100 transition duration-500 animate-pulse-slow" />
              
              {/* Profile Photo Frame */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-[#0A0A0A] bg-[#111827]">
                {about.avatar ? (
                  <img
                    src={about.avatar}
                    alt="Shan Ranathunga Profile"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-textMuted bg-gray-800">
                    No Avatar Uploaded
                  </div>
                )}
              </div>
              
              {/* Small vector badges orbiting */}
              <div className="absolute bottom-2 right-6 p-3 rounded-full bg-[#0A0A0A] border border-white/5 text-[#38BDF8] shadow-lg neon-glow-border">
                <Award size={20} />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Narrative content & tag manager */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* Tag badge */}
            <span className="text-xs uppercase tracking-widest font-sora font-semibold text-[#38BDF8]">
              About My Creative Philosophy
            </span>
            
            {/* Title heading */}
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-sora">
              Crafting Premium Visual Experiences That Stand Out
            </h2>
            
            {/* Bio text */}
            <p className="text-textMuted font-light leading-relaxed text-base md:text-lg">
              {about.paragraph}
            </p>

            {/* Core credentials badges */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-2">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5">
                <ShieldCheck className="text-[#38BDF8] shrink-0" size={20} />
                <span className="text-xs text-textSoft font-medium">100% Quality Output</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5">
                <HeartHandshake className="text-[#38BDF8] shrink-0" size={20} />
                <span className="text-xs text-textSoft font-medium">Tailored Partnerships</span>
              </div>
            </div>

            {/* Skills tag badges */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-sora font-semibold text-white uppercase tracking-wider">
                My Core Toolkits & Specialities:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {about.skills && about.skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#1F2937]/50 text-textSoft border border-white/5 hover:border-[#38BDF8]/30 transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Resume CV Downloader */}
            <div className="mt-4">
              <a
                href={about.cvLink || "#"}
                download="Shan_Ranathunga_CV.pdf"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-sora font-semibold text-sm transition-all duration-350"
              >
                <Download size={16} className="text-[#38BDF8]" />
                Download Full Resume (CV)
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
