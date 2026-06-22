"use client";

import React, { useState } from "react";
import { useApp, Opportunity } from "@/context/AppContext";
import { Sparkles, Check, Plus, AlertCircle, BookOpen, User, PlusCircle } from "lucide-react";
import { OpportunityIcon } from "./OpportunityIcon";

export const MatchingTab: React.FC = () => {
  const { opportunities, seekerProfile, updateSeekerProfile } = useApp();
  const [newSkill, setNewSkill] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // Edit profile states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(seekerProfile.name);
  const [editTitle, setEditTitle] = useState(seekerProfile.title);
  const [editBio, setEditBio] = useState(seekerProfile.bio);

  const startEditing = () => {
    setEditName(seekerProfile.name);
    setEditTitle(seekerProfile.title);
    setEditBio(seekerProfile.bio);
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeekerProfile({
      ...seekerProfile,
      name: editName.trim() || seekerProfile.name,
      title: editTitle.trim() || seekerProfile.title,
      bio: editBio.trim() || seekerProfile.bio
    });
    setIsEditing(false);
    setStatusMessage("Profile updated successfully! Recalculating match scores...");
    setTimeout(() => setStatusMessage(""), 2000);
  };

  // Add skill to profile
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const skillName = newSkill.trim();
    if (seekerProfile.skills.some((s) => s.toLowerCase() === skillName.toLowerCase())) {
      setStatusMessage("Skill already exists in your profile!");
      setTimeout(() => setStatusMessage(""), 2000);
      return;
    }
    const updatedSkills = [...seekerProfile.skills, skillName];
    updateSeekerProfile({
      ...seekerProfile,
      skills: updatedSkills
    });
    setNewSkill("");
    setStatusMessage("Skill added! Recalculating match scores...");
    setTimeout(() => setStatusMessage(""), 2000);
  };

  // Remove skill
  const handleRemoveSkill = (skill: string) => {
    const updatedSkills = seekerProfile.skills.filter((s) => s !== skill);
    updateSeekerProfile({
      ...seekerProfile,
      skills: updatedSkills
    });
    setStatusMessage("Skill removed! Recalculating scores...");
    setTimeout(() => setStatusMessage(""), 2000);
  };

  // Match score calculator
  const getMatchScore = (opp: Opportunity) => {
    if (!opp.skills || opp.skills.length === 0) return 100;
    const match = opp.skills.filter((s) =>
      seekerProfile.skills.map((ps) => ps.toLowerCase()).includes(s.toLowerCase())
    );
    return Math.round((match.length / opp.skills.length) * 100);
  };

  // Sort opportunities (jobs) by match score
  const matchedJobs = opportunities
    .filter(o => o.type === "job")
    .map((j) => ({ opp: j, score: getMatchScore(j) }))
    .sort((a, b) => b.score - a.score);

  // Skill Gap Analysis
  // Find skills required by platform opportunities that the user does not have
  const allOppSkills = Array.from(new Set(opportunities.flatMap((o) => o.skills)));
  const missingSkills = allOppSkills.filter(
    (os) => !seekerProfile.skills.map((s) => s.toLowerCase()).includes(os.toLowerCase())
  );

  // Frequency of each missing skill requested in opportunities
  const skillFrequency = missingSkills.reduce((acc, skill) => {
    const count = opportunities.filter((o) =>
      o.skills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
    ).length;
    acc[skill] = count;
    return acc;
  }, {} as Record<string, number>);

  // Sort missing skills by frequency of requests
  const recommendedSkills = Object.entries(skillFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([skill]) => skill)
    .slice(0, 5);

  const getCourseForSkill = (skill: string) => {
    // Look for a course or bootcamp in the actual opportunities feed that contains the skill!
    const recommendation = opportunities.find(
      o => o.type !== "job" && o.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
    );

    if (recommendation) {
      return {
        title: recommendation.title,
        provider: recommendation.provider,
        cost: recommendation.salaryOrCost,
        type: recommendation.type
      };
    }

    // Fallback if none found
    return {
      title: `${skill} Professional Specialization`,
      provider: "PEET Partner Network",
      cost: "Free",
      type: "education"
    };
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-purple-600/10 text-purple-600 dark:text-purple-700 px-3 py-1 rounded-xl text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5 fill-purple-600 dark:fill-transparent animate-pulse" />
          AI Smart Matching Hub
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          AI Fit & <span className="text-gradient">Skill Gap Analyzer</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-600 text-sm">
          PEET matches your credentials against work and learning opportunities in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Profile Summary & Skill management */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-700 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-800">Your Smart Profile</h3>
              </div>
              {!isEditing && (
                <button
                  onClick={startEditing}
                  className="text-xs font-bold text-purple-600 dark:text-purple-700 hover:text-purple-750 dark:hover:text-purple-600 transition-colors cursor-pointer"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 bg-zinc-50 dark:bg-zinc-100/60 p-4 rounded-2xl border border-purple-500/5">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-100 rounded-xl border border-purple-200/50 text-xs text-zinc-700 dark:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider block">Job Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-100 rounded-xl border border-purple-200/50 text-xs text-zinc-700 dark:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider block">Professional Biography</label>
                  <textarea
                    rows={3}
                    required
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-100 rounded-xl border border-purple-200/50 text-xs text-zinc-700 dark:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-600 text-[10px] font-bold hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-[10px] font-bold hover:bg-purple-700 transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-1 bg-zinc-50 dark:bg-zinc-100/60 p-4 rounded-2xl border border-purple-500/5">
                <div className="text-base font-bold text-zinc-800 dark:text-zinc-800">
                  {seekerProfile.name}
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-700 font-bold">
                  {seekerProfile.title}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-600 pt-2 line-clamp-3 leading-relaxed">
                  {seekerProfile.bio}
                </p>
              </div>
            )}

            {/* Current Skills List */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-zinc-600">Your Current Skills ({seekerProfile.skills.length})</div>
              <div className="flex flex-wrap gap-1.5">
                {seekerProfile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 text-[10px] font-bold bg-purple-600/10 text-purple-600 dark:text-purple-700 border border-purple-200/50 px-2.5 py-1 rounded-xl"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-zinc-600 hover:text-red-500 ml-1 transition-colors"
                      aria-label={`Remove skill ${skill}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Add Skill Form */}
            <form onSubmit={handleAddSkill} className="space-y-2 pt-2 border-t border-purple-200/50">
              <label className="text-[11px] font-bold text-zinc-600 block">Add New Skill</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Docker, PyTorch"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-100/60 rounded-xl border border-zinc-200 dark:border-purple-200/50 text-xs text-zinc-700 dark:text-purple-800 focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
                <button
                  type="submit"
                  className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
                  aria-label="Add Skill"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>

            {statusMessage && (
              <div className="text-center text-[10px] font-bold text-purple-600 dark:text-purple-700 bg-purple-600/10 p-2 rounded-lg transition-all animate-pulse">
                {statusMessage}
              </div>
            )}
          </div>
        </div>

        {/* Center column: Recommended matched list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-800">
              Ranked Job Matches ({matchedJobs.length})
            </h3>
            <div className="space-y-3">
              {matchedJobs.map(({ opp, score }) => {
                const overlappingSkills = opp.skills.filter((js) =>
                  seekerProfile.skills.map((s) => s.toLowerCase()).includes(js.toLowerCase())
                );
                const missingCount = opp.skills.length - overlappingSkills.length;

                return (
                  <div
                    key={opp.id}
                    className="p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-100/40 border border-purple-500/5 hover:border-purple-200 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <OpportunityIcon logo={opp.logo} className="w-5 h-5 text-purple-600" />
                        <h4 className="font-bold text-sm text-zinc-880 dark:text-zinc-100">
                          {opp.title}
                        </h4>
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-600">
                        {opp.provider} • {opp.location}
                      </div>

                      {/* Matching breakdown details */}
                      <div className="text-[11px] text-zinc-600 pt-1">
                        <span className="font-semibold text-purple-600 dark:text-purple-700">
                          {overlappingSkills.length} overlapping skills
                        </span>{" "}
                        • {missingCount > 0 ? `${missingCount} missing skills` : "100% matched!"}
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-2.5 md:pt-0 border-purple-500/5">
                      <div className="text-xs font-bold bg-purple-600/10 text-purple-600 dark:text-purple-700 px-2.5 py-1 rounded-xl">
                        {score}% Fit
                      </div>
                      {/* Fit Score Progress Bar */}
                      <div className="w-24 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-2.5 hidden md:block overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skill Gap Analysis & Recommendations */}
          {recommendedSkills.length > 0 && (
            <div className="glass-panel rounded-3xl p-5 space-y-4">
              <div className="flex gap-2 items-center">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-700 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-800">
                  Skill Gap & Training Recommender
                </h3>
              </div>
              <p className="text-xs text-zinc-600">
                These skills are highly requested by the opportunities on PEET but missing from your profile. Enroll in these linked courses to build skills.
              </p>

              <div className="space-y-3">
                {recommendedSkills.map((skill) => {
                  const course = getCourseForSkill(skill);
                  return (
                    <div
                      key={skill}
                      className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-100/40 border border-purple-500/5 flex flex-col md:flex-row justify-between gap-3"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                          <span className="text-xs font-bold text-zinc-880 dark:text-zinc-800 uppercase tracking-wider">
                            {skill}
                          </span>
                          <span className={`text-[8px] font-extrabold uppercase px-1 py-0.2 rounded border ${
                            course.type === "training"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/10"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
                          }`}>
                            {course.type}
                          </span>
                        </div>
                        {/* Course info */}
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-600">
                          <BookOpen className="w-3.5 h-3.5 text-purple-600/60" />
                          <span className="font-medium text-zinc-700 dark:text-purple-800">{course.title}</span>
                          <span>•</span>
                          <span className="text-[10px]">{course.provider} ({course.cost})</span>
                        </div>
                      </div>

                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => {
                            updateSeekerProfile({
                              ...seekerProfile,
                              skills: [...seekerProfile.skills, skill]
                            });
                            setStatusMessage(`Added ${skill}! Match percentages recalculated.`);
                            setTimeout(() => setStatusMessage(""), 2000);
                          }}
                          className="px-3 py-1.5 bg-purple-600/10 text-purple-600 dark:text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-600/20 transition-colors"
                        >
                          Add Skill
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
