"use client";

import React, { useState } from "react";
import { Check, X, Shield, Star, Crown, Zap, CheckCircle2 } from "lucide-react";

interface PricingProps {
  setActivePage: (page: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ setActivePage }) => {
  const [billing, setBilling] = useState<"monthly" | "annually">("monthly");

  const plans = [
    {
      title: "Starter",
      price: 0,
      desc: "Perfect for testing automated seeker matching.",
      icon: Shield,
      features: [
        "3 Active Job Openings",
        "Standard Skill Overlap Match",
        "ATS Markdown CV Viewer",
        "Basic Profile Search Filters"
      ],
      cta: "Activate Free",
      popular: false,
      color: "from-blue-500/20 to-cyan-500/20",
      textColor: "text-blue-500 dark:text-cyan-400",
      buttonStyle: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700",
    },
    {
      title: "Growth Pro",
      price: billing === "monthly" ? 99 : 79,
      desc: "Optimal for growing teams and active sourcing pipelines.",
      icon: Zap,
      features: [
        "15 Active Job Openings",
        "Advanced AI Match Index Scoring",
        "Simulated Screeners builder",
        "Priority Applicant Pipelines",
        "Detailed Sourcing CTR Analytics",
        "Direct Skills Recommender integration"
      ],
      cta: "Get Growth Pro",
      popular: true,
      color: "from-purple-600/20 to-fuchsia-600/20",
      textColor: "text-purple-600 dark:text-purple-400",
      buttonStyle: "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25",
    },
    {
      title: "Enterprise",
      price: "Custom",
      desc: "For corporate recruiting suites needing bespoke workflows.",
      icon: Crown,
      features: [
        "Unlimited Active Openings",
        "Custom ATS API integration",
        "Automated AI Headhunter suggestions",
        "Dedicated Account liaison",
        "Slack integration & custom branding",
        "Bulk seeker campaigns"
      ],
      cta: "Contact Sales",
      popular: false,
      color: "from-amber-500/20 to-orange-500/20",
      textColor: "text-amber-600 dark:text-amber-400",
      buttonStyle: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700",
    }
  ];

  const comparisonRows = [
    { name: "Active Vacancies", starter: "3 Slots", growth: "15 Slots", enterprise: "Unlimited" },
    { name: "AI Match Score Analysis", starter: "Standard", growth: "Advanced", enterprise: "Bespoke Model" },
    { name: "Applicant Filtering & Search", starter: "Basic keywords", growth: "Keywords + Skills Tagging", enterprise: "Full semantic search" },
    { name: "Hiring Analytics Dashboard", starter: "✕", growth: "Views/Clicks/CTR", enterprise: "Advanced Custom reports" },
    { name: "Custom API/ATS Integrations", starter: "✕", growth: "✕", enterprise: "✓" },
    { name: "Support Response SLA", starter: "Email (48h)", growth: "Priority (12h)", enterprise: "Dedicated Slack (Instant)" }
  ];

  return (
    <div className="relative w-full min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] overflow-hidden selection:bg-purple-500/30">
      {/* Ambient Background Elements */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-purple-500/10 dark:from-purple-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-purple-600/10 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute bottom-1/4 -right-64 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[150px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

      <div className="relative z-10 space-y-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fade-in">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Star className="w-3.5 h-3.5" />
            Simple & Transparent
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white">
            Pricing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">Every Pipeline</span>
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium">
            Unlock dynamic matching metrics. Seekers register for free; select an opportunity provider pricing plan below to scale your hiring efforts.
          </p>

          {/* Billing Switcher (Pill Style) */}
          <div className="flex justify-center pt-6">
            <div className="relative flex items-center p-1.5 bg-zinc-200/50 dark:bg-zinc-800/50 backdrop-blur-md rounded-full border border-zinc-300/50 dark:border-zinc-700/50 shadow-inner">
              <button
                onClick={() => setBilling("monthly")}
                className={`relative z-10 w-36 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                  billing === "monthly"
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                Bill Monthly
              </button>
              <button
                onClick={() => setBilling("annually")}
                className={`relative z-10 w-44 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  billing === "annually"
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                Bill Annually
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider transition-colors ${
                  billing === "annually" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-zinc-300 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                }`}>
                  Save 20%
                </span>
              </button>
              {/* Animated Background Pill */}
              <div 
                className="absolute top-1.5 bottom-1.5 w-36 bg-white dark:bg-zinc-700 rounded-full shadow-sm border border-zinc-200 dark:border-zinc-600 transition-transform duration-300 ease-out"
                style={{ transform: billing === "monthly" ? "translateX(0)" : "translateX(9rem)", width: billing === "monthly" ? "9rem" : "11rem" }}
              />
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((p, idx) => {
            const Icon = p.icon;
            const isPopular = p.popular;
            
            return (
              <div
                key={idx}
                className={`relative group flex flex-col justify-between rounded-[2.5rem] transition-all duration-500 ${
                  isPopular
                    ? "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border-2 border-purple-500/50 dark:border-purple-500/50 shadow-2xl shadow-purple-500/20 lg:-translate-y-4 lg:scale-105 z-20"
                    : "bg-white/50 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-xl hover:shadow-2xl hover:border-purple-500/30 dark:hover:border-purple-500/30"
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <div className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-purple-500/30 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8 sm:p-10 space-y-8 flex-1 flex flex-col">
                  {/* Card Header */}
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${p.color}`}>
                      <Icon className={`w-6 h-6 ${p.textColor}`} />
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-zinc-900 dark:text-white">{p.title}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 font-medium leading-relaxed">{p.desc}</p>
                    </div>
                  </div>

                  {/* Pricing Display */}
                  <div className="pt-4 pb-2">
                    {typeof p.price === "number" ? (
                      <div className="flex items-end gap-1">
                        <span className="text-5xl font-black text-zinc-900 dark:text-white tracking-tight">${p.price}</span>
                        <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-1.5">/mo</span>
                      </div>
                    ) : (
                      <span className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">{p.price}</span>
                    )}
                    {billing === "annually" && typeof p.price === "number" && (
                      <div className="text-xs font-bold text-emerald-500 mt-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Billed annually (${p.price * 12}/yr)
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex-1">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex gap-3 items-start group/feature">
                        <div className="w-5 h-5 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/feature:bg-purple-100 dark:group-hover/feature:bg-purple-500/20 transition-colors">
                          <Check className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-tight group-hover/feature:text-zinc-900 dark:group-hover/feature:text-zinc-100 transition-colors">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="p-8 sm:p-10 pt-0">
                  <button
                    onClick={() => {
                      if (p.title === "Enterprise") {
                        setActivePage("contact");
                      } else {
                        setActivePage("signup");
                      }
                    }}
                    className={`w-full py-4 rounded-2xl text-sm font-black tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group ${p.buttonStyle}`}
                  >
                    {p.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Dive Comparison Table */}
        <div className="max-w-5xl mx-auto pt-10">
          <div className="text-center space-y-3 mb-10">
            <h3 className="font-black text-2xl sm:text-3xl text-zinc-900 dark:text-white">
              Feature Comparison
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Compare plans to find the right fit for your hiring workflow.</p>
          </div>

          <div className="glass-panel rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <th className="py-6 px-6 font-black text-xs uppercase tracking-widest text-zinc-500 w-1/3">Feature Details</th>
                    <th className="py-6 px-6 font-black text-sm text-zinc-900 dark:text-zinc-100">Starter</th>
                    <th className="py-6 px-6 font-black text-sm text-purple-600 dark:text-purple-400 flex items-center gap-2">
                      Growth Pro <Star className="w-4 h-4 fill-current" />
                    </th>
                    <th className="py-6 px-6 font-black text-sm text-zinc-900 dark:text-zinc-100">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {comparisonRows.map((row, i) => (
                    <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                      <td className="py-5 px-6 font-bold text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{row.name}</td>
                      <td className="py-5 px-6 font-medium text-sm text-zinc-600 dark:text-zinc-400">
                        {row.starter === "✓" ? <Check className="w-5 h-5 text-emerald-500" /> : row.starter === "✕" ? <X className="w-5 h-5 text-zinc-300 dark:text-zinc-700" /> : row.starter}
                      </td>
                      <td className="py-5 px-6 font-medium text-sm text-zinc-600 dark:text-zinc-400 bg-purple-50/30 dark:bg-purple-500/5 group-hover:bg-purple-50 dark:group-hover:bg-purple-500/10 transition-colors">
                        {row.growth === "✓" ? <Check className="w-5 h-5 text-purple-500" /> : row.growth === "✕" ? <X className="w-5 h-5 text-zinc-300 dark:text-zinc-700" /> : <span className="font-bold text-purple-700 dark:text-purple-300">{row.growth}</span>}
                      </td>
                      <td className="py-5 px-6 font-medium text-sm text-zinc-900 dark:text-zinc-100 font-bold">
                        {row.enterprise === "✓" ? <Check className="w-5 h-5 text-zinc-900 dark:text-white" /> : row.enterprise}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
