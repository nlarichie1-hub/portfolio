/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Award,
  Briefcase,
  BookOpen,
  Layers,
  Star,
  Search,
  Download,
  Edit2,
  CheckCircle,
  Clock,
  Printer,
  ChevronRight,
  User,
  Heart,
  Undo2,
  FileText,
  Lightbulb,
  ExternalLink,
  Smartphone,
  Cpu,
  Workflow,
  Sparkles,
  Send,
  Check,
  Image,
  X
} from "lucide-react";

import { PortfolioData } from "./types";
import { initialPortfolioData } from "./data";
import ResumePDFView from "./components/ResumePDFView";
import FormEditor from "./components/FormEditor";
import PrintGuideModal from "./components/PrintGuideModal";
import {
  initAuth,
  googleSignIn,
  logoutDrive,
  fetchDriveImages,
  getHighResDriveLink,
  DriveFileItem
} from "./lib/drive";
import { User as FirebaseUser } from "firebase/auth";

export default function App() {
  // Loaded state with client-side localStorage backup for full edit persistence
  const [data, setData] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem("portfolio_builder_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          // If the stored data name is outdated, reset to newly requested Muhammed Aslam profile.
          if (parsed.name !== "Muhammed Aslam") {
            return initialPortfolioData;
          }
          // If the stored avatarUrl is empty or outdated (like the old JPG), automatic update to new photo.
          if (!parsed.avatarUrl || parsed.avatarUrl.includes("regenerated_image_")) {
            parsed.avatarUrl = initialPortfolioData.avatarUrl;
          }
          if (!parsed.achievements) {
            parsed.achievements = initialPortfolioData.achievements;
          }
        }
        return parsed;
      } catch (e) {
        return initialPortfolioData;
      }
    }
    return initialPortfolioData;
  });

  // Track the active user-facing mode
  // 'portfolio' matches a custom-tailored responsive interactive online folder.
  // 'resume' showcases the standard high-fidelity A4/Letter sheet format with inline formatting options.
  const [appMode, setAppMode] = useState<"portfolio" | "resume">("portfolio");
  const [resumeTemplate, setResumeTemplate] = useState<"modern" | "executive" | "indigo-tech" | "classic-serif">("executive");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [skillSearch, setSkillSearch] = useState<string>("");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [driveUser, setDriveUser] = useState<FirebaseUser | null>(null);
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [isFetchingDrive, setIsFetchingDrive] = useState<boolean>(false);
  const [driveError, setDriveError] = useState<string | null>(null);

  // Load Google Drive files helper
  const loadDriveFiles = async (tokenToUse: string) => {
    setIsFetchingDrive(true);
    setDriveError(null);
    try {
      const files = await fetchDriveImages("1g46KE86O-AJM_AVmE9KIlSDBXWVlCbUH", tokenToUse);
      setDriveFiles(files);
    } catch (err: any) {
      console.error("Failed to fetch Google Drive files:", err);
      setDriveError(err.message || "Failed loading files from Google Drive.");
    } finally {
      setIsFetchingDrive(false);
    }
  };

  // Setup Google Drive Auth state change callback on mount
  useEffect(() => {
    const unsub = initAuth(
      (user, token) => {
        setDriveUser(user);
        setDriveToken(token);
        loadDriveFiles(token);
      },
      () => {
        setDriveUser(null);
        setDriveToken(null);
      }
    );
    return () => unsub();
  }, []);

  const handleDriveSignIn = async () => {
    try {
      setDriveError(null);
      const res = await googleSignIn();
      if (res) {
        setDriveUser(res.user);
        setDriveToken(res.accessToken);
        await loadDriveFiles(res.accessToken);
        triggerNotification("Connected to Google Drive successfully!");
      }
    } catch (err: any) {
      console.error("Sign-in failed:", err);
      setDriveError(err.message || "OAuth login aborted or incomplete.");
    }
  };

  const handleDriveLogout = async () => {
    await logoutDrive();
    setDriveUser(null);
    setDriveToken(null);
    setDriveFiles([]);
    triggerNotification("Drive connection disconnected.");
  };

  // Auto save data changes to local storage
  useEffect(() => {
    localStorage.setItem("portfolio_builder_data", JSON.stringify(data));
  }, [data]);

  const handleResetData = () => {
    if (window.confirm("Restore resume to original state? (This clears your custom changes)")) {
      setData(initialPortfolioData);
      setSelectedSkill(null);
      setSkillSearch("");
      triggerNotification("Restored default B.Com Operations Portfolio dataset!");
    }
  };

  const triggerNotification = (text: string) => {
    setMessage(text);
    setTimeout(() => {
      setMessage(null);
    }, 4000);
  };

  const handlePrint = () => {
    window.print();
  };



  // Flattened skills list for easy filtering
  const allSkills = data.skills.flatMap((cat) => cat.skills);
  const filteredSkills = allSkills.filter((s) =>
    s.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const isPortfolioMode = appMode === "portfolio";

  return (
    <div
      id="app-root"
      className={`min-h-screen overflow-x-hidden w-full relative transition-colors duration-300 ${
        isPortfolioMode ? "bg-white text-neutral-900 font-sans" : "bg-neutral-50 text-neutral-900 font-sans"
      } selection:bg-neutral-900 selection:text-white`}
    >
      

      {/* Primary Application Header (No-Print) */}
      <header className="no-print border-b border-neutral-100 bg-white/95 text-neutral-900 sticky top-0 z-30 transition-all backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-row justify-between items-center h-[58px]">
          
          {/* Left Title Logo */}
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-sans font-black text-2xl tracking-tighter text-neutral-900 leading-none lowercase">
                aslam<span className="text-[#FF6B4A]">.</span>
              </h1>
            </div>
          </div>

          

        </div>
      </header>

      {/* Notification Toast Alert */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white text-xs font-mono py-3 px-4 rounded-xl shadow-lg border border-neutral-850 flex items-center gap-2.5 max-w-sm"
          >
            <CheckCircle size={15} className="text-[#FF6B4A]" />
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace Frame */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${appMode === "portfolio" ? "pt-0 pb-8" : "py-8"}`}>
               {/* INTERACTIVE PORTFOLIO APP MODE (PREMIUM WARM EDITORIAL STYLE) */}
        {appMode === "portfolio" && (
          <div className="space-y-20 pb-16">
            
            {/* 1. NEW HERO BANNER SECTION MATCHING MOCKUP DESIGN */}
            <section id="hero" className="relative w-screen left-1/2 -translate-x-1/2 flex flex-col justify-between items-center pt-4 sm:pt-6 md:pt-8 pb-0 border-b border-neutral-100 overflow-hidden h-[420px] sm:h-[490px] md:h-[560px] lg:h-[calc(100vh-58px)] lg:min-h-[640px] lg:max-h-[740px] xl:max-h-[820px] bg-white">
              
              {/* 1a. Math-driven Spherical perspective wireframe mesh grid background */}
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-75">
                <svg className="absolute inset-0 w-full h-full text-neutral-200/60" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                  {/* Dynamic bent lines of perspective wireframe grid simulating the curved visual grid */}
                  {Array.from({ length: 21 }).map((_, i) => {
                    const y = i * 50;
                    return (
                      <path
                        key={`h-${i}`}
                        d={`M 0,${y} Q 500,${y + (y - 500) * 0.16} 1000,${y}`}
                        stroke="currentColor"
                        strokeWidth="0.75"
                        fill="none"
                      />
                    );
                  })}
                  {Array.from({ length: 21 }).map((_, i) => {
                    const x = i * 50;
                    return (
                      <path
                        key={`v-${i}`}
                        d={`M ${x},0 Q ${x + (x - 500) * 0.16},500 ${x},1000`}
                        stroke="currentColor"
                        strokeWidth="0.75"
                        fill="none"
                      />
                    );
                  })}
                </svg>
              </div>

              {/* 1b. Soft vibrant ambient gradient blurs behind the portrait */}
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[22%] left-[20%] sm:left-[26%] w-80 h-80 sm:w-[480px] sm:h-[480px] rounded-full bg-[#FF6B4A]/25 blur-[90px] sm:blur-[130px]" />
                <div className="absolute top-[22%] right-[20%] sm:right-[26%] w-80 h-80 sm:w-[480px] sm:h-[480px] rounded-full bg-[#8B5CF6]/25 blur-[90px] sm:blur-[130px]" />
              </div>

              {/* 1c. Header text elements (Folks greeting, Product & Visual, Designer Pill) */}
              <div className="relative z-10 flex flex-col items-center text-center mt-1 sm:mt-2 px-4 max-w-4xl">
                <span className="font-sans font-extrabold text-[#111111]/80 text-xs sm:text-sm tracking-widest uppercase mb-1">
                  hi folks
                </span>
                
                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: "easeOut",
                    scale: { duration: 0.2, ease: "easeInOut" }
                  }}
                  className="font-sans font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-neutral-900 leading-[1.08] max-w-3xl cursor-default"
                >
                  I'm Muhammed <br className="hidden sm:inline" /> Aslam
                </motion.h2>
              </div>

              {/* 1d. Photorealistic cutout Avatar centered - absolutely positioned at bottom to layer behind ticker tape */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 w-64 sm:w-[320px] md:w-[360px] lg:w-[420px] xl:w-[480px] flex flex-col items-center justify-end overflow-visible">
                <img
                  src={data.avatarUrl}
                  alt={data.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto min-h-[200px] max-h-[240px] sm:max-h-[290px] md:max-h-[340px] lg:max-h-[440px] xl:max-h-[500px] object-contain object-bottom filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.18)] grayscale hover:grayscale-0 transition-all duration-700 block mb-0 pb-0 translate-y-[4px]"
                />
              </div>



              {/* 1f. Bottom Black Infinite Ticker Tape Marquee */}
              <div className="absolute bottom-0 left-0 w-full z-30 bg-[#111111] overflow-hidden py-3 sm:py-4 border-t border-b border-neutral-900 mt-0">
                <div className="relative w-full flex items-center">
                  <div className="flex gap-16 whitespace-nowrap animate-marquee select-none text-[14px] sm:text-[17px] font-sans font-extrabold text-white uppercase tracking-wider">
                    <span>Startup Operations</span>
                    <span className="text-[#FF6B4A] font-light">+</span>
                    <span>Student Leadership</span>
                    <span className="text-[#FF6B4A] font-light">+</span>
                    <span>Ecosystem Builder</span>
                    <span className="text-[#FF6B4A] font-light">+</span>
                    <span>Finance &amp; Taxation</span>
                    <span className="text-[#FF6B4A] font-light">+</span>
                    <span>Process Optimization</span>
                    <span className="text-[#FF6B4A] font-light">+</span>
                    <span>Logistics Coordination</span>
                    <span className="text-[#FF6B4A] font-light">+</span>
                    
                    <span>Startup Operations</span>
                    <span className="text-[#FF6B4A] font-light">+</span>
                    <span>Student Leadership</span>
                    <span className="text-[#FF6B4A] font-light">+</span>
                    <span>Ecosystem Builder</span>
                    <span className="text-[#FF6B4A] font-light">+</span>
                    <span>Finance &amp; Taxation</span>
                    <span className="text-[#FF6B4A] font-light">+</span>
                    <span>Process Optimization</span>
                    <span className="text-[#FF6B4A] font-light">+</span>
                    <span>Logistics Coordination</span>
                    <span className="text-[#FF6B4A] font-light">+</span>

                    <span>Startup Operations</span>
                    <span className="text-[#FF6B4A] font-light">+</span>
                    <span>Student Leadership</span>
                    <span className="text-[#FF6B4A] font-light">+</span>
                    <span>Ecosystem Builder</span>
                    <span className="text-[#FF6B4A] font-light">+</span>
                    <span>Finance &amp; Taxation</span>
                    <span className="text-[#FF6B4A] font-light">+</span>
                    <span>Process Optimization</span>
                    <span className="text-[#FF6B4A] font-light">+</span>
                    <span>Logistics Coordination</span>
                    <span className="text-[#FF6B4A] font-light">+</span>
                  </div>
                </div>
              </div>

            </section>

            {/* 1.5. ABOUT BIOGRAPHY SECTION */}
            <section id="about" className="space-y-12 scroll-mt-24 pt-8">
              <div className="text-center max-w-3xl mx-auto space-y-2">
                <span className="text-[10px] text-[#8B5CF6] font-mono font-black uppercase tracking-[0.2em] block">ABOUT BIOGRAPHY</span>
                <h2 className="font-sans font-black text-3xl sm:text-5xl uppercase tracking-tighter text-neutral-900">
                  Startup Mindset Meets <span className="text-[#FF6B4A]">Operational Excellence</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
                
                {/* Left card: Core Narrative */}
                <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-3xl p-8 hover:border-neutral-900 transition-all duration-300 hover:shadow-lg flex flex-col justify-between relative overflow-hidden group shadow-sm">
                  {/* Absolute subtle background element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/5 rounded-bl-full pointer-events-none z-0" />
                  
                  <div className="space-y-6 relative z-10">
                    <span className="text-[#FF6B4A] font-serif italic text-4xl block leading-none">“</span>
                    <p className="text-sm sm:text-base text-neutral-800 leading-relaxed font-normal text-justify">
                      Grounded <strong className="text-neutral-950 font-black">B.Com graduate and startup enthusiast</strong> with a proven track record of stepping beyond academics into operational leadership, event volunteering, and real-world research.
                    </p>
                    <p className="text-sm sm:text-base text-neutral-800 leading-relaxed font-normal text-justify">
                      Combining a solid foundation in finance and commerce with a <strong className="text-neutral-950 font-black">high-energy, focused approach</strong> derived from a lifelong passion for driving and exploration.
                    </p>
                    <p className="text-sm sm:text-base text-neutral-800 leading-relaxed font-normal text-justify">
                      Uncompromising on integrity, disciplined under pressure, and actively seeking roles in <strong className="text-[#8B5CF6] font-black">business development and startup innovation</strong> where I can scale impactful ideas.
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-neutral-100 mt-8 flex flex-wrap gap-2 relative z-10">
                    <span className="px-2.5 py-1 bg-[#8B5CF6]/5 text-[#8B5CF6] text-[9px] font-mono rounded font-bold uppercase tracking-wider">integrity-driven</span>
                    <span className="px-2.5 py-1 bg-[#FF6B4A]/5 text-[#FF6B4A] text-[9px] font-mono rounded font-bold uppercase tracking-wider">startup enthusiast</span>
                    <span className="px-2.5 py-1 bg-neutral-100 text-neutral-800 text-[9px] font-mono rounded font-bold uppercase tracking-wider">finance & commerce</span>
                  </div>
                </div>

                {/* Right col: Asymmetrical highlight capsules */}
                <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
                  {/* Pillar 1 */}
                  <div className="bg-white border border-neutral-200 rounded-3xl p-6 hover:border-neutral-900 transition-all duration-300 hover:shadow-lg flex items-start gap-4 shadow-sm flex-1">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-[#8B5CF6]/5 border border-[#8B5CF6]/15 flex items-center justify-center text-[#8B5CF6]">
                      <Briefcase size={18} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[9px] font-mono font-black text-neutral-400 uppercase tracking-widest">01 / Startup Operations</h4>
                      <h3 className="text-neutral-950 font-black uppercase tracking-tight text-xs font-sans">Startup Operations</h3>
                      <p className="text-[11px] text-slate-500 leading-normal font-sans font-normal text-justify">
                        Hands-on experience managing end-to-end operations in a growing gifting startup, from logistics to strategy.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div className="bg-white border border-neutral-200 rounded-3xl p-6 hover:border-neutral-900 transition-all duration-300 hover:shadow-lg flex items-start gap-4 shadow-sm flex-1">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-[#FF6B4A]/5 border border-[#FF6B4A]/15 flex items-center justify-center text-[#FF6B4A]">
                      <Award size={18} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[9px] font-mono font-black text-neutral-400 uppercase tracking-widest">02 / Student Leadership</h4>
                      <h3 className="text-neutral-950 font-black uppercase tracking-tight text-xs font-sans">Student Leadership</h3>
                      <p className="text-[11px] text-slate-500 leading-normal font-sans font-normal text-justify">
                        Led the IEDC cell, spearheading ideathons, events, and innovation workshops for the campus community.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className="bg-white border border-neutral-200 rounded-3xl p-6 hover:border-neutral-900 transition-all duration-300 hover:shadow-lg flex items-start gap-4 shadow-sm flex-1">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-[#22C55E]/5 border border-[#22C55E]/15 flex items-center justify-center text-[#22C55E]">
                      <Globe size={18} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[9px] font-mono font-black text-neutral-400 uppercase tracking-widest">03 / Ecosystem Builder</h4>
                      <h3 className="text-neutral-950 font-black uppercase tracking-tight text-xs font-sans">Ecosystem Builder</h3>
                      <p className="text-[11px] text-slate-500 leading-normal font-sans font-normal text-justify">
                        Actively networked with global entrepreneurs and investors at Huddle Global 2025, an international startup summit.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* 1.6. EXPERIENCE SECTION */}
            <section id="experience" className="space-y-12 scroll-mt-24 pt-8">
              <div className="text-center max-w-3xl mx-auto space-y-2">
                <span className="text-[10px] text-[#FF6B4A] font-mono font-black uppercase tracking-[0.2em] block">EXPERIENCE</span>
                <h2 className="font-sans font-black text-3xl sm:text-5xl uppercase tracking-tighter text-neutral-900">
                  Where I've <span className="text-[#8B5CF6]">Made an Impact</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto font-normal">
                  Hands-on leadership, logistics design, and startup ecosystem engagement.
                </p>
              </div>

              <div className="relative max-w-4xl mx-auto space-y-10 pl-6 sm:pl-8 border-l border-neutral-200 mt-8">
                {/* Visual timeline track styling */}
                <div className="absolute top-2 bottom-2 left-0 w-px bg-gradient-to-b from-[#FF6B4A] via-[#8B5CF6] to-[#22C55E]" />
                
                {/* Experience Item 1: RegaloBox */}
                <div className="relative group">
                  {/* Timeline bullet icon */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-white border-4 border-[#FF6B4A] transition-all duration-300 group-hover:scale-125 z-10" />
                  
                  <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:border-neutral-900 hover:shadow-lg space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#FF6B4A] tracking-wider uppercase">February 2025 – May 2026 • 1 yr 4 months</span>
                        <h3 className="text-lg font-sans font-black uppercase tracking-tight text-neutral-900 mt-1">Operations Head</h3>
                        <p className="text-xs font-mono font-bold text-slate-500 uppercase mt-0.5">RegaloBox</p>
                      </div>
                      <div className="px-3 py-1 bg-[#FF6B4A]/5 hover:bg-[#FF6B4A]/10 text-[#FF6B4A] text-[9px] font-mono font-bold rounded-lg w-fit uppercase tracking-wider transition-colors">
                        Startup Operations
                      </div>
                    </div>
                    
                    <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      <li className="flex gap-2.5 items-start">
                        <span className="text-[#FF6B4A] text-xs mt-1">•</span>
                        <span>Oversaw end-to-end operations including logistics coordination, team management, and process optimization for a gifting startup.</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <span className="text-[#FF6B4A] text-xs mt-1">•</span>
                        <span>Identified operational bottlenecks and implemented workflow improvements, enhancing overall efficiency.</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <span className="text-[#FF6B4A] text-xs mt-1">•</span>
                        <span>Collaborated with cross-functional teams to ensure timely order fulfilment and quality standards.</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <span className="text-[#FF6B4A] text-xs mt-1">•</span>
                        <span>Contributed to business strategy discussions and supported decision-making with operational insights.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Experience Item 2: IEDC */}
                <div className="relative group">
                  {/* Timeline bullet icon */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-white border-4 border-[#8B5CF6] transition-all duration-300 group-hover:scale-125 z-10" />
                  
                  <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:border-neutral-900 hover:shadow-lg space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#8B5CF6] tracking-wider uppercase">2025 – 2026</span>
                        <h3 className="text-lg font-sans font-black uppercase tracking-tight text-neutral-900 mt-1">Student Lead</h3>
                        <p className="text-xs font-mono font-bold text-slate-500 uppercase mt-0.5">IEDC – Innovation and Entrepreneurship Development Cell</p>
                      </div>
                      <div className="px-3 py-1 bg-[#8B5CF6]/5 hover:bg-[#8B5CF6]/10 text-[#8B5CF6] text-[9px] font-mono font-bold rounded-lg w-fit uppercase tracking-wider transition-colors">
                        Student Leadership
                      </div>
                    </div>
                    
                    <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      <li className="flex gap-2.5 items-start">
                        <span className="text-[#8B5CF6] text-xs mt-1">•</span>
                        <span>Led a student-run entrepreneurship cell, organizing startup events, ideathons, and innovation workshops.</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <span className="text-[#8B5CF6] text-xs mt-1">•</span>
                        <span>Coordinated a team of student volunteers and managed end-to-end event planning and execution.</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <span className="text-[#8B5CF6] text-xs mt-1">•</span>
                        <span>Facilitated networking between students, mentors, and industry professionals within the startup ecosystem.</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <span className="text-[#8B5CF6] text-xs mt-1">•</span>
                        <span>Promoted an entrepreneurial culture on campus through awareness campaigns and community initiatives.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Experience Item 3: Huddle Global */}
                <div className="relative group">
                  {/* Timeline bullet icon */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-white border-4 border-[#22C55E] transition-all duration-300 group-hover:scale-125 z-10" />
                  
                  <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:border-neutral-900 hover:shadow-lg space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#22C55E] tracking-wider uppercase">2025</span>
                        <h3 className="text-lg font-sans font-black uppercase tracking-tight text-neutral-900 mt-1">Volunteer</h3>
                        <p className="text-xs font-mono font-bold text-slate-500 uppercase mt-0.5">Huddle Global 2025 – International Startup Summit</p>
                      </div>
                      <div className="px-3 py-1 bg-[#22C55E]/5 hover:bg-[#22C55E]/10 text-[#22C55E] text-[9px] font-mono font-bold rounded-lg w-fit uppercase tracking-wider transition-colors">
                        Ecosystem Builder
                      </div>
                    </div>
                    
                    <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      <li className="flex gap-2.5 items-start">
                        <span className="text-[#22C55E] text-xs mt-1">•</span>
                        <span>Supported event coordination and delegate management at Kerala's premier startup and innovation conference.</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <span className="text-[#22C55E] text-xs mt-1">•</span>
                        <span>Engaged with entrepreneurs, investors, and innovators from across the globe, broadening understanding of the global startup landscape.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Experience Item 4: Vijnjana Pathanamthitta Project */}
                <div className="relative group">
                  {/* Timeline bullet icon */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-white border-4 border-[#8B5CF6] transition-all duration-300 group-hover:scale-125 z-10" />
                  
                  <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:border-neutral-900 hover:shadow-lg space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#8B5CF6] tracking-wider uppercase">February 2024 – January 2025</span>
                        <h3 className="text-lg font-sans font-black uppercase tracking-tight text-neutral-900 mt-1">Student Volunteer</h3>
                        <p className="text-xs font-mono font-bold text-slate-500 uppercase mt-0.5">Vijnjana Pathanamthitta Project (Kerala Knowledge Economy Mission)</p>
                      </div>
                      <div className="px-3 py-1 bg-[#8B5CF6]/5 hover:bg-[#8B5CF6]/10 text-[#8B5CF6] text-[9px] font-mono font-bold rounded-lg w-fit uppercase tracking-wider transition-colors">
                        Knowledge Mission
                      </div>
                    </div>
                    
                    <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      <li className="flex gap-2.5 items-start">
                        <span className="text-[#8B5CF6] text-xs mt-1">•</span>
                        <span>Recognized for dedicated contributions as a Student Volunteer in the Vijnjana Pathanamthitta project under Kerala Knowledge Economy Mission.</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <span className="text-[#8B5CF6] text-xs mt-1">•</span>
                        <span>Contributed actively in regional community mobilization, awareness building campaigns, and coordinate localized job fairs.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Experience Item 5: Digital Literacy Project Volunteer */}
                <div className="relative group">
                  {/* Timeline bullet icon */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-white border-4 border-[#FF6B4A] transition-all duration-300 group-hover:scale-125 z-10" />
                  
                  <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:border-neutral-900 hover:shadow-lg space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#FF6B4A] tracking-wider uppercase">2024</span>
                        <h3 className="text-lg font-sans font-black uppercase tracking-tight text-neutral-900 mt-1">Digital Literacy Project Volunteer</h3>
                        <p className="text-xs font-mono font-bold text-slate-500 uppercase mt-0.5">Ranni Pazhavangadi Grama Panchayat</p>
                      </div>
                      <div className="px-3 py-1 bg-[#FF6B4A]/5 hover:bg-[#FF6B4A]/10 text-[#FF6B4A] text-[9px] font-mono font-bold rounded-lg w-fit uppercase tracking-wider transition-colors">
                        Digital Literacy
                      </div>
                    </div>
                    
                    <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      <li className="flex gap-2.5 items-start">
                        <span className="text-[#FF6B4A] text-xs mt-1">•</span>
                        <span>Awarded for valuable service and contribution as a volunteer in the Digital Literacy Project conducted by the Grama Panchayat.</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <span className="text-[#FF6B4A] text-xs mt-1">•</span>
                        <span>Aided in delivering digital-readiness education and computer operational basics for the local populace.</span>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </section>

            {/* 1.7. EDUCATION SECTION */}
            <section id="education" className="space-y-12 scroll-mt-24 pt-8">
              <div className="text-center max-w-3xl mx-auto space-y-2">
                <span className="text-[10px] text-[#22C55E] font-mono font-black uppercase tracking-[0.2em] block">Academic Background</span>
                <h2 className="font-sans font-black text-3xl sm:text-5xl uppercase tracking-tighter text-neutral-900">
                  Formative <span className="text-[#8B5CF6]">Commerce &amp; Finance</span> Education
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto font-normal">
                  A strong theoretical core combined with specialized coursework in taxation &amp; operational systems.
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="bg-white border border-neutral-200 rounded-[24px] sm:rounded-[32px] p-5 xs:p-6 sm:p-10 transition-all duration-300 hover:border-neutral-900 hover:shadow-xl relative overflow-hidden group shadow-sm">
                  {/* Backdrop glowing visual */}
                  <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-[#22C55E]/5 rounded-bl-[100px] pointer-events-none z-0" />
                  
                  <div className="relative z-10 flex flex-col-reverse md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-4 max-w-2xl w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 bg-[#22C55E]/10 text-[#22C55E] text-[9px] sm:text-[10px] font-mono font-bold rounded-lg uppercase tracking-wider">
                          Commerce Specialist
                        </span>
                        <span className="px-2.5 py-1 bg-neutral-100 text-neutral-800 text-[9px] sm:text-[10px] font-mono font-bold rounded-lg uppercase tracking-wider">
                          Graduating Class of 2026
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-sans font-black uppercase tracking-tight text-neutral-900">
                          B.Com – Finance &amp; Taxation
                        </h3>
                        <p className="text-xs sm:text-sm font-mono font-black text-[#8B5CF6] uppercase tracking-wide mt-1">
                          St. Thomas College, Ranni
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify font-normal">
                        Relevant coursework in Financial Accounting, Business Management, Entrepreneurship, Taxation, and Commerce — providing a strong theoretical foundation complemented by real-world startup experience.
                      </p>

                      {/* Coursework pill layout */}
                      <div className="pt-4 flex flex-wrap gap-1.5 border-t border-neutral-100">
                        {["Financial Accounting", "Business Management", "Entrepreneurship", "Taxation", "Commerce"].map((course, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 sm:py-1 bg-neutral-50 border border-neutral-100 text-[#444] text-[9px] sm:text-[10px] font-sans font-medium rounded-full">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Timeline side bubble block */}
                    <div className="shrink-0 flex md:flex-col items-start md:items-end gap-1 md:gap-2">
                      <span className="text-xl sm:text-2xl md:text-3xl font-sans font-black text-neutral-900 leading-none">2023 – 2026</span>
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">3 year tenure</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 1.8. ACHIEVEMENTS SECTION */}
            <section id="achievements" className="space-y-12 scroll-mt-24 pt-8">
              <div className="text-center max-w-3xl mx-auto space-y-2">
                <span className="text-[10px] text-[#D97706] font-mono font-black uppercase tracking-[0.2em] block">Laurels & Recognition</span>
                <h2 className="font-sans font-black text-3xl sm:text-5xl uppercase tracking-tighter text-neutral-900">
                  Honors <span className="text-[#8B5CF6]">&amp; Awards</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto font-normal">
                  Milestones representing innovation, student startup ecosystems, and dedicated community contributions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {data.achievements?.map((ach, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-neutral-200 rounded-[28px] p-6 sm:p-8 transition-all duration-300 hover:border-neutral-900 hover:shadow-xl relative overflow-hidden group shadow-sm flex flex-col justify-between"
                  >
                    {/* Glowing highlight corner decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D97706]/5 rounded-bl-[100px] pointer-events-none transition-transform duration-500 group-hover:scale-110" />
                    
                    <div className="space-y-4">
                      {/* Stylized Award Icon */}
                      <div className="h-10 w-10 rounded-2xl bg-[#D97706]/5 border border-[#D97706]/15 flex items-center justify-center text-[#D97706] group-hover:bg-[#D97706]/10 transition-colors">
                        <Award size={20} />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-lg sm:text-xl font-sans font-black uppercase text-neutral-900 tracking-tight leading-tight">
                          {ach.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify pt-1 font-normal">
                          {ach.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. SKILLS & EXPERTISE SECTION */}
            <section id="speciality" className="space-y-12 scroll-mt-24">
              <div className="text-center max-w-3xl mx-auto space-y-2">
                <span className="text-[10px] text-[#8B5CF6] font-mono font-black uppercase tracking-[0.2em] block">SKILLS & EXPERTISE</span>
                <h2 className="font-sans font-black text-3xl sm:text-5xl uppercase tracking-tighter text-neutral-900">
                  What I Bring <span className="text-[#FF6B4A]">To The Table</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto font-normal">
                  A high-energy, execution-focused skill set blending commerce expertise, startup agility, and operational leadership.
                </p>
              </div>
 
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Category 1: Leadership & Management */}
                <div className="bg-white border border-neutral-200 rounded-3xl p-6 transition-all duration-300 hover:border-neutral-900 hover:shadow-lg flex flex-col justify-between group shadow-sm">
                  <div className="space-y-4">
                    <div className="h-10 w-10 rounded-xl bg-[#8B5CF6]/5 flex items-center justify-center border border-[#8B5CF6]/15 text-[#8B5CF6] group-hover:bg-[#8B5CF6]/10 transition-colors">
                      <Workflow size={18} />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-1">01 / Management</span>
                      <h3 className="text-neutral-900 text-sm font-black uppercase tracking-tight font-sans mb-3">Leadership & Management</h3>
                      <ul className="space-y-2">
                        {["Team Leadership", "Operational Coordination", "Project Planning", "Decision Making"].map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs text-slate-600 font-normal">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-neutral-100 mt-5 text-[9px] text-[#8B5CF6] font-mono tracking-wider font-bold flex items-center gap-1.5 uppercase">
                    <span>Execution Focus</span>
                  </div>
                </div>
 
                {/* Category 2: Communication */}
                <div className="bg-white border border-neutral-200 rounded-3xl p-6 transition-all duration-300 hover:border-neutral-900 hover:shadow-lg flex flex-col justify-between group shadow-sm">
                  <div className="space-y-4">
                    <div className="h-10 w-10 rounded-xl bg-[#FF6B4A]/5 flex items-center justify-center border border-[#FF6B4A]/15 text-[#FF6B4A] group-hover:bg-[#FF6B4A]/10 transition-colors">
                      <Globe size={18} />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-1">02 / Synergy</span>
                      <h3 className="text-neutral-900 text-sm font-black uppercase tracking-tight font-sans mb-3">Communication</h3>
                      <ul className="space-y-2">
                        {["Stakeholder Comms", "Public Speaking", "Cross-functional Collab"].map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs text-slate-600 font-normal">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B4A]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-neutral-100 mt-5 text-[9px] text-[#FF6B4A] font-mono tracking-wider font-bold flex items-center gap-1.5 uppercase">
                    <span>Stakeholder Alignment</span>
                  </div>
                </div>
 
                {/* Category 3: Entrepreneurship & Business */}
                <div className="bg-white border border-neutral-200 rounded-3xl p-6 transition-all duration-300 hover:border-neutral-900 hover:shadow-lg flex flex-col justify-between group shadow-sm">
                  <div className="space-y-4">
                    <div className="h-10 w-10 rounded-xl bg-[#22C55E]/5 flex items-center justify-center border border-[#22C55E]/15 text-[#22C55E] group-hover:bg-[#22C55E]/10 transition-colors">
                      <Lightbulb size={18} />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-1">03 / Growth</span>
                      <h3 className="text-neutral-900 text-sm font-black uppercase tracking-tight font-sans mb-3">Entrepreneurship & Business</h3>
                      <ul className="space-y-2">
                        {["Startup Ecosystem", "Business Development", "Event Management", "Strategic Thinking"].map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs text-slate-600 font-normal">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-neutral-100 mt-5 text-[9px] text-[#22C55E] font-mono tracking-wider font-bold flex items-center gap-1.5 uppercase">
                    <span>Ecosystem Driven</span>
                  </div>
                </div>
 
                {/* Category 4: Domain Knowledge */}
                <div className="bg-white border border-neutral-200 rounded-3xl p-6 transition-all duration-300 hover:border-neutral-900 hover:shadow-lg flex flex-col justify-between group shadow-sm">
                  <div className="space-y-4">
                    <div className="h-10 w-10 rounded-xl bg-orange-500/5 flex items-center justify-center border border-orange-500/15 text-orange-500 group-hover:bg-orange-500/10 transition-colors">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-1">04 / Discipline</span>
                      <h3 className="text-neutral-900 text-sm font-black uppercase tracking-tight font-sans mb-3">Domain Knowledge</h3>
                      <ul className="space-y-2">
                        {["Finance", "Accounting", "Commerce", "Taxation"].map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs text-slate-600 font-normal">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-neutral-100 mt-5 text-[9px] text-orange-500 font-mono tracking-wider font-bold flex items-center gap-1.5 uppercase">
                    <span>Academic Grounding</span>
                  </div>
                </div>

 
              </div>
            </section>





            {/* 8. FOOTER CALL-TO-ACTION BANNER - CONTACT SECTION */}
            <section id="contact" className="space-y-12 scroll-mt-24 pt-8">
              <div className="text-center max-w-3xl mx-auto space-y-2">
                <span className="text-[10px] text-[#FF6B4A] font-mono font-black uppercase tracking-[0.2em] block">Get In Touch</span>
                <h2 className="font-sans font-black text-3xl sm:text-5xl uppercase tracking-tighter text-neutral-900">
                  Let's Spark <span className="text-[#8B5CF6]">Collaboration</span> Together
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto font-normal">
                  Have an enquiry, a project, or a student startup ecosystem initiative? Reach out directly via the channels below.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {/* Email Card */}
                <a
                  href={`mailto:${data.contact.email}`}
                  className="bg-white border border-neutral-200 rounded-[24px] p-6 sm:p-8 transition-all duration-300 hover:border-neutral-900 hover:shadow-xl relative overflow-hidden group shadow-sm flex flex-col justify-between h-44 sm:h-48 text-left"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#8B5CF6]/5 rounded-bl-[60px] pointer-events-none transition-transform duration-500 group-hover:scale-110" />
                  <div className="space-y-4">
                    <div className="h-10 w-10 rounded-2xl bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest leading-none">Drop an Email</h3>
                      <p className="text-xs sm:text-sm font-sans font-black lowercase text-neutral-900 mt-2 break-all tracking-tight leading-snug">
                        {data.contact.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono font-bold text-[#8B5CF6] uppercase tracking-wider">
                    <span>Send Message</span>
                    <ChevronRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </a>

                {/* Phone Card */}
                <a
                  href={`tel:${data.contact.phone}`}
                  className="bg-white border border-neutral-200 rounded-[24px] p-6 sm:p-8 transition-all duration-300 hover:border-neutral-900 hover:shadow-xl relative overflow-hidden group shadow-sm flex flex-col justify-between h-44 sm:h-48 text-left"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF6B4A]/5 rounded-bl-[60px] pointer-events-none transition-transform duration-500 group-hover:scale-110" />
                  <div className="space-y-4">
                    <div className="h-10 w-10 rounded-2xl bg-[#FF6B4A]/5 border border-[#FF6B4A]/10 flex items-center justify-center text-[#FF6B4A]">
                      <Phone size={18} />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest leading-none">Give a Ring</h3>
                      <p className="text-sm font-sans font-black uppercase text-neutral-900 mt-2 tracking-tight leading-snug">
                        {data.contact.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono font-bold text-[#FF6B4A] uppercase tracking-wider">
                    <span>Call Directly</span>
                    <ChevronRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </a>

                {/* LinkedIn Card */}
                {data.contact.linkedin && (
                  <a
                    href={data.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border border-neutral-200 rounded-[24px] p-6 sm:p-8 transition-all duration-300 hover:border-neutral-900 hover:shadow-xl relative overflow-hidden group shadow-sm flex flex-col justify-between h-44 sm:h-48 col-span-1 sm:col-span-2 md:col-span-1 text-left"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[60px] pointer-events-none transition-transform duration-500 group-hover:scale-110" />
                    <div className="space-y-4">
                      <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                        <Linkedin size={18} />
                      </div>
                      <div>
                        <h3 className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest leading-none">Connect Professional</h3>
                        <p className="text-xs sm:text-sm font-sans font-black uppercase text-neutral-900 mt-2 tracking-tight leading-snug">
                          LinkedIn Profile
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider">
                      <span>Visit Profile</span>
                      <ChevronRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </a>
                )}
              </div>
            </section>



          </div>
        )}

        {/* HIGH-FIDELITY PDF RESUME BUILDER MODE */}
        {appMode === "resume" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Customizer Option Drawer Left (No-Print) */}
            <div className="lg:col-span-4 no-print lg:sticky lg:top-24 space-y-6">
              
              {/* Theme customizer bar */}
              <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-sm space-y-4">
                <div>
                  <h3 className="font-display font-black text-sm text-neutral-950 mb-1">Select Resume Theme Style</h3>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">Matches print layout outputs</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setResumeTemplate("executive")}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      resumeTemplate === "executive"
                        ? "bg-neutral-900 text-white border-neutral-900 font-bold shadow-sm"
                        : "bg-white text-slate-800 border-neutral-200 hover:border-neutral-900 text-xs font-semibold"
                    }`}
                  >
                    <span className="block text-xs">Creative Studio</span>
                    <span className="text-[8px] opacity-75 uppercase mt-0.5 tracking-tight font-mono font-medium">Outline Grid</span>
                  </button>

                  <button
                    onClick={() => setResumeTemplate("modern")}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      resumeTemplate === "modern"
                        ? "bg-neutral-900 text-white border-neutral-900 font-bold shadow-sm"
                        : "bg-white text-slate-800 border-neutral-200 hover:border-neutral-900 text-xs font-semibold"
                    }`}
                  >
                    <span className="block text-xs">Modern Swiss</span>
                    <span className="text-[8px] opacity-75 uppercase mt-0.5 tracking-tight font-mono font-medium">Typography</span>
                  </button>

                  <button
                    onClick={() => setResumeTemplate("indigo-tech")}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      resumeTemplate === "indigo-tech"
                        ? "bg-neutral-900 text-white border-neutral-900 font-bold shadow-sm"
                        : "bg-white text-slate-800 border-neutral-200 hover:border-neutral-900 text-xs font-semibold"
                    }`}
                  >
                    <span className="block text-xs">Developer Slate</span>
                    <span className="text-[8px] opacity-75 uppercase mt-0.5 tracking-tight font-mono font-medium">Capsules</span>
                  </button>

                  <button
                    onClick={() => setResumeTemplate("classic-serif")}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      resumeTemplate === "classic-serif"
                        ? "bg-neutral-900 text-white border-neutral-900 font-bold shadow-sm"
                        : "bg-white text-slate-800 border-neutral-200 hover:border-neutral-900 text-xs font-semibold"
                    }`}
                  >
                    <span className="block text-xs">Prestige Portrait</span>
                    <span className="text-[8px] opacity-75 uppercase mt-0.5 tracking-tight font-mono font-medium">Serif</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-neutral-200">
                  <button
                    onClick={() => setIsPrintModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Printer size={13} className="text-[#FF6B4A]" />
                    <span>Download This Styled Copy</span>
                  </button>
                </div>
              </div>

              {/* Unified Edit Form component */}
              <div className="h-[640px] relative">
                {/* Visual arrow guiding user to interactive preview sheet */}
                <div className="absolute -top-3.5 left-6 shadow shadow-slate-100 bg-neutral-900 text-white text-[9px] font-mono tracking-wider font-extrabold uppercase py-1 px-3 rounded-full border border-neutral-900 no-print z-10 select-none animate-bounce">
                  Live Customizer panel ✏️
                </div>
                <FormEditor
                  data={data}
                  onChange={setData}
                  onReset={handleResetData}
                />
              </div>

            </div>

            {/* HIGH FIDELITY RESUME WRITER PANEL RIGHT */}
            <div className="lg:col-span-8 flex flex-col items-center">
              
              {/* Alert banner guide no-print */}
              <div className="no-print bg-neutral-50 border border-neutral-200 rounded-2xl p-4 mb-4 text-xs text-neutral-800 text-justify w-full leading-normal font-normal">
                💡 **A4 / Letter Live Canvas**: This live sheet reflects the margins, font layouts, spacing systems, and colors that will print of your resume exactly. Click the fields inside the left panel to update.
              </div>

              {/* Master A4 Doc View container */}
              <div className="w-full relative shadow-lg rounded-2xl overflow-hidden bg-white max-w-[800px]">
                <ResumePDFView
                  data={data}
                  styleTemplate={resumeTemplate}
                />
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Recruiter Signature Bottom panel (No-Print) */}
      <footer className="no-print bg-white border-t border-neutral-200 py-10 mt-16 text-center text-xs text-slate-400 font-sans">
        <div className="max-w-2xl mx-auto px-4 space-y-2">
          <p>© 2026 {data.name} Suite. All rights reserved.</p>
          <p className="text-[10px] mt-2 font-mono flex items-center justify-center gap-1.5 text-slate-500">
            <User size={13} className="text-[#FF6B4A] shrink-0" />
            <span>Startup Operations & Business Development Suite</span>
          </p>
        </div>
      </footer>

      {/* Modern High-Performance Print dialog Modal Guide */}
      <PrintGuideModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        onPrint={handlePrint}
      />

    </div>
  );
}
