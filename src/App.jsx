import React, { useState, useEffect, useRef, useMemo, useTransition, useLayoutEffect, useDeferredValue } from 'react';
import { 
  Mail, Phone, MapPin, Briefcase, Moon, Sun, 
  ChevronDown, ChevronUp, Terminal as TerminalIcon, Cpu, Shield, Users, 
  Activity, Calendar, Cloud, FileText, Hexagon, Monitor, 
  TrendingUp, BookOpen, Award, GraduationCap, Handshake, Funnel,
  ClipboardList, DollarSign, Zap, LayoutGrid, GalleryHorizontal, ChevronLeft, ChevronRight, Linkedin, Lightbulb
} from 'lucide-react';
import resumeData from './assets/resumeData.json';

// --- RESUME DATA ---

const personalInfo = resumeData.personalInfo;

const experience = resumeData.experience;

const education = resumeData.education;

const volunteer = resumeData.volunteer;

const affiliations = resumeData.affiliations;

const certifications = resumeData.certifications;

const keyMetrics = resumeData.keyMetrics.map(item => ({
  ...item,
  icon: { TrendingUp, FileText, Activity, Users, Briefcase, DollarSign, Zap }[item.icon]
}));

const skillCategories = resumeData.skillCategories;

const testimonials = resumeData.testimonials;

const greetings = ["Hello!", "Welcome!", "Hi there!", "Greetings!", "Nice to see you!"];

// --- HELPER COMPONENTS ---

const AnimatedCounter = ({ value }) => {
  const [display, setDisplay] = useState(() => {
    const match = value.match(/^([^0-9]*)([0-9,.]+)(.*)$/);
    return match ? `${match[1]}0${match[3]}` : value;
  });
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const match = value.match(/^([^0-9]*)([0-9,.]+)(.*)$/);
    if (!match) return;

    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr.replace(/,/g, ''));
    
    if (isNaN(target)) return;

    let startTime;
    let animationFrameId;
    const duration = 2000;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // Ease out quart
      
      const current = Math.floor(ease * target);
      setDisplay(`${prefix}${current.toLocaleString()}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplay(value);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animationFrameId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [value]);

  return <span ref={elementRef}>{display}</span>;
};

// Load all images from assets directory
const certImages = import.meta.glob('./assets/*.{png,jpg,jpeg,svg,webp}', { eager: true });

const SpotlightCard = ({ children, className = "", as: Component = "div", enableTilt = false, ...props }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });

    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3; // Max 3 deg rotation
      const rotateY = ((x - centerX) / centerX) * 3;
      setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`);
    }

    if (props.onMouseMove) props.onMouseMove(e);
  };

  const handleMouseEnter = (e) => {
    setOpacity(1);
    if (props.onMouseEnter) props.onMouseEnter(e);
  };

  const handleMouseLeave = (e) => {
    setOpacity(0);
    if (enableTilt) setTransform('');
    if (props.onMouseLeave) props.onMouseLeave(e);
  };

  return (
    <Component
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group overflow-hidden ${className}`}
      style={{ transform, transition: transform ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out' }}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </Component>
  );
};

const CertificationItem = ({ cert }) => {
  // Resolve image path
  const imagePath = `./assets/${cert.logo}`;
  const imageSrc = certImages[imagePath]?.default;

  return (
    <SpotlightCard className="h-full p-3 md:p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm bg-slate-50 dark:bg-slate-900 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-12 h-12 md:w-24 md:h-24 mb-3 md:mb-4 flex items-center justify-center">
          {imageSrc ? (
            <img src={imageSrc} alt={cert.name} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400"><Shield className="w-6 h-6 md:w-8 md:h-8" /></div>
          )}
        </div>
        <span className="font-bold text-slate-800 dark:text-slate-100 text-[10px] md:text-xs text-center line-clamp-2 leading-tight">{cert.name}</span>
      </div>
    </SpotlightCard>
  );
};

const MetricCard = ({ m }) => {
  const [key, setKey] = useState(0);
  
  return (
    <SpotlightCard 
      className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      onMouseEnter={() => setKey(prev => prev + 1)}
    >
      <div className="flex items-center gap-2 mb-2">
        <m.icon size={16} className={m.color} />
        <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{m.label}</span>
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white transition-transform duration-300 group-hover:scale-110 origin-left"><AnimatedCounter key={key} value={m.value} /></div>
    </SpotlightCard>
  );
};

const Typewriter = ({ words }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setBlink(!blink), 500);
    return () => clearTimeout(timeout);
  }, [blink]);

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

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <span>
      {words[index].substring(0, subIndex)}
      <span className={`${blink ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>|</span>
    </span>
  );
};

