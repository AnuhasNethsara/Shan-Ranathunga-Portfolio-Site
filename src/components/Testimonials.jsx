import React from "react";
import { useSiteData } from "../context/SiteDataContext";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const Testimonials = () => {
  const { testimonials, settings } = useSiteData();

  // If testimonials section is toggled off in admin settings, hide it
  if (!settings.showTestimonials) return null;

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
    <section id="testimonials" className="py-24 bg-[#0A0A0A] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-widest font-sora font-semibold text-[#38BDF8]">
            Collaborative Success
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sora">
            Client Reviews
          </h2>
          <p className="text-textMuted font-light leading-relaxed text-sm md:text-base mt-2">
            Hear from corporate directors, startup executives, and digital creators who collaborated with Shan to elevate their brands.
          </p>
        </div>

        {/* Testimonials 3-Column Card Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((test) => (
            <motion.div
              variants={itemVariants}
              key={test.id}
              className="glass-card p-8 rounded-2xl flex flex-col gap-6 relative group overflow-hidden"
            >
              {/* Floating quotes overlay visual icon */}
              <Quote className="absolute top-6 right-6 text-white/5 group-hover:text-[#38BDF8]/5 transition-colors duration-300 pointer-events-none" size={56} />

              {/* Star Score representation */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={16}
                    fill={idx < test.rating ? "#F59E0B" : "none"}
                    stroke={idx < test.rating ? "#F59E0B" : "rgba(255,255,255,0.1)"}
                    className={idx < test.rating ? "drop-shadow-[0_0_4px_#F59E0B]" : ""}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-textSoft font-light leading-relaxed text-sm md:text-base italic flex-grow">
                "{test.reviewText}"
              </p>

              {/* Client Profile Info */}
              <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                {test.avatar ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                    <img
                      src={test.avatar}
                      alt={test.clientName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  // If no avatar image, render beautiful gradient initial circle
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#007BFF] to-[#38BDF8] flex items-center justify-center text-white font-sora font-semibold text-sm shadow-lg shrink-0">
                    {test.clientName ? test.clientName.split(" ").map(w => w[0]).join("") : "C"}
                  </div>
                )}
                <div>
                  <h4 className="font-sora text-sm font-semibold text-white tracking-tight">
                    {test.clientName}
                  </h4>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#38BDF8]">
                    Verified Client
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
