"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
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
  Flame,
  Building2,
  Star,
  Plus
} from "lucide-react";



interface HeroProps {
  setActivePage: (page: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActivePage }) => {
  const router = useRouter();
  const { opportunities } = useApp();
  // Mock search tab switcher state
  const [simulatorFilter, setSimulatorFilter] = useState<"all" | "job" | "education" | "training">("all");
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const filteredOpps = simulatorFilter === "all" 
    ? opportunities.slice(0, 6) 
    : opportunities.filter(o => o.type === simulatorFilter).slice(0, 6);

  return (
    <div className="relative z-0 overflow-hidden space-y-16 pb-0">
      {/* 1. HERO SHOWCASE */}
      <section className="relative z-0 bg-black overflow-hidden w-[calc(100%-2rem)] max-w-7xl mx-auto rounded-[2rem] mt-6 pt-20 pb-32 px-8 sm:px-16 lg:px-24">
        {/* Background Video */}
        <video 
          key="/13441273_1920_1080_60fps.mp4"
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-20 opacity-70 "
        >
          <source src="/13441273_1920_1080_60fps.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30 -z-10"></div>

        {/* Text Area */}
        <div className="relative z-10 text-left space-y-8 max-w-3xl">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            Find opportunities <br /> that move your<br />life forward
          </h1>

          <p className="text-white text-lg sm:text-xl leading-relaxed font-medium max-w-xl">
            Discover verified jobs, training programs, scholarships, internships, fellowships, and educational opportunities—all in one place. Stop searching everywhere. Start applying with confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-6">
            <button
              onClick={() => setActivePage("browse")}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-8 py-3.5 bg-black text-white rounded-full text-base font-bold transition-all hover:bg-purple-700 cursor-pointer"
            >
              Explore Opportunities
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActivePage("post-opportunity")}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-8 py-3.5 border border-white/30 bg-white/10 text-white hover:bg-white/20 rounded-full text-base font-bold transition-all cursor-pointer backdrop-blur-sm"
            >
              Post an Opportunity
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
      {/* Rest of the page content in a max-width container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-16 pt-8">
        
        {/* 3. PROBLEM SECTION */}
        <section className="relative py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                Finding real opportunities shouldn’t feel like a <span className="text-purple-600">full-time job.</span>
              </h2>
              <div className="space-y-6 lg:border-l-4 border-purple-500 lg:pl-6">
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Most people waste hours scrolling through scattered websites, social media posts, and outdated listings—only to miss the opportunities that actually matter.
                </p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-200 leading-relaxed">
                  Peet brings everything together in one place, so you can focus on applying, not searching.
                </p>
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/50 dark:border-zinc-800 aspect-[4/5] sm:aspect-video lg:aspect-square group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
              <Image 
                src="/problem_section_image.jpg" 
                alt="Frustrated person searching for opportunities" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </section>

        {/* 4. SOLUTION SECTION */}
        <section className="space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
              Everything You Need, <br className="hidden sm:block"/>In One Platform
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium">
              Peet helps you discover opportunities that match your goals, background, and ambition—whether you're just starting out or leveling up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Job opportunities", desc: "From trusted employers and top startups.", icon: Briefcase, color: "text-blue-500", glow: "group-hover:border-blue-500/50 group-hover:shadow-blue-500/10" },
              { title: "Scholarships", desc: "Academic programs and financial aid.", icon: GraduationCap, color: "text-amber-500", glow: "group-hover:border-amber-500/50 group-hover:shadow-amber-500/10" },
              { title: "Skill training", desc: "Bootcamps and technical courses.", icon: Zap, color: "text-purple-500", glow: "group-hover:border-purple-500/50 group-hover:shadow-purple-500/10" },
              { title: "Internships", desc: "Fellowships and real-world experience.", icon: Users, color: "text-emerald-500", glow: "group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/10" },
              { title: "Local and global", desc: "Opportunities near you and worldwide.", icon: Globe, color: "text-pink-500", glow: "group-hover:border-pink-500/50 group-hover:shadow-pink-500/10" },
              { title: "Fast application", desc: "Simple, streamlined access.", icon: Target, color: "text-red-500", glow: "group-hover:border-red-500/50 group-hover:shadow-red-500/10" },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className={`group p-8 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white/80 dark:hover:bg-zinc-800/80 hover:shadow-2xl transition-all duration-500 ${feature.glow} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center mb-6 border border-zinc-200 dark:border-zinc-700/50 group-hover:scale-110 transition-transform duration-500 ${feature.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 relative z-10">{feature.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-medium relative z-10">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. HOW IT WORKS */}
        <section className="space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
              How Peet Works
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium">
              Three simple steps to unlock your next big opportunity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Discover", desc: "Browse curated opportunities tailored to your goals.", image: "/119319.jpg" },
              { step: "02", title: "Choose", desc: "Filter by category, location, or skill level.", image: "/1219.jpg" },
              { step: "03", title: "Apply", desc: "Apply directly and track your progress in one place.", image: "/44942.jpg" },
            ].map((s, i) => {
              return (
                <div key={i} className="group relative flex flex-col rounded-[2.5rem] bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                    <Image 
                      src={s.image} 
                      alt={s.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6 z-20 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-extrabold flex items-center justify-center text-xl shadow-2xl">
                      {s.step}
                    </div>
                  </div>
                  <div className="p-8 relative z-20 -mt-12 bg-white dark:bg-zinc-950 rounded-[2.5rem] mx-2 mb-2 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-transform duration-500 group-hover:-translate-y-2">
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">{s.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed font-medium">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. FEATURE HIGHLIGHTS */}
        <section className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="order-2 lg:order-1 relative group w-full max-w-md mx-auto lg:max-w-none">
              {/* Dynamic Abstract App Preview */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-blue-500/10 to-transparent blur-3xl rounded-full group-hover:scale-110 transition-transform duration-700"></div>
              
              <div className="relative w-full rounded-[2.5rem] border border-white/40 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 overflow-hidden">
                {/* App Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <Search className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <div className="w-28 h-3 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
                      <div className="w-16 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                </div>

                {/* App Cards */}
                <div className="space-y-4">
                  <div className="w-full bg-white dark:bg-zinc-950 p-5 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800/60 flex items-start gap-4 transition-transform duration-500 group-hover:translate-x-2">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                      <Briefcase className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="space-y-2.5 w-full pt-1.5">
                      <div className="w-3/4 h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
                      <div className="w-1/2 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-white dark:bg-zinc-950 p-5 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800/60 flex items-start gap-4 transition-transform duration-500 group-hover:translate-x-4 delay-75">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="space-y-2.5 w-full pt-1.5">
                      <div className="w-2/3 h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
                      <div className="w-1/3 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
                    </div>
                  </div>

                  <div className="w-full bg-white dark:bg-zinc-950 p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.02)] border border-purple-100 dark:border-purple-900/30 flex items-start gap-4 transition-transform duration-500 group-hover:translate-x-6 delay-150 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0 relative z-10">
                      <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="space-y-2.5 w-full pt-1.5 relative z-10">
                      <div className="w-full h-3 bg-purple-200 dark:bg-purple-800/50 rounded-full"></div>
                      <div className="w-2/3 h-2 bg-purple-100 dark:bg-purple-900/50 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Floating Notification Match */}
                <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 bg-zinc-900 text-white text-sm font-bold px-5 py-3 rounded-full shadow-2xl shadow-purple-500/30 flex items-center gap-2 transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-300">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Perfect Match
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 leading-tight">
                  Built for People <br />Who Want More
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium">
                  We engineered Peet to eliminate the noise and surface only what matters to your specific journey.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {[
                  { text: "Smart opportunity discovery", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
                  { text: "Clean, distraction-free interface", icon: Compass, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
                  { text: "Verified listings only", icon: Check, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                  { text: "Personalized recommendations", icon: Target, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
                  { text: "Save and track opportunities", icon: BookOpen, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-500/10" },
                ].map((item, i) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-4 group cursor-default">
                      <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <ItemIcon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <span className="text-lg text-zinc-800 dark:text-zinc-200 font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 7. FOR ORGANIZATIONS */}
        <section className="relative overflow-hidden rounded-[3rem] bg-zinc-950 text-white p-8 sm:p-12 lg:p-20 text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest border border-white/20 backdrop-blur-md">
              <Building2 className="w-3.5 h-3.5" />
              For Organizations
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight break-words">
              Have Opportunities to Share?
            </h2>
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
              Schools, companies, training centers, and organizations can post opportunities directly on Peet and reach thousands of motivated users.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setActivePage("post-opportunity")}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 sm:px-8 sm:py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-base sm:text-lg font-bold transition-all duration-300 shadow-lg shadow-purple-600/25 hover:-translate-y-1 cursor-pointer w-full sm:w-auto"
              >
                <Plus className="w-5 h-5 shrink-0" />
                <span className="whitespace-nowrap">Post Opportunity</span>
              </button>
            </div>
          </div>
        </section>

        {/* 8. IMPACT / VISION SECTION */}
        <section className="py-24 text-center px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
              Opportunity Shouldn’t Be Hard to Find. <br className="hidden md:block"/>It Should Find You.
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium max-w-3xl mx-auto">
              Peet exists to close the gap between ambition and access—so that anyone, anywhere, can discover the right opportunity at the right time.
            </p>
          </div>
        </section>

        {/* 9. TESTIMONIALS */}
        <section className="space-y-16 pb-20 pt-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
              People Are Already Finding <br className="hidden sm:block"/>Their Next Step
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium">
              Don't just take our word for it. Here's what our early users are experiencing.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-[2.5rem]">
              <div 
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]" 
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {[
                  { quote: "I found my internship in less than a week. The platform removed all the usual noise and frustration.", name: "Sarah J.", role: "Student", color: "from-blue-500 to-cyan-500", image: "https://i.pravatar.cc/150?u=sarah" },
                  { quote: "Finally a platform that doesn’t waste my time. The curated opportunities are incredibly high quality.", name: "Marcus T.", role: "Software Engineer", color: "from-purple-500 to-indigo-500", image: "https://i.pravatar.cc/150?u=marcus" },
                  { quote: "Everything I needed was in one place. I successfully transitioned to a new career without opening 50 tabs.", name: "Elena R.", role: "Career Switcher", color: "from-amber-500 to-orange-500", image: "https://i.pravatar.cc/150?u=elena" }
                ].map((testimonial, i) => (
                  <div key={i} className="w-full shrink-0 p-4">
                    <div className={`group p-8 sm:p-12 rounded-[2.5rem] bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 relative flex flex-col hover:shadow-2xl transition-all duration-500 overflow-hidden h-full`}>
                      {/* Background Gradient Glow */}
                      <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${testimonial.color} opacity-5 dark:opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity duration-500`}></div>
                      
                      {/* Decorative Quote Mark */}
                      <div className="absolute -top-4 -left-2 text-[140px] font-serif text-zinc-100 dark:text-zinc-800/50 leading-none select-none z-0 group-hover:text-purple-100 dark:group-hover:text-purple-900/20 transition-colors duration-500">
                        "
                      </div>

                      <div className="relative z-10 flex flex-col h-full items-center text-center">
                        <div className="flex gap-1 mb-8">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} className="w-6 h-6 fill-amber-400 text-amber-400 drop-shadow-sm" />
                          ))}
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-zinc-100 leading-relaxed mb-12 max-w-2xl">
                          "{testimonial.quote}"
                        </p>
                        <div className="flex flex-col items-center gap-4 mt-auto">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-2xl object-cover shadow-lg shadow-black/10 transform group-hover:scale-110 transition-transform duration-500 border-2 border-white dark:border-zinc-800"
                          />
                          <div>
                            <div className="font-bold text-xl text-zinc-900 dark:text-white">{testimonial.name}</div>
                            <div className="text-zinc-500 dark:text-zinc-400 font-medium">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-6 mt-6">
              <button 
                onClick={() => setActiveTestimonial(prev => Math.max(0, prev - 1))}
                className={`p-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md transition-all duration-300 ${activeTestimonial === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 hover:border-purple-200 dark:hover:border-purple-800'}`}
                disabled={activeTestimonial === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-3">
                {[0, 1, 2].map((i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveTestimonial(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${activeTestimonial === i ? 'w-8 bg-purple-600' : 'w-2.5 bg-zinc-300 dark:bg-zinc-700 hover:bg-purple-400'}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={() => setActiveTestimonial(prev => Math.min(2, prev + 1))}
                className={`p-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md transition-all duration-300 ${activeTestimonial === 2 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 hover:border-purple-200 dark:hover:border-purple-800'}`}
                disabled={activeTestimonial === 2}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* 10. FINAL CTA SECTION */}
        <section className="relative overflow-hidden rounded-[3rem] bg-purple-600 text-white p-8 sm:p-16 lg:p-24 text-center shadow-2xl mb-12">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6 sm:space-y-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight break-words">
              Your Next Opportunity Is Waiting.
            </h2>
            <p className="text-lg sm:text-xl text-purple-100 font-medium max-w-lg mx-auto">
              Don’t just search. Discover what’s meant for you.
            </p>
            <div className="pt-4 sm:pt-6">
              <button
                onClick={() => setActivePage("explore")}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 sm:px-10 sm:py-5 bg-white text-purple-600 hover:bg-purple-50 rounded-full text-lg sm:text-xl font-bold transition-all duration-300 shadow-xl shadow-black/10 hover:-translate-y-1 hover:shadow-2xl cursor-pointer w-full sm:w-auto"
              >
                <span className="whitespace-nowrap">Start Exploring</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
