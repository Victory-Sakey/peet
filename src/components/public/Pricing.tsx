"use client";

import React, { useState } from "react";
import { Check, X, Shield, Star, Crown } from "lucide-react";

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
      popular: false
    },
    {
      title: "Growth",
      price: billing === "monthly" ? 99 : 79,
      desc: "Optimal for growing teams and active sourcing pipelines.",
      icon: Star,
      features: [
        "15 Active Job Openings",
        "Advanced AI Match Index Scoring",
        "Simulated Screeners builder",
        "Priority Applicant Pipelines",
        "Detailed Sourcing CTR Analytics",
        "Direct Skills Recommender integration"
      ],
      cta: "Get Growth Pro",
      popular: true
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
      popular: false
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
    <div className="space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900">
          Sleek Pricing for <span className="text-gradient">Every Pipeline</span>
        </h2>
        <p className="text-zinc-550 text-xs max-w-md mx-auto leading-relaxed">
          Unlock dynamic matching metrics. Seekers register for free; select an opportunity provider pricing plan below.
        </p>

        {/* Billing Switcher */}
        <div className="inline-flex bg-zinc-100 p-1 rounded-xl border border-zinc-900 mt-4">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              billing === "monthly"
                ? "bg-zinc-100 text-purple-600 shadow-sm"
                : "text-zinc-555 hover:text-purple-800"
            }`}
          >
            Bill Monthly
          </button>
          <button
            onClick={() => setBilling("annually")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              billing === "annually"
                ? "bg-zinc-100 text-purple-600 shadow-sm"
                : "text-zinc-555 hover:text-purple-800"
            }`}
          >
            Bill Annually <span className="text-emerald-500 text-[10px] ml-0.5 font-bold">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {plans.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className={`glass-panel rounded-2xl p-5 border relative flex flex-col justify-between ${
                p.popular
                  ? "border-purple-650 shadow-xl shadow-purple-500/10 lg:scale-102 z-10"
                  : "border-purple-100"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded tracking-wider">
                  Popular Option
                </span>
              )}

              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-sm text-zinc-850">{p.title}</h3>
                    <p className="text-[10px] text-zinc-650 pt-0.5 leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-purple-600/10 text-purple-450 flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                </div>

                <div>
                  {typeof p.price === "number" ? (
                    <div className="flex items-baseline">
                      <span className="text-3xl font-extrabold text-zinc-900">${p.price}</span>
                      <span className="text-[10px] text-zinc-650 font-bold ml-1">/ month</span>
                    </div>
                  ) : (
                    <span className="text-2xl font-extrabold text-zinc-900">{p.price}</span>
                  )}
                  {billing === "annually" && typeof p.price === "number" && (
                    <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">Billed annually</span>
                  )}
                </div>

                <ul className="space-y-2 pt-4 border-t border-zinc-200 text-xs">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex gap-2 items-start text-zinc-600">
                      <Check className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  if (p.title === "Enterprise") {
                    setActivePage("contact");
                  } else {
                    setActivePage("signup");
                  }
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold mt-6 transition-colors ${
                  p.popular
                    ? "bg-purple-600 hover:bg-purple-750 text-white"
                    : "bg-purple-600/10 hover:bg-purple-650/25 text-purple-600 border border-purple-500/15"
                }`}
              >
                {p.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* Comparison table */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <h3 className="font-extrabold text-xs text-zinc-850">
          Features Comparison Checklist
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-900">
                <th className="py-2.5 font-extrabold text-zinc-550 w-1/3">Recruitment Metric</th>
                <th className="py-2.5 font-extrabold text-purple-800">Starter</th>
                <th className="py-2.5 font-extrabold text-purple-800">Growth</th>
                <th className="py-2.5 font-extrabold text-purple-800">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={i} className="border-b border-zinc-900/40 hover:bg-zinc-100 transition-colors">
                  <td className="py-3 font-bold text-zinc-600">{row.name}</td>
                  <td className="py-3 text-zinc-500">
                    {row.starter === "✓" ? <Check className="w-3.5 h-3.5 text-purple-600" /> : row.starter === "✕" ? <X className="w-3.5 h-3.5 text-zinc-650" /> : row.starter}
                  </td>
                  <td className="py-3 text-zinc-500">
                    {row.growth === "✓" ? <Check className="w-3.5 h-3.5 text-purple-600" /> : row.growth === "✕" ? <X className="w-3.5 h-3.5 text-zinc-650" /> : row.growth}
                  </td>
                  <td className="py-3 text-purple-600 font-bold">
                    {row.enterprise === "✓" ? <Check className="w-3.5 h-3.5 text-purple-600" /> : row.enterprise}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
