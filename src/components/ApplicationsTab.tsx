"use client";

import React from "react";
import { useApp, Application, Opportunity } from "@/context/AppContext";
import { FolderKanban, Calendar, Clock, Sparkles, Building2, Search } from "lucide-react";

export const ApplicationsTab: React.FC = () => {
  const { applications, opportunities, seekerProfile } = useApp();

  const columns: { id: Application["status"]; label: string; bg: string; text: string }[] = [
    { id: "Applied", label: "Applied", bg: "bg-zinc-500/10", text: "text-zinc-600 dark:text-zinc-300" },
    { id: "Shortlisted", label: "Shortlisted", bg: "bg-purple-600/10", text: "text-purple-600 dark:text-purple-300" },
    { id: "Offered", label: "Offered", bg: "bg-emerald-500/10", text: "text-emerald-600" },
    { id: "Rejected", label: "Rejected", bg: "bg-red-500/10", text: "text-red-500" }
  ];

  // Helper to match opportunities
  const getJobDetail = (jobId: string): Opportunity | undefined => {
    return opportunities.find((j) => j.id === jobId);
  };

  // Helper to calculate score
  const calculateMatchScore = (jobSkills: string[]) => {
    if (!jobSkills) return 100;
    const common = jobSkills.filter((s) =>
      seekerProfile.skills.map((ps) => ps.toLowerCase()).includes(s.toLowerCase())
    );
    return Math.round((common.length / jobSkills.length) * 100);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Application <span className="text-gradient">Tracker Board</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Track active hiring workflows. Real-time updates from employer activities are shown instantly below.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto text-zinc-400">
            <FolderKanban className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg">No active applications</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              Explore open positions under the "Find Jobs" tab and submit your application to start tracking them.
            </p>
          </div>
        </div>
      ) : (
        /* Kanban Columns Grid */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {columns.map((col) => {
            const columnApps = applications.filter((app) => app.status === col.id);

            return (
              <div key={col.id} className="space-y-4">
                {/* Column Header */}
                <div className={`p-4 rounded-2xl ${col.bg} flex justify-between items-center border border-purple-500/5`}>
                  <span className={`font-extrabold text-sm ${col.text}`}>{col.label}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-white/40 dark:bg-black/40 text-zinc-700 dark:text-zinc-300">
                    {columnApps.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-3 min-h-[400px] rounded-2xl bg-zinc-100/50 dark:bg-zinc-900/10 p-2 border border-purple-500/5">
                  {columnApps.length === 0 ? (
                    <div className="py-12 text-center text-xs text-zinc-400 italic">
                      Empty column
                    </div>
                  ) : (
                    columnApps.map((app) => {
                      const job = getJobDetail(app.jobId);
                      if (!job) return null;
                      const score = calculateMatchScore(job.skills);

                      return (
                        <div
                          key={app.id}
                          className="glass-panel rounded-xl p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
                        >
                          {/* Accent Gradient Border top */}
                          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-400 opacity-60"></div>

                          <div className="space-y-1">
                            <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                              {job.title}
                            </h4>
                            <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                              <Building2 className="w-3 h-3 text-purple-600/60" />
                              <span>{job.provider}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-zinc-400 pt-1 border-t border-purple-500/5">
                            <span className="flex items-center gap-0.5">
                              <Calendar className="w-3 h-3 text-purple-600/40" />
                              {app.appliedDate}
                            </span>
                            <span className="font-bold text-purple-600 dark:text-purple-300">
                              {score}% Fit
                            </span>
                          </div>

                          {/* Notes/Feedback from Employer */}
                          {app.notes && (
                            <div className="text-[10px] bg-purple-600/5 p-2 rounded-lg border border-purple-500/10 text-purple-600 dark:text-purple-300 font-semibold leading-relaxed">
                              📝 Notes: {app.notes}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
