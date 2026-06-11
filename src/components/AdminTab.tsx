"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ShieldAlert, Trash2, Check, Bell, BarChart3, Users, MessageSquare, Award, BookOpen, Briefcase, ChevronDown } from "lucide-react";
import { OpportunityIcon } from "./OpportunityIcon";

export const AdminTab: React.FC = () => {
  const {
    opportunities,
    deleteOpportunity,
    addNotification,
    communityPosts,
    applications
  } = useApp();

  // Notification input form states
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMsg, setAnnouncementMsg] = useState("");
  const [announcementType, setAnnouncementType] = useState<"info" | "match">("info");
  const [isAnnouncementDropdownOpen, setIsAnnouncementDropdownOpen] = useState(false);
  const [successNotif, setSuccessNotif] = useState(false);

  // Platform approvals state
  const [approvedOppIds, setApprovedOppIds] = useState<string[]>(["opp-1", "opp-2", "opp-3", "opp-4", "opp-5"]);

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementMsg.trim()) return;

    addNotification(announcementTitle.trim(), announcementMsg.trim(), announcementType);
    setAnnouncementTitle("");
    setAnnouncementMsg("");
    setSuccessNotif(true);
    setTimeout(() => setSuccessNotif(false), 2000);
  };

  const handleApprove = (oppId: string) => {
    if (approvedOppIds.includes(oppId)) return;
    setApprovedOppIds(prev => [...prev, oppId]);
  };

  // Compute metrics
  const totalOppCount = opportunities.length;
  const jobCount = opportunities.filter(o => o.type === "job").length;
  const courseCount = opportunities.filter(o => o.type === "education").length;
  const trainingCount = opportunities.filter(o => o.type === "training").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-500 dark:text-red-400 px-3 py-1 rounded-xl text-xs font-bold mb-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          Platform Administration Hub
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Admin Portal & <span className="text-gradient">Control Center</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Audit opportunities, broadcast announcements, and monitor engagement statistics.
        </p>
      </div>

      {/* Analytics grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel rounded-3xl p-5 border border-purple-500/5 space-y-1">
          <span className="text-zinc-400 text-xs font-bold block flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5 text-purple-500" />
            Total Listings
          </span>
          <span className="text-3xl font-extrabold text-gradient">{totalOppCount}</span>
          <span className="text-[10px] text-zinc-500 block">Mixed opportunity listings</span>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-purple-500/5 space-y-1">
          <span className="text-zinc-400 text-xs font-bold block flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-purple-500" />
            Active Applicants
          </span>
          <span className="text-3xl font-extrabold text-zinc-700 dark:text-zinc-200">
            {applications.length + 15}
          </span>
          <span className="text-[10px] text-zinc-500 block">Registered seeker profiles</span>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-purple-500/5 space-y-1">
          <span className="text-zinc-400 text-xs font-bold block flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
            Forum Posts
          </span>
          <span className="text-3xl font-extrabold text-zinc-700 dark:text-zinc-200">
            {communityPosts.length}
          </span>
          <span className="text-[10px] text-zinc-500 block">Community discussions</span>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-purple-500/5 space-y-1">
          <span className="text-zinc-400 text-xs font-bold block">Opportunity Split</span>
          <div className="flex gap-2 text-[10px] font-bold pt-1.5">
            <span className="text-purple-400">J: {jobCount}</span>
            <span className="text-zinc-550 dark:text-zinc-500">•</span>
            <span className="text-emerald-400">E: {courseCount}</span>
            <span className="text-zinc-550 dark:text-zinc-500">•</span>
            <span className="text-amber-400">T: {trainingCount}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: List auditing */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-zinc-800 dark:text-zinc-100">Pending & Verified Opportunities</h3>
              <p className="text-xs text-zinc-400">Approve new training programs or remove old posts.</p>
            </div>

            <div className="space-y-3">
              {opportunities.map((opp) => {
                const isApproved = approvedOppIds.includes(opp.id);
                return (
                  <div
                    key={opp.id}
                    className="p-4 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-2xl border border-purple-500/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
                  >
                    <div className="flex gap-3 items-start flex-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border shrink-0 ${
                        opp.type === "education"
                          ? "bg-emerald-500/10 border-emerald-500/10 text-emerald-450"
                          : opp.type === "training"
                          ? "bg-amber-500/10 border-amber-500/10 text-amber-450"
                          : "bg-purple-500/10 border-purple-500/10 text-purple-450"
                      }`}>
                        <OpportunityIcon logo={opp.logo} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-sm text-zinc-850 dark:text-zinc-150">
                            {opp.title}
                          </h4>
                          <span className={`text-[8px] font-extrabold uppercase px-1 py-0.5 rounded tracking-wider border ${
                            opp.type === "education"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
                              : opp.type === "training"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/10"
                              : "bg-purple-500/10 text-purple-400 border-purple-500/10"
                          }`}>
                            {opp.type}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-550 dark:text-zinc-500">
                          {opp.provider} • {opp.location} • {opp.salaryOrCost}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center justify-between w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-purple-500/5">
                      {isApproved ? (
                        <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-xl flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApprove(opp.id)}
                          className="px-2.5 py-1 bg-purple-600 text-white rounded-lg text-[10px] font-bold hover:bg-purple-700 transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => deleteOpportunity(opp.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-500/5 transition-all"
                        aria-label={`Delete opportunity ${opp.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Global announcement broadcast */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-5 space-y-4">
            <div className="flex gap-2 items-center">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300">
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-200">Broadcast Alerts</h3>
            </div>
            <p className="text-xs text-zinc-400 font-medium">
              Send a system-wide banner notification to all registered candidates' alert dropdowns.
            </p>

            <form onSubmit={handleSendAnnouncement} className="space-y-3">
              <div className="relative">
                <label className="text-[10px] font-bold text-zinc-455 block mb-1">Announcement Type</label>
                <button
                  type="button"
                  onClick={() => setIsAnnouncementDropdownOpen(!isAnnouncementDropdownOpen)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 text-xs text-left flex items-center justify-between text-zinc-700 dark:text-zinc-300 transition-all select-none cursor-pointer"
                >
                  <span>{announcementType === "info" ? "General Info Announcement" : "Urgent Job Match Alert"}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isAnnouncementDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {isAnnouncementDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsAnnouncementDropdownOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-1 z-40 max-h-40 overflow-y-auto glass-panel rounded-xl p-1.5 border border-purple-500/20 shadow-xl scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                      {[
                        { value: "info", label: "General Info Announcement" },
                        { value: "match", label: "Urgent Job Match Alert" }
                      ].map((ann) => (
                        <button
                          key={ann.value}
                          type="button"
                          onClick={() => {
                            setAnnouncementType(ann.value as any);
                            setIsAnnouncementDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                            announcementType === ann.value
                              ? "bg-purple-650 text-white"
                              : "text-zinc-400 hover:text-zinc-250 hover:bg-purple-500/10"
                          }`}
                        >
                          {ann.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-450 block mb-1">Notification Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Platform system maintenance"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-450 block mb-1">Detailed Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. We will undergo planned maintenance on June 12th from 2:00 to 4:00 AM UTC..."
                  value={announcementMsg}
                  onChange={(e) => setAnnouncementMsg(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Send Notification Broadcast
              </button>
            </form>

            {successNotif && (
              <div className="text-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">
                ✓ Broadcast sent successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
