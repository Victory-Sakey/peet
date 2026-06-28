"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Mail,
  Lock,
  User,
  UserCheck,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider, db, isConfigured } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthProps {
  initialTab: "login" | "signup";
  setActivePage: (page: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ initialTab, setActivePage }) => {
  const { userType, setUserType, seekerProfile, updateSeekerProfile } = useApp();
  const [tab, setTab] = useState<"login" | "signup" | "verify" | "role-select">(initialTab);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Handle standard email/password login or signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    // Bypass/fallback mode if Firebase is not configured
    if (!isConfigured || !auth || !db) {
      setSuccess(true);
      if (tab === "signup" && name.trim() && userType === "seeker") {
        updateSeekerProfile({
          ...seekerProfile,
          name: name.trim(),
          email: email.trim()
        });
      }
      setTimeout(() => {
        setSuccess(false);
        setActivePage("dashboard");
      }, 1200);
      setLoading(false);
      return;
    }

    try {
      if (tab === "signup") {
        // Sign Up Flow
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Set Display Name
        await updateProfile(user, { displayName: name });

        // Send Email Verification
        await sendEmailVerification(user);

        // Store role in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name,
          email,
          role: userType // 'seeker' or 'provider'
        });

        // Switch to verification pending screen
        setTab("verify");
      } else {
        // Sign In Flow
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Force check verification state
        await user.reload();
        if (!user.emailVerified) {
          setTab("verify");
          setLoading(false);
          return;
        }

        // Fetch User profile to set correct dashboard view
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.role) {
            setUserType(data.role as "seeker" | "provider" | "admin");
          }
        }

        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setActivePage("dashboard");
        }, 1200);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let errMsg = "An error occurred during authentication.";
      if (err.code === "auth/email-already-in-use") {
        errMsg = "This email is already registered. Please sign in instead.";
      } else if (err.code === "auth/invalid-credential") {
        errMsg = "Invalid email or password. Please try again.";
      } else if (err.code === "auth/weak-password") {
        errMsg = "Password should be at least 6 characters.";
      } else if (err.code === "auth/configuration-not-found") {
        errMsg = "Firebase Authentication is not enabled. Go to Firebase Console -> Authentication -> Sign-in Method, and enable 'Email/Password' provider. Or click 'Quick Bypass' below to use the local demo.";
      } else if (err.code === "auth/operation-not-allowed") {
        errMsg = "Email/Password sign-in is not enabled in your Firebase project. Enable it in the Firebase Console under Authentication -> Sign-in Method.";
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Google Authentication
  const handleGoogleAuth = async () => {
    setError("");
    setSuccess(false);
    setLoading(true);

    if (!isConfigured || !auth || !db) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setActivePage("dashboard");
      }, 1200);
      setLoading(false);
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user has a Firestore record specifying their role
      const docRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(docRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.role) {
          setUserType(data.role as "seeker" | "provider" | "admin");
          if (data.role === "seeker") {
            updateSeekerProfile({
              ...seekerProfile,
              name: user.displayName || seekerProfile.name,
              email: user.email || seekerProfile.email,
              avatar: user.photoURL || seekerProfile.avatar
            });
          }
        }
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setActivePage("dashboard");
        }, 1200);
      } else {
        // User document does not exist, go to role-select tab
        setTab("role-select");
      }
    } catch (err: any) {
      console.error("Google Auth error:", err);
      let errMsg = "Google Authentication failed.";
      if (err.code === "auth/configuration-not-found") {
        errMsg = "Firebase Google Authentication is not configured. Go to Firebase Console -> Authentication -> Sign-in Method, and enable 'Google' provider. Or click 'Quick Bypass' below to use the local demo.";
      } else if (err.code === "auth/operation-not-allowed") {
        errMsg = "Google sign-in is not enabled in your Firebase project. Enable it in the Firebase Console under Authentication -> Sign-in Method.";
      } else if (err.code === "auth/unauthorized-domain") {
        errMsg = "This domain is not authorized for OAuth. Please add your production domain to the 'Authorized domains' list in the Firebase Console (Authentication -> Settings).";
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Complete registration for Google users by choosing their role
  const handleCompleteRoleSelection = async () => {
    setError("");
    setSuccess(false);
    setLoading(true);

    if (!auth || !auth.currentUser || !db) {
      setError("No active user session found.");
      setLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName || "Google User",
        email: user.email || "",
        role: userType // 'seeker' or 'provider'
      });

      if (userType === "seeker") {
        updateSeekerProfile({
          ...seekerProfile,
          name: user.displayName || "Google User",
          email: user.email || "",
          avatar: user.photoURL || seekerProfile.avatar
        });
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setActivePage("dashboard");
      }, 1200);
    } catch (err: any) {
      console.error("Role selection submit error:", err);
      setError(err.message || "Failed to finalize registration.");
    } finally {
      setLoading(false);
    }
  };

  // Check email verification manually
  const handleCheckVerification = async () => {
    setError("");
    setSuccess(false);

    if (!auth || !auth.currentUser) {
      setError("No user is currently signed in.");
      return;
    }

    try {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        if (db) {
          const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.role) {
              setUserType(data.role as "seeker" | "provider" | "admin");
            }
          }
        }
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setActivePage("dashboard");
        }, 1200);
      } else {
        setError("Email verification link has not been clicked yet. Please check your inbox.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to check verification status.");
    }
  };

  // Resend email verification link
  const handleResendVerification = async () => {
    setError("");
    setResendSuccess(false);

    if (!auth || !auth.currentUser) {
      setError("No user is currently signed in.");
      return;
    }

    try {
      await sendEmailVerification(auth.currentUser);
      setResendSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email.");
    }
  };

  return (
    <section className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] py-16 px-4 bg-zinc-50 dark:bg-[#0a0a0a] overflow-hidden selection:bg-purple-500/30">
      {/* Premium Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 dark:bg-purple-600/20 blur-[150px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 dark:bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-500/10 dark:bg-fuchsia-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Title Area */}
        <div className="text-center space-y-2 mb-8 animate-fade-in">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            {tab === "signup" ? "Create an account" : tab === "login" ? "Welcome back" : "Setup Account"}
          </h2>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {tab === "signup" ? "Join Peet and explore new opportunities." : tab === "login" ? "Sign in to your Peet workspace." : "Complete your profile."}
          </p>
        </div>

        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/50 dark:border-zinc-800/50 p-6 sm:p-10 space-y-6">
          
          {/* Error notification */}
          {error && (
            <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 rounded-2xl text-xs font-semibold flex items-start gap-2.5 shadow-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Tab 1: Email Verification Pending */}
          {tab === "verify" ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center mx-auto text-purple-600 shadow-inner border border-purple-100 dark:border-purple-500/20">
                <Mail className="w-8 h-8" />
              </div>
              <div className="space-y-3">
                <h3 className="font-black text-xl text-zinc-900 dark:text-white">Verify Your Email</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto font-medium">
                  We've sent a verification link to <span className="font-bold text-zinc-900 dark:text-white">{email || (auth?.currentUser?.email)}</span>. Click the link to activate your account.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  type="button"
                  onClick={handleCheckVerification}
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  I've Verified My Email
                </button>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  className="w-full py-3.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Resend Verification Link
                </button>
              </div>

              {resendSuccess && (
                <div className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-500/20">
                  Verification link resent! Please check your spam folder if it doesn't arrive.
                </div>
              )}

              <button
                onClick={() => setTab("signup")}
                className="text-xs font-bold text-zinc-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors block mx-auto pt-4"
              >
                Back to Sign Up
              </button>
            </div>
          ) : tab === "role-select" ? (
            /* Tab 2: New Google User Role Selection */
            <div className="space-y-6 py-2">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center mx-auto text-purple-600 shadow-inner border border-purple-100 dark:border-purple-500/20">
                  <UserCheck className="w-8 h-8" />
                </div>
                <h3 className="font-black text-xl text-zinc-900 dark:text-white">Select Your Path</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto font-medium">
                  Welcome to Peet! Choose how you want to use the platform to continue.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setUserType("seeker")}
                  className={`p-5 rounded-[1.5rem] border-2 transition-all duration-300 text-center space-y-3 flex flex-col items-center justify-center group ${
                    userType === "seeker"
                      ? "bg-purple-50 dark:bg-purple-500/10 border-purple-600 text-purple-700 dark:text-purple-400 shadow-lg shadow-purple-500/10"
                      : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-purple-300 dark:hover:border-purple-500/50 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  <User className={`w-6 h-6 transition-transform group-hover:scale-110 ${userType === "seeker" ? "text-purple-600" : ""}`} />
                  <span className="text-sm font-bold block">Opportunity Seeker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("provider")}
                  className={`p-5 rounded-[1.5rem] border-2 transition-all duration-300 text-center space-y-3 flex flex-col items-center justify-center group ${
                    userType === "provider"
                      ? "bg-purple-50 dark:bg-purple-500/10 border-purple-600 text-purple-700 dark:text-purple-400 shadow-lg shadow-purple-500/10"
                      : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-purple-300 dark:hover:border-purple-500/50 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  <UserCheck className={`w-6 h-6 transition-transform group-hover:scale-110 ${userType === "provider" ? "text-purple-600" : ""}`} />
                  <span className="text-sm font-bold block">Opportunity Provider</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCompleteRoleSelection}
                disabled={loading}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-sm font-bold transition-all shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2 mt-6"
              >
                {loading ? "Setting up..." : "Complete Setup & Launch"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Tab 3: Standard Login / Sign Up Forms */
            <>
              {/* Tab Switcher (Pill Style) */}
              <div className="flex p-1 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200 dark:border-zinc-700/50 relative">
                <button
                  onClick={() => {
                    setTab("login");
                    setError("");
                  }}
                  className={`relative z-10 flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 ${
                    tab === "login"
                      ? "text-zinc-900 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setTab("signup");
                    setError("");
                  }}
                  className={`relative z-10 flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 ${
                    tab === "signup"
                      ? "text-zinc-900 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  Create Account
                </button>
                
                {/* Active Indicator Background */}
                <div 
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-zinc-700 shadow-sm rounded-xl transition-transform duration-300 ease-out"
                  style={{ transform: tab === "login" ? "translateX(0)" : "translateX(100%)" }}
                />
              </div>

              {/* Perspective Toggle (Seeker vs Provider) - Signup only */}
              {tab === "signup" && (
                <div className="pt-2 pb-1 text-center">
                  <div className="inline-flex bg-purple-50/50 dark:bg-purple-900/20 p-1 rounded-xl border border-purple-100 dark:border-purple-800/30">
                    <button
                      type="button"
                      onClick={() => setUserType("seeker")}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        userType === "seeker"
                          ? "bg-white dark:bg-zinc-800 text-purple-700 dark:text-purple-400 shadow-sm border border-purple-100 dark:border-purple-700"
                          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                      }`}
                    >
                      I'm a Seeker
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType("provider")}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        userType === "provider"
                          ? "bg-white dark:bg-zinc-800 text-purple-700 dark:text-purple-400 shadow-sm border border-purple-100 dark:border-purple-700"
                          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                      }`}
                    >
                      I'm a Provider
                    </button>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                {tab === "signup" && (
                  <div>
                    <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-1.5 ml-1">Full Name</label>
                    <div className="relative flex items-center group">
                      <User className="absolute left-3.5 w-4 h-4 text-zinc-400 group-focus-within:text-purple-600 transition-colors" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 text-zinc-900 dark:text-white transition-all font-medium placeholder:text-zinc-400"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-1.5 ml-1">Email Address</label>
                  <div className="relative flex items-center group">
                    <Mail className="absolute left-3.5 w-4 h-4 text-zinc-400 group-focus-within:text-purple-600 transition-colors" />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 text-zinc-900 dark:text-white transition-all font-medium placeholder:text-zinc-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-1.5 ml-1">Password</label>
                  <div className="relative flex items-center group">
                    <Lock className="absolute left-3.5 w-4 h-4 text-zinc-400 group-focus-within:text-purple-600 transition-colors" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 text-zinc-900 dark:text-white transition-all font-medium placeholder:text-zinc-400"
                    />
                  </div>
                </div>

                {tab === "signup" && (
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-start gap-2.5 pt-2">
                    <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-zinc-300 text-purple-600 focus:ring-purple-600" />
                    <span className="leading-relaxed font-medium">
                      I agree to the <a href="#" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">Terms of Service</a> and consent to AI processing of my data.
                    </span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      "Processing..."
                    ) : (
                      <>
                        {tab === "login" ? "Sign In to Workspace" : "Create Account"}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Google Authentication Section */}
              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
                <span className="flex-shrink mx-4 text-[10px] text-zinc-400 font-black uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-3.5 bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2.5"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.77-.07-1.54-.19-2.27H12v4.51h6.6c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.69-5.17 3.69-8.82z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-5.01H1.32v3.1A12 12 0 0 0 12 24z" />
                  <path fill="#FBBC05" d="M5.24 14.24a7.22 7.22 0 0 1 0-4.48V6.66H1.32a12 12 0 0 0 0 10.68l3.92-3.1z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.97 1.19 15.24 0 12 0A12 12 0 0 0 1.32 6.66l3.92 3.1c.95-2.88 3.61-5.01 6.76-5.01z" />
                </svg>
                Continue with Google
              </button>
            </>
          )}

          {success && (
            <div className="text-center text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-2xl flex items-center justify-center gap-2 border border-emerald-100 dark:border-emerald-500/20 shadow-inner mt-4">
              <UserCheck className="w-5 h-5" /> Credentials accepted! Launching workspace...
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
