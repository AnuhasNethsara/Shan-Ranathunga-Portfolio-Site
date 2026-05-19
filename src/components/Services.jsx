import React from "react";
import { useSiteData } from "../context/SiteDataContext";
import * as LucideIcons from "lucide-react";
import { motion } from "framer-motion";

const DynamicIcon = ({ name, ...props }) => {
  const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;
  return <IconComponent {...props} />;
};

const Services = () => {
  const { services } = useSiteData();

  // Scroll animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="services" className="py-24 bg-[#111827]/40 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/2 left-[-10%] w-[350px] h-[350px] rounded-full bg-[#007BFF]/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-[-10%] w-[300px] h-[300px] rounded-full bg-[#38BDF8]/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-widest font-sora font-semibold text-[#38BDF8]">
            Creative Competencies
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sora">
            What I Offer
          </h2>
          <p className="text-textMuted font-light leading-relaxed text-sm md:text-base mt-2">
            Providing tailored visual assets, social media branding kits, and graphic solutions engineered to elevate your business presentation.
          </p>
        </div>

        {/* 2x2 Services Matrix */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {services.map((service) => (
            <motion.div
              variants={itemVariants}
              key={service.id}
              className="glass-card glass-card-hover p-8 md:p-10 rounded-2xl flex flex-col gap-6 relative group overflow-hidden"
            >
              {/* Subtle background light on card hover */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 blur-xl transition duration-500 pointer-events-none" />

              <div className="flex items-start justify-between relative z-10">
                {/* Dynamically lookup Lucide icon */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-[#38BDF8] group-hover:text-white group-hover:bg-[#007BFF] transition-all duration-300 shadow-lg">
                  <DynamicIcon name={service.iconName || "Sparkles"} size={26} />
                </div>
                
                {/* Service numeric index indicator */}
                <span className="text-sm font-semibold text-textMuted/30 font-sora select-none">
                  ✦ HQ
                </span>
              </div>

              {/* Title & Info */}
              <div className="relative z-10 flex flex-col gap-3">
                <h3 className="font-sora text-xl md:text-2xl font-bold text-white tracking-tight leading-none group-hover:text-[#38BDF8] transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-textMuted font-light leading-relaxed text-sm md:text-base">
                  {service.description}
                </p>
              </div>

              {/* Glowing bottom line indicator */}
              <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-[#007BFF] to-[#38BDF8] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
