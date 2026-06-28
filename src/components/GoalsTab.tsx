import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Target, Flag, CheckCircle2, Circle, AlertCircle, Plus, Star, Trash2 } from "lucide-react";
import { CareerGoal, Milestone, DailyMIT } from "@/context/AppContext";

export default function GoalsTab() {
  const { careerGoal, setCareerGoal, milestones, updateMilestones, dailyMITs, updateDailyMITs, loadingAuth } = useApp();

  // Wizard state
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState("Technology");
  
  // MIT state
  const [newMITTitle, setNewMITTitle] = useState("");
  const [newMITPriority, setNewMITPriority] = useState<"High" | "Medium" | "Low">("Medium");

  // Milestone State
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState<string | null>(null);

  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-10 h-10 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const newGoal: CareerGoal = {
      id: `goal-${Date.now()}`,
      title: newGoalTitle,
      category: newGoalCategory,
      targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString(), // +90 days default
      status: "active",
      progress: 0,
      createdAt: new Date().toISOString()
    };
    
    await setCareerGoal(newGoal);
    await updateMilestones([]);
  };

  const syncMilestonesAndProgress = async (updatedMilestones: Milestone[]) => {
    await updateMilestones(updatedMilestones);
    if (careerGoal) {
      const progress = updatedMilestones.length === 0 ? 0 : Math.round((updatedMilestones.filter(m => m.completed).length / updatedMilestones.length) * 100);
      await setCareerGoal({ ...careerGoal, progress });
    }
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerGoal || !newMilestoneTitle.trim()) return;

    const newMilestone: Milestone = {
      id: `ms-${Date.now()}`,
      goalId: careerGoal.id,
      title: newMilestoneTitle,
      description: "",
      order: milestones.length + 1,
      completionPercentage: 0,
      estimatedDuration: "TBD",
      completed: false
    };

    const updated = [newMilestone, ...milestones];
    setNewMilestoneTitle("");
    setIsAddingMilestone(false);
    await syncMilestonesAndProgress(updated);
  };

  const toggleMilestone = async (id: string) => {
    const updated = milestones.map((ms: Milestone) => ms.id === id ? { ...ms, completed: !ms.completed, completionPercentage: ms.completed ? 0 : 100 } : ms);
    await syncMilestonesAndProgress(updated);
  };

  const confirmDeleteMilestone = async () => {
    if (!milestoneToDelete) return;
    const updated = milestones.filter((ms: Milestone) => ms.id !== milestoneToDelete);
    await syncMilestonesAndProgress(updated);
    setMilestoneToDelete(null);
  };

  const handleAddMIT = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMITTitle.trim() || dailyMITs.length >= 3) return;

    // First MIT is automatically the big win
    const isBigWin = dailyMITs.length === 0;

    const newMIT: DailyMIT = {
      id: `mit-${Date.now()}`,
      milestoneId: milestones[0]?.id || "", // Default to first milestone
      title: newMITTitle,
      isBigWin,
      estimatedDuration: "2 hours",
      priority: newMITPriority,
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
      notes: ""
    };

    await updateDailyMITs([...dailyMITs, newMIT]);
    setNewMITTitle("");
  };

  const toggleMITCompletion = async (id: string) => {
    const updated = dailyMITs.map((mit: DailyMIT) => mit.id === id ? { ...mit, completed: !mit.completed } : mit);
    await updateDailyMITs(updated);
  };

  const deleteMIT = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this MIT?")) {
      const updated = dailyMITs.filter((mit: DailyMIT) => mit.id !== id);
      await updateDailyMITs(updated);
    }
  };

  if (!careerGoal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in relative z-10 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-900/10 dark:to-transparent -z-10 rounded-3xl" />
        <div className="max-w-xl w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 tracking-tight">
              Define Your North Star
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-md mx-auto">
              What's the single most important milestone you want to achieve next in your career?
            </p>
          </div>

          <form onSubmit={handleCreateGoal} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl shadow-zinc-200/20 dark:shadow-black/40 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">My Primary Goal is to...</label>
              <input
                type="text"
                placeholder="e.g. Become a Senior Full-Stack Engineer"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                className="w-full px-5 py-4 bg-zinc-50/50 dark:bg-zinc-950/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-base font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-400/50 text-zinc-900 dark:text-white transition-all shadow-inner"
              />
            </div>
            <button type="submit" disabled={!newGoalTitle} className="w-full py-4 bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-white dark:to-zinc-200 hover:from-zinc-800 hover:to-zinc-700 dark:hover:from-zinc-100 dark:hover:to-white text-white dark:text-zinc-900 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 shadow-lg shadow-zinc-900/20 dark:shadow-white/10 hover:shadow-xl hover:-translate-y-0.5">
              Lock it in
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in relative z-10 max-w-5xl mx-auto w-full pb-12">
      
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Goals</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">Track your progress and stay focused on your primary objective.</p>
        </div>
      </div>

      {/* 1. Header: The Goal */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 md:p-10 rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-900/30 dark:shadow-purple-900/50 flex flex-col md:flex-row md:items-center justify-between gap-8">
        
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-fuchsia-500/30 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/30 blur-[100px] rounded-full pointer-events-none" />

        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/20 shadow-sm">
              <Target className="w-3.5 h-3.5 text-amber-300" /> Active Goal
            </div>
            <button 
              onClick={() => setShowConfirmModal(true)}
              className="text-xs font-semibold text-purple-200 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/10"
            >
              Start Fresh
            </button>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">{careerGoal.title}</h2>
        </div>
        <div className="w-full md:w-72 space-y-3 relative z-10 bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-inner">
          <div className="flex justify-between text-sm font-bold text-white">
            <span className="text-purple-100">Overall Progress</span>
            <span className="text-amber-300">{milestones.length === 0 ? 0 : Math.round((milestones.filter(m => m.completed).length / milestones.length) * 100)}%</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden border border-white/10 shadow-inner">
            <div 
              className="bg-gradient-to-r from-amber-300 to-orange-500 h-2.5 rounded-full transition-all duration-700 ease-out relative shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
              style={{ width: `${milestones.length === 0 ? 0 : Math.round((milestones.filter(m => m.completed).length / milestones.length) * 100)}%` }} 
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Milestones */}
      <div className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-xl text-zinc-900 dark:text-white flex items-center gap-2">
              <Flag className="w-6 h-6 text-purple-500" /> Roadmap
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1 ml-8">Break your goal down into achievable milestones.</p>
          </div>
          <button 
            onClick={() => setIsAddingMilestone(!isAddingMilestone)} 
            className="text-sm font-bold text-white dark:text-zinc-400 dark:hover:text-white transition-colors bg-zinc-900 dark:bg-zinc-900 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md"
          >
            {isAddingMilestone ? "Cancel" : "+ Add Milestone"}
          </button>
        </div>

        <div className="bg-white/40 dark:bg-zinc-900/30 backdrop-blur-2xl p-4 md:p-6 rounded-[2rem] border border-white/60 dark:border-zinc-800/50 shadow-sm space-y-6">
          {isAddingMilestone && (
            <form onSubmit={handleAddMilestone} className="flex gap-3 animate-in fade-in slide-in-from-top-2 bg-white dark:bg-zinc-900 p-2 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800/80">
              <input
                type="text"
                placeholder="e.g. Master React Hooks"
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                className="flex-grow px-4 py-3 bg-transparent text-sm font-medium focus:outline-none text-zinc-900 dark:text-white"
                autoFocus
              />
              <button type="submit" disabled={!newMilestoneTitle} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 shrink-0 shadow-md shadow-purple-600/20 hover:shadow-lg hover:-translate-y-0.5">
                Add
              </button>
            </form>
          )}

          {milestones.length === 0 && !isAddingMilestone ? (
            <div className="text-center py-16 px-4 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700/50">
              <div className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Flag className="w-6 h-6 text-zinc-400" />
              </div>
              <p className="text-base font-semibold text-zinc-600 dark:text-zinc-400">Your roadmap is clear. Start breaking your goal down.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {milestones.map((ms: Milestone) => (
                <div key={ms.id} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-900/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
                  <div className="flex items-start gap-3 mb-6 relative z-10">
                    <button onClick={() => toggleMilestone(ms.id)} className="mt-0.5 shrink-0">
                      {ms.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-zinc-300 dark:text-zinc-600 hover:text-purple-500 dark:hover:text-purple-400 transition-colors" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0 pr-8">
                      <h4 className={`font-bold text-base break-words ${ms.completed ? 'text-zinc-400 dark:text-zinc-500 line-through' : 'text-zinc-900 dark:text-white'}`}>{ms.title}</h4>
                      {ms.description && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 break-words">{ms.description}</p>}
                    </div>
                    <button onClick={() => setMilestoneToDelete(ms.id)} className="absolute top-0 right-0 text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-colors p-1.5 bg-white hover:bg-red-50 dark:bg-zinc-900 dark:hover:bg-red-900/20 rounded-md shadow-sm border border-transparent hover:border-red-100 dark:hover:border-red-900/30">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-950 rounded-full h-1.5 overflow-hidden relative z-10">
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${ms.completed ? 'bg-emerald-500' : 'bg-zinc-900 dark:bg-white'}`} style={{ width: `${ms.completionPercentage}%` }} />
                  </div>
                  {/* Subtle completed background tint */}
                  {ms.completed && <div className="absolute inset-0 bg-emerald-50/30 dark:bg-emerald-950/10 pointer-events-none" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Daily MIT Planning */}
      <div className="space-y-6 pt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <h3 className="font-bold text-xl text-zinc-900 dark:text-white flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" /> Today's Focus (MITs)
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Protect your momentum. What are the 1-3 highest leverage actions today?</p>
          </div>
          <div className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              {dailyMITs.filter(m => m.completed).length} / {dailyMITs.length} Done
            </span>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-zinc-900/30 backdrop-blur-xl p-2 md:p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
          {/* MIT List */}
          <div className="space-y-3">
            {dailyMITs.map((mit: DailyMIT) => (
              <div key={mit.id} className={`group relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${mit.completed ? 'bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200/50 dark:border-zinc-800/50 opacity-75' : mit.isBigWin ? 'bg-white dark:bg-zinc-900 border-amber-300 dark:border-amber-700 shadow-[0_0_20px_rgba(251,191,36,0.1)]' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'}`}>
                {mit.isBigWin && !mit.completed && <div className="absolute -left-[1px] top-4 bottom-4 w-1 bg-amber-400 rounded-r-full" />}
                
                <button onClick={() => toggleMITCompletion(mit.id)} className="mt-0.5 shrink-0 transition-transform active:scale-90">
                  {mit.completed ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Circle className="w-6 h-6 text-zinc-300 dark:text-zinc-600 hover:text-amber-500 transition-colors" />}
                </button>
                <div className="flex-grow min-w-0 pr-8">
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <span className={`font-bold text-base truncate ${mit.completed ? 'text-zinc-400 dark:text-zinc-500 line-through' : 'text-zinc-900 dark:text-white'}`}>{mit.title}</span>
                    {mit.isBigWin && <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-widest uppercase bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">The Big Win</span>}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">⏱️ {mit.estimatedDuration}</span>
                    <span className="flex items-center gap-1">🎯 {mit.priority}</span>
                  </div>
                </div>
                <button onClick={() => deleteMIT(mit.id)} className="absolute top-5 right-5 text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-colors p-1.5 bg-white hover:bg-red-50 dark:bg-zinc-900 dark:hover:bg-red-900/20 rounded-md shadow-sm border border-transparent hover:border-red-100 dark:hover:border-red-900/30">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {dailyMITs.length === 0 && (
              <div className="text-center py-12 px-4 bg-white/50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700">
                <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-amber-500" />
                </div>
                <h4 className="font-bold text-zinc-900 dark:text-white mb-1">Win the Day</h4>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">Define your One Big Win. If you only accomplish this one thing today, you'll still be moving forward.</p>
              </div>
            )}
          </div>

          {/* Add MIT Form (Hidden if >= 3) */}
          {dailyMITs.length < 3 && (
            <form onSubmit={handleAddMIT} className="pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder={dailyMITs.length === 0 ? "What's the One Big Win for today?" : "Add a secondary task..."}
                  value={newMITTitle}
                  onChange={(e) => setNewMITTitle(e.target.value)}
                  className="flex-grow px-5 py-4 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-zinc-900 dark:text-white shadow-sm transition-all"
                />
                <button type="submit" disabled={!newMITTitle} className={`px-8 py-4 rounded-2xl text-sm font-bold transition-all shrink-0 flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${dailyMITs.length === 0 ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900'}`}>
                  <Plus className="w-4 h-4" />
                  {dailyMITs.length === 0 ? 'Add Big Win' : 'Add Task'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* End Goal Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-black/50 transform transition-all">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-6">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">End current goal?</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
              Are you sure you want to end this goal and start fresh? This action will permanently delete all your current milestones and MITs. You cannot undo this.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  setShowConfirmModal(false);
                  await setCareerGoal(null);
                  await updateMilestones([]);
                  await updateDailyMITs([]);
                }}
                className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Milestone Confirmation Modal */}
      {milestoneToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-black/50 transform transition-all">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-6">
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Delete Milestone?</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
              Are you sure you want to delete this milestone? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setMilestoneToDelete(null)}
                className="px-5 py-2.5 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteMilestone}
                className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
