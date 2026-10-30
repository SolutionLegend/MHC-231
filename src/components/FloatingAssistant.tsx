import React, { useState, useRef, useEffect } from "react";
import { 
  Send, Bot, User, Sparkles, MapPin, Search, Compass, Navigation, 
  HelpCircle, Crosshair, AlertCircle, RefreshCw, Landmark, ExternalLink, 
  ShieldCheck, MessageSquare, X, Minimize2 
} from "lucide-react";
import schoolLogo from "../assets/images/mhc_school_logo_1782582379420.jpg";
import { askCampusAssistant } from "../services/aiService";

interface Message {
  role: "user" | "model";
  text: string;
  sources?: Array<{
    title: string;
    url: string;
    type: "web" | "maps";
  }>;
}

const TEMPLATE_QUESTIONS = [
  {
    text: "What are the academic policies & grading systems at MHC?",
    icon: ShieldCheck,
    category: "Academic"
  },
  {
    text: "Tell me about Mary Help of Christians High School's Catholic identity.",
    icon: Landmark,
    category: "Faith"
  },
  {
    text: "How do I travel to the Sinkor campus from Downtown Monrovia?",
    icon: Navigation,
    category: "Campus"
  }
];

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Welcome! I am your **MHC Campus AI Guide**. I am grounded with live search and map sources across Liberia. How can I assist you with admissions, assignments, school history, or directions today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [groundingMode, setGroundingMode] = useState<"auto" | "maps" | "search" | "none">("auto");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Alert/notify user with a subtle dot when closed if a new message arrived
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setHasNewMessage(true);
    }
  }, [messages.length, isOpen]);

  const handleShareLocation = () => {
    setGpsLoading(true);
    if (!navigator.geolocation) {
      setGpsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
        setGpsLoading(false);
      },
      () => {
        setGpsLoading(false);
      }
    );
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend.trim();
    setInput("");
    setLoading(true);

    const newMessages = [...messages, { role: "user" as const, text: userMsg }];
    setMessages(newMessages);

    try {
      const data = await askCampusAssistant(
        userMsg,
        messages.map(m => ({ role: m.role, text: m.text })),
        groundingMode,
        userLocation || undefined
      );

      setMessages(prev => [
        ...prev,
        {
          role: "model",
          text: data.text || "I was unable to synthesize a response. Let's try another topic.",
          sources: data.sources || []
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: "model",
          text: "⚠️ **Assistant Service Notice:** Please verify that your `GEMINI_API_KEY` is saved in the Settings > Secrets menu."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      let content: React.ReactNode = line;
      
      const boldRegex = /\*\*(.*?)\*\*/g;
      if (boldRegex.test(line)) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        content = parts.map((part, index) => {
          if (index % 2 === 1) {
            return <strong key={index} className="font-extrabold text-sky-950 dark:text-sky-300">{part}</strong>;
          }
          return part;
        });
      }

      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        return (
          <li key={i} className="ml-4 list-disc pl-1 py-0.5 text-xs leading-relaxed">
            {content}
          </li>
        );
      }
      if (line.trim() === "") {
        return <div key={i} className="h-2"></div>;
      }
      return <p key={i} className="text-xs leading-relaxed mb-1">{content}</p>;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      
      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setHasNewMessage(false);
        }}
        id="mhc-fab"
        className="relative group w-14 h-14 rounded-full bg-gradient-to-tr from-sky-900 to-sky-950 text-white flex items-center justify-center shadow-2xl border border-sky-800 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        aria-label="Open AI Campus Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6 animate-spin-once" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6" />
            <Sparkles className="w-3 h-3 absolute top-3.5 right-3.5 text-yellow-400 animate-pulse" />
          </>
        )}

        {/* Pulse alert indicator if new message is waiting */}
        {hasNewMessage && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500 text-[8px] text-sky-950 font-bold items-center justify-center">!</span>
          </span>
        )}

        {/* Floating tooltip label */}
        <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all bg-sky-950 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg border border-sky-850">
          MHC AI Campus Assistant
        </span>
      </button>

      {/* Chat Popover Window */}
      {isOpen && (
        <div 
          className="absolute bottom-18 right-0 w-[92vw] sm:w-[400px] h-[550px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between animate-fade-in z-50 transition-all"
          id="mhc-chat-window"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-sky-900 to-sky-950 text-white flex items-center justify-between border-b border-sky-850">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-yellow-500 shrink-0 shadow-sm">
                <img src={schoolLogo} alt="MHC Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-xs text-white flex items-center gap-1.5">
                  MHC Digital Guide
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </h4>
                <p className="text-[8px] text-sky-300 font-mono">Grounded by Google Intelligence</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-sky-200 hover:text-white transition-colors cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Location & Grounding mini-bar */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px] font-mono">Context:</span>
              <button
                onClick={handleShareLocation}
                disabled={gpsLoading}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md border font-medium cursor-pointer transition-colors ${
                  userLocation 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100"
                }`}
              >
                <Crosshair className="w-2.5 h-2.5" />
                <span>{userLocation ? "GPS Shared" : "Share GPS"}</span>
              </button>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px] font-mono">Mode:</span>
              <select
                value={groundingMode}
                onChange={(e) => setGroundingMode(e.target.value as any)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md px-1.5 py-0.5 text-[9px] font-medium text-slate-600 dark:text-slate-300 focus:outline-none"
              >
                <option value="auto">Auto</option>
                <option value="maps">Maps</option>
                <option value="search">Search</option>
                <option value="none">Fast AI</option>
              </select>
            </div>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-[350px]">
            {messages.map((m, idx) => {
              const isModel = m.role === "model";
              return (
                <div key={idx} className={`flex gap-2.5 max-w-[88%] ${isModel ? "self-start" : "ml-auto flex-row-reverse"}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border overflow-hidden ${
                    isModel 
                      ? "bg-white border-yellow-500 shadow-sm" 
                      : "bg-slate-100 border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-600"
                  }`}>
                    {isModel ? (
                      <img src={schoolLogo} alt="MHC AI" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className={`p-3 rounded-xl border text-slate-800 dark:text-slate-200 ${
                      isModel 
                        ? "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-900/80 rounded-tl-none shadow-sm" 
                        : "bg-sky-900/5 dark:bg-sky-900/10 border-sky-900/10 dark:border-sky-900/20 rounded-tr-none"
                    }`}>
                      {renderMessageText(m.text)}
                    </div>

                    {/* Sources inline citation support */}
                    {isModel && m.sources && m.sources.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {m.sources.map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold rounded border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sky-600 hover:bg-slate-50 shadow-sm"
                          >
                            {src.type === "maps" ? <MapPin className="w-2 h-2 text-emerald-500" /> : <Search className="w-2 h-2 text-sky-500" />}
                            <span className="truncate max-w-[100px]">{src.title}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-2.5 max-w-[88%] self-start">
                <div className="w-7 h-7 rounded-lg bg-white border border-yellow-500 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  <img src={schoolLogo} alt="MHC AI" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="p-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-850 rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-sky-900 dark:bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-sky-900 dark:bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-sky-900 dark:bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Grounded sync...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Preload Suggested Chips */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-850 space-y-3 bg-white dark:bg-slate-950">
            {messages.length <= 2 && !loading && (
              <div className="space-y-1">
                <p className="text-[8px] font-mono text-slate-400 uppercase font-bold tracking-wider">Suggested Queries</p>
                <div className="flex flex-col gap-1.5">
                  {TEMPLATE_QUESTIONS.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(item.text)}
                      className="text-left py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer font-medium truncate"
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="Ask about MHC academic/faith guidelines..."
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-sky-900 hover:bg-sky-950 text-white p-2 rounded-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
