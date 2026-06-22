"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence, type Variants } from "framer-motion";
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

const cardContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
    },
  },
};

interface HeroProps {
  setActivePage: (page: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActivePage }) => {
  const router = useRouter();
  const { opportunities } = useApp();
  // Mock search tab switcher state
  const [simulatorFilter, setSimulatorFilter] = useState<"all" | "job" | "education" | "training">("all");

  const filteredOpps = simulatorFilter === "all" 
    ? opportunities.slice(0, 6) 
    : opportunities.filter(o => o.type === simulatorFilter).slice(0, 6);

  return (
    <div className="relative z-0 overflow-hidden space-y-28 pb-6">
      {/* Premium Floating Ambient Background Orbs */}
      <motion.div
        className="absolute top-[5%] left-[5%] w-[450px] h-[450px] bg-gradient-to-tr from-purple-500/10 to-indigo-500/10 blur-[130px] rounded-full pointer-events-none -z-20"
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 40, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-[35%] right-[5%] w-[550px] h-[550px] bg-gradient-to-br from-blue-500/8 to-emerald-500/8 blur-[140px] rounded-full pointer-events-none -z-20"
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 50, -50, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-[70%] left-[15%] w-[500px] h-[500px] bg-gradient-to-tr from-pink-500/8 to-amber-500/8 blur-[135px] rounded-full pointer-events-none -z-20"
        animate={{
          x: [0, 40, -40, 0],
          y: [0, 60, -30, 0],
          scale: [1, 1.12, 0.93, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* 1. HERO SHOWCASE */}
      <section className="relative z-0 overflow-hidden w-full pt-10 md:pt-16 pb-16 border-b border-purple-100/30">
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-650/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse"></div>

        {/* Inner container to restrict width of layout content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Text Area */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-7 space-y-6 text-center lg:text-left"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-purple-600/10 text-purple-700 border border-purple-200/50 text-xs sm:text-sm font-bold tracking-wide uppercase mx-auto lg:mx-0 shadow-sm backdrop-blur-sm transition-colors duration-300"
          >
            <Compass className="w-4 h-4 text-purple-650" />
            <span>Find your next opportunity. All in one place.</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-zinc-900 dark:text-white"
          >
            The unified platform for <span className="text-gradient">work</span>, <span className="text-gradient">education</span>, and <span className="text-gradient">growth</span>.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-xl text-zinc-600 dark:text-zinc-600 text-sm sm:text-base lg:text-lg leading-relaxed font-medium mx-auto lg:mx-0"
          >
            PEET is where ambition meets opportunity. Whether you're looking for a job, internship, apprenticeship, or training program — PEET brings everything together in one powerful search experience.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActivePage("signup")}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-3 bg-purple-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-500/25 cursor-pointer"
            >
              Get Started
              <ChevronRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActivePage("browse")}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-3 border border-zinc-200 bg-zinc-100/50 text-zinc-600 dark:text-zinc-600 hover:bg-zinc-100 rounded-xl text-sm font-bold transition-all cursor-pointer"
            >
              Browse Opportunities
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Floating Logo Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 relative w-full max-w-sm mx-auto"
        >
          <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-full -z-10 animate-pulse"></div>
          
          {/* Main Showcase Circle */}
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, 2, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{ scale: 1.025, rotate: 1 }}
            className="glass-panel border border-purple-200/50 rounded-full overflow-hidden shadow-2xl relative aspect-square w-full z-10"
          >
            <Image
              src="/119319.jpg"
              alt="PEET Platform Logo"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </motion.div>

          {/* Floating Circle 1 - Top Left */}
          <motion.div
            animate={{
              y: [-8, 8, -8],
              x: [-4, 4, -4]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{ scale: 1.08, zIndex: 30 }}
            className="absolute -top-8 -left-8 w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden z-20 cursor-pointer"
          >
            <Image
              src="/1219.jpg"
              alt="Floating bubble 1"
              fill
              style={{ objectFit: "cover" }}
            />
          </motion.div>

          {/* Floating Circle 2 - Bottom Right */}
          <motion.div
            animate={{
              y: [8, -8, 8],
              x: [4, -4, 4]
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{ scale: 1.08, zIndex: 30 }}
            className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden z-20 cursor-pointer"
          >
            <Image
              src="/44942.jpg"
              alt="Floating bubble 2"
              fill
              style={{ objectFit: "cover" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>

      {/* Rest of the page content in a max-width container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28 pb-12">
        {/* 2. WHAT IS PEET? */}
        <section className="space-y-10 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto space-y-3.5"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-600/10 text-purple-700 text-xs sm:text-sm font-bold tracking-wide uppercase border border-purple-200/50 backdrop-blur-sm shadow-sm">
               What is PEET?
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              A Smart Opportunity Ecosystem
            </h2>
            <p className="text-zinc-650 dark:text-zinc-650 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Discover diverse, curated pathways tailored to your career goals, skillset, and location, all unified in one seamless discovery platform.
            </p>
          </motion.div>

          <motion.div 
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
          >
            {/* Decorative subtle background glows */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>
            <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>

            {[
              {
                title: "Jobs",
                desc: "Tech, remote, part-time, and full-time positions designed to accelerate your growth.",
                icon: Briefcase,
                color: "text-blue-650 bg-blue-600/10 border-blue-200/30",
                hoverColor: "hover:shadow-blue-500/10 hover:border-blue-300/50 group-hover:text-blue-700",
                badge: "Employment"
              },
              {
                title: "Internships",
                desc: "Hands-on projects and apprentice programs to build crucial real-world experience.",
                icon: Users,
                color: "text-purple-650 bg-purple-650/10 border-purple-200/30",
                hoverColor: "hover:shadow-purple-500/10 hover:border-purple-300/50 group-hover:text-purple-800",
                badge: "Experiential"
              },
              {
                title: "Courses & Training",
                desc: "Structured learning paths, professional certifications, and technical bootcamps.",
                icon: BookOpen,
                color: "text-emerald-650 bg-emerald-650/10 border-emerald-200/30",
                hoverColor: "hover:shadow-emerald-500/10 hover:border-emerald-300/50 group-hover:text-emerald-750",
                badge: "Education"
              },
              {
                title: "Pathways & Funding",
                desc: "Scholarships, transition aids, and customized step-by-step career roadmaps.",
                icon: Target,
                color: "text-amber-650 bg-amber-650/10 border-amber-200/30",
                hoverColor: "hover:shadow-amber-500/10 hover:border-amber-300/50 group-hover:text-amber-750",
                badge: "Support"
              }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`group glass-panel rounded-2xl p-6 space-y-5 transition-all duration-300 hover:shadow-xl hover:bg-white/85 border border-purple-100/30 cursor-pointer flex flex-col justify-between ${item.hoverColor}`}
                  onClick={() => setActivePage("browse")}
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon and subtle pill badge */}
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 px-2 py-0.5 rounded-md bg-zinc-100/80 border border-zinc-200/50">
                        {item.badge}
                      </span>
                    </div>
                    
                    {/* Title & Description */}
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-lg text-zinc-900 transition-colors group-hover:text-purple-950">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-semibold">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Interactive bottom link indicator */}
                  <div className="pt-2 flex items-center gap-1 text-xs font-bold text-zinc-500 group-hover:text-purple-650 transition-colors">
                    <span>Explore opportunities</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-200" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>      {/* 3. SEARCH SMARTER, NOT HARDER */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
        {/* Decorative background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        {/* Left Explanation */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-600/10 text-purple-700 text-xs sm:text-sm font-bold tracking-wide uppercase border border-purple-200/50 backdrop-blur-sm shadow-sm">
             Search Smarter, Not Harder
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
            Stop searching everywhere. Let PEET do the opposite.
          </h2>
          <p className="text-zinc-650 dark:text-zinc-650 text-sm sm:text-base leading-relaxed">
            Traditional platforms force you to search everywhere. PEET does the opposite. It’s not just search — it’s guided discovery.
          </p>

          <ul className="space-y-4">
            {[
              "Search across multiple opportunity types at once",
              "Filter by skill level, location, and interest",
              "Discover opportunities you didn’t even know existed"
            ].map((text, idx) => (
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                key={idx} 
                className="flex items-center gap-3"
              >
                <div className="w-5.5 h-5.5 rounded-full bg-purple-600/10 border border-purple-200/50 flex items-center justify-center text-purple-650 shrink-0 shadow-sm">
                  <Check className="w-3.5 h-3.5 font-black" />
                </div>
                <span className="text-sm sm:text-base text-zinc-650 font-semibold">{text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right Live Search Preview Tool */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-purple-200/30 shadow-2xl space-y-5 bg-white/40 backdrop-blur-md"
        >
          <div className="flex justify-between items-center flex-wrap gap-3 pb-3 border-b border-purple-100/20">
            <span className="text-xs font-extrabold text-purple-950 uppercase tracking-widest">
              Unified Search Simulator
            </span>
            <div className="flex bg-zinc-100/80 p-1 rounded-xl border border-purple-100/50 gap-1 shadow-sm relative">
              {[
                { id: "all", label: "All" },
                { id: "job", label: "Jobs" },
                { id: "education", label: "Education" },
                { id: "training", label: "Training" }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setSimulatorFilter(btn.id as any)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-extrabold transition-colors duration-200 cursor-pointer z-10 ${
                    simulatorFilter === btn.id
                      ? "text-white"
                      : "text-zinc-550 hover:text-purple-650"
                  }`}
                >
                  {btn.label}
                  {simulatorFilter === btn.id && (
                    <motion.div
                      layoutId="activeSimulatorTab"
                      className="absolute inset-0 bg-purple-600 rounded-lg shadow-md shadow-purple-500/20 -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* List of Simulated results */}
          <motion.div 
            layout
            className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1"
          >
            <AnimatePresence mode="popLayout">
              {filteredOpps.map((opp) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  key={opp.id} 
                  onClick={() => router.push(`/browse?jobId=${opp.id}`)}
                  className="p-3.5 bg-white/50 border border-purple-100/20 hover:border-purple-200/50 hover:bg-white/90 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl flex justify-between items-center gap-4 cursor-pointer group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm text-zinc-900 truncate group-hover:text-purple-650 transition-colors">{opp.title}</h4>
                      <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border ${
                        opp.type === "education"
                          ? "bg-emerald-500/10 text-emerald-700 border-emerald-200/20"
                          : opp.type === "training"
                          ? "bg-amber-500/10 text-amber-700 border-amber-200/20"
                          : "bg-blue-500/10 text-blue-700 border-blue-200/20"
                      }`}>
                        {opp.type}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500 block truncate mt-1">
                      {opp.provider} • {opp.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs sm:text-sm font-extrabold text-purple-750 shrink-0">
                      {opp.salaryOrCost}
                    </span>
                    <div className="w-7 h-7 rounded-xl bg-purple-500/5 group-hover:bg-purple-600/10 flex items-center justify-center transition-colors">
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-650 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </section>

      {/* 4. BUILT FOR EVERYONE */}
      <section className="space-y-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 blur-[130px] rounded-full pointer-events-none -z-10"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-xl mx-auto space-y-3.5"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-600/10 text-purple-700 text-xs sm:text-sm font-bold tracking-wide uppercase border border-purple-200/50 backdrop-blur-sm shadow-sm">
             Built for Everyone
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Adapts To Your Specific Journey
          </h2>
          <p className="text-zinc-650 dark:text-zinc-650 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            No matter where you stand in your professional development, PEET structures opportunities to match your milestones.
          </p>
        </motion.div>

        <motion.div 
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { 
              persona: "The Student", 
              desc: "Find your first internship or apprenticeship to apply classroom insights.", 
              role: "Internships & Scholarships",
              icon: GraduationCap,
              style: "hover:border-blue-300 hover:shadow-blue-500/5 bg-gradient-to-br from-blue-500/5 to-cyan-500/5",
              iconStyle: "text-blue-650 bg-blue-100/50 border-blue-200/30"
            },
            { 
              persona: "The Graduate", 
              desc: "Search for entry-level positions to kickstart your career with top employers.", 
              role: "Graduate Careers",
              icon: Briefcase,
              style: "hover:border-indigo-300 hover:shadow-indigo-500/5 bg-gradient-to-br from-indigo-500/5 to-purple-500/5",
              iconStyle: "text-indigo-650 bg-indigo-100/50 border-indigo-200/30"
            },
            { 
              persona: "The Professional", 
              desc: "Ready for switches and lateral career transitions with confidence.", 
              role: "Lateral Roles",
              icon: TrendingUp,
              style: "hover:border-purple-300 hover:shadow-purple-500/5 bg-gradient-to-br from-purple-500/5 to-pink-500/5",
              iconStyle: "text-purple-650 bg-purple-100/50 border-purple-200/30"
            },
            { 
              persona: "The Learner", 
              desc: "Upgrade your skills through bootcamps, courses, and certifications.", 
              role: "Courses & Training",
              icon: BookOpen,
              style: "hover:border-amber-300 hover:shadow-amber-500/5 bg-gradient-to-br from-amber-500/5 to-orange-500/5",
              iconStyle: "text-amber-650 bg-amber-100/50 border-amber-200/30"
            }
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div 
                key={i} 
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`group glass-panel rounded-2xl p-6 flex flex-col justify-between h-48 border border-purple-100/20 hover:shadow-xl transition-all duration-300 bg-white/30 backdrop-blur-md cursor-pointer ${card.style}`}
                onClick={() => setActivePage("browse")}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${card.iconStyle}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 px-2 py-0.5 rounded-md bg-zinc-150 border border-zinc-250">
                      {card.role}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-base text-zinc-900 group-hover:text-purple-950 transition-colors pt-1">{card.persona}</h4>
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-semibold">{card.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center pt-2"
        >
          <span className="text-gradient font-bold text-sm">PEET adapts to your journey.</span>
        </motion.div>
      </section>

      {/* 5. WHY PEET? */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-visible">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        
        {/* Left Column: Product Showcase Screenshot */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-6 relative [perspective:1000px]"
        >
          <div className="absolute -inset-2 bg-gradient-to-tr from-purple-500/10 to-indigo-500/10 rounded-3xl blur-xl opacity-80 -z-10"></div>
          <motion.div 
            whileHover={{ rotateY: -8, rotateX: 4, scale: 1.025, zIndex: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass-panel border border-purple-200/40 rounded-3xl overflow-hidden shadow-2xl relative aspect-[16/10] w-full z-10 cursor-pointer"
          >
            <Image
              src="/peet_hero_showcase.png"
              alt="PEET Platform Opportunities Feed"
              fill
              style={{ objectFit: "cover" }}
            />
          </motion.div>
        </motion.div>

        {/* Right Column: Why PEET Content */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-6 space-y-6"
        >
          <div className="space-y-3.5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-600/10 text-purple-700 text-xs sm:text-sm font-bold tracking-wide uppercase border border-purple-200/50 backdrop-blur-sm shadow-sm mx-auto lg:mx-0">
              ⚡ Why PEET?
            </div>
            <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Built for Speed and Clarity
            </h3>
            <p className="text-sm sm:text-base text-zinc-650 font-medium leading-relaxed">
              Stop wasting time searching dozens of websites. Start progressing with a unified hub.
            </p>
          </div>

          <div className="space-y-3">
            {[
              "One unified platform for all career and training opportunities",
              "AI-powered recommendations based on your goals and profile",
              "Real-time opportunities with direct feedback listings",
              "Clean, simple, distraction-free application environment",
              "Built to accelerate your career transition stages"
            ].map((benefit, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                whileHover={{ scale: 1.015, x: 3 }}
                key={i} 
                className="flex items-center gap-3 bg-white/40 border border-purple-100/10 hover:border-purple-200/30 p-3.5 rounded-2xl transition-all shadow-sm cursor-default"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-600/10 border border-purple-200/50 flex items-center justify-center shrink-0 text-purple-650 shadow-sm">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-zinc-700">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 5.5 AI CAREER COACH SHOWCASE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-visible">
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        
        {/* Left Column: AI Coach Content */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-6 space-y-6 order-2 lg:order-1"
        >
          <div className="space-y-3.5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-600/10 text-purple-700 text-xs sm:text-sm font-bold tracking-wide uppercase border border-purple-200/50 backdrop-blur-sm shadow-sm mx-auto lg:mx-0">
               AI Career Suite
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
              A Personal AI Advisor in Your Pocket
            </h3>
            <p className="text-zinc-650 text-sm sm:text-base leading-relaxed">
              PEET features an advanced AI Career Coach that acts as your private guide. Analyze your CV, receive custom resume optimization tips, and get step-by-step guidance on how to land your dream opportunities.
            </p>
          </div>

          <ul className="space-y-4">
            {[
              "Upload your CV for immediate, actionable feedback",
              "Generate customized cover letters for any listing in one click",
              "Analyze skill gaps and plan target certifications"
            ].map((text, idx) => (
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                key={idx} 
                className="flex items-center gap-3"
              >
                <div className="w-5.5 h-5.5 rounded-full bg-purple-600/10 border border-purple-200/50 flex items-center justify-center text-purple-650 shrink-0 shadow-sm">
                  <Check className="w-3.5 h-3.5 font-bold" />
                </div>
                <span className="text-sm sm:text-base text-zinc-650 font-semibold">{text}</span>
              </motion.li>
            ))}
          </ul>

          <div className="pt-2 flex justify-center lg:justify-start">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActivePage("ai-suite")}
              className="flex items-center gap-1.5 px-6 py-3 bg-purple-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-purple-500/20 hover:bg-purple-700 cursor-pointer"
            >
              <span>Explore AI Career Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Right Column: AI Coach Mockup */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-6 relative order-1 lg:order-2 [perspective:1000px]"
        >
          <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-80 -z-10"></div>
          <motion.div 
            whileHover={{ rotateY: 8, rotateX: 4, scale: 1.025, zIndex: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass-panel border border-purple-200/40 rounded-3xl overflow-hidden shadow-2xl relative aspect-[16/10] w-full z-10 cursor-pointer"
          >
            <Image
              src="/ai_career_coach_visual.png"
              alt="PEET AI Career Coach Interface"
              fill
              style={{ objectFit: "cover" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* 6. YOUR CAREER, YOUR PATH */}
      <section className="space-y-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-xl mx-auto space-y-3.5"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-600/10 text-purple-700 text-xs sm:text-sm font-bold tracking-wide uppercase border border-purple-200/50 backdrop-blur-sm shadow-sm">
             Your Career, Your Path
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            A Connected Network of Possibilities
          </h2>
          <p className="text-zinc-650 dark:text-zinc-650 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            Your future is not one straight line — it’s a network of possibilities. PEET helps you navigate it.
          </p>
        </motion.div>

        {/* Pathway Flowchart */}
        <div className="max-w-5xl mx-auto py-8 relative">
          {/* Connector Line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.15 }}
            style={{ originX: 0 }}
            className="hidden md:block absolute top-[52px] left-20 right-20 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 -z-10 opacity-30"
          />

          <motion.div 
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch relative z-10"
          >
            {[
              { label: "Learning", detail: "Courses & Academics", desc: "Build fundamental knowledge through university courses, structured degrees, and online training.", color: "from-blue-600 to-indigo-500", icon: BookOpen },
              { label: "Training", detail: "Bootcamps & Practice", desc: "Gain hands-on skills with intense bootcamps, workshops, and technical certifications.", color: "from-indigo-500 to-purple-650", icon: Zap },
              { label: "Employment", detail: "Jobs & Placements", desc: "Access curated listings to secure internships, apprenticeships, or full-time career roles.", color: "from-purple-650 to-pink-500", icon: Briefcase },
              { label: "Growth", detail: "Promotions & Upskilling", desc: "Level up your career with custom upskilling recommendations and continuous tracking.", color: "from-pink-500 to-amber-500", icon: TrendingUp }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative group flex flex-col justify-between">
                  <motion.div 
                    variants={cardVariants}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="glass-panel rounded-2xl p-6 space-y-4 bg-white/45 border border-purple-100/20 hover:shadow-xl hover:bg-white/85 hover:border-purple-200/50 transition-all duration-300 flex-1 flex flex-col items-center text-center cursor-pointer"
                  >
                    {/* Number & Icon Overlay */}
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${step.color} flex items-center justify-center text-white font-extrabold text-sm shadow-md`}>
                        {idx + 1}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-purple-100/50 flex items-center justify-center text-purple-650 shadow-sm">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="space-y-2 text-center pt-2">
                      <h4 className="font-extrabold text-lg text-zinc-900 transition-colors group-hover:text-purple-950">{step.label}</h4>
                      <p className="text-xs text-purple-650 font-extrabold tracking-wide uppercase">{step.detail}</p>
                      <p className="text-xs sm:text-sm text-zinc-650 leading-relaxed font-semibold">{step.desc}</p>
                    </div>
                  </motion.div>

                  {/* Flow indicator arrow on desktop */}
                  {idx < 3 && (
                    <div className="hidden md:flex absolute top-[36px] -right-4.5 z-20 items-center justify-center">
                      <motion.div 
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="w-8 h-8 rounded-full bg-white border border-purple-100/50 flex items-center justify-center shadow-md"
                      >
                        <ArrowRight className="w-4 h-4 text-purple-650" />
                      </motion.div>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center pt-2"
        >
          <span className="text-gradient font-bold text-sm">We connect every step.</span>
        </motion.div>
      </section>

      {/* 7. FIRE GET STARTED ACTION BANNER */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="pb-8"
      >
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-purple-600 via-indigo-650 to-purple-750 border border-purple-400/50 shadow-2xl text-center space-y-6 max-w-4xl mx-auto relative overflow-hidden">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:16px_16px]"></div>
          {/* Glowing backdrop circle */}
          <motion.div 
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 blur-2xl rounded-full pointer-events-none"
          />
          
          <div className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold tracking-wide uppercase border border-white/20 shadow-sm mx-auto backdrop-blur-sm relative z-10">
             Get Started
          </div>
          
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Create your profile in seconds
            </h2>
            <p className="text-purple-100 text-sm sm:text-base max-w-md mx-auto leading-relaxed font-semibold">
              Start discovering opportunities that match your future. Your next opportunity is already out there. PEET helps you find it.
            </p>
            <p className="text-cyan-300 font-extrabold text-sm sm:text-base animate-pulse">
               Join PEET today and start your journey.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4.5 items-center">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActivePage("signup")}
                className="w-full sm:w-auto px-7 py-3 bg-white text-purple-700 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 shadow-xl hover:bg-zinc-50 transition-all duration-200 cursor-pointer"
              >
                Join PEET Today
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActivePage("browse")}
                className="w-full sm:w-auto px-7 py-3 border border-white/35 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer backdrop-blur-sm"
              >
                Browse Listings
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>
      </div>
    </div>
  );
};

