"use client";

import React from "react";
import { Shield, Sparkles, Accessibility, Heart, Compass, Target, Zap, Users } from "lucide-react";

export const About: React.FC = () => {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-widest border border-purple-200/50 dark:border-purple-800/50">
          <Sparkles className="w-3.5 h-3.5" />
          What is PEET?
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
          Re-engineering <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">
            Human Hiring
          </span>
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Traditional job boards are broken, flooded with irrelevant resumes and cold rejection emails. PEET was founded to establish a collaborative ecosystem where seekers improve their credentials and providers find precise technical fits with zero search fatigue.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        
        {/* Large Feature Card */}
        <div className="md:col-span-2 group relative p-8 sm:p-10 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
            <Target className="w-48 h-48 text-purple-600" />
          </div>
          <div className="relative z-10 space-y-6 max-w-md">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-black shadow-sm flex items-center justify-center border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition-transform duration-500">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Radical Transparency</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
              No black-box filters. Both seekers and providers see exactly why they matched, including precise skill gap details and metrics. We believe clarity breeds opportunity.
            </p>
          </div>
        </div>

        {/* Tall Stats Card */}
        <div className="md:col-span-1 md:row-span-2 group relative p-8 rounded-[2rem] bg-gradient-to-br from-purple-600 to-purple-900 text-white overflow-hidden shadow-xl hover:shadow-purple-500/30 transition-all duration-500 flex flex-col justify-between">
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-500"></div>
          <div className="relative z-10 space-y-4 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">The Ecosystem</h3>
            <p className="text-purple-100 leading-relaxed text-sm">
              A thriving marketplace built for all backgrounds.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="space-y-1">
              <div className="text-4xl font-extrabold tracking-tight">12,000+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-200">Talents Registered</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-extrabold tracking-tight">25,000+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-200">Matches Made</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-extrabold tracking-tight">98.7%</div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-200">AI Feedback Score</div>
            </div>
          </div>
        </div>

        {/* Medium Feature Card 1 */}
        <div className="group p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-500">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black shadow-sm flex items-center justify-center mb-6 border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition-transform duration-500">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">AI Alignment</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            Our engine works in harmony with human recruiters, assisting rather than dictating placement.
          </p>
        </div>

        {/* Medium Feature Card 2 */}
        <div className="group p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-500">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black shadow-sm flex items-center justify-center mb-6 border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition-transform duration-500">
            <Compass className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">Cooperative Growth</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            Not just placing you today, but mapping out skill courses and milestones for tomorrow.
          </p>
        </div>

      </div>
    </section>
  );
};
