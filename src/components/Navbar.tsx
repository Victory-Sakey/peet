"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { Sun, Moon, Briefcase, User, Sparkles, FolderKanban, ShieldCheck, Bell, Users, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const router = useRouter();
  const {
    theme,
    toggleTheme,
    userType,
    setUserType,
    notifications,
    markNotificationAsRead,
    clearNotifications
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab(userType === "admin" ? "admin" : (userType === "provider" ? "provider" : "seeker"))}>
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-purple-500/20 shadow-md flex items-center justify-center shrink-0">
              <Image
                src="/peet_logo.jpg"
                alt="PEET Logo"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-purple-600 dark:from-white dark:to-purple-300 bg-clip-text text-transparent">
              peet
            </span>
            <span className="text-[10px] font-semibold bg-purple-500/20 text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
              AI
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            {userType === "seeker" ? (
              <button
                onClick={() => setActiveTab("seeker")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-purple-600/15 text-purple-600 dark:text-purple-300 animate-fade-in"
              >
                <FolderKanban className="w-4 h-4" />
                Seeker Workspace
              </button>
            ) : userType === "provider" ? (
              <button
                onClick={() => setActiveTab("provider")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-purple-600/15 text-purple-600 dark:text-purple-300"
              >
                <FolderKanban className="w-4 h-4" />
                Provider Workspace
              </button>
            ) : (
              <button
                onClick={() => setActiveTab("admin")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-purple-650/15 text-purple-600 dark:text-purple-300"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Workspace
              </button>
            )}
          </nav>

          {/* Settings & Toggle Actions */}
          <div className="flex items-center gap-3">
            
            {/* Post Opportunity Button */}
            <button
              onClick={() => {
                router.push("/post-opportunity");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20"
            >
              <Plus className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">Post Opportunity</span>
            </button>

            {/* User Type Switcher */}
            <div className="flex bg-zinc-100 dark:bg-zinc-900/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => {
                  setUserType("seeker");
                  setActiveTab("seeker");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  userType === "seeker"
                    ? "bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-300 shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Seeker
              </button>
              <button
                onClick={() => {
                  setUserType("provider");
                  setActiveTab("provider");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  userType === "provider"
                    ? "bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-300 shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Provider
              </button>
              <button
                onClick={() => {
                  setUserType("admin");
                  setActiveTab("admin");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  userType === "admin"
                    ? "bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-300 shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>

            {/* Notifications Dropdown Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 hover:text-purple-600 dark:hover:bg-zinc-800/80 dark:hover:text-purple-300 transition-colors shadow-sm"
                aria-label="Toggle Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl shadow-2xl p-4 border border-purple-500/20 z-50 text-xs space-y-3 animate-scale-up">
                  <div className="flex justify-between items-center pb-2 border-b border-purple-500/10">
                    <span className="font-extrabold text-sm text-zinc-800 dark:text-zinc-150">Notifications</span>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-[10px] text-zinc-500 hover:text-purple-600"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <div className="text-zinc-500 italic py-6 text-center">
                        No alerts to display
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                          }}
                          className={`p-2.5 rounded-xl border transition-colors cursor-pointer text-left ${
                            n.read
                              ? "bg-zinc-50/20 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-900"
                              : "bg-purple-600/5 border-purple-550/20 text-purple-600 dark:text-purple-300"
                          }`}
                        >
                          <div className="font-bold mb-0.5">{n.title}</div>
                          <div className="text-[11px] text-zinc-500 leading-relaxed">{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-55 hover:text-purple-600 dark:hover:bg-zinc-800/80 dark:hover:text-purple-300 transition-colors shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      <div className="md:hidden flex border-t border-purple-500/10 justify-around py-2 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        {userType === "seeker" ? (
          <button
            onClick={() => {
              setActiveTab("seeker");
              setShowNotifications(false);
            }}
            className="flex flex-col items-center gap-1 py-1 px-3 text-purple-600 dark:text-purple-300"
          >
            <FolderKanban className="w-5 h-5" />
            <span className="text-[10px] font-medium">Workspace</span>
          </button>
        ) : userType === "provider" ? (
          <button
            onClick={() => setActiveTab("provider")}
            className="flex flex-col items-center gap-1 py-1 px-3 text-purple-600 dark:text-purple-300"
          >
            <FolderKanban className="w-5 h-5" />
            <span className="text-[10px] font-medium">Workspace</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab("admin")}
            className="flex flex-col items-center gap-1 py-1 px-3 text-purple-600 dark:text-purple-300"
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-medium">Workspace</span>
          </button>
        )}
      </div>
    </header>
  );
};
