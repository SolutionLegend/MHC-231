import React, { useState, useEffect } from "react";
import { LogOut, User as UserIcon, Bell, Settings, Terminal, Radio, HelpCircle, ShieldAlert, Database, Server } from "lucide-react";
import Dashboards from "./Dashboards.tsx";
import schoolLogo from "../assets/images/mhc_official_badge.png";
import { supabaseService } from "../services/supabaseService";
import { isSupabaseConfigured } from "../services/supabaseClient";
import { SupabaseModal } from "./SupabaseModal";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  name: string;
  role: "Admin" | "Principal" | "Vice Principal" | "Dean of Student Affairs" | "Finance Office" | "Teachers" | "Staff" | "Student Leaders" | "Students" | "Parents";
  createdAt: string;
}

interface PortalProps {
  onBackToWebsite: () => void;
}

export default function Portal({ onBackToWebsite }: PortalProps) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("mhc_portal_token"));
  const [user, setUser] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [emergencyAlert, setEmergencyAlert] = useState<{ active: boolean; message: string; severity: string } | null>(null);

  // Self-registration state
  const [isRegister, setIsRegister] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<"Students" | "Parents" | "Teachers">("Students");

  // PWA installation states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
      console.log("[PWA] MHC Digital Campus Platform was installed successfully!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    if (window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response to installation: ${outcome}`);
    setDeferredPrompt(null);
  };

  // Quick Login Helpers
  const quickLogins = [
    { label: "Admin", user: "admin", pass: "password", color: "bg-red-500" },
    { label: "Principal", user: "principal", pass: "password", color: "bg-violet-500" },
    { label: "Vice Principal", user: "vp", pass: "password", color: "bg-blue-500" },
    { label: "Dean", user: "dean", pass: "password", color: "bg-pink-500" },
    { label: "Finance", user: "finance", pass: "password", color: "bg-amber-500" },
    { label: "Teacher", user: "teacher", pass: "password", color: "bg-emerald-500" },
    { label: "Staff", user: "staff", pass: "password", color: "bg-slate-600" },
    { label: "Student Leader", user: "studentleader", pass: "password", color: "bg-indigo-500" },
    { label: "Student", user: "student", pass: "password", color: "bg-sky-500" },
    { label: "Parent", user: "parent", pass: "password", color: "bg-teal-500" },
  ];



  // Supabase Modal state
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(isSupabaseConfigured());

  // Load User Profile on Mount / Token Change
  useEffect(() => {
    if (token) {
      supabaseService.getCurrentUser(token)
        .then((profile) => {
          if (profile) {
            setUser(profile as any);
          } else {
            handleLogout();
          }
        })
        .catch((err) => {
          console.error("Profile fetch error:", err);
        });
    }
  }, [token]);

  // Fetch Emergency Alert periodically
  useEffect(() => {
    const checkAlert = () => {
      supabaseService.getEmergencyAlert()
        .then((data) => {
          if (data && data.active) {
            setEmergencyAlert(data);
          } else {
            setEmergencyAlert(null);
          }
        })
        .catch((err) => {
          console.warn("Emergency alert check:", err);
        });
    };

    checkAlert();
    const interval = setInterval(checkAlert, 8000); // 8 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await supabaseService.login(username, password);
      localStorage.setItem("mhc_portal_token", data.token);
      setToken(data.token);
      setUser(data.user as any);
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await supabaseService.register({
        name: regName,
        email: regEmail,
        username: regUsername,
        password: regPassword,
        role: regRole,
      });

      localStorage.setItem("mhc_portal_token", data.token);
      setToken(data.token);
      setUser(data.user as any);

      // Reset fields
      setRegName("");
      setRegEmail("");
      setRegUsername("");
      setRegPassword("");
      setIsRegister(false);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  const triggerQuickLogin = async (usr: string, pass: string) => {
    setError(null);
    try {
      const data = await supabaseService.login(usr, pass);
      localStorage.setItem("mhc_portal_token", data.token);
      setToken(data.token);
      setUser(data.user as any);
    } catch (err: any) {
      setError(err.message || "Quick login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("mhc_portal_token");
    setToken(null);
    setUser(null);
    setUsername("");
    setPassword("");
    setActiveTab("dashboard");
  };

  // Define sidebar navigation tabs depending on user role
  const getSidebarTabs = () => {
    if (!user) return [];
    
    const baseTabs = [
      { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
      { id: "academic", label: "Academic Hub", icon: "BookOpen" },
      { id: "finance", label: "Finance & Fees", icon: "DollarSign" },
      { id: "comms", label: "Communication", icon: "MessageSquare" },
      { id: "community", label: "Community Feed", icon: "Globe" },
      { id: "lounge", label: "Student Lounge", icon: "Coffee" },
      { id: "library", label: "Digital Library", icon: "Library" },
      { id: "faith", label: "Catholic Corner", icon: "Cross" },
      { id: "advanced", label: "Services Hub", icon: "Layers" },
    ];

    // Filter student lounge for teachers or parents unless they are admin/dean
    return baseTabs.filter(tab => {
      if (tab.id === "lounge") {
        return ["Students", "Student Leaders", "Admin", "Dean of Student Affairs", "Principal"].includes(user.role);
      }
      return true;
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* EMERGENCY ALERT BAR (Phase 7) */}
      {emergencyAlert && (
        <div className="bg-red-600 text-white font-bold py-3 px-4 flex items-center justify-between shadow-lg border-b border-red-700 animate-pulse">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 shrink-0 text-yellow-300 animate-bounce" />
            <div className="text-xs sm:text-sm">
              <span className="uppercase tracking-widest bg-red-800 px-2 py-0.5 rounded mr-2 text-[10px]">EMERGENCY ALERT:</span>
              {emergencyAlert.message}
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-mono">CRITICAL LEVEL</span>
        </div>
      )}

      {/* PORTAL LOGGED OUT VIEW */}
      {!user ? (
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white mx-auto flex items-center justify-center overflow-hidden border-2 border-yellow-500 shadow-md">
                <img
                  src={schoolLogo}
                  alt="MHC Official Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h2 className="mt-4 font-display text-2xl font-extrabold text-sky-950">
                School Management System
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Mary Help of Christians Catholic High School Portal
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200/60 space-y-4">
              <div className="flex border-b border-slate-100 pb-2">
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setError(null); }}
                  className={`flex-1 text-center font-display font-bold text-xs uppercase tracking-wider pb-2 cursor-pointer ${!isRegister ? "text-sky-900 border-b-2 border-sky-900" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setIsRegister(true); setError(null); }}
                  className={`flex-1 text-center font-display font-bold text-xs uppercase tracking-wider pb-2 cursor-pointer ${isRegister ? "text-sky-900 border-b-2 border-sky-900" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Register
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                  {error}
                </div>
              )}

              {!isRegister ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Username</label>
                    <input
                      required
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50"
                      placeholder="e.g. admin or student"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Password</label>
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">Default password: password</span>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!username) {
                          alert("Please enter your username or registered email first.");
                          return;
                        }
                        const email = username.includes("@") ? username : `${username}@mhc.edu.lr`;
                        const res = await supabaseService.resetPassword(email);
                        alert(res.message);
                      }}
                      className="text-sky-900 font-bold hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold p-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                  >
                    Access Dashboard
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Full Name</label>
                    <input
                      required
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Email Address</label>
                    <input
                      required
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50"
                      placeholder="e.g. name@mhc.edu.lr"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Username</label>
                    <input
                      required
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50"
                      placeholder="Choose a unique username"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Password</label>
                    <input
                      required
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50"
                      placeholder="Choose a strong password"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Register As</label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as any)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-sans"
                    >
                      <option value="Students">Student</option>
                      <option value="Parents">Parent / Guardian</option>
                      <option value="Teachers">Teacher</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold p-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                  >
                    Register Account
                  </button>
                </form>
              )}



              {/* QUICK DEMO LOGIN BOX */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <p className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider text-center">
                  ⚡ Evaluation Quick Login Roll (10 Roles)
                </p>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {quickLogins.map((role) => (
                    <button
                      key={role.label}
                      onClick={() => triggerQuickLogin(role.user, role.pass)}
                      className={`px-1.5 py-1 rounded text-[9px] font-bold text-white transition-all transform hover:scale-105 ${role.color} shadow-sm truncate`}
                      title={`Login as ${role.label}`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Supabase Cloud DB Badge & Action */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSupabaseModalOpen(true)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-700 flex items-center justify-center">
                      <Database className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-slate-800">
                        {isDbConnected ? "Supabase Cloud DB Connected" : "Supabase DB Engine (Local Mode)"}
                      </p>
                      <p className="text-[8px] text-slate-500">Pure Client BaaS • No Node.js / Express Server</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-semibold text-emerald-700 underline">
                    Settings
                  </span>
                </button>
              </div>
            </div>

            {/* PWA Download Banner */}
            <div className="bg-gradient-to-br from-sky-900 to-slate-900 p-5 rounded-3xl shadow-xl border border-sky-800/50 text-white space-y-3">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center overflow-hidden border border-yellow-500 shrink-0 shadow-md">
                  <img
                    src={schoolLogo}
                    alt="MHC App Icon"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white leading-tight">MHC Digital Campus App</h4>
                  <p className="text-[10px] text-slate-300 mt-1">Install on your phone or desktop for lightning-fast launch and offline support</p>
                </div>
              </div>
              
              {deferredPrompt ? (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98] text-sky-950 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  Install App Instantly
                </button>
              ) : isInstalled ? (
                <div className="text-center py-2 text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/40 rounded-xl border border-emerald-800/40">
                  ✓ MHC App Installed on Device
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    alert("To install MHC Campus App:\n\n• On Chrome/Edge: Click the install/download icon in the browser URL bar.\n• On iOS (Safari): Tap the 'Share' button, then scroll down and select 'Add to Home Screen'.");
                  }}
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10"
                >
                  Quick Download Guide
                </button>
              )}
            </div>

            <div className="text-center">
              <button
                onClick={onBackToWebsite}
                className="text-xs text-sky-900 font-semibold hover:underline cursor-pointer"
              >
                ← Back to School Public Website
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* PORTAL LOGGED IN DASHBOARD VIEW */
        <div className="flex-1 flex flex-col md:flex-row min-h-screen">
          {/* Sidebar */}
          <aside className="w-full md:w-64 bg-sky-950 text-slate-200 flex flex-col border-r border-sky-900">
            {/* School Profile Bar */}
            <div className="p-4 border-b border-sky-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-yellow-500 shrink-0">
                  <img
                    src={schoolLogo}
                    alt="MHC Official Logo"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-xs text-white uppercase tracking-tight">Digital Portal</h3>
                  <p className="text-[9px] font-mono text-yellow-400">{user.role}</p>
                </div>
              </div>
              <button
                onClick={onBackToWebsite}
                className="text-[10px] bg-sky-900 px-2 py-1 rounded hover:bg-sky-850 text-yellow-400 font-bold"
                title="Back to public site"
              >
                Site
              </button>
            </div>

            {/* Current Logged in User info */}
            <div className="p-4 bg-sky-900/40 border-b border-sky-900/40 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-800 flex items-center justify-center text-yellow-400 text-xs font-bold font-mono">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate" title={user.name}>{user.name}</p>
                <p className="text-[9px] font-mono text-slate-400 truncate">{user.email}</p>
              </div>
            </div>

            {/* Menu Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {getSidebarTabs().map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-3 transition-all ${
                    activeTab === tab.id
                      ? "bg-yellow-500 text-sky-950 font-bold shadow-md"
                      : "text-slate-300 hover:bg-sky-900/60 hover:text-white"
                  }`}
                >
                  <span className="text-slate-400 dark:text-slate-300">
                    {/* Render corresponding dot or dynamic representation */}
                    •
                  </span>
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* System Logged in Status / Logout */}
            <div className="p-4 border-t border-sky-900/60 bg-sky-900/20 space-y-3">
              {/* PWA App Sidebar Badge */}
              <div className="p-3 bg-sky-900/40 rounded-2xl border border-sky-850/60 space-y-2 text-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                    <span className="text-[10px] font-bold text-yellow-400">📱</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-white leading-tight">Install MHC App</p>
                    <p className="text-[8px] text-slate-400 leading-tight">Lightweight & offline-ready</p>
                  </div>
                </div>
                {deferredPrompt ? (
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98] text-sky-950 font-bold py-1 px-2 rounded-lg text-[9px] transition-all cursor-pointer text-center"
                  >
                    Install Now
                  </button>
                ) : isInstalled ? (
                  <div className="text-center py-0.5 text-[8px] font-mono text-emerald-400 font-bold bg-emerald-950/20 rounded-md">
                    ✓ Installed on Device
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      alert("To install MHC Campus App:\n\n• On Chrome/Edge: Click the install icon in the browser URL bar.\n• On iOS (Safari): Tap the 'Share' icon, then select 'Add to Home Screen'.");
                    }}
                    className="w-full bg-white/5 hover:bg-white/10 text-white py-1 px-2 rounded-lg text-[9px] transition-all cursor-pointer text-center border border-white/10"
                  >
                    Setup Guide
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsSupabaseModalOpen(true)}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/60 transition-colors cursor-pointer text-[10px]"
              >
                <span className="flex items-center gap-1.5 font-semibold">
                  <Database className="w-3 h-3 text-emerald-400" />
                  Supabase DB
                </span>
                <span className="font-mono text-[9px] text-emerald-400">
                  {isDbConnected ? "Cloud" : "Local"}
                </span>
              </button>

              <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400 uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                Secure Session Active
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded-xl text-xs cursor-pointer transition-all shadow-sm"
              >
                <LogOut className="w-4 h-4" /> Sign Out Portal
              </button>
            </div>
          </aside>

          {/* Main Dashboard Screen Viewport */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Main Dashboards and Modules loader */}
              <Dashboards activeTab={activeTab} token={token || ""} user={user} />
            </div>
          </main>
        </div>
      )}

      {/* Supabase Configuration & Status Modal */}
      <SupabaseModal 
        isOpen={isSupabaseModalOpen} 
        onClose={() => setIsSupabaseModalOpen(false)} 
        onConfigChanged={() => setIsDbConnected(isSupabaseConfigured())} 
      />
    </div>
  );
}
