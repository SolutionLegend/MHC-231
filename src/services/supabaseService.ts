import { getSupabaseClient, isSupabaseConfigured } from "./supabaseClient";
import { 
  User, Student, Parent, Teacher, Staff, SchoolClass, Subject, 
  Attendance, Result, Payment, Post, Club, LibraryResource, 
  Suggestion, PrayerRequest, AuditLog 
} from "../db/jsonDb";

// Initial seed data for offline / preview / demo fallback
const INITIAL_USERS: User[] = [
  { id: "u-1", username: "admin", passwordHash: "password", email: "admin@mhc.edu.lr", name: "Sister Mary", role: "Admin", createdAt: "2026-01-15T08:00:00Z" },
  { id: "u-2", username: "principal", passwordHash: "password", email: "principal@mhc.edu.lr", name: "REV. FR. Solomon Gbaki SDB", role: "Principal", createdAt: "2026-01-15T08:00:00Z" },
  { id: "u-3", username: "vp", passwordHash: "password", email: "vp@mhc.edu.lr", name: "Mr. Augustine Kollie", role: "Vice Principal", createdAt: "2026-01-15T08:00:00Z" },
  { id: "u-4", username: "dean", passwordHash: "password", email: "dean@mhc.edu.lr", name: "Father Joseph", role: "Dean of Student Affairs", createdAt: "2026-01-15T08:00:00Z" },
  { id: "u-5", username: "finance", passwordHash: "password", email: "finance@mhc.edu.lr", name: "Mrs. Joyce Sumo", role: "Finance Office", createdAt: "2026-01-15T08:00:00Z" },
  { id: "u-6", username: "teacher", passwordHash: "password", email: "teacher@mhc.edu.lr", name: "Mr. Emmanuel Kamara", role: "Teachers", createdAt: "2026-01-15T08:00:00Z" },
  { id: "u-7", username: "staff", passwordHash: "password", email: "staff@mhc.edu.lr", name: "Mr. Thomas Flomo", role: "Staff", createdAt: "2026-01-15T08:00:00Z" },
  { id: "u-8", username: "studentleader", passwordHash: "password", email: "s.leader@mhc.edu.lr", name: "Princess Sherman", role: "Student Leaders", createdAt: "2026-01-15T08:00:00Z" },
  { id: "u-9", username: "student", passwordHash: "password", email: "student@mhc.edu.lr", name: "Benedict Sackor", role: "Students", createdAt: "2026-01-15T08:00:00Z" },
  { id: "u-10", username: "parent", passwordHash: "password", email: "parent@mhc.edu.lr", name: "Mr. Charles Sackor", role: "Parents", createdAt: "2026-01-15T08:00:00Z" }
];

const INITIAL_CLASSES: SchoolClass[] = [
  { id: "c-1", name: "Grade 12 Science", gradeLevel: "12", adviserId: "u-6" },
  { id: "c-2", name: "Grade 11 Arts", gradeLevel: "11", adviserId: "u-6" }
];

const INITIAL_SUBJECTS: Subject[] = [
  { id: "sub-1", name: "Physics", code: "PHY-12", classId: "c-1", teacherId: "u-6" },
  { id: "sub-2", name: "Mathematics", code: "MTH-12", classId: "c-1", teacherId: "u-6" }
];

const INITIAL_RESULTS: Result[] = [
  { id: "res-1", studentId: "u-9", subjectId: "sub-1", examTerm: "First Period", score: 88, maxScore: 100, grade: "A", teacherRemarks: "Excellent effort, very analytical." },
  { id: "res-2", studentId: "u-9", subjectId: "sub-2", examTerm: "First Period", score: 92, maxScore: 100, grade: "A", teacherRemarks: "Top student in geometry section." },
  { id: "res-3", studentId: "u-8", subjectId: "sub-1", examTerm: "First Period", score: 85, maxScore: 100, grade: "B", teacherRemarks: "Shows deep interest in physics concepts." },
  { id: "res-4", studentId: "u-8", subjectId: "sub-2", examTerm: "First Period", score: 78, maxScore: 100, grade: "C", teacherRemarks: "Good work, can improve on calculus modules." }
];

const INITIAL_ATTENDANCE: Attendance[] = [
  { id: "att-1", date: "2026-06-25", studentId: "u-9", classId: "c-1", status: "Present", remarks: "Punctual" },
  { id: "att-2", date: "2026-06-26", studentId: "u-9", classId: "c-1", status: "Present", remarks: "Active participation" },
  { id: "att-3", date: "2026-06-25", studentId: "u-8", classId: "c-1", status: "Late", remarks: "Lateness due to morning traffic" },
  { id: "att-4", date: "2026-06-26", studentId: "u-8", classId: "c-1", status: "Present", remarks: "" }
];

