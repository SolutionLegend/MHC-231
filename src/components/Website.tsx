import React, { useState } from "react";
import { BookOpen, Calendar, MapPin, Phone, Mail, Award, Clock, Users, Shield, Heart, HelpCircle, ArrowRight, Sun, Moon, Sparkles, X, ZoomIn, Trophy, CheckCircle, ExternalLink, Image as ImageIcon } from "lucide-react";
import MhcAssistant from "./MhcAssistant.tsx";
import schoolLogo from "../assets/images/mhc_official_badge.png";
import studentsTrophyPhoto from "../assets/images/students_champions_trophy.png";
import rectorRibbonPhoto from "../assets/images/rector_fr_augustine_okeke.png";
import rectorPortraitPhoto from "../assets/images/fr_okeke_director.png";
import basketballTeamPhoto from "../assets/images/basketball_team_champions.png";
import certificateAwardPhoto from "../assets/images/basketball_championship_certificate.png";

interface WebsiteProps {
  onLoginClick: () => void;
}

export default function Website({ onLoginClick }: WebsiteProps) {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<"marian" | "ordinary" | "advent" | "christmas" | "martyrs">("marian");
  const [selectedPrayer, setSelectedPrayer] = useState<string>("donbosco");
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<{
    src: string;
    title: string;
    category: string;
    description: string;
    date?: string;
    details?: string;
  } | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<string>("all");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setContactName("");
    setContactEmail("");
    setContactMsg("");
    setTimeout(() => setContactSuccess(false), 5000);
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Us" },
    { id: "history", label: "History" },
    { id: "admin", label: "Administration" },
    { id: "sports", label: "Sports & Honors" },
    { id: "gallery", label: "Campus Gallery" },
    { id: "academics", label: "Academics" },
    { id: "admissions", label: "Admissions" },
    { id: "news", label: "News & Events" },
    { id: "faith", label: "Catholic Corner" },
    { id: "assistant", label: "AI Campus Assistant" },
    { id: "contact", label: "Contact Us" },
  ];

  const stats = [
    { label: "School Type", value: "Private Catholic" },
    { label: "Founded On", value: "17 Nov 2003" },
    { label: "Ownership / Management", value: "Salesians of Don Bosco" },
    { label: "Official School Motto", value: '"To Serve God and Humanity"' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      {/* Upper Top Bar */}
      <div className="bg-sky-900 text-white text-xs py-2 px-4 sm:px-8 flex flex-wrap justify-between items-center gap-2 border-b border-sky-800">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> New Matadi Estate Drive, Sinkor, Monrovia, Liberia</span>
          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Tel: Not publicly available</span>
          <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email: Not publicly available</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-sky-800 px-2 py-0.5 rounded text-[10px] font-bold">SALESIAN SYSTEM</span>
          <span>Motto: "To Serve God and Humanity"</span>
        </div>
      </div>

      {/* Main Header Nav */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b ${darkMode ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-200"} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-yellow-500 shadow-md shrink-0">
              <img
                src={schoolLogo}
                alt="MHC Official Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="font-display font-bold text-sm sm:text-base tracking-tight text-sky-900 dark:text-sky-400">Mary Help of Christians</h1>
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Catholic High School • Liberia</p>
            </div>
          </div>

          <nav className="hidden lg:flex gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === item.id
                    ? "bg-sky-900 text-white shadow-sm"
                    : "hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-sky-900" />}
            </button>
            <button
              onClick={onLoginClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-sky-950 font-semibold px-4 py-2 rounded-full text-xs shadow-md cursor-pointer transition-all hover:scale-105"
            >
              School Portal
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area based on Tab */}
      <main className="pb-16 animate-fade-in">
        {/* TAB: HOME */}
        {activeTab === "home" && (
          <div>
            {/* Hero Section with Authentic Campus Champions Background */}
            <section className="relative overflow-hidden bg-slate-950 text-white py-20 lg:py-28 px-4">
              <div className="absolute inset-0 z-0 opacity-20">
                <img
                  src={studentsTrophyPhoto}
                  alt="MHC Campus Entrance and Student Champions"
                  className="w-full h-full object-cover scale-105 filter blur-[2px]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-sky-950/90 via-slate-950/95 to-sky-900/90" />
              </div>
              
              <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-12 lg:gap-12 items-center relative z-10">
                <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-sky-900/80 border border-yellow-500/30 text-yellow-400 text-xs px-3.5 py-1.5 rounded-full font-mono font-bold tracking-wider backdrop-blur-sm shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    FOUNDED 17 NOV 2003 • NEW MATADI DRIVE, MONROVIA
                  </div>
                  
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                    To Serve God and Humanity
                  </h2>
                  
                  <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                    Mary Help of Christians Catholic High School, managed by the Salesians of Don Bosco under the Catholic Education Secretariat of the Archdiocese of Monrovia, empowers young minds with rigorous academics, Christian discipline, and holistic moral and athletic leadership.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
                    <button
                      onClick={() => setActiveTab("sports")}
                      className="bg-yellow-500 hover:bg-yellow-600 text-sky-950 font-bold px-6 py-3 rounded-full text-xs shadow-lg flex items-center gap-2 transition-all hover:gap-3 cursor-pointer"
                    >
                      <Trophy className="w-4 h-4 text-sky-950" /> View 2025 Honors & Sports
                    </button>
                    <button
                      onClick={() => setActiveTab("gallery")}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-3 rounded-full text-xs transition-all flex items-center gap-2 cursor-pointer backdrop-blur-sm"
                    >
                      <ImageIcon className="w-4 h-4 text-yellow-400" /> Campus Photo Gallery
                    </button>
                    <button
                      onClick={() => setActiveTab("admissions")}
                      className="bg-sky-800 hover:bg-sky-700 text-white font-medium px-5 py-3 rounded-full text-xs transition-all cursor-pointer"
                    >
                      Admissions Info
                    </button>
                  </div>
                  
                  {/* Verified Badges */}
                  <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[11px] text-slate-300 font-mono">
                    <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-lg border border-white/10">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Archdiocese of Monrovia
                    </span>
                    <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-lg border border-white/10">
                      <CheckCircle className="w-3.5 h-3.5 text-yellow-400" /> Salesians of Don Bosco
                    </span>
                    <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-lg border border-white/10">
                      <CheckCircle className="w-3.5 h-3.5 text-sky-400" /> New Matadi Campus
                    </span>
                  </div>
                </div>

                {/* Hero Showcase Photo Card (Authentic Students with Trophy) */}
                <div className="lg:col-span-5 mt-10 lg:mt-0 relative flex justify-center">
                  <div 
                    onClick={() => setSelectedPhotoModal({
                      src: studentsTrophyPhoto,
                      title: "MHC Student Champions Outside Campus Entrance",
                      category: "Campus & Student Life",
                      description: "Mary Help of Christians students smiling proudly in their official school uniform (green pinafores and ties) holding the championship cup outside the New Matadi Drive entrance archway: 'CATHOLIC HIGH SCHOOL NEW MATADI DRIVE, MON. LIB'.",
                      date: "Academic Year 2024–2025"
                    })}
                    className="group relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-500/40 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-yellow-400"
                  >
                    <img
                      src={studentsTrophyPhoto}
                      alt="MHC Student Champions holding Trophy at Campus Entrance"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase bg-yellow-500 text-sky-950 font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Trophy className="w-3 h-3" /> Campus Champions
                        </span>
                        <span className="text-white/80 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-0.5 rounded">
                          <ZoomIn className="w-3.5 h-3.5" /> Enlarge
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-white text-sm sm:text-base mt-2">
                        Excellence at Mary Help of Christians
                      </h4>
                      <p className="text-xs text-slate-300 font-light line-clamp-2 mt-0.5">
                        Students celebrating outside the historic New Matadi Drive school entrance with our victory cup.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* School Stats */}
            <section className={`py-8 border-y ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
              <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {stats.map((stat, i) => (
                  <div key={i} className="p-4 space-y-1 flex flex-col justify-center">
                    <p className="font-display text-sm sm:text-base font-extrabold text-sky-900 dark:text-sky-400 leading-tight">{stat.value}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* RECTOR'S WELCOME & SALESIAN LEADERSHIP (Rev. Fr. Augustine Okeke, SDB) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className={`p-6 sm:p-10 rounded-3xl ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"} border shadow-xl lg:grid lg:grid-cols-12 lg:gap-10 items-center`}>
                
                {/* Photo of Father Okeke cutting ribbon */}
                <div className="lg:col-span-5 flex flex-col items-center text-center">
                  <div 
                    onClick={() => setSelectedPhotoModal({
                      src: rectorRibbonPhoto,
                      title: "Rev. Fr. Augustine Okeke, SDB — Parish Priest & Rector",
                      category: "School Leadership & Pastoral Care",
                      description: "Rev. Fr. Augustine Okeke, SDB cutting the ceremonial ribbon with joy and pastoral warmth at Mary Help of Christians Catholic High School, welcoming students and community members to campus milestones.",
                      details: "Parish Priest & Salesian Rector, SDB"
                    })}
                    className="group relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-4 border-yellow-500 shadow-xl cursor-pointer hover:scale-105 transition-all duration-300"
                  >
                    <img
                      src={rectorRibbonPhoto}
                      alt="Rev. Fr. Augustine Okeke, SDB Ribbon Cutting"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                      <ZoomIn className="w-4 h-4 text-yellow-400" /> View Full Portrait
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <h4 className="font-display font-extrabold text-base sm:text-lg text-sky-950 dark:text-sky-300">
                      Rev. Fr. Augustine Okeke, SDB
                    </h4>
                    <span className="inline-block text-xs bg-sky-100 dark:bg-sky-900/60 text-sky-900 dark:text-sky-200 px-3 py-1 rounded-full font-mono font-bold">
                      Parish Priest & Salesian Rector
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      Salesians of Don Bosco • Archdiocese of Monrovia
                    </p>
                  </div>

                  {/* Secondary portrait thumbnail button */}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPhotoModal({
                        src: rectorPortraitPhoto,
                        title: "Rev. Fr. Augustine Okeke, SDB — Official Portrait",
                        category: "Salesian Leadership",
                        description: "Official portrait of Rev. Fr. Augustine Okeke, SDB, Parish Priest and School Rector, guiding the religious and moral life of Mary Help of Christians Catholic High School.",
                        details: "Salesians of Don Bosco, New Matadi, Monrovia"
                      })}
                      className="text-[10px] font-mono text-sky-800 dark:text-sky-300 hover:underline flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/60 px-3 py-1.5 rounded-full"
                    >
                      <img src={rectorPortraitPhoto} className="w-4 h-4 rounded-full object-cover border" alt="Thumbnail" />
                      View Director Portrait
                    </button>
                  </div>
                </div>

                {/* Welcome Message & Philosophy */}
                <div className="lg:col-span-7 mt-8 lg:mt-0 space-y-5">
                  <div className="inline-flex items-center gap-2 text-yellow-500 font-bold text-xs uppercase tracking-widest font-mono">
                    <Award className="w-5 h-5" /> Message from School Leadership
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-sky-900 dark:text-sky-400 leading-snug">
                    "Anchored in Hope, Pilgrims with Young People"
                  </h3>

                  <blockquote className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light italic border-l-4 border-yellow-500 pl-4 py-1">
                    "Welcome to Mary Help of Christians Catholic High School. Guided by School Principal <strong>REV. FR. Solomon Gbaki, SDB</strong> and Parish Priest & Salesian Rector <strong>Rev. Fr. Augustine Okeke, SDB</strong>, our school is more than an institution of learning. Enveloped in the maternal protection of Our Lady, Help of Christians, it is a home that welcomes, a parish that evangelizes, a school that prepares for life, and a playground where friends meet."
                  </blockquote>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                    Operated by the Salesians of Don Bosco under the Catholic Education Secretariat of the Archdiocese of Monrovia, Principal Rev. Fr. Solomon Gbaki, SDB and the Salesian community nurture each student through the time-tested Preventive System founded on <strong>Reason, Religion, and Loving-Kindness</strong>. Here, discipline is born of mutual respect and youth are prepared to lead Liberia with moral courage.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab("admin")}
                      className="bg-sky-900 hover:bg-sky-950 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      View Administration Roster <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-mono text-slate-500">
                      Motto: <strong className="text-sky-900 dark:text-sky-400 font-bold">"To Serve God and Humanity"</strong>
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* MAJOR ATHLETICS & HONORS SHOWCASE (Don Bosco Feast Day Champions) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="bg-gradient-to-br from-sky-950 via-slate-900 to-sky-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-sky-800">
                <div className="relative z-10 space-y-6">
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                      <span className="bg-yellow-500 text-sky-950 text-[10px] font-mono font-bold tracking-widest px-3 py-1 rounded-full uppercase flex items-center gap-1.5 inline-flex mb-2">
                        <Trophy className="w-3.5 h-3.5" /> Official Championship Victory
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                        Don Bosco Feast Day Sports Champions
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 font-light mt-1">
                        Mary Help of Christians Basketball Team awarded Winner of the Basketball Category • Don Bosco Youth Centre
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab("sports")}
                      className="bg-yellow-500 hover:bg-yellow-600 text-sky-950 font-bold px-5 py-2.5 rounded-full text-xs transition-all shadow-lg flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      Full Sports Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Dual Grid: Team Photo + Authentic Certificate */}
                  <div className="grid md:grid-cols-2 gap-8 items-center pt-2">
                    
                    {/* Item 1: Team Photo */}
                    <div 
                      onClick={() => setSelectedPhotoModal({
                        src: basketballTeamPhoto,
                        title: "MHC Basketball Champions & Coach",
                        category: "Athletics & Honors",
                        description: "The victorious Mary Help of Christians Catholic High School basketball team in their royal blue numbered jerseys (10, 13, 30, 11, 8) standing with their coach and proudly displaying the official Don Bosco Youth Centre Certificate of Award at the parish entrance.",
                        date: "1 February 2025"
                      })}
                      className="group relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl cursor-pointer aspect-[4/3] bg-black/40"
                    >
                      <img
                        src={basketballTeamPhoto}
                        alt="MHC Basketball Team Champions"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono bg-sky-600 text-white font-bold px-2 py-0.5 rounded">
                            MHC Basketball Squad
                          </span>
                          <span className="text-[11px] text-yellow-400 font-mono flex items-center gap-1">
                            <ZoomIn className="w-3 h-3" /> Click to Enlarge
                          </span>
                        </div>
                        <h5 className="font-display font-bold text-sm text-white mt-1">
                          Championship Team & Coach
                        </h5>
                        <p className="text-[11px] text-slate-300 font-light">
                          Jerseys #10, #13, #30, #11, #8 at the Don Bosco Youth Centre celebration.
                        </p>
                      </div>
                    </div>

                    {/* Item 2: Certificate Photo */}
                    <div 
                      onClick={() => setSelectedPhotoModal({
                        src: certificateAwardPhoto,
                        title: "Don Bosco Youth Centre — Certificate of Award",
                        category: "Official School Honors",
                        description: "Official Certificate of Award from Don Bosco Youth Centre, New Matadi Drive, Monrovia, Liberia. Awarded to: Mary Help of Christians as WINNER of the Basketball Category in the Don Bosco Feast Day Celebration Sports Tournament. Theme: 'Anchored in hope, Pilgrims with young people'. Signed and sealed on this 1st Day of February 2025 by Rev. Fr. Augustine Okeke, sdb (Parish Priest) & Br. Joseph Collins, sdb.",
                        date: "1 February 2025",
                        details: "Signatories: Rev. Fr. Augustine Okeke, SDB & Br. Joseph Collins, SDB"
                      })}
                      className="group relative rounded-2xl overflow-hidden border-2 border-yellow-500/50 shadow-xl cursor-pointer aspect-[4/3] bg-white flex items-center justify-center p-1"
                    >
                      <img
                        src={certificateAwardPhoto}
                        alt="Don Bosco Youth Centre Certificate of Award to MHC"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-4 text-white">
                        <ZoomIn className="w-8 h-8 text-yellow-400 mb-2" />
                        <h5 className="font-display font-bold text-sm">Certificate of Award</h5>
                        <p className="text-xs text-slate-200 mt-1">Click to view high-resolution scan & read signatures</p>
                        <span className="mt-2 text-[10px] font-mono bg-yellow-500 text-sky-950 font-bold px-2.5 py-1 rounded-full uppercase">
                          Winner • Basketball Category
                        </span>
                      </div>
                      <div className="absolute top-2 left-2 bg-yellow-500 text-sky-950 text-[9px] font-mono font-extrabold px-2 py-0.5 rounded shadow">
                        SEALED 1 FEB 2025
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </section>

            {/* News, Achievements, and Calendar */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-2 gap-8 border-t border-slate-200/50 dark:border-slate-800">
              {/* Achievements & Student Life */}
              <div className="space-y-4">
                <h3 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2 text-sky-900 dark:text-sky-400">
                  <Sparkles className="w-5 h-5 text-yellow-500" /> School Achievements & Activities
                </h3>
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm space-y-2`}>
                    <span className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded">
                      Championship Record
                    </span>
                    <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
                      Winner: Don Bosco Feast Day Celebration Sports Tournament (2025)
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Mary Help of Christians basketball team secured 1st place in the Don Bosco youth tournament on February 1, 2025 under the Salesian theme "Anchored in hope, Pilgrims with young people".
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm space-y-2`}>
                    <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded">
                      Holistic Formation
                    </span>
                    <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
                      Rigorous Academics & Salesian Preventive Discipline
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Operating in New Matadi Estate Drive, Monrovia, our students excel in academic laboratories, science fairs, and archdiocesan youth ministry.
                    </p>
                  </div>
                </div>
              </div>

              {/* School Calendar */}
              <div className="space-y-4">
                <h3 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2 text-sky-900 dark:text-sky-400">
                  <Calendar className="w-5 h-5 text-yellow-500" /> School Calendar & Office
                </h3>
                <div className={`p-6 rounded-2xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} text-center space-y-3`}>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Official term schedules, report distribution dates, and feast day celebrations:
                  </p>
                  <span className="inline-block text-xs bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 px-3 py-1.5 rounded-full font-mono font-bold">
                    Office of the Registrar • New Matadi Campus
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Parents and guardians can visit the administrative office on campus or access their student's schedule through the digital portal.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB: ABOUT US */}
        {activeTab === "about" && (
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-sky-900 dark:text-sky-400 text-center">About MHC</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-500" /> Our Mission
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                  Provide quality Catholic education by promoting academic excellence, Christian values, discipline, leadership, character formation, and service to God and humanity.
                </p>
                <div className="pt-2">
                  <h4 className="font-display font-bold text-xs text-sky-900 dark:text-sky-400 uppercase tracking-wider">Management & Ownership</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    Operated by the Salesians of Don Bosco (SDB), under the Catholic Education Secretariat of the Archdiocese of Monrovia.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" /> Core Values
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["Faith", "Discipline", "Excellence", "Respect", "Integrity", "Service", "Leadership", "Responsibility"].map((val) => (
                    <span key={val} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full font-medium">
                      {val}
                    </span>
                  ))}
                </div>
                <div className="pt-2 space-y-1">
                  <h4 className="font-display font-bold text-xs text-sky-900 dark:text-sky-400 uppercase tracking-wider">School Philosophy</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Educating young people according to the educational system of St. John Bosco by nurturing the whole person spiritually, morally, intellectually, socially, and physically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: HISTORY */}
        {activeTab === "history" && (
          <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
            <div className="flex justify-center">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-yellow-500 shadow-lg bg-white shrink-0">
                <img
                  src={schoolLogo}
                  alt="MHC Official School Seal"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-sky-900 dark:text-sky-400 text-center">Our Historical Journey</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              Mary Help of Christians Catholic High School was officially opened on <strong>17 November 2003</strong> by the Salesians of Don Bosco to provide quality Catholic education to children and youth in the communities of New Matadi, Old Matadi, Airfield, Lakpazee, Fiamah, and surrounding areas.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              Since its establishment, the school has expanded its facilities and academic programs, including the addition of a modern science laboratory. Driven by our motto <strong>"To Serve God and Humanity"</strong>, we are committed to holistic intellectual and moral development.
            </p>
            <div className="p-5 bg-sky-900 text-white rounded-2xl flex flex-col items-center text-center gap-2">
              <span className="font-bold text-yellow-400 text-base sm:text-lg">"To Serve God and Humanity"</span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-300">Our Sacred Motto Since Foundation</span>
            </div>
          </div>
        )}

        {/* TAB: ADMINISTRATION */}
        {activeTab === "admin" && (
          <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-sky-900 dark:text-sky-400">
                School Leadership & Administration
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                Mary Help of Christians Catholic High School is owned and operated by the Salesians of Don Bosco under the Catholic Education Secretariat of the Archdiocese of Monrovia.
              </p>
            </div>

            {/* Leadership Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Leader 1: REV. FR. Solomon Gbaki, SDB — School Principal */}
              <div className={`p-6 rounded-3xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"} shadow-lg space-y-5 flex flex-col justify-between ring-2 ring-yellow-500/40`}>
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <div 
                      onClick={() => setSelectedPhotoModal({
                        src: schoolLogo,
                        title: "REV. FR. Solomon Gbaki, SDB — School Principal",
                        category: "School Leadership & Academic Governance",
                        description: "Official heraldic insignia and principal's seal for REV. FR. Solomon Gbaki, SDB, School Principal of Mary Help of Christians Catholic High School, New Matadi, Monrovia, Liberia.",
                        details: "Salesians of Don Bosco (SDB)"
                      })}
                      className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-yellow-500 shadow-md shrink-0 cursor-pointer hover:scale-105 transition-transform bg-white flex items-center justify-center p-1"
                    >
                      <img
                        src={schoolLogo}
                        alt="REV. FR. Solomon Gbaki, SDB - School Principal Seal"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 font-bold px-2 py-0.5 rounded uppercase">
                        School Principal
                      </span>
                      <h3 className="font-display font-extrabold text-base text-slate-800 dark:text-slate-100 mt-1">
                        REV. FR. Solomon Gbaki, SDB
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">Principal & Head of School</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                    Serving as School Principal, Rev. Fr. Solomon Gbaki, SDB directs academic governance, instructional excellence, faculty mentorship, and student character formation. Under his stewardship, MHC upholds rigorous academic standards, WAEC/WASSCE excellence, and faithful practice of Don Bosco's Preventive System.
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-150 dark:border-slate-700/60 pt-3">
                  <span className="text-[10px] font-mono text-slate-400">Salesians of Don Bosco</span>
                  <button
                    onClick={() => setActiveTab("academics")}
                    className="text-xs font-bold text-sky-800 dark:text-sky-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Academic Programs →
                  </button>
                </div>
              </div>

              {/* Leader 2: Rev. Fr. Augustine Okeke, SDB — Parish Priest & Rector */}
              <div className={`p-6 rounded-3xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"} shadow-lg space-y-5 flex flex-col justify-between`}>
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <div 
                      onClick={() => setSelectedPhotoModal({
                        src: rectorRibbonPhoto,
                        title: "Rev. Fr. Augustine Okeke, SDB — Parish Priest & Rector",
                        category: "Salesian Leadership",
                        description: "Rev. Fr. Augustine Okeke, SDB officiating at the ceremonial ribbon cutting for campus developments at Mary Help of Christians Catholic High School.",
                        details: "Salesians of Don Bosco (SDB)"
                      })}
                      className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-yellow-500 shadow-md shrink-0 cursor-pointer hover:scale-105 transition-transform"
                    >
                      <img
                        src={rectorRibbonPhoto}
                        alt="Rev. Fr. Augustine Okeke, SDB"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-300 font-bold px-2 py-0.5 rounded uppercase">
                        Parish & School Rector
                      </span>
                      <h3 className="font-display font-extrabold text-base text-slate-800 dark:text-slate-100 mt-1">
                        Rev. Fr. Augustine Okeke, SDB
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">Parish Priest & Spiritual Director</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                    Serving as Parish Priest and Salesian Rector, Rev. Fr. Augustine Okeke, SDB oversees the spiritual mission, moral instruction, and pastoral guidance of the youth at Mary Help of Christians Parish and High School in New Matadi.
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-150 dark:border-slate-700/60 pt-3">
                  <span className="text-[10px] font-mono text-slate-400">Salesians of Don Bosco</span>
                  <button
                    onClick={() => setSelectedPhotoModal({
                      src: rectorPortraitPhoto,
                      title: "Rev. Fr. Augustine Okeke, SDB — Portrait",
                      category: "Salesian Leadership",
                      description: "Official portrait of Rev. Fr. Augustine Okeke, SDB.",
                      details: "Parish Priest, SDB"
                    })}
                    className="text-xs font-bold text-sky-800 dark:text-sky-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" /> View Portrait
                  </button>
                </div>
              </div>

              {/* Leader 3: Br. Joseph Collins, SDB — Youth Ministry & Sports */}
              <div className={`p-6 rounded-3xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"} shadow-lg space-y-5 flex flex-col justify-between`}>
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <div 
                      onClick={() => setSelectedPhotoModal({
                        src: certificateAwardPhoto,
                        title: "Official Seal & Don Bosco Youth Centre Endorsement",
                        category: "Salesian Leadership & Sports",
                        description: "Don Bosco Youth Centre Certificate of Award co-signed by Br. Joseph Collins, SDB and Rev. Fr. Augustine Okeke, SDB.",
                        details: "Don Bosco Youth Centre, New Matadi Drive"
                      })}
                      className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-yellow-500 shadow-md shrink-0 cursor-pointer hover:scale-105 transition-transform bg-white flex items-center justify-center p-1"
                    >
                      <img
                        src={certificateAwardPhoto}
                        alt="Br. Joseph Collins Signatory Seal"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 font-bold px-2 py-0.5 rounded uppercase">
                        Youth Ministry & Sports
                      </span>
                      <h3 className="font-display font-extrabold text-base text-slate-800 dark:text-slate-100 mt-1">
                        Br. Joseph Collins, SDB
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">Youth Centre & Athletics Coordinator</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                    Directing youth recreation, athletic tournaments, and vocational oratory at the Don Bosco Youth Centre, fostering sportsmanship and teamwork across the Sinkor district.
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-150 dark:border-slate-700/60 pt-3">
                  <span className="text-[10px] font-mono text-slate-400">Youth Ministry Division</span>
                  <button
                    onClick={() => setActiveTab("sports")}
                    className="text-xs font-bold text-sky-800 dark:text-sky-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View Sports Honors →
                  </button>
                </div>
              </div>

            </div>

            {/* School Faculty and Preventive System */}
            <div className={`p-6 sm:p-8 rounded-3xl ${darkMode ? "bg-slate-800/60 border-slate-700" : "bg-sky-50/50 border-sky-100"} border space-y-4`}>
              <h4 className="font-display font-bold text-base text-sky-950 dark:text-sky-300 flex items-center gap-2">
                <Shield className="w-5 h-5 text-yellow-500" /> Salesian Faculty & Preventive System Governance
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Our teaching faculty consists of certified and vetted Catholic educators specializing in sciences, humanities, business, and foundational grammar. Rather than punitive measures, our teachers accompany students continuously throughout their school day, adhering faithfully to Don Bosco's <strong>Preventive System</strong>:
              </p>
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm space-y-1">
                  <h5 className="font-display font-bold text-xs text-sky-900 dark:text-sky-400">1. Reason</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Rational dialogue, clear guidelines, and intellectual clarity in all learning endeavors.</p>
                </div>
                <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm space-y-1">
                  <h5 className="font-display font-bold text-xs text-sky-900 dark:text-sky-400">2. Religion</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Daily prayer, liturgical participation, conscience formation, and loving reverence for God.</p>
                </div>
                <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm space-y-1">
                  <h5 className="font-display font-bold text-xs text-sky-900 dark:text-sky-400">3. Loving-Kindness</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed">"It is not enough to love the young; they must know that they are loved" (St. John Bosco).</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SPORTS & HONORS (NEW DEDICATED TAB) */}
        {activeTab === "sports" && (
          <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
            <div className="text-center space-y-2">
              <span className="bg-yellow-500 text-sky-950 text-[10px] font-mono font-bold tracking-widest px-3 py-1 rounded-full uppercase inline-flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" /> Athletics & Championships
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-sky-900 dark:text-sky-400">
                Sports & Tournament Honors
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                At Mary Help of Christians High School, athletic competition is an essential playground for friendship, discipline, and building Christian character.
              </p>
            </div>

            {/* Featured Trophy Victory Card */}
            <div className="bg-gradient-to-br from-sky-950 via-slate-900 to-sky-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-sky-800 space-y-8">
              <div>
                <span className="text-[10px] font-mono uppercase bg-yellow-500 text-sky-950 font-extrabold px-3 py-1 rounded-full">
                  OFFICIAL TITLE • 1ST FEBRUARY 2025
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-2">
                  Winner: Don Bosco Feast Day Celebration Sports Tournament
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-light mt-1">
                  Mary Help of Christians Basketball Team officially clinched the basketball championship at Don Bosco Youth Centre, New Matadi Drive.
                </p>
              </div>

              {/* Photos Grid */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Team Photo */}
                <div 
                  onClick={() => setSelectedPhotoModal({
                    src: basketballTeamPhoto,
                    title: "MHC Basketball Champions & Coach",
                    category: "Sports & Athletics",
                    description: "Mary Help of Christians basketball champions squad in their blue jerseys (10, 13, 30, 11, 8) with their coach holding the Don Bosco Youth Centre Certificate of Award outside the parish fellowship hall.",
                    date: "1 February 2025"
                  })}
                  className="group relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl cursor-pointer aspect-[4/3] bg-black/40"
                >
                  <img
                    src={basketballTeamPhoto}
                    alt="MHC Basketball Champions"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-4">
                    <span className="text-xs text-yellow-400 font-mono flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5" /> Click to Inspect Team
                    </span>
                    <h4 className="font-display font-bold text-sm text-white mt-0.5">
                      The Champions in Royal Blue
                    </h4>
                  </div>
                </div>

                {/* Award Certificate */}
                <div 
                  onClick={() => setSelectedPhotoModal({
                    src: certificateAwardPhoto,
                    title: "Don Bosco Youth Centre Certificate of Award",
                    category: "Official Trophy & Sealed Certificate",
                    description: "Authentic Certificate of Award from Don Bosco Youth Centre, New Matadi Drive, Monrovia, Liberia. Awarded to: Mary Help of Christians as WINNER of the Basketball Category in the Don Bosco Feast Day Celebration Sports Tournament. Under the theme: 'Anchored in hope, Pilgrims with young people'. Signed and sealed on this 1st Day of February 2025 by Rev. Fr. Augustine Okeke, sdb (Parish Priest) & Br. Joseph Collins, sdb.",
                    date: "1 February 2025",
                    details: "Signed: Rev. Fr. Augustine Okeke, sdb & Br. Joseph Collins, sdb"
                  })}
                  className="group relative rounded-2xl overflow-hidden border-2 border-yellow-500/50 shadow-xl cursor-pointer aspect-[4/3] bg-white flex items-center justify-center p-2"
                >
                  <img
                    src={certificateAwardPhoto}
                    alt="Certificate of Award"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-4 text-white">
                    <ZoomIn className="w-8 h-8 text-yellow-400 mb-1" />
                    <h4 className="font-display font-bold text-sm">Read Official Certificate Scan</h4>
                    <span className="mt-2 text-[10px] font-mono bg-yellow-500 text-sky-950 font-bold px-2 py-0.5 rounded">
                      Sealed 1 Feb 2025
                    </span>
                  </div>
                </div>
              </div>

              {/* Certificate Transcription Box */}
              <div className="p-5 bg-black/40 rounded-2xl border border-white/10 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-yellow-400 font-bold">
                  Certificate Transcription
                </span>
                <p className="text-xs text-slate-200 font-serif italic leading-relaxed">
                  "DON BOSCO YOUTH CENTRE — New Matadi Drive, Monrovia, Liberia. Certificate of Award awarded to: <strong>Mary Help of Christians</strong> as <strong>WINNER of the Basketball Category</strong> in the Don Bosco Feast Day Celebration Sports Tournament. Under the theme: <em>'Anchored in hope, Pilgrims with young people'</em>. Given and sealed on this 1st Day of February 2025. Signed: Rev. Fr. Augustine Okeke, sdb (Parish Priest) & Br. Joseph Collins, sdb."
                </p>
              </div>
            </div>

            {/* Other Sports Squads */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm space-y-2`}>
                <span className="text-2xl">🏀</span>
                <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">Basketball Team</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  Reigning 2025 Don Bosco Feast Day Champions. Weekly drills at the Don Bosco outdoor basketball court.
                </p>
              </div>
              <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm space-y-2`}>
                <span className="text-2xl">⚽</span>
                <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">Football / Soccer Squad</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  Active in inter-school Catholic tournaments, training both physical endurance and fair-play sportsmanship.
                </p>
              </div>
              <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm space-y-2`}>
                <span className="text-2xl">🏃</span>
                <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">Track & Field</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  Sprint, relay, and high-jump events during our annual Mary Help of Christians Sports Festival every spring.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CAMPUS GALLERY (NEW INTERACTIVE AUTHENTIC PHOTOS GALLERY) */}
        {activeTab === "gallery" && (
          <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
            <div className="text-center space-y-3">
              <span className="bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 text-[10px] font-mono font-bold tracking-widest px-3 py-1 rounded-full uppercase">
                Official Visual Archive
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-sky-900 dark:text-sky-400">
                Mary Help of Christians Campus Gallery
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                Explore real, verified photographs from our campus in New Matadi Drive, Sinkor, Monrovia — capturing our students, Salesian rector, championships, and official heraldry.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { id: "all", label: "All Authentic Photos" },
                { id: "champions", label: "Trophies & Sports" },
                { id: "students", label: "Student Life & Uniforms" },
                { id: "leadership", label: "Salesian Leadership" },
                { id: "crest", label: "School Crest & Seal" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setGalleryFilter(f.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    galleryFilter === f.id
                      ? "bg-sky-900 text-white shadow-md scale-105"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Photo Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Photo 1: Official Crest Badge */}
              {(galleryFilter === "all" || galleryFilter === "crest") && (
                <div 
                  onClick={() => setSelectedPhotoModal({
                    src: schoolLogo,
                    title: "Official School Crest & Badge",
                    category: "School Insignia & Heraldry",
                    description: "The authentic, official crest of Mary Help of Christians Catholic High School, New Matadi, Liberia. Depicting the Blessed Virgin Mary holding Child Jesus with royal crowns and sceptre, surrounded by angelic cherubim, bordered by stars and the foundation inscription 'Mary Help of Christians Catholic High School • New Matadi, Liberia'.",
                    details: "Foundation Motto: To Serve God and Humanity"
                  })}
                  className={`group rounded-3xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"} overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between`}
                >
                  <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center aspect-square">
                    <img
                      src={schoolLogo}
                      alt="Official School Crest"
                      className="w-48 h-48 object-contain group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[9px] font-mono bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded uppercase">
                      Official Seal
                    </span>
                    <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
                      MHC Official School Crest
                    </h4>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      Mary Help of Christians Catholic High School seal, New Matadi, Liberia.
                    </p>
                    <span className="text-[10px] text-sky-800 dark:text-sky-400 font-semibold flex items-center gap-1 pt-1">
                      <ZoomIn className="w-3 h-3" /> Click to enlarge seal
                    </span>
                  </div>
                </div>
              )}

              {/* Photo 2: Students with Trophy outside Entrance */}
              {(galleryFilter === "all" || galleryFilter === "students" || galleryFilter === "champions") && (
                <div 
                  onClick={() => setSelectedPhotoModal({
                    src: studentsTrophyPhoto,
                    title: "MHC Student Champions Outside Campus Entrance",
                    category: "Students & Academic Honors",
                    description: "Students in official green pinafores and ties smiling outside the campus entrance archway: 'CATHOLIC HIGH SCHOOL NEW MATADI DRIVE, MON. LIB'. Holding their gold victory cup beside the mural of the Ten Commandments.",
                    date: "Academic Year 2024–2025"
                  })}
                  className={`group rounded-3xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"} overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between`}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-900 relative">
                    <img
                      src={studentsTrophyPhoto}
                      alt="Student Champions with Cup"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-yellow-500 text-sky-950 text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow">
                      CHAMPIONS
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[9px] font-mono bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 font-bold px-2 py-0.5 rounded uppercase">
                      Campus Life
                    </span>
                    <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
                      Students with Victory Trophy
                    </h4>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      Captured at the New Matadi Drive entrance archway in full school uniform.
                    </p>
                    <span className="text-[10px] text-sky-800 dark:text-sky-400 font-semibold flex items-center gap-1 pt-1">
                      <ZoomIn className="w-3 h-3" /> Click to view full image
                    </span>
                  </div>
                </div>
              )}

              {/* Photo 3: Basketball Team Champions */}
              {(galleryFilter === "all" || galleryFilter === "champions") && (
                <div 
                  onClick={() => setSelectedPhotoModal({
                    src: basketballTeamPhoto,
                    title: "MHC Basketball Champions Squad",
                    category: "Sports & Athletics",
                    description: "Mary Help of Christians Basketball Team in royal blue jerseys (#10, #13, #30, #11, #8) with their coach holding the Don Bosco Youth Centre Certificate of Award at the parish grounds.",
                    date: "1 February 2025"
                  })}
                  className={`group rounded-3xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"} overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between`}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-900 relative">
                    <img
                      src={basketballTeamPhoto}
                      alt="MHC Basketball Champions Squad"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-sky-500 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow">
                      1ST PLACE
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[9px] font-mono bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 font-bold px-2 py-0.5 rounded uppercase">
                      Tournament Winner
                    </span>
                    <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
                      MHC Basketball Champions
                    </h4>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      Don Bosco Feast Day Celebration tournament victory team with coach.
                    </p>
                    <span className="text-[10px] text-sky-800 dark:text-sky-400 font-semibold flex items-center gap-1 pt-1">
                      <ZoomIn className="w-3 h-3" /> Click to view team roster
                    </span>
                  </div>
                </div>
              )}

              {/* Photo 4: Certificate of Award */}
              {(galleryFilter === "all" || galleryFilter === "champions") && (
                <div 
                  onClick={() => setSelectedPhotoModal({
                    src: certificateAwardPhoto,
                    title: "Don Bosco Youth Centre — Certificate of Award",
                    category: "Official School Honors",
                    description: "Don Bosco Youth Centre Certificate of Award awarded to Mary Help of Christians as Winner of the Basketball Category in the Don Bosco Feast Day Celebration Sports Tournament (February 1, 2025). Theme: 'Anchored in hope, Pilgrims with young people'. Signed by Rev. Fr. Augustine Okeke, sdb and Br. Joseph Collins, sdb.",
                    date: "1 February 2025"
                  })}
                  className={`group rounded-3xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"} overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between`}
                >
                  <div className="aspect-[4/3] bg-white flex items-center justify-center p-3 relative border-b">
                    <img
                      src={certificateAwardPhoto}
                      alt="Certificate of Award"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-amber-500 text-sky-950 text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow">
                      SEALED AWARD
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[9px] font-mono bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 font-bold px-2 py-0.5 rounded uppercase">
                      Certificate Scan
                    </span>
                    <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
                      Championship Certificate
                    </h4>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      Signed by Parish Priest Rev. Fr. Augustine Okeke, SDB & Br. Joseph Collins, SDB.
                    </p>
                    <span className="text-[10px] text-sky-800 dark:text-sky-400 font-semibold flex items-center gap-1 pt-1">
                      <ZoomIn className="w-3 h-3" /> Click to read signatures
                    </span>
                  </div>
                </div>
              )}

              {/* Photo 5: Father Okeke Ribbon Cutting */}
              {(galleryFilter === "all" || galleryFilter === "leadership") && (
                <div 
                  onClick={() => setSelectedPhotoModal({
                    src: rectorRibbonPhoto,
                    title: "Rev. Fr. Augustine Okeke, SDB — Ribbon Cutting Ceremony",
                    category: "Salesian Leadership",
                    description: "Rev. Fr. Augustine Okeke, SDB in clerical vestments cutting the ceremonial green ribbon with joy and pastoral warmth at Mary Help of Christians Catholic High School.",
                    details: "Parish Priest & Salesian Rector, SDB"
                  })}
                  className={`group rounded-3xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"} overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between`}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-900 relative">
                    <img
                      src={rectorRibbonPhoto}
                      alt="Rev. Fr. Augustine Okeke, SDB Ribbon Cutting"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow">
                      CEREMONIAL
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[9px] font-mono bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 font-bold px-2 py-0.5 rounded uppercase">
                      School Blessing
                    </span>
                    <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
                      Rector Ribbon Cutting
                    </h4>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      Rev. Fr. Augustine Okeke, SDB officiating at campus milestone ceremonies.
                    </p>
                    <span className="text-[10px] text-sky-800 dark:text-sky-400 font-semibold flex items-center gap-1 pt-1">
                      <ZoomIn className="w-3 h-3" /> Click to enlarge portrait
                    </span>
                  </div>
                </div>
              )}

              {/* Photo 6: Father Okeke Portrait */}
              {(galleryFilter === "all" || galleryFilter === "leadership") && (
                <div 
                  onClick={() => setSelectedPhotoModal({
                    src: rectorPortraitPhoto,
                    title: "Rev. Fr. Augustine Okeke, SDB — Salesian Director",
                    category: "Salesian Leadership",
                    description: "Official portrait of Rev. Fr. Augustine Okeke, SDB, Parish Priest and School Rector, guiding the religious and moral life of Mary Help of Christians Catholic High School.",
                    details: "Salesians of Don Bosco, New Matadi, Monrovia"
                  })}
                  className={`group rounded-3xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"} overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between`}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-900 relative">
                    <img
                      src={rectorPortraitPhoto}
                      alt="Rev. Fr. Augustine Okeke, SDB Portrait"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-sky-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow">
                      RECTOR
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[9px] font-mono bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 font-bold px-2 py-0.5 rounded uppercase">
                      Parish Leadership
                    </span>
                    <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
                      Parish Priest & Rector Portrait
                    </h4>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      Rev. Fr. Augustine Okeke, SDB, leading the Salesian community in Monrovia.
                    </p>
                    <span className="text-[10px] text-sky-800 dark:text-sky-400 font-semibold flex items-center gap-1 pt-1">
                      <ZoomIn className="w-3 h-3" /> Click to view portrait
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB: ACADEMICS */}
        {activeTab === "academics" && (
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-sky-900 dark:text-sky-400">Academics Program</h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
                Providing high-standard educational and character formation through structured class tiers in the Archdiocese of Monrovia.
              </p>
            </div>

            {/* Educational Levels */}
            <div className="space-y-4">
              <h3 className="font-display text-base font-bold text-sky-900 dark:text-sky-400 border-b pb-2">
                Educational Levels Offered
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: "Kindergarten", desc: "Early childhood development & care" },
                  { name: "Elementary School", desc: "Grades 1 through 6 foundational studies" },
                  { name: "Junior High School", desc: "Grades 7 through 9 transitional prep" },
                  { name: "Senior High School", desc: "Grades 10 through 12 advanced disciplines" },
                ].map((tier, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} space-y-1`}>
                    <h4 className="font-display font-bold text-xs text-slate-800 dark:text-slate-100">{tier.name}</h4>
                    <p className="text-[10px] text-slate-500 leading-normal">{tier.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Campus Facilities */}
            <div className="space-y-4">
              <h3 className="font-display text-base font-bold text-sky-900 dark:text-sky-400 border-b pb-2">
                Campus Facilities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "Standard classrooms",
                  "Science laboratory",
                  "Library",
                  "Computer laboratory (if available)",
                  "Sports facilities",
                  "School chapel",
                  "Assembly hall",
                  "Administrative offices"
                ].map((fac, idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} flex items-center gap-2`}>
                    <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: ADMISSIONS */}
        {activeTab === "admissions" && (
          <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-sky-900 dark:text-sky-400 text-center">Admissions & Tuition</h2>
            
            <div className={`p-6 rounded-3xl border border-red-200 bg-red-500/5 text-center space-y-4 max-w-xl mx-auto`}>
              <HelpCircle className="w-12 h-12 text-red-500/70 mx-auto" />
              <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-100">
                Tuition Fees & Admission Requirements
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Detailed admission standards, registration packets, and financial tuition schedules are:
              </p>
              <span className="inline-block text-xs bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 px-3.5 py-1.5 rounded font-mono font-bold uppercase">
                Not publicly available
              </span>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Parents, guardians, and prospective transfers can obtain physical registration booklets directly from the administrative offices on campus. Please visit us at New Matadi Estate Drive, Sinkor, Monrovia, Liberia.
              </p>
            </div>
          </div>
        )}

        {/* TAB: NEWS */}
        {activeTab === "news" && (
          <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
            <div className="text-center space-y-2">
              <span className="bg-yellow-500 text-sky-950 text-[10px] font-mono font-bold tracking-widest px-3 py-1 rounded-full uppercase inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Latest Campus Stories
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-sky-900 dark:text-sky-400">
                News & Campus Highlights
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
                Celebrating student achievements, sports championships, and Salesian milestones at Mary Help of Christians High School.
              </p>
            </div>

            {/* Featured Visual News Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* News 1: Basketball Champions */}
              <div className={`rounded-3xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"} overflow-hidden shadow-md flex flex-col justify-between`}>
                <div 
                  onClick={() => setSelectedPhotoModal({
                    src: basketballTeamPhoto,
                    title: "MHC Basketball Champions & Coach",
                    category: "Sports & Athletics",
                    description: "Mary Help of Christians basketball champions holding their trophy and certificate with the coach at Don Bosco Youth Centre.",
                    date: "1 February 2025"
                  })}
                  className="aspect-video relative bg-slate-900 cursor-pointer overflow-hidden group"
                >
                  <img
                    src={basketballTeamPhoto}
                    alt="MHC Basketball Champions"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-yellow-500 text-sky-950 text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                    1ST PLACE
                  </div>
                </div>
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-slate-400">1 February 2025 • Athletics</span>
                    <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
                      MHC Clinches Basketball Championship at Don Bosco Feast Day
                    </h4>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      Our basketball team in royal blue jerseys brought home the Don Bosco Youth Centre Certificate of Award and championship honors.
                    </p>
                  </div>
                  <div className="pt-3 border-t flex justify-between items-center text-xs">
                    <button
                      onClick={() => setSelectedPhotoModal({
                        src: certificateAwardPhoto,
                        title: "Official Certificate of Award",
                        category: "Official Honors",
                        description: "Don Bosco Youth Centre Certificate of Award sealed 1 Feb 2025 by Rev. Fr. Augustine Okeke, SDB.",
                        date: "1 Feb 2025"
                      })}
                      className="text-sky-800 dark:text-sky-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" /> View Certificate
                    </button>
                    <button onClick={() => setActiveTab("sports")} className="text-[11px] text-yellow-600 font-semibold hover:underline">
                      Sports Story →
                    </button>
                  </div>
                </div>
              </div>

              {/* News 2: Students with Trophy at School Entrance */}
              <div className={`rounded-3xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"} overflow-hidden shadow-md flex flex-col justify-between`}>
                <div 
                  onClick={() => setSelectedPhotoModal({
                    src: studentsTrophyPhoto,
                    title: "MHC Student Champions Outside Entrance Archway",
                    category: "Academic & Character Honors",
                    description: "Students celebrating with the victory trophy outside the school gates in New Matadi Drive.",
                    date: "Academic Year 2024–2025"
                  })}
                  className="aspect-video relative bg-slate-900 cursor-pointer overflow-hidden group"
                >
                  <img
                    src={studentsTrophyPhoto}
                    alt="Students holding trophy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                    CAMPUS PRIDE
                  </div>
                </div>
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-slate-400">Campus News • Monrovia</span>
                    <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
                      Celebrating Academic & Extracurricular Champions
                    </h4>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      MHC students shine brightly in inter-school competitions, living our motto: "To Serve God and Humanity".
                    </p>
                  </div>
                  <div className="pt-3 border-t text-xs">
                    <button
                      onClick={() => setActiveTab("gallery")}
                      className="text-sky-800 dark:text-sky-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      View Campus Gallery →
                    </button>
                  </div>
                </div>
              </div>

              {/* News 3: Salesian Rector Ribbon Cutting */}
              <div className={`rounded-3xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"} overflow-hidden shadow-md flex flex-col justify-between`}>
                <div 
                  onClick={() => setSelectedPhotoModal({
                    src: rectorRibbonPhoto,
                    title: "Rev. Fr. Augustine Okeke, SDB — Ceremonial Ribbon Cutting",
                    category: "Salesian Leadership",
                    description: "Parish Priest Rev. Fr. Augustine Okeke, SDB cutting the ribbon for campus expansion milestones.",
                    details: "Parish Priest & Salesian Rector, SDB"
                  })}
                  className="aspect-video relative bg-slate-900 cursor-pointer overflow-hidden group"
                >
                  <img
                    src={rectorRibbonPhoto}
                    alt="Rev. Fr. Augustine Okeke, SDB"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-purple-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                    COMMUNITY
                  </div>
                </div>
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-slate-400">Parish Leadership • SDB</span>
                    <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
                      Rev. Fr. Augustine Okeke Blesses Campus Expansion
                    </h4>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      Celebrating continuous facility improvements and welcoming young people to our Salesian youth family.
                    </p>
                  </div>
                  <div className="pt-3 border-t text-xs">
                    <button
                      onClick={() => setActiveTab("admin")}
                      className="text-sky-800 dark:text-sky-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Leadership Overview →
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Student Life Activities */}
            <div className="space-y-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
              <h3 className="font-display text-base font-bold text-sky-900 dark:text-sky-400 border-b pb-2">
                Active Student Clubs & Societies
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  "Debate Club",
                  "Quiz competitions",
                  "Basketball team",
                  "Football squad",
                  "Music and choir",
                  "Religious formation",
                  "Community service",
                  "Cultural activities"
                ].map((club, idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} flex items-center justify-between`}>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{club}</span>
                    <span className="text-[10px] bg-sky-100 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 px-1.5 py-0.5 rounded font-bold font-mono uppercase">Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: CATHOLIC CORNER */}
        {activeTab === "faith" && (() => {
          const liturgicalSeasons = {
            marian: {
              name: "Marian Feasts",
              color: "Marian Blue & Gold",
              bgClass: "bg-indigo-950 border-indigo-750 text-indigo-50",
              btnClass: "bg-indigo-900 text-white border-indigo-500",
              accentText: "text-indigo-400 dark:text-sky-300",
              borderClass: "border-indigo-800/40",
              bgLight: "bg-indigo-50/10 dark:bg-indigo-950/30",
              accentBorder: "border-indigo-500",
              description: "Heavenly Blue represents the Blessed Virgin Mary's protective mantle, purity, and maternal grace. As Mary Help of Christians (Auxilium Christianorum), she is the celestial patroness of our school and the youth of Liberia.",
              scripture: "My soul proclaims the greatness of the Lord; my spirit rejoices in God my Savior.",
              citation: "Luke 1:46-47",
              guideline: "Worn on Marian Solemnities, including the Feast of Mary Help of Christians (May 24th) and the Solemnity of the Assumption."
            },
            ordinary: {
              name: "Ordinary Time",
              color: "Liturgical Green",
              bgClass: "bg-emerald-950 border-emerald-700 text-emerald-50",
              btnClass: "bg-emerald-800 text-white border-emerald-500",
              accentText: "text-emerald-600 dark:text-emerald-400",
              borderClass: "border-emerald-800/40",
              bgLight: "bg-emerald-50/10 dark:bg-emerald-950/30",
              accentBorder: "border-emerald-500",
              description: "Liturgical Green represents spiritual growth, life, vitality, hope, and the steady day-to-day journey of following Jesus Christ through His public teachings and miracles.",
              scripture: "He is like a tree planted by streams of water, yielding its fruit in season, whose leaf does not wither.",
              citation: "Psalm 1:3",
              guideline: "Worn during the weeks of the year outside of the major holiday seasons, guiding our walk of everyday faith and duty."
            },
            advent: {
              name: "Advent & Lent",
              color: "Penitential Violet",
              bgClass: "bg-purple-950 border-purple-700 text-purple-50",
              btnClass: "bg-purple-800 text-white border-purple-500",
              accentText: "text-purple-600 dark:text-purple-400",
              borderClass: "border-purple-800/40",
              bgLight: "bg-purple-50/10 dark:bg-purple-950/30",
              accentBorder: "border-purple-500",
              description: "Violet/Purple represents repentance, holy sacrifice, solemn preparation, and patient waiting for the coming of our Lord Jesus Christ.",
              scripture: "The voice of one crying in the wilderness: Prepare the way of the Lord, make straight His paths.",
              citation: "Mark 1:3",
              guideline: "Worn during the liturgical preparation seasons: Advent leading to Christmas, and Lent leading to the Passion and Resurrection."
            },
            christmas: {
              name: "Christmas & Easter",
              color: "Liturgical Gold & White",
              bgClass: "bg-amber-950 border-amber-600 text-amber-50",
              btnClass: "bg-amber-600 text-white border-amber-400",
              accentText: "text-amber-500 dark:text-amber-400",
              borderClass: "border-amber-850",
              bgLight: "bg-amber-500/5 dark:bg-amber-950/20",
              accentBorder: "border-amber-500",
              description: "White and Gold symbolize absolute joy, purity, triumph, divine light, and the glory of the Incarnation of Christ and His victory over death.",
              scripture: "For today in the city of David a Savior has been born to you, who is Christ the Lord.",
              citation: "Luke 2:11",
              guideline: "Worn on the major celebrations of our Lord, including the Nativity (Christmas), the Resurrection (Easter), and feasts of non-martyr saints."
            },
            martyrs: {
              name: "Feasts of Martyrs & Holy Spirit",
              color: "Martyr Crimson (Red)",
              bgClass: "bg-rose-950 border-rose-700 text-rose-50",
              btnClass: "bg-rose-800 text-white border-rose-500",
              accentText: "text-rose-600 dark:text-rose-400",
              borderClass: "border-rose-800/40",
              bgLight: "bg-rose-50/10 dark:bg-rose-950/30",
              accentBorder: "border-rose-500",
              description: "Liturgical Red represents the fire of the Holy Spirit, divine love, and the ultimate sacrifice of Christ on the Cross and His holy apostles and martyrs.",
              scripture: "No one has greater love than this, to lay down one’s life for one’s friends.",
              citation: "John 15:13",
              guideline: "Worn on Palm Sunday, Good Friday, Pentecost Sunday, and the feast days of apostles and holy martyrs."
            }
          };

          const prayers = {
            donbosco: {
              title: "Don Bosco's Student Prayer",
              latin: "Oratio pro Discipulis",
              text: `O Saint John Bosco, Father and Teacher of Youth, 
I offer you my day, my studies, and my play. 
Obtain for me the grace to know the truth, 
to love what is good, and to walk in the way of integrity.
Keep me safe under the mantle of Mary Help of Christians, 
and help me to be a faithful child of God and a useful citizen of Liberia. 
Amen.`
            },
            angelus: {
              title: "The Angelus Prayer",
              latin: "Angelus Domini",
              text: `V. The Angel of the Lord declared unto Mary,
R. And she conceived of the Holy Spirit. (Hail Mary...)

V. Behold the handmaid of the Lord.
R. Be it done unto me according to thy word. (Hail Mary...)

V. And the Word was made flesh.
R. And dwelt among us. (Hail Mary...)

V. Pray for us, O Holy Mother of God.
R. That we may be made worthy of the promises of Christ.

Let us pray: Pour forth, we beseech Thee, O Lord, Thy grace into our hearts; that, as we have known the Incarnation of Christ, Thy Son, by the message of an Angel, so by His Passion and Cross we may be brought to the glory of His Resurrection. Through the same Christ our Lord. Amen.`
            },
            consecration: {
              title: "Consecration to Mary Help of Christians",
              latin: "Actus Consecrationis",
              text: `Most Holy Virgin Mary, Help of Christians, 
I choose you this day to be my Mother, my Queen, and my Guide. 
I consecrate to your maternal heart my mind, my studies, my body, and my life. 
Protect our school campus, our teachers, our families, and the youth of Liberia. 
Obtain for me the grace of a pure heart, a sharp mind, and a deep love for Jesus. 
Under your holy shield, I fear nothing. 
Mary, Help of Christians, pray for us! 
Amen.`
            }
          };

          const currentSeason = liturgicalSeasons[selectedSeason];

          return (
            <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-fade-in text-left">
              
              {/* Catholic Corner Header Accent */}
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-3xl mb-1 shadow-md animate-pulse">
                  ⛪
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-indigo-950 dark:text-sky-300">
                  Catholic Liturgical Year & Identity
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Welcome to the spiritual heart of Mary Help of Christians High School. Explore the traditional liturgical colors of the Church, read Salesian prayers, and learn about our holy patrons.
                </p>
              </div>

              {/* Liturgical Seasons Interactive Simulator Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                <div>
                  <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-400 font-mono mb-3 text-center sm:text-left">
                    Select a Liturgical Season to Apply its Church Colors
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {Object.entries(liturgicalSeasons).map(([key, season]) => {
                      const isSelected = selectedSeason === key;
                      let badgeColor = "";
                      if (key === "marian") badgeColor = "bg-indigo-900 border-indigo-750 text-indigo-100";
                      else if (key === "ordinary") badgeColor = "bg-emerald-700 border-emerald-600 text-emerald-100";
                      else if (key === "advent") badgeColor = "bg-purple-800 border-purple-600 text-purple-100";
                      else if (key === "christmas") badgeColor = "bg-amber-600 border-amber-500 text-amber-100";
                      else if (key === "martyrs") badgeColor = "bg-rose-700 border-rose-600 text-rose-100";

                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedSeason(key as any)}
                          className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                            isSelected 
                              ? `${badgeColor} ring-4 ring-amber-500/30 font-bold scale-[1.03] shadow-lg` 
                              : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          <span className="block text-xs font-semibold">{season.name}</span>
                          <span className="text-[9px] opacity-80 block font-mono mt-0.5">{season.color}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated Liturgical Altar Backdrop */}
                <div className={`p-6 sm:p-8 rounded-2xl border transition-all duration-500 ${currentSeason.bgClass} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
                  <div className="space-y-4 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="bg-white/20 px-2.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest uppercase">
                        Active Liturgical Setting
                      </span>
                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    </div>
                    <h4 className="font-display font-extrabold text-xl sm:text-2xl">
                      Season of {currentSeason.name}
                    </h4>
                    <p className="text-xs sm:text-sm font-light leading-relaxed opacity-95">
                      {currentSeason.description}
                    </p>
                    <div className="p-3 bg-black/25 rounded-xl border border-white/10 text-[10px] sm:text-xs">
                      <p className="font-bold uppercase tracking-wider text-amber-300 mb-1 font-mono text-[9px]">Liturgy Instruction:</p>
                      <p className="font-light opacity-90">{currentSeason.guideline}</p>
                    </div>
                  </div>

                  <div className="bg-white/10 dark:bg-black/20 p-5 rounded-2xl border border-white/20 text-center space-y-3 min-w-[220px]">
                    <span className="text-3xl block">📖</span>
                    <p className="text-xs sm:text-sm italic font-serif leading-relaxed px-1">
                      "{currentSeason.scripture}"
                    </p>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300">
                      — {currentSeason.citation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid: Daily Prayer Book vs Salesian Pillars */}
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Column 1: Prayer Book Card */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-5">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <span className="text-xl">📿</span>
                    <div>
                      <h4 className="font-display font-bold text-slate-800 dark:text-slate-100 text-sm">
                        Daily Liturgical Prayer Book
                      </h4>
                      <p className="text-[10px] font-mono text-slate-400">PRAYERS OF THE SALESIAN TRADITION</p>
                    </div>
                  </div>

                  <div className="flex gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                    {Object.entries(prayers).map(([key, prayer]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedPrayer(key)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all cursor-pointer ${
                          selectedPrayer === key
                            ? "bg-amber-500 text-sky-950 font-bold shadow"
                            : "bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 border border-slate-150 text-slate-500"
                        }`}
                      >
                        {prayer.title.split(" ")[0]}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <h5 className="font-display font-bold text-xs text-indigo-950 dark:text-sky-300">
                        {prayers[selectedPrayer as keyof typeof prayers].title}
                      </h5>
                      <span className="text-[8px] font-mono text-slate-400 italic">
                        {prayers[selectedPrayer as keyof typeof prayers].latin}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed font-serif">
                      {prayers[selectedPrayer as keyof typeof prayers].text}
                    </p>
                  </div>
                </div>

                {/* Column 2: Salesian Saints Gallery */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-5">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <span className="text-xl">🌟</span>
                    <div>
                      <h4 className="font-display font-bold text-slate-800 dark:text-slate-100 text-sm">
                        Our Salesian Saint Pillars
                      </h4>
                      <p className="text-[10px] font-mono text-slate-400">PATRONS OF REASON, FAITH & KINDNESS</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500 shrink-0">
                        <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=150" className="w-full h-full object-cover" alt="St. John Bosco" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-display font-bold text-xs text-slate-800 dark:text-slate-100">Saint John Bosco</h5>
                          <span className="text-[8px] font-mono bg-amber-500/10 text-amber-600 font-bold px-1.5 py-0.5 rounded">FOUNDER</span>
                        </div>
                        <p className="text-[10px] text-slate-400">1815 – 1888 • Feast Day: January 31</p>
                        <p className="text-xs text-slate-500 leading-normal mt-1 italic">
                          "Run, jump, make noise, but do not sin." Dedicated his entire life to the education and spiritual instruction of marginalized youth.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500 shrink-0">
                        <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=150" className="w-full h-full object-cover" alt="St. Mary Mazzarello" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-display font-bold text-xs text-slate-800 dark:text-slate-100">Saint Mary Mary Help of Christians</h5>
                          <span className="text-[8px] font-mono bg-indigo-500/10 text-indigo-500 font-bold px-1.5 py-0.5 rounded">CO-FOUNDRESS</span>
                        </div>
                        <p className="text-[10px] text-slate-400">1837 – 1881 • Feast Day: May 13</p>
                        <p className="text-xs text-slate-500 leading-normal mt-1 italic">
                          "With Mary Help of Christians, we can do all things." Co-founded the Salesian Sisters to educate poor young girls.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 shrink-0">
                        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150" className="w-full h-full object-cover" alt="St. Dominic Savio" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-display font-bold text-xs text-slate-800 dark:text-slate-100">Saint Dominic Savio</h5>
                          <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-600 font-bold px-1.5 py-0.5 rounded">STUDENT PATRON</span>
                        </div>
                        <p className="text-[10px] text-slate-400">1842 – 1857 • Feast Day: May 6</p>
                        <p className="text-xs text-slate-500 leading-normal mt-1 italic">
                          "Death rather than sin!" Promoted everyday holiness by serving Mass with joy and acting as an exemplary student leader.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Call to Action Chaplain Devotionals & Requests */}
              <div className="p-6 rounded-3xl bg-amber-500/5 dark:bg-amber-950/20 border-2 border-dashed border-amber-500/30 text-center space-y-4">
                <span className="text-3xl">🕊️</span>
                <h4 className="font-display font-bold text-sm text-indigo-950 dark:text-sky-300">
                  Mass Intentions & Prayer Petitions
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                  Are you a student or parent facing studies, exams, or family challenges? Log in to your secure School Portal to send Mass intention requests to Father Joseph, our student chaplain, or submit custom prayer petitions.
                </p>
                <div>
                  <button
                    onClick={onLoginClick}
                    className="bg-amber-500 hover:bg-amber-600 text-sky-950 font-bold px-6 py-2.5 rounded-full text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Log In to Send Prayer Request
                  </button>
                </div>
              </div>

            </div>
          );
        })()}

        {/* TAB: AI CAMPUS ASSISTANT */}
        {activeTab === "assistant" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-sky-900 dark:text-sky-400">
                Interactive AI Campus Assistant
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                A high-fidelity intelligent companion with real-time Google Search and Google Maps grounding for directions, distances, school guidelines, and latest Monrovia community updates.
              </p>
            </div>
            
            <MhcAssistant darkMode={darkMode} />
          </div>
        )}

        {/* TAB: CONTACT US */}
        {activeTab === "contact" && (
          <div className="max-w-lg mx-auto px-4 py-12 space-y-8">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-sky-900 dark:text-sky-400 text-center">Contact Campus Office</h2>
            <div className={`p-6 rounded-3xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-xl`}>
              {contactSuccess ? (
                <div className="text-center py-8 space-y-2">
                  <span className="text-4xl text-emerald-500">✓</span>
                  <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">Message Sent Successfully!</h4>
                  <p className="text-xs text-slate-500">Thank you for contacting Mary Help of Christians High School. We will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Your Name</label>
                    <input
                      required
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className={`w-full text-xs p-3 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Email Address</label>
                    <input
                      required
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className={`w-full text-xs p-3 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
                      placeholder="e.g. johndoe@gmail.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Your Message</label>
                    <textarea
                      required
                      rows={4}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      className={`w-full text-xs p-3 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
                      placeholder="How can we assist you?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold p-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                  >
                    Submit Query
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-sky-950 text-slate-300 py-12 px-4 border-t border-sky-900">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white overflow-hidden border border-yellow-500 shadow-inner shrink-0">
                <img
                  src={schoolLogo}
                  alt="MHC Seal Small"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="font-display font-extrabold text-white text-sm leading-tight">Mary Help of Christians</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Providing quality Catholic education and molding the youth of Monrovia with Salesian values since 2003.
            </p>
            <p className="text-[10px] font-mono text-slate-500">Motto: "To Serve God and Humanity"</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-display font-bold text-white text-sm">Quick Links</h4>
            <ul className="text-xs space-y-2">
              <li><button onClick={() => setActiveTab("about")} className="hover:text-yellow-400 cursor-pointer">About Mission</button></li>
              <li><button onClick={() => setActiveTab("admissions")} className="hover:text-yellow-400 cursor-pointer">Enrollment Info</button></li>
              <li><button onClick={() => setActiveTab("faith")} className="hover:text-yellow-400 cursor-pointer">Catholic Liturgy</button></li>
              <li><button onClick={onLoginClick} className="hover:text-yellow-400 cursor-pointer">Administrative Portal</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-display font-bold text-white text-sm">Academics</h4>
            <ul className="text-xs space-y-2">
              <li>Kindergarten, Elementary, Junior & Senior High</li>
              <li>Salesians of Don Bosco (SDB)</li>
              <li>Under Archdiocese of Monrovia</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-display font-bold text-white text-sm">MHC Liberia Office</h4>
            <p className="text-xs flex items-center gap-1.5"><MapPin className="w-4 h-4 text-yellow-500" /> New Matadi Estate Drive, Sinkor, Monrovia, Liberia</p>
            <p className="text-xs flex items-center gap-1.5"><Phone className="w-4 h-4 text-yellow-500" /> Tel: Not publicly available</p>
            <p className="text-xs flex items-center gap-1.5"><Mail className="w-4 h-4 text-yellow-500" /> Email: Not publicly available</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-sky-900/60 text-center text-[10px] text-slate-500 uppercase tracking-widest font-mono">
          © {new Date().getFullYear()} Mary Help of Christians Catholic High School. All rights reserved. • Designed for Liberia
        </div>
      </footer>

      {/* Interactive Lightbox / Full-Screen Modal for Authentic Photos */}
      {selectedPhotoModal && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
          onClick={() => setSelectedPhotoModal(null)}
        >
          <div 
            className="relative bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col my-auto text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:px-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/80">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono uppercase bg-yellow-500 text-sky-950 font-bold px-2.5 py-0.5 rounded-full">
                  {selectedPhotoModal.category}
                </span>
                {selectedPhotoModal.date && (
                  <span className="text-[10px] font-mono text-slate-400">
                    {selectedPhotoModal.date}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedPhotoModal(null)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="bg-black flex items-center justify-center p-2 sm:p-4 max-h-[65vh] overflow-hidden">
              <img
                src={selectedPhotoModal.src}
                alt={selectedPhotoModal.title}
                className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Modal Caption & Details */}
            <div className="p-5 sm:p-6 bg-slate-900 space-y-2">
              <h3 className="font-display font-bold text-lg sm:text-xl text-yellow-400">
                {selectedPhotoModal.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                {selectedPhotoModal.description}
              </p>
              {selectedPhotoModal.details && (
                <p className="text-[11px] font-mono text-sky-400 pt-1">
                  {selectedPhotoModal.details}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
