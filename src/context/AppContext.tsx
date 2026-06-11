"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, isConfigured } from "@/lib/firebase";

// Types
export interface Opportunity {
  id: string;
  title: string;
  provider: string; // company or institution
  logo: string;
  location: string;
  salaryOrCost: string; // e.g., "$120,000", "Free", "$2,000"
  salaryNum: number; // For sorting/filtering
  category: string;
  type: "job" | "education" | "training";
  subType: string; // "Full-time", "Course", "Bootcamp", "Apprenticeship", etc.
  description: string;
  requirements: string[];
  skills: string[];
  datePosted: string;
  deadline?: string;
  applicationLink?: string;
  isFree?: boolean;
  isBeginnerFriendly?: boolean;
  hasCertificate?: boolean;
  companyDesc?: string; // fallback
  analytics?: {
    views: number;
    clicks: number;
  };
}

export interface Application {
  id: string;
  jobId: string; // Maps to opportunity id
  seekerName: string;
  seekerTitle: string;
  seekerEmail: string;
  seekerSkills: string[];
  cvUrl?: string;
  coverLetter?: string;
  status: "Applied" | "Shortlisted" | "Offered" | "Rejected";
  appliedDate: string;
  notes?: string;
}

export interface SeekerProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  bio: string;
  skills: string[];
  experience: {
    id: string;
    role: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    id: string;
    degree: string;
    school: string;
    year: string;
  }[];
}

export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export interface SavedSearch {
  id: string;
  keyword: string;
  location: string;
  category: string;
}

export interface JobAlert {
  id: string;
  keyword: string;
  email: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "match" | "application" | "info";
  read: boolean;
  timestamp: string; // ISO String
}

export interface CommunityComment {
  author: string;
  text: string;
  date: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  topic: "Career Advice" | "Technical Skills" | "Interview Prep" | "Show & Tell";
  upvotes: number;
  comments: CommunityComment[];
  date: string;
}

interface AppContextType {
  // Theme & User Perspective
  theme: "light" | "dark";
  toggleTheme: () => void;
  userType: "seeker" | "provider" | "admin";
  setUserType: (type: "seeker" | "provider" | "admin") => void;
  user: User | null;
  loadingAuth: boolean;
  logout: () => Promise<void>;

  // Seeker State
  seekerProfile: SeekerProfile;
  updateSeekerProfile: (profile: SeekerProfile) => void | Promise<void>;
  seekerCVContent: string;
  setSeekerCVContent: (content: string) => void;
  seekerCoverLetter: string;
  setSeekerCoverLetter: (letter: string) => void;

  // Chatbot & Career suite
  chatMessages: Message[];
  sendChatMessage: (text: string) => void | Promise<void>;
  clearChat: () => void;
  interviewQuestionIndex: number;
  setInterviewQuestionIndex: (idx: number) => void;
  interviewFeedback: { question: string; answer: string; feedback: string; score: number }[];
  addInterviewFeedback: (question: string, answer: string, feedback: string, score: number) => void;
  resetInterview: () => void;

  // Opportunities
  opportunities: Opportunity[];
  addOpportunity: (opp: Omit<Opportunity, "id" | "datePosted" | "analytics">) => Promise<void>;
  deleteOpportunity: (id: string) => Promise<void>;
  isLoadingOpportunities: boolean;
  fetchOpportunities: (
    keyword: string,
    location: string,
    category: string,
    filters?: {
      type?: ("job" | "education" | "training")[];
      isFree?: boolean;
      isBeginnerFriendly?: boolean;
      hasCertificate?: boolean;
    }
  ) => Promise<void>;

  // Applications
  applications: Application[];
  applyToJob: (jobId: string, cvFile?: string, coverLetter?: string) => void;
  updateApplicationStatus: (appId: string, status: Application["status"]) => void;

  // Saved searches & alerts
  savedSearches: SavedSearch[];
  saveSearch: (keyword: string, location: string, category: string) => void;
  removeSavedSearch: (id: string) => void;
  jobAlerts: JobAlert[];
  addJobAlert: (keyword: string, email: string) => void;
  removeJobAlert: (id: string) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (title: string, message: string, type: Notification["type"]) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;

