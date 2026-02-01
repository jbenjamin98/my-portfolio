import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useLayoutEffect,
  useDeferredValue,
} from "react";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
  Terminal as TerminalIcon,
  Shield,
  Users,
  Activity,
  Calendar,
  FileText,
  TrendingUp,
  Award,
  GraduationCap,
  Handshake,
  Funnel,
  ClipboardList,
  DollarSign,
  Zap,
  LayoutGrid,
  GalleryHorizontal,
  Linkedin,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import headshotImg from "./assets/headshot.jpg";
import duckImg from "./assets/duck.png";
import resumeData from "./assets/resumeData.json";

// --- RESUME DATA ---

const personalInfo = resumeData.personalInfo;

const experience = resumeData.experience;

const education = resumeData.education;

const volunteer = resumeData.volunteer;

const affiliations = resumeData.affiliations;

const certifications = resumeData.certifications;

const keyMetrics = resumeData.keyMetrics.map((item) => ({
  ...item,
  icon: { TrendingUp, FileText, Activity, Users, Briefcase, DollarSign, Zap }[
    item.icon
  ],
}));

const skillCategories = resumeData.skillCategories;

const testimonials = resumeData.testimonials;

const greetings = [
  "Hello!",
  "Low-code expert.",
  "Welcome!",
  "Program Manager.",
  "Hi there!",
  "Software Engineer.",
  "Greetings!",
  "Agile Leader.",
  "Nice to see you!",
  "Problem Solver."
];

// --- HELPER COMPONENTS ---

const AnimatedCounter = ({ value }) => {
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const match = value.match(/^([^0-9]*)([0-9,.]+)(.*)$/);
    if (match && !hasAnimated.current) {
      const [, prefix, , suffix] = match;
      element.textContent = `${prefix}0${suffix}`;
    } else {
      element.textContent = value;
    }
  }, [value]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const match = value.match(/^([^0-9]*)([0-9,.]+)(.*)$/);
    if (!match) return;

    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr.replace(/,/g, ""));

    if (isNaN(target)) return;

    let startTime;
    let animationFrameId;
    const duration = 2000;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // Ease out quart

      const current = Math.floor(ease * target);
      element.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        element.textContent = value;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animationFrameId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [value]);

  return <span ref={elementRef} />;
};

// Load all images from assets directory
const certImages = import.meta.glob("./assets/*.{png,jpg,jpeg,svg,webp}", {
  eager: false,
});

const noiseUrl = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`;

const SpotlightCard = ({
  children,
  className = "",
  as: Component = "div",
  enableTilt = false,
  noScrollTilt = false,
  ...props
}) => {
  const divRef = useRef(null);
  const overlayRef = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!divRef.current || !overlayRef.current) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    overlayRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, var(--spotlight-color-1, rgba(37, 99, 235, 0.15)), var(--spotlight-color-2, rgba(168, 85, 247, 0.15)), transparent 40%), ${noiseUrl}`;
    overlayRef.current.style.opacity = "1";
    divRef.current.style.borderColor = "rgba(59, 130, 246, 0.5)";

    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3; // Max 3 deg rotation
      const rotateY = ((x - centerX) / centerX) * 3;
      
      divRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
      divRef.current.style.transition = "transform 0.1s ease-out";
    }

    if (props.onMouseMove) props.onMouseMove(e);
  };

  const handleMouseEnter = (e) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (overlayRef.current) {
      overlayRef.current.style.opacity = "1";
      overlayRef.current.style.animation = "spotlight-pulse 3s ease-in-out infinite";
    }
    if (props.onMouseEnter) props.onMouseEnter(e);
  };

  const handleMouseLeave = (e) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (overlayRef.current) {
      overlayRef.current.style.opacity = "0";
      overlayRef.current.style.animation = "";
    }
    if (divRef.current) {
      divRef.current.style.borderColor = "";
    }
    if (divRef.current && enableTilt) {
      divRef.current.style.transform = "";
      divRef.current.style.transition = "transform 0.5s ease-out";
    }
    if (props.onMouseLeave) props.onMouseLeave(e);
  };

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch) return;

    let animationFrameId;
    
    const updateSpotlight = () => {
      if (!divRef.current || !overlayRef.current) return;
      
      const rect = divRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const x = rect.width / 2;
        const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        const y = progress * rect.height;
        
        overlayRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, var(--spotlight-color-1, rgba(37, 99, 235, 0.15)), var(--spotlight-color-2, rgba(168, 85, 247, 0.15)), transparent 40%), ${noiseUrl}`;
        overlayRef.current.style.opacity = "0.6";
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(updateSpotlight);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          window.addEventListener("scroll", onScroll, { passive: true });
          updateSpotlight();
        } else {
          window.removeEventListener("scroll", onScroll);
          cancelAnimationFrame(animationFrameId);
        }
      });
    });
    if (divRef.current) observer.observe(divRef.current);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <Component
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group overflow-hidden ${className}`}
      {...props}
    >
      <div className="relative z-10 h-full">{children}</div>
      <div
        ref={overlayRef}
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-0 z-20"
        style={{
          background: `radial-gradient(600px circle at 50% 50%, var(--spotlight-color-1, rgba(37, 99, 235, 0.15)), var(--spotlight-color-2, rgba(168, 85, 247, 0.15)), transparent 40%), ${noiseUrl}`,
        }}
      />
    </Component>
  );
};

const CertificationItem = ({ cert, index = 0 }) => {
  // Resolve image path
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const imagePath = `./assets/${cert.logo}`;
    const loader = certImages[imagePath];
    if (loader) {
      loader().then((mod) => setImageSrc(mod.default));
    }
  }, [cert.logo]);

  return (
    <div className="h-full animate-float-card" style={{ animationDelay: `-${index * 0.5}s` }}>
      <SpotlightCard className="h-full p-3 md:p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm bg-slate-50 dark:bg-slate-900 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-12 h-12 md:w-24 md:h-24 mb-3 md:mb-4 flex items-center justify-center">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={cert.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400">
                <Shield className="w-6 h-6 md:w-8 md:h-8" />
              </div>
            )}
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-100 text-[11px] md:text-xs text-center line-clamp-2 leading-tight">
            {cert.name}
          </span>
        </div>
      </SpotlightCard>
    </div>
  );
};

const MetricCard = ({ m }) => {
  const [key, setKey] = useState(0);

  return (
    <SpotlightCard
      className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95"
      onMouseEnter={() => setKey((prev) => prev + 1)}
      onClick={() => setKey((prev) => prev + 1)}
    >
      <div className="flex items-center gap-2 mb-2">
        <m.icon size={16} className={m.color} />
        <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
          {m.label}
        </span>
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white transition-transform duration-300 group-hover:scale-110 origin-left">
        <AnimatedCounter key={key} value={m.value} />
      </div>
    </SpotlightCard>
  );
};

