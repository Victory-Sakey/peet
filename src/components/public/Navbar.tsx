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
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-purple-100/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick("home")}>
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-purple-200/60 shadow-md flex items-center justify-center shrink-0">
              <Image
                src="/peet_logo.jpg"
                alt="PEET Logo"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <span className="text-2xl font-bold tracking-tight text-black hover:opacity-85 transition-opacity">
              Peet
            </span>
          </div>

          {/* Center Links - Modern Pill styling */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "text-purple-700 bg-purple-600/10 font-bold"
                      : "text-zinc-600 hover:text-purple-600 hover:bg-purple-50"
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
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20 hover:bg-purple-700 hover:-translate-y-0.5 duration-200 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Opportunity</span>
            </button>

            {/* Auth Buttons */}
            <button
              onClick={() => handleNavClick("login")}
              className="px-3.5 py-2 text-sm font-bold text-zinc-650 hover:text-purple-600 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => handleNavClick("signup")}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-750 text-white rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 duration-200 cursor-pointer shadow-md shadow-purple-500/10"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-purple-600/10 text-zinc-600 hover:text-purple-600 transition-colors cursor-pointer"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer (absolutely positioned below navbar) */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 w-full border-b border-purple-100/50 bg-white/95 backdrop-blur-lg shadow-xl py-4 px-6 space-y-4 animate-in slide-in-from-top duration-300 rounded-b-2xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 block cursor-pointer ${
                  activePage === link.id
                    ? "text-purple-700 bg-purple-600/10 font-bold"
                    : "text-zinc-600 hover:bg-purple-50 hover:text-purple-650 font-semibold"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
          
          <div className="pt-3 border-t border-purple-100/50 flex flex-col gap-3">
            {/* Post Opportunity Button */}
            <button
              onClick={() => {
                handleNavClick("post-opportunity");
              }}
              className="w-full py-3 rounded-xl bg-purple-600 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20 hover:bg-purple-700 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post Opportunity</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleNavClick("login")}
                className="py-3 text-center text-xs font-bold text-zinc-600 hover:text-purple-600 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick("signup")}
                className="py-3 text-center bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-750 transition-colors shadow-sm cursor-pointer"
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

