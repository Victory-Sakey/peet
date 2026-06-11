"use client";

import React, { useState } from "react";
import {
  Briefcase,
  ShieldCheck,
  FolderKanban,
  Sparkles,
  Users,
  BarChart3,
  GraduationCap,
  Target,
  Flame,
  BookOpen,
  Plus,
  Trash2,
  Check
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { SearchTab } from "./SearchTab";
import { MatchingTab } from "./MatchingTab";
import { ApplicationsTab } from "./ApplicationsTab";
import { AiCoachTab } from "./AiCoachTab";
import { CommunityTab } from "./CommunityTab";

export const SeekerTab: React.FC = () => {
  const { seekerProfile, applications } = useApp();

  // Sidebar active tab state
  const [activeTab, setActiveTab] = useState<"overview" | "opportunities" | "learning" | "goals">("overview");

  // Child sub-tab selections
  const [oppSubTab, setOppSubTab] = useState<"search" | "matching" | "applications">("search");
  const [learnSubTab, setLearnSubTab] = useState<"coach" | "community">("coach");

  // Interactive Goals State
  const [goals, setGoals] = useState([
    { id: "1", text: "Complete your PEET AI seeker profile", completed: true },
    { id: "2", text: "Submit 5 vacancy applications", completed: false },
    { id: "3", text: "Engage in an AI Career Coach interview session", completed: true },
    { id: "4", text: "Explore matching opportunities with Smart Match", completed: false },
    { id: "5", text: "Add 3 new skills to your profile page", completed: false }
  ]);
  const [newGoalText, setNewGoalText] = useState("");

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    setGoals([
      ...goals,
      { id: Date.now().toString(), text: newGoalText.trim(), completed: false }
    ]);
    setNewGoalText("");
  };

  const handleToggleGoal = (id: string) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const completedCount = goals.filter((g) => g.completed).length;
  const progressPercent = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  // Selected Quote of the Day
  const quotes = [
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Act as if what you do makes a difference. It does.", author: "William James" }
  ];
  const quote = quotes[new Date().getDate() % quotes.length];

  // Resolve display name for profile card
  const seekerName = seekerProfile?.name || "Alex Johnson";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-6">
          {/* Profile Card */}
          <div className="flex items-center gap-3 p-4 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-2xl border border-purple-500/5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-purple-400 flex items-center justify-center text-white font-extrabold text-lg shadow-md shrink-0">
              {seekerName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200 truncate">
                {seekerName}
              </h4>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold block uppercase tracking-wider">
                Opportunity Seeker
              </span>
            </div>
          </div>

          {/* Navigation Items (Vertical on Desktop, scrollable horizontal list on Mobile) */}
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none border-b border-zinc-200 dark:border-zinc-800/80 md:border-b-0">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "opportunities", label: "My Opportunities", icon: Briefcase },
              { id: "learning", label: "Learning & Growth", icon: GraduationCap },
              { id: "goals", label: "Goals", icon: Target }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer md:w-full text-left ${
                    isActive
                      ? "bg-purple-600/10 text-purple-600 dark:text-purple-300 border-b-2 md:border-b-0 md:border-l-4 border-purple-600"
                      : "text-zinc-500 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/30"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="hidden md:inline text-purple-600 dark:text-purple-300 font-bold">&gt;</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="flex-grow min-w-0">
          
          {/* ================= 1. OVERVIEW DASHBOARD ================= */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Radial Momentum Card */}
                <div className="lg:col-span-2 relative overflow-hidden glass-panel rounded-3xl p-6 flex flex-col items-center justify-center border border-purple-500/5 h-full">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600" />
                  <h3 className="font-extrabold text-base text-zinc-800 dark:text-zinc-100 text-center mb-6">
                    Your Life Momentum
                  </h3>
                  
                  {/* Radial Progress Ring */}
                  <div className="relative flex items-center justify-center my-4">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <defs>
                        <linearGradient id="momentumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="80"
                        cy="80"
                        r="64"
                        stroke="#e4e4e7"
                        className="dark:stroke-zinc-800"
                        strokeWidth="10"
                        fill="none"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="64"
                        stroke="url(#momentumGrad)"
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 64}
                        strokeDashoffset={2 * Math.PI * 64 * (1 - 78 / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-4xl font-extrabold text-zinc-800 dark:text-white">78</span>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                        Score
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-zinc-550 dark:text-zinc-400 text-center max-w-sm mt-6 font-semibold leading-relaxed">
                    You're in the top 15% of active users this week. Keep pushing forward!
                  </p>
                </div>

                {/* Right Stack (Streak & Motivation) */}
                <div className="flex flex-col gap-6">
                  {/* Activity Streak Card */}
                  <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 rounded-3xl p-6 flex items-center gap-5 text-white shadow-lg shadow-orange-500/15">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                      <Flame className="w-7 h-7 text-white fill-white" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider block mb-0.5">
                        Activity Streak
                      </span>
                      <span className="text-3xl font-extrabold text-white">14 Days</span>
                    </div>
                  </div>

                  {/* Daily Motivation Card */}
                  <div className="glass-panel rounded-3xl p-6 border border-purple-500/5 bg-white dark:bg-zinc-900/40 space-y-4 flex flex-col justify-center flex-1">
                    <span className="text-[10px] font-bold text-purple-600/70 dark:text-purple-300/70 uppercase tracking-wider block">
                      Daily Motivation
                    </span>
                    <blockquote className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-relaxed italic">
                      "{quote.text}"
                    </blockquote>
                    <cite className="text-xs text-zinc-500 dark:text-zinc-400 font-bold block not-italic">
                      — {quote.author}
                    </cite>
                  </div>
                </div>
              </div>

              {/* Bottom Row Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Stats 1: Applications */}
                <div className="glass-panel rounded-3xl p-5 border border-purple-500/5 flex items-center gap-4 hover:border-purple-500/10 transition-colors">
                  <div className="w-12 h-12 bg-blue-500/10 dark:bg-blue-950/40 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100 block leading-none mb-1">
                      {applications.length || 5}
                    </span>
                    <span className="text-xs text-zinc-550 dark:text-zinc-400 font-bold">
                      Applications this month
                    </span>
                  </div>
                </div>

                {/* Stats 2: Hours of Learning */}
                <div className="glass-panel rounded-3xl p-5 border border-purple-500/5 flex items-center gap-4 hover:border-purple-500/10 transition-colors">
                  <div className="w-12 h-12 bg-purple-500/10 dark:bg-purple-950/40 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100 block leading-none mb-1">
                      24h
                    </span>
                    <span className="text-xs text-zinc-550 dark:text-zinc-400 font-bold">
                      Hours of learning
                    </span>
                  </div>
                </div>

                {/* Stats 3: Skills Added */}
                <div className="glass-panel rounded-3xl p-5 border border-purple-500/5 flex items-center gap-4 hover:border-purple-500/10 transition-colors">
                  <div className="w-12 h-12 bg-teal-500/10 dark:bg-teal-950/40 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100 block leading-none mb-1">
                      {seekerProfile?.skills?.length || 3}
                    </span>
                    <span className="text-xs text-zinc-550 dark:text-zinc-400 font-bold">
                      New skills added
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. MY OPPORTUNITIES ================= */}
          {activeTab === "opportunities" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex border-b border-purple-500/10 gap-2 pb-px justify-center md:justify-start">
                {[
                  { id: "search", label: "Find Opportunities", icon: Briefcase },
                  { id: "matching", label: "Smart Match", icon: ShieldCheck },
                  { id: "applications", label: "Track Applications", icon: FolderKanban }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = oppSubTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setOppSubTab(tab.id as any)}
                      className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        isActive
                          ? "border-purple-600 text-purple-600 dark:text-purple-300"
                          : "border-transparent text-zinc-500 hover:text-purple-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <div className="pt-2">
                {oppSubTab === "search" && <SearchTab />}
                {oppSubTab === "matching" && <MatchingTab />}
                {oppSubTab === "applications" && <ApplicationsTab />}
              </div>
            </div>
          )}

          {/* ================= 3. LEARNING & GROWTH ================= */}
          {activeTab === "learning" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex border-b border-purple-500/10 gap-2 pb-px justify-center md:justify-start">
                {[
                  { id: "coach", label: "AI Career Coach", icon: Sparkles },
                  { id: "community", label: "Community Forum", icon: Users }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = learnSubTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setLearnSubTab(tab.id as any)}
                      className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        isActive
                          ? "border-purple-600 text-purple-600 dark:text-purple-300"
                          : "border-transparent text-zinc-500 hover:text-purple-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <div className="pt-2">
                {learnSubTab === "coach" && <AiCoachTab />}
                {learnSubTab === "community" && <CommunityTab />}
              </div>
            </div>
          )}

          {/* ================= 4. GOALS TRACKER ================= */}
          {activeTab === "goals" && (
            <div className="glass-panel rounded-3xl p-6 border border-purple-500/5 space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h3 className="font-extrabold text-lg text-zinc-800 dark:text-zinc-100">
                  Career Goals Planner
                </h3>
                <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed">
                  Establish targets, track your tasks, and watch your Life Momentum score rise as you achieve milestones.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 bg-zinc-50 dark:bg-zinc-900/30 p-4 rounded-2xl border border-purple-500/5">
                <div className="flex justify-between items-center text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  <span>Completion Progress</span>
                  <span>{progressPercent}% ({completedCount} of {goals.length} completed)</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 via-purple-400 to-cyan-400 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Add Custom Goal Form */}
              <form onSubmit={handleAddGoal} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Create a custom career goal..."
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  className="flex-grow px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 focus:outline-none focus:ring-1 focus:ring-purple-600 text-xs text-zinc-700 dark:text-zinc-200"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer shadow-md shadow-purple-500/10"
                >
                  <Plus className="w-4 h-4" />
                  Add Goal
                </button>
              </form>

              {/* Goals list */}
              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                {goals.length === 0 ? (
                  <div className="text-center py-10 text-xs text-zinc-500 italic">
                    No active goals established yet. Add one above!
                  </div>
                ) : (
                  goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="flex items-center justify-between p-3.5 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-xl border border-purple-500/5 transition-all hover:border-purple-500/10"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleToggleGoal(goal.id)}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                            goal.completed
                              ? "bg-purple-600 border-purple-600 text-white"
                              : "border-zinc-300 dark:border-zinc-700 hover:border-purple-500 text-transparent"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                        <span
                          className={`text-xs font-semibold truncate transition-all ${
                            goal.completed
                              ? "line-through text-zinc-400 dark:text-zinc-550"
                              : "text-zinc-750 dark:text-zinc-200"
                          }`}
                        >
                          {goal.text}
                        </span>
                      </div>
                      
                      {/* Delete Custom goal button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-500/5 transition-all cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