  // Community
  communityPosts: CommunityPost[];
  createCommunityPost: (title: string, content: string, topic: CommunityPost["topic"]) => void;
  addCommentToPost: (postId: string, text: string) => void;
  isPostOpportunityOpen: boolean;
  setIsPostOpportunityOpen: (isOpen: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialOpportunities: Opportunity[] = [];

const initialProfile: SeekerProfile = {
  name: "",
  title: "",
  email: "",
  phone: "",
  bio: "",
  skills: [],
  experience: [],
  education: []
};

const initialApplications: Application[] = [
  {
    id: "app-1",
    jobId: "opp-1",
    seekerName: "Alex Mercer",
    seekerTitle: "Frontend Developer",
    seekerEmail: "alex.mercer@devmail.com",
    seekerSkills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Figma", "HTML", "CSS", "Git"],
    status: "Shortlisted",
    appliedDate: "2026-06-08",
    notes: "Interview scheduled for next Thursday!"
  }
];

const initialNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "New 95% Match Found!",
    message: "Your profile matches 95% of the qualifications for the Microsoft Software Engineering Apprenticeship.",
    type: "match",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: "notif-2",
    title: "Application Shortlisted",
    message: "Congratulations! Your application for 'Senior Front-End Architect' was shortlisted by Aether Systems.",
    type: "application",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  }
];

