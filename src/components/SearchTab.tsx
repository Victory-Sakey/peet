"use client";

import React, { useState, useEffect } from "react";
import { useApp, Opportunity } from "@/context/AppContext";
import {
  Search,
  MapPin,
  Filter,
  Check,
  Sparkles,
  X,
  ChevronRight,
  BookOpen,
  Briefcase,
  Award,
  Shield,
  Palette,
  TrendingUp,
  Server,
  DollarSign,
  Users,
  Activity,
  Compass,
  ChevronDown,
  Code,
  Brain
} from "lucide-react";
import { OpportunityIcon } from "./OpportunityIcon";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export const SearchTab: React.FC = () => {
  const {
    opportunities,
    seekerProfile,
    applyToJob,
    applications,
    savedSearches,
    saveSearch,
    removeSavedSearch,
    isLoadingOpportunities,
    fetchOpportunities
  } = useApp();

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Search filter states
  const [keyword, setKeyword] = useState("");
  const [saveSearchSuccess, setSaveSearchSuccess] = useState(false);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [minSalary, setMinSalary] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Opportunity Type filters
  const [filterJobs, setFilterJobs] = useState(true);
  const [filterEducation, setFilterEducation] = useState(true);
  const [filterTraining, setFilterTraining] = useState(true);

  // Dynamic feature filters
  const [filterFree, setFilterFree] = useState(false);
  const [filterBeginner, setFilterBeginner] = useState(false);
  const [filterCert, setFilterCert] = useState(false);



  // Active Job Details Modal
  const [selectedJob, setSelectedJob] = useState<Opportunity | null>(null);
  const [coverLetterText, setCoverLetterText] = useState("");
  const [cvFileName, setCvFileName] = useState("Alex_Mercer_CV.pdf");
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Category list

  // Match score helper
  const calculateMatchScore = (jobSkills: string[]) => {
    if (!jobSkills || jobSkills.length === 0) return 100;
    const common = jobSkills.filter((s) =>
      seekerProfile.skills.map((ps) => ps.toLowerCase()).includes(s.toLowerCase())
    );
    return Math.round((common.length / jobSkills.length) * 100);
  };

  const categories = [
    "All",
    "Software Development",
    "Data Science & AI",
    "Product Management",
    "Cybersecurity",
    "UI/UX Design",
    "Growth Marketing",
    "Cloud Engineering & DevOps",
    "Finance & Web3",
    "Sales & Business Dev",
    "Healthcare Technology"
  ];

  const categoryIcons: Record<string, React.ComponentType<any>> = {
    "All": Compass,
    "Software Development": Code,
    "Data Science & AI": Brain,
    "Product Management": Briefcase,
    "Cybersecurity": Shield,
    "UI/UX Design": Palette,
    "Growth Marketing": TrendingUp,
    "Cloud Engineering & DevOps": Server,
    "Finance & Web3": DollarSign,
    "Sales & Business Dev": Users,
    "Healthcare Technology": Activity
  };

  // Filter local opportunities by cost/salary threshold
  const filteredJobs = opportunities.filter((opp) => {
    if (opp.type === "job") {
      return opp.salaryNum >= minSalary;
    }
    return true; // Courses and bootcamps ignore salary minimums
  });

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    if (category && category !== "All") params.set("category", category);

    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const queryKeyword = searchParams.get("keyword") || "";
    const queryLocation = searchParams.get("location") || "";
    const queryCategory = searchParams.get("category") || "All";

    setKeyword(queryKeyword);
    setLocation(queryLocation);
    setCategory(queryCategory);

    const types: ("job" | "education" | "training")[] = [];
    if (filterJobs) types.push("job");
    if (filterEducation) types.push("education");
    if (filterTraining) types.push("training");

    fetchOpportunities(queryKeyword, queryLocation, queryCategory, {
      type: types,
      isFree: filterFree || undefined,
      isBeginnerFriendly: filterBeginner || undefined,
      hasCertificate: filterCert || undefined
    });
  }, [searchParams]);

  const handleToggleType = (type: "job" | "education" | "training", checked: boolean) => {
    let nextJobs = filterJobs;
    let nextEd = filterEducation;
    let nextTrain = filterTraining;

    if (type === "job") {
      setFilterJobs(checked);
      nextJobs = checked;
    } else if (type === "education") {
      setFilterEducation(checked);
      nextEd = checked;
    } else if (type === "training") {
      setFilterTraining(checked);
      nextTrain = checked;
    }

    const types: ("job" | "education" | "training")[] = [];
    if (nextJobs) types.push("job");
    if (nextEd) types.push("education");
    if (nextTrain) types.push("training");

    fetchOpportunities(keyword, location, category, {
      type: types,
      isFree: filterFree || undefined,
      isBeginnerFriendly: filterBeginner || undefined,
      hasCertificate: filterCert || undefined
    });
  };

  const handleToggleFlag = (flag: "free" | "beginner" | "cert", checked: boolean) => {
    let nextFree = filterFree;
    let nextBeginner = filterBeginner;
    let nextCert = filterCert;

    if (flag === "free") {
      setFilterFree(checked);
      nextFree = checked;
    } else if (flag === "beginner") {
      setFilterBeginner(checked);
      nextBeginner = checked;
    } else if (flag === "cert") {
      setFilterCert(checked);
      nextCert = checked;
    }

    const types: ("job" | "education" | "training")[] = [];
    if (filterJobs) types.push("job");
    if (filterEducation) types.push("education");
    if (filterTraining) types.push("training");

    fetchOpportunities(keyword, location, category, {
      type: types,
      isFree: nextFree || undefined,
      isBeginnerFriendly: nextBeginner || undefined,
      hasCertificate: nextCert || undefined
    });
  };

  const handleSaveSearch = () => {
    if (!keyword && !location && category === "All") return;
    saveSearch(keyword || "General Query", location || "Anywhere", category);
    setSaveSearchSuccess(true);
    setTimeout(() => setSaveSearchSuccess(false), 2000);
  };

  const handleApplySavedSearch = (s: typeof savedSearches[0]) => {
    const nextKeyword = s.keyword === "General Query" ? "" : s.keyword;
    const nextLocation = s.location === "Anywhere" ? "" : s.location;
    
    const params = new URLSearchParams();
    if (nextKeyword) params.set("keyword", nextKeyword);
    if (nextLocation) params.set("location", nextLocation);
    if (s.category && s.category !== "All") params.set("category", s.category);

    router.push(`${pathname}?${params.toString()}`);
  };



  const handleOpenJob = (opp: Opportunity) => {
    setSelectedJob(opp);
    setAppliedSuccess(false);
    
    // Customize cover letter prefill text based on opportunity type
    if (opp.type === "job") {
      setCoverLetterText(
        `Dear Hiring Team at ${opp.provider},\n\nI am writing to express my strong interest in the ${opp.title} position. As a ${seekerProfile.title} skilled in ${seekerProfile.skills.slice(0, 4).join(", ")}, I am excited about the opportunity to contribute to your projects.\n\nThank you for your time and consideration.`
      );
    } else {
      setCoverLetterText(
        `Hello Admissions Team,\n\nI am highly interested in enrolling/participating in the ${opp.title} program offered by ${opp.provider}. I want to bridge my technical skill gaps and develop practical competencies. Please review my profile and skills portfolio.\n\nBest regards,\n${seekerProfile.name}`
      );
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    applyToJob(selectedJob.id, cvFileName, coverLetterText);
    setAppliedSuccess(true);
    setTimeout(() => {
      setSelectedJob(null);
      setAppliedSuccess(false);
    }, 1500);
  };

  useEffect(() => {
    const queryJobId = searchParams.get("jobId");
    if (queryJobId && opportunities.length > 0 && !selectedJob) {
      const job = opportunities.find(o => o.id === queryJobId);
      if (job) {
        handleOpenJob(job);
      }
    }
  }, [searchParams, opportunities]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Explore Careers & <span className="text-gradient">Opportunities</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-600 dark:text-zinc-600 dark:text-zinc-600 text-sm sm:text-base">
          PEET AI matches your skills to Jobs, Courses, Bootcamps, and apprenticeships dynamically.
        </p>
      </div>

      {/* Advanced Search Bar Panel */}
      <form onSubmit={handleSearchSubmit} className="glass-panel rounded-3xl p-4 sm:p-6 shadow-xl space-y-4 relative z-50">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="relative flex items-center md:col-span-4">
            <Search className="absolute left-4 w-5 h-5 text-purple-500" />
            <input
              type="text"
              placeholder="Search jobs, courses, bootcamps..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-100 dark:bg-zinc-100/60 rounded-2xl border border-zinc-200 dark:border-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm transition-all"
            />
          </div>

          {/* Location Search */}
          <div className="relative flex items-center md:col-span-3">
            <MapPin className="absolute left-4 w-5 h-5 text-purple-500" />
            <input
              type="text"
              placeholder="City, state, or remote..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-100 dark:bg-zinc-100/60 rounded-2xl border border-zinc-200 dark:border-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm transition-all"
            />
          </div>

          {/* Custom Category Dropdown */}
          <div className="md:col-span-3 relative">
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-100 dark:bg-zinc-100/60 rounded-2xl border border-zinc-200 dark:border-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm text-left flex items-center justify-between text-zinc-700 dark:text-zinc-700 dark:text-purple-800 transition-all select-none"
            >
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = categoryIcons[category] || Compass;
                  return <Icon className="w-4 h-4 text-purple-500" />;
                })()}
                <span className="truncate">{category === "All" ? "All Categories" : category}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-zinc-600 dark:text-zinc-600 transition-transform duration-200 shrink-0 ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isCategoryDropdownOpen && (
              <>
                {/* Click outside backdrop */}
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsCategoryDropdownOpen(false)}
                />
                
                {/* Floating list */}
                <div className="absolute top-full left-0 right-0 mt-2 z-40 max-h-60 overflow-y-auto glass-panel rounded-2xl p-2 border border-purple-200 shadow-2xl animate-scale-up scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                  {categories.map((cat) => {
                    const Icon = categoryIcons[cat] || Compass;
                    const isSelected = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategory(cat);
                          setIsCategoryDropdownOpen(false);
                          
                          const params = new URLSearchParams();
                          if (keyword) params.set("keyword", keyword);
                          if (location) params.set("location", location);
                          if (cat && cat !== "All") params.set("category", cat);

                          router.push(`${pathname}?${params.toString()}`);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-left transition-colors ${
                          isSelected
                            ? "bg-purple-600 text-white"
                            : "text-zinc-600 dark:text-zinc-600 hover:text-zinc-800 hover:bg-purple-500/10"
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-zinc-900 dark:text-white" : "text-purple-500"}`} />
                        {cat === "All" ? "All Categories" : cat}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3.5 rounded-2xl border transition-all ${
                showFilters
                  ? "bg-purple-600/10 border-purple-600 text-purple-600 dark:text-purple-700"
                  : "bg-zinc-50 dark:bg-zinc-100 dark:bg-zinc-100/60 border-zinc-200 dark:border-purple-200/50 text-zinc-500 dark:text-zinc-600 hover:text-purple-600"
              }`}
              title="Advanced Filters"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={isLoadingOpportunities}
              className="flex-1 bg-purple-600 text-white rounded-2xl flex items-center justify-center gap-1.5 font-semibold text-sm transition-all shadow-md shadow-purple-500/20"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Opportunity Type Selectors */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-purple-200/50 text-xs font-bold">
          <span className="text-zinc-500 dark:text-zinc-600">OPPORTUNITY TYPE:</span>
          
          <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-purple-800 select-none">
            <input
              type="checkbox"
              checked={filterJobs}
              onChange={(e) => handleToggleType("job", e.target.checked)}
              className="w-4 h-4 rounded border-purple-200/50 text-purple-600 focus:ring-purple-600 accent-purple-600"
            />
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-purple-500" />
              Jobs (Work)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-purple-800 select-none">
            <input
              type="checkbox"
              checked={filterEducation}
              onChange={(e) => handleToggleType("education", e.target.checked)}
              className="w-4 h-4 rounded border-emerald-500/10 text-emerald-600 focus:ring-emerald-600 accent-emerald-500"
            />
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              Education (Courses)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-purple-800 select-none">
            <input
              type="checkbox"
              checked={filterTraining}
              onChange={(e) => handleToggleType("training", e.target.checked)}
              className="w-4 h-4 rounded border-amber-500/10 text-amber-600 focus:ring-amber-600 accent-amber-500"
            />
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Training (Bootcamps)
            </span>
          </label>
        </div>

        {/* Expandable Advanced Filters */}
        {showFilters && (
          <div className="pt-4 border-t border-purple-200/50 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Features checkmarks */}
            <div className="flex flex-wrap gap-4 text-xs font-semibold select-none">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-600 dark:text-zinc-600 hover:text-zinc-800">
                <input
                  type="checkbox"
                  checked={filterFree}
                  onChange={(e) => handleToggleFlag("free", e.target.checked)}
                  className="w-4 h-4 rounded border-purple-200/50 accent-purple-600"
                />
                <span>Free opportunities only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-zinc-600 dark:text-zinc-600 hover:text-zinc-800">
                <input
                  type="checkbox"
                  checked={filterBeginner}
                  onChange={(e) => handleToggleFlag("beginner", e.target.checked)}
                  className="w-4 h-4 rounded border-purple-200/50 accent-purple-600"
                />
                <span>Beginner Friendly</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-zinc-600 dark:text-zinc-600 hover:text-zinc-800">
                <input
                  type="checkbox"
                  checked={filterCert}
                  onChange={(e) => handleToggleFlag("cert", e.target.checked)}
                  className="w-4 h-4 rounded border-purple-200/50 accent-purple-600"
                />
                <span>Certificate Included</span>
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-500 dark:text-zinc-600">Min Salary (Jobs only)</span>
                <span className="text-purple-600 dark:text-purple-700 font-bold">${minSalary.toLocaleString()}+</span>
              </div>
              <input
                type="range"
                min="0"
                max="200000"
                step="10000"
                value={minSalary}
                onChange={(e) => setMinSalary(Number(e.target.value))}
                className="w-full accent-purple-600 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-2 md:col-span-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setKeyword("");
                  setLocation("");
                  setCategory("All");
                  setMinSalary(0);
                  setFilterFree(false);
                  setFilterBeginner(false);
                  setFilterCert(false);
                  setFilterJobs(true);
                  setFilterEducation(true);
                  setFilterTraining(true);
                  router.push(pathname);
                }}
                className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-200 text-xs font-semibold text-zinc-500 dark:text-zinc-600 hover:text-zinc-800 dark:hover:text-zinc-800 transition-colors"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={handleSaveSearch}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all ${
                  saveSearchSuccess
                    ? "bg-emerald-600 text-zinc-900 dark:text-white shadow-emerald-500/10"
                    : "bg-purple-600 text-white shadow-purple-500/10 hover:bg-purple-700"
                }`}
              >
                {saveSearchSuccess ? "✓ Query Saved" : "Save Active Query"}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Main Grid: Job Listings Feed & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Listings Section */}
        <div className={`${savedSearches.length > 0 ? "lg:col-span-2" : "lg:col-span-3"} space-y-4`}>
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg font-bold text-zinc-700 dark:text-zinc-800">
              Opportunities Found ({filteredJobs.length})
            </h2>
            <span className="text-xs text-zinc-600 dark:text-zinc-600 font-semibold">Sorted by relevance</span>
          </div>

          {isLoadingOpportunities ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="glass-panel rounded-2xl p-5 animate-pulse flex flex-col sm:flex-row gap-5 items-start justify-between">
                  <div className="flex gap-4 items-start w-full">
                    <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800/60 flex-shrink-0" />
                    <div className="space-y-3 w-full">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800/60 rounded-md w-2/3" />
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-800/40 rounded-md w-1/2" />
                      <div className="flex gap-2 pt-2">
                        <div className="h-5 bg-zinc-200 dark:bg-zinc-800/40 rounded-md w-16" />
                        <div className="h-5 bg-zinc-200 dark:bg-zinc-800/40 rounded-md w-16" />
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto h-full pt-3 sm:pt-0">
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-800/40 rounded-md w-20 mb-2" />
                    <div className="h-8 bg-zinc-200 dark:bg-zinc-800/40 rounded-md w-28" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-100 dark:bg-zinc-100 flex items-center justify-center mx-auto text-zinc-600 dark:text-zinc-600">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">No matches found</h3>
                <p className="text-zinc-500 dark:text-zinc-600 dark:text-zinc-600 dark:text-zinc-600 text-sm max-w-sm mx-auto">
                  Try adjusting filters or typing another keyword to discover active positions.
                </p>
              </div>
            </div>
          ) : (
            filteredJobs.map((opp) => {
              const score = calculateMatchScore(opp.skills);
              const alreadyApplied = applications.some(
                (app) => app.jobId === opp.id && app.seekerEmail === seekerProfile.email
              );
              const applicationStatus = applications.find(
                (app) => app.jobId === opp.id && app.seekerEmail === seekerProfile.email
              )?.status;

              return (
                <div
                  key={opp.id}
                  onClick={() => handleOpenJob(opp)}
                  className="glass-panel glass-panel-hover rounded-2xl p-5 cursor-pointer flex flex-col sm:flex-row gap-5 items-start justify-between relative group"
                >
                  <div className="flex gap-4 items-start">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                      opp.type === "education"
                        ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                        : opp.type === "training"
                        ? "bg-amber-500/10 border-amber-500/25 text-amber-400"
                        : "bg-purple-500/10 border-purple-200 text-purple-600"
                    }`}>
                      <OpportunityIcon logo={opp.logo} className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-base group-hover:text-purple-600 dark:group-hover:text-purple-700 transition-colors">
                          {opp.title}
                        </h3>
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider border ${
                          opp.type === "education"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/15"
                            : opp.type === "training"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/15"
                            : "bg-purple-500/10 text-purple-600 border-purple-500/15"
                        }`}>
                          {opp.type}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500 dark:text-zinc-600 dark:text-zinc-600 dark:text-zinc-600">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-700 dark:text-purple-800">{opp.provider}</span>
                        <span>•</span>
                        <span>{opp.location}</span>
                        <span>•</span>
                        <span>{opp.subType}</span>
                      </div>

                      {/* Flags Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {opp.isFree && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500">
                            Free Opportunity
                          </span>
                        )}
                        {opp.isBeginnerFriendly && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-sky-500/10 text-sky-400">
                            Beginner Friendly
                          </span>
                        )}
                        {opp.hasCertificate && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-600">
                            Certificate Awarded
                          </span>
                        )}
                      </div>

                      {/* Required Skills Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {opp.skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-700 dark:text-purple-800"
                          >
                            {skill}
                          </span>
                        ))}
                        {opp.skills.length > 4 && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-700">
                            +{opp.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-purple-200/50 gap-2">
                    <div className="flex items-center gap-1.5 sm:mb-2 bg-purple-600/10 text-purple-600 dark:text-purple-700 px-2 py-1 rounded-lg">
                      <Sparkles className="w-3.5 h-3.5 fill-purple-600 dark:fill-transparent animate-pulse" />
                      <span className="text-xs font-bold">{score}% Match</span>
                    </div>

                    <div className="text-right sm:block hidden mb-2">
                      <span className="text-xs text-zinc-600 dark:text-zinc-600 block font-medium">
                        {opp.type === "job" ? "Compensation Range" : "Opportunity Cost"}
                      </span>
                      <span className="text-sm font-bold text-zinc-700 dark:text-zinc-800">
                        {opp.salaryOrCost}
                      </span>
                    </div>

                    {alreadyApplied ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-xl">
                        <Check className="w-3.5 h-3.5" />
                        {applicationStatus}
                      </span>
                    ) : (
                      <button className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-semibold transition-colors shadow-sm shadow-purple-500/10">
                        View Details
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Sections */}
        {savedSearches.length > 0 && (
          <div className="space-y-6">
            {/* Saved Searches */}
            <div className="glass-panel rounded-3xl p-5 space-y-3.5">
              <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-800">
                Saved Searches ({savedSearches.length})
              </h3>
              <div className="space-y-2">
                {savedSearches.map((s) => (
                  <div
                    key={s.id}
                    className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-100/50 dark:bg-zinc-100 dark:bg-zinc-100/40 hover:bg-purple-500/5 transition-colors group"
                  >
                    <div
                      className="cursor-pointer space-y-0.5 flex-1"
                      onClick={() => handleApplySavedSearch(s)}
                    >
                      <div className="text-xs font-bold group-hover:text-purple-600 dark:group-hover:text-purple-700 transition-colors">
                        {s.keyword}
                      </div>
                      <div className="text-[10px] text-zinc-600 dark:text-zinc-600">
                        {s.location} • {s.category}
                      </div>
                    </div>
                    <button
                      onClick={() => removeSavedSearch(s.id)}
                      className="text-zinc-600 dark:text-zinc-600 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/5 transition-colors"
                      aria-label="Remove saved search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Opportunity Details Application Modal */}
      {selectedJob && (() => {
        const score = calculateMatchScore(selectedJob.skills);
        const matchedSkills = selectedJob.skills.filter((s) =>
          seekerProfile.skills.map((ps) => ps.toLowerCase()).includes(s.toLowerCase())
        );
        const missingSkills = selectedJob.skills.filter((s) =>
          !seekerProfile.skills.map((ps) => ps.toLowerCase()).includes(s.toLowerCase())
        );

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-purple-200 max-h-[90vh] flex flex-col animate-scale-up">
              {/* Header */}
              <div className="p-6 border-b border-purple-200/50 flex justify-between items-start gap-4">
                <div className="flex gap-4 items-start">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                    selectedJob.type === "education"
                      ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                      : selectedJob.type === "training"
                      ? "bg-amber-500/10 border-amber-500/25 text-amber-400"
                      : "bg-purple-500/10 border-purple-200 text-purple-600"
                  }`}>
                    <OpportunityIcon logo={selectedJob.logo} className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-lg sm:text-xl text-zinc-800 dark:text-zinc-100">
                        {selectedJob.title}
                      </h3>
                      <span className={`text-[10px] font-bold bg-purple-650/15 text-purple-600 dark:text-purple-700 px-2 py-0.5 rounded-lg border ${
                        selectedJob.type === "education"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/15"
                          : selectedJob.type === "training"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/15"
                          : "bg-purple-500/10 text-purple-600 border-purple-500/15"
                      }`}>
                        {selectedJob.type === "training" ? "career" : selectedJob.type}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-600 dark:text-zinc-600 dark:text-zinc-600 flex flex-wrap gap-x-2 font-medium mt-0.5">
                      <span className="font-bold text-purple-650 dark:text-purple-600">
                        {selectedJob.provider}
                      </span>
                      <span>•</span>
                      <span>{selectedJob.location}</span>
                      <span>•</span>
                      <span>{selectedJob.subType}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-zinc-600 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-800 p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-100/50 dark:bg-zinc-100 dark:bg-zinc-100/40 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {/* Visual Specifications Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="glass-panel p-3.5 rounded-2xl border border-purple-500/5 bg-purple-500/5 text-center sm:text-left">
                    <div className="text-[9px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-wider">Entity / Provider</div>
                    <div className="text-xs font-extrabold text-zinc-800 truncate mt-1">{selectedJob.provider}</div>
                    <div className="text-[9px] font-semibold text-zinc-600 dark:text-zinc-600 mt-0.5">{selectedJob.subType}</div>
                  </div>
                  <div className="glass-panel p-3.5 rounded-2xl border border-purple-500/5 bg-purple-500/5 text-center sm:text-left">
                    <div className="text-[9px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-wider">Office & Location</div>
                    <div className="text-xs font-extrabold text-zinc-800 truncate mt-1">{selectedJob.location}</div>
                    <div className="text-[9px] font-semibold text-zinc-600 dark:text-zinc-600 mt-0.5">Physical Workspace</div>
                  </div>
                  <div className="glass-panel p-3.5 rounded-2xl border border-purple-500/5 bg-purple-500/5 text-center sm:text-left">
                    <div className="text-[9px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-wider">
                      {selectedJob.type === "job" ? "Compensation Display" : "Required Tuition"}
                    </div>
                    <div className="text-xs font-extrabold text-zinc-800 truncate mt-1">{selectedJob.salaryOrCost}</div>
                    <div className="text-[9px] font-semibold text-zinc-600 dark:text-zinc-600 mt-0.5">Value Rate</div>
                  </div>
                </div>

                {/* AI Fit Matching score card */}
                <div className="glass-panel p-5 rounded-2xl border border-purple-200/50 bg-purple-500/5 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-650/15 flex items-center justify-center text-purple-600">
                        <Sparkles className="w-5 h-5 fill-purple-600 dark:fill-transparent animate-pulse" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-purple-450 uppercase tracking-wider">AI Skill Match Rating</div>
                        <div className="text-sm font-extrabold text-zinc-800 mt-0.5">
                          You match {score}% of the opportunity profile
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-purple-650/20 border border-purple-300 text-purple-700 text-[10px] font-extrabold tracking-wider uppercase select-none">
                      Skills Check
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-purple-200/50">
                    {/* Matched Skills */}
                    <div className="space-y-2">
                      <div className="text-[9px] font-bold text-emerald-450 uppercase tracking-wider flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Matched Skills ({matchedSkills.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {matchedSkills.length > 0 ? (
                          matchedSkills.map((s) => (
                            <span key={s} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/15 text-emerald-400">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-600">None matching</span>
                        )}
                      </div>
                    </div>

                    {/* Missing Skills / Skills to Learn */}
                    <div className="space-y-2">
                      <div className="text-[9px] font-bold text-purple-450 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Skills to Gain ({missingSkills.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {missingSkills.length > 0 ? (
                          missingSkills.map((s) => (
                            <span key={s} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/15 text-purple-600">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-400">Mastered all required skills!</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* About the Opportunity */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-purple-650 dark:text-purple-700 uppercase tracking-wider">
                    About the Opportunity
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-600 leading-relaxed font-normal">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Requirements */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-purple-650 dark:text-purple-700 uppercase tracking-wider">
                    Key Requirements & Qualifications
                  </h4>
                  <div className="space-y-2.5">
                    {selectedJob.requirements.map((req, index) => (
                      <div key={index} className="flex gap-2.5 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                          {req}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Apply Form */}
                <form onSubmit={handleApplySubmit} className="pt-6 border-t border-purple-200/50 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-purple-650 dark:text-purple-700 uppercase tracking-wider">
                      {selectedJob.type === "job" ? "Quick Application" : "Program Enrollment"}
                    </h4>
                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-600">Document: {cvFileName}</span>
                  </div>

                  <div className="glass-panel p-4 rounded-2xl border border-purple-500/5 bg-purple-500/5 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-zinc-800">Tailored AI Application Statement</div>
                        <div className="text-[10px] text-zinc-500 dark:text-zinc-600">Formulates a personalized statement based on your matched skills.</div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setCoverLetterText(
                            selectedJob.type === "job"
                              ? `Dear Hiring Team at ${selectedJob.provider},\n\nI am writing to express my strong interest in the ${selectedJob.title} position. As a ${seekerProfile.title} skilled in ${seekerProfile.skills.slice(0, 4).join(", ")}, my credentials match ${score}% of your required profile. I am excited about the opportunity to contribute to your projects.`
                              : `Hello Admissions Office,\n\nI am enrolling in the ${selectedJob.title} course to bridge my skills gap in ${missingSkills.slice(0, 2).join(", ") || "this field"} and build upon my knowledge in ${matchedSkills.slice(0, 2).join(", ") || "core fundamentals"}. Please review my profile and verify my application.`
                          )
                        }
                        className="px-3 py-1 bg-purple-650/10 hover:bg-purple-650/20 border border-purple-200 text-purple-350 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-purple-400" />
                        <span>Auto-Generate Statement</span>
                      </button>
                    </div>

                    <textarea
                      rows={4}
                      required
                      value={coverLetterText}
                      onChange={(e) => setCoverLetterText(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-100/50 rounded-xl border border-purple-200/50 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent resize-none font-sans leading-relaxed"
                      placeholder="Write your cover statement or click 'Auto-Generate Statement' above..."
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedJob(null)}
                      className="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 dark:text-zinc-600 hover:text-zinc-800 transition-colors text-xs font-bold"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-purple-500/15 flex items-center gap-1.5"
                    >
                      <span>{selectedJob.type === "job" ? "Submit Application" : "Complete Enrollment"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {appliedSuccess && (
                  <div className="text-center py-2.5 text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 rounded-xl animate-pulse">
                    ✓ Success! Application was dispatched.
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

