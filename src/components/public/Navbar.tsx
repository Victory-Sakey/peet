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
    { id: "pricing", label: "Pricing" }
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white/60 dark:bg-black/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60 border-b border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavClick("home")}>
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

          {/* Center Links - Minimalist styling */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? "text-black dark:text-white"
                      : "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">


            {/* Auth Buttons */}
            <button
              onClick={() => handleNavClick("login")}
              className="px-4 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-full text-sm font-medium transition-colors shadow-sm cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => handleNavClick("signup")}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm font-medium transition-colors shadow-sm cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-900 dark:text-white hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden absolute top-[100%] left-0 w-full bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-b border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-300 ease-in-out origin-top overflow-hidden shadow-xl ${
          mobileMenuOpen ? "opacity-100 max-h-[500px] scale-y-100" : "opacity-0 max-h-0 scale-y-95 pointer-events-none"
        }`}
      >
        <div className="flex flex-col p-4 gap-2 max-w-[1400px] mx-auto">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors cursor-pointer ${
                activePage === link.id
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              {link.label}
            </button>
          ))}
          
          <div className="pt-3 mt-1 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-2">


            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={() => handleNavClick("login")}
                className="py-3 text-center font-semibold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick("signup")}
                className="py-3 text-center bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors shadow-sm cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

