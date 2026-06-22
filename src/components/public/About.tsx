"use client";

import React from "react";
import { Shield, Sparkles, Accessibility, Heart, Compass } from "lucide-react";

export const About: React.FC = () => {
  const values = [
    {
      title: "Radical Transparency",
      desc: "No black-box filters. Both seekers and providers see exactly why they matched, including precise skill gap details and metrics.",
      icon: Shield
    },
    {
      title: "AI Alignment",
      desc: "Our matching engine works in harmony with human recruiters, assisting rather than dictating seeker placement.",
      icon: Sparkles
    },
    {
      title: "True Accessibility",
      desc: "A marketplace built for all backgrounds. Our AI Career Assistant provides top-tier coaching tools at zero cost to job seekers.",
      icon: Accessibility
    },
    {
      title: "Cooperative Growth",
      desc: "PEET is not just about placing a seeker today, but mapping out skill courses and growth milestones for tomorrow.",
      icon: Compass
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
      {/* Intro header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Our Mission: Re-engineering <span className="text-gradient">Human Hiring</span>
        </h2>
        <p className="text-zinc-550 text-xs sm:text-sm leading-relaxed">
          Traditional job boards are broken, flooded with irrelevant resumes and cold rejection emails. PEET was founded to establish a collaborative ecosystem where seekers improve their credentials and providers find precise technical fits with zero search fatigue.
        </p>
      </div>

      {/* Stats counter row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { label: "Talents Registered", val: "12,000+" },
          { label: "Vetted Providers", val: "450+" },
          { label: "Matches Made", val: "25,000+" },
          { label: "AI Feedback Score", val: "98.7%" }
        ].map((stat, i) => (
          <div key={i} className="glass-panel rounded-2xl p-5 border border-purple-500/5 space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-gradient">{stat.val}</div>
            <div className="text-[10px] sm:text-xs text-zinc-600 font-bold uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Core Values grid */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="font-extrabold text-xl text-zinc-800 dark:text-zinc-800">Values that Drive Us</h3>
          <p className="text-xs text-zinc-600">Our commitment to seekers and partners alike.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="glass-panel rounded-2xl p-5 border border-purple-500/5 hover:-translate-y-1 duration-300 relative group overflow-hidden"
              >
                {/* Border effect */}
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-700 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-800 mb-2">{v.title}</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