const Typewriter = ({ words }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (reverse ? -1 : 1));
      },
      reverse ? 75 : 150,
    );

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <span>
      {words[index].substring(0, subIndex)}
      <span
        className="animate-blink text-blue-600 dark:text-blue-400"
      >
        {'\u2588'}
      </span>
    </span>
  );
};

const TestimonialCard = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <SpotlightCard
      className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer h-fit transition-all duration-300 active:scale-95"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold uppercase">
        {item.source}
      </div>
      <div className="relative">
        <p
          className={`italic text-sm text-slate-600 dark:text-slate-300 leading-relaxed ${!isExpanded ? "line-clamp-5" : ""}`}
        >
          "{item.text}"
        </p>
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-800 dark:via-slate-800/80 dark:to-transparent"></div>
        )}
      </div>
      <div className="mt-2 flex justify-center text-slate-400">
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
    </SpotlightCard>
  );
};

const triggerConfetti = (x, y) => {
  const colors = ['#2563eb', '#a855f7', '#3b82f6', '#ef4444', '#eab308'];
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.width = '6px';
    el.style.height = '6px';
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.borderRadius = '50%';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9999';
    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 3;
    const tx = Math.cos(angle) * velocity * 40;
    const ty = Math.sin(angle) * velocity * 40 + 20; // slight gravity

    const animation = el.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
    ], {
      duration: 600 + Math.random() * 300,
      easing: 'cubic-bezier(0, .9, .57, 1)'
    });

    animation.onfinish = () => el.remove();
  }
};

const useShake = (callback, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;
    
    let lastX, lastY, lastZ;
    let lastTime = 0;
    const threshold = 15;

    const handleMotion = (e) => {
      const current = e.accelerationIncludingGravity;
      if (!current) return;
      
      const now = Date.now();
      if ((now - lastTime) > 100) {
        const diffTime = now - lastTime;
        lastTime = now;
        
        if (lastX !== undefined) {
          const speed = Math.abs(current.x + current.y + current.z - lastX - lastY - lastZ) / diffTime * 10000;
          if (speed > threshold) {
            callback();
          }
        }
        
        lastX = current.x;
        lastY = current.y;
        lastZ = current.z;
      }
    };

    if (typeof window !== 'undefined' && 'ondevicemotion' in window) {
       window.addEventListener('devicemotion', handleMotion);
    }
    return () => {
       if (typeof window !== 'undefined' && 'ondevicemotion' in window) {
         window.removeEventListener('devicemotion', handleMotion);
       }
    };
  }, [callback, enabled]);
};

// --- CUSTOM HOOKS ---

const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  return [darkMode, setDarkMode];
};

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let animationFrameId;

    const toggleVisibility = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setIsVisible(window.scrollY > 400);
      });
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`fixed bottom-[calc(2rem+env(safe-area-inset-bottom))] right-[calc(2rem+env(safe-area-inset-right))] z-50 hidden lg:block transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
    >
      <div className="animate-float-button pause-on-hover">
        <div className="animate-hover-pulse animate-press-squish">
          <button
            onClick={scrollToTop}
            className="pointer-events-auto p-3 rounded-xl text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-shadow duration-300 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-[length:200%_200%] animate-gradient-x hover:shadow-blue-500/50"
            aria-label="Go to top"
          >
            <ChevronUp size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

const TimelineScrollLine = () => {
  const lineRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    let animationFrameId;

    const updateHeight = () => {
      if (!lineRef.current || !fillRef.current) return;
      
      const rect = lineRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const triggerPoint = viewportHeight * 0.6;
      
      const scrolled = triggerPoint - rect.top;
      const newHeight = Math.max(0, Math.min(scrolled, rect.height));
      
      fillRef.current.style.height = `${newHeight}px`;
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(updateHeight);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateHeight();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={lineRef}
      className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700/50"
      style={{
        maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div 
        ref={fillRef}
        className="w-full bg-gradient-to-b from-blue-600 via-purple-500 to-blue-600"
        style={{ height: '0px', transition: "height 0.1s linear" }}
      />
    </div>
  );
};

const TimelineDot = () => {
  const dotRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          setIsActive(true);
        } else {
          setIsActive(false);
        }
      },
      { rootMargin: "0px 0px -40% 0px", threshold: 0 }
    );

    if (dotRef.current) {
      observer.observe(dotRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={dotRef}
      className={`w-5 h-5 rounded-full border-4 border-slate-50 dark:border-slate-900 transition-all duration-500 ${
        isActive 
          ? "bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 animate-timeline-dot shadow-sm scale-100" 
          : "bg-slate-300 dark:bg-slate-600 scale-75"
      }`}
    />
  );
};

const RevealOnScroll = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${isVisible ? delay : 0}ms` }}
      className={`transition-all duration-1000 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
    >
      {children}
    </div>
  );
};

const ScrollProgress = () => {
  const barRef = useRef(null);

  useEffect(() => {
    let animationFrameId;

    const handleScroll = () => {
      if (!barRef.current) return;
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const percent = (scrollPosition / totalHeight) * 100;
      barRef.current.style.width = `${percent}%`;
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 h-1 z-50 w-full bg-transparent pointer-events-none">
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 transition-all duration-100 ease-out opacity-80"
        style={{ width: '0%' }}
      />
    </div>
  );
};

const MatrixRain = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let drops = [];
    const fontSize = 15;
    const columnWidth = 20;
    const chars = "01"; 

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const columns = Math.ceil(canvas.width / columnWidth);
      drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * canvas.height / columnWidth));
    };

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(init, 100);
    };

    window.addEventListener('resize', handleResize);
    init();

    let lastTime = 0;
    const fps = 24;
    const interval = 1000 / fps;

    const draw = (time) => {
      const deltaTime = time - lastTime;
      
      if (deltaTime >= interval) {
        lastTime = time - (deltaTime % interval);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0F0';
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
          const text = chars.charAt(Math.floor(Math.random() * chars.length));
          ctx.fillText(text, i * columnWidth, drops[i] * columnWidth);
          if (drops[i] * columnWidth > canvas.height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };
    
    animationFrameId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-20" />;
};

const CyberpunkBackground = () => {
  const sunRef = useRef(null);
  const gridRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (bgRef.current) bgRef.current.style.transform = `translateY(${scrolled * 0.05}px)`;
      if (sunRef.current) sunRef.current.style.transform = `translate(-50%, ${scrolled * 0.2}px)`;
      if (gridRef.current) gridRef.current.style.backgroundPosition = `0 ${scrolled * 0.5}px`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]">
      <div 
        ref={bgRef}
        className="absolute inset-0 bg-gradient-to-b from-purple-900 via-purple-800 to-pink-600 opacity-20"
        style={{ height: '120%', top: '-10%' }}
      />
      <div 
        ref={sunRef}
        className="absolute bottom-[30%] left-1/2 w-64 h-64"
        style={{ transform: 'translate(-50%, 0)' }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-t from-yellow-300 to-pink-600 blur-sm opacity-80 animate-sun-glitch" style={{ boxShadow: '0 0 60px rgba(255, 0, 255, 0.4)' }}>
           <div className="absolute inset-0 w-full h-full bg-[repeating-linear-gradient(transparent,transparent_4px,#050505_4px,#050505_6px)] opacity-40 animate-pulse" />
        </div>
      </div>
      <div 
        ref={gridRef}
        className="absolute bottom-0 left-0 right-0 h-[50%] bg-[linear-gradient(transparent_0%,rgba(0,243,255,0.5)_2px,transparent_4px),linear-gradient(90deg,transparent_0%,rgba(0,243,255,0.5)_2px,transparent_4px)]"
        style={{ 
            backgroundSize: '60px 60px', 
            transform: 'perspective(300px) rotateX(60deg) scale(2)',
            transformOrigin: 'bottom'
        }} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
    </div>
  );
};

const ParallaxBackground = ({ theme }) => {
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const blob3Ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) return;

    let animationFrameId;
    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        if (blob1Ref.current) blob1Ref.current.style.transform = `translate3d(0, ${scrolled * 0.35}px, 0)`;
        if (blob2Ref.current) blob2Ref.current.style.transform = `translate3d(0, ${scrolled * -0.25}px, 0)`;
        if (blob3Ref.current) blob3Ref.current.style.transform = `translate3d(0, ${scrolled * 0.15}px, 0)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (theme === 'retro') return <MatrixRain />;
  if (theme === 'cyberpunk') return <CyberpunkBackground />;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 transition-colors duration-300" />
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      <div ref={blob1Ref} className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] min-w-[300px] min-h-[300px] bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 dark:from-blue-600 dark:via-purple-500 dark:to-blue-600 bg-[length:200%_200%] animate-gradient-x rounded-full blur-3xl opacity-20 mix-blend-multiply dark:mix-blend-screen transition-colors duration-300" style={{ animationDuration: '15s' }} />
      <div ref={blob2Ref} className="absolute top-[30%] -right-[10%] w-[40vw] h-[40vw] min-w-[250px] min-h-[250px] bg-gradient-to-r from-purple-500 via-blue-600 to-purple-500 dark:from-purple-500 dark:via-blue-600 dark:to-purple-500 bg-[length:200%_200%] animate-gradient-x rounded-full blur-3xl opacity-20 mix-blend-multiply dark:mix-blend-screen transition-colors duration-300" style={{ animationDuration: '18s' }} />
      <div ref={blob3Ref} className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] min-w-[400px] min-h-[400px] bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 dark:from-blue-600 dark:via-purple-500 dark:to-blue-600 bg-[length:200%_200%] animate-gradient-x rounded-full blur-3xl opacity-20 mix-blend-multiply dark:mix-blend-screen transition-colors duration-300" style={{ animationDuration: '20s' }} />
    </div>
  );
};

