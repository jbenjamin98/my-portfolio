import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Phone, MapPin, Briefcase, Moon, Sun, 
  ChevronDown, ChevronUp, Terminal as TerminalIcon, Cpu, Shield, Users, 
  Activity, Calendar, Cloud, FileText, Hexagon, Monitor, 
  TrendingUp, BookOpen, Award,
  ClipboardList, DollarSign, Zap, LayoutGrid, GalleryHorizontal, ChevronLeft, ChevronRight, Linkedin,
  Car, Helicopter, Van, Sailboat, Ambulance, Bike, Truck, Tractor
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

const SpotlightCard = ({ children, className = "", as: Component = "div", ...props }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    if (props.onMouseMove) props.onMouseMove(e);
  };

  const handleMouseEnter = (e) => {
    setOpacity(1);
    if (props.onMouseEnter) props.onMouseEnter(e);
  };

  const handleMouseLeave = (e) => {
    setOpacity(0);
    if (props.onMouseLeave) props.onMouseLeave(e);
  };

  return (
    <Component
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group overflow-hidden ${className}`}
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
    <SpotlightCard className="h-full p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm bg-slate-50 dark:bg-slate-900 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-24 h-24 mb-4 flex items-center justify-center">
          {imageSrc ? (
            <img src={imageSrc} alt={cert.name} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110" />
          ) : (
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400"><Shield size={32} /></div>
          )}
        </div>
        <span className="font-bold text-slate-800 dark:text-slate-100 text-xs text-center line-clamp-2 leading-tight">{cert.name}</span>
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

// --- MAIN APP ---

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('experience');
  const [expandedJob, setExpandedJob] = useState(1);
  const [certView, setCertView] = useState('carousel');
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [greeting] = useState(() => {
    const greetings = ["Hello!", "Welcome!", "Hi there!", "Greetings!", "Nice to see you!"];
    return greetings[Math.floor(Math.random() * greetings.length)];
  });
  
  const footerIcons = [Car, Helicopter, Van, Sailboat, Ambulance, Bike, Truck, Tractor];
  const [FooterIcon, setFooterIcon] = useState(() => footerIcons[Math.floor(Math.random() * footerIcons.length)]);
  const handleAnimationIteration = () => {
    setFooterIcon(footerIcons[Math.floor(Math.random() * footerIcons.length)]);
  };

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

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [darkMode]);

  const navItems = [
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Activity },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'volunteer', label: 'Volunteer', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      
      {/* Styles Injection for Animations */}
      <style>{`
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes fly { 0% { transform: translateX(-100px); } 100% { transform: translateX(100vw); } }
        .animate-fly { animation: fly 30s linear infinite; }
        .pause-on-hover:hover { animation-play-state: paused; }
      `}</style>

      {/* Header */}
      <SpotlightCard as="header" className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
           <div className="font-bold text-lg flex items-center gap-2">
             <TerminalIcon size={24} className="text-blue-600 dark:text-blue-400" />
             <span className="tracking-tight">JACOB BENJAMIN</span>
             <span className="hidden sm:inline text-slate-400 dark:text-slate-500 font-normal ml-2">| {greeting}</span>
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
        <SpotlightCard className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-10 transition-all duration-300 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div className="space-y-6 max-w-2xl">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-4">
                  {certImages['./assets/headshot.jpg']?.default && (
                    <img 
                      src={certImages['./assets/headshot.jpg']?.default} 
                      alt={personalInfo.name} 
                      className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md transition-transform duration-300 hover:scale-110"
                    />
                  )}
                  <div>
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                      Cleared Professional
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 text-slate-900 dark:text-white">{personalInfo.name}</h1>
                  </div>
                </div>
                <p className="text-xl text-slate-600 dark:text-slate-300">{personalInfo.title}</p>
              </div>
              <div className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-6">
                   <span className="flex items-center gap-2"><MapPin size={16} /> {personalInfo.location}</span>
                </div>
                <div className="flex flex-wrap gap-4 mt-2">
                  <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors font-medium"><Mail size={16} /> {personalInfo.email}</a>
                  <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors font-medium"><Phone size={16} /> {personalInfo.phone}</a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
              {keyMetrics.map((m, i) => (
                <MetricCard key={i} m={m} />
              ))}
            </div>
          </div>
        </SpotlightCard>

        {/* MISSION PROFILE */}
        <SpotlightCard className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 mb-10 border-l-4 border-l-blue-600 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
            <ClipboardList size={24} className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold"> Profile</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">Proffessional Summary</h3>
              <p className="leading-relaxed text-lg text-slate-700 dark:text-slate-300">{personalInfo.summary}</p>
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

        {/* NAVIGATION */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-6 md:hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeTab === item.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <item.icon size={16} /> {item.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* SIDEBAR NAV */}
          <aside className="hidden md:block col-span-3">
            <nav className="sticky top-28 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all font-medium ${
                    activeTab === item.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <item.icon size={18} /> {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* TAB CONTENT */}
          <div className="col-span-1 md:col-span-9 space-y-8">
            
            {activeTab === 'experience' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400">
                  <Briefcase size={24} /> <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Experience</h2>
                </div>
                
                <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-700 space-y-8">
                  {experience.map((job) => (
                    <div key={job.id} className="relative">
                      <div className="absolute -left-[35px] sm:-left-[43px] top-6 w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"></div>
                      <SpotlightCard className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 transition-all hover:shadow-md ${expandedJob === job.id ? 'ring-1 ring-blue-500' : ''}`}>
                        <div className="cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-4" onClick={() => toggleJob(job.id)}>
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
                          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <ul className="space-y-3">
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
                  ))}
                </div>

                {/* Testimonials */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  {testimonials.map((item, idx) => (
                    <SpotlightCard key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold uppercase">{item.source}</div>
                      <p className="italic text-sm text-slate-600 dark:text-slate-300">"{item.text}"</p>
                    </SpotlightCard>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-10 animate-fadeIn">
                <SpotlightCard className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white"><Shield size={20} className="text-blue-600" /> Certifications</h3>
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
                          <div className="w-px bg-slate-300 dark:bg-slate-600 mx-1 my-1"></div>
                        </>
                      )}
                      <button 
                        onClick={() => setCertView('grid')}
                        className={`p-2 rounded-md transition-all ${certView === 'grid' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        title="Grid View"
                      >
                        <LayoutGrid size={18} />
                      </button>
                      <button 
                        onClick={() => setCertView('carousel')}
                        className={`p-2 rounded-md transition-all ${certView === 'carousel' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        title="Carousel View"
                      >
                        <GalleryHorizontal size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {certView === 'grid' ? (
                    <div className="space-y-8">
                      {Object.entries(certifications.reduce((acc, cert) => {
                        const cat = cert.category || 'Other';
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(cert);
                        return acc;
                      }, {})).map(([category, certs]) => (
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
                      className="relative w-full overflow-x-hidden py-2"
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={() => setIsPaused(false)}
                    >
                      <div className="flex w-max gap-4">
                        {[...certifications, ...certifications].map((cert, idx) => (
                          <div key={`carousel-${idx}`} className="w-[280px] shrink-0">
                            <CertificationItem cert={cert} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </SpotlightCard>
                
                {/* Detailed Skills Section (Restored Categories) */}
                <SpotlightCard className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <Cpu size={20} className="text-blue-600" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Technical Proficiency</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(skillCategories).map(([cat, skills]) => (
                      <div key={cat} className="space-y-3">
                        <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 pb-2">{cat}</h4>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, i) => (
                            <span key={i} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded text-sm font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors cursor-default">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400"><BookOpen size={24} /> <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Education</h2></div>
                <div className="grid gap-4">
                  {education.map((edu, idx) => (
                    <SpotlightCard key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{edu.school}</h3>
                        <p className="text-blue-600 dark:text-blue-400 text-sm">{edu.degree}</p>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <p>{edu.date}</p>
                      </div>
                    </div>
                    </SpotlightCard>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'volunteer' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400"><Users size={24} /> <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Volunteer Experience</h2></div>
                <SpotlightCard className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{volunteer.org}</h3>
                  <p className="text-amber-600 font-medium mb-4">{volunteer.role} | {volunteer.period}</p>
                  <ul className="space-y-2">
                    {volunteer.details.map((d, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span> {d}
                      </li>
                    ))}
                  </ul>
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
            )}

          </div>
        </div>
      </main>

      {/* Footer */}
      <SpotlightCard as="footer" className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-12">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-6 left-0 animate-fly" onAnimationIteration={handleAnimationIteration}>
            <div className="-translate-y-0 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 w-[300px] h-[300px] bg-blue-500/20 dark:bg-blue-400/10 blur-[60px] rounded-full"></div>
              <FooterIcon size={30} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-500 dark:text-slate-400 text-sm">
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