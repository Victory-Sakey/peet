"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Check, Send, ChevronDown } from "lucide-react";

export const Contact: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Opportunity Seeker");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
      {/* Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Get in Touch with <span className="text-gradient">PEET Support</span>
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">
          Have query on pricing, integrations, or support tools? Fill in details below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 glass-panel rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-4"
        >
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-150">Inquiry Sheet</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 text-xs"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 text-xs"
                  placeholder="e.g. john@mail.com"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] font-bold text-zinc-400 block mb-1">Perspective Role</label>
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 text-xs text-left flex items-center justify-between text-zinc-700 dark:text-zinc-300 transition-all select-none cursor-pointer"
              >
                <span>{role}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isRoleDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {isRoleDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsRoleDropdownOpen(false)} />
                  <div className="absolute top-full left-0 right-0 mt-1 z-40 max-h-40 overflow-y-auto glass-panel rounded-xl p-1.5 border border-purple-500/20 shadow-xl scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    {["Opportunity Seeker", "Opportunity Provider", "Partner Developer / Integration"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setRole(r);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          role === r
                            ? "bg-purple-650 text-white"
                            : "text-zinc-455 hover:text-zinc-200 hover:bg-purple-500/10"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-400 block mb-1">Your Message</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 text-xs resize-none"
                placeholder="What can we help you solve?"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
          >
            <Send className="w-4 h-4" />
            Send Inquiry
          </button>

          {success && (
            <div className="text-center text-xs font-bold text-emerald-500 bg-emerald-500/10 p-2.5 rounded-xl animate-pulse flex items-center justify-center gap-1">
              <Check className="w-4 h-4" /> Message delivered successfully! We'll reply within 12 hours.
            </div>
          )}
        </form>

        {/* Right Info pane */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          <div className="glass-panel rounded-3xl p-6 border border-purple-500/5 space-y-6 flex-1 flex flex-col justify-center">
            <h3 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-150">Global Coordinates</h3>

            <div className="space-y-4">
              <div className="flex gap-3.5 items-start">
                <div className="w-9 h-9 bg-purple-600/10 text-purple-600 dark:text-purple-300 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-750 dark:text-zinc-200">Corporate HQ</div>
                  <div className="text-[10px] text-zinc-400 leading-relaxed">
                    100 Shoreditch High St, London E1 6JN, United Kingdom
                  </div>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-9 h-9 bg-purple-600/10 text-purple-600 dark:text-purple-300 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-750 dark:text-zinc-200">Support Hotline</div>
                  <div className="text-[10px] text-zinc-400">+44 20 7946 0958</div>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-9 h-9 bg-purple-600/10 text-purple-600 dark:text-purple-300 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-750 dark:text-zinc-200">Email Inquiry</div>
                  <div className="text-[10px] text-zinc-400">liaison@peethire.ai</div>
                </div>
              </div>
            </div>
          </div>

          {/* Map mockup */}
          <div className="glass-panel rounded-3xl p-4 border border-purple-500/5 bg-zinc-50 dark:bg-zinc-950/80 min-h-[160px] flex items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#9333ea_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
            <div className="space-y-1 relative z-10">
              <span className="text-xs font-bold block text-zinc-700 dark:text-zinc-300">Office Location Map</span>
              <span className="text-[9px] text-zinc-400 font-medium">Click to open directions in Google Maps</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