const PullToRefresh = () => {
  const [style, setStyle] = useState({ transform: 'translateY(0px)', opacity: 0 });
  const [icon, setIcon] = useState('chevron'); // 'chevron' or 'spinner'
  const [rotation, setRotation] = useState(0);

  const state = useRef({
    isPulling: false,
    pullDistance: 0,
    startY: 0,
    threshold: 100,
  }).current;

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) return;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        state.startY = e.touches[0].clientY;
        state.isPulling = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!state.isPulling) return;
      const distance = e.touches[0].clientY - state.startY;

      if (distance > 0) {
        e.preventDefault();
        state.pullDistance = distance;
        const easedPull = 1 - Math.pow(1 - Math.min(distance / (state.threshold * 1.5), 1), 3);
        const indicatorY = easedPull * state.threshold;
        setStyle({ transform: `translateY(${indicatorY}px)`, opacity: 1 });
        setRotation((distance / state.threshold) * 360);
      } else {
        state.isPulling = false;
      }
    };

    const handleTouchEnd = () => {
      if (!state.isPulling) return;
      state.isPulling = false;

      if (state.pullDistance > state.threshold) {
        setIcon('spinner');
        setStyle({ transform: `translateY(${state.threshold}px)`, opacity: 1 });
        setTimeout(() => {
          setIcon('chevron');
          setStyle({ transform: 'translateY(0px)', opacity: 0 });
        }, 1500);
      } else {
        setStyle({ transform: 'translateY(0px)', opacity: 0 });
      }
      state.pullDistance = 0;
      state.startY = 0;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [state]);

  return (
    <div
      className="fixed top-[-60px] left-0 right-0 z-50 flex justify-center items-center pointer-events-none transition-transform duration-300 ease-out"
      style={{ height: '60px', ...style }}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 pull-refresh-circle">
        {icon === 'spinner' ? (
          <div className="animate-spin">
            <img src={duckImg} alt="Loading" className="w-6 h-6 object-contain" />
          </div>
        ) : (
          <div style={{ transform: `rotate(${rotation}deg)` }}>
            <img src={duckImg} alt="Pull to refresh" className="w-6 h-6 object-contain" />
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function Portfolio() {
  const [visibleSection, setVisibleSection] = useState("experience");
  const [expandedJob, setExpandedJob] = useState(1);
  const [activeSkillFilter, setActiveSkillFilter] = useState(null);
  const [certView, setCertView] = useState("carousel");
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(isPaused);
  const [darkMode, setDarkMode] = useDarkMode();
  const [specialTheme, setSpecialTheme] = useState(null);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    let timeoutId;
    const triggerGlitch = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 300);
      const nextDelay = Math.random() * 5000 + 2000;
      timeoutId = setTimeout(triggerGlitch, nextDelay);
    };
    timeoutId = setTimeout(triggerGlitch, 2000);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode || specialTheme) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode, specialTheme]);

  useEffect(() => {
    // Update theme-color meta tag for mobile browsers to match the header/background
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    let color = "#f8fafc"; // Light mode default (slate-50)
    
    if (specialTheme === 'retro') {
      color = "#000000";
    } else if (specialTheme === 'cyberpunk') {
      color = "#050505";
    } else if (darkMode) {
      color = "#0f172a"; // Dark mode default (slate-900)
    }

    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", color);
    } else {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = color;
      document.head.appendChild(meta);
    }

    // Ensure viewport-fit=cover is set for notches
    const metaViewport = document.querySelector("meta[name=viewport]");
    if (metaViewport && !metaViewport.content.includes("viewport-fit=cover")) {
      metaViewport.content += ", viewport-fit=cover";
    }
  }, [darkMode, specialTheme]);

  const toggleTheme = (theme) => {
    triggerHaptic();
    if (specialTheme === theme) {
      setSpecialTheme(null);
      document.documentElement.classList.remove(theme);
    } else {
      if (specialTheme) {
        document.documentElement.classList.remove(specialTheme);
      }
      setSpecialTheme(theme);
      document.documentElement.classList.add(theme);
    }
  };

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const [isVolunteerExpanded, setIsVolunteerExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768;
    }
    return false;
  });

  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  useShake(() => {
    if (activeSkillFilter) {
      setActiveSkillFilter(null);
      triggerHaptic();
    }
  }, !!activeSkillFilter);

  const navItemRefs = useRef({});
  const [hoveredNav, setHoveredNav] = useState(null);
  const [activeBlobStyle, setActiveBlobStyle] = useState({
    left: 0,
    width: 0,
    top: 0,
    height: 0,
    opacity: 0,
  });
  const [hoverBlobStyle, setHoverBlobStyle] = useState({
    left: 0,
    width: 0,
    top: 0,
    height: 0,
    opacity: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;

      // Show nav when near bottom so it docks above footer, otherwise hide on scroll down
      if (nearBottom) {
        setShowNav(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const deferredSkillFilter = useDeferredValue(activeSkillFilter);

  useEffect(() => {
    const handleResize = () => {
      const element = navItemRefs.current[visibleSection];
      if (element) {
        setActiveBlobStyle({
          left: element.offsetLeft,
          width: element.offsetWidth,
          top: element.offsetTop,
          height: element.offsetHeight,
          opacity: 1,
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [visibleSection]);

  useLayoutEffect(() => {
    const element = navItemRefs.current[visibleSection];

    if (element && !hoveredNav) {
      setActiveBlobStyle({
        left: element.offsetLeft,
        width: element.offsetWidth,
        top: element.offsetTop,
        height: element.offsetHeight,
        opacity: 1,
      });
    }
  }, [visibleSection, hoveredNav]);

  useLayoutEffect(() => {
    const element = navItemRefs.current[hoveredNav];

    if (element && hoveredNav !== visibleSection) {
      setHoverBlobStyle({
        left: element.offsetLeft,
        width: element.offsetWidth,
        top: element.offsetTop,
        height: element.offsetHeight,
        opacity: 1,
      });
    } else {
      const activeElement = navItemRefs.current[visibleSection];
      if (activeElement) {
        setActiveBlobStyle({
          left: activeElement.offsetLeft,
          width: activeElement.offsetWidth,
          top: activeElement.offsetTop,
          height: activeElement.offsetHeight,
          opacity: 1,
        });
      }
      setHoverBlobStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [hoveredNav, visibleSection]);

  const navItems = [
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "skills", label: "Skills & Certs", icon: Lightbulb },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "volunteer", label: "Volunteer", icon: Handshake },
  ];

  const scrollToSection = (id) => {
    triggerHaptic();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const sections = navItems.map((item) => document.getElementById(item.id));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((section) => section && observer.observe(section));
    return () =>
      sections.forEach((section) => section && observer.unobserve(section));
  }, []);

  const toggleJob = (id) => {
    triggerHaptic();
    setExpandedJob(expandedJob === id ? null : id);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || certView !== "carousel") return;

    let cards = Array.from(container.getElementsByClassName("carousel-card"));
    let cardCenters = [];
    let scrollWidth = 0;
    let clientWidth = 0;

    const updateMetrics = () => {
      scrollWidth = container.scrollWidth;
      clientWidth = container.clientWidth;
      cards = Array.from(container.getElementsByClassName("carousel-card"));
      cardCenters = cards.map(card => card.offsetLeft + card.offsetWidth / 2);
    };

    // Initial calculation
    updateMetrics();
    window.addEventListener('resize', updateMetrics);

    let animationId;
    const scroll = () => {
      if (!isPausedRef.current) {
        // Infinite scroll logic: reset when we've scrolled past the first set
        if (container.scrollLeft >= scrollWidth / 2) {
          container.scrollLeft -= scrollWidth / 2;
        } else {
          container.scrollLeft += 1; // Scroll speed
        }
      }

      const center = container.scrollLeft + clientWidth / 2;
      
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardCenter = cardCenters[i];
        const dist = Math.abs(center - cardCenter);
        
        if (dist < clientWidth) {
          const maxDist = clientWidth / 2;
          const scale = Math.max(0.85, 1 - (dist / maxDist) * 0.15);
          card.style.transform = `scale(${scale})`;
        } else if (card.style.transform !== 'scale(0.85)') {
          card.style.transform = 'scale(0.85)';
        }
      }
      animationId = requestAnimationFrame(scroll);
    };
    
    animationId = requestAnimationFrame(scroll);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateMetrics);
    };
  }, [certView]);

  const handleMouseDown = (e) => {
    if (window.innerWidth >= 1024) return;
    setIsDragging(true);
    setIsPaused(true);
    if (scrollContainerRef.current) {
      startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
      scrollLeftStart.current = scrollContainerRef.current.scrollLeft;
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    if (scrollContainerRef.current) {
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX.current) * 2;
      scrollContainerRef.current.scrollLeft = scrollLeftStart.current - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = (e) => {
    setIsDragging(false);
    if (e.buttons === 1) {
      const onMouseUp = () => {
        setIsPaused(false);
        window.removeEventListener('mouseup', onMouseUp);
      };
      window.addEventListener('mouseup', onMouseUp);
    } else {
      setIsPaused(false);
    }
  };

  const handleTouchStart = () => {
    setIsPaused(true);
  };

  // handleTouchMove removed as we use native scrolling for touch

  const handleTouchEnd = () => {
    setIsPaused(false);
  };

  const groupedCertifications = useMemo(() => {
    return Object.entries(
      certifications.reduce((acc, cert) => {
        const cat = cert.category || "Other";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(cert);
        return acc;
      }, {}),
    );
  }, []);

  const handleSkillClick = (skill) => {
    triggerHaptic();
    if (activeSkillFilter === skill) {
      setActiveSkillFilter(null);
    } else {
      setActiveSkillFilter(skill);
      scrollToSection("experience");
    }
  };

  const filteredExperience = useMemo(() => {
    if (!deferredSkillFilter) return experience;
    const term = deferredSkillFilter.toLowerCase();
    return experience.filter((job) => {
      const text = [job.role, job.company, job.project, ...(job.details || [])]
        .join(" ")
        .toLowerCase();
      return text.includes(term);
    });
  }, [deferredSkillFilter]);

  return (
    <div className="min-h-[100dvh] text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans relative">
      <PullToRefresh />
      <ScrollProgress />
      <ParallaxBackground theme={specialTheme} />
      <BackToTopButton />
      {/* Styles Injection for Animations */}
      <style>{`
        html { 
          scroll-behavior: smooth; 
          scroll-padding-top: 7rem; 
          background-color: #f8fafc;
          overscroll-behavior-y: none;
          -webkit-tap-highlight-color: transparent;
          -webkit-text-size-adjust: 100%;
        }
        html.dark { background-color: #0f172a; }
        
        :root {
          --spotlight-color-1: rgba(37, 99, 235, 0.15);
          --spotlight-color-2: rgba(168, 85, 247, 0.15);
          --duck-glow: rgba(250, 204, 21, 0.4);
        }

        section { min-height: 20vh; }
        .animate-floatIn { animation: floatIn 0.6s ease-out forwards; opacity: 0; }
        @keyframes floatIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-popIn { animation: popIn 0.4s ease-out forwards; opacity: 0; }
        @keyframes popIn { from { opacity: 0; transform: translateY(10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-skill { animation: popIn 0.4s ease-out forwards, drift 6s ease-in-out infinite; opacity: 0; }
        @keyframes drift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes fly { 0% { transform: translateX(-100px); } 100% { transform: translateX(100vw); } }
        .animate-fly { animation: fly 30s linear infinite; }
        .pause-on-hover:hover { animation-play-state: paused; }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        @keyframes nav-glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(37, 99, 235, 0.6); }
          50% { box-shadow: 0 0 30px rgba(37, 99, 235, 0.9); }
        }
        @keyframes nav-glow-pulse-dark {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
        }
        .animate-nav-active {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite, nav-glow-pulse 2s ease-in-out infinite;
        }
        .dark .animate-nav-active {
          animation: gradient-x 3s ease infinite, nav-glow-pulse-dark 2s ease-in-out infinite;
        }
        @keyframes gradient-x { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        
        /* Glitch Effect */
        .glitch {
          position: relative;
        }
        .glitch:hover::before,
        .glitch:hover::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .glitch:hover::before {
          left: 2px;
          text-shadow: -2px 0 #ff00c1;
          animation: glitch-anim-1 2s infinite linear alternate-reverse;
        }
        .glitch:hover::after {
          left: -2px;
          text-shadow: -2px 0 #00fff9;
          animation: glitch-anim-2 2s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim-1 {
          0% { clip-path: inset(20% 0 80% 0); }
          20% { clip-path: inset(60% 0 10% 0); }
          40% { clip-path: inset(40% 0 50% 0); }
          60% { clip-path: inset(80% 0 5% 0); }
          80% { clip-path: inset(10% 0 60% 0); }
          100% { clip-path: inset(50% 0 30% 0); }
        }
        @keyframes glitch-anim-2 {
          0% { clip-path: inset(10% 0 60% 0); }
          20% { clip-path: inset(30% 0 20% 0); }
          40% { clip-path: inset(70% 0 10% 0); }
          60% { clip-path: inset(20% 0 50% 0); }
          80% { clip-path: inset(60% 0 20% 0); }
          100% { clip-path: inset(40% 0 80% 0); }
        }
        .glitch.active-glitch::before {
          left: 2px;
          text-shadow: -2px 0 #ff00c1;
          animation: glitch-anim-1 0.3s infinite linear alternate-reverse;
        }
        .glitch.active-glitch::after {
          left: -2px;
          text-shadow: -2px 0 #00fff9;
          animation: glitch-anim-2 0.3s infinite linear alternate-reverse;
        }
        @keyframes particle {
          0% { transform: translate(0, 0); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(-20px, -15px); opacity: 0; }
        }
        .animate-particle {
          animation: particle 0.5s linear infinite;
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bob {
          animation: bob 2s ease-in-out infinite;
        }
        @keyframes float-card {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-card {
          animation: float-card 6s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          .animate-float-card {
            animation: none;
          }
        }
        @keyframes float-button {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-button {
          animation: float-button 3s ease-in-out infinite;
        }
        @keyframes hover-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-hover-pulse:hover {
          animation: hover-pulse 1s ease-in-out infinite;
        }
        @keyframes press-squish {
          0% { transform: scale(1); }
          50% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-press-squish:active {
          animation: press-squish 0.2s ease-in-out;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(37, 99, 235, 0.5); transform: scale(1.05); }
          50% { box-shadow: 0 0 5px rgba(37, 99, 235, 0.2); transform: scale(1); }
        }
        .animate-timeline-dot {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite, pulse-glow 2s ease-in-out infinite;
        }
        @keyframes spotlight-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        .dark ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #2563eb, #a855f7, #2563eb); border-radius: 5px; }
        ::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #1d4ed8, #9333ea, #1d4ed8); }

        /* Carousel Scrollbar */
        .carousel-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .carousel-scrollbar::-webkit-scrollbar { display: none; }
        
        /* Text Selection */
        ::selection { background-color: rgba(168, 85, 247, 0.5); color: white; }
        html.retro ::selection { background-color: #00ff00; color: #000000; }
        html.cyberpunk ::selection { background-color: #ff00ff; color: #000000; }

        /* Retro Theme */
        html.retro {
          --bg-primary: #000000;
          --text-primary: #00ff00;
          --spotlight-color-1: rgba(0, 255, 0, 0.2);
          --spotlight-color-2: rgba(0, 255, 0, 0.05);
          background-color: #000000 !important;
          --duck-glow: rgba(0, 255, 0, 0.5);
        }
        html.retro body {
          background-color: #000000 !important;
          color: #00ff00 !important;
          font-family: 'Courier New', Courier, monospace !important;
        }
        html.retro * {
          border-color: #00ff00 !important;
          font-family: 'Courier New', Courier, monospace !important;
        }
        html.retro .bg-white, html.retro .bg-slate-50, html.retro .bg-slate-100, 
        html.retro .dark .bg-slate-900, html.retro .dark .bg-slate-800 {
          background-color: #000000 !important;
          color: #00ff00 !important;
          box-shadow: none !important;
        }
        html.retro .text-slate-500, html.retro .text-slate-600, html.retro .text-slate-900, 
        html.retro .text-blue-600, html.retro .text-blue-500, html.retro .dark .text-slate-400, 
        html.retro .dark .text-white, html.retro .dark .text-blue-400, html.retro .dark .text-blue-300 {
          color: #00ff00 !important;
        }
        html.retro .bg-blue-500 {
          background-color: #00ff00 !important;
        }
        html.retro img {
          filter: grayscale(100%) brightness(0.8) sepia(100%) hue-rotate(50deg) saturate(500%);
        }
        html.retro::after {
          content: " ";
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          z-index: 60;
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }
        html.retro [class*="bg-slate-900"] { background-color: #000000 !important; }
        
        /* Retro Theme Extras */
        html.retro ::-webkit-scrollbar-thumb {
          background: #00ff00 !important;
          border-radius: 0 !important;
        }
        html.retro button span {
          font-size: 0.75rem !important;
          letter-spacing: -0.5px;
        }
        html.retro ::-webkit-scrollbar-track {
          background: #000000 !important;
        }
        html.retro .bg-gradient-to-r, html.retro .bg-gradient-to-b,
        html.retro .animate-gradient-x, html.retro .animate-nav-active, html.retro .animate-timeline-dot {
          background: #00ff00 !important;
          animation: none !important;
          box-shadow: none !important;
        }
        html.retro .bg-gradient-to-t {
          display: none !important;
        }
        html.retro .text-transparent {
          background: none !important;
          -webkit-text-fill-color: #00ff00 !important;
          color: #00ff00 !important;
        }

        /* Cyberpunk Theme */
        html.cyberpunk body {
          background-color: #050505 !important;
          color: #00f3ff !important;
        }
        html.cyberpunk {
          --spotlight-color-1: rgba(0, 243, 255, 0.2);
          --spotlight-color-2: rgba(255, 0, 255, 0.2);
          background-color: #050505 !important;
          --duck-glow: rgba(0, 243, 255, 0.5);
        }
        html.cyberpunk .bg-white, html.cyberpunk .bg-slate-50, html.cyberpunk .bg-slate-100,
        html.cyberpunk .dark .bg-slate-900, html.cyberpunk .dark .bg-slate-800 {
          background-color: #0a0a10 !important;
          border-color: #ff00ff !important;
          color: #00f3ff !important;
          box-shadow: 2px 2px 0px #ff00ff !important;
        }
        html.cyberpunk .text-slate-900, html.cyberpunk .dark .text-white {
          color: #fcee0a !important;
          text-shadow: 2px 2px 0px #ff00ff;
        }
        html.cyberpunk .text-slate-500, html.cyberpunk .text-slate-600, html.cyberpunk .text-slate-400 {
          color: #ff00ff !important;
        }
        html.cyberpunk .text-blue-600, html.cyberpunk .text-blue-500, html.cyberpunk .dark .text-blue-400, html.cyberpunk .dark .text-blue-300 {
          color: #00f3ff !important;
        }
        html.cyberpunk .bg-blue-500 {
          background-color: #00f3ff !important;
          box-shadow: 0 0 5px #00f3ff;
        }
        html.cyberpunk img {
          filter: grayscale(100%) sepia(100%) hue-rotate(130deg) saturate(200%) contrast(1.2) drop-shadow(0 0 5px #00f3ff);
        }
        
        /* Cyberpunk Theme Extras */
        html.cyberpunk ::-webkit-scrollbar-thumb {
          background: #00f3ff !important;
          border: 1px solid #ff00ff !important;
        }
        html.cyberpunk ::-webkit-scrollbar-track {
          background: #050505 !important;
        }
        html.cyberpunk .bg-gradient-to-r, html.cyberpunk .bg-gradient-to-b {
          background: linear-gradient(90deg, #ff00ff, #00f3ff) !important;
        }
        html.cyberpunk .bg-gradient-to-t {
          display: none !important;
        }
        html.cyberpunk .text-transparent {
          background: none !important;
          -webkit-text-fill-color: #fcee0a !important;
          color: #fcee0a !important;
        }
        html.cyberpunk .animate-gradient-x, html.cyberpunk .animate-nav-active {
          background: linear-gradient(90deg, #ff00ff, #00f3ff) !important;
          box-shadow: 0 0 15px #00f3ff, 0 0 5px #ff00ff !important;
        }
        html.cyberpunk .animate-timeline-dot {
          background: #00f3ff !important;
          box-shadow: 0 0 10px #ff00ff !important;
        }
        @keyframes sun-glitch {
          0% { transform: skew(0deg); filter: hue-rotate(0deg); }
          5% { transform: skew(2deg); filter: hue-rotate(10deg); }
          10% { transform: skew(0deg); filter: hue-rotate(0deg); }
          15% { transform: skew(-2deg); filter: hue-rotate(-10deg); }
          20% { transform: skew(0deg); filter: hue-rotate(0deg); }
          100% { transform: skew(0deg); filter: hue-rotate(0deg); }
        }
        .animate-sun-glitch {
            animation: sun-glitch 4s infinite step-end;
        }
        .pull-refresh-circle {
          box-shadow: 0 0 15px var(--duck-glow) !important;
        }
        html.cyberpunk h1, html.cyberpunk h2, html.cyberpunk h3, html.cyberpunk h4, html.cyberpunk h5, html.cyberpunk h6 {
          font-family: 'Courier New', Courier, monospace !important;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-shadow: 2px 0 #ff00ff, -2px 0 #00f3ff;
        }
        html.cyberpunk h1, html.cyberpunk h1.animate-gradient-x {
          background: none !important;
          box-shadow: none !important;
          position: relative;
          display: inline-block;
          text-shadow: none !important;
          animation: none !important;
        }
        html.cyberpunk h1::before,
        html.cyberpunk h1::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #050505;
        }
        html.cyberpunk h1::before {
          left: 2px;
          text-shadow: -2px 0 #ff00ff;
          animation: glitch-anim-1 2s infinite linear alternate-reverse;
        }
        html.cyberpunk h1::after {
          left: -2px;
          text-shadow: -2px 0 #00f3ff;
          animation: glitch-anim-2 2s infinite linear alternate-reverse;
        }
      `}</style>

      {/* Header */}
      <SpotlightCard
        as="header"
        className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 pt-[env(safe-area-inset-top)]"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div
            className="font-bold text-lg flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleTheme('retro');
              }}
              className="hover:scale-110 transition-transform"
            >
              <TerminalIcon
                size={24}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>
            <span
              className={`tracking-tight glitch cursor-pointer ${glitchActive ? "active-glitch" : ""}`}
              data-text="JACOB BENJAMIN"
              onClick={(e) => {
                e.stopPropagation();
                toggleTheme('cyberpunk');
              }}
            >
              JACOB BENJAMIN
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-normal ml-2 text-xs sm:text-lg">
              <Typewriter words={greetings} />
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (specialTheme) {
                  toggleTheme(specialTheme);
                } else {
                  setDarkMode(!darkMode);
                }
                if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
              }}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
              {specialTheme ? <RotateCcw size={20} /> : (darkMode ? <Sun size={20} /> : <Moon size={20} />)}
            </button>
          </div>
        </div>
      </SpotlightCard>

      <main className="max-w-6xl mx-auto px-4 py-6 lg:py-8 relative z-10">
        {/* HERO */}
        <SpotlightCard
          enableTilt={true}
          className="bg-white dark:bg-slate-800 rounded-2xl p-5 md:p-6 lg:p-8 mb-6 lg:mb-10 transition-all duration-300 shadow-sm border border-slate-200 dark:border-slate-700 animate-floatIn"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-10 items-center">
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-6">
              <img
                src={headshotImg}
                alt={personalInfo.name}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md transition-transform duration-300 hover:scale-110"
              />
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                  <span className="flex items-center gap-2">
                    <MapPin size={16} /> {personalInfo.location}
                  </span>
                </div>
                <h1 
                  className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient-x pb-1"
                  data-text={personalInfo.name}
                >
                  {personalInfo.name}
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300">
                  {personalInfo.title}
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-6 mt-2">
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-105 origin-left"
                    onClick={(e) => {
                      triggerHaptic();
                      triggerConfetti(e.clientX, e.clientY);
                    }}
                  >
                    <Mail size={16} /> {personalInfo.email}
                  </a>
                  <a
                    href={`tel:${personalInfo.phone}`}
                    className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-105 origin-left"
                  >
                    <Phone size={16} /> {personalInfo.phone}
                  </a>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
              {keyMetrics.map((m, i) => (
                <MetricCard key={i} m={m} />
              ))}
            </div>
          </div>
        </SpotlightCard>

        {/* MISSION PROFILE */}
        <SpotlightCard
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 md:p-8 mb-6 lg:mb-10 border-l-4 border-l-blue-600 shadow-sm animate-floatIn"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
            <ClipboardList
              size={24}
              className="text-blue-600 dark:text-blue-400"
            />
            <h2 className="text-2xl font-bold"> Profile</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">
                Professional Summary
              </h3>
              <p className="leading-relaxed text-sm md:text-lg text-slate-700 dark:text-slate-300">
                {personalInfo.summary}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-500 mb-3">
                Core Competencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {personalInfo.expertise.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SpotlightCard>

        <div className="space-y-12 lg:space-y-20">
          <RevealOnScroll>
            <section id="experience">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400">
                  <Briefcase size={24} />{" "}
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Experience
                  </h2>
                </div>

                {activeSkillFilter && (
                  <div className="mb-6 flex items-center justify-between gap-2 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
                        <Funnel size={14} />
                      </span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Showing projects using{" "}
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {activeSkillFilter}
                        </span>
                      </span>
                      <span className="hidden sm:inline text-xs text-slate-400 italic ml-1">(Shake to clear)</span>
                    </div>
                    <button
                      onClick={() => setActiveSkillFilter(null)}
                      className="text-xs font-medium px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Clear Filter
                    </button>
                  </div>
                )}

                <div className="relative ml-3 sm:ml-0 pl-8 space-y-8">
                  <TimelineScrollLine />
                  {filteredExperience.length > 0 ? (
                    filteredExperience.map((job, idx) => (
                      <RevealOnScroll key={job.id} delay={idx * 150}>
                        <div className="relative group">
                          <div className="absolute -left-[41px] top-6 transition-transform duration-300 group-hover:scale-125 z-10">
                            <TimelineDot />
                          </div>
                          <div className="absolute -left-[31px] top-8 w-8 h-0.5 bg-blue-200 dark:bg-slate-700 group-hover:bg-blue-400 dark:group-hover:bg-blue-600 transition-colors duration-300"></div>
                          <SpotlightCard
                            className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 md:p-6 transition-all hover:shadow-md ${expandedJob === job.id ? "ring-1 ring-blue-500" : ""}`}
                          >
                            <div
                              className="cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-2 md:gap-4"
                              onClick={() => toggleJob(job.id)}
                            >
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                  {job.role}
                                </h3>
                                <div className="text-blue-600 dark:text-blue-400 font-medium mt-1">
                                  {job.company} • {job.type}
                                </div>
                                {job.project && (
                                  <p className="text-sm text-slate-500 mt-2 italic">
                                    {job.project}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                                <span className="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                                  <Calendar size={12} /> {job.period}
                                </span>
                                {expandedJob === job.id ? (
                                  <ChevronUp
                                    size={16}
                                    className="text-slate-400"
                                  />
                                ) : (
                                  <ChevronDown
                                    size={16}
                                    className="text-slate-400"
                                  />
                                )}
                              </div>
                            </div>
                            {expandedJob === job.id && (
                              <div className="mt-4 md:mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <ul className="space-y-2 md:space-y-3">
                                  {job.details.map((point, idx) => (
                                    <li
                                      key={idx}
                                      className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                                    >
                                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>{" "}
                                      {point}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </SpotlightCard>
                        </div>
                      </RevealOnScroll>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
                        <Briefcase size={32} />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400">
                        No experience found matching "{activeSkillFilter}"
                      </p>
                      <button
                        onClick={() => setActiveSkillFilter(null)}
                        className="mt-4 text-blue-600 dark:text-blue-400 font-medium hover:underline"
                      >
                        Clear filter to see all
                      </button>
                    </div>
                  )}
                </div>

                {/* Testimonials */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  {testimonials.map((item, idx) => (
                    <TestimonialCard key={idx} item={item} />
                  ))}
                </div>
              </div>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section id="skills">
              <div className="space-y-10">
                <SpotlightCard className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Award size={20} className="text-blue-600" />{" "}
                      Certifications
                    </h3>
                    <div
                      className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1 gap-1"
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={() => setIsPaused(false)}
                    >
                      <button
                        onClick={() => {
                          setCertView("carousel");
                          triggerHaptic();
                        }}
                        className={`p-2 rounded-md transition-all ${certView === "carousel" ? "bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
                        title="Carousel View"
                      >
                        <GalleryHorizontal size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setCertView("grid");
                          triggerHaptic();
                        }}
                        className={`p-2 rounded-md transition-all ${certView === "grid" ? "bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
                        title="Grid View"
                      >
                        <LayoutGrid size={18} />
                      </button>
                    </div>
                  </div>

                  {certView === "grid" ? (
                    <div className="space-y-8">
                      {groupedCertifications.map(([category, certs]) => (
                        <div key={category}>
                          <h4 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                            {category}
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {certs.map((cert, idx) => (
                              <CertificationItem
                                key={`${cert.name}-${idx}`}
                                cert={cert}
                                index={idx}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      ref={scrollContainerRef}
                      className={`relative w-full overflow-x-auto py-2 carousel-scrollbar select-none ${isDragging ? "cursor-grabbing" : "cursor-grab lg:cursor-auto"}`}
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={handleMouseLeave}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                      onTouchCancel={handleTouchEnd}
                      style={{
                        maskImage:
                          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                        WebkitMaskImage:
                          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                      }}
                    >
                      <div className="flex w-max gap-4">
                        {[...certifications, ...certifications].map(
                          (cert, idx) => (
                            <div
                              key={`carousel-${idx}`}
                              className="w-[140px] md:w-[280px] shrink-0 carousel-card will-change-transform"
                            >
                              <CertificationItem cert={cert} index={idx} />
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </SpotlightCard>

                {/* Detailed Skills Section */}
                <SpotlightCard className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <Lightbulb size={20} className="text-blue-600" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Skills
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(skillCategories).map(([cat, skills]) => (
                      <div key={cat} className="space-y-3">
                        <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 pb-2">
                          {cat}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, i) => (
                            <span
                              key={i}
                              onClick={() => handleSkillClick(skill)}
                              className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-300 cursor-pointer animate-skill ${
                                activeSkillFilter === skill
                                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                                  : "bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-300 hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] dark:hover:shadow-[0_0_15px_rgba(96,165,250,0.5)]"
                              }`}
                              style={{
                                animationDelay: `${i * 50}ms, ${i * 50 + 500 + ((i * 200) % 1000)}ms`,
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </div>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section id="education">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400">
                  <GraduationCap size={24} />{" "}
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Education
                  </h2>
                </div>
                <div className="grid gap-4">
                  {education.map((edu, idx) => (
                    <SpotlightCard
                      key={idx}
                      className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white">
                            {edu.school}
                          </h3>
                          <p className="text-blue-600 dark:text-blue-400 text-sm">
                            {edu.degree}
                          </p>
                        </div>
                        <div className="text-right text-xs text-slate-500 whitespace-nowrap shrink-0 ml-4">
                          <p>{edu.date}</p>
                        </div>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              </div>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section id="volunteer">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400">
                  <Handshake size={24} />{" "}
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Volunteer Experience
                  </h2>
                </div>

                <SpotlightCard
                  className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 md:p-6 transition-all hover:shadow-md ${isVolunteerExpanded ? "ring-1 ring-blue-500" : ""}`}
                >
                  <div
                    className="cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                    onClick={() => {
                      setIsVolunteerExpanded(!isVolunteerExpanded);
                      triggerHaptic();
                    }}
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {volunteer.role}
                      </h3>
                      <div className="text-blue-600 dark:text-blue-400 font-medium mt-1">
                        {volunteer.org}
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                      <span className="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                        <Calendar size={12} /> {volunteer.period}
                      </span>
                      {isVolunteerExpanded ? (
                        <ChevronUp size={16} className="text-slate-400" />
                      ) : (
                        <ChevronDown size={16} className="text-slate-400" />
                      )}
                    </div>
                  </div>
                  {isVolunteerExpanded && (
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <ul className="space-y-3">
                        {volunteer.details.map((point, idx) => (
                          <li
                            key={idx}
                            className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                          >
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>{" "}
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </SpotlightCard>

                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6">
                  Affiliations
                </h3>
                <div className="grid gap-3">
                  {affiliations.map((aff, i) => (
                    <SpotlightCard
                      key={i}
                      className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Award size={18} className="text-blue-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {aff}
                        </span>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              </div>
            </section>
          </RevealOnScroll>
        </div>

        {/* NAVIGATION - Floating Bottom Bar */}
        <div className="sticky bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-50 w-[90%] max-w-sm lg:max-w-3xl mx-auto mt-8">
          <div
            className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2 flex justify-between lg:justify-center lg:gap-4 items-center animate-floatIn relative"
            style={{ animationDelay: "0.3s" }}
          >
            {/* Active Blob */}
            <div
              className="absolute bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-[length:200%_200%] animate-nav-active rounded-xl transition-all duration-300 ease-in-out z-0"
              style={{
                left: activeBlobStyle.left,
                width: activeBlobStyle.width,
                top: activeBlobStyle.top,
                height: activeBlobStyle.height,
                opacity: activeBlobStyle.opacity,
              }}
            />
            {/* Hover Blob */}
            <div
              className="absolute bg-slate-200/50 dark:bg-slate-700/50 rounded-xl transition-all duration-300 ease-in-out z-0"
              style={{
                left: hoverBlobStyle.left,
                width: hoverBlobStyle.width,
                top: hoverBlobStyle.top,
                height: hoverBlobStyle.height,
                opacity: hoverBlobStyle.opacity,
              }}
            />
            {navItems.map((item) => (
              <button
                key={item.id}
                ref={(el) => (navItemRefs.current[item.id] = el)}
                onClick={() => scrollToSection(item.id)}
                onMouseEnter={() => setHoveredNav(item.id)}
                onMouseLeave={() => setHoveredNav(null)}
                className={`p-3 lg:px-6 rounded-xl transition-all duration-300 ease-in-out relative flex flex-col lg:flex-row items-center gap-1 lg:gap-3 z-10 ${
                  visibleSection === item.id
                    ? "text-white scale-105"
                    : hoveredNav === item.id
                      ? "text-slate-900 dark:text-white scale-110 -translate-y-1"
                      : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <item.icon size={20} />
                <span className="hidden lg:block font-medium">
                  {item.label}
                </span>
              </button>
            ))}
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                triggerHaptic();
              }}
              className="lg:hidden p-3 rounded-xl transition-all duration-300 relative flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronUp size={20} />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <SpotlightCard
        as="footer"
        className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))] mt-0 relative z-10"
      >
        {/* Rubber Duck Animation */}
        <div className="absolute -top-4 md:top-auto md:bottom-0 left-0 w-full h-16 pointer-events-none z-30">
          <div className="absolute top-16 left-0 animate-fly">
            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 blur-xl rounded-full" style={{ backgroundColor: 'var(--duck-glow)' }}></div>
              <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1">
                <div
                  className="absolute w-1.5 h-1.5 border border-cyan-400/60 rounded-full animate-particle"
                  style={{ top: "-2px", animationDelay: "0s" }}
                ></div>
                <div
                  className="absolute w-1 h-1 border border-sky-300/50 rounded-full animate-particle"
                  style={{ top: "3px", left: "-4px", animationDelay: "0.1s" }}
                ></div>
                <div
                  className="absolute w-1 h-1 border border-blue-200/40 rounded-full animate-particle"
                  style={{ top: "0px", left: "-8px", animationDelay: "0.2s" }}
                ></div>
              </div>
              <img
                src={duckImg}
                alt="Rubber Duck"
                className="w-8 h-8 object-contain drop-shadow-sm relative z-10 animate-bob"
              />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 md:px-24 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-slate-500 dark:text-slate-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} {personalInfo.name}. All rights
            reserved.
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://www.linkedin.com/in/jbbenj/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={(e) => {
                triggerHaptic();
                triggerConfetti(e.clientX, e.clientY);
              }}
            >
              <Linkedin size={20} />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={(e) => {
                triggerHaptic();
                triggerConfetti(e.clientX, e.clientY);
              }}
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
