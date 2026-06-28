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
  Brain,
  Clock,
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
    fetchOpportunities,
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [bgIndex, setBgIndex] = useState(0);
  const [greeting, setGreeting] = useState({
    title: "Welcome!",
    subtitle: "Start exploring!",
  });
  const [mounted, setMounted] = useState(false);

  // Typing animation state
  const typingPhrases = [
    "Search for your dream role...",
    "Search for jobs... ",
    "Discover top-tier bootcamps...",
    "Find scholarships...",
  ];
  const [placeholderText, setPlaceholderText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const bgImages = [
    "/bg-1.jpg",
    "/bg-2.jpg",
    "/bg-3.jpg",
    "/bg-4.jpg",
    "/bg-5.jpg",
  ];

  useEffect(() => {
    let typeTimer: NodeJS.Timeout;
    const currentPhrase = typingPhrases[phraseIndex];

    if (isDeleting) {
      typeTimer = setTimeout(() => {
        setPlaceholderText(
          currentPhrase.substring(0, placeholderText.length - 1),
        );
        if (placeholderText.length <= 1) {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % typingPhrases.length);
        }
      }, 50);
    } else {
      if (placeholderText.length === currentPhrase.length) {
        typeTimer = setTimeout(() => setIsDeleting(true), 2500);
      } else {
        typeTimer = setTimeout(() => {
          setPlaceholderText(
            currentPhrase.substring(0, placeholderText.length + 1),
          );
        }, 60);
      }
    }
    return () => clearTimeout(typeTimer);
  }, [placeholderText, isDeleting, phraseIndex]);

  useEffect(() => {
    setMounted(true);
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting({
          title: "🌅 Good morning!",
          subtitle: "Start your day with a new opportunity.",
        });
      } else if (hour >= 12 && hour < 17) {
        setGreeting({
          title: "☀️ Good afternoon!",
          subtitle: "Take the next step toward your career goals.",
        });
      } else {
        setGreeting({
          title: "🌆 Good evening!",
          subtitle: "End the day by discovering something new.",
        });
      }
    };

    updateGreeting();
    // Update greeting periodically in case the hour changes
    const greetingInterval = setInterval(updateGreeting, 60000);

    const bgInterval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 100000);

    return () => {
      clearInterval(greetingInterval);
      clearInterval(bgInterval);
    };
  }, []);

  // Category list

  // Match score helper
  const calculateMatchScore = (jobSkills: string[]) => {
    if (!jobSkills || jobSkills.length === 0) return 100;
    const common = jobSkills.filter((s) =>
      seekerProfile.skills
        .map((ps) => ps.toLowerCase())
        .includes(s.toLowerCase()),
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
    "Healthcare Technology",
  ];

  const categoryIcons: Record<string, React.ComponentType<any>> = {
    All: Compass,
    "Software Development": Code,
    "Data Science & AI": Brain,
    "Product Management": Briefcase,
    Cybersecurity: Shield,
    "UI/UX Design": Palette,
    "Growth Marketing": TrendingUp,
    "Cloud Engineering & DevOps": Server,
    "Finance & Web3": DollarSign,
    "Sales & Business Dev": Users,
    "Healthcare Technology": Activity,
  };

  // Filter local opportunities by cost/salary threshold
  const filteredJobs = opportunities.filter((opp) => {
    if (opp.type === "job") {
      return opp.salaryNum >= minSalary;
    }
    return true; // Courses and bootcamps ignore salary minimums
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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

    setCurrentPage(1);

    fetchOpportunities(queryKeyword, queryLocation, queryCategory, {
      type: types,
      isFree: filterFree || undefined,
      isBeginnerFriendly: filterBeginner || undefined,
      hasCertificate: filterCert || undefined,
    });
  }, [searchParams]);

  const handleToggleType = (
    type: "job" | "education" | "training",
    checked: boolean,
  ) => {
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

    setCurrentPage(1);

    fetchOpportunities(keyword, location, category, {
      type: types,
      isFree: filterFree || undefined,
      isBeginnerFriendly: filterBeginner || undefined,
      hasCertificate: filterCert || undefined,
    });
  };

  const handleToggleFlag = (
    flag: "free" | "beginner" | "cert",
    checked: boolean,
  ) => {
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
      hasCertificate: nextCert || undefined,
    });
  };

  const handleSaveSearch = () => {
    if (!keyword && !location && category === "All") return;
    saveSearch(keyword || "General Query", location || "Anywhere", category);
    setSaveSearchSuccess(true);
    setTimeout(() => setSaveSearchSuccess(false), 2000);
  };

  const handleApplySavedSearch = (s: (typeof savedSearches)[0]) => {
    const nextKeyword = s.keyword === "General Query" ? "" : s.keyword;
    const nextLocation = s.location === "Anywhere" ? "" : s.location;

    const params = new URLSearchParams();
    if (nextKeyword) params.set("keyword", nextKeyword);
    if (nextLocation) params.set("location", nextLocation);
    if (s.category && s.category !== "All") params.set("category", s.category);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleOpenJob = (opp: Opportunity) => {
    router.push(`/opportunities/${opp.id}`);
  };

  useEffect(() => {
    const queryJobId = searchParams.get("jobId");
    if (queryJobId && opportunities.length > 0) {
      const job = opportunities.find((o) => o.id === queryJobId);
      if (job) {
        handleOpenJob(job);
      }
    }
  }, [searchParams, opportunities]);

  return (
    <div className="space-y-12 pb-12 bg-white dark:bg-[#0a0a0a]">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 rounded-b-[3rem] shadow-xl text-center border-b border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-[#111111] overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 bg-black pointer-events-none rounded-b-[3rem] overflow-hidden">
          {bgImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt="Background"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[3000ms] ease-in-out ${bgIndex === idx ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <div className="absolute inset-0 bg-black/60 dark:bg-black/80"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto space-y-10">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-md transition-opacity duration-300">
              {mounted ? greeting.title : "Welcome!"}
            </h1>
            <p className="text-lg sm:text-xl text-zinc-200 drop-shadow-sm font-medium transition-opacity duration-300 max-w-2xl mx-auto">
              {mounted ? greeting.subtitle : "Start exploring!"}
            </p>
          </div>

          {/* Unified Minimal Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full max-w-3xl mx-auto pt-2"
          >
            <div className="flex items-center backdrop-blur-3xl bg-white/80 dark:bg-black/60 border border-white/80 dark:border-white/20 focus-within:border-purple-500 dark:focus-within:border-purple-400 rounded-full p-2 transition-all shadow-2xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
              <div className="pl-4 pr-3 shrink-0">
                <Search className="w-5 h-5 text-purple-600 dark:text-zinc-300 ml-1" />
              </div>
              <input
                type="text"
                placeholder={
                  placeholderText || "Ask PEET or search projects..."
                }
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-base text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-300 py-3 font-medium"
              />
              <div className="pr-3 shrink-0 hidden sm:flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2.5 rounded-full transition-colors ${showFilters ? "bg-purple-600 text-white shadow-lg" : "text-zinc-500 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"}`}
                  title="Advanced Filters"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Advanced Filters Modal */}
          {showFilters && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
              <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-3xl border border-white/50 dark:border-white/10 rounded-[2rem] p-5 md:p-6 max-w-xl w-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative flex flex-col gap-4 text-left">
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-800 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Filter className="w-4 h-4 text-purple-600" />
                    Advanced Filters
                  </h3>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Location
                  </h4>
                  <div className="relative max-w-sm">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="City, state, or remote..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Opportunity Type
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold select-none">
                    <label
                      className={`cursor-pointer px-3 py-1.5 flex items-center gap-1.5 rounded-lg border transition-all shadow-sm ${filterJobs ? "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                    >
                      <input
                        type="checkbox"
                        checked={filterJobs}
                        onChange={(e) =>
                          handleToggleType("job", e.target.checked)
                        }
                        className="hidden"
                      />
                      <Briefcase className="w-3.5 h-3.5" /> Jobs
                    </label>
                    <label
                      className={`cursor-pointer px-3 py-1.5 flex items-center gap-1.5 rounded-lg border transition-all shadow-sm ${filterEducation ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                    >
                      <input
                        type="checkbox"
                        checked={filterEducation}
                        onChange={(e) =>
                          handleToggleType("education", e.target.checked)
                        }
                        className="hidden"
                      />
                      <BookOpen className="w-3.5 h-3.5" /> Courses
                    </label>
                    <label
                      className={`cursor-pointer px-3 py-1.5 flex items-center gap-1.5 rounded-lg border transition-all shadow-sm ${filterTraining ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                    >
                      <input
                        type="checkbox"
                        checked={filterTraining}
                        onChange={(e) =>
                          handleToggleType("training", e.target.checked)
                        }
                        className="hidden"
                      />
                      <Award className="w-3.5 h-3.5" /> Bootcamps
                    </label>
                  </div>

                  <h4 className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pt-1">
                    Features
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold select-none">
                    <label
                      className={`cursor-pointer px-3 py-1.5 rounded-lg border transition-all shadow-sm ${filterFree ? "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                    >
                      <input
                        type="checkbox"
                        checked={filterFree}
                        onChange={(e) =>
                          handleToggleFlag("free", e.target.checked)
                        }
                        className="hidden"
                      />
                      Free only
                    </label>
                    <label
                      className={`cursor-pointer px-3 py-1.5 rounded-lg border transition-all shadow-sm ${filterBeginner ? "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                    >
                      <input
                        type="checkbox"
                        checked={filterBeginner}
                        onChange={(e) =>
                          handleToggleFlag("beginner", e.target.checked)
                        }
                        className="hidden"
                      />
                      Beginner Friendly
                    </label>
                    <label
                      className={`cursor-pointer px-3 py-1.5 rounded-lg border transition-all shadow-sm ${filterCert ? "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                    >
                      <input
                        type="checkbox"
                        checked={filterCert}
                        onChange={(e) =>
                          handleToggleFlag("cert", e.target.checked)
                        }
                        className="hidden"
                      />
                      With Certificate
                    </label>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Min Salary
                    </span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded-full">
                      ${minSalary.toLocaleString()}+
                    </span>
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

                <div className="flex flex-wrap justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-white/10 mt-1">
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
                      setShowFilters(false);
                    }}
                    className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleSaveSearch();
                      setTimeout(() => setShowFilters(false), 1000);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all ${
                      saveSearchSuccess
                        ? "bg-emerald-600 text-zinc-900 dark:text-white shadow-emerald-500/20"
                        : "bg-purple-600 text-white shadow-purple-500/20 hover:bg-purple-700 hover:shadow-purple-500/40"
                    }`}
                  >
                    {saveSearchSuccess ? "✓ Saved" : "Save Query"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200 hover:scale-[1.02]"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* End Hero Wrapper */}
        </div>
      </div>

      {/* Main Container for the rest of the page */}
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Main Grid: Job Listings Feed & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listings Section */}
          <div
            className={`${savedSearches.length > 0 ? "lg:col-span-2" : "lg:col-span-3"} space-y-4`}
          >
            <div className="flex justify-between items-center px-1">
              <h2 className="text-lg font-bold text-zinc-700 dark:text-zinc-800">
                Opportunities Found ({filteredJobs.length})
              </h2>
              <span className="text-xs text-zinc-600 dark:text-zinc-600 font-semibold">
                Sorted by relevance
              </span>
            </div>

            {isLoadingOpportunities ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="glass-panel rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-start justify-between"
                  >
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
                    Try adjusting filters or typing another keyword to discover
                    active positions.
                  </p>
                </div>
              </div>
            ) : (
              paginatedJobs.map((opp) => {
                const score = calculateMatchScore(opp.skills);
                const alreadyApplied = applications.some(
                  (app) =>
                    app.jobId === opp.id &&
                    app.seekerEmail === seekerProfile.email,
                );
                const applicationStatus = applications.find(
                  (app) =>
                    app.jobId === opp.id &&
                    app.seekerEmail === seekerProfile.email,
                )?.status;

                return (
                  <div
                    key={opp.id}
                    onClick={() => handleOpenJob(opp)}
                    className="relative flex flex-col gap-6 rounded-[2.5rem] p-6 sm:p-8 cursor-pointer overflow-hidden bg-white/60 dark:bg-zinc-950/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                  >
                    {/* Top Header */}
                    <div className="flex items-start justify-between relative z-10 w-full gap-4">
                      <div className="flex items-center gap-5">
                        {/* Icon Orb / Image */}
                        <div
                          className={`relative w-16 h-16 shrink-0 rounded-full flex items-center justify-center shadow-lg ${
                            opp.type === "education"
                              ? "bg-emerald-500 text-white shadow-emerald-500/30"
                              : opp.type === "training"
                                ? "bg-amber-500 text-white shadow-amber-500/30"
                                : "bg-purple-600 text-white shadow-purple-500/30"
                          }`}
                        >
                          {opp.imageUrl && (
                            <img
                              src={opp.imageUrl}
                              alt={opp.provider}
                              className="absolute inset-0 w-full h-full object-cover rounded-full z-10 bg-white"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          )}
                          <OpportunityIcon
                            logo={opp.logo}
                            className="w-7 h-7 relative z-0"
                          />
                          <div className="absolute inset-0 rounded-full border-[2px] border-white/20 dark:border-white/10 z-20 pointer-events-none" />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border tracking-widest ${
                                opp.type === "education"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30"
                                  : opp.type === "training"
                                    ? "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30"
                                    : "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/30"
                              }`}
                            >
                              {opp.type}
                            </span>
                            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700">
                              <Sparkles className="w-3 h-3 text-yellow-500" />
                              <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">
                                {score}% Match
                              </span>
                            </div>
                          </div>
                          <h3 className="font-extrabold text-2xl tracking-tight text-zinc-900 dark:text-white">
                            {opp.title}
                          </h3>
                        </div>
                      </div>

                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block font-bold mb-0.5">
                          {opp.type === "job" ? "Compensation" : "Cost"}
                        </span>
                        <span className="text-xl font-black text-zinc-800 dark:text-zinc-100">
                          {opp.salaryOrCost}
                        </span>
                      </div>
                    </div>

                    {/* Details Row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400 font-bold relative z-10 px-1">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-purple-500 dark:text-purple-400" />{" "}
                        {opp.provider}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-pink-500 dark:text-pink-400" />{" "}
                        {opp.location}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />{" "}
                        {opp.subType}
                      </span>
                    </div>

                    {/* Separator */}
                    <div className="h-px w-full bg-gradient-to-r from-zinc-200 via-zinc-200 to-transparent dark:from-zinc-800 dark:via-zinc-800 dark:to-transparent relative z-10" />

                    {/* Skills & Action */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                      <div className="flex flex-wrap gap-2">
                        {opp.isFree && (
                          <span className="text-[11px] font-bold px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20 shadow-sm">
                            Free
                          </span>
                        )}
                        {opp.hasCertificate && (
                          <span className="text-[11px] font-bold px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20 shadow-sm">
                            Certificate
                          </span>
                        )}
                        {opp.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="text-[11px] font-bold px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm"
                          >
                            {skill}
                          </span>
                        ))}
                        {opp.skills.length > 3 && (
                          <span className="text-[11px] font-bold px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200/50 dark:border-purple-500/20 text-purple-700 dark:text-purple-400 shadow-sm">
                            +{opp.skills.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="text-left sm:hidden block flex-1">
                          <span className="text-xl font-black text-zinc-800 dark:text-zinc-100">
                            {opp.salaryOrCost}
                          </span>
                        </div>
                        {alreadyApplied ? (
                          <span className="inline-flex items-center gap-1.5 text-sm font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20 px-6 py-3 rounded-full shadow-sm w-full sm:w-auto justify-center">
                            <Check className="w-4 h-4" />
                            {applicationStatus}
                          </span>
                        ) : (
                          <button className="flex items-center justify-center gap-1.5 px-8 py-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-500 dark:hover:text-white w-full sm:w-auto">
                            View Details
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6 pb-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Previous
                </button>
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Next
                </button>
              </div>
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
      </div>
    </div>
  );
};
