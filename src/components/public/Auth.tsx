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
    <section className="py-16 sm:py-24 px-4 relative flex items-center justify-center min-h-[calc(100vh-4rem)]">
      {/* Background glow dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      <div className="w-full max-w-md glass-panel rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20 p-6 sm:p-8 animate-scale-up space-y-6">
        
        {/* Error notification */}
        {error && (
          <div className="text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-xs font-semibold flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Email Verification Pending */}
        {tab === "verify" ? (
          <div className="space-y-5 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto text-purple-400">
              <Mail className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-base text-zinc-150">Verify Your Email</h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
                We've sent a verification link to <span className="font-bold text-purple-300">{email || (auth?.currentUser?.email)}</span>. Click the link inside the email to activate your account.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleCheckVerification}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                I've Verified My Email
              </button>
              <button
                type="button"
                onClick={handleResendVerification}
                className="w-full py-2.5 bg-zinc-900/50 hover:bg-zinc-850 text-zinc-400 border border-purple-500/5 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Resend Verification Link
              </button>
            </div>

            {resendSuccess && (
              <div className="text-emerald-500 bg-emerald-500/10 p-2 rounded-xl text-[10px] font-bold animate-pulse">
                Verification link resent! Please check your spam folder if it doesn't arrive.
              </div>
            )}

            <button
              onClick={() => setTab("signup")}
              className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 transition-colors block mx-auto pt-2 cursor-pointer"
            >
              Back to Sign Up
            </button>
          </div>
        ) : tab === "role-select" ? (
          /* Tab 2: New Google User Role Selection */
          <div className="space-y-5 py-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto text-purple-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-zinc-150">Select Your Account Type</h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
                Welcome! Choose your primary objective on PEET AI to set up your interface.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserType("seeker")}
                className={`p-4 rounded-2xl border transition-all text-center space-y-2 cursor-pointer flex flex-col items-center justify-center ${
                  userType === "seeker"
                    ? "bg-purple-650/10 border-purple-500 text-purple-300"
                    : "bg-zinc-900/30 border-purple-500/5 text-zinc-500 hover:border-purple-500/10 hover:text-zinc-400"
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-xs font-bold block">Opportunity Seeker</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType("provider")}
                className={`p-4 rounded-2xl border transition-all text-center space-y-2 cursor-pointer flex flex-col items-center justify-center ${
                  userType === "provider"
                    ? "bg-purple-650/10 border-purple-500 text-purple-300"
                    : "bg-zinc-900/30 border-purple-500/5 text-zinc-500 hover:border-purple-500/10 hover:text-zinc-400"
                }`}
              >
                <UserCheck className="w-5 h-5" />
                <span className="text-xs font-bold block">Opportunity Provider</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCompleteRoleSelection}
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer mt-4"
            >
              {loading ? "Completing setup..." : "Complete Setup & Launch"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Tab 3: Standard Login / Sign Up Forms */
          <>
            {/* Switcher headers */}
            <div className="flex border-b border-purple-500/10 justify-center">
              <button
                onClick={() => {
                  setTab("login");
                  setError("");
                }}
                className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  tab === "login"
                    ? "border-purple-600 text-purple-600 dark:text-purple-300"
                    : "border-transparent text-zinc-500 hover:text-purple-600"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setTab("signup");
                  setError("");
                }}
                className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  tab === "signup"
                    ? "border-purple-600 text-purple-600 dark:text-purple-300"
                    : "border-transparent text-zinc-500 hover:text-purple-600"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Perspective Toggle (Seeker vs Provider) - Signup only */}
            {tab === "signup" && (
              <div className="space-y-2 text-center pb-2">
                <div className="inline-flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-purple-500/10">
                  <button
                    type="button"
                    onClick={() => setUserType("seeker")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      userType === "seeker"
                        ? "bg-white dark:bg-zinc-800 text-purple-650 dark:text-purple-300 shadow-sm"
                        : "text-zinc-550"
                    }`}
                  >
                    Opportunity Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("provider")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      userType === "provider"
                        ? "bg-white dark:bg-zinc-800 text-purple-650 dark:text-purple-300 shadow-sm"
                        : "text-zinc-550"
                    }`}
                  >
                    Opportunity Provider
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {tab === "signup" && (
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 block mb-1">Full Name</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 w-4 h-4 text-purple-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 text-xs focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-750 dark:text-zinc-150"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-zinc-400 block mb-1">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 w-4 h-4 text-purple-500" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 text-xs focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-750 dark:text-zinc-150"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 block mb-1">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 w-4 h-4 text-purple-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-purple-500/10 text-xs focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-750 dark:text-zinc-150"
                  />
                </div>
              </div>

              {tab === "signup" && (
                <div className="text-[10px] text-zinc-400 flex items-start gap-1.5 pt-1">
                  <input type="checkbox" required className="mt-0.5 accent-purple-600" />
                  <span>
                    I agree to the terms of service and consent to AI processing of my uploaded resumes.
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-purple-500/10 flex items-center justify-center gap-1 cursor-pointer"
              >
                {loading ? (
                  "Validating..."
                ) : (
                  <>
                    {tab === "login" ? "Sign In" : "Register Credentials"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Google Authentication Section */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-purple-500/10"></div>
              <span className="flex-shrink mx-4 text-[9px] text-zinc-500 uppercase font-extrabold tracking-wider">or</span>
              <div className="flex-grow border-t border-purple-500/10"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-2.5 bg-zinc-900/50 hover:bg-zinc-850 text-zinc-200 border border-purple-500/10 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 hover:border-purple-500/30 cursor-pointer"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
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
          <div className="text-center text-xs font-bold text-emerald-500 bg-emerald-500/10 p-2.5 rounded-xl animate-pulse flex items-center justify-center gap-1.5">
            <UserCheck className="w-4 h-4" /> Credentials accepted! Launching workspace...
          </div>
        )}
      </div>
    </section>
  );
};