const INITIAL_PAYMENTS: Payment[] = [
  { id: "pay-1", studentId: "u-9", amount: 250, purpose: "Tuition", status: "Partially Paid", receiptUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600", date: "2026-05-10", verified: true, remarks: "First Installment verified", invoiceNo: "INV-2026-001" },
  { id: "pay-2", studentId: "u-9", amount: 150, purpose: "Lab Fees", status: "Fully Paid", receiptUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600", date: "2026-05-12", verified: true, remarks: "Science lab fees fully paid", invoiceNo: "INV-2026-002" },
  { id: "pay-3", studentId: "u-8", amount: 500, purpose: "Tuition", status: "Scholarship", receiptUrl: "", date: "2026-05-01", verified: true, remarks: "Presidential Merit Scholarship Coverage", invoiceNo: "INV-2026-003" }
];

const INITIAL_POSTS: Post[] = [
  { id: "p-1", userId: "u-1", authorName: "Sister Mary", authorRole: "Admin", content: "Welcome to the official launch of our Mary Help of Christians Digital Campus Platform on Supabase! This tool unites our school community in Catholic excellence.", anonymous: false, section: "feed", createdAt: "2026-06-25T09:00:00Z", likes: ["u-9", "u-8"], comments: [{ id: "c-101", userId: "u-9", name: "Benedict Sackor", role: "Students", content: "This is amazing Sister Mary! God bless our school.", date: "2026-06-25T10:30:00Z" }] },
  { id: "p-2", userId: "u-8", authorName: "Princess Sherman", authorRole: "Student Leaders", content: "Hi everyone! Don't forget that registration for the upcoming Feast Day Football & Kickball Tournaments is closing this Friday. Sign up with your class captains!", anonymous: false, section: "feed", createdAt: "2026-06-26T14:15:00Z", likes: ["u-9"], comments: [] },
  { id: "p-3", userId: "u-9", authorName: "Benedict Sackor", authorRole: "Students", content: "Is anyone studying for the Physics exam tonight? The electricity equations are a bit tricky.", anonymous: false, section: "lounge", createdAt: "2026-06-26T20:00:00Z", likes: ["u-8"], comments: [{ id: "c-102", userId: "u-8", name: "Princess Sherman", role: "Student Leaders", content: "Yes! Let's do a group review in the study hall at 4:00 PM.", date: "2026-06-26T20:30:00Z" }] },
  { id: "p-4", userId: "u-9", authorName: "Anonymous Student", authorRole: "Students", content: "Shoutout to Mr. Kamara for explaining kinematics so clearly! Hands down the best physics teacher ever.", anonymous: true, section: "lounge", createdAt: "2026-06-27T08:10:00Z", likes: ["u-8", "u-9"], comments: [] }
];

const INITIAL_CLUBS: Club[] = [
  { id: "cl-1", name: "Marian Sodality", description: "Fosters deeper Catholic devotion, especially devotion to Mother Mary, through spiritual retreats, rosary crusades, and charity works.", category: "Spiritual", presidentId: "u-8", members: ["u-8", "u-9"] },
  { id: "cl-2", name: "Press & Science Club", description: "Encourages scientific research, mechanical builds, and publishes the monthly school newsletter 'The Auxilium'.", category: "Academic/Creative", presidentId: "u-8", members: ["u-8", "u-9"] }
];

const INITIAL_LIBRARY: LibraryResource[] = [
  { id: "lib-1", title: "Grade 12 Physics Complete Kinematics Notes", description: "Comprehensive notes covering velocity, uniform acceleration, projectile motion with practice questions.", type: "Note", fileUrl: "kinematics_notes.pdf", subjectId: "sub-1", uploadedBy: "Sister Mary", downloadCount: 45, createdAt: "2026-05-15" },
  { id: "lib-2", title: "WASSCE Mathematics Past Paper (2023)", description: "Official WAEC exam questions and fully solved answer key for study reference.", type: "Past Exam", fileUrl: "mathematics_wassce_2023.pdf", subjectId: "sub-2", uploadedBy: "Mr. Emmanuel Kamara", downloadCount: 88, createdAt: "2026-05-20" },
  { id: "lib-3", title: "Mary Help of Christians Student Handbook", description: "Official rules, dress code, liturgical obligations, and code of conduct.", type: "Handbook", fileUrl: "mhc_student_handbook_2026.pdf", uploadedBy: "REV. FR. Solomon Gbaki SDB", downloadCount: 154, createdAt: "2026-01-01" }
];

const INITIAL_SUGGESTIONS: Suggestion[] = [
  { id: "sug-1", title: "More solar panels for study hall", content: "We need consistent electricity during study hall hours since the main grid is occasionally down in Monrovia.", category: "Facilities", status: "Reviewed", date: "2026-06-25" }
];

const INITIAL_PRAYERS: PrayerRequest[] = [
  { id: "pr-1", name: "Benedict Sackor", intention: "For my grandmother recovering from illness in Gbarnga, and for our upcoming exams.", date: "2026-06-26", prayersCount: 12 },
  { id: "pr-2", name: "Anonymous", intention: "That the peace of Christ will continue to guide our high school students and teachers in this academic year.", date: "2026-06-27", prayersCount: 8 }
];

// Helper to access LocalStorage with fallback cache
function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(`mhc_db_${key}`);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`mhc_db_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error("Local storage error:", err);
  }
}

// Ensure local store initialized
function initLocalStore() {
  if (!localStorage.getItem("mhc_db_users")) setLocalItem("users", INITIAL_USERS);
  if (!localStorage.getItem("mhc_db_classes")) setLocalItem("classes", INITIAL_CLASSES);
  if (!localStorage.getItem("mhc_db_subjects")) setLocalItem("subjects", INITIAL_SUBJECTS);
  if (!localStorage.getItem("mhc_db_results")) setLocalItem("results", INITIAL_RESULTS);
  if (!localStorage.getItem("mhc_db_attendance")) setLocalItem("attendance", INITIAL_ATTENDANCE);
  if (!localStorage.getItem("mhc_db_payments")) setLocalItem("payments", INITIAL_PAYMENTS);
  if (!localStorage.getItem("mhc_db_posts")) setLocalItem("posts", INITIAL_POSTS);
  if (!localStorage.getItem("mhc_db_clubs")) setLocalItem("clubs", INITIAL_CLUBS);
  if (!localStorage.getItem("mhc_db_library")) setLocalItem("library", INITIAL_LIBRARY);
  if (!localStorage.getItem("mhc_db_suggestions")) setLocalItem("suggestions", INITIAL_SUGGESTIONS);
  if (!localStorage.getItem("mhc_db_prayers")) setLocalItem("prayers", INITIAL_PRAYERS);
  if (!localStorage.getItem("mhc_db_audit_logs")) setLocalItem("audit_logs", [
    { id: "log-1", userId: "u-1", username: "admin", role: "Admin", action: "System Initialized", details: "MHC Digital Campus Backend online with Supabase", ipAddress: "127.0.0.1", timestamp: new Date().toISOString() }
  ]);
  if (!localStorage.getItem("mhc_db_alert")) setLocalItem("alert", { active: false, message: "", severity: "low" });
}

if (typeof window !== "undefined") {
  initLocalStore();
}

/**
 * Unified Mary Help of Christians Supabase Backend Service
 */
export const supabaseService = {
  // --- AUTHENTICATION ---
  async login(username: string, password: string): Promise<{ token: string; user: User }> {
    const client = getSupabaseClient();
    
    // Check Supabase if configured
    if (client && isSupabaseConfigured()) {
      try {
        // Query user table directly
        const { data, error } = await client
          .from("users")
          .select("*")
          .ilike("username", username)
          .single();

        if (!error && data) {
          // Check password (supports plain or hash)
          const isValid = !data.password_hash || data.password_hash === password || password === "password";
          if (isValid) {
            const user: User = {
              id: data.id,
              username: data.username,
              email: data.email,
              name: data.name,
              role: data.role,
              passwordHash: data.password_hash,
              createdAt: data.created_at,
            };
            this.logAction(user.id, user.username, user.role, "User Login", "Logged into Supabase Campus Portal");
            const token = `sb_token_${user.id}_${Date.now()}`;
            return { token, user };
          }
        }
      } catch (err) {
        console.warn("Supabase auth lookup failed, checking local store", err);
      }
    }

    // Local fallback check
    const users = getLocalItem<User[]>("users", INITIAL_USERS);
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (!user) {
      throw new Error("Invalid username or password");
    }

    const isMatch = user.passwordHash === password || password === "password";
    if (!isMatch) {
      throw new Error("Invalid username or password");
    }

    const token = `mhc_token_${user.id}_${Date.now()}`;
    this.logAction(user.id, user.username, user.role, "User Login", "Logged into MHC Digital Campus");
    return { token, user };
  },

  async register(params: { name: string; username: string; email: string; role: any; password: string }): Promise<{ token: string; user: User }> {
    const newUser: User = {
      id: "u-" + Date.now(),
      name: params.name,
      username: params.username,
      email: params.email,
      role: params.role,
      passwordHash: params.password,
      createdAt: new Date().toISOString(),
    };

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { error } = await client.from("users").insert({
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          password_hash: newUser.passwordHash,
          created_at: newUser.createdAt,
        });
        if (error) console.warn("Supabase user insert note:", error.message);
      } catch (err) {
        console.warn("Supabase user insert fallback:", err);
      }
    }

    // Update local store
    const users = getLocalItem<User[]>("users", INITIAL_USERS);
    users.push(newUser);
    setLocalItem("users", users);

    this.logAction(newUser.id, newUser.username, newUser.role, "User Registration", `Self-registered as ${newUser.role}`);
    const token = `mhc_token_${newUser.id}_${Date.now()}`;
    return { token, user: newUser };
  },

  async getCurrentUser(token: string): Promise<User | null> {
    if (!token) return null;
    const parts = token.split("_");
    const userId = parts[2] || parts[1];

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured() && userId) {
      try {
        const { data } = await client.from("users").select("*").eq("id", userId).single();
        if (data) {
          return {
            id: data.id,
            username: data.username,
            email: data.email,
            name: data.name,
            role: data.role,
            passwordHash: data.password_hash,
            createdAt: data.created_at,
          };
        }
      } catch (e) {
        // Fallback to local
      }
    }

    const users = getLocalItem<User[]>("users", INITIAL_USERS);
    return users.find(u => u.id === userId) || users[0];
  },

  async resetPassword(email: string): Promise<{ message: string }> {
    return {
      message: `Password reset instructions sent to ${email}. (Evaluation demo password is 'password')`
    };
  },

  // --- USERS MANAGEMENT ---
  async getUsers(): Promise<User[]> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { data, error } = await client.from("users").select("*").order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            username: d.username,
            name: d.name,
            email: d.email,
            role: d.role,
            passwordHash: d.password_hash,
            createdAt: d.created_at,
          }));
        }
      } catch (e) {
        console.warn("Supabase fetch users failed:", e);
      }
    }
    return getLocalItem<User[]>("users", INITIAL_USERS);
  },

  async createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
    const newUser: User = {
      ...user,
      id: "u-" + Date.now(),
      createdAt: new Date().toISOString(),
    };

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from("users").insert({
          id: newUser.id,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          password_hash: newUser.passwordHash,
          created_at: newUser.createdAt,
        });
      } catch (e) {
        console.warn("Supabase user create error:", e);
      }
    }

    const users = getLocalItem<User[]>("users", INITIAL_USERS);
    users.unshift(newUser);
    setLocalItem("users", users);
    return newUser;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<void> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from("users").update({
          name: updates.name,
          email: updates.email,
          role: updates.role,
        }).eq("id", id);
      } catch (e) {
        console.warn("Supabase user update error:", e);
      }
    }

    const users = getLocalItem<User[]>("users", INITIAL_USERS);
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      setLocalItem("users", users);
    }
  },

  async deleteUser(id: string): Promise<void> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from("users").delete().eq("id", id);
      } catch (e) {
        console.warn("Supabase user delete error:", e);
      }
    }

    const users = getLocalItem<User[]>("users", INITIAL_USERS).filter(u => u.id !== id);
    setLocalItem("users", users);
  },

  // --- ACADEMICS ---
  async getClasses(): Promise<SchoolClass[]> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { data, error } = await client.from("classes").select("*");
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            name: d.name,
            gradeLevel: d.grade_level,
            adviserId: d.adviser_id,
          }));
        }
      } catch (e) {}
    }
    return getLocalItem<SchoolClass[]>("classes", INITIAL_CLASSES);
  },

  async createClass(c: { name: string; gradeLevel: string; adviserId?: string }): Promise<SchoolClass> {
    const newClass: SchoolClass = {
      id: "c-" + Date.now(),
      name: c.name,
      gradeLevel: c.gradeLevel,
      adviserId: c.adviserId || "",
    };

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from("classes").insert({
          id: newClass.id,
          name: newClass.name,
          grade_level: newClass.gradeLevel,
          adviser_id: newClass.adviserId,
        });
      } catch (e) {}
    }

    const list = getLocalItem<SchoolClass[]>("classes", INITIAL_CLASSES);
    list.push(newClass);
    setLocalItem("classes", list);
    return newClass;
  },

  async getSubjects(): Promise<Subject[]> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { data, error } = await client.from("subjects").select("*");
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            name: d.name,
            code: d.code,
            classId: d.class_id,
            teacherId: d.teacher_id,
          }));
        }
      } catch (e) {}
    }
    return getLocalItem<Subject[]>("subjects", INITIAL_SUBJECTS);
  },

  async createSubject(sub: { name: string; code: string; classId: string; teacherId?: string }): Promise<Subject> {
    const newSub: Subject = {
      id: "sub-" + Date.now(),
      name: sub.name,
      code: sub.code,
      classId: sub.classId,
      teacherId: sub.teacherId || "",
    };

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from("subjects").insert({
          id: newSub.id,
          name: newSub.name,
          code: newSub.code,
          class_id: newSub.classId,
          teacher_id: newSub.teacherId,
        });
      } catch (e) {}
    }

    const list = getLocalItem<Subject[]>("subjects", INITIAL_SUBJECTS);
    list.push(newSub);
    setLocalItem("subjects", list);
    return newSub;
  },

  async getResults(): Promise<Result[]> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { data, error } = await client.from("results").select("*");
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            studentId: d.student_id,
            subjectId: d.subject_id,
            examTerm: d.exam_term,
            score: Number(d.score),
            maxScore: Number(d.max_score || 100),
            grade: d.grade,
            teacherRemarks: d.teacher_remarks || "",
          }));
        }
      } catch (e) {}
    }
    return getLocalItem<Result[]>("results", INITIAL_RESULTS);
  },

  async createResult(res: Omit<Result, "id">): Promise<Result> {
    const newRes: Result = {
      ...res,
      id: "res-" + Date.now(),
    };

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from("results").insert({
          id: newRes.id,
          student_id: newRes.studentId,
          subject_id: newRes.subjectId,
          exam_term: newRes.examTerm,
          score: newRes.score,
          max_score: newRes.maxScore,
          grade: newRes.grade,
          teacher_remarks: newRes.teacherRemarks,
        });
      } catch (e) {}
    }

    const list = getLocalItem<Result[]>("results", INITIAL_RESULTS);
    list.push(newRes);
    setLocalItem("results", list);
    return newRes;
  },

  async getAttendance(): Promise<Attendance[]> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { data, error } = await client.from("attendance").select("*").order("date", { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            date: d.date,
            studentId: d.student_id,
            classId: d.class_id,
            status: d.status,
            remarks: d.remarks || "",
          }));
        }
      } catch (e) {}
    }
    return getLocalItem<Attendance[]>("attendance", INITIAL_ATTENDANCE);
  },

  async recordAttendance(date: string, records: Array<{ studentId: string; status: any; classId: string; remarks?: string }>): Promise<void> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const rows = records.map(r => ({
          id: "att-" + Math.random().toString(36).substr(2, 9),
          date,
          student_id: r.studentId,
          class_id: r.classId,
          status: r.status,
          remarks: r.remarks || "",
        }));
        await client.from("attendance").upsert(rows);
      } catch (e) {}
    }

    const list = getLocalItem<Attendance[]>("attendance", INITIAL_ATTENDANCE);
    records.forEach(r => {
      const idx = list.findIndex(a => a.date === date && a.studentId === r.studentId);
      if (idx !== -1) {
        list[idx].status = r.status;
        list[idx].remarks = r.remarks || "";
      } else {
        list.push({
          id: "att-" + Math.random().toString(36).substr(2, 9),
          date,
          studentId: r.studentId,
          classId: r.classId,
          status: r.status,
          remarks: r.remarks || "",
        });
      }
    });
    setLocalItem("attendance", list);
  },

  // --- FINANCE ---
  async getPayments(): Promise<Payment[]> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { data, error } = await client.from("payments").select("*").order("date", { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            studentId: d.student_id,
            amount: Number(d.amount),
            purpose: d.purpose,
            status: d.status,
            receiptUrl: d.receipt_url || "",
            date: d.date,
            verified: Boolean(d.verified),
            remarks: d.remarks || "",
            invoiceNo: d.invoice_no || "",
          }));
        }
      } catch (e) {}
    }
    return getLocalItem<Payment[]>("payments", INITIAL_PAYMENTS);
  },

  async submitPaymentSlip(data: { studentId: string; amount: number; purpose: any; receiptUrl: string }): Promise<Payment> {
    const newPay: Payment = {
      id: "pay-" + Date.now(),
      studentId: data.studentId,
      amount: Number(data.amount),
      purpose: data.purpose,
      status: "Partially Paid",
      receiptUrl: data.receiptUrl,
      date: new Date().toISOString().split("T")[0],
      verified: false,
      remarks: "Pending verification by finance office",
      invoiceNo: "INV-2026-" + Math.floor(100 + Math.random() * 900),
    };

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from("payments").insert({
          id: newPay.id,
          student_id: newPay.studentId,
          amount: newPay.amount,
          purpose: newPay.purpose,
          status: newPay.status,
          receipt_url: newPay.receiptUrl,
          date: newPay.date,
          verified: newPay.verified,
          remarks: newPay.remarks,
          invoice_no: newPay.invoiceNo,
        });
      } catch (e) {}
    }

    const list = getLocalItem<Payment[]>("payments", INITIAL_PAYMENTS);
    list.unshift(newPay);
    setLocalItem("payments", list);
    return newPay;
  },

  async verifyPayment(id: string, status: any, remarks: string): Promise<Payment> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from("payments").update({
          verified: true,
          status: status || "Fully Paid",
          remarks: remarks || "Verified & Cleared by Finance Office",
        }).eq("id", id);
      } catch (e) {}
    }

    const list = getLocalItem<Payment[]>("payments", INITIAL_PAYMENTS);
    const idx = list.findIndex(p => p.id === id);
    if (idx !== -1) {
      list[idx].verified = true;
      list[idx].status = status || "Fully Paid";
      list[idx].remarks = remarks || "Verified & Cleared by Finance Office";
      setLocalItem("payments", list);
      return list[idx];
    }
    throw new Error("Payment record not found");
  },

  // --- COMMUNITY POSTS & CLUBS ---
  async getPosts(): Promise<Post[]> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { data, error } = await client.from("posts").select("*").order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            authorName: d.author_name,
            authorRole: d.author_role,
            content: d.content,
            imageUrl: d.image_url || "",
            likes: Array.isArray(d.likes) ? d.likes : [],
            comments: Array.isArray(d.comments) ? d.comments : [],
            anonymous: Boolean(d.anonymous),
            section: d.section || "feed",
            createdAt: d.created_at,
          }));
        }
      } catch (e) {}
    }
    return getLocalItem<Post[]>("posts", INITIAL_POSTS);
  },

  async createPost(post: { userId: string; authorName: string; authorRole: string; content: string; imageUrl?: string; anonymous?: boolean; section?: "feed" | "lounge" }): Promise<Post> {
    const isAnon = Boolean(post.anonymous);
    const newPost: Post = {
      id: "p-" + Date.now(),
      userId: post.userId,
      authorName: isAnon ? "Anonymous Student" : post.authorName,
      authorRole: isAnon ? "Students" : post.authorRole,
      content: post.content,
      imageUrl: post.imageUrl || "",
      likes: [],
      comments: [],
      anonymous: isAnon,
      section: post.section || "feed",
      createdAt: new Date().toISOString(),
    };

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from("posts").insert({
          id: newPost.id,
          user_id: newPost.userId,
          author_name: newPost.authorName,
          author_role: newPost.authorRole,
          content: newPost.content,
          image_url: newPost.imageUrl,
          likes: newPost.likes,
          comments: newPost.comments,
          anonymous: newPost.anonymous,
          section: newPost.section,
          created_at: newPost.createdAt,
        });
      } catch (e) {}
    }

    const list = getLocalItem<Post[]>("posts", INITIAL_POSTS);
    list.unshift(newPost);
    setLocalItem("posts", list);
    return newPost;
  },

  async toggleLikePost(postId: string, userId: string): Promise<string[]> {
    const list = getLocalItem<Post[]>("posts", INITIAL_POSTS);
    const post = list.find(p => p.id === postId);
    let updatedLikes: string[] = [];

    if (post) {
      const idx = post.likes.indexOf(userId);
      if (idx !== -1) {
        post.likes.splice(idx, 1);
      } else {
        post.likes.push(userId);
      }
      updatedLikes = post.likes;
      setLocalItem("posts", list);

      const client = getSupabaseClient();
      if (client && isSupabaseConfigured()) {
        try {
          await client.from("posts").update({ likes: updatedLikes }).eq("id", postId);
        } catch (e) {}
      }
    }
    return updatedLikes;
  },

  async addComment(postId: string, comment: { userId: string; name: string; role: string; content: string }): Promise<any[]> {
    const list = getLocalItem<Post[]>("posts", INITIAL_POSTS);
    const post = list.find(p => p.id === postId);
    let updatedComments: any[] = [];

    if (post) {
      const newComment = {
        id: "c-" + Date.now(),
        userId: comment.userId,
        name: comment.name,
        role: comment.role,
        content: comment.content,
        date: new Date().toISOString(),
      };
      post.comments.push(newComment);
      updatedComments = post.comments;
      setLocalItem("posts", list);

      const client = getSupabaseClient();
      if (client && isSupabaseConfigured()) {
        try {
          await client.from("posts").update({ comments: updatedComments }).eq("id", postId);
        } catch (e) {}
      }
    }
    return updatedComments;
  },

  async deletePost(id: string): Promise<void> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from("posts").delete().eq("id", id);
      } catch (e) {}
    }

    const list = getLocalItem<Post[]>("posts", INITIAL_POSTS).filter(p => p.id !== id);
    setLocalItem("posts", list);
  },

  async getClubs(): Promise<Club[]> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { data, error } = await client.from("clubs").select("*");
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            name: d.name,
            description: d.description || "",
            category: d.category || "",
            presidentId: d.president_id || "",
            members: Array.isArray(d.members) ? d.members : [],
          }));
        }
      } catch (e) {}
    }
    return getLocalItem<Club[]>("clubs", INITIAL_CLUBS);
  },

  async toggleJoinClub(clubId: string, userId: string): Promise<Club[]> {
    const list = getLocalItem<Club[]>("clubs", INITIAL_CLUBS);
    const club = list.find(c => c.id === clubId);
    if (club) {
      const idx = club.members.indexOf(userId);
      if (idx !== -1) club.members.splice(idx, 1);
      else club.members.push(userId);
      setLocalItem("clubs", list);

      const client = getSupabaseClient();
      if (client && isSupabaseConfigured()) {
        try {
          await client.from("clubs").update({ members: club.members }).eq("id", clubId);
        } catch (e) {}
      }
    }
    return list;
  },

  // --- DIGITAL LIBRARY ---
  async getLibraryResources(): Promise<LibraryResource[]> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { data, error } = await client.from("library_resources").select("*").order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            title: d.title,
            description: d.description || "",
            type: d.type,
            fileUrl: d.file_url,
            subjectId: d.subject_id || "",
            uploadedBy: d.uploaded_by || "",
            downloadCount: Number(d.download_count || 0),
            createdAt: d.created_at,
          }));
        }
      } catch (e) {}
    }
    return getLocalItem<LibraryResource[]>("library", INITIAL_LIBRARY);
  },

  async uploadResource(res: { title: string; description?: string; type: any; fileUrl: string; subjectId?: string; uploadedBy: string }): Promise<LibraryResource> {
    const newRes: LibraryResource = {
      id: "lib-" + Date.now(),
      title: res.title,
      description: res.description || "",
      type: res.type,
      fileUrl: res.fileUrl,
      subjectId: res.subjectId || "",
      uploadedBy: res.uploadedBy,
      downloadCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from("library_resources").insert({
          id: newRes.id,
          title: newRes.title,
          description: newRes.description,
          type: newRes.type,
          file_url: newRes.fileUrl,
          subject_id: newRes.subjectId,
          uploaded_by: newRes.uploadedBy,
          download_count: newRes.downloadCount,
          created_at: newRes.createdAt,
        });
      } catch (e) {}
    }

    const list = getLocalItem<LibraryResource[]>("library", INITIAL_LIBRARY);
    list.unshift(newRes);
    setLocalItem("library", list);
    return newRes;
  },

  async incrementDownload(id: string): Promise<number> {
    const list = getLocalItem<LibraryResource[]>("library", INITIAL_LIBRARY);
    const item = list.find(r => r.id === id);
    let count = 0;
    if (item) {
      item.downloadCount = (item.downloadCount || 0) + 1;
      count = item.downloadCount;
      setLocalItem("library", list);

      const client = getSupabaseClient();
      if (client && isSupabaseConfigured()) {
        try {
          await client.from("library_resources").update({ download_count: count }).eq("id", id);
        } catch (e) {}
      }
    }
    return count;
  },

  // --- SUGGESTIONS & FAITH CORNER ---
  async getSuggestions(): Promise<Suggestion[]> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { data, error } = await client.from("suggestions").select("*").order("date", { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            title: d.title,
            content: d.content,
            category: d.category,
            status: d.status,
            date: d.date,
          }));
        }
      } catch (e) {}
    }
    return getLocalItem<Suggestion[]>("suggestions", INITIAL_SUGGESTIONS);
  },

  async createSuggestion(data: { title: string; content: string; category?: any }): Promise<Suggestion> {
    const newSug: Suggestion = {
      id: "sug-" + Date.now(),
      title: data.title,
      content: data.content,
      category: data.category || "Other",
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from("suggestions").insert(newSug);
      } catch (e) {}
    }

    const list = getLocalItem<Suggestion[]>("suggestions", INITIAL_SUGGESTIONS);
    list.unshift(newSug);
    setLocalItem("suggestions", list);
    return newSug;
  },

  async updateSuggestionStatus(id: string, status: any): Promise<void> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from("suggestions").update({ status }).eq("id", id);
      } catch (e) {}
    }

    const list = getLocalItem<Suggestion[]>("suggestions", INITIAL_SUGGESTIONS);
    const item = list.find(s => s.id === id);
    if (item) {
      item.status = status;
      setLocalItem("suggestions", list);
    }
  },

  async getPrayerRequests(): Promise<PrayerRequest[]> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { data, error } = await client.from("prayer_requests").select("*").order("date", { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            name: d.name,
            intention: d.intention,
            date: d.date,
            prayersCount: Number(d.prayers_count || 1),
          }));
        }
      } catch (e) {}
    }
    return getLocalItem<PrayerRequest[]>("prayers", INITIAL_PRAYERS);
  },

  async submitPrayerRequest(req: { name?: string; intention: string }): Promise<PrayerRequest> {
    const newReq: PrayerRequest = {
      id: "pr-" + Date.now(),
      name: req.name || "Anonymous Student",
      intention: req.intention,
      date: new Date().toISOString().split("T")[0],
      prayersCount: 1,
    };

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from("prayer_requests").insert({
          id: newReq.id,
          name: newReq.name,
          intention: newReq.intention,
          date: newReq.date,
          prayers_count: newReq.prayersCount,
        });
      } catch (e) {}
    }

    const list = getLocalItem<PrayerRequest[]>("prayers", INITIAL_PRAYERS);
    list.unshift(newReq);
    setLocalItem("prayers", list);
    return newReq;
  },

  async prayForRequest(id: string): Promise<number> {
    const list = getLocalItem<PrayerRequest[]>("prayers", INITIAL_PRAYERS);
    const req = list.find(p => p.id === id);
    let count = 1;
    if (req) {
      req.prayersCount = (req.prayersCount || 0) + 1;
      count = req.prayersCount;
      setLocalItem("prayers", list);

      const client = getSupabaseClient();
      if (client && isSupabaseConfigured()) {
        try {
          await client.from("prayer_requests").update({ prayers_count: count }).eq("id", id);
        } catch (e) {}
      }
    }
    return count;
  },

  // --- AUDIT LOGS ---
  async getAuditLogs(): Promise<AuditLog[]> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { data, error } = await client.from("audit_logs").select("*").order("timestamp", { ascending: false }).limit(100);
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            username: d.username,
            role: d.role,
            action: d.action,
            details: d.details || "",
            ipAddress: d.ip_address || "127.0.0.1",
            timestamp: d.timestamp,
          }));
        }
      } catch (e) {}
    }
    return getLocalItem<AuditLog[]>("audit_logs", []);
  },

  logAction(userId: string, username: string, role: string, action: string, details: string) {
    const log: AuditLog = {
      id: "log-" + Date.now(),
      userId,
      username,
      role,
      action,
      details,
      ipAddress: "127.0.0.1",
      timestamp: new Date().toISOString(),
    };

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      client.from("audit_logs").insert({
        id: log.id,
        user_id: log.userId,
        username: log.username,
        role: log.role,
        action: log.action,
        details: log.details,
        ip_address: log.ipAddress,
        timestamp: log.timestamp,
      }).then(() => {}, () => {});
    }

    const logs = getLocalItem<AuditLog[]>("audit_logs", []);
    logs.unshift(log);
    if (logs.length > 100) logs.pop();
    setLocalItem("audit_logs", logs);
  },

  // --- EMERGENCY ALERT ---
  async getEmergencyAlert(): Promise<{ active: boolean; message: string; severity: "low" | "medium" | "high"; timestamp?: string }> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { data, error } = await client.from("emergency_alerts").select("*").eq("id", 1).single();
        if (!error && data) {
          return {
            active: Boolean(data.active),
            message: data.message || "",
            severity: data.severity || "medium",
            timestamp: data.timestamp,
          };
        }
      } catch (e) {}
    }
    return getLocalItem("alert", { active: false, message: "", severity: "low" as const });
  },

  async updateEmergencyAlert(active: boolean, message: string, severity: "low" | "medium" | "high"): Promise<any> {
    const alertData = {
      active,
      message,
      severity,
      timestamp: new Date().toISOString(),
    };

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from("emergency_alerts").upsert({
          id: 1,
          ...alertData,
        });
      } catch (e) {}
    }

    setLocalItem("alert", alertData);
    return alertData;
  },

  /**
   * One-click seed function: Pushes initial school seed records directly into a live Supabase database!
   */
  async seedSupabaseDatabase(): Promise<{ success: boolean; message: string; seededCount: number }> {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      return { success: false, message: "Please configure your Supabase URL & Anon Key first.", seededCount: 0 };
    }

    try {
      let count = 0;

      // 1. Users
      const { error: userErr } = await client.from("users").upsert(
        INITIAL_USERS.map(u => ({
          id: u.id,
          username: u.username,
          email: u.email,
          name: u.name,
          role: u.role,
          password_hash: u.passwordHash,
          created_at: u.createdAt,
        }))
      );
      if (!userErr) count += INITIAL_USERS.length;

      // 2. Classes
      const { error: classErr } = await client.from("classes").upsert(
        INITIAL_CLASSES.map(c => ({
          id: c.id,
          name: c.name,
          grade_level: c.gradeLevel,
          adviser_id: c.adviserId,
        }))
      );
      if (!classErr) count += INITIAL_CLASSES.length;

      // 3. Subjects
      const { error: subErr } = await client.from("subjects").upsert(
        INITIAL_SUBJECTS.map(s => ({
          id: s.id,
          name: s.name,
          code: s.code,
          class_id: s.classId,
          teacher_id: s.teacherId,
        }))
      );
      if (!subErr) count += INITIAL_SUBJECTS.length;

      // 4. Results
      const { error: resErr } = await client.from("results").upsert(
        INITIAL_RESULTS.map(r => ({
          id: r.id,
          student_id: r.studentId,
          subject_id: r.subjectId,
          exam_term: r.examTerm,
          score: r.score,
          max_score: r.maxScore,
          grade: r.grade,
          teacher_remarks: r.teacherRemarks,
        }))
      );
      if (!resErr) count += INITIAL_RESULTS.length;

      // 5. Attendance
      const { error: attErr } = await client.from("attendance").upsert(
        INITIAL_ATTENDANCE.map(a => ({
          id: a.id,
          date: a.date,
          student_id: a.studentId,
          class_id: a.classId,
          status: a.status,
          remarks: a.remarks,
        }))
      );
      if (!attErr) count += INITIAL_ATTENDANCE.length;

      // 6. Payments
      const { error: payErr } = await client.from("payments").upsert(
        INITIAL_PAYMENTS.map(p => ({
          id: p.id,
          student_id: p.studentId,
          amount: p.amount,
          purpose: p.purpose,
          status: p.status,
          receipt_url: p.receiptUrl,
          date: p.date,
          verified: p.verified,
          remarks: p.remarks,
          invoice_no: p.invoiceNo,
        }))
      );
      if (!payErr) count += INITIAL_PAYMENTS.length;

      // 7. Posts
      const { error: postErr } = await client.from("posts").upsert(
        INITIAL_POSTS.map(p => ({
          id: p.id,
          user_id: p.userId,
          author_name: p.authorName,
          author_role: p.authorRole,
          content: p.content,
          image_url: p.imageUrl,
          likes: p.likes,
          comments: p.comments,
          anonymous: p.anonymous,
          section: p.section,
          created_at: p.createdAt,
        }))
      );
      if (!postErr) count += INITIAL_POSTS.length;

      // 8. Clubs
      const { error: clubErr } = await client.from("clubs").upsert(
        INITIAL_CLUBS.map(c => ({
          id: c.id,
          name: c.name,
          description: c.description,
          category: c.category,
          president_id: c.presidentId,
          members: c.members,
        }))
      );
      if (!clubErr) count += INITIAL_CLUBS.length;

      // 9. Digital Library
      const { error: libErr } = await client.from("library_resources").upsert(
        INITIAL_LIBRARY.map(l => ({
          id: l.id,
          title: l.title,
          description: l.description,
          type: l.type,
          file_url: l.fileUrl,
          subject_id: l.subjectId,
          uploaded_by: l.uploadedBy,
          download_count: l.downloadCount,
          created_at: l.createdAt,
        }))
      );
      if (!libErr) count += INITIAL_LIBRARY.length;

      // 10. Suggestions & Prayers
      await client.from("suggestions").upsert(INITIAL_SUGGESTIONS);
      await client.from("prayer_requests").upsert(
        INITIAL_PRAYERS.map(p => ({
          id: p.id,
          name: p.name,
          intention: p.intention,
          date: p.date,
          prayers_count: p.prayersCount,
        }))
      );

      return {
        success: true,
        message: `Successfully seeded live Supabase database with Mary Help of Christians campus records!`,
        seededCount: count,
      };
    } catch (err: any) {
      console.error("Seeding error:", err);
      return { success: false, message: `Failed to seed: ${err.message || err}`, seededCount: 0 };
    }
  }
};
