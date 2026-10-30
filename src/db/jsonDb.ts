// Mary Help of Christians Campus Database Types & Data Model
const DB_STORAGE_KEY = "mhc_campus_db";

export interface User {
  id: string;
  username: string;
  passwordHash: string; // Plain-text for demo, or hashed
  email: string;
  name: string;
  role: "Admin" | "Principal" | "Vice Principal" | "Dean of Student Affairs" | "Finance Office" | "Teachers" | "Staff" | "Student Leaders" | "Students" | "Parents";
  createdAt: string;
}

export interface Student {
  userId: string;
  classId: string;
  admissionNo: string;
  status: "Active" | "Suspended" | "Alumni";
  parentId: string;
}

export interface Parent {
  userId: string;
  phone: string;
  address: string;
  childIds: string[];
}

export interface Teacher {
  userId: string;
  designation: string;
  qualifications: string;
  subjects: string[];
}

export interface Staff {
  userId: string;
  department: string;
  tasks: string[];
}

export interface SchoolClass {
  id: string;
  name: string;
  gradeLevel: string;
  adviserId: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
  teacherId: string;
}

export interface Attendance {
  id: string;
  date: string;
  studentId: string;
  classId: string;
  status: "Present" | "Absent" | "Late";
  remarks: string;
}

export interface Result {
  id: string;
  studentId: string;
  subjectId: string;
  examTerm: "First Period" | "Mid Term" | "Finals";
  score: number;
  maxScore: number;
  grade: string;
  teacherRemarks: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  purpose: "Tuition" | "Registration" | "Lab Fees" | "Graduation";
  status: "Fully Paid" | "Partially Paid" | "Unpaid" | "Scholarship";
  receiptUrl: string; // Banking slip photo/file simulation
  date: string;
  verified: boolean;
  remarks?: string;
  invoiceNo?: string;
}

export interface Comment {
  id: string;
  userId: string;
  name: string;
  role: string;
  content: string;
  date: string;
}

export interface Post {
  id: string;
  userId: string;
  authorName: string;
  authorRole: string;
  content: string;
  imageUrl?: string;
  likes: string[]; // User IDs
  comments: Comment[];
  anonymous: boolean;
  section: "feed" | "lounge";
  createdAt: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  clubId?: string;
  organizerId: string;
  type: "Academic" | "Faith" | "Sports" | "Club";
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  date: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  presidentId: string;
  members: string[]; // User IDs
}

export interface LibraryResource {
  id: string;
  title: string;
  description: string;
  type: "Note" | "PDF" | "Past Exam" | "Handbook" | "Material";
  fileUrl: string;
  subjectId?: string;
  uploadedBy: string;
  downloadCount: number;
  createdAt: string;
}

export interface Task {
  id: string;
  staffId: string;
  title: string;
  description: string;
  status: "Pending" | "Completed";
  dueDate: string;
}

export interface Suggestion {
  id: string;
  title: string;
  content: string;
  category: "Academic" | "Facilities" | "Faith" | "Student Life" | "Other";
  status: "Pending" | "Reviewed" | "Addressed";
  date: string;
}

