"use client";

import React, { useState } from "react";
import { User, Briefcase, PlusCircle, CheckCircle, Search, Compass, BookOpen, Trophy } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const [track, setTrack] = useState<"seeker" | "provider">("seeker");

  const seekerSteps = [
    {
      num: "01",
      title: "Sync Your Credentials",
      desc: "Paste your existing bio or input technical tags. Our parsed engine extracts your core capabilities instantly.",
      icon: PlusCircle
    },
    {
      num: "02",
      title: "Audit Live AI Matches",
      desc: "Instantly check your alignment index percentages against active vacancies, highlighting overlapping skills.",
      icon: Search
    },
    {
      num: "03",
      title: "Bridge Your Skill Gaps",
      desc: "Review requested technologies you lack. Click recommended courses to add competencies and boost scores.",
      icon: BookOpen
    },
    {
      num: "04",
      title: "Simulate Interview Prep",
      desc: "Train interactively with the PEET AI interview simulator, receiving direct scorecard critique on responses.",
      icon: Trophy
    }
  ];

  const providerSteps = [
    {
      num: "01",
      title: "Define Technical Parameters",
      desc: "Create a job post and specify required skills, compensation range, and location type filters.",
      icon: PlusCircle
    },
    {
      num: "02",
      title: "Source Ranked Match Scores",
      desc: "Our engine automatically evaluates seeker skill overlap coefficients, ranking applicants by match score.",
      icon: Search
    },
    {
      num: "03",
      title: "Screen Interactive Resumes",
      desc: "Review unified applicant cards showing parsed credentials, ATS markdown resumes, and cover letters.",
      icon: CheckCircle
    },
    {
      num: "04",
      title: "Shortlist & Deploy Offers",
      desc: "Change application status with a click (Applied -> Shortlisted -> Offered), syncs immediately with seekers.",
      icon: Trophy
    }
  ];

  const currentSteps = track === "seeker" ? seekerSteps : providerSteps;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
      {/* Header text */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-3xl font-extrabold tracking-tight">
          How <span className="text-gradient">PEET Transforms</span> Hiring
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">
          Select your perspective below to explore the customized step-by-step pipeline.
        </p>

        {/* Perspective toggle */}
        <div className="inline-flex bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-purple-500/10 mt-4">
          <button
            onClick={() => setTrack("seeker")}
            className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              track === "seeker"
                ? "bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-300 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <User className="w-4 h-4" />
            For Opportunity Seekers
          </button>
          <button
            onClick={() => setTrack("provider")}
            className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              track === "provider"
                ? "bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-300 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            For Opportunity Providers
          </button>
        </div>
      </div>

      {/* Grid Steps list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        {currentSteps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="glass-panel rounded-3xl p-6 border border-purple-500/5 relative group hover:border-purple-500/15 duration-300 space-y-4 flex flex-col justify-between"
            >
              {/* Line indicator */}
              {idx < currentSteps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-[1px] bg-gradient-to-r from-purple-500/30 to-transparent z-10 pointer-events-none"></div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-extrabold text-purple-600/20 dark:text-purple-300/10">
                    {step.num}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{step.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
