"use client";

import React, { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { usePathname, useRouter } from "next/navigation";

// Public Marketing Landing Page components
import { PublicNavbar } from "@/components/public/Navbar";
import { Hero } from "@/components/public/Hero";
import { AiSuitePage } from "@/components/public/AiSuitePage";
import { Pricing } from "@/components/public/Pricing";
import { Auth } from "@/components/public/Auth";

// Logged In App Workspace components
import { Navbar as AppNavbar } from "@/components/Navbar";
import { SearchTab } from "@/components/SearchTab";
import { SeekerTab } from "@/components/SeekerTab";
import { ProviderTab } from "@/components/ProviderTab";
import { AdminTab } from "@/components/AdminTab";
import { PostOpportunityPage } from "@/components/PostOpportunityPage";

import { LogOut, ArrowLeft } from "lucide-react";

export default function Home() {
  const { userType, setUserType } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  // Parse path segments to derive page and active dashboard tab
  const segments = pathname ? pathname.split("/").filter(Boolean) : [];
  const activePage = segments[0] || "home";

  const getDashboardFallback = (type: string) => {
    if (type === "provider") return "provider";
    if (type === "admin") return "admin";
    return "seeker";
  };
  const appActiveTab = activePage === "dashboard" ? (segments[1] || getDashboardFallback(userType)) : getDashboardFallback(userType);

  // Helpers to trigger route navigation
  const setActivePage = (page: string) => {
    if (page === "home") {
      router.push("/");
    } else {
      router.push(`/${page}`);
    }
  };

  const setAppActiveTab = (tab: string) => {
    router.push(`/dashboard/${tab}`);
  };

  // Handle logout
  const handleLogout = () => {
    setUserType("seeker");
    router.push("/");
  };

  // Redirect to correct dashboard tab if userType changes or workspace type doesn't match
  useEffect(() => {
    if (activePage === "dashboard") {
      if (userType === "provider" && appActiveTab !== "provider") {
        router.push("/dashboard/provider");
      } else if (userType === "admin" && appActiveTab !== "admin") {
        router.push("/dashboard/admin");
      } else if (userType === "seeker" && appActiveTab !== "seeker") {
         router.push("/dashboard/seeker");
      }
    }
  }, [userType, activePage, appActiveTab, router]);

  const isDashboard = activePage === "dashboard";

  return (
    <div className="peet-bg min-h-screen flex flex-col font-sans transition-all duration-500">
      {isDashboard ? (
        /* ================= APPS WORKSPACE (LOGGED IN) ================= */
        <>
          <AppNavbar activeTab={appActiveTab} setActiveTab={setAppActiveTab} />

          {/* Quick return/logout action bar */}
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-3 flex justify-between items-center text-[10px]">
            <span className="text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
              ⚡ Sandbox Demo Environment
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold transition-colors border border-red-500/10"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>

          <main className="flex-1 w-full pb-12">
            {appActiveTab === "seeker" && <SeekerTab />}
            {appActiveTab === "provider" && <ProviderTab />}
            {appActiveTab === "admin" && <AdminTab />}
          </main>
        </>
      ) : (
        /* ================= PUBLIC MARKETING SITE ================= */
        <>
          <PublicNavbar activePage={activePage} setActivePage={setActivePage} />

          <main className="flex-1 w-full pb-12">
            {activePage === "home" && <Hero setActivePage={setActivePage} />}
            {activePage === "browse" && (
              <div className="space-y-4 pt-4">
                <div className="max-w-7xl mx-auto px-4">
                  <button
                    onClick={() => setActivePage("home")}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-500 hover:text-purple-400 transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" /> Back to Marketing
                  </button>
                </div>
                {/* SearchTab acts as Browse Opportunities in visitor mode */}
                <SearchTab />
              </div>
            )}
            {activePage === "ai-suite" && <AiSuitePage setActivePage={setActivePage} />}
            {activePage === "pricing" && <Pricing setActivePage={setActivePage} />}
            {activePage === "login" && <Auth initialTab="login" setActivePage={setActivePage} />}
            {activePage === "signup" && <Auth initialTab="signup" setActivePage={setActivePage} />}
            {activePage === "post-opportunity" && (
              <div className="space-y-4 pt-4 animate-fade-in">
                <div className="max-w-7xl mx-auto px-4">
                  <button
                    onClick={() => setActivePage("home")}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-500 hover:text-purple-400 transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" /> Back to Marketing
                  </button>
                </div>
                <PostOpportunityPage />
              </div>
            )}
          </main>
        </>
      )}

      {/* Global Footer */}
      <footer className="w-full border-t border-zinc-900/60 py-5 text-center text-[10px] text-zinc-500 bg-black backdrop-blur-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            © {new Date().getFullYear()} PEET AI. Real-time matching index & ATS developer portfolios.
          </div>
          <div className="flex gap-4 font-semibold text-zinc-550">
            <button
              onClick={() => setActivePage("home")}
              className="hover:text-purple-400 transition-colors"
            >
              Home
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePage("browse")}
              className="hover:text-purple-400 transition-colors"
            >
              Browse Opportunities
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePage("ai-suite")}
              className="hover:text-purple-400 transition-colors"
            >
              AI Suite
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePage("pricing")}
              className="hover:text-purple-400 transition-colors"
            >
              Pricing Plans
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
