import React, { useState, useEffect } from "react";
import { BookOpen, Calendar, Users, ShieldAlert, Award, FileText, CheckCircle, Clipboard, AlertCircle, PlusCircle, CreditCard, Sparkles, Send, Download, HelpCircle, Flame, Plus, Heart, Eye, Printer, Trash, Terminal } from "lucide-react";
import schoolLogo from "../assets/images/mhc_official_badge.png";
import studentsTrophyPhoto from "../assets/images/students_champions_trophy.png";
import basketballTeamPhoto from "../assets/images/basketball_team_champions.png";
import { supabaseService } from "../services/supabaseService";
import { fetchDailyLiturgy } from "../services/aiService";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  name: string;
  role: "Admin" | "Principal" | "Vice Principal" | "Dean of Student Affairs" | "Finance Office" | "Teachers" | "Staff" | "Student Leaders" | "Students" | "Parents";
  createdAt: string;
}

interface DashboardsProps {
  activeTab: string;
  token: string;
  user: UserProfile;
}

export default function Dashboards({ activeTab, token, user }: DashboardsProps) {
  // Common state across sub-modules
  const [users, setUsers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [libraryResources, setLibraryResources] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Faith corner specific state
  const [faithData, setFaithData] = useState<any>({
    scripture: "Philippians 4:13 - 'I can do all things through Christ who strengthens me.'",
    saintOfTheDay: "Saint John Bosco (Patron of Youth and Educators)",
    dailyPrayer: "Lord Jesus, bless our studies at Mary Help of Christians today...",
    chaplainMessage: "Dear Auxilium Family, do your ordinary duties extraordinarily well with joy in your hearts.",
    liturgicalColor: "green",
  });
  const [loadingFaith, setLoadingFaith] = useState(false);

  // Form states
  const [newUser, setNewUser] = useState({ username: "", name: "", email: "", role: "Students", password: "password" });
  const [newPost, setNewPost] = useState({ content: "", anonymous: false, section: "feed" });
  const [newResult, setNewResult] = useState({ studentId: "u-9", subjectId: "sub-1", examTerm: "First Period" as const, score: 85, maxScore: 100, remarks: "" });
  const [newClass, setNewClass] = useState({ name: "", gradeLevel: "12" });
  const [newSubject, setNewSubject] = useState({ name: "", code: "", classId: "c-1" });
  const [newPayment, setNewPayment] = useState({ amount: 150, purpose: "Tuition" as const, receiptUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600" });
  const [newResource, setNewResource] = useState({ title: "", description: "", type: "Note" as const, fileUrl: "" });
  const [newSuggestion, setNewSuggestion] = useState({ title: "", content: "", category: "Academic" as const });
  const [newPrayer, setNewPrayer] = useState({ name: "", intention: "" });
  const [emergencyAlertMsg, setEmergencyAlertMsg] = useState("");
  const [emergencyAlertActive, setEmergencyAlertActive] = useState(false);

  // Attendance taking state
  const [attendanceClassId, setAttendanceClassId] = useState("c-1");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceStatuses, setAttendanceStatuses] = useState<Record<string, "Present" | "Absent" | "Late">>({});
  const [attendanceRemarks, setAttendanceRemarks] = useState<Record<string, string>>({});

  // Fetch all common DB entities directly via Supabase Service
  const fetchAllData = () => {
    supabaseService.getUsers().then(data => setUsers(Array.isArray(data) ? data : [])).catch(e => console.error(e));
    supabaseService.getClasses().then(data => setClasses(Array.isArray(data) ? data : [])).catch(e => console.error(e));
    supabaseService.getSubjects().then(data => setSubjects(Array.isArray(data) ? data : [])).catch(e => console.error(e));
    supabaseService.getResults().then(data => setResults(Array.isArray(data) ? data : [])).catch(e => console.error(e));
    supabaseService.getAttendance().then(data => setAttendance(Array.isArray(data) ? data : [])).catch(e => console.error(e));
    supabaseService.getPayments().then(data => setPayments(Array.isArray(data) ? data : [])).catch(e => console.error(e));
    supabaseService.getPosts().then(data => setPosts(Array.isArray(data) ? data : [])).catch(e => console.error(e));
    supabaseService.getClubs().then(data => setClubs(Array.isArray(data) ? data : [])).catch(e => console.error(e));
    supabaseService.getLibraryResources().then(data => setLibraryResources(Array.isArray(data) ? data : [])).catch(e => console.error(e));
    supabaseService.getSuggestions().then(data => setSuggestions(Array.isArray(data) ? data : [])).catch(e => console.error(e));
    supabaseService.getPrayerRequests().then(data => setPrayerRequests(Array.isArray(data) ? data : [])).catch(e => console.error(e));

    if (user.role === "Admin") {
      supabaseService.getAuditLogs().then(data => setAuditLogs(Array.isArray(data) ? data : [])).catch(e => console.error(e));
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token, user]);

  // Fetch Liturgical / Faith Package
  useEffect(() => {
    if (activeTab === "faith") {
      setLoadingFaith(true);
      fetchDailyLiturgy()
        .then((data) => {
          setFaithData(data);
          setLoadingFaith(false);
        })
        .catch((err) => {
          console.error("Liturgy API failed", err);
          setLoadingFaith(false);
        });
    }
  }, [activeTab]);

  // --- ACTIONS ---

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabaseService.createUser(newUser as any);
      alert("User account successfully created in Supabase database!");
      setNewUser({ username: "", name: "", email: "", role: "Students", password: "password" });
      fetchAllData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await supabaseService.deleteUser(id);
      alert("User successfully deleted");
      fetchAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent, sect: "feed" | "lounge") => {
    e.preventDefault();
    if (!newPost.content) return;
    try {
      await supabaseService.createPost({
        userId: user.id,
        authorName: user.name,
        authorRole: user.role,
        content: newPost.content,
        imageUrl: newPost.imageUrl,
        anonymous: newPost.anonymous,
        section: sect,
      });
      setNewPost({ content: "", anonymous: false, section: "feed" });
      fetchAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLikePost = async (id: string) => {
    try {
      await supabaseService.toggleLikePost(id, user.id);
      fetchAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCommentPost = async (id: string, text: string) => {
    if (!text) return;
    try {
      await supabaseService.addComment(id, {
        userId: user.id,
        name: user.name,
        role: user.role,
        content: text,
      });
      fetchAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      await supabaseService.deletePost(id);
      fetchAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabaseService.createResult(newResult as any);
      alert("Academic result saved to database!");
      fetchAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleTakeAttendance = async () => {
    const records = users
      .filter((u) => u.role === "Students")
      .map((student) => ({
        studentId: student.id,
        classId: attendanceClassId,
        status: attendanceStatuses[student.id] || "Present",
        remarks: attendanceRemarks[student.id] || "",
      }));

    try {
      await supabaseService.recordAttendance(attendanceDate, records);
      alert("Attendance recorded successfully!");
      fetchAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabaseService.createClass(newClass);
      alert("Class added!");
      setNewClass({ name: "", gradeLevel: "12" });
      fetchAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabaseService.createSubject(newSubject);
      alert("Subject added!");
      setNewSubject({ name: "", code: "", classId: "c-1" });
      fetchAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleVerifyPayment = async (id: string, status: "Fully Paid" | "Partially Paid", comment: string) => {
    try {
      await supabaseService.verifyPayment(id, status, comment);
      alert("Payment verified. Clearance active!");
      fetchAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUploadPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabaseService.submitPaymentSlip({ studentId: user.id, ...newPayment });
      alert("Receipt bank slip uploaded. Awaiting finance verification.");
      fetchAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUploadResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabaseService.uploadResource({
        ...newResource,
        uploadedBy: user.name,
      });
      alert("Resource uploaded into Digital Library!");
      setNewResource({ title: "", description: "", type: "Note", fileUrl: "" });
      fetchAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDownloadResource = async (id: string) => {
    try {
      await supabaseService.incrementDownload(id);
      alert("Simulating Resource Download. File saved locally.");
      fetchAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabaseService.createSuggestion(newSuggestion);
      alert("Anonymous suggestion logged. Thank you for your feedback.");
      setNewSuggestion({ title: "", content: "", category: "Academic" });
      fetchAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateSuggestionStatus = async (id: string, status: string) => {
    try {
      await supabaseService.updateSuggestionStatus(id, status as any);
      alert("Suggestion status updated");
      fetchAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostPrayerRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabaseService.submitPrayerRequest(newPrayer);
      alert("Community Prayer intention added. Mary Help of Christians will intercede.");
      setNewPrayer({ name: "", intention: "" });
      fetchAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePrayForRequest = async (id: string) => {
    try {
      await supabaseService.prayForRequest(id);
      fetchAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerEmergency = async () => {
    try {
      await supabaseService.updateEmergencyAlert(emergencyAlertActive, emergencyAlertMsg, "high");
      alert("Emergency Alert Status Updated across the school campus.");
    } catch (e) {
      console.error(e);
    }
  };

  // Liturgical season helper details
  const getLiturgicalColorTheme = (color: string) => {
    switch (color?.toLowerCase()) {
      case "violet": return { bg: "bg-violet-900", border: "border-violet-700", text: "text-violet-200", badge: "bg-violet-800 text-violet-100", label: "Lent / Advent Season (Violet)" };
      case "white": return { bg: "bg-amber-500", border: "border-amber-400", text: "text-sky-950", badge: "bg-amber-600 text-white", label: "Feast / Easter / Christmas (White & Gold)" };
      case "red": return { bg: "bg-red-800", border: "border-red-600", text: "text-red-100", badge: "bg-red-900 text-red-500", label: "Martyr Feasts / Pentecost (Red)" };
      case "rose": return { bg: "bg-pink-700", border: "border-pink-500", text: "text-pink-100", badge: "bg-pink-800 text-pink-200", label: "Joyous Anticipation (Rose)" };
      default: return { bg: "bg-emerald-900", border: "border-emerald-700", text: "text-emerald-100", badge: "bg-emerald-800 text-emerald-100", label: "Ordinary Time (Green)" };
    }
  };

  const liturgicalColors = getLiturgicalColorTheme(faithData.liturgicalColor);

  return (
    <div className="space-y-6">
      
      {/* ======================================================== */}
      {/* PORTAL VIEW: SYSTEM DASHBOARD (10 ROLE VIEWS) */}
      {/* ======================================================== */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-sky-950 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-500" /> Auxilium Campus Portal
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Welcome, {user.name} ({user.role}) • Mary Help of Christians High School
              </p>
            </div>
            <span className="bg-sky-900 text-white font-mono text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
              Liberia High School Devotion
            </span>
          </div>

          {/* Core Analytics Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-1">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Registered Students</span>
              <p className="text-2xl font-extrabold font-display text-sky-900">{users.filter(u => u.role === "Students").length + 2}</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-sky-900 h-full w-[85%]"></div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-1">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Academic Classes</span>
              <p className="text-2xl font-extrabold font-display text-emerald-600">{classes.length || 2}</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-[100%]"></div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-1">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Active Clubs</span>
              <p className="text-2xl font-extrabold font-display text-yellow-600">{clubs.length || 2}</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full w-[75%]"></div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-1">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Liturgical State</span>
              <p className="text-sm font-bold truncate text-sky-950 font-display">{liturgicalColors.label}</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full w-full ${liturgicalColors.bg}`}></div>
              </div>
            </div>
          </div>

          {/* ==================================== */}
          {/* 1. ADMIN ROLE VIEW */}
          {/* ==================================== */}
          {user.role === "Admin" && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* User creation */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4 lg:col-span-2">
                <h3 className="font-display font-extrabold text-sm text-sky-950 border-b pb-2">
                  🛡️ User & Account Management (Admin Panel)
                </h3>
                <form onSubmit={handleCreateUser} className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Username</label>
                    <input
                      required
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                      placeholder="e.g. b.sackor"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Full Name</label>
                    <input
                      required
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                      placeholder="e.g. Benedict Sackor"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Email</label>
                    <input
                      required
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                      placeholder="student@mhc.edu.lr"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Assigned Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Principal">Principal</option>
                      <option value="Vice Principal">Vice Principal</option>
                      <option value="Dean of Student Affairs">Dean of Student Affairs</option>
                      <option value="Finance Office">Finance Office</option>
                      <option value="Teachers">Teachers</option>
                      <option value="Staff">Staff</option>
                      <option value="Student Leaders">Student Leaders</option>
                      <option value="Students">Students</option>
                      <option value="Parents">Parents</option>
                    </select>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Password</label>
                    <input
                      required
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <button
                    type="submit"
                    className="sm:col-span-2 bg-sky-900 text-white font-bold text-xs p-3 rounded-xl hover:bg-sky-950 transition-all cursor-pointer"
                  >
                    Add User Account
                  </button>
                </form>

                <div className="pt-4">
                  <h4 className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-2">Registered Users Database</h4>
                  <div className="max-h-60 overflow-y-auto border rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-[10px] font-mono text-slate-500 uppercase border-b">
                        <tr>
                          <th className="p-3">User</th>
                          <th className="p-3">Role</th>
                          <th className="p-3">Email</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50">
                            <td className="p-3 font-semibold">{u.name}</td>
                            <td className="p-3"><span className="bg-sky-100 text-sky-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">{u.role}</span></td>
                            <td className="p-3">{u.email}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="text-red-600 hover:text-red-800 font-bold p-1"
                                title="Delete account"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Audit logs & moderation */}
              <div className="space-y-6">
                {/* System Audit logs */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-3">
                  <h3 className="font-display font-extrabold text-sm text-sky-950 flex items-center gap-1.5 border-b pb-2">
                    <Terminal className="w-4 h-4 text-slate-500" /> System Audit Logs
                  </h3>
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="text-[10px] bg-slate-50 p-2.5 rounded-xl space-y-1 border">
                        <div className="flex justify-between font-mono text-[9px] text-slate-400">
                          <span>{log.username} ({log.role})</span>
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="font-bold text-slate-700">{log.action}</p>
                        <p className="text-slate-500">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Moderation */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-3">
                  <h3 className="font-display font-extrabold text-sm text-sky-950 border-b pb-2">
                    ⚙️ Community Content Moderation
                  </h3>
                  <p className="text-xs text-slate-500">
                    Audit community discussions. Admins can delete any anonymous or flagged post instantly.
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {posts.map(p => (
                      <div key={p.id} className="flex justify-between items-center text-xs bg-slate-50 p-2.5 rounded-xl">
                        <span className="truncate max-w-[200px] italic">"{p.content}"</span>
                        <button onClick={() => handlePostDelete(p.id)} className="text-red-600 font-bold uppercase text-[9px]">
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================== */}
          {/* 2. PRINCIPAL ROLE VIEW */}
          {/* ==================================== */}
          {user.role === "Principal" && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4 md:col-span-2">
                <h3 className="font-display font-extrabold text-sm text-sky-950 border-b pb-2">
                  👑 Principal's Academic Oversight Dashboard
                </h3>
                <div className="p-4 bg-sky-900 text-white rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="font-display font-bold text-sm">School-Wide Reports Summary</h4>
                    <p className="text-xs text-slate-200">First Period Academic Grading averages: 100% submission</p>
                  </div>
                  <button onClick={() => window.print()} className="bg-yellow-500 hover:bg-yellow-600 text-sky-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1">
                    <Printer className="w-3.5 h-3.5" /> Print Report Card Overview
                  </button>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">Teacher Submissions</h4>
                  <div className="divide-y border rounded-2xl overflow-hidden text-xs">
                    <div className="p-3 bg-slate-50 font-mono text-[10px] flex justify-between font-bold">
                      <span>Subject</span>
                      <span>Teacher</span>
                      <span>Grades Logged</span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <span>Physics 12</span>
                      <span>Mr. Emmanuel Kamara</span>
                      <span className="text-emerald-600 font-bold">✓ Complete</span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <span>Mathematics 12</span>
                      <span>Mr. Emmanuel Kamara</span>
                      <span className="text-emerald-600 font-bold">✓ Complete</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Principal Quick Announcements */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-display font-extrabold text-sm text-sky-950 border-b pb-2">
                  📣 Create School Announcement
                </h3>
                <form onSubmit={(e) => handlePostSubmit(e, "feed")} className="space-y-3">
                  <textarea
                    rows={4}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border bg-slate-50"
                    placeholder="Principal's message to noticeboard..."
                  />
                  <button type="submit" className="w-full bg-sky-900 text-white font-bold p-2.5 rounded-xl text-xs">
                    Broadcast Announcement
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ==================================== */}
          {/* 3. VICE PRINCIPAL ROLE VIEW */}
          {/* ==================================== */}
          {user.role === "Vice Principal" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-display font-extrabold text-sm text-sky-950 border-b pb-2">
                  🎓 Academic Monitoring
                </h3>
                <p className="text-xs text-slate-500">
                  Vice Principal of Academics can register courses, add subjects, and monitor class grade distribution lists.
                </p>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono uppercase text-slate-400 font-bold">Add New Class Group</h4>
                  <form onSubmit={handleCreateClass} className="flex gap-2">
                    <input
                      required
                      type="text"
                      value={newClass.name}
                      onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                      className="text-xs p-2.5 rounded-xl border flex-1"
                      placeholder="e.g. Grade 10 Arts"
                    />
                    <button type="submit" className="bg-sky-900 text-white px-4 py-2 rounded-xl text-xs font-bold">
                      Add
                    </button>
                  </form>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono uppercase text-slate-400 font-bold">Add Subject Module</h4>
                  <form onSubmit={handleCreateSubject} className="space-y-2">
                    <input
                      required
                      type="text"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border"
                      placeholder="e.g. Organic Chemistry"
                    />
                    <input
                      required
                      type="text"
                      value={newSubject.code}
                      onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border"
                      placeholder="e.g. CHM-12"
                    />
                    <button type="submit" className="w-full bg-sky-900 text-white p-2 rounded-xl text-xs font-bold">
                      Register Subject
                    </button>
                  </form>
                </div>
              </div>

              {/* Attendance compliance */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-display font-extrabold text-sm text-sky-950 border-b pb-2">
                  📋 Attendance Analytics
                </h3>
                <div className="p-4 bg-emerald-900 text-white rounded-xl text-center">
                  <h4 className="font-display font-bold text-sm">Overall School Attendance Rate</h4>
                  <p className="text-3xl font-extrabold">94.2%</p>
                  <p className="text-[10px] text-emerald-200">WASSCE mock revision attendance is highly consistent</p>
                </div>
                <div className="max-h-48 overflow-y-auto text-xs space-y-2">
                  <h4 className="text-[10px] font-mono uppercase text-slate-400 font-bold">Latest Absentees Logs</h4>
                  {attendance.filter(a => a.status === "Absent").map(a => (
                    <div key={a.id} className="p-2.5 bg-slate-50 border rounded-xl flex justify-between">
                      <span className="font-bold">Student ID: {a.studentId}</span>
                      <span className="text-red-600 font-mono text-[10px] uppercase font-bold">{a.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================== */}
          {/* 4. DEAN OF STUDENT AFFAIRS VIEW */}
          {/* ==================================== */}
          {user.role === "Dean of Student Affairs" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-display font-extrabold text-sm text-sky-950 border-b pb-2">
                  ⚖️ Discipline Management (Dean of Students Panel)
                </h3>
                <p className="text-xs text-slate-500">
                  Manage student conduct, merits, and disciplinary logs. In Liberia high school communities, standard moral discipline is essential.
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-red-100 border border-red-200 rounded-xl space-y-1">
                    <h4 className="font-bold text-xs text-red-950">Active Suspension Cases: 0</h4>
                    <p className="text-[10px] text-red-800">All students currently maintain active status.</p>
                  </div>
                  <div className="p-3 bg-emerald-100 border border-emerald-200 rounded-xl space-y-1">
                    <h4 className="font-bold text-xs text-emerald-950">Discipline Score Average: 96/100</h4>
                    <p className="text-[10px] text-emerald-800">Salesian virtues are highly demonstrated.</p>
                  </div>
                </div>
              </div>

              {/* Trigger Campus emergency */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-display font-extrabold text-sm text-sky-950 border-b pb-2">
                  🚨 Trigger Campus Emergency Notice
                </h3>
                <p className="text-xs text-slate-500">
                  Activates a critical scrolling red notification banner across all logged-in school platform user screens instantly.
                </p>
                <div className="space-y-3">
                  <textarea
                    rows={3}
                    value={emergencyAlertMsg}
                    onChange={(e) => setEmergencyAlertMsg(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border bg-slate-50"
                    placeholder="Enter urgent emergency alert description (e.g. Heavy rainfall, school closure)..."
                  />
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={emergencyAlertActive}
                        onChange={(e) => setEmergencyAlertActive(e.target.checked)}
                      />
                      Active Emergency
                    </label>
                    <button
                      type="button"
                      onClick={handleTriggerEmergency}
                      className="bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
                    >
                      Apply Emergency State
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================== */}
          {/* 5. FINANCE OFFICE VIEW */}
          {/* ==================================== */}
          {user.role === "Finance Office" && (
            <div className="space-y-6">
              <div className="p-5 bg-white border border-slate-200/60 rounded-3xl shadow-sm space-y-4">
                <h3 className="font-display font-extrabold text-sm text-sky-950 border-b pb-2">
                  💵 Finance & Fee Verification Center
                </h3>
                <p className="text-xs text-slate-500">
                  Review student uploaded banking receipts, verify tuition payments, and grant physical or digital Financial Clearance.
                </p>

                <div className="border rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 font-mono text-[10px] text-slate-500 uppercase border-b">
                      <tr>
                        <th className="p-3">Student ID</th>
                        <th className="p-3">Receipt Purpose</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Receipt Slip</th>
                        <th className="p-3">Verification</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {payments.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold font-mono">{p.studentId}</td>
                          <td className="p-3">{p.purpose}</td>
                          <td className="p-3 font-bold">${p.amount} USD</td>
                          <td className="p-3">
                            {p.receiptUrl ? (
                              <a href={p.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-sky-900 font-bold hover:underline flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" /> View Slip Photo
                              </a>
                            ) : "No slip"}
                          </td>
                          <td className="p-3">
                            {p.verified ? (
                              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase">VERIFIED & CLEARED</span>
                            ) : (
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase">PENDING REVIEW</span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {!p.verified && (
                              <button
                                onClick={() => handleVerifyPayment(p.id, "Fully Paid", "Verified & Approved")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg"
                              >
                                Approve & Clear
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================================== */}
          {/* 6. TEACHERS VIEW */}
          {/* ==================================== */}
          {user.role === "Teachers" && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Grading Input */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-display font-extrabold text-sm text-sky-950 border-b pb-2">
                  📝 Log Student Exam Scores & Grades
                </h3>
                <form onSubmit={handleAddResult} className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Student Account</label>
                      <select
                        value={newResult.studentId}
                        onChange={(e) => setNewResult({ ...newResult, studentId: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border"
                      >
                        {users.filter(u => u.role === "Students").map(st => (
                          <option key={st.id} value={st.id}>{st.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Subject Module</label>
                      <select
                        value={newResult.subjectId}
                        onChange={(e) => setNewResult({ ...newResult, subjectId: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border"
                      >
                        {subjects.map(sub => (
                          <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Exam Term</label>
                      <select
                        value={newResult.examTerm}
                        onChange={(e) => setNewResult({ ...newResult, examTerm: e.target.value as any })}
                        className="w-full text-xs p-2.5 rounded-xl border"
                      >
                        <option value="First Period">First Period</option>
                        <option value="Mid Term">Mid Term</option>
                        <option value="Finals">Finals</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Score Obtained</label>
                      <input
                        required
                        type="number"
                        value={newResult.score}
                        onChange={(e) => setNewResult({ ...newResult, score: Number(e.target.value) })}
                        className="w-full text-xs p-2.5 rounded-xl border"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Maximum Score</label>
                      <input
                        required
                        type="number"
                        value={newResult.maxScore}
                        onChange={(e) => setNewResult({ ...newResult, maxScore: Number(e.target.value) })}
                        className="w-full text-xs p-2.5 rounded-xl border"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Teacher's Remarks</label>
                    <input
                      required
                      type="text"
                      value={newResult.remarks}
                      onChange={(e) => setNewResult({ ...newResult, remarks: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border"
                      placeholder="e.g. Excellent focus"
                    />
                  </div>

                  <button type="submit" className="w-full bg-sky-900 text-white font-bold p-2.5 rounded-xl text-xs">
                    Log Student Result Card
                  </button>
                </form>
              </div>

              {/* Take Attendance */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-display font-extrabold text-sm text-sky-950 border-b pb-2">
                  📅 Roll Call & Daily Attendance Tracker
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Date</label>
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Class Section</label>
                    <select
                      value={attendanceClassId}
                      onChange={(e) => setAttendanceClassId(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border"
                    >
                      {classes.map(cl => (
                        <option key={cl.id} value={cl.id}>{cl.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-xl divide-y">
                  {users.filter(u => u.role === "Students").map(student => (
                    <div key={student.id} className="p-3 flex justify-between items-center gap-4 text-xs">
                      <span className="font-semibold">{student.name}</span>
                      <div className="flex gap-1">
                        {["Present", "Absent", "Late"].map(st => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setAttendanceStatuses(prev => ({ ...prev, [student.id]: st as any }))}
                            className={`px-2 py-1 rounded text-[10px] font-bold ${
                              (attendanceStatuses[student.id] || "Present") === st
                                ? st === "Present" ? "bg-emerald-600 text-white" : st === "Absent" ? "bg-red-600 text-white" : "bg-yellow-500 text-sky-950"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleTakeAttendance}
                  className="w-full bg-emerald-600 text-white font-bold p-3 rounded-xl text-xs"
                >
                  Save Daily Roll Call
                </button>
              </div>
            </div>
          )}

          {/* ==================================== */}
          {/* 7. STAFF DASHBOARD VIEW */}
          {/* ==================================== */}
          {user.role === "Staff" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-display font-extrabold text-sm text-sky-950 border-b pb-2">
                  🛠️ Assigned Administrative Tasks
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold">Generate report card templates</h4>
                      <p className="text-[10px] text-slate-500">Due: June 30, 2026</p>
                    </div>
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Pending</span>
                  </div>
                  <div className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-xs opacity-60">
                    <div>
                      <h4 className="font-bold">Install router in Dean's office</h4>
                      <p className="text-[10px] text-slate-500">Completed June 25</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Completed</span>
                  </div>
                </div>
              </div>

              {/* Staff notices */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-display font-extrabold text-sm text-sky-950 border-b pb-2">
                  📌 Administrative Staff Board
                </h3>
                <p className="text-xs text-slate-500">
                  Daily support shifts and back-office schedules for Sinkor MHC server structures.
                </p>
                <div className="text-xs font-mono bg-sky-950 text-emerald-400 p-4 rounded-xl space-y-1">
                  <p>&gt; SYSTEM BACKUPS: SUCCESSFUL</p>
                  <p>&gt; DATABASE METRICS: RELATIONAL JSON PERSISTENCE OK</p>
                  <p>&gt; CAMPUS INGRESS PORT: 3000 ACTIVE</p>
                </div>
              </div>
            </div>
          )}

          {/* ==================================== */}
          {/* 8. STUDENT LEADER VIEW */}
          {/* ==================================== */}
          {user.role === "Student Leaders" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-display font-extrabold text-sm text-sky-950 border-b pb-2">
                  📣 Student Council Initiatives (Student Leader Panel)
                </h3>
                <p className="text-xs text-slate-500">
                  Welcome Princess Sherman! Co-ordinate student athletic registrations, Marian Sodality retreats, and student lounge polls.
                </p>
                <div className="p-3.5 bg-yellow-100 border border-yellow-200 text-yellow-900 rounded-xl space-y-1">
                  <h4 className="font-bold text-xs">Active Initiative: Annual Feast Cup Tournament</h4>
                  <p className="text-[10px] text-yellow-800">Football registration starts tomorrow morning in the study hall.</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-display font-extrabold text-sm text-sky-950 border-b pb-2">
                  📊 Create Student Lounge Poll
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    className="w-full text-xs p-2.5 rounded-xl border bg-slate-50"
                    placeholder="Enter Poll Topic (e.g. Best Feast Day Sport?)"
                  />
                  <button type="button" onClick={() => alert("Poll successfully published into Student Lounge!")} className="w-full bg-sky-900 text-white font-bold p-2 rounded-xl text-xs">
                    Publish Student Poll
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================================== */}
          {/* 9. STUDENTS VIEW */}
          {/* ==================================== */}
          {user.role === "Students" && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4 lg:col-span-2">
                <h3 className="font-display font-extrabold text-sm text-sky-950 border-b pb-2">
                  👤 Student Academic Profile
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-sky-50 border rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Class Room Assignment</span>
                    <p className="font-bold text-sm text-sky-900">Grade 12 Science</p>
                    <p className="text-[10px] text-slate-500">Adviser: Mr. Emmanuel Kamara</p>
                  </div>
                  <div className="p-4 bg-sky-50 border rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Admission Number</span>
                    <p className="font-bold text-sm text-sky-900">MHC-2026-048</p>
                    <p className="text-[10px] text-slate-500">Status: Active</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">My Exam Results (Report Card)</h4>
                  <div className="divide-y border rounded-2xl overflow-hidden text-xs">
                    <div className="p-3 bg-slate-50 font-mono text-[10px] flex justify-between font-bold">
                      <span>Subject</span>
                      <span>Term</span>
                      <span>Obtained</span>
                      <span>Grade</span>
                    </div>
                    {results.filter(r => r.studentId === user.id).map(r => (
                      <div key={r.id} className="p-3 flex justify-between items-center">
                        <span className="font-semibold">{subjects.find(s => s.id === r.subjectId)?.name || "Physics"}</span>
                        <span>{r.examTerm}</span>
                        <span className="font-bold">{r.score}/{r.maxScore}</span>
                        <span className="bg-sky-900 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">{r.grade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Student quick schedule */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-display font-extrabold text-sm text-sky-950 border-b pb-2">
                  🎒 Daily Class Timetable
                </h3>
                <div className="space-y-3 font-mono text-[11px]">
                  <div className="p-2.5 bg-slate-50 rounded-xl border flex justify-between">
                    <span>8:00 AM - 9:30 AM</span>
                    <span className="font-bold">Physics</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border flex justify-between">
                    <span>9:30 AM - 11:00 AM</span>
                    <span className="font-bold">Mathematics</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border flex justify-between">
                    <span>11:30 AM - 1:00 PM</span>
                    <span className="font-bold">Chemistry</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================== */}
          {/* 10. PARENTS VIEW */}
          {/* ==================================== */}
          {user.role === "Parents" && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4 lg:col-span-2">
                <h3 className="font-display font-extrabold text-sm text-sky-950 border-b pb-2">
                  👪 Parent Child Monitoring
                </h3>
                <p className="text-xs text-slate-500">
                  Track the academic results, overall class attendance, and financial tuition ledger of your child, <strong>Benedict Sackor</strong>.
                </p>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">Latest Grades</h4>
                  <div className="divide-y border rounded-xl overflow-hidden text-xs">
                    {results.map(r => (
                      <div key={r.id} className="p-3 flex justify-between">
                        <span>{subjects.find(s => s.id === r.subjectId)?.name || "Physics"}</span>
                        <span className="font-bold">{r.score}/{r.maxScore}</span>
                        <span className="text-emerald-600 font-bold uppercase text-[10px]">{r.grade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fee and tuition clearance helper */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-display font-extrabold text-sm text-sky-950 border-b pb-2">
                  💳 School Tuition Status
                </h3>
                <div className="p-4 bg-emerald-900 text-white rounded-xl text-center">
                  <h4 className="font-display font-bold text-xs text-emerald-200">TUITION STATUS</h4>
                  <p className="text-2xl font-extrabold">Partially Paid</p>
                  <p className="text-[10px] mt-1">$250 paid of $400 annual total</p>
                </div>
                <button
                  onClick={() => alert("Please go to 'Finance & Fees' sidebar tab to upload your next banking receipt slip.")}
                  className="w-full bg-sky-900 text-white font-bold p-2.5 rounded-xl text-xs hover:bg-sky-950 transition-all"
                >
                  Clear Tuition Balance
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* ACADEMICS HUB (Phase 5) */}
      {/* ======================================================== */}
      {activeTab === "academic" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
          <div className="border-b pb-4">
            <h2 className="font-display text-xl font-extrabold text-sky-950">Academic Management System</h2>
            <p className="text-xs text-slate-500">MHC Academic classes, syllabus subject modules, and registered timetables.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-display font-bold text-sm text-sky-900">Registered Classes</h3>
              <div className="divide-y border rounded-2xl overflow-hidden text-xs">
                {classes.map(cl => (
                  <div key={cl.id} className="p-3 flex justify-between hover:bg-slate-50">
                    <span className="font-bold">{cl.name}</span>
                    <span className="font-mono text-slate-500">Grade level {cl.gradeLevel}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-display font-bold text-sm text-sky-900">Registered Subject Modules</h3>
              <div className="divide-y border rounded-2xl overflow-hidden text-xs">
                {subjects.map(sub => (
                  <div key={sub.id} className="p-3 flex justify-between hover:bg-slate-50">
                    <span className="font-semibold">{sub.name}</span>
                    <span className="font-mono text-slate-500 uppercase">{sub.code}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FINANCE & FEES (Phase 6) */}
      {/* ======================================================== */}
      {activeTab === "finance" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tuition upload slip */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4 lg:col-span-2">
            <div className="border-b pb-2">
              <h2 className="font-display text-xl font-extrabold text-sky-950">Finance Office System</h2>
              <p className="text-xs text-slate-500">Tuition, Science Lab Fees, and official bank receipt uploads.</p>
            </div>

            {/* Render printable digital clearance if verified */}
            {payments.some(p => p.studentId === user.id && p.verified) ? (
              <div className="p-5 border-4 border-double border-emerald-600 bg-emerald-50 rounded-2xl relative text-center space-y-3">
                <span className="absolute top-2 right-2 text-emerald-700 bg-emerald-100 border border-emerald-300 font-bold text-[9px] px-2 py-0.5 rounded uppercase">Official Seal</span>
                <span className="text-4xl">🎓</span>
                <h3 className="font-display font-extrabold text-base text-emerald-950 uppercase tracking-wide">
                  Mary Help of Christians School Clearance
                </h3>
                <div className="text-xs text-slate-700 space-y-1">
                  <p>This is to certify that <strong>{user.name}</strong> has fully settled financial balances for the 2026 Academic Season.</p>
                  <p className="font-mono text-[10px] text-slate-500">Clearance Code: MHC-FIN-2026-OK • Verified: Joyce Sumo</p>
                </div>
                <button onClick={() => window.print()} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 mx-auto shadow-sm">
                  <Printer className="w-4 h-4" /> Print PDF Clearance Badge
                </button>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-xl text-xs">
                Your current account status does not have complete clearance verified yet. Upload your bank payment slip below.
              </div>
            )}

            <form onSubmit={handleUploadPayment} className="space-y-4">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-500">Upload New Bank Payment Receipt Slip</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Payment Amount (USD)</label>
                  <input
                    required
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                    className="w-full text-xs p-3 rounded-xl border bg-slate-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Purpose</label>
                  <select
                    value={newPayment.purpose}
                    onChange={(e) => setNewPayment({ ...newPayment, purpose: e.target.value as any })}
                    className="w-full text-xs p-3 rounded-xl border bg-slate-50"
                  >
                    <option value="Tuition">Tuition</option>
                    <option value="Registration">Registration</option>
                    <option value="Lab Fees">Lab Fees</option>
                    <option value="Graduation">Graduation</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Mock Bank Slip Image Link</label>
                <input
                  required
                  type="text"
                  value={newPayment.receiptUrl}
                  onChange={(e) => setNewPayment({ ...newPayment, receiptUrl: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border bg-slate-50"
                />
              </div>
              <button type="submit" className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold p-3 rounded-xl text-xs">
                Submit Receipt Slip to Finance Office
              </button>
            </form>
          </div>

          {/* Fees list */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-sm text-sky-950 border-b pb-2">Your Payment Transactions</h3>
            <div className="space-y-3">
              {payments.filter(p => p.studentId === user.id).map(p => (
                <div key={p.id} className="p-3 bg-slate-50 border rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between font-mono font-bold text-[10px]">
                    <span>{p.purpose}</span>
                    <span>${p.amount} USD</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>{p.date}</span>
                    <span className={p.verified ? "text-emerald-600 font-bold" : "text-amber-600"}>
                      {p.verified ? "Cleared" : "Pending Verification"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* COMMUNICATION (Phase 7) */}
      {/* ======================================================== */}
      {activeTab === "comms" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
          <div className="border-b pb-4">
            <h2 className="font-display text-xl font-extrabold text-sky-950">School Notice Board & Communications</h2>
            <p className="text-xs text-slate-500">View official announcements, broadcasted signals, and community notifications.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-display font-bold text-sm text-sky-900">Broadcast Noticeboard Announcements</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {posts.filter(p => p.authorRole === "Admin" || p.authorRole === "Principal").map(ann => (
                  <div key={ann.id} className="p-4 bg-sky-50 border border-sky-100 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <span>Broadcasted by: {ann.authorName}</span>
                      <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-xs text-sky-950 font-display">Official Notice</h4>
                    <p className="text-xs text-slate-600 leading-relaxed italic">"{ann.content}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* In-app messenger simulation */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border">
              <h3 className="font-display font-bold text-xs text-slate-700 uppercase tracking-wider">Internal Message Box</h3>
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 font-bold uppercase">Recipient</label>
                  <select className="w-full text-xs p-2 rounded-lg border bg-white">
                    <option>Principal Beatrice</option>
                    <option>Father Joseph (Dean)</option>
                    <option>Joyce Sumo (Finance)</option>
                  </select>
                </div>
                <textarea rows={3} className="w-full text-xs p-2.5 rounded-lg border bg-white" placeholder="Write internal memo..." />
                <button onClick={() => alert("Message successfully dispatched internally")} className="w-full bg-sky-900 text-white font-bold p-2 rounded-lg text-xs flex justify-center items-center gap-1">
                  <Send className="w-3 h-3" /> Send Memo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* COMMUNITY FEED (Phase 8) */}
      {/* ======================================================== */}
      {activeTab === "community" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Campus Champions Bulletin Banner */}
            <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-900 text-white p-5 rounded-3xl border border-sky-800 shadow-md space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono uppercase bg-yellow-500 text-sky-950 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3" /> Official Campus Bulletin
                </span>
                <span className="text-[10px] font-mono text-slate-300">Don Bosco Feast Day Champions</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/20">
                  <img src={basketballTeamPhoto} alt="MHC Basketball Champions" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <p className="text-[10px] font-bold text-yellow-400">Basketball Category Winners (2025)</p>
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/20">
                  <img src={studentsTrophyPhoto} alt="MHC Students with Cup" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <p className="text-[10px] font-bold text-yellow-400">Student Champions at New Matadi Gate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Post */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-3">
              <h3 className="font-display font-extrabold text-sm text-sky-950">Share with the MHC Community</h3>
              <form onSubmit={(e) => handlePostSubmit(e, "feed")} className="space-y-3">
                <textarea
                  required
                  rows={3}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border bg-slate-50"
                  placeholder="What is happening on campus today?"
                />
                <button type="submit" className="bg-sky-900 text-white font-bold text-xs px-5 py-2 rounded-full hover:bg-sky-950 transition-all flex items-center gap-1">
                  <Send className="w-3.5 h-3.5" /> Post to Feed
                </button>
              </form>
            </div>

            {/* Community Feed Posts */}
            <div className="space-y-4">
              {posts.filter(p => p.section === "feed").map(p => (
                <div key={p.id} className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-3 relative">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-sky-900 text-yellow-400 font-bold font-mono text-xs flex items-center justify-center">
                        {p.authorName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{p.authorName}</h4>
                        <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono font-bold">{p.authorRole}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.content}
                  </p>

                  <div className="flex gap-4 border-t pt-2.5 text-[11px] text-slate-500">
                    <button onClick={() => handleLikePost(p.id)} className="hover:text-red-600 font-semibold flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" /> Love ({p.likes.length})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Club listings */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-sm text-sky-950 border-b pb-2">Active School Clubs</h3>
            <div className="space-y-4">
              {clubs.map(c => (
                <div key={c.id} className="space-y-2 border-b pb-3 text-xs last:border-0 last:pb-0">
                  <h4 className="font-bold text-sky-900">{c.name}</h4>
                  <p className="text-slate-500 leading-relaxed text-[11px]">{c.description}</p>
                  <button onClick={() => alert("Joined Club successfully!")} className="bg-sky-50 text-sky-900 hover:bg-sky-100 text-[10px] font-bold px-3 py-1 rounded-full border">
                    Join Membership
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STUDENT LOUNGE (Phase 8 - Restricted / Private) */}
      {/* ======================================================== */}
      {activeTab === "lounge" && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="p-5 bg-sky-950 text-white rounded-3xl relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <span className="bg-yellow-500 text-sky-950 font-mono font-bold text-[9px] tracking-widest px-2.5 py-1 rounded-full uppercase">
                STUDENTS & LEADERS HUB ONLY
              </span>
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-white">Student Lounge Discussions</h2>
              <p className="text-xs text-slate-200">A friendly space to coordinate exam studies, share anonymous merits, and vote on polls.</p>
            </div>
            <div className="absolute right-4 bottom-4 text-7xl opacity-10 pointer-events-none">☕</div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Anonymous Post Input */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-3">
                <h3 className="font-display font-bold text-xs text-slate-500 uppercase tracking-wider">Submit Anonymous or Public Message</h3>
                <form onSubmit={(e) => handlePostSubmit(e, "lounge")} className="space-y-3">
                  <textarea
                    required
                    rows={3}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border bg-slate-50"
                    placeholder="Ask questions anonymously or share student life updates..."
                  />
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={newPost.anonymous}
                        onChange={(e) => setNewPost({ ...newPost, anonymous: e.target.checked })}
                      />
                      Post Anonymously
                    </label>
                    <button type="submit" className="bg-sky-900 text-white font-bold text-xs px-4 py-2 rounded-full">
                      Post to Lounge
                    </button>
                  </div>
                </form>
              </div>

              {/* Lounge Posts list */}
              <div className="space-y-4">
                {posts.filter(p => p.section === "lounge").map(p => (
                  <div key={p.id} className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-3">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="font-bold text-sky-900">{p.anonymous ? "Anonymous Student" : p.authorName}</span>
                      <span className="text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{p.content}"</p>
                    <div className="flex gap-4 border-t pt-2 text-[11px] text-slate-500">
                      <button onClick={() => handleLikePost(p.id)} className="hover:text-red-500 font-semibold flex items-center gap-1">
                        ❤️ Love ({p.likes.length})
                      </button>
                      <span className="text-slate-300">|</span>
                      <button onClick={() => alert("Reported to Student Council / Dean of Students for review.")} className="hover:text-red-600">
                        Flag Content
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* lounge polls */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-sm text-sky-950 border-b pb-2">Student Council Polls</h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 border rounded-2xl space-y-2 text-xs">
                  <h4 className="font-bold">What was your favorite feast day event?</h4>
                  <div className="space-y-1.5 font-mono text-[10px]">
                    <button onClick={() => alert("Vote registered")} className="w-full text-left p-2 bg-white rounded border hover:bg-slate-50">
                      ⚽ Football Cup Match (42%)
                    </button>
                    <button onClick={() => alert("Vote registered")} className="w-full text-left p-2 bg-white rounded border hover:bg-slate-50">
                      🔬 Science Club Exhibition (38%)
                    </button>
                    <button onClick={() => alert("Vote registered")} className="w-full text-left p-2 bg-white rounded border hover:bg-slate-50">
                      🕯️ Rosary Procession (20%)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DIGITAL LIBRARY (Phase 9) */}
      {/* ======================================================== */}
      {activeTab === "library" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
          <div className="border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="font-display text-xl font-extrabold text-sky-950">Digital Library & Archives</h2>
              <p className="text-xs text-slate-500">Search and download exam guides, student handbook chapters, and teacher class notes.</p>
            </div>
            {["Admin", "Teachers"].includes(user.role) && (
              <button
                type="button"
                onClick={() => alert("Upload dialog simulated. Use form inside Dashboards components.")}
                className="bg-sky-900 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Upload Resource File
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {libraryResources.map(res => (
              <div key={res.id} className="p-5 border rounded-2xl bg-slate-50 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="bg-sky-100 text-sky-800 text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded">
                    {res.type}
                  </span>
                  <h4 className="font-display font-bold text-sm text-slate-800 leading-snug">{res.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{res.description}</p>
                </div>
                <div className="pt-3 border-t flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>Downloads: {res.downloadCount}</span>
                  <button onClick={() => handleDownloadResource(res.id)} className="bg-sky-900 text-white p-1.5 rounded-lg hover:bg-sky-950">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CATHOLIC FAITH CORNER (Phase 11) */}
      {/* ======================================================== */}
      {activeTab === "faith" && (
        <div className="space-y-6">
          {/* Liturgical season banner */}
          <div className={`p-6 text-white rounded-3xl border relative overflow-hidden ${liturgicalColors.bg} ${liturgicalColors.border} shadow-lg`}>
            <div className="relative z-10 space-y-2">
              <span className="bg-white/20 font-mono font-bold text-[9px] tracking-widest px-2.5 py-1 rounded-full uppercase">
                {liturgicalColors.label}
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold">Salesian Daily Spiritual Feed</h2>
              <p className="text-xs text-slate-200 max-w-xl font-light">
                Spiritual readings and chaplain messages matching the liturgical season, dynamically guided by our Salesian preventative educational model.
              </p>
            </div>
            <div className="absolute right-4 bottom-4 text-8xl opacity-10 pointer-events-none">⛪</div>
          </div>

          {loadingFaith ? (
            <div className="p-12 text-center bg-white border rounded-3xl space-y-2">
              <span className="text-3xl animate-spin inline-block">⏳</span>
              <p className="text-xs text-slate-500 font-mono">Generating Liturgical Reflections via Gemini AI...</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Scripture & Saint of the day */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Daily Scripture Reading</span>
                    <blockquote className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-yellow-500 pl-4 py-1">
                      "{faithData.scripture || "Love one another as I have loved you."}"
                    </blockquote>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Saint of the Day</span>
                    <h4 className="font-display font-bold text-sm text-sky-950">{faithData.saintOfTheDay}</h4>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Chaplain's Daily Prayer</span>
                    <p className="text-xs text-slate-500 leading-relaxed italic">
                      "{faithData.dailyPrayer}"
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">School Chaplain's Message (Father Joseph)</span>
                    <p className="text-xs text-slate-500 leading-relaxed italic font-semibold text-sky-950">
                      "{faithData.chaplainMessage}"
                    </p>
                  </div>
                </div>

                {/* Prayer Request intentions */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                  <h3 className="font-display font-bold text-sm text-sky-950">MHC Community Prayer Request Board</h3>
                  <p className="text-xs text-slate-500">Post your prayer intentions. Classes and community members will light a virtual candle and join in prayer.</p>

                  <form onSubmit={handlePostPrayerRequest} className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Your Name (or Anonymous)</label>
                        <input
                          type="text"
                          value={newPrayer.name}
                          onChange={(e) => setNewPrayer({ ...newPrayer, name: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-xl border bg-slate-50"
                          placeholder="e.g. Benedict Sackor"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Prayer Intention / Request</label>
                        <input
                          required
                          type="text"
                          value={newPrayer.intention}
                          onChange={(e) => setNewPrayer({ ...newPrayer, intention: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-xl border bg-slate-50"
                          placeholder="What would you like us to pray for?"
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-sky-900 text-white font-bold p-2.5 rounded-xl text-xs flex justify-center items-center gap-1">
                      <Flame className="w-4 h-4 text-yellow-400 animate-pulse" /> Submit Prayer Request
                    </button>
                  </form>

                  <div className="space-y-3 pt-3 border-t">
                    {prayerRequests.map(pr => (
                      <div key={pr.id} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{pr.intention}</p>
                          <p className="text-[10px] text-slate-400">Requested by {pr.name} • {pr.date}</p>
                        </div>
                        <button
                          onClick={() => handlePrayForRequest(pr.id)}
                          className="bg-yellow-100 hover:bg-yellow-200 border border-yellow-300 text-yellow-800 px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold flex items-center gap-1.5"
                        >
                          🕯️ Pray ({pr.prayersCount})
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Liturgical instructions */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-display font-bold text-sm text-sky-950 border-b pb-2">Liturgical Season Duties</h3>
                <div className="space-y-3 text-xs leading-relaxed text-slate-600">
                  <p>In <strong>{liturgicalColors.label}</strong>, all students and instructors are asked to observe standard liturgical assignments:</p>
                  <ul className="list-disc list-inside space-y-1 font-light text-[11px]">
                    <li>Recite the Don Bosco Student Rosary at morning assembly.</li>
                    <li>Participate in Wednesday chapel Mass.</li>
                    <li>Observe active charity and preventative virtue duties.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* ADVANCED SERVICES HUB (Phase 10) */}
      {/* ======================================================== */}
      {activeTab === "advanced" && (
        <div className="space-y-6">
          <div className="p-5 bg-white border border-slate-200/60 rounded-3xl shadow-sm space-y-4">
            <h2 className="font-display text-xl font-extrabold text-sky-950 border-b pb-2">
              Advanced Campus Services Hub
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1: ID Card Generator */}
              <div className="p-4 border rounded-2xl bg-slate-50 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="bg-sky-100 text-sky-800 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded">Security</span>
                  <h4 className="font-display font-bold text-sm text-slate-800 mt-2">Digital Student ID Card Generator</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Renders a high-fidelity, high-contrast barcode digital student badge for school security checks.</p>
                </div>

                {/* Simulated rendering of student ID */}
                <div className="p-4 bg-sky-900 border-2 border-yellow-500 rounded-xl text-white space-y-3 relative overflow-hidden max-w-xs mx-auto">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 pointer-events-none overflow-hidden rounded-full">
                    <img src={schoolLogo} alt="MHC Watermark" className="w-full h-full object-cover scale-110 filter blur-[0.5px]" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex justify-between items-center border-b pb-1 relative z-10">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-white overflow-hidden shrink-0">
                        <img src={schoolLogo} alt="MHC Mini" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="text-[8px] font-mono uppercase tracking-widest text-yellow-400 font-extrabold">MHC HIGH SCHOOL</span>
                    </div>
                    <span className="text-[8px] bg-sky-800 text-slate-100 px-1.5 py-0.5 rounded uppercase font-bold">{user.role}</span>
                  </div>
                  <div className="flex gap-3 items-center relative z-10">
                    <div className="w-12 h-12 bg-sky-850 rounded-lg flex items-center justify-center text-yellow-400 text-lg font-bold font-mono">
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-[10px] space-y-0.5">
                      <p className="font-bold truncate max-w-[120px]">{user.name}</p>
                      <p className="font-mono text-slate-300">ID: MHC-2026-048</p>
                      <p className="text-yellow-400">Grade 12 Science</p>
                    </div>
                  </div>
                  <div className="border-t pt-1.5 flex justify-between items-center text-[8px] font-mono text-slate-400 relative z-10">
                    <span>Exp: Dec 2026</span>
                    <span className="bg-white text-slate-900 px-1.5 rounded text-[7px] tracking-widest">||||||||||||</span>
                  </div>
                </div>

                <button onClick={() => window.print()} className="w-full bg-sky-900 text-white font-bold p-2.5 rounded-xl text-xs flex justify-center items-center gap-1 shadow-sm">
                  <Printer className="w-4 h-4" /> Print Physical ID Card
                </button>
              </div>

              {/* Card 2: Suggestion Box */}
              <div className="p-4 border rounded-2xl bg-slate-50 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="bg-sky-100 text-sky-800 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded">Feedback</span>
                  <h4 className="font-display font-bold text-sm text-slate-800 mt-2">Anonymous Campus Suggestion Box</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Submit anonymous academic or facility suggestions directly to school administration.</p>
                </div>
                <form onSubmit={handleAddSuggestion} className="space-y-2">
                  <input
                    required
                    type="text"
                    value={newSuggestion.title}
                    onChange={(e) => setNewSuggestion({ ...newSuggestion, title: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border bg-white"
                    placeholder="Brief Title..."
                  />
                  <input
                    required
                    type="text"
                    value={newSuggestion.content}
                    onChange={(e) => setNewSuggestion({ ...newSuggestion, content: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border bg-white"
                    placeholder="Enter suggestion detail..."
                  />
                  <button type="submit" className="w-full bg-sky-900 text-white font-bold p-2 rounded-lg text-xs">
                    Drop Suggestion
                  </button>
                </form>
              </div>

              {/* Card 3: Alumni Association */}
              <div className="p-4 border rounded-2xl bg-slate-50 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="bg-sky-100 text-sky-800 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded">Network</span>
                  <h4 className="font-display font-bold text-sm text-slate-800 mt-2">MHC Alumni Association</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Connect with over 4,000 global graduates, give back to our scholarship fund, and trace historic yearbook year milestones.</p>
                </div>
                <div className="space-y-1 bg-white border p-3 rounded-xl text-[11px] space-y-1 font-light">
                  <p>🎓 <strong>Alumni Fund Drive:</strong> $12,450 raised for under-privileged student tuitions.</p>
                  <p>📍 <strong>Next Alumni Meet:</strong> Bushrod Campus study hall, Dec 15.</p>
                </div>
                <button onClick={() => alert("Redirecting to Alumni Directory Association Page.")} className="w-full bg-sky-900 text-white font-bold p-2.5 rounded-xl text-xs">
                  Access Alumni Network
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
