import React, { useState, useEffect } from "react";
import { useSiteData } from "../context/SiteDataContext";
import { ArrowDown, Briefcase, Mail } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const Hero = () => {
  const { hero, settings } = useSiteData();
  
  // Parallax mouse-track springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 100, mass: 0.5 };
  const particlesX = useSpring(mouseX, springConfig);
  const particlesY = useSpring(mouseY, springConfig);
  const glowX = useSpring(mouseX, { damping: 40, stiffness: 80 });
  const glowY = useSpring(mouseY, { damping: 40, stiffness: 80 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Map coordinates to percentage offsets (-25 to 25px)
      const xOffset = (clientX / width - 0.5) * 35;
      const yOffset = (clientY / height - 0.5) * 35;
      
      mouseX.set(xOffset);
      mouseY.set(yOffset);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleScrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  // Generate 25 persistent random floating dot coords
  const [particles] = useState(() => 
    Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 2,
    }))
  );

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A] bg-grid-glow py-24"
    >
      {/* 3D Parallax glowing backdrop */}
      <motion.div 
        style={{ x: glowX, y: glowY }}
        className="absolute inset-0 pointer-events-none z-0"
      >
        <div className="absolute top-[20%] left-[10%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-primary/10 blur-[120px] glow-gradient-radial" />
        <div className="absolute bottom-[10%] right-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-accent/5 blur-[120px] glow-gradient-radial" />
      </motion.div>

      {/* Parallax Floating particle layer */}
      <motion.div 
        style={{ x: particlesX, y: particlesY }}
        className="absolute inset-0 pointer-events-none z-10"
      >
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-[#38BDF8] opacity-[0.25]"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              boxShadow: "0 0 8px #38BDF8",
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.15, 0.45, 0.15],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-6 text-center relative z-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
          className="flex flex-col items-center gap-6"
        >
          {/* Availability Badge */}
          {settings.showAvailability && (
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8, y: 20 },
                visible: { opacity: 1, scale: 1, y: 0 }
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#38BDF8]/20 bg-[#38BDF8]/5 text-xs font-semibold tracking-wide text-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.08)]"
            >
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
              <span>{hero.availabilityBadge}</span>
            </motion.div>
          )}

          {/* H1 Name */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-8xl font-black tracking-tight text-white uppercase font-sora mt-2"
          >
            {hero.name}
          </motion.h1>

          {/* H2 Title */}
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.6 }}
            className="text-xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-textSoft to-textMuted max-w-3xl neon-text-blue font-sora leading-tight"
          >
            {hero.title}
          </motion.h2>

          {/* Paragraph Description */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.6 }}
            className="text-base md:text-lg text-textMuted max-w-2xl font-light leading-relaxed mt-2"
          >
            {hero.description}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-6"
          >
            <button
              onClick={() => handleScrollTo(hero.button1ScrollTarget || "portfolio")}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#007BFF] text-white font-sora font-semibold tracking-wide text-sm transition-all duration-350 hover:bg-blue-600 hover:shadow-[0_0_25px_rgba(0,123,255,0.4)] flex items-center justify-center gap-2 group"
            >
              <Briefcase size={16} className="group-hover:rotate-6 transition-transform" />
              {hero.button1Label}
            </button>
            <button
              onClick={() => handleScrollTo(hero.button2ScrollTarget || "contact")}
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-sora font-semibold tracking-wide text-sm transition-all duration-350 flex items-center justify-center gap-2"
            >
              <Mail size={16} />
              {hero.button2Label}
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Smooth scroll down indicator */}
      <div className="absolute bottom-8 left-10 right-10 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="p-2 border border-white/10 rounded-full bg-white/5"
        >
          <ArrowDown size={16} className="text-[#38BDF8]" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
