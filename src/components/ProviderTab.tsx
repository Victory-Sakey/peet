"use client";

import React, { useState } from "react";
import { useApp, Opportunity, Application } from "@/context/AppContext";
import { Building2, Plus, Users, Search, BarChart3, Trash2, Eye, MousePointer, ChevronDown } from "lucide-react";
import { OpportunityIcon } from "./OpportunityIcon";

export const ProviderTab: React.FC = () => {
  const { opportunities, deleteOpportunity, applications, updateApplicationStatus, setIsPostOpportunityOpen } = useApp();

  // Sub tab selection
  const [provSubTab, setProvSubTab] = useState<"jobs" | "applicants" | "seekers" | "profile">("jobs");

  // Seeker search state
  const [seekerSearch, setSeekerSearch] = useState("");

  // Company Profile states
  const [companyName, setCompanyName] = useState("PixelCraft Agency");
  const [companyIndustry, setCompanyIndustry] = useState("Digital Solutions & Web Design");
  const [companySize, setCompanySize] = useState("50-100 Members");
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [companySite, setCompanySite] = useState("https://pixelcraft.io");
  const [companySuccessMessage, setCompanySuccessMessage] = useState(false);

  // Mock seekers database for Talent Search
  const mockSeekers = [
    {
      name: "Sarah Jenkins",
      title: "Lead UI Designer",
      skills: ["Figma", "UI Design", "Prototyping", "Typography", "Framer Motion"],
      location: "Los Angeles, CA",
      experience: "5+ Years",
      score: 95
    },
    {
      name: "Michael Chen",
      title: "Cloud DevOps Specialist",
      skills: ["AWS", "Docker", "Bash", "Python", "Kubernetes", "CI/CD"],
      location: "San Jose, CA",
      experience: "4 Years",
      score: 88
    },
    {
      name: "David K.",
      title: "Front-End Engineer",
      skills: ["React", "TypeScript", "Tailwind CSS", "HTML", "CSS", "Git", "Next.js"],
      location: "Chicago, IL",
      experience: "2 Years",
      score: 75
    },
    {
      name: "Elena Rostova",
      title: "AI Researcher",
      skills: ["Python", "PyTorch", "Transformers", "NLP", "Machine Learning", "Hugging Face"],
      location: "Boston, MA",
      experience: "3 Years",
      score: 92
    }
  ];

  const filteredSeekers = mockSeekers.filter(
    (s) =>
      s.name.toLowerCase().includes(seekerSearch.toLowerCase()) ||
      s.title.toLowerCase().includes(seekerSearch.toLowerCase()) ||
      s.skills.some((sk) => sk.toLowerCase().includes(seekerSearch.toLowerCase()))
  );

  const handleUpdateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setCompanySuccessMessage(true);
    setTimeout(() => setCompanySuccessMessage(false), 2000);
  };

  // Filter local opportunities posted by the active provider
  const providerOpps = opportunities.filter(o => o.provider.toLowerCase() === companyName.toLowerCase() || o.id.startsWith("opp-"));

  // Compute analytics
  const totalViews = providerOpps.reduce((acc, o) => acc + (o.analytics?.views || 0), 0);
  const totalClicks = providerOpps.reduce((acc, o) => acc + (o.analytics?.clicks || 0), 0);
  const clickThroughRate = totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Subtab navigation */}
      <div className="flex flex-wrap border-b border-purple-500/10 gap-2 pb-px justify-center md:justify-start">
        {[
          { id: "jobs", label: "Postings & Analytics", icon: BarChart3 },
          { id: "applicants", label: "Manage Applicants", icon: Users },
          { id: "seekers", label: "Seeker Talent Pool", icon: Search },
          { id: "profile", label: "Provider Profile Workspace", icon: Building2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = provSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setProvSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? "border-purple-600 text-purple-600 dark:text-purple-300"
                  : "border-transparent text-zinc-500 hover:text-purple-600"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {provSubTab === "jobs" && (
        <div className="space-y-8 animate-fade-in">
          {/* Analytics Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel rounded-3xl p-5 border border-purple-500/5 space-y-1 relative">
              <span className="text-zinc-400 text-xs font-bold block">Active Listings</span>
              <span className="text-3xl font-extrabold text-gradient">{providerOpps.length}</span>
              <span className="text-[10px] text-zinc-500 block">Open for applications & enrollment</span>
            </div>

            <div className="glass-panel rounded-3xl p-5 border border-purple-500/5 space-y-1">
              <span className="text-zinc-400 text-xs font-bold block">Total Impressions</span>
              <span className="text-3xl font-extrabold text-zinc-700 dark:text-zinc-200">
                {totalViews.toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-500 block flex items-center gap-0.5">
                <Eye className="w-3.5 h-3.5" /> views recorded
              </span>
            </div>

            <div className="glass-panel rounded-3xl p-5 border border-purple-500/5 space-y-1">
              <span className="text-zinc-400 text-xs font-bold block">Applications</span>
              <span className="text-3xl font-extrabold text-zinc-700 dark:text-zinc-200">
                {applications.length}
              </span>
              <span className="text-[10px] text-zinc-500 block flex items-center gap-0.5">
                <MousePointer className="w-3.5 h-3.5" /> total applications
              </span>
            </div>

            <div className="glass-panel rounded-3xl p-5 border border-purple-500/5 space-y-1">
              <span className="text-zinc-400 text-xs font-bold block">Conversion CTR</span>
              <span className="text-3xl font-extrabold text-zinc-700 dark:text-zinc-200">
                {clickThroughRate}%
              </span>
              <span className="text-[10px] text-zinc-500 block">Views to clicks conversion</span>
            </div>
          </div>

          {/* Opportunity management and Action Header */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="font-extrabold text-base text-zinc-800 dark:text-zinc-100">Your Active Listings</h3>
                <p className="text-xs text-zinc-400">Post new opportunities or audit active listing page views.</p>
              </div>
              <button
                onClick={() => setIsPostOpportunityOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-purple-500/20"
              >
                <Plus className="w-4 h-4" />
                Post New Opportunity
              </button>
            </div>

            {/* List of active listings */}
            <div className="space-y-3 pt-2">
              {providerOpps.map((opp) => (
                <div
                  key={opp.id}
                  className="p-4 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-2xl border border-purple-500/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
                >
                  <div className="flex gap-3 items-start flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                      opp.type === "education"
                        ? "bg-emerald-500/10 border-emerald-500/10 text-emerald-400"
                        : opp.type === "training"
                        ? "bg-amber-500/10 border-amber-500/10 text-amber-400"
                        : "bg-purple-500/10 border-purple-500/10 text-purple-400"
                    }`}>
                      <OpportunityIcon logo={opp.logo} className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                          {opp.title}
                        </h4>
                        <span className={`text-[8px] font-extrabold uppercase px-1 py-0.2 rounded border ${
                          opp.type === "education"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
                            : opp.type === "training"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/10"
                            : "bg-purple-500/10 text-purple-400 border-purple-500/10"
                        }`}>
                          {opp.type}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        {opp.category} • {opp.location} • {opp.salaryOrCost}
                      </div>
                    </div>
                  </div>

                  {/* Right: stats & operations */}
                  <div className="flex gap-6 items-center justify-between w-full md:w-auto border-t md:border-t-0 pt-2 md:pt-0 border-purple-500/5">
                    <div className="flex gap-4 text-xs font-semibold">
                      <div className="text-zinc-400">
                        <span className="font-bold text-zinc-700 dark:text-zinc-300">
                          {opp.analytics?.views || 1}
                        </span>{" "}
                        views
                      </div>
                      <div className="text-zinc-400">
                        <span className="font-bold text-zinc-700 dark:text-zinc-300">
                          {opp.analytics?.clicks || 0}
                        </span>{" "}
                        clicks
                      </div>
                    </div>
                    <button
                      onClick={() => deleteOpportunity(opp.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 rounded-xl hover:bg-red-500/5 transition-all cursor-pointer"
                      aria-label={`Delete listing ${opp.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {provSubTab === "applicants" && (
        <div className="glass-panel rounded-3xl p-6 space-y-4 animate-fade-in">
          <div>
            <h3 className="font-extrabold text-base text-zinc-800 dark:text-zinc-100">
              Applications evaluator ({applications.length})
            </h3>
            <p className="text-xs text-zinc-400">Review seekers and shortlist or offer.</p>
          </div>

          {applications.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-400 italic">
              No active seekers have applied for your positions yet.
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const associatedOpp = opportunities.find((o) => o.id === app.jobId);
                return (
                  <div
                    key={app.id}
                    className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-purple-500/5 flex flex-col space-y-4"
                  >
                    {/* Seeker Identity */}
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                          {app.seekerName}
                        </div>
                        <div className="text-xs text-purple-600 dark:text-purple-300 font-semibold">
                          Targeting: {associatedOpp?.title || "Active vacancy"} ({associatedOpp?.provider})
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          Applied: {app.appliedDate} • Email: {app.seekerEmail}
                        </div>
                      </div>

                      {/* Status Badges & controllers */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateApplicationStatus(app.id, "Shortlisted")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            app.status === "Shortlisted"
                              ? "bg-purple-650 text-white shadow-sm"
                              : "bg-purple-600/5 text-purple-600 hover:bg-purple-600/15"
                          }`}
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(app.id, "Offered")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            app.status === "Offered"
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/15"
                          }`}
                        >
                          Offer
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(app.id, "Rejected")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            app.status === "Rejected"
                              ? "bg-red-500 text-white shadow-sm"
                              : "bg-red-500/5 text-red-500 hover:bg-red-500/15"
                          }`}
                        >
                          Reject
                        </button>
                      </div>
                    </div>

                    {/* Qualifications & CV preview mock */}
                    <div className="p-3 bg-zinc-100/50 dark:bg-zinc-950/40 rounded-xl space-y-2 text-xs border border-purple-500/5">
                      <div className="font-bold text-zinc-700 dark:text-zinc-300">
                        Seeker Skills parsed by PEET AI:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {app.seekerSkills.map((s) => (
                          <span
                            key={s}
                            className="text-[9px] font-semibold bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-purple-500/5 text-[10px] text-zinc-400">
                        📄 CV Attachment: <span className="font-bold text-purple-600 dark:text-purple-300">{app.cvUrl}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {provSubTab === "seekers" && (
        <div className="glass-panel rounded-3xl p-6 space-y-5 animate-fade-in">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h3 className="font-extrabold text-base text-zinc-800 dark:text-zinc-100">Talent Seeker Search</h3>
              <p className="text-xs text-zinc-400">Search the PEET talent pool by title or skills.</p>
            </div>
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-purple-650" />
              <input
                type="text"
                placeholder="Search Figma, React, DevOps..."
                value={seekerSearch}
                onChange={(e) => setSeekerSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 focus:outline-none focus:ring-1 focus:ring-purple-600 text-xs text-zinc-750 dark:text-zinc-250"
              />
            </div>
          </div>

          {/* Grid list of mock seekers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSeekers.map((s, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-purple-500/5 space-y-3 hover:border-purple-500/10 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{s.name}</h4>
                    <span className="text-[10px] font-bold text-purple-650 dark:text-purple-300 block">
                      {s.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-purple-600/10 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-lg border border-purple-500/10">
                    {s.score}% AI Index Fit
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {s.skills.map((sk) => (
                    <span
                      key={sk}
                      className="text-[9px] font-semibold bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded border border-purple-500/5"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[10px] text-zinc-400 pt-1 border-t border-purple-500/5">
                  <span>Location: {s.location}</span>
                  <span>Exp: {s.experience}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {provSubTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Form */}
          <form onSubmit={handleUpdateCompany} className="lg:col-span-2 glass-panel rounded-3xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-200">Company / Provider Settings</h3>
            <p className="text-xs text-zinc-400">Manage institution information that displays on active opportunity posts.</p>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 block mb-1">Company / Institution Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 text-xs text-zinc-750 dark:text-zinc-200"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 block mb-1">Industry / Institution Focus</label>
                <input
                  type="text"
                  required
                  value={companyIndustry}
                  onChange={(e) => setCompanyIndustry(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 text-xs text-zinc-750 dark:text-zinc-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="text-[10px] font-bold text-zinc-400 block mb-1">Organization Size</label>
                  <button
                    type="button"
                    onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 text-xs text-left flex items-center justify-between text-zinc-700 dark:text-zinc-300 transition-all select-none cursor-pointer"
                  >
                    <span>{companySize}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isSizeDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isSizeDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsSizeDropdownOpen(false)} />
                      <div className="absolute top-full left-0 right-0 mt-1 z-40 max-h-40 overflow-y-auto glass-panel rounded-xl p-1.5 border border-purple-500/20 shadow-xl scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                        {["1-10 Members", "10-50 Members", "50-100 Members", "100+ Members"].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              setCompanySize(size);
                              setIsSizeDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                              companySize === size
                                ? "bg-purple-650 text-white"
                                : "text-zinc-455 hover:text-zinc-200 hover:bg-purple-500/10"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 block mb-1">Website URL</label>
                  <input
                    type="url"
                    required
                    value={companySite}
                    onChange={(e) => setCompanySite(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 text-xs text-zinc-750 dark:text-zinc-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                Save Profile Configuration
              </button>

              {companySuccessMessage && (
                <div className="text-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">
                  ✓ Settings updated!
                </div>
              )}
            </div>
          </form>

          {/* Profile Overview Card */}
          <div className="glass-panel rounded-3xl p-5 space-y-3.5">
            <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-200">Public Preview</h3>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-purple-500/5 space-y-3">
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 bg-purple-600 text-white flex items-center justify-center text-xl font-bold rounded-xl shadow-lg animate-pulse">
                  {companyName ? companyName.charAt(0) : "P"}
                </div>
                <div>
                  <div className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100">
                    {companyName}
                  </div>
                  <div className="text-[10px] text-purple-650 dark:text-purple-300 font-bold">
                    {companyIndustry}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 space-y-1 pt-1 border-t border-purple-500/5">
                <div>🏢 Staff: {companySize}</div>
                <div>
                  🔗 Site:{" "}
                  <a href={companySite} className="text-purple-650 hover:underline">
                    {companySite}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
