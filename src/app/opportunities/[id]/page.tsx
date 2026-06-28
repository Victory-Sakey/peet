"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp, Opportunity } from "@/context/AppContext";
import { OpportunityIcon } from "@/components/OpportunityIcon";
import { Navbar } from "@/components/Navbar";
import { Sparkles, Check, ChevronRight, X, ArrowLeft } from "lucide-react";

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { opportunities, seekerProfile, applyToJob, applications } = useApp();
  
  const id = params?.id as string;
  const [selectedJob, setSelectedJob] = useState<Opportunity | null>(null);
  const [coverLetterText, setCoverLetterText] = useState("");
  const [cvFileName, setCvFileName] = useState("Alex_Mercer_CV.pdf");
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (id && opportunities.length > 0) {
      const opp = opportunities.find((o) => o.id === id);
      if (opp) {
        setSelectedJob(opp);
        // Pre-fill cover letter
        if (opp.type === "job") {
          setCoverLetterText(
            `Dear Hiring Team at ${opp.provider},\n\nI am writing to express my strong interest in the ${opp.title} position. As a ${seekerProfile.title} skilled in ${seekerProfile.skills.slice(0, 4).join(", ")}, I am excited about the opportunity to contribute to your projects.\n\nThank you for your time and consideration.`
          );
        } else {
          setCoverLetterText(
            `Hello Admissions Team,\n\nI am highly interested in enrolling/participating in the ${opp.title} program offered by ${opp.provider}. I want to bridge my technical skill gaps and develop practical competencies. Please review my profile and skills portfolio.\n\nBest regards,\n${seekerProfile.name}`
          );
        }
      }
    }
    // Artificial small delay to avoid harsh flash
    const timer = setTimeout(() => setIsInitializing(false), 300);
    return () => clearTimeout(timer);
  }, [id, opportunities, seekerProfile]);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    applyToJob(selectedJob.id, cvFileName, coverLetterText);
    setAppliedSuccess(true);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!selectedJob) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="glass-panel p-8 rounded-[2rem] max-w-md w-full border border-zinc-200 dark:border-zinc-800 space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Opportunity Not Found</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            This opportunity might have expired, or it is no longer available in your current session cache. Please perform a new search to find live opportunities.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-purple-500/20"
          >
            Return to Search
          </button>
        </div>
      </div>
    );
  }

  const score = Math.min(100, Math.max(10, Math.floor((selectedJob.skills.filter((s) => seekerProfile.skills.map((ps) => ps.toLowerCase()).includes(s.toLowerCase())).length / Math.max(selectedJob.skills.length, 1)) * 100) + 15));
  
  const matchedSkills = selectedJob.skills.filter((s) =>
    seekerProfile.skills.map((ps) => ps.toLowerCase()).includes(s.toLowerCase())
  );
  const missingSkills = selectedJob.skills.filter((s) =>
    !seekerProfile.skills.map((ps) => ps.toLowerCase()).includes(s.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-purple-500/30">
      <Navbar activeTab="search" setActiveTab={() => router.push("/")} />
      
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-purple-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Results
        </button>

        <div className="glass-panel w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-purple-200 dark:border-purple-500/20 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-3xl flex flex-col animate-fade-in">
          {/* Header */}
          <div className="p-6 sm:p-10 border-b border-purple-200/50 dark:border-purple-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex gap-6 items-center">
              <div className={`w-16 h-16 rounded-[1.5rem] shrink-0 flex items-center justify-center shadow-lg ${
                selectedJob.type === "education"
                  ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-500"
                  : selectedJob.type === "training"
                  ? "bg-amber-500/10 border border-amber-500/25 text-amber-500"
                  : "bg-purple-500/10 border border-purple-500/25 text-purple-600"
              }`}>
                <OpportunityIcon logo={selectedJob.logo} className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-black text-2xl sm:text-3xl tracking-tight text-zinc-900 dark:text-white">
                    {selectedJob.title}
                  </h1>
                  <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                    selectedJob.type === "education"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30"
                      : selectedJob.type === "training"
                      ? "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30"
                      : "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/30"
                  }`}>
                    {selectedJob.type === "training" ? "career" : selectedJob.type}
                  </span>
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 flex flex-wrap gap-x-3 gap-y-1 font-bold">
                  <span className="text-purple-600 dark:text-purple-400">{selectedJob.provider}</span>
                  <span className="text-zinc-300 dark:text-zinc-700">•</span>
                  <span>{selectedJob.location}</span>
                  <span className="text-zinc-300 dark:text-zinc-700">•</span>
                  <span>{selectedJob.subType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-10 space-y-10">
            {/* Visual Specifications Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Provider</div>
                <div className="text-sm font-black text-zinc-900 dark:text-zinc-100 truncate mt-1.5">{selectedJob.provider}</div>
                <div className="text-[11px] font-bold text-zinc-600 mt-1">{selectedJob.subType}</div>
              </div>
              <div className="glass-panel p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Location</div>
                <div className="text-sm font-black text-zinc-900 dark:text-zinc-100 truncate mt-1.5">{selectedJob.location}</div>
                <div className="text-[11px] font-bold text-zinc-600 mt-1">Physical Workspace</div>
              </div>
              <div className="glass-panel p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  {selectedJob.type === "job" ? "Compensation" : "Cost"}
                </div>
                <div className="text-sm font-black text-zinc-900 dark:text-zinc-100 truncate mt-1.5">{selectedJob.salaryOrCost}</div>
                <div className="text-[11px] font-bold text-zinc-600 mt-1">Value Rate</div>
              </div>
            </div>

            {/* AI Fit Matching score card */}
            <div className="glass-panel p-6 sm:p-8 rounded-[2rem] border border-purple-200 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-500/5 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/20 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[1rem] bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">AI Profile Alignment</div>
                      <div className="text-lg font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                        You match {score}% of the requirements
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-purple-200/50 dark:border-purple-500/20">
                  {/* Matched Skills */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Matched Skills ({matchedSkills.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {matchedSkills.length > 0 ? (
                        matchedSkills.map((s) => (
                          <span key={s} className="text-[11px] font-bold px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] font-bold text-zinc-500">None matching</span>
                      )}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Skills to Gain ({missingSkills.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {missingSkills.length > 0 ? (
                        missingSkills.map((s) => (
                          <span key={s} className="text-[11px] font-bold px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Mastered all required skills!</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About the Opportunity */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                About the Opportunity
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                {selectedJob.description}
              </p>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                Key Requirements
              </h4>
              <div className="space-y-3">
                {selectedJob.requirements.map((req, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {req}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Form */}
            <form onSubmit={handleApplySubmit} className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                  {selectedJob.type === "job" ? "Quick Application" : "Program Enrollment"}
                </h4>
                <span className="text-[11px] font-bold text-zinc-500">Document: {cvFileName}</span>
              </div>

              <div className="glass-panel p-6 rounded-[2rem] border border-purple-200 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-500/5 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-black text-zinc-900 dark:text-zinc-100">Tailored AI Application Statement</div>
                    <div className="text-[11px] font-medium text-zinc-500">Formulates a personalized statement based on your matched skills.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setCoverLetterText(
                        selectedJob.type === "job"
                          ? `Dear Hiring Team at ${selectedJob.provider},\n\nI am writing to express my strong interest in the ${selectedJob.title} position. As a ${seekerProfile.title} skilled in ${seekerProfile.skills.slice(0, 4).join(", ")}, my credentials match ${score}% of your required profile. I am excited about the opportunity to contribute to your projects.`
                          : `Hello Admissions Office,\n\nI am enrolling in the ${selectedJob.title} course to bridge my skills gap in ${missingSkills.slice(0, 2).join(", ") || "this field"} and build upon my knowledge in ${matchedSkills.slice(0, 2).join(", ") || "core fundamentals"}. Please review my profile and verify my application.`
                      )
                    }
                    className="px-4 py-2.5 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Auto-Generate</span>
                  </button>
                </div>

                <textarea
                  rows={5}
                  required
                  value={coverLetterText}
                  onChange={(e) => setCoverLetterText(e.target.value)}
                  className="w-full px-5 py-4 bg-white dark:bg-zinc-900 rounded-2xl border border-purple-200 dark:border-purple-500/30 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none font-medium leading-relaxed shadow-inner"
                  placeholder="Write your cover statement or click 'Auto-Generate' above..."
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={appliedSuccess}
                  className={`px-8 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl flex items-center gap-2 ${
                    appliedSuccess 
                      ? "bg-emerald-500 text-white shadow-emerald-500/25" 
                      : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:-translate-y-0.5 shadow-zinc-900/20 dark:shadow-white/20"
                  }`}
                >
                  {appliedSuccess ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Application Sent!</span>
                    </>
                  ) : (
                    <>
                      <span>{selectedJob.type === "job" ? "Submit Application" : "Complete Enrollment"}</span>
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
