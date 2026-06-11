"use client";

import React from "react";
import { AiCoachTab } from "@/components/AiCoachTab";
import { Sparkles, ArrowRight } from "lucide-react";

interface AiSuitePageProps {
  setActivePage: (page: string) => void;
}

export const AiSuitePage: React.FC<AiSuitePageProps> = ({ setActivePage }) => {
  return (
    <div className="space-y-6 pt-6">
      {/* Visual Header */}
      <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
        <div className="inline-flex items-center gap-1 bg-purple-600/10 text-purple-400 px-2.5 py-1 rounded text-[10px] font-bold border border-purple-500/10 uppercase tracking-widest animate-pulse">
          <Sparkles className="w-3 h-3 fill-purple-400" />
          Interactive Product sandbox
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          PEET <span className="text-gradient">AI Career Suite</span>
        </h2>
        <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
          Test drive our CV graders, cover letter generators, coaching chatbot, and mock interview trainers directly below.
        </p>
      </div>

      {/* Actual functional coach tab */}
      <AiCoachTab />

      {/* Bottom CTA to sign up */}
      <div className="max-w-4xl mx-auto px-4 pb-8 pt-4 text-center space-y-4">
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
          <h3 className="font-extrabold text-sm text-white">Save Your Generated Documents</h3>
          <p className="text-xs text-zinc-550 max-w-md mx-auto leading-relaxed">
            Create an account to download your documents as PDF/ATS formats, sync them to your search profile, and receive automated job alerts matching your skills.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setActivePage("signup")}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-750 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm shadow-purple-500/10"
            >
              Save Progress & Register
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
