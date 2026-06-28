"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
  Check,
  Bell,
  LogOut,
  User
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import GoalsTab from "./GoalsTab";
import { SearchTab } from "./SearchTab";
import { MatchingTab } from "./MatchingTab";
import { ApplicationsTab } from "./ApplicationsTab";
import { AiCoachTab } from "./AiCoachTab";
import { CommunityTab } from "./CommunityTab";

export const SeekerTab: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const { 
    seekerProfile, 
    applications,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    setUserType,
    loadingAuth
  } = useApp();

  const handleLogout = () => {
    setUserType("seeker");
    router.push("/");
  };

  const tabParam = searchParams.get("tab") as "overview" | "opportunities" | "learning" | "goals" | null;
  const activeTab = tabParam || "overview";

  const setActiveTab = (tab: "overview" | "opportunities" | "learning" | "goals") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`);
  };

  const [oppSubTab, setOppSubTab] = useState<"search" | "matching" | "applications">("search");
  const [learnSubTab, setLearnSubTab] = useState<"coach" | "community">("coach");
  const [showNotifications, setShowNotifications] = useState(false);

  // Dynamic Momentum Score Calculation
  const calculateMomentumScore = () => {
    let score = 20; // Base score
    if (seekerProfile?.name) score += 10;
    if (seekerProfile?.bio) score += 5;
    if (seekerProfile?.skills && seekerProfile.skills.length > 0) {
      score += Math.min(seekerProfile.skills.length * 3, 15);
    }
    if (applications) {
      score += Math.min(applications.length * 5, 25);
    }
    return Math.min(score, 100);
  };
  const momentumScore = calculateMomentumScore();
  
  // Dynamic Activity Streak Calculation (pseudo-streak for demo purposes)
  const activityStreak = (applications?.length || 0);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const seekerName = seekerProfile?.name || "Alex Johnson";
  const firstName = seekerName.split(" ")[0] || "there";

  const [greeting, setGreeting] = useState("Hello");
  const [currentDate, setCurrentDate] = useState("");
  const [dailyQuote, setDailyQuote] = useState({ text: "Loading...", author: "" });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const dateStr = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(dateStr);

    const careerQuotes = [
      { text: "Your career is your business. It's time for you to manage it as a CEO.", author: "Andy Grove" },
      { text: "Opportunities don't happen, you create them.", author: "Chris Grosser" },
      { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
      { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
      { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }
    ];
    setDailyQuote(careerQuotes[new Date().getDate() % careerQuotes.length]);
  }, []);

  // Reset scroll position when switching tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeTab]);

  return (
    <div className="relative min-h-screen">
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden md:flex flex-col w-72 h-screen fixed top-0 left-0 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 z-50">
        
        {/* Logo Area */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <Image src="/peet_logo.jpg" alt="PEET Logo" fill style={{ objectFit: "cover" }} />
            </div>
            <span className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              Peet
            </span>
          </div>
        </div>

        {/* Profile Card */}
        <div className="p-6">
          <div className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            {loadingAuth ? (
              <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse shrink-0"></div>
            ) : seekerProfile?.avatar ? (
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <Image src={seekerProfile.avatar} alt="Profile" fill style={{ objectFit: "cover" }} />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 font-semibold text-base shadow-sm shrink-0">
                {seekerName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              {loadingAuth ? (
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse w-24 mb-1"></div>
              ) : (
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
                  {seekerName}
                </h4>
              )}
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium block uppercase tracking-widest mt-0.5">
                Seeker
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
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
                className={`flex items-center justify-between w-full px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions (Notifications & Logout) */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
          
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center justify-between w-full px-5 py-3 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950"></span>}
                </div>
                <span>Notifications</span>
              </div>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadCount} new</span>
              )}
            </button>

            {/* Notifications Popover (Desktop) */}
            {showNotifications && (
              <div className="absolute bottom-16 left-0 w-80 bg-white dark:bg-zinc-900 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-zinc-200 dark:border-zinc-800 z-50 text-xs space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-200/50 dark:border-zinc-800">
                  <span className="font-semibold text-sm text-zinc-900 dark:text-white">Notifications</span>
                  {notifications.length > 0 && (
                    <button onClick={clearNotifications} className="text-[10px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">
                      Clear All
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="text-zinc-500 py-6 text-center">No new notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 rounded-xl transition-colors cursor-pointer text-left ${
                          n.read ? "hover:bg-zinc-100 dark:hover:bg-zinc-800" : "bg-zinc-100 dark:bg-zinc-800/80"
                        }`}
                      >
                        <div className="font-semibold mb-1">{n.title}</div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">{n.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-5 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navbar (Fixed) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border-t border-zinc-200/50 dark:border-zinc-800/50 z-50 pb-safe">
        <div className="flex items-center justify-around px-2 py-3">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "opportunities", label: "Opps", icon: Briefcase },
            { id: "learning", label: "Learn", icon: GraduationCap },
            { id: "goals", label: "Goals", icon: Target },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex flex-col items-center gap-1 min-w-[64px] transition-colors ${
                  isActive ? "text-purple-600 dark:text-purple-400" : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                <div className={`p-1.5 rounded-xl ${isActive ? "bg-purple-100 dark:bg-purple-500/20" : ""}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold">{item.label}</span>
              </button>
            );
          })}
          
          {/* Mobile Notifications/Profile Drawer Trigger */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`flex flex-col items-center gap-1 min-w-[64px] transition-colors ${
              showNotifications ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <div className={`relative p-1.5 rounded-xl ${showNotifications ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}>
              <User className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </div>
      </nav>

      {/* Mobile Profile & Notifications Overlay */}
      {showNotifications && (
        <div className="md:hidden fixed inset-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl pt-12 px-6 pb-32 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-4 mb-8">
            {loadingAuth ? (
              <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse shrink-0"></div>
            ) : seekerProfile?.avatar ? (
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md">
                <Image src={seekerProfile.avatar} alt="Profile" fill style={{ objectFit: "cover" }} />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
                {seekerName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              {loadingAuth ? (
                <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse w-32 mb-1"></div>
              ) : (
                <h4 className="font-bold text-lg text-zinc-900 dark:text-white">{seekerName}</h4>
              )}
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">Seeker Workspace</span>
            </div>
          </div>

          <h3 className="font-bold text-lg mb-4">Notifications</h3>
          <div className="space-y-3 mb-8">
            {notifications.length === 0 ? (
              <div className="text-zinc-500 py-6 text-center bg-zinc-50 dark:bg-zinc-900 rounded-2xl">No new notifications</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                  className={`p-4 rounded-2xl border transition-colors cursor-pointer text-left ${
                    n.read ? "border-zinc-200 dark:border-zinc-800 bg-transparent" : "border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-900/10"
                  }`}
                >
                  <div className="font-bold mb-1">{n.title}</div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">{n.message}</div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>

          <button 
            onClick={() => setShowNotifications(false)}
            className="w-full mt-4 p-4 text-center font-bold text-zinc-500"
          >
            Close
          </button>
        </div>
      )}

      {/* Main Content Area (Offset by Desktop Sidebar & Mobile Bottom Nav) */}
      <main className="md:pl-72 pb-24 md:pb-8 pt-24 md:pt-8 px-4 max-w-7xl mx-auto w-full relative min-h-screen">
        
        {/* Fixed Mobile Top Navbar */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-b border-zinc-200/50 dark:border-zinc-800/50 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <Image src="/peet_logo.jpg" alt="PEET Logo" fill style={{ objectFit: "cover" }} />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Peet
            </span>
          </div>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors active:scale-95"
          >
            <Bell className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
            )}
          </button>
        </div>

        {/* ================= 1. OVERVIEW DASHBOARD ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">

            {/* Top Greeting */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
              <div>
                <div className="text-zinc-500 font-medium mb-1 tracking-wide uppercase text-sm">
                  {currentDate || "Loading date..."}
                </div>
                {loadingAuth ? (
                  <div className="h-9 w-64 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-md mb-1"></div>
                ) : (
                  <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900 dark:text-white tracking-tight">
                    {greeting}, {firstName}
                  </h2>
                )}
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">Here is a snapshot of your career momentum today.</p>
              </div>
            </div>

            {/* Top Stats Row */}
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0 md:mx-0 md:px-0 relative z-10 custom-scrollbar">
              <div className="shrink-0 w-[65vw] sm:w-[45vw] md:w-auto snap-center bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 border border-white/10 flex flex-col justify-between shadow-lg shadow-indigo-900/20">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">+12%</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white block leading-none mb-1.5">{momentumScore}</span>
                  <span className="text-xs text-indigo-100 font-semibold uppercase tracking-wider">Momentum Score</span>
                </div>
              </div>

              <div className="shrink-0 w-[65vw] sm:w-[45vw] md:w-auto snap-center bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-5 border border-white/10 flex flex-col justify-between shadow-lg shadow-blue-900/20">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white block leading-none mb-1.5">{applications?.length || 0}</span>
                  <span className="text-xs text-blue-100 font-semibold uppercase tracking-wider">Active Applications</span>
                </div>
              </div>

              <div className="shrink-0 w-[65vw] sm:w-[45vw] md:w-auto snap-center bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl p-5 border border-white/10 flex flex-col justify-between shadow-lg shadow-orange-900/20">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
                    <Flame className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white block leading-none mb-1.5">{activityStreak}d</span>
                  <span className="text-xs text-orange-100 font-semibold uppercase tracking-wider">Activity Streak</span>
                </div>
              </div>

              <div className="shrink-0 w-[65vw] sm:w-[45vw] md:w-auto snap-center bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 border border-white/10 flex flex-col justify-between shadow-lg shadow-emerald-900/20">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
                    <Target className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white block leading-none mb-1.5">{seekerProfile?.skills?.length || 0}</span>
                  <span className="text-xs text-emerald-100 font-semibold uppercase tracking-wider">New Skills</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
              
              {/* Left Momentum / Progress Card */}
              <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">Momentum Growth</h3>
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Top 15%</span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl mt-1">
                    Your Momentum Score shows how active you are on PEET. It increases when you update your profile, add new skills, apply for jobs, and stay active. A higher score helps you get discovered by more employers.
                  </p>
                </div>
                
                <div className="mt-8 space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-zinc-900 dark:text-white">Current Score: {momentumScore}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">Goal: 100</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-1000 ease-out" style={{ width: `${momentumScore}%` }} />
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <button onClick={() => setActiveTab("goals")} className="text-sm font-medium text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors flex items-center gap-1">
                    View next goals <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>

              {/* Right Stack (Daily Motivation & Next Action) */}
              <div className="flex flex-col gap-6">
                <div className="bg-zinc-900 dark:bg-zinc-800 rounded-2xl p-6 flex flex-col justify-center shadow-lg shadow-zinc-900/10 relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 text-zinc-800 dark:text-zinc-700 opacity-20 pointer-events-none">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.017 21L16.439 14.2829C16.6343 13.626 16.732 12.9515 16.732 12.2713V8H22V12.2713C22 15.6543 20.6559 18.8996 18.2676 21H14.017ZM5.01697 21L7.43896 14.2829C7.63428 13.626 7.73196 12.9515 7.73196 12.2713V8H13V12.2713C13 15.6543 11.6559 18.8996 9.26758 21H5.01697Z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-3 relative z-10">Daily Motivation</span>
                  <blockquote className="text-base font-medium text-white leading-relaxed mb-3 relative z-10">"{dailyQuote.text}"</blockquote>
                  <cite className="text-xs text-zinc-400 block not-italic font-semibold relative z-10">— {dailyQuote.author}</cite>
                </div>
                
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 flex-1 shadow-sm flex flex-col justify-center">
                  <div className="w-10 h-10 rounded-full border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white mb-4 bg-zinc-50 dark:bg-zinc-800/50">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-sm text-zinc-900 dark:text-white mb-1.5">Smart Match Ready</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5 font-medium leading-relaxed">
                    We found 3 new opportunities perfectly matching your latest skills.
                  </p>
                  <button onClick={() => { setActiveTab("opportunities"); setOppSubTab("matching"); }} className="w-full py-2 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-lg transition-colors">
                    Review Matches
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. MY OPPORTUNITIES ================= */}
        {activeTab === "opportunities" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex p-1.5 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/50 relative md:w-max mx-auto md:mx-0 shadow-inner overflow-x-auto">
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
                    className={`relative z-10 flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 shrink-0 ${
                      isActive ? "bg-white dark:bg-zinc-700 text-purple-700 dark:text-white shadow-sm border border-zinc-200 dark:border-zinc-600" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 border border-transparent"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-purple-600 dark:text-purple-400" : ""}`} />
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
            <div className="flex p-1.5 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/50 relative md:w-max mx-auto md:mx-0 shadow-inner overflow-x-auto">
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
                    className={`relative z-10 flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 shrink-0 ${
                      isActive ? "bg-white dark:bg-zinc-700 text-purple-700 dark:text-white shadow-sm border border-zinc-200 dark:border-zinc-600" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 border border-transparent"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-purple-600 dark:text-purple-400" : ""}`} />
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
          <GoalsTab />
        )}
      </main>
    </div>
  );
};
