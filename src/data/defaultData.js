// High-resolution premium SVG templates to act as instant high-fidelity portfolio images
const svgThumbnail = (title, category, color1, color2) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
    <defs>
      <linearGradient id="grad-${title.replace(/\s+/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
      </linearGradient>
      <linearGradient id="glow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.15" />
        <stop offset="100%" style="stop-color:#000000;stop-opacity:0.4" />
      </linearGradient>
      <filter id="blur-gate" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="40" result="blur" />
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="#0B0F19"/>
    
    <!-- Background glowing orbs -->
    <circle cx="200" cy="150" r="180" fill="${color1}" filter="url(#blur-gate)" opacity="0.35"/>
    <circle cx="650" cy="300" r="150" fill="${color2}" filter="url(#blur-gate)" opacity="0.3"/>
    
    <!-- Grid overlay -->
    <path d="M 0,45 L 800,45 M 0,90 L 800,90 M 0,135 L 800,135 M 0,180 L 800,180 M 0,225 L 800,225 M 0,270 L 800,270 M 0,315 L 800,315 M 0,360 L 800,360 M 0,405 L 800,405" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    <path d="M 80,0 L 80,450 M 160,0 L 160,450 M 240,0 L 240,450 M 320,0 L 320,450 M 400,0 L 400,450 M 480,0 L 480,450 M 560,0 L 560,450 M 640,0 L 640,450 M 720,0 L 720,450" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>

    <!-- Central visual graphic card -->
    <rect x="150" y="80" width="500" height="290" rx="16" fill="url(#grad-${title.replace(/\s+/g, '')})" opacity="0.85" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
    <rect x="150" y="80" width="500" height="290" rx="16" fill="url(#glow)"/>
    
    <!-- Design abstract elements -->
    <circle cx="400" cy="225" r="70" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="10 5" opacity="0.6"/>
    <circle cx="400" cy="225" r="45" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.8"/>
    <polygon points="390,205 420,225 390,245" fill="#ffffff" opacity="0.9"/>
    
    <text x="180" y="140" fill="#ffffff" font-family="'Sora', sans-serif" font-size="14" font-weight="700" letter-spacing="3" opacity="0.6">${category.toUpperCase()}</text>
    <text x="180" y="320" fill="#ffffff" font-family="'Sora', sans-serif" font-size="32" font-weight="800" letter-spacing="-1">${title}</text>
    <text x="180" y="345" fill="#e5e7eb" font-family="'Inter', sans-serif" font-size="12" font-weight="400" opacity="0.7">Creative Freelance Concept by Shan Ranathunga</text>

    <!-- Floating visual code design items -->
    <rect x="550" y="110" width="60" height="24" rx="12" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
    <text x="580" y="126" fill="#ffffff" font-family="'Inter', sans-serif" font-size="10" font-weight="600" text-anchor="middle">HQ</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const svgAvatar = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
    <defs>
      <linearGradient id="avatar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#007BFF;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#38BDF8;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="#111827"/>
    <circle cx="100" cy="100" r="95" fill="none" stroke="url(#avatar-grad)" stroke-width="3"/>
    
    <!-- Designer visual icon silhouette -->
    <path d="M100,50 A 30,30 0 0 0 70,80 A 30,30 0 0 0 100,110 A 30,30 0 0 0 130,80 A 30,30 0 0 0 100,50 Z M100,120 A 50,50 0 0 0 50,170 A 10,10 0 0 0 60,180 L 140,180 A 10,10 0 0 0 150,170 A 50,50 0 0 0 100,120 Z" fill="url(#avatar-grad)"/>
    <circle cx="100" cy="80" r="12" fill="#ffffff"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const defaultData = {
  hero: {
    availabilityBadge: "✦ Available for Freelance & Branding Concepts",
    name: "Shan Ranathunga",
    title: "Freelance Graphic Designer & Creative Visual Artist",
    description: "Creating modern visuals, viral social media graphics, corporate branding packages, high-click thumbnails, and premium digital layouts.",
    button1Label: "View Portfolio",
    button1ScrollTarget: "portfolio",
    button2Label: "Contact Me",
    button2ScrollTarget: "contact"
  },
  about: {
    paragraph: "I'm Shan Ranathunga, a freelance graphic designer passionate about building visually impactful concepts that scale brands. I specialize in crafting professional social media ad creatives, engaging YouTube thumbnails, sleek brand packages, high-end promotional graphics, and conceptual layouts that instantly capture audience attention. With a deep understanding of layout, visual hierarchy, and colors, I turn ideas into premium designs.",
    avatar: svgAvatar(),
    skills: ["Photoshop", "Illustrator", "Branding", "Thumbnail Design", "Social Media Design", "UI Concepts", "Poster Design", "Figma", "Typography", "Color Theory"],
    cvLink: "#"
  },
  portfolio: [
    {
      id: "proj_1",
      title: "Apex Esports Branding",
      category: "Branding",
      image: svgThumbnail("Apex Esports Branding", "Branding", "#4F46E5", "#EF4444"),
      description: "A comprehensive brand identity kit completed for a professional esports federation, including vector dynamic logos, badge variations, social banner templates, and uniform guidelines.",
      tools: ["Illustrator", "Photoshop", "Typography"]
    },
    {
      id: "proj_2",
      title: "Viral Tech YouTube Thumbnail",
      category: "Thumbnails",
      image: svgThumbnail("Viral Tech YouTube Thumbnail", "Thumbnails", "#10B981", "#3B82F6"),
      description: "High-contrast YouTube video thumbnail optimized for extreme CTR. Features custom glowing outlines, 3D element rendering, premium grading, and readable typographic layout.",
      tools: ["Photoshop", "Color Theory", "3D Rendering"]
    },
    {
      id: "proj_3",
      title: "Neo-Urban Poster Showcase",
      category: "Posters",
      image: svgThumbnail("Neo-Urban Poster Showcase", "Posters", "#F59E0B", "#EF4444"),
      description: "A creative cyber-punk styled design poster emphasizing typography hierarchy, distressed image texture overlays, neon color adjustments, and high-impact digital composition.",
      tools: ["Photoshop", "Illustrator", "Poster Design"]
    },
    {
      id: "proj_4",
      title: "Glow Social Media Ad Grid",
      category: "Social Media",
      image: svgThumbnail("Glow Social Media Ad Grid", "Social Media", "#EC4899", "#8B5CF6"),
      description: "A cohesive set of 6 social promotional designs for a lifestyle digital brand, tailored for Instagram posts and story resolutions with custom glassmorphism components.",
      tools: ["Photoshop", "Social Media Design", "Figma"]
    },
    {
      id: "proj_5",
      title: "Zephyr Cloud Concept UI",
      category: "UI",
      image: svgThumbnail("Zephyr Cloud Concept UI", "UI", "#06B6D4", "#3B82F6"),
      description: "A futuristic visual UI design layout for a SaaS platform. Features fully optimized layouts, card matrices, high-fidelity components, and deep dark theme integration.",
      tools: ["Figma", "UI Concepts", "Illustrator"]
    },
    {
      id: "proj_6",
      title: "Aura Luxury Logo System",
      category: "Logos",
      image: svgThumbnail("Aura Luxury Logo System", "Logos", "#D97706", "#78350F"),
      description: "Minimalist geometry logo concept for a luxury premium hospitality organization, detailed with vector gold textures, clean typography, and balanced layouts.",
      tools: ["Illustrator", "Typography", "Branding"]
    }
  ],
  services: [
    {
      id: "serv_1",
      title: "Social Media Design",
      iconName: "Layers",
      description: "High-impact Instagram carousels, Facebook ad campaigns, visual post grids, and modern story banner grids that boost social conversions."
    },
    {
      id: "serv_2",
      title: "YouTube Design",
      iconName: "Youtube",
      description: "CTR-focused custom thumbnails, banner art, profile branding, and dynamic video layout cards that make channels pop."
    },
    {
      id: "serv_3",
      title: "Branding & Identity",
      iconName: "Sparkles",
      description: "Custom geometric logos, brand kit layouts, color palette blueprints, typography guidelines, and digital stationery systems."
    },
    {
      id: "serv_4",
      title: "Promotional Design",
      iconName: "Megaphone",
      description: "Premium high-res advertising flyers, commercial poster prints, print-ready packages, and custom event promotion visuals."
    }
  ],
  testimonials: [
    {
      id: "test_1",
      clientName: "David Chen",
      rating: 5,
      reviewText: "Shan completely transformed our tech brand's social presence. His thumbnails increased our click-through rate by over 40%! He is incredibly creative, fast, and understands visual psychology.",
      avatar: ""
    },
    {
      id: "test_2",
      clientName: "Elena Rostova",
      rating: 5,
      reviewText: "Outstanding logo system! Shan's design captured our brand's voice perfectly. He was receptive to feedback and delivered pixel-perfect files. Will absolutely contract him for all future items.",
      avatar: ""
    },
    {
      id: "test_3",
      clientName: "Marcus Thorne",
      rating: 5,
      reviewText: "Working with Shan is a breeze. His bento portfolio designs are state-of-the-art and his attention to small visual micro-details is spectacular. The glassmorphism and glows look gorgeous!",
      avatar: ""
    }
  ],
  contactInfo: {
    email: "shan.designs@gmail.com",
    whatsapp: "+94771234567",
    instagram: "https://instagram.com/shan.designs",
    facebook: "https://facebook.com/shan.designs.freelance",
    discord: "shan_designs#9999",
    showDiscord: true
  },
  settings: {
    siteTitle: "Shan Ranathunga | Freelance Graphic Designer",
    metaDescription: "Portfolio of Shan Ranathunga — freelance graphic designer specializing in social media, branding, thumbnails, and creative digital experiences.",
    showTestimonials: true,
    showAvailability: true,
    darkModeOnly: true
  }
};
