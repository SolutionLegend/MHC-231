import React, { useState, useEffect } from "react";
import { 
  Database, CheckCircle2, AlertCircle, RefreshCw, Key, Link as LinkIcon, 
  Copy, ExternalLink, ShieldCheck, Sparkles, X, Terminal, ServerOff
} from "lucide-react";
import { 
  getSupabaseUrl, getSupabaseAnonKey, isSupabaseConfigured, 
  getSupabaseProjectId, saveSupabaseConfig, clearSupabaseConfig, testSupabaseConnection 
} from "../services/supabaseClient";
import { supabaseService } from "../services/supabaseService";

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged?: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose, onConfigChanged }) => {
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [status, setStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUrl(getSupabaseUrl());
      setKey(getSupabaseAnonKey());
      setStatus("idle");
      setStatusMsg("");
      setSeedResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfigured = isSupabaseConfigured();

  const handleTestConnection = async () => {
    setStatus("testing");
    setStatusMsg("Testing connection to Supabase...");
    const res = await testSupabaseConnection(url, key);
    if (res.success) {
      setStatus("success");
      setStatusMsg(res.message);
    } else {
      setStatus("error");
      setStatusMsg(res.message);
    }
  };

  const handleSave = async () => {
    saveSupabaseConfig(url, key);
    handleTestConnection();
    if (onConfigChanged) onConfigChanged();
  };

  const handleClear = () => {
    clearSupabaseConfig();
    setUrl("");
    setKey("");
    setStatus("idle");
    setStatusMsg("Credentials cleared. Reverted to campus local storage engine.");
    if (onConfigChanged) onConfigChanged();
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const result = await supabaseService.seedSupabaseDatabase();
      if (result.success) {
        setSeedResult(`✅ ${result.message} (${result.seededCount} records uploaded)`);
      } else {
        setSeedResult(`⚠️ ${result.message}`);
      }
    } catch (err: any) {
      setSeedResult(`❌ Seeding failed: ${err.message || err}`);
    } finally {
      setSeeding(false);
    }
  };

  const projectId = getSupabaseProjectId();

  const copySqlSchema = () => {
    const sql = `-- Mary Help of Christians Catholic High School - Complete Supabase Database Schema
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/${projectId}/sql/new

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Entities
CREATE TABLE IF NOT EXISTS public.students (user_id TEXT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE, class_id TEXT NOT NULL, admission_no TEXT UNIQUE NOT NULL, status TEXT DEFAULT 'Active', parent_id TEXT);
CREATE TABLE IF NOT EXISTS public.parents (user_id TEXT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE, phone TEXT, address TEXT, child_ids TEXT[] DEFAULT '{}');
CREATE TABLE IF NOT EXISTS public.teachers (user_id TEXT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE, designation TEXT, qualifications TEXT, subjects TEXT[] DEFAULT '{}');
CREATE TABLE IF NOT EXISTS public.staff (user_id TEXT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE, department TEXT, tasks TEXT[] DEFAULT '{}');
CREATE TABLE IF NOT EXISTS public.classes (id TEXT PRIMARY KEY, name TEXT NOT NULL, grade_level TEXT NOT NULL, adviser_id TEXT);
CREATE TABLE IF NOT EXISTS public.subjects (id TEXT PRIMARY KEY, name TEXT NOT NULL, code TEXT NOT NULL, class_id TEXT, teacher_id TEXT);
CREATE TABLE IF NOT EXISTS public.attendance (id TEXT PRIMARY KEY, date DATE NOT NULL, student_id TEXT NOT NULL, class_id TEXT NOT NULL, status TEXT NOT NULL, remarks TEXT);
CREATE TABLE IF NOT EXISTS public.results (id TEXT PRIMARY KEY, student_id TEXT NOT NULL, subject_id TEXT NOT NULL, exam_term TEXT NOT NULL, score NUMERIC NOT NULL, max_score NUMERIC DEFAULT 100, grade TEXT, teacher_remarks TEXT);
CREATE TABLE IF NOT EXISTS public.payments (id TEXT PRIMARY KEY, student_id TEXT NOT NULL, amount NUMERIC NOT NULL, purpose TEXT NOT NULL, status TEXT NOT NULL, receipt_url TEXT, date DATE NOT NULL, verified BOOLEAN DEFAULT FALSE, remarks TEXT, invoice_no TEXT);
CREATE TABLE IF NOT EXISTS public.posts (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, author_name TEXT NOT NULL, author_role TEXT NOT NULL, content TEXT NOT NULL, image_url TEXT, likes TEXT[] DEFAULT '{}', comments JSONB DEFAULT '[]'::jsonb, anonymous BOOLEAN DEFAULT FALSE, section TEXT DEFAULT 'feed', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.clubs (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, category TEXT, president_id TEXT, members TEXT[] DEFAULT '{}');
CREATE TABLE IF NOT EXISTS public.library_resources (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT, type TEXT NOT NULL, file_url TEXT NOT NULL, subject_id TEXT, uploaded_by TEXT, download_count INT DEFAULT 0, created_at DATE DEFAULT CURRENT_DATE);
CREATE TABLE IF NOT EXISTS public.suggestions (id TEXT PRIMARY KEY, title TEXT NOT NULL, content TEXT NOT NULL, category TEXT, status TEXT DEFAULT 'Pending', date DATE DEFAULT CURRENT_DATE);
CREATE TABLE IF NOT EXISTS public.prayer_requests (id TEXT PRIMARY KEY, name TEXT, intention TEXT NOT NULL, date DATE DEFAULT CURRENT_DATE, prayers_count INT DEFAULT 1);
CREATE TABLE IF NOT EXISTS public.audit_logs (id TEXT PRIMARY KEY, user_id TEXT, username TEXT, role TEXT, action TEXT NOT NULL, details TEXT, ip_address TEXT, timestamp TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.emergency_alerts (id SERIAL PRIMARY KEY, active BOOLEAN DEFAULT FALSE, message TEXT DEFAULT '', severity TEXT DEFAULT 'medium', timestamp TIMESTAMPTZ DEFAULT NOW());

-- Initial Alert record
INSERT INTO public.emergency_alerts (id, active, message, severity)
VALUES (1, FALSE, '', 'medium')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security & Allow Anon Client Access
DO $$ 
DECLARE
  tbl text;
BEGIN
  FOR tbl IN 
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Public access policy" ON public.%I', tbl);
    EXECUTE format('CREATE POLICY "Public access policy" ON public.%I FOR ALL USING (true) WITH CHECK (true)', tbl);
  END LOOP;
END $$;
`;

    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-sky-950 text-white flex items-center justify-between border-b border-emerald-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                Supabase Backend & Database
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-medium border border-emerald-500/30">
                  Node.js & Express Free
                </span>
              </h3>
              <p className="text-xs text-emerald-200/80">Direct client-to-cloud architecture for Mary Help of Christians</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Status Banner */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            isConfigured 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-200" 
              : "bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200"
          }`}>
            {isConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <ServerOff className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <p className="font-semibold text-sm">
                {isConfigured ? "Connected to Supabase Project" : "Zero-Server Mode (Campus Local Engine Active)"}
              </p>
              <p className="opacity-90 leading-relaxed">
                {isConfigured 
                  ? "All 10 school dashboards, academic grades, finance payments, and community posts connect directly to your live Supabase cloud database with zero Node.js server overhead."
                  : "The app is currently operating in local BaaS mode. You can test all 10 roles immediately or connect your live Supabase project below."}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Supabase Project URL</span>
                <span className="text-[11px] font-normal text-slate-500">e.g. https://xyzcompany.supabase.co</span>
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Supabase Anon Public API Key</span>
                <span className="text-[11px] font-normal text-slate-500">From Settings &gt; API</span>
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </div>

            {/* Test Status feedback */}
            {statusMsg && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                status === "success" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800" :
                status === "error" ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800" :
                "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
              }`}>
                {status === "testing" && <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />}
                {status === "success" && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                {status === "error" && <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                <span>{statusMsg}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Save & Connect
              </button>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={status === "testing" || !url || !key}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${status === "testing" ? "animate-spin" : ""}`} />
                Test Ping
              </button>

              {isConfigured && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-medium text-xs transition-colors ml-auto"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>

          {/* Quick Database Seeder & Schema copy */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Supabase Project Provisioning Tools
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 space-y-2">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">1. SQL Schema Script</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Run our ready-made PostgreSQL script in your Supabase SQL Editor to instantly create all 18 tables and security policies.
                </p>
                <button
                  type="button"
                  onClick={copySqlSchema}
                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? "Copied SQL to Clipboard!" : "Copy SQL Script"}
                </button>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 space-y-2">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">2. One-Click Seeder</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Upload initial Mary Help of Christians teachers, students, exam results, and prayer intentions directly to Supabase.
                </p>
                <button
                  type="button"
                  onClick={handleSeedDatabase}
                  disabled={seeding || !isConfigured}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${seeding ? "animate-spin" : ""}`} />
                  {seeding ? "Seeding Records..." : "Seed Live Supabase"}
                </button>
              </div>
            </div>

            {seedResult && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-800 dark:text-slate-200 font-mono">
                {seedResult}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href={`https://supabase.com/dashboard/project/${projectId}/sql/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
            >
              Open SQL Editor in Supabase ({projectId})
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