const initialCommunityPosts: CommunityPost[] = [
  {
    id: "post-1",
    title: "How to transition from Bootcamps to Mid-level engineer roles?",
    content: "I graduated from a tech bootcamp 6 months ago. I have been applying to junior roles but most recruiters ask for 2+ years of experience. How can I bridge this gap? Should I focus on open-source contributions or build a large portfolio project?",
    author: "Elena Rostova",
    topic: "Career Advice",
    upvotes: 14,
    comments: [
      { author: "Alex Mercer", text: "I suggest building 1 or 2 high-fidelity projects with database backends and full tests. Deploy it and write a technical blog post explaining your design decisions.", date: "2026-06-09" },
      { author: "Michael Chen", text: "Open source is also great! Try finding 'Good First Issue' tags on active github repositories.", date: "2026-06-10" }
    ],
    date: "2026-06-09"
  },
  {
    id: "post-2",
    title: "Why you should learn TypeScript early in your React journey",
    content: "Many developers start with plain JavaScript React and only learn TypeScript later. I highly recommend learning them together. TypeScript prevents type mismatches in props, makes refactoring easier, and is requested in almost 90% of Software Development opportunities today.",
    author: "David K.",
    topic: "Technical Skills",
    upvotes: 25,
    comments: [
      { author: "Elena Rostova", text: "Totally agree, TS saves hours of debugging prop-drilling errors!", date: "2026-06-09" }
    ],
    date: "2026-06-08"
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [userType, setUserType] = useState<"seeker" | "provider" | "admin">("seeker");
  const [seekerProfile, setSeekerProfile] = useState<SeekerProfile>(initialProfile);
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [seekerCVContent, setSeekerCVContent] = useState<string>("");
  const [seekerCoverLetter, setSeekerCoverLetter] = useState<string>("");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isPostOpportunityOpen, setIsPostOpportunityOpen] = useState<boolean>(false);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState<boolean>(false);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(initialCommunityPosts);

  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>([]);
  const [hasLoadedSavedSearches, setHasLoadedSavedSearches] = useState(false);
  const [hasLoadedJobAlerts, setHasLoadedJobAlerts] = useState(false);

  useEffect(() => {
    const localSearches = localStorage.getItem("peet_saved_searches");
    if (localSearches) {
      try {
        setSavedSearches(JSON.parse(localSearches));
      } catch (e) {
        console.error(e);
      }
    } else {
      setSavedSearches([
        { id: "ss-1", keyword: "React Developer", location: "Remote", category: "Software Development" }
      ]);
    }
    setHasLoadedSavedSearches(true);
  }, []);

  useEffect(() => {
    if (hasLoadedSavedSearches) {
      localStorage.setItem("peet_saved_searches", JSON.stringify(savedSearches));
    }
  }, [savedSearches, hasLoadedSavedSearches]);

  useEffect(() => {
    const localAlerts = localStorage.getItem("peet_job_alerts");
    if (localAlerts) {
      try {
        setJobAlerts(JSON.parse(localAlerts));
      } catch (e) {
        console.error(e);
      }
    } else {
      setJobAlerts([
        { id: "alert-1", keyword: "Next.js", email: "alex.mercer@devmail.com" }
      ]);
    }
    setHasLoadedJobAlerts(true);
  }, []);

  useEffect(() => {
    if (hasLoadedJobAlerts) {
      localStorage.setItem("peet_job_alerts", JSON.stringify(jobAlerts));
    }
  }, [jobAlerts, hasLoadedJobAlerts]);
  const [interviewQuestionIndex, setInterviewQuestionIndex] = useState<number>(0);
  const [interviewFeedback, setInterviewFeedback] = useState<AppContextType["interviewFeedback"]>([]);

  // Fetch opportunities function
  const fetchOpportunities = async (
    keyword: string,
    location: string,
    category: string,
    filters?: {
      type?: ("job" | "education" | "training")[];
      isFree?: boolean;
      isBeginnerFriendly?: boolean;
      hasCertificate?: boolean;
    }
  ) => {
    setIsLoadingOpportunities(true);
    try {
      const queryParams = new URLSearchParams();
      if (keyword) queryParams.append("keyword", keyword);
      if (location) queryParams.append("location", location);
      if (category) queryParams.append("category", category);

      if (filters) {
        if (filters.type && filters.type.length > 0) {
          queryParams.append("type", filters.type.join(","));
        }
        if (filters.isFree !== undefined) queryParams.append("isFree", String(filters.isFree));
        if (filters.isBeginnerFriendly !== undefined) queryParams.append("isBeginnerFriendly", String(filters.isBeginnerFriendly));
        if (filters.hasCertificate !== undefined) queryParams.append("hasCertificate", String(filters.hasCertificate));
      }

      const res = await fetch(`/api/opportunities?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.results) {
          setOpportunities(data.results);
        }
      }
    } catch (error) {
      console.error("Error calling /api/opportunities route:", error);
    } finally {
      setIsLoadingOpportunities(false);
    }
  };

  // Career Guidance Chatbot State
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "Hello, Alex! I am PEET, your AI Career Assistant. I can help you draft your CV, generate a tailored cover letter, conduct a mock interview, or review your resume matching. What would you like to explore today?",
      timestamp: new Date()
    }
  ]);

  // Load state from localStorage on mount (optional but useful)
  useEffect(() => {
    const savedTheme = localStorage.getItem("peet_theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    } else {
      document.documentElement.className = "dark";
    }

    const savedUserType = localStorage.getItem("peet_usertype") as "seeker" | "provider" | "admin" | null;
    if (savedUserType) {
      setUserType(savedUserType);
    }

    // Trigger initial opportunity fetch
    fetchOpportunities("", "", "All");
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    if (!isConfigured || !auth) {
      setLoadingAuth(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db!, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.role) {
              setUserType(data.role as "seeker" | "provider" | "admin");
              localStorage.setItem("peet_usertype", data.role);
            }
            setSeekerProfile((prev) => ({
              ...prev,
              name: data.name || firebaseUser.displayName || prev.name || "",
              email: data.email || firebaseUser.email || prev.email || "",
              phone: data.phone || prev.phone || "",
              title: data.title || prev.title || "",
              bio: data.bio || prev.bio || "",
              skills: data.skills || prev.skills || [],
              experience: data.experience || prev.experience || [],
              education: data.education || prev.education || []
            }));
          } else {
            setSeekerProfile((prev) => ({
              ...prev,
              name: firebaseUser.displayName || prev.name || "",
              email: firebaseUser.email || prev.email || "",
            }));
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        setSeekerProfile(initialProfile);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("peet_theme", nextTheme);
    document.documentElement.className = nextTheme;
  };

  const handleSetUserType = (type: "seeker" | "provider" | "admin") => {
    setUserType(type);
    localStorage.setItem("peet_usertype", type);
  };

  const updateSeekerProfile = async (profile: SeekerProfile) => {
    setSeekerProfile(profile);
    if (user && isConfigured && db) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          title: profile.title,
          bio: profile.bio,
          skills: profile.skills,
          experience: profile.experience,
          education: profile.education,
          role: userType
        }, { merge: true });
      } catch (err) {
        console.error("Error updating user profile in firestore:", err);
      }
    }
  };

  const logout = async () => {
    if (auth && isConfigured) {
      await signOut(auth);
    }
  };

  const sendChatMessage = async (text: string) => {
    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      sender: "user",
      text,
      timestamp: new Date()
    };
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!res.ok) {
        throw new Error(`Chat API error: status ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.reply) {
        const aiMsg: Message = {
          id: `msg-${Date.now()}-ai`,
          sender: "ai",
          text: data.reply,
          timestamp: new Date()
        };
        setChatMessages((prev) => [...prev, aiMsg]);
        return;
      }
      throw new Error(data.error || "Failed to parse reply");
    } catch (err: any) {
      console.warn("Falling back to local simulation:", err.message);
      // Simulate AI Coaching response based on content
      setTimeout(() => {
        let aiText = "That's an interesting career question. A key tip is to always customize your resume to highlight the exact keywords of the opportunity description. What role are you targeting?";
        const lower = text.toLowerCase();
        if (lower.includes("cv") || lower.includes("resume")) {
          aiText = "Working on your CV is key! Feel free to use the 'AI CV Builder' tab above to build a standard structure, or paste sections of your CV here and I can proofread them for typos and impact verbs.";
        } else if (lower.includes("skills") || lower.includes("learn")) {
          aiText = "To boost your profile, focus on bridging skill gaps. For instance, if you apply to Senior positions, learning Next.js optimization and architectural design patterns will increase your match score significantly.";
        } else if (lower.includes("salary") || lower.includes("negotiat")) {
          aiText = "Salary negotiation is all about market positioning. Research salary bands beforehand. Always let the employer make the first offer, then counter with your target band based on your matching fit percent.";
        }

        // Append notice about offline mode
        aiText += "\n\n*(PEET Chatbot is running in Offline Mode. Configure OPENROUTER_API_KEY in .env.local to activate live AI answers)*";

        const aiMsg: Message = {
          id: `msg-${Date.now()}-ai`,
          sender: "ai",
          text: aiText,
          timestamp: new Date()
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      }, 800);
    }
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: "msg-init",
        sender: "ai",
        text: "Chat cleared! How can PEET help with your career search now?",
        timestamp: new Date()
      }
    ]);
  };

  const addInterviewFeedback = (question: string, answer: string, feedback: string, score: number) => {
    setInterviewFeedback((prev) => [...prev, { question, answer, feedback, score }]);
  };

  const resetInterview = () => {
    setInterviewQuestionIndex(0);
    setInterviewFeedback([]);
  };

  const addOpportunity = async (oppInput: Omit<Opportunity, "id" | "datePosted" | "analytics">) => {
    try {
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(oppInput)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.opportunity) {
          const newOpp: Opportunity = data.opportunity;
          setOpportunities((prev) => [newOpp, ...prev]);

          // Check skills alignment and trigger a notification if seeker has matching skills
          const matchingSkills = seekerProfile.skills.filter(s => newOpp.skills.map(os => os.toLowerCase()).includes(s.toLowerCase()));
          if (matchingSkills.length > 0) {
            addNotification(
              "New 90%+ Match Alert!",
              `A new matching ${newOpp.type} opportunity '${newOpp.title}' was posted by ${newOpp.provider}.`,
              "match"
            );
          }
        }
      }
    } catch (e) {
      console.error("Error creating opportunity:", e);
    }
  };

  const deleteOpportunity = async (id: string) => {
    try {
      const res = await fetch(`/api/opportunities?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setOpportunities((prev) => prev.filter((o) => o.id !== id));
        setApplications((prev) => prev.filter((a) => a.jobId !== id));
      }
    } catch (e) {
      console.error("Error deleting opportunity:", e);
    }
  };

  const applyToJob = (jobId: string, cvFile?: string, coverLetter?: string) => {
    const alreadyApplied = applications.some((a) => a.jobId === jobId && a.seekerEmail === seekerProfile.email);
    if (alreadyApplied) return;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId,
      seekerName: seekerProfile.name,
      seekerTitle: seekerProfile.title,
      seekerEmail: seekerProfile.email,
      seekerSkills: seekerProfile.skills,
      cvUrl: cvFile || "Alex_Mercer_CV.pdf",
      coverLetter: coverLetter || "Please find my cover letter attached.",
      status: "Applied",
      appliedDate: new Date().toISOString().split("T")[0]
    };
    setApplications((prev) => [newApp, ...prev]);

    // Send a notification!
    const associatedOpp = opportunities.find(o => o.id === jobId);
    addNotification(
      "Application Sent",
      `Your application for '${associatedOpp?.title || "opportunity"}' was successfully submitted.`,
      "application"
    );

    // Increment clicks
    setOpportunities((prev) =>
      prev.map((o) => {
        if (o.id === jobId) {
          return {
            ...o,
            analytics: {
              views: (o.analytics?.views || 0) + 1,
              clicks: (o.analytics?.clicks || 0) + 1
            }
          };
        }
        return o;
      })
    );
  };

  const updateApplicationStatus = (appId: string, status: Application["status"]) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status } : a))
    );

    // Send a notification!
    const app = applications.find(a => a.id === appId);
    if (app) {
      const associatedOpp = opportunities.find(o => o.id === app.jobId);
      addNotification(
        `Application ${status}`,
        `Your application status for '${associatedOpp?.title || "opportunity"}' was updated to ${status}.`,
        "application"
      );
    }
  };

  const saveSearch = (keyword: string, location: string, category: string) => {
    const isDuplicate = savedSearches.some(
      (s) =>
        s.keyword.toLowerCase() === keyword.toLowerCase() &&
        s.location.toLowerCase() === location.toLowerCase() &&
        s.category.toLowerCase() === category.toLowerCase()
    );
    if (isDuplicate) return;

    const newSearch: SavedSearch = {
      id: `ss-${Date.now()}`,
      keyword,
      location,
      category
    };
    setSavedSearches((prev) => [newSearch, ...prev]);
  };

  const removeSavedSearch = (id: string) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
  };

  const addJobAlert = (keyword: string, email: string) => {
    const newAlert: JobAlert = {
      id: `alert-${Date.now()}`,
      keyword,
      email
    };
    setJobAlerts((prev) => [newAlert, ...prev]);
  };

  const removeJobAlert = (id: string) => {
    setJobAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // Notification actions
  const addNotification = (title: string, message: string, type: Notification["type"]) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Community actions
  const createCommunityPost = (title: string, content: string, topic: CommunityPost["topic"]) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      title,
      content,
      author: seekerProfile.name || "Anonymous",
      topic,
      upvotes: 1,
      comments: [],
      date: new Date().toISOString().split("T")[0]
    };
    setCommunityPosts((prev) => [newPost, ...prev]);
  };

  const addCommentToPost = (postId: string, text: string) => {
    const newComment: CommunityComment = {
      author: seekerProfile.name || "Anonymous",
      text,
      date: new Date().toISOString().split("T")[0]
    };
    setCommunityPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        userType,
        setUserType: handleSetUserType,
        user,
        loadingAuth,
        logout,
        seekerProfile,
        updateSeekerProfile,
        seekerCVContent,
        setSeekerCVContent,
        seekerCoverLetter,
        setSeekerCoverLetter,
        chatMessages,
        sendChatMessage,
        clearChat,
        interviewQuestionIndex,
        setInterviewQuestionIndex,
        interviewFeedback,
        addInterviewFeedback,
        resetInterview,
        opportunities,
        addOpportunity,
        deleteOpportunity,
        isLoadingOpportunities,
        fetchOpportunities,
        applications,
        applyToJob,
        updateApplicationStatus,
        savedSearches,
        saveSearch,
        removeSavedSearch,
        jobAlerts,
        addJobAlert,
        removeJobAlert,
        notifications,
        addNotification,
        markNotificationAsRead,
        clearNotifications,
        communityPosts,
        createCommunityPost,
        addCommentToPost,
        isPostOpportunityOpen,
        setIsPostOpportunityOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
