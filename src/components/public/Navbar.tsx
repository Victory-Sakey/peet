"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Menu, X, Plus } from "lucide-react";

interface PublicNavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ activePage, setActivePage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "browse", label: "Browse Opportunities" },
    { id: "ai-suite", label: "AI Career Suite" },
    { id: "pricing", label: "Pricing" }
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-black/60 backdrop-blur-md border-b border-zinc-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick("home")}>
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-purple-500/20 shadow-lg flex items-center justify-center shrink-0">
              <Image
                src="/peet_logo.jpg"
                alt="PEET Logo"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-white hover:text-purple-400 transition-colors">
              Peet
            </span>
            
          </div>

          {/* Center Links - Slim & Compact */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "text-purple-400 bg-purple-500/5"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Post Opportunity Button */}
            <button
              onClick={() => {
                handleNavClick("post-opportunity");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold transition-all shadow-md shadow-purple-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Opportunity</span>
            </button>



            {/* Auth Buttons */}
            <button
              onClick={() => handleNavClick("login")}
              className="px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => handleNavClick("signup")}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-750 text-white rounded-lg text-xs font-bold transition-all"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-900/60 py-3 px-4 space-y-2.5 bg-black">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold block ${
                activePage === link.id
                  ? "text-purple-400 bg-purple-500/5"
                  : "text-zinc-400 hover:bg-zinc-900"
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-zinc-900/60 flex flex-col gap-2">
            {/* Post Opportunity Button */}
            <button
              onClick={() => {
                handleNavClick("post-opportunity");
              }}
              className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1 shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              Post Opportunity
            </button>


            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleNavClick("login")}
                className="py-2 text-center text-xs font-bold text-zinc-450 hover:text-white"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick("signup")}
                className="py-2 text-center bg-purple-600 text-white rounded-lg text-xs font-bold"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
