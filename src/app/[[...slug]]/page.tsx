"use client";

import React, { useEffect } from "react";
import Image from "next/image";
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
    <div className="peet-bg min-h-screen flex flex-col font-sans transition-all duration-500 overflow-x-hidden">
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

          <main className="flex-1 w-full pt-14 pb-12">
            {activePage === "home" && <Hero setActivePage={setActivePage} />}
            {activePage === "browse" && (
              <div className="space-y-4 pt-4">
                <div className="max-w-7xl mx-auto px-4">
                  <button
                    onClick={() => setActivePage("home")}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-500 hover:text-purple-600 transition-colors"
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
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-500 hover:text-purple-600 transition-colors"
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
      <footer className="w-full border-t border-purple-950/80 bg-[#0c0817] mt-auto pt-16 pb-12 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-purple-950/60">
            {/* Logo and Tagline */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/peet_logo.jpg"
                  alt="PEET Logo"
                  width={32}
                  height={32}
                  className="rounded-lg object-cover border border-purple-500/20 shadow-md"
                />
                <span className="text-xl font-extrabold tracking-tight text-white">
                  PEET
                </span>
              </div>
              <p className="text-sm text-purple-200/65 max-w-sm leading-relaxed font-semibold">
                The unified platform for work, education, and career growth. Navigating your future is no longer a straight line—it's a network of possibilities.
              </p>
              {/* Interactive status indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All systems operational</span>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="col-span-6 md:col-span-2 md:col-start-7 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-purple-300">
                Platform
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Home", page: "home" },
                  { label: "Browse Listings", page: "browse" },
                  { label: "AI Career Suite", page: "ai-suite" },
                  { label: "Pricing Plans", page: "pricing" }
                ].map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => setActivePage(link.page)}
                      className="text-sm font-semibold text-purple-200/60 hover:text-purple-400 transition-colors text-left cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div className="col-span-6 md:col-span-2 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-purple-300">
                Resources
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Help Center", page: "home" },
                  { label: "ATS Guidelines", page: "home" },
                  { label: "Documentation", page: "home" },
                  { label: "API Reference", page: "home" }
                ].map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => setActivePage(link.page)}
                      className="text-sm font-semibold text-purple-200/60 hover:text-purple-400 transition-colors text-left cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div className="col-span-6 md:col-span-2 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-purple-300">
                Company
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "About Us", page: "home" },
                  { label: "Careers", page: "home" },
                  { label: "Privacy Policy", page: "home" },
                  { label: "Terms of Service", page: "home" }
                ].map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => setActivePage(link.page)}
                      className="text-sm font-semibold text-purple-200/60 hover:text-purple-400 transition-colors text-left cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom copyright area */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-purple-300/40">
            <div>
              © {new Date().getFullYear()} PEET AI. Real-time matching index & ATS developer portfolios.
            </div>
            <div className="flex gap-4">
              <span className="hover:text-purple-300 cursor-pointer">Security</span>
              <span>•</span>
              <span className="hover:text-purple-300 cursor-pointer">Status</span>
              <span>•</span>
              <span className="hover:text-purple-300 cursor-pointer">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