const TestimonialCard = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <SpotlightCard 
      className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer h-fit transition-all duration-300"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold uppercase">{item.source}</div>
      <div className="relative">
        <p className={`italic text-sm text-slate-600 dark:text-slate-300 leading-relaxed ${!isExpanded ? 'line-clamp-5' : ''}`}>
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

// --- CUSTOM HOOKS ---

const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [darkMode]);

  return [darkMode, setDarkMode];
};

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`fixed bottom-8 right-8 z-50 hidden lg:block transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
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

const RevealOnScroll = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
      {children}
    </div>
  );
};

const ScrollProgress = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const percent = (scrollPosition / totalHeight) * 100;
      setWidth(percent);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 h-1 z-50 w-full bg-transparent pointer-events-none">
      <div className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 transition-all duration-100 ease-out opacity-80" style={{ width: `${width}%` }} />
    </div>
  );
};

// --- MAIN APP ---

export default function Portfolio() {
  const [visibleSection, setVisibleSection] = useState('experience');
  const [expandedJob, setExpandedJob] = useState(1);
  const [activeSkillFilter, setActiveSkillFilter] = useState(null);
  const [certView, setCertView] = useState('carousel');
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [darkMode, setDarkMode] = useDarkMode();
  const [isVolunteerExpanded, setIsVolunteerExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return false;
  });
  
  const navItemRefs = useRef({});
  const [hoveredNav, setHoveredNav] = useState(null);
  const [activeBlobStyle, setActiveBlobStyle] = useState({ left: 0, width: 0, top: 0, height: 0, opacity: 0 });
  const [hoverBlobStyle, setHoverBlobStyle] = useState({ left: 0, width: 0, top: 0, height: 0, opacity: 0 });

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
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
      setHoverBlobStyle(prev => ({ ...prev, opacity: 0}));
    }
  }, [hoveredNav, visibleSection]);

  const navItems = [
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills & Certs', icon: Lightbulb },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'volunteer', label: 'Volunteer', icon: Handshake },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const sections = navItems.map(item => document.getElementById(item.id));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -60% 0px', threshold: 0 }
    );
    sections.forEach(section => section && observer.observe(section));
    return () => sections.forEach(section => section && observer.unobserve(section));
  }, []);

  const toggleJob = (id) => setExpandedJob(expandedJob === id ? null : id);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || certView !== 'carousel') return;

    let animationId;
    const scroll = () => {
      if (!isPaused) {
        // Infinite scroll logic: reset when we've scrolled past the first set
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += 1; // Scroll speed
        }
      }
      animationId = requestAnimationFrame(scroll);
    };
    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [certView, isPaused]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    // Don't set isPaused(true) here, it's handled by onMouseEnter
    if (scrollContainerRef.current) {
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeftStart(scrollContainerRef.current.scrollLeft);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    if (scrollContainerRef.current) {
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainerRef.current.scrollLeft = scrollLeftStart - walk;
    }
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setIsPaused(true);
    if (scrollContainerRef.current) {
      setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeftStart(scrollContainerRef.current.scrollLeft);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    if (scrollContainerRef.current) {
      const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainerRef.current.scrollLeft = scrollLeftStart - walk;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const scrollCarousel = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 300;
      if (direction === 'left') {
        if (container.scrollLeft <= 0) {
          container.scrollLeft = container.scrollWidth / 2;
        }
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const groupedCertifications = useMemo(() => {
    return Object.entries(certifications.reduce((acc, cert) => {
      const cat = cert.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(cert);
      return acc;
    }, {}));
  }, []);

  const handleSkillClick = (skill) => {
    if (activeSkillFilter === skill) {
      setActiveSkillFilter(null);
    } else {
      setActiveSkillFilter(skill);
      scrollToSection('experience');
    }
  };

  const filteredExperience = useMemo(() => {
    if (!deferredSkillFilter) return experience;
    const term = deferredSkillFilter.toLowerCase();
    return experience.filter(job => {
      const text = [
        job.role,
        job.company,
        job.project,
        ...(job.details || [])
      ].join(' ').toLowerCase();
      return text.includes(term);
    });
  }, [deferredSkillFilter]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      <ScrollProgress />
      <BackToTopButton />
      {/* Styles Injection for Animations */}
      <style>{`
        html { scroll-behavior: smooth; scroll-padding-top: 7rem; }
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
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        .dark ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #2563eb, #a855f7, #2563eb); border-radius: 5px; }
        ::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #1d4ed8, #9333ea, #1d4ed8); }
        
        /* Text Selection */
        ::selection { background-color: rgba(168, 85, 247, 0.5); color: white; }
      `}</style>

      {/* Header */}
      <SpotlightCard as="header" className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
           <div className="font-bold text-lg flex items-center gap-2">
             <TerminalIcon size={24} className="text-blue-600 dark:text-blue-400" />
             <span className="tracking-tight glitch cursor-default" data-text="JACOB BENJAMIN">JACOB BENJAMIN</span>
             <span className="text-slate-400 dark:text-slate-500 font-normal ml-2">
               <Typewriter words={greetings} />
             </span>
           </div>
           <div className="flex items-center gap-3">
             <button 
               onClick={() => setDarkMode(!darkMode)} 
               className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
             >
               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
           </div>
        </div>
      </SpotlightCard>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* HERO */}
        <SpotlightCard enableTilt={true} className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-10 transition-all duration-300 shadow-sm border border-slate-200 dark:border-slate-700 animate-floatIn" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col lg:flex-row justify-between gap-10 items-center">
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-6">
                  {certImages['./assets/headshot.jpg']?.default && (
                    <img 
                      src={certImages['./assets/headshot.jpg']?.default} 
                      alt={personalInfo.name} 
                      className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md transition-transform duration-300 hover:scale-110"
                    />
                  )}
                  <div className="text-center sm:text-left">
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                      <span className="flex items-center gap-2"><MapPin size={16} /> {personalInfo.location}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient-x pb-1">
                      {personalInfo.name}
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300">{personalInfo.title}</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-6 mt-2">
                      <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-105 origin-left"><Mail size={16} /> {personalInfo.email}</a>
                      <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-105 origin-left"><Phone size={16} /> {personalInfo.phone}</a>
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
        <SpotlightCard className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 md:p-8 mb-10 border-l-4 border-l-blue-600 shadow-sm animate-floatIn" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
            <ClipboardList size={24} className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold"> Profile</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">Professional Summary</h3>
              <p className="leading-relaxed text-sm md:text-lg text-slate-700 dark:text-slate-300">{personalInfo.summary}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-500 mb-3">Core Competencies</h3>
              <div className="flex flex-wrap gap-2">
                {personalInfo.expertise.map((item, index) => (
                  <span key={index} className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SpotlightCard>

        <div className="space-y-20">
            
            <RevealOnScroll>
            <section id="experience">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400">
                  <Briefcase size={24} /> <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Experience</h2>
                </div>
                
                {activeSkillFilter && (
                  <div className="mb-6 flex items-center justify-between gap-2 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
                        <Funnel size={14} />
                      </span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Showing projects using <span className="font-bold text-blue-600 dark:text-blue-400">{activeSkillFilter}</span>
                      </span>
                    </div>
                    <button 
                      onClick={() => setActiveSkillFilter(null)}
                      className="text-xs font-medium px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Clear Filter
                    </button>
                  </div>
                )}

                <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-700 space-y-8">
                  {filteredExperience.length > 0 ? (
                    filteredExperience.map((job) => (
                    <div key={job.id} className="relative">
                      <div className="absolute -left-[35px] sm:-left-[43px] top-6 w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"></div>
                      <SpotlightCard className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 md:p-6 transition-all hover:shadow-md ${expandedJob === job.id ? 'ring-1 ring-blue-500' : ''}`}>
                        <div className="cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-2 md:gap-4" onClick={() => toggleJob(job.id)}>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{job.role}</h3>
                            <div className="text-blue-600 dark:text-blue-400 font-medium mt-1">{job.company} • {job.type}</div>
                            {job.project && <p className="text-sm text-slate-500 mt-2 italic">{job.project}</p>}
                          </div>
                          <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                            <span className="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                              <Calendar size={12} /> {job.period}
                            </span>
                            {expandedJob === job.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                          </div>
                        </div>
                        {expandedJob === job.id && (
                          <div className="mt-4 md:mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <ul className="space-y-2 md:space-y-3">
                              {job.details.map((point, idx) => (
                                <li key={idx} className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span> {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </SpotlightCard>
                    </div>
                  ))
                  ) : (
                    <div className="py-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
                        <Briefcase size={32} />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400">No experience found matching "{activeSkillFilter}"</p>
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
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white"><Award size={20} className="text-blue-600" /> Certifications</h3>
                    <div 
                      className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1 gap-1"
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={() => setIsPaused(false)}
                    >
                      {certView === 'carousel' && (
                        <>
                          <button 
                            onClick={() => scrollCarousel('left')}
                            className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-600 transition-all"
                            title="Scroll Left"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          <button 
                            onClick={() => scrollCarousel('right')}
                            className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-600 transition-all"
                            title="Scroll Right"
                          >
                            <ChevronRight size={18} />
                          </button>
                          <div className="w-px bg-slate-300 dark:bg-slate-600 mx-1 my-1 hidden md:block"></div>
                        </>
                      )}
                      <button 
                        onClick={() => setCertView('grid')}
                        className={`hidden md:block p-2 rounded-md transition-all ${certView === 'grid' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        title="Grid View"
                      >
                        <LayoutGrid size={18} />
                      </button>
                      <button 
                        onClick={() => setCertView('carousel')}
                        className={`hidden md:block p-2 rounded-md transition-all ${certView === 'carousel' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        title="Carousel View"
                      >
                        <GalleryHorizontal size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {certView === 'grid' ? (
                    <div className="space-y-8">
                      {groupedCertifications.map(([category, certs]) => (
                        <div key={category}>
                          <h4 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">{category}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {certs.map((cert, idx) => (
                              <CertificationItem key={`${cert.name}-${idx}`} cert={cert} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div 
                      ref={scrollContainerRef}
                      className={`relative w-full overflow-x-hidden py-2 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={handleMouseLeave}
                      onMouseDown={handleMouseDown}
                      onMouseUp={handleMouseUp}
                      onMouseMove={handleMouseMove}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
                    >
                      <div className="flex w-max gap-4">
                        {[...certifications, ...certifications].map((cert, idx) => (
                          <div key={`carousel-${idx}`} className="w-[140px] md:w-[280px] shrink-0">
                            <CertificationItem cert={cert} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </SpotlightCard>
                
                {/* Detailed Skills Section */}
                <SpotlightCard className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <Lightbulb size={20} className="text-blue-600" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Skills</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(skillCategories).map(([cat, skills]) => (
                      <div key={cat} className="space-y-3">
                        <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 pb-2">{cat}</h4>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, i) => (
                            <span 
                              key={i} 
                              onClick={() => handleSkillClick(skill)}
                              className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-300 cursor-pointer animate-skill ${
                                activeSkillFilter === skill 
                                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' 
                                  : 'bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-300 hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] dark:hover:shadow-[0_0_15px_rgba(96,165,250,0.5)]'
                              }`}
                              style={{ animationDelay: `${i * 50}ms, ${i * 50 + 500 + (i * 200) % 1000}ms` }}
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
                <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400"><GraduationCap size={24} /> <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Education</h2></div>
                <div className="grid gap-4">
                  {education.map((edu, idx) => (
                    <SpotlightCard key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{edu.school}</h3>
                        <p className="text-blue-600 dark:text-blue-400 text-sm">{edu.degree}</p>
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
                <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400"><Handshake size={24} /> <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Volunteer Experience</h2></div>
                
                <SpotlightCard className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 transition-all hover:shadow-md ${isVolunteerExpanded ? 'ring-1 ring-blue-500' : ''}`}>
                  <div className="cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-4" onClick={() => setIsVolunteerExpanded(!isVolunteerExpanded)}>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{volunteer.role}</h3>
                      <div className="text-blue-600 dark:text-blue-400 font-medium mt-1">{volunteer.org}</div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                      <span className="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                        <Calendar size={12} /> {volunteer.period}
                      </span>
                      {isVolunteerExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </div>
                  </div>
                  {isVolunteerExpanded && (
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <ul className="space-y-3">
                        {volunteer.details.map((point, idx) => (
                          <li key={idx} className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span> {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </SpotlightCard>
                
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6">Affiliations</h3>
                <div className="grid gap-3">
                  {affiliations.map((aff, i) => (
                    <SpotlightCard key={i} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Award size={18} className="text-blue-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{aff}</span>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              </div>
            </section>
            </RevealOnScroll>
          </div>

        {/* NAVIGATION - Floating Bottom Bar */}
        <div className="sticky bottom-6 z-50 w-[90%] max-w-sm lg:max-w-3xl mx-auto mt-8">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2 flex justify-between lg:justify-center lg:gap-4 items-center animate-floatIn relative" style={{ animationDelay: '0.3s' }}>
            {/* Active Blob */}
            <div 
              className="absolute bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-[length:200%_200%] animate-gradient-x shadow-lg shadow-blue-500/50 rounded-xl transition-all duration-300 ease-in-out z-0"
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
                ref={el => navItemRefs.current[item.id] = el}
                onClick={() => scrollToSection(item.id)}
                onMouseEnter={() => setHoveredNav(item.id)}
                onMouseLeave={() => setHoveredNav(null)}
                className={`p-3 lg:px-6 rounded-xl transition-all duration-300 ease-in-out relative flex flex-col lg:flex-row items-center gap-1 lg:gap-3 z-10 ${
                  visibleSection === item.id 
                    ? 'text-white scale-105' 
                    : hoveredNav === item.id
                      ? 'text-slate-900 dark:text-white scale-105'
                      : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <item.icon size={20} />
                <span className="hidden lg:block font-medium">{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="lg:hidden p-3 rounded-xl transition-all duration-300 relative flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronUp size={20} />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <SpotlightCard as="footer" className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-8 pb-8 mt-0">
        
        {/* Rubber Duck Animation */}
        <div className="absolute -top-4 md:top-auto md:bottom-0 left-0 w-full h-16 pointer-events-none z-30">
          <div className="absolute top-16 left-0 animate-fly">
            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-yellow-400/40 blur-xl rounded-full"></div>
              <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1">
                <div className="absolute w-1.5 h-1.5 border border-cyan-400/60 rounded-full animate-particle" style={{ top: '-2px', animationDelay: '0s' }}></div>
                <div className="absolute w-1 h-1 border border-sky-300/50 rounded-full animate-particle" style={{ top: '3px', left: '-4px', animationDelay: '0.1s' }}></div>
                <div className="absolute w-1 h-1 border border-blue-200/40 rounded-full animate-particle" style={{ top: '0px', left: '-8px', animationDelay: '0.2s' }}></div>
              </div>
              {certImages['./assets/duck.png']?.default && (
                <img 
                  src={certImages['./assets/duck.png']?.default} 
                  alt="Rubber Duck" 
                  className="w-8 h-8 object-contain drop-shadow-sm relative z-10 animate-bob" 
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-8 md:px-24 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-slate-500 dark:text-slate-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="https://www.linkedin.com/in/jbbenj/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Linkedin size={20} />
            </a>
            <a href={`mailto:${personalInfo.email}`} className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}