"use client";

import React, { useState } from "react";
import { useApp, Opportunity } from "@/context/AppContext";
import {
  Briefcase,
  BookOpen,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Sparkles,
  Search,
  Compass,
  Code,
  Brain,
  Shield,
  Palette,
  TrendingUp,
  Server,
  DollarSign,
  Users,
  Activity,
  Laptop,
  GraduationCap,
  ChevronDown
} from "lucide-react";
import { OpportunityIcon } from "./OpportunityIcon";
import { useRouter } from "next/navigation";

export const PostOpportunityPage: React.FC = () => {
  const { addOpportunity, seekerProfile } = useApp();
  const router = useRouter();

  // Wizard active step tracker (1 to 5, where 5 is live review and 6 is success screen)
  const [step, setStep] = useState(1);

  // Opportunity configuration states
  const [oppType, setOppType] = useState<Opportunity["type"]>("job");
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [logo, setLogo] = useState("briefcase");
  const [location, setLocation] = useState("");
  const [oppSubType, setOppSubType] = useState("Full-time");
  const [isSubTypeDropdownOpen, setIsSubTypeDropdownOpen] = useState(false);
  const [isLogoDropdownOpen, setIsLogoDropdownOpen] = useState(false);

  const logoOptions = [
    { value: "briefcase", label: "💼 Briefcase (General Job)" },
    { value: "code", label: "⚛️ Code Symbol (Software/Development)" },
    { value: "brain", label: "🧠 Brain Concept (Data Science & AI)" },
    { value: "palette", label: "🎨 Painter Palette (UI/UX Design)" },
    { value: "trending-up", label: "📈 Growth Trend (Marketing/Sales)" },
    { value: "graduation-cap", label: "🎓 Graduation Cap (Education/Degrees)" },
    { value: "laptop", label: "💻 Laptop Device (Bootcamp/Training)" },
    { value: "book-open", label: "📖 Open Book (Self-paced Courses)" }
  ];
  
  // Salary / Costs
  const [salaryOrCost, setSalaryOrCost] = useState("");
  const [salaryNum, setSalaryNum] = useState<number>(0);
  
  // Toggles for Courses/Training
  const [isFree, setIsFree] = useState(false);
  const [isBeginner, setIsBeginner] = useState(true);
  const [hasCert, setHasCert] = useState(true);

  const [category, setCategory] = useState("Software Development");
  const [description, setDescription] = useState("");
  const [requirementsText, setRequirementsText] = useState("");
  const [skillsText, setSkillsText] = useState("");

  const [isPublishing, setIsPublishing] = useState(false);

  // List of technical sectors
  const categories = [
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

  const stepsList = [
    { label: "Classification", desc: "Select type & field" },
    { label: "Basic Info", desc: "Provider, title & location" },
    { label: "Pricing & Rules", desc: "Compensation details" },
    { label: "Details", desc: "Requirements & skills" },
    { label: "Review", desc: "Inspect & publish" }
  ];

  // Helper validation for active step transition
  const canGoNext = () => {
    if (step === 1) return !!category;
    if (step === 2) return !!title && !!provider && !!location && !!logo;
    if (step === 3) return !!salaryOrCost;
    if (step === 4) return !!description && !!requirementsText && !!skillsText;
    return true;
  };

  const handleNextStep = () => {
    if (canGoNext()) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await addOpportunity({
        title,
        provider,
        logo,
        location,
        salaryOrCost,
        salaryNum,
        category,
        type: oppType,
        subType: oppSubType,
        isFree: oppType !== "job" ? isFree : undefined,
        isBeginnerFriendly: oppType !== "job" ? isBeginner : undefined,
        hasCertificate: oppType !== "job" ? hasCert : undefined,
        description,
        requirements: requirementsText.split(";").map((r) => r.trim()).filter(Boolean),
        skills: skillsText.split(",").map((s) => s.trim()).filter(Boolean)
      });
      setStep(6); // Success
    } catch (e) {
      console.error(e);
    } finally {
      setIsPublishing(false);
    }
  };

  const calculateMatchScore = (jobSkills: string[]) => {
    if (!jobSkills || jobSkills.length === 0) return 100;
    const common = jobSkills.filter((s) =>
      seekerProfile.skills.map((ps) => ps.toLowerCase()).includes(s.toLowerCase())
    );
    return Math.round((common.length / jobSkills.length) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Wizard Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Publish an <span className="text-gradient">Opportunity</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-lg mx-auto">
          Share jobs, courses, and career listings instantly with our seeker network. No sign-up required.
        </p>
      </div>


      {step <= 5 && (
        /* Progress Timeline Bar */
        <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-purple-500/5 shadow-xl">
          <div className="flex justify-between items-center relative w-full px-2 sm:px-4">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-zinc-900/60 dark:bg-zinc-800 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-8 right-8 h-0.5 bg-purple-650 -translate-y-1/2 z-0 transition-all duration-300 origin-left"
              style={{ transform: `scaleX(${(step - 1) / (stepsList.length - 1)})` }}
            />

            {stepsList.map((s, idx) => {
              const active = step === idx + 1;
              const completed = step > idx + 1;
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 z-10 relative">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      active
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25 ring-4 ring-purple-600/20"
                        : completed
                        ? "bg-purple-950 text-purple-300 border border-purple-500/35"
                        : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                    }`}
                  >
                    {completed ? "✓" : idx + 1}
                  </div>
                  <div className="text-center hidden sm:block">
                    <div className={`text-[10px] sm:text-xs font-extrabold ${active ? "text-purple-400" : "text-zinc-400"}`}>
                      {s.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main wizard cards step content */}
      <div className="glass-panel rounded-3xl p-4 sm:p-8 border border-purple-500/10 shadow-2xl space-y-6 min-h-[350px] flex flex-col justify-between">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in flex-1">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-zinc-150">Select Opportunity Type</h2>
              <p className="text-xs text-zinc-500">What type of listing are you posting today?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: "job",
                  title: "Job (Work)",
                  desc: "Full-time, contract, part-time or remote vacancies",
                  icon: Briefcase,
                  subDefault: "Full-time",
                  color: "border-purple-500/10 hover:border-purple-500/30 text-purple-400 bg-purple-500/5"
                },
                {
                  id: "education",
                  title: "Education",
                  desc: "Video courses, university degrees or college lessons",
                  icon: BookOpen,
                  subDefault: "Course",
                  color: "border-emerald-500/10 hover:border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
                },
                {
                  id: "training",
                  title: "Career Opportunity",
                  desc: "Bootcamps, internships or apprenticeship schemes",
                  icon: Award,
                  subDefault: "Bootcamp",
                  color: "border-amber-500/10 hover:border-amber-500/30 text-amber-400 bg-amber-500/5"
                }
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = oppType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setOppType(opt.id as any);
                      setOppSubType(opt.subDefault);
                    }}
                    className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 group min-h-[140px] relative ${
                      isSelected
                        ? "border-purple-600 bg-purple-600/10 shadow-lg shadow-purple-500/5"
                        : "bg-zinc-950/40 border-zinc-900 hover:bg-zinc-900/40"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                        ✓
                      </div>
                    )}
                    <div className={`p-2.5 rounded-xl border w-fit ${isSelected ? "bg-purple-600/10 border-purple-500/20 text-purple-350" : opt.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 pt-3">
                      <div className="font-extrabold text-sm text-zinc-150">{opt.title}</div>
                      <div className="text-[10px] text-zinc-500 group-hover:text-zinc-400 transition-colors leading-relaxed">
                        {opt.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-extrabold text-zinc-450 block uppercase tracking-wider">Select Technical Field / Category</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.map((cat) => {
                  const Icon = categoryIcons[cat] || Compass;
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-purple-600 text-white border-purple-500"
                          : "bg-zinc-900/30 border-zinc-900 hover:border-purple-500/10 hover:bg-zinc-900/50 text-zinc-400"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-purple-500"}`} />
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in flex-1">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-zinc-150">Basic Information</h2>
              <p className="text-xs text-zinc-500">Provide details about the listing entity and title.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase">Opportunity Title</label>
                <input
                  type="text"
                  required
                  placeholder={
                    oppType === "job"
                      ? "e.g. Senior Frontend Architect"
                      : oppType === "education"
                      ? "e.g. Advanced UI Design Specialization"
                      : "e.g. 12-Week AI Engineering Bootcamp"
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900/50 rounded-xl border border-purple-500/10 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent text-xs text-zinc-200 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase">Organization / Provider Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PixelCraft Agency or Stanford Univ"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900/50 rounded-xl border border-purple-500/10 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent text-xs text-zinc-200 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase">Office Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chicago, IL (Remote) or Hybrid"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900/50 rounded-xl border border-purple-500/10 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent text-xs text-zinc-200 transition-all"
                />
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase">Sub-Type Format</label>
                <button
                  type="button"
                  onClick={() => setIsSubTypeDropdownOpen(!isSubTypeDropdownOpen)}
                  className="w-full px-4 py-3 bg-zinc-900/50 rounded-xl border border-purple-500/10 text-xs text-zinc-200 text-left flex items-center justify-between transition-all select-none cursor-pointer"
                >
                  <span>{oppSubType}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isSubTypeDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {isSubTypeDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsSubTypeDropdownOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-1 z-40 max-h-40 overflow-y-auto glass-panel rounded-xl p-1.5 border border-purple-500/20 shadow-xl scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                      {(oppType === "job"
                        ? ["Full-time", "Part-time", "Remote", "Contract"]
                        : oppType === "education"
                        ? ["Course", "Degree", "Scholarship"]
                        : ["Bootcamp", "Apprenticeship", "Internship"]
                      ).map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => {
                            setOppSubType(sub);
                            setIsSubTypeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                            oppSubType === sub
                              ? "bg-purple-650 text-white"
                              : "text-zinc-400 hover:text-zinc-200 hover:bg-purple-500/10"
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-bold text-zinc-400 block uppercase">Logo Visual Identifier</label>
              <button
                type="button"
                onClick={() => setIsLogoDropdownOpen(!isLogoDropdownOpen)}
                className="w-full px-4 py-3 bg-zinc-900/50 rounded-xl border border-purple-500/10 text-xs text-zinc-200 text-left flex items-center justify-between transition-all select-none cursor-pointer"
              >
                <span>{logoOptions.find(o => o.value === logo)?.label || logo}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isLogoDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {isLogoDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsLogoDropdownOpen(false)} />
                  <div className="absolute top-full left-0 right-0 mt-1 z-40 max-h-52 overflow-y-auto glass-panel rounded-xl p-1.5 border border-purple-500/20 shadow-xl scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    {logoOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setLogo(opt.value);
                          setIsLogoDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                          logo === opt.value
                            ? "bg-purple-650 text-white"
                            : "text-zinc-455 hover:text-zinc-200 hover:bg-purple-500/10"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in flex-1">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-zinc-150">Financials & Criteria</h2>
              <p className="text-xs text-zinc-500">Provide compensation details and filtering criteria tags.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase">
                  {oppType === "job" ? "Salary Range (Text Display)" : "Tuition Cost (Text Display)"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={oppType === "job" ? "e.g. $100,000 - $120,000" : "e.g. Free or $800"}
                  value={salaryOrCost}
                  onChange={(e) => setSalaryOrCost(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900/50 rounded-xl border border-purple-500/10 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent text-xs text-zinc-200 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase">
                  {oppType === "job" ? "Minimum Salary Threshold ($)" : "Numeric Cost ($)"}
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 100000 or 0"
                  value={salaryNum || ""}
                  onChange={(e) => setSalaryNum(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-zinc-900/50 rounded-xl border border-purple-500/10 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent text-xs text-zinc-200 transition-all"
                />
              </div>
            </div>

            {oppType !== "job" && (
              <div className="space-y-3 p-4 bg-zinc-900/30 rounded-2xl border border-purple-500/5">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Program Attributes</div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-zinc-400 hover:text-zinc-200 select-none">
                    <input
                      type="checkbox"
                      checked={isFree}
                      onChange={(e) => setIsFree(e.target.checked)}
                      className="w-4 h-4 rounded border-purple-500/10 accent-purple-600 focus:ring-purple-600"
                    />
                    <span>This program is free</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-zinc-400 hover:text-zinc-200 select-none">
                    <input
                      type="checkbox"
                      checked={isBeginner}
                      onChange={(e) => setIsBeginner(e.target.checked)}
                      className="w-4 h-4 rounded border-purple-500/10 accent-purple-600 focus:ring-purple-600"
                    />
                    <span>Beginner Friendly</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-zinc-400 hover:text-zinc-200 select-none">
                    <input
                      type="checkbox"
                      checked={hasCert}
                      onChange={(e) => setHasCert(e.target.checked)}
                      className="w-4 h-4 rounded border-purple-500/10 accent-purple-600"
                    />
                    <span>Award Certificate</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fade-in flex-1">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-zinc-150">Detailed Descriptions</h2>
              <p className="text-xs text-zinc-500">Outline the target candidate profile and skills required.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 block uppercase">Opportunity Description</label>
              <textarea
                rows={3}
                required
                placeholder="Write a clear summary of what seekers will learn or accomplish in this role..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900/50 rounded-xl border border-purple-500/10 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent text-xs text-zinc-200 resize-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 block uppercase">Key Requirements (Semicolon separated ;)</label>
              <textarea
                rows={2}
                required
                placeholder="e.g. 2+ years React experience; Excellent communication; Familiarity with Git;"
                value={requirementsText}
                onChange={(e) => setRequirementsText(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900/50 rounded-xl border border-purple-500/10 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent text-xs text-zinc-200 resize-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 block uppercase">Skills Required (Comma separated)</label>
              <input
                type="text"
                required
                placeholder="e.g. React, TypeScript, Tailwind CSS"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900/50 rounded-xl border border-purple-500/10 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent text-xs text-zinc-200 transition-all"
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 animate-fade-in flex-1">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-zinc-150">Review Sandbox Posting</h2>
              <p className="text-xs text-zinc-500">Confirm the layout matches your expectations before deploying to database.</p>
            </div>

            {/* Simulated Live Seeker Card Preview */}
            <div className="space-y-2">
              <div className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest pl-1">Live Preview Card</div>
              <div className="glass-panel rounded-2xl p-5 border border-purple-500/20 max-w-2xl flex flex-col sm:flex-row gap-5 items-start justify-between relative group select-none pointer-events-none">
                <div className="flex gap-4 items-start">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                    oppType === "education"
                      ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                      : oppType === "training"
                      ? "bg-amber-500/10 border-amber-500/25 text-amber-400"
                      : "bg-purple-500/10 border-purple-500/25 text-purple-400"
                  }`}>
                    <OpportunityIcon logo={logo} className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base text-zinc-150">
                        {title || "Opportunity Title"}
                      </h3>
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider border ${
                        oppType === "education"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/15"
                          : oppType === "training"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/15"
                          : "bg-purple-500/10 text-purple-400 border-purple-500/15"
                      }`}>
                        {oppType === "training" ? "career" : oppType}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400">
                      <span className="font-semibold text-zinc-300">{provider || "Provider Name"}</span>
                      <span>•</span>
                      <span>{location || "Location"}</span>
                      <span>•</span>
                      <span>{oppSubType}</span>
                    </div>

                    {oppType !== "job" && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {isFree && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500">
                            Free Opportunity
                          </span>
                        )}
                        {isBeginner && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-sky-500/10 text-sky-400">
                            Beginner Friendly
                          </span>
                        )}
                        {hasCert && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400">
                            Certificate Awarded
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {(skillsText ? skillsText.split(",") : ["React", "CSS"]).slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-purple-500/10 gap-2">
                  <div className="flex items-center gap-1.5 sm:mb-2 bg-purple-600/10 text-purple-300 px-2 py-1 rounded-lg">
                    <Sparkles className="w-3.5 h-3.5 fill-purple-600 dark:fill-transparent animate-pulse" />
                    <span className="text-xs font-bold">{calculateMatchScore(skillsText ? skillsText.split(",") : [])}% Match</span>
                  </div>

                  <div className="text-right sm:block hidden mb-2">
                    <span className="text-xs text-zinc-500 block font-medium">
                      {oppType === "job" ? "Compensation Range" : "Opportunity Cost"}
                    </span>
                    <span className="text-sm font-bold text-zinc-300">
                      {salaryOrCost || "Free"}
                    </span>
                  </div>

                  <button className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-semibold transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="py-8 text-center space-y-6 animate-scale-up flex-1 flex flex-col justify-center items-center">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-emerald-500 w-fit animate-pulse">
              <CheckCircle2 className="w-14 h-14" />
            </div>
            
            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl font-extrabold text-zinc-150">Published Successfully!</h2>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Your opportunity listing has been written to the Firestore database. It is now live and searchable in the Seekers' opportunity index.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 justify-center">
              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setDescription("");
                  setRequirementsText("");
                  setSkillsText("");
                  setSalaryOrCost("");
                  setSalaryNum(0);
                  setStep(1);
                }}
                className="px-5 py-2.5 rounded-xl border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Post Another
              </button>
              <button
                type="button"
                onClick={() => {
                  router.push("/browse");
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-750 text-white text-xs font-bold shadow-md shadow-purple-500/10 transition-all"
              >
                Go to Browse Opportunities
              </button>
            </div>
          </div>
        )}

        {step <= 5 && (
          /* Wizard Action buttons */
          <div className="flex justify-between items-center pt-6 border-t border-purple-500/10">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={step === 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-zinc-800 text-zinc-400 hover:text-zinc-200 ${
                step === 1 ? "opacity-30 cursor-not-allowed" : ""
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {step === 5 ? (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/15"
              >
                <span>{isPublishing ? "Publishing..." : "Publish Listing"}</span>
                <Sparkles className="w-4 h-4 fill-white" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!canGoNext()}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-650/30 disabled:text-zinc-550 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/15 ${
                  !canGoNext() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
