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
          <main className="w-full">
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
              <div className="animate-fade-in">
                {/* SearchTab acts as Browse Opportunities in visitor mode */}
                <SearchTab />
              </div>
            )}
            {activePage === "ai-suite" && <AiSuitePage setActivePage={setActivePage} />}
            {activePage === "pricing" && <Pricing setActivePage={setActivePage} />}
            {activePage === "login" && <Auth initialTab="login" setActivePage={setActivePage} />}
            {activePage === "signup" && <Auth initialTab="signup" setActivePage={setActivePage} />}
            {activePage === "post-opportunity" && (
              <div className="animate-fade-in">
                <PostOpportunityPage />
              </div>
            )}
          </main>
        </>
      )}

      {/* Global Footer (Hidden in Dashboard) */}
      {!isDashboard && (
        <footer className="w-full bg-[#05030a] relative overflow-hidden mt-auto pt-20 pb-10 z-10 border-t border-white/5">
        {/* Ambient Footer Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 rounded-[100%] blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/5">
            {/* Brand & Tagline */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-4">
                <Image
                  src="/peet_logo.jpg"
                  alt="PEET Logo"
                  width={44}
                  height={44}
                  className="rounded-xl object-cover border border-white/10 shadow-lg shadow-purple-500/20"
                />
                <span className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400">
                  PEET
                </span>
              </div>
              <p className="text-zinc-400 leading-relaxed font-medium max-w-sm">
                The unified platform for work, education, and career growth. Navigating your future is no longer a straight line—it's a network of possibilities.
              </p>
            </div>

            {/* Links Area */}
            <div className="md:col-span-7 flex flex-wrap gap-12 md:justify-end lg:gap-24">
              {/* Column 1 */}
              <div className="space-y-6">
                <h4 className="text-white font-bold tracking-wide">Platform</h4>
                <ul className="space-y-4">
                  {[
                    { label: "Browse Opportunities", page: "browse" },
                    { label: "Post Opportunity", page: "post-opportunity" },
                  ].map((link, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => setActivePage(link.page)}
                        className="text-zinc-400 hover:text-purple-400 transition-colors font-medium cursor-pointer"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2 */}
              <div className="space-y-6">
                <h4 className="text-white font-bold tracking-wide">Company</h4>
                <ul className="space-y-4">
                  {[
                    { label: "About Peet", page: "home" },
                    { label: "Contact", page: "home" },
                    { label: "Terms & Privacy", page: "home" }
                  ].map((link, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => setActivePage(link.page)}
                        className="text-zinc-400 hover:text-purple-400 transition-colors font-medium cursor-pointer"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom copyright area */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm font-medium text-zinc-500">
            <div>
              © {new Date().getFullYear()} PEET AI. All rights reserved.
            </div>
            <div className="flex gap-6">
              <span className="hover:text-purple-400 transition-colors cursor-pointer">Security</span>
              <span className="hover:text-purple-400 transition-colors cursor-pointer">Status</span>
              <span className="hover:text-purple-400 transition-colors cursor-pointer">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}
