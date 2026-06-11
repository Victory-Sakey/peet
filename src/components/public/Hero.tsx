"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  Check,
  Search,
  BookOpen,
  Briefcase,
  Users,
  Target,
  Compass,
  ArrowRight,
  GraduationCap,
  TrendingUp,
  Zap,
  Globe,
  Flame
} from "lucide-react";

interface HeroProps {
  setActivePage: (page: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActivePage }) => {
  // Mock search tab switcher state
  const [simulatorFilter, setSimulatorFilter] = useState<"all" | "job" | "education" | "training">("all");

  const mockSimulatorOpps = [
    { title: "Full Stack Software Developer", type: "job", sub: "Full-Time", provider: "PixelCraft Agency", location: "London, UK (Remote)", pay: "$120,000/yr" },
    { title: "AI & Machine Learning Specialist", type: "training", sub: "Apprenticeship", provider: "DeepMind Labs", location: "Boston, MA", pay: "$4,500/mo" },
    { title: "Cloud Systems Architect Masterclass", type: "education", sub: "Course & Cert", provider: "Nebula Academy", location: "Online", pay: "Free (Scholarship)" },
    { title: "UX/UI Design & Product Associate", type: "job", sub: "Part-Time", provider: "Sprout Analytics", location: "San Francisco, CA", pay: "$95,000/yr" },
    { title: "Full-Stack Web Bootcamp 2026", type: "training", sub: "Bootcamp", provider: "Velo Tech Systems", location: "Raleigh, NC", pay: "Deferred Tuition" },
    { title: "Advanced Cybersecurity Protocols", type: "education", sub: "Course", provider: "Aether Security Labs", location: "Online", pay: "Free" }
  ];

  const filteredOpps = simulatorFilter === "all" 
    ? mockSimulatorOpps 
    : mockSimulatorOpps.filter(o => o.type === simulatorFilter);

  return (
    <div className="space-y-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* 1. HERO SHOWCASE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10 md:pt-16 items-center relative">
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-650/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse"></div>

        {/* Text Area */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/10 text-[10px] font-bold tracking-wider uppercase animate-pulse mx-auto lg:mx-0">
            <Sparkles className="w-3 h-3 fill-purple-400 dark:fill-transparent" />
            Find your next opportunity. All in one place.
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-white">
            The unified platform for <span className="text-gradient">work</span>, <span className="text-gradient">education</span>, and <span className="text-gradient">growth</span>.
          </h1>

          <p className="max-w-xl text-zinc-400 text-xs sm:text-sm lg:text-base leading-relaxed font-medium mx-auto lg:mx-0">
            PEET is where ambition meets opportunity. Whether you're looking for a job, internship, apprenticeship, or training program — PEET brings everything together in one powerful search experience.
          </p>

          <p className="max-w-xl text-purple-300/85 text-xs sm:text-sm font-bold border-l-2 border-purple-500 pl-4 leading-relaxed mx-auto lg:mx-0 text-left">
            No more jumping between job boards, school portals, and training websites. Just one search. One platform. Infinite possibilities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-4">
            <button
              onClick={() => setActivePage("signup")}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-3 bg-purple-600 hover:bg-purple-750 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-500/25 hover:-translate-y-0.5 duration-200 cursor-pointer"
            >
              Join PEET Today
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActivePage("browse")}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-3 border border-zinc-800 bg-zinc-950/40 text-zinc-350 hover:bg-zinc-900 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 duration-200 cursor-pointer"
            >
              Browse Opportunities
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Floating Logo Showcase */}
        <div className="lg:col-span-5 relative w-full max-w-sm mx-auto animate-float">
          <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-full -z-10 animate-pulse"></div>
          <div className="glass-panel border border-purple-500/10 rounded-full overflow-hidden shadow-2xl relative p-2 bg-zinc-950/80 aspect-square flex items-center justify-center">
            <Image
              src="/peet_logo.jpg"
              alt="PEET Platform Logo"
              width={340}
              height={340}
              className="rounded-full object-cover scale-95"
              priority
            />
          </div>
        </div>
      </section>

      {/* 2. WHAT IS PEET? */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-600/10 text-purple-400 text-[9px] font-bold tracking-widest uppercase">
            🚀 What is PEET?
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            A Smart Opportunity Marketplace
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            PEET helps you discover diverse career options tailored directly to your goals, skills, and location:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Jobs", desc: "Tech, remote, part-time, full-time positions built to advance your careers.", icon: Briefcase, color: "bg-blue-500/10 text-blue-400" },
            { title: "Internships & Apprenticeships", desc: "Hands-on projects and entry programs to gain field experience.", icon: Users, color: "bg-purple-500/10 text-purple-400" },
            { title: "Courses & Training Programs", desc: "Structured learning pathways, certifications, and technical bootcamps.", icon: BookOpen, color: "bg-emerald-500/10 text-emerald-400" },
            { title: "Scholarships & Career Pathways", desc: "Funding aids and structured roadmaps guiding your transition stages.", icon: Target, color: "bg-teal-500/10 text-teal-400" }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="glass-panel rounded-2xl p-5 space-y-4 hover:border-purple-500/20 transition-all duration-300">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-sm text-white">{item.title}</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SEARCH SMARTER, NOT HARDER */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Explanation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-600/10 text-purple-400 text-[9px] font-bold tracking-widest uppercase">
            🔍 Search Smarter, Not Harder
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Stop searching everywhere. Let PEET do the opposite.
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            Traditional platforms force you to search everywhere. PEET does the opposite. It’s not just search — it’s guided discovery.
          </p>

          <ul className="space-y-3.5 text-xs text-zinc-350">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-purple-600/15 flex items-center justify-center text-purple-400 shrink-0 font-bold">✓</span>
              <span>Search across multiple opportunity types at once</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-purple-600/15 flex items-center justify-center text-purple-400 shrink-0 font-bold">✓</span>
              <span>Filter by skill level, location, and interest</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-purple-600/15 flex items-center justify-center text-purple-400 shrink-0 font-bold">✓</span>
              <span>Discover opportunities you didn’t even know existed</span>
            </li>
          </ul>
        </div>

        {/* Right Live Search Preview Tool */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-5 border border-purple-500/10 shadow-2xl space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2 pb-3 border-b border-purple-500/5">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Unified Search Simulator
            </span>
            <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-900 gap-1">
              {[
                { id: "all", label: "All Opportunities" },
                { id: "job", label: "Jobs" },
                { id: "education", label: "Education" },
                { id: "training", label: "Training" }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setSimulatorFilter(btn.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    simulatorFilter === btn.id
                      ? "bg-purple-600 text-white"
                      : "text-zinc-550 hover:text-zinc-350"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Simulated results */}
          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
            {filteredOpps.map((opp, i) => (
              <div key={i} className="p-3 bg-zinc-900/30 border border-purple-500/5 hover:border-purple-500/10 transition-all rounded-xl flex justify-between items-center gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-bold text-xs text-white truncate">{opp.title}</h4>
                    <span className={`text-[7px] font-extrabold uppercase px-1 rounded ${
                      opp.type === "education"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : opp.type === "training"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-purple-500/10 text-purple-400"
                    }`}>
                      {opp.type}
                    </span>
                  </div>
                  <span className="text-[9px] text-zinc-500 block truncate mt-0.5">
                    {opp.provider} • {opp.location}
                  </span>
                </div>
                <span className="text-[10px] font-extrabold text-purple-400 shrink-0">
                  {opp.pay}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BUILT FOR EVERYONE */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-600/10 text-purple-400 text-[9px] font-bold tracking-widest uppercase">
            🎯 Built for Everyone
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Adapts To Your Specific Journey
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            No matter where you currently stand in your professional development:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { persona: "The Student", desc: "Looking for your first internship to apply classroom insights.", role: "Internships & Scholarships" },
            { persona: "The Graduate", desc: "Searching for your first entry-level job to kickstart your career.", role: "Graduate Careers" },
            { persona: "The Professional", desc: "Ready for switching careers and seeking lateral transitions.", role: "Lateral Roles" },
            { persona: "The Learner", desc: "Upgrading your technical skills through bootcamps and certifications.", role: "Courses & Training" }
          ].map((card, i) => (
            <div key={i} className="glass-panel rounded-2xl p-5 border border-purple-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-44">
              <div className="space-y-2">
                <span className="text-[8px] font-bold bg-purple-650/15 text-purple-400 px-2 py-0.5 rounded border border-purple-500/10 uppercase tracking-wider">
                  {card.role}
                </span>
                <h4 className="font-extrabold text-sm text-white pt-1">{card.persona}</h4>
                <p className="text-[11px] text-zinc-450 leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <span className="text-gradient font-bold text-sm">PEET adapts to your journey.</span>
        </div>
      </section>

      {/* 5. WHY PEET? */}
      <section className="max-w-4xl mx-auto glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/10 space-y-8 relative overflow-hidden">
        <div className="absolute -right-24 -bottom-24 w-48 h-48 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-600/10 text-purple-400 text-[9px] font-bold tracking-widest uppercase">
            ⚡ Why PEET?
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            Built for Speed and Clarity
          </h3>
          <p className="text-xs text-zinc-400">
            Stop wasting time. Start progressing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-2">
          {[
            "One unified platform for all opportunities",
            "AI-powered recommendations based on your profile",
            "Real-time listings and updates",
            "Clean, simple, distraction-free experience",
            "Built for speed and clarity"
          ].map((benefit, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-purple-400 flex items-center justify-center shrink-0 shadow-sm text-white">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-xs font-semibold text-zinc-300">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. YOUR CAREER, YOUR PATH */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-600/10 text-purple-400 text-[9px] font-bold tracking-widest uppercase">
            🌍 Your Career, Your Path
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            A Connected Network of Possibilities
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto">
            Your future is not one straight line — it’s a network of possibilities. PEET helps you navigate it.
          </p>
        </div>

        {/* Pathway Flowchart */}
        <div className="max-w-4xl mx-auto py-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center text-center relative z-10">
            {[
              { label: "Learning", detail: "Courses & Academics", color: "from-blue-600 to-cyan-500" },
              { label: "Training", detail: "Bootcamps & Practice", color: "from-cyan-500 to-purple-500" },
              { label: "Employment", detail: "Jobs & Placements", color: "from-purple-500 to-indigo-600" },
              { label: "Growth", detail: "Promotions & Upskilling", color: "from-indigo-600 to-pink-500" }
            ].map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute inset-0 bg-purple-500/5 blur-lg rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="glass-panel rounded-2xl p-5 border border-purple-500/5 relative space-y-2.5 hover:border-purple-500/20 transition-all">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.color} mx-auto flex items-center justify-center text-white font-extrabold text-xs shadow-md`}>
                    {idx + 1}
                  </div>
                  <h4 className="font-extrabold text-sm text-white pt-1">{step.label}</h4>
                  <p className="text-[10px] text-zinc-500 font-medium">{step.detail}</p>
                </div>
                {/* Flow indicator arrow on desktop */}
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 text-purple-400/30 font-extrabold text-lg animate-pulse">
                    ➔
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-2">
          <span className="text-gradient font-bold text-sm">We connect every step.</span>
        </div>
      </section>

      {/* 7. FIRE GET STARTED ACTION BANNER */}
      <section className="pb-8">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-purple-950/20 via-black to-purple-950/10 border border-purple-500/25 shadow-2xl text-center space-y-6 max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-600/10 text-purple-400 text-[9px] font-bold tracking-widest uppercase mx-auto">
            🔥 Get Started
          </div>
          
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Create your profile in seconds
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Start discovering opportunities that match your future. Your next opportunity is already out there. PEET helps you find it.
            </p>
            <p className="text-purple-300 font-extrabold text-xs sm:text-sm">
              👉 Join PEET today and start your journey.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => setActivePage("signup")}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-750 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-500/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Join PEET Today
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActivePage("browse")}
                className="px-6 py-3 border border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900 rounded-xl text-xs font-bold hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Browse Listings
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