export interface PrayerRequest {
  id: string;
  name: string; // or Anonymous
  intention: string;
  date: string;
  prayersCount: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  username: string;
  role: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface DB {
  users: User[];
  students: Student[];
  parents: Parent[];
  teachers: Teacher[];
  staff: Staff[];
  classes: SchoolClass[];
  subjects: Subject[];
  attendance: Attendance[];
  results: Result[];
  payments: Payment[];
  posts: Post[];
  events: SchoolEvent[];
  notifications: Notification[];
  clubs: Club[];
  libraryResources: LibraryResource[];
  tasks: Task[];
  suggestions: Suggestion[];
  prayerRequests: PrayerRequest[];
  auditLogs: AuditLog[];
  emergencyAlert: {
    active: boolean;
    message: string;
    severity: "low" | "medium" | "high";
    timestamp?: string;
  };
}

// Initial DB Setup
const INITIAL_DB: DB = {
  users: [
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
  ],
  students: [
    { userId: "u-9", classId: "c-1", admissionNo: "MHC-2026-048", status: "Active", parentId: "u-10" },
    { userId: "u-8", classId: "c-1", admissionNo: "MHC-2026-012", status: "Active", parentId: "" }
  ],
  parents: [
    { userId: "u-10", phone: "+231-886-555-123", address: "New Matadi, Sinkor, Monrovia, Liberia", childIds: ["u-9"] }
  ],
  teachers: [
    { userId: "u-6", designation: "Senior Mathematics & Physics Instructor", qualifications: "B.Sc. in Physics, University of Liberia", subjects: ["sub-1", "sub-2"] }
  ],
  staff: [
    { userId: "u-7", department: "Information Technology", tasks: ["Maintain school server", "Audit database backups"] }
  ],
  classes: [
    { id: "c-1", name: "Grade 12 Science", gradeLevel: "12", adviserId: "u-6" },
    { id: "c-2", name: "Grade 11 Arts", gradeLevel: "11", adviserId: "u-6" }
  ],
  subjects: [
    { id: "sub-1", name: "Physics", code: "PHY-12", classId: "c-1", teacherId: "u-6" },
    { id: "sub-2", name: "Mathematics", code: "MTH-12", classId: "c-1", teacherId: "u-6" }
  ],
  attendance: [
    { id: "att-1", date: "2026-06-25", studentId: "u-9", classId: "c-1", status: "Present", remarks: "Punctual" },
    { id: "att-2", date: "2026-06-26", studentId: "u-9", classId: "c-1", status: "Present", remarks: "Active participation" },
    { id: "att-3", date: "2026-06-25", studentId: "u-8", classId: "c-1", status: "Late", remarks: "Lateness due to morning traffic" },
    { id: "att-4", date: "2026-06-26", studentId: "u-8", classId: "c-1", status: "Present", remarks: "" }
  ],
  results: [
    { id: "res-1", studentId: "u-9", subjectId: "sub-1", examTerm: "First Period", score: 88, maxScore: 100, grade: "A", teacherRemarks: "Excellent effort, very analytical." },
    { id: "res-2", studentId: "u-9", subjectId: "sub-2", examTerm: "First Period", score: 92, maxScore: 100, grade: "A", teacherRemarks: "Top student in geometry section." },
    { id: "res-3", studentId: "u-8", subjectId: "sub-1", examTerm: "First Period", score: 85, maxScore: 100, grade: "B", teacherRemarks: "Shows deep interest in physics concepts." },
    { id: "res-4", studentId: "u-8", subjectId: "sub-2", examTerm: "First Period", score: 78, maxScore: 100, grade: "C", teacherRemarks: "Good work, can improve on calculus modules." }
  ],
  payments: [
    { id: "pay-1", studentId: "u-9", amount: 250, purpose: "Tuition", status: "Partially Paid", receiptUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600", date: "2026-05-10", verified: true, remarks: "First Installment verified", invoiceNo: "INV-2026-001" },
    { id: "pay-2", studentId: "u-9", amount: 150, purpose: "Lab Fees", status: "Fully Paid", receiptUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600", date: "2026-05-12", verified: true, remarks: "Science lab fees fully paid", invoiceNo: "INV-2026-002" },
    { id: "pay-3", studentId: "u-8", amount: 500, purpose: "Tuition", status: "Scholarship", receiptUrl: "", date: "2026-05-01", verified: true, remarks: "Presidential Merit Scholarship Coverage", invoiceNo: "INV-2026-003" }
  ],
  posts: [
    { id: "p-1", userId: "u-1", authorName: "Sister Mary", authorRole: "Admin", content: "Welcome to the official launch of our Mary Help of Christians Digital Campus Platform! This tool will revolutionize how our school coordinates, learns, and shares in Catholic unity.", anonymous: false, section: "feed", createdAt: "2026-06-25T09:00:00Z", likes: ["u-9", "u-8"], comments: [{ id: "c-101", userId: "u-9", name: "Benedict Sackor", role: "Students", content: "This is amazing Sister Mary! God bless our school.", date: "2026-06-25T10:30:00Z" }] },
    { id: "p-2", userId: "u-8", authorName: "Princess Sherman", authorRole: "Student Leaders", content: "Hi everyone! Don't forget that registration for the upcoming Feast Day Football & Kickball Tournaments is closing this Friday. Sign up with your class captains!", anonymous: false, section: "feed", createdAt: "2026-06-26T14:15:00Z", likes: ["u-9"], comments: [] },
    { id: "p-3", userId: "u-9", authorName: "Benedict Sackor", authorRole: "Students", content: "Is anyone studying for the Physics exam tonight? The electricity equations are a bit tricky.", anonymous: false, section: "lounge", createdAt: "2026-06-26T20:00:00Z", likes: ["u-8"], comments: [{ id: "c-102", userId: "u-8", name: "Princess Sherman", role: "Student Leaders", content: "Yes! Let's do a group review in the study hall at 4:00 PM.", date: "2026-06-26T20:30:00Z" }] },
    { id: "p-4", userId: "u-9", authorName: "Anonymous Student", authorRole: "Students", content: "Shoutout to Mr. Kamara for explaining kinematics so clearly! Hands down the best physics teacher ever.", anonymous: true, section: "lounge", createdAt: "2026-06-27T08:10:00Z", likes: ["u-8", "u-9"], comments: [] }
  ],
  events: [
    { id: "e-1", title: "Feast Day of Mary Help of Christians", description: "Holy Mass followed by school-wide assembly, sports festival, and shared meals.", date: "2026-05-24", organizerId: "u-1", type: "Faith" },
    { id: "e-2", title: "WASSCE Preparatory Examinations", description: "Intense mock examination series for Grade 12 students in all WAEC subject areas.", date: "2026-07-05", organizerId: "u-1", type: "Academic" },
    { id: "e-3", title: "Science Club Physics Exhibition", description: "Hands-on projects displaying electromagnetic experiments, solar energy cells, and mechanical systems.", date: "2026-07-12", clubId: "cl-2", organizerId: "u-8", type: "Club" }
  ],
  notifications: [
    { id: "n-1", userId: "u-9", title: "New Result Added", message: "Your first period examination results for Physics have been uploaded.", read: false, date: "2026-06-26T12:00:00Z" },
    { id: "n-2", userId: "u-9", title: "Fees Clearance Notice", message: "Your installment payment has been successfully verified. Thank you Mrs. Joyce Sumo.", read: true, date: "2026-06-25T15:00:00Z" }
  ],
  clubs: [
    { id: "cl-1", name: "Marian Sodality", description: "Fosters deeper Catholic devotion, especially devotion to Mother Mary, through spiritual retreats, rosary crusades, and charity works.", category: "Spiritual", presidentId: "u-8", members: ["u-8", "u-9"] },
    { id: "cl-2", name: "Press & Science Club", description: "Encourages scientific research, mechanical builds, and publishes the monthly school newsletter 'The Auxilium'.", category: "Academic/Creative", presidentId: "u-8", members: ["u-8", "u-9"] }
  ],
  libraryResources: [
    { id: "lib-1", title: "Grade 12 Physics Complete Kinematics Notes", description: "Comprehensive notes covering velocity, uniform acceleration, projectile motion with practice questions.", type: "Note", fileUrl: "kinematics_notes.pdf", subjectId: "sub-1", uploadedBy: "Sister Mary", downloadCount: 45, createdAt: "2026-05-15" },
    { id: "lib-2", title: "WASSCE Mathematics Past Paper (2023)", description: "Official WAEC exam questions and fully solved answer key for study reference.", type: "Past Exam", fileUrl: "mathematics_wassce_2023.pdf", subjectId: "sub-2", uploadedBy: "Mr. Emmanuel Kamara", downloadCount: 88, createdAt: "2026-05-20" },
    { id: "lib-3", title: "Mary Help of Christians Student Handbook", description: "Official rules, dress code, liturgical obligations, and code of conduct.", type: "Handbook", fileUrl: "mhc_student_handbook_2026.pdf", uploadedBy: "Sister Beatrice", downloadCount: 154, createdAt: "2026-01-01" }
  ],
  tasks: [
    { id: "t-1", staffId: "u-7", title: "Generate Report Card Templates", description: "Verify academic grades mapping schema for first period reports.", status: "Pending", dueDate: "2026-06-30" },
    { id: "t-2", staffId: "u-7", title: "Install router in Dean's office", description: "Upgrade physical Wi-Fi router to support administrative subnet.", status: "Completed", dueDate: "2026-06-25" }
  ],
  suggestions: [
    { id: "sug-1", title: "More solar panels for study hall", content: "We need consistent electricity during study hall hours since the main grid is occasionally down in Monrovia.", category: "Facilities", status: "Reviewed", date: "2026-06-25" }
  ],
  prayerRequests: [
    { id: "pr-1", name: "Benedict Sackor", intention: "For my grandmother recovering from illness in Gbarnga, and for our upcoming exams.", date: "2026-06-26", prayersCount: 12 },
    { id: "pr-2", name: "Anonymous", intention: "That the peace of Christ will continue to guide our high school students and teachers in this academic year.", date: "2026-06-27", prayersCount: 8 }
  ],
  auditLogs: [
    { id: "log-1", userId: "u-1", username: "admin", role: "Admin", action: "User Login", details: "Logged in from IP: 192.168.1.15", ipAddress: "192.168.1.15", timestamp: "2026-06-27T08:00:00Z" }
  ],
  emergencyAlert: {
    active: false,
    message: "",
    severity: "low"
  }
};

export class JsonDB {
  static getDB(): DB {
    if (typeof window === "undefined") return INITIAL_DB;
    try {
      const data = localStorage.getItem(DB_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(INITIAL_DB));
        return INITIAL_DB;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading campus db, returning initial db", error);
      return INITIAL_DB;
    }
  }

  static saveDB(db: DB) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
    } catch (error) {
      console.error("Error saving campus db", error);
    }
  }

  static update(updater: (db: DB) => void): DB {
    const db = this.getDB();
    updater(db);
    this.saveDB(db);
    return db;
  }
}
