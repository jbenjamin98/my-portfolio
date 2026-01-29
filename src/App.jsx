import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, MapPin, Briefcase, User, Moon, Sun, 
  ChevronDown, ChevronUp, Terminal as TerminalIcon, Cpu, Shield, Users, 
  Activity, Calendar, Cloud, FileText, Hexagon, Monitor, 
  TrendingUp, Database, BookOpen, Award, Zap, Target,
  CheckCircle2, Send, 
  ClipboardList, Palette
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
  icon: { TrendingUp, FileText, Activity, Users }[item.icon]
}));

const skillCategories = resumeData.skillCategories;

const testimonials = resumeData.testimonials;

// --- HELPER COMPONENTS ---

const AnimatedCounter = ({ value }) => {
  return <span>{value}</span>;
};

const ContactForm = () => {
  const [status, setStatus] = useState('idle'); 
  const handleSend = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => { setStatus('sent'); setTimeout(() => setStatus('idle'), 3000); }, 1500);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg mt-12 mb-20 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white"><Send size={20} /> Direct Message</h3>
      </div>
      {status === 'sent' ? (
        <div className="h-48 flex flex-col items-center justify-center animate-fadeIn text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <CheckCircle2 size={48} className="mb-3" />
          <span className="text-lg font-bold">Message Transmitted</span>
        </div>
      ) : (
        <form onSubmit={handleSend} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="email" placeholder="Email Address" className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-sm outline-none bg-transparent focus:border-blue-500 dark:text-white" required />
            <select className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-sm outline-none bg-transparent focus:border-blue-500 dark:text-white dark:bg-slate-800">
              <option>Project Inquiry</option><option>Opportunity</option>
            </select>
          </div>
          <textarea placeholder="Message..." className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-sm h-32 resize-none outline-none bg-transparent focus:border-blue-500 dark:text-white" required></textarea>
          <button type="submit" disabled={status === 'sending'} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md">
            {status === 'sending' ? 'Transmitting...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
};

const CertLogo = ({ name, type }) => {
  const styles = {
    pmi: { bg: "bg-[#005696]", icon: Briefcase, color: "text-white" },
    appian: { bg: "bg-[#1e3a8a]", icon: Hexagon, color: "text-white" },
    scrum: { bg: "bg-[#f57f20]", icon: Users, color: "text-white" },
    security: { bg: "bg-[#cc0000]", icon: Shield, color: "text-white" },
    salesforce: { bg: "bg-[#00a1e0]", icon: Cloud, color: "text-white" },
    microsoft: { bg: "bg-[#00a4ef]", icon: Monitor, color: "text-white" },
    lean: { bg: "bg-slate-800", icon: Activity, color: "text-white" },
    docu: { bg: "bg-[#ffce00]", icon: FileText, color: "text-black" },
    data: { bg: "bg-[#ce1126]", icon: TerminalIcon, color: "text-white" },
    finance: { bg: "bg-[#00c7b7]", icon: TrendingUp, color: "text-white" },
  };
  const style = styles[type] || styles.pmi;
  const Icon = style.icon;
  return (
    <div className="flex flex-col items-center justify-center w-[160px] h-[140px] mx-2 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 bg-white dark:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${style.bg} ${style.color} shadow-sm`}>
        <Icon size={28} strokeWidth={2} />
      </div>
      <span className="font-bold text-slate-800 dark:text-slate-100 text-xs text-center line-clamp-2 leading-tight">{name}</span>
    </div>
  );
};

const LogoCarousel = ({ items }) => {
  const carouselItems = [...items, ...items];
  return (
    <div className="relative w-full overflow-hidden py-4 group">
      <div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-white to-transparent dark:from-slate-800"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-white to-transparent dark:from-slate-800"></div>
      <div className="flex w-max animate-scroll group-hover:pause">
        {carouselItems.map((cert, idx) => (
          <CertLogo key={`${cert.name}-${idx}`} name={cert.name} type={cert.type} />
        ))}
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('experience');
  const [expandedJob, setExpandedJob] = useState(1);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const toggleJob = (id) => setExpandedJob(expandedJob === id ? null : id);

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
        .animate-scroll { animation: scroll 30s linear infinite; }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .group:hover .group-hover\\:pause { animation-play-state: paused; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
           <div className="font-bold text-lg flex items-center gap-2">
             <Shield size={24} className="text-blue-600 dark:text-blue-400" />
             <span className="tracking-tight">JACOB BENJAMIN</span>
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
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* HERO */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-10 relative overflow-hidden transition-all duration-300 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
            <div className="space-y-6 max-w-2xl">
              <div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                  CLEARANCE: SECRET
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-slate-900 dark:text-white">{personalInfo.name}</h1>
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
                <div key={i} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <m.icon size={16} className={m.color} />
                    <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{m.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white"><AnimatedCounter value={m.value} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MISSION PROFILE */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 mb-10 border-l-4 border-l-blue-600 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
            <ClipboardList size={24} className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold">Mission Profile</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">Executive Summary</h3>
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
        </div>

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
                      <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 transition-all hover:shadow-md ${expandedJob === job.id ? 'ring-1 ring-blue-500' : ''}`}>
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
                      </div>
                    </div>
                  ))}
                </div>

                {/* Testimonials */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  {testimonials.map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold uppercase">{item.source}</div>
                      <p className="italic text-sm text-slate-600 dark:text-slate-300">"{item.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-10 animate-fadeIn">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white"><Shield size={20} className="text-blue-600" /> Credentials Vault</h3>
                  <LogoCarousel items={certifications} />
                </div>
                
                {/* Detailed Skills Section (Restored Categories) */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
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
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400"><BookOpen size={24} /> <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Education</h2></div>
                <div className="grid gap-4">
                  {education.map((edu, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{edu.school}</h3>
                        <p className="text-blue-600 dark:text-blue-400 text-sm">{edu.degree}</p>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <p>{edu.date}</p>
                        <p className="flex items-center gap-1 justify-end mt-1"><MapPin size={10} /> {edu.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'volunteer' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400"><Users size={24} /> <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Volunteer Ops</h2></div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{volunteer.org}</h3>
                  <p className="text-amber-600 font-medium mb-4">{volunteer.role} | {volunteer.period}</p>
                  <ul className="space-y-2">
                    {volunteer.details.map((d, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span> {d}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6">Affiliations</h3>
                <div className="grid gap-3">
                  {affiliations.map((aff, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3 shadow-sm">
                      <Award size={18} className="text-blue-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{aff}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
        
        <ContactForm />
      </main>
    </div>
  );
}