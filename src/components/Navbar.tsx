"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const router = useRouter();
  const {
    userType,
    notifications,
    markNotificationAsRead,
    clearNotifications
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/60 dark:bg-black/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60 border-b border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-300">
      <div className="flex items-center justify-between h-14 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab(userType === "admin" ? "admin" : (userType === "provider" ? "provider" : "seeker"))}>
          <div className="relative w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-transform group-hover:scale-105">
            <Image
              src="/peet_logo.jpg"
              alt="PEET Logo"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
            Peet
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">

          {/* Notifications Dropdown Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-zinc-200/50 dark:border-zinc-800 z-50 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-200/50 dark:border-zinc-800">
                  <span className="font-semibold text-sm text-zinc-900 dark:text-white">Notifications</span>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[10px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="text-zinc-500 py-6 text-center">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 rounded-xl transition-colors cursor-pointer text-left ${
                          n.read
                            ? "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            : "bg-zinc-100 dark:bg-zinc-800/80"
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

        </div>
      </div>
    </header>
  );
};
