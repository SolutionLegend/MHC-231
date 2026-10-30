import React, { useState, useRef, useEffect } from "react";
import { 
  Send, Bot, User, Sparkles, MapPin, Search, Compass, Navigation, 
  HelpCircle, Crosshair, AlertCircle, RefreshCw, Landmark, ExternalLink, ShieldCheck
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

interface MhcAssistantProps {
  darkMode?: boolean;
}

const TEMPLATE_QUESTIONS = [
  {
    text: "Who is the School Principal and Salesian leadership?",
    icon: ShieldCheck,
    category: "Leadership"
  },
  {
    text: "Where is Mary Help of Christians Catholic High School located?",
    icon: MapPin,
    category: "Campus"
  },
  {
    text: "How do I travel to the school in Sinkor from Downtown Monrovia?",
    icon: Navigation,
    category: "Directions"
  },
  {
    text: "What is the history of Mary Help of Christians High School in Liberia?",
    icon: Landmark,
    category: "History"
  }
];

export default function MhcAssistant({ darkMode = false }: MhcAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hello! I am your MHC Campus AI Assistant (Help of Christians Guide). I am fully grounded with Google Search and Google Maps to help you find anything about our campus, school history, academic policies, or route coordinates and travel directions within Monrovia, Liberia. Ask me anything!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [groundingMode, setGroundingMode] = useState<"auto" | "maps" | "search" | "none">("auto");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle GPS Geolocation sharing
  const handleShareLocation = () => {
    setGpsLoading(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setGpsLoading(false);
      },
      (error) => {
        console.error("GPS sharing failed:", error);
        let msg = "Could not fetch GPS. Please verify browser permissions.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "GPS permission denied. Please enable location permissions in browser settings.";
        }
        setGpsError(msg);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleClearLocation = () => {
    setUserLocation(null);
    setGpsError(null);
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend.trim();
    setInput("");
    setLoading(true);

    // Append user message
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
          text: data.text || "I was unable to formulate a response. Please try again.",
          sources: data.sources || []
        }
      ]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        {
          role: "model",
          text: `⚠️ **Assistance Service Notice:** ${err.message || "An unexpected error occurred. Please verify your GEMINI_API_KEY is configured in Settings > Secrets."}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format/render markdown-like text lines beautifully
  const renderMessageText = (text: string) => {
    // Process bullet points and bold sections
    const lines = text.split("\n");
    return lines.map((line, i) => {
      let content: React.ReactNode = line;
      
      // Simple bold formatting replacement **text** -> <strong>text</strong>
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
          <li key={i} className="ml-4 list-disc pl-1 py-0.5 text-xs sm:text-sm leading-relaxed">
            {content}
          </li>
        );
      }
      if (line.trim() === "") {
        return <div key={i} className="h-2"></div>;
      }
      return <p key={i} className="text-xs sm:text-sm leading-relaxed mb-1">{content}</p>;
    });
  };

  return (
    <div className={`grid lg:grid-cols-12 gap-6 rounded-3xl overflow-hidden border ${
      darkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"
    } shadow-2xl min-h-[550px] max-w-7xl mx-auto`}>
      
      {/* Sidebar Controls - Left (4 cols) */}
      <div className="lg:col-span-4 p-5 sm:p-6 space-y-6 flex flex-col justify-between border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
        <div className="space-y-5">
          <div>
            <span className="bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
              Gemini Live Grounding
            </span>
            <h3 className="font-display font-extrabold text-lg text-sky-900 dark:text-sky-400 mt-2">
              Campus AI Companion
            </h3>
            <p className="text-xs text-slate-400 leading-normal mt-1">
              Connect to the high-fidelity Salesian intelligence system for real-time web news and map routes across Liberia.
            </p>
          </div>

          {/* Grounding Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
              Grounding Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setGroundingMode("auto")}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  groundingMode === "auto"
                    ? "bg-sky-900 border-sky-800 text-white font-bold"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Smart Auto</span>
                </div>
                <p className="text-[8px] text-slate-400 font-normal">Detect maps/search</p>
              </button>

              <button
                onClick={() => setGroundingMode("maps")}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  groundingMode === "maps"
                    ? "bg-sky-900 border-sky-800 text-white font-bold"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google Maps</span>
                </div>
                <p className="text-[8px] text-slate-400 font-normal">Strict location search</p>
              </button>

              <button
                onClick={() => setGroundingMode("search")}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  groundingMode === "search"
                    ? "bg-sky-900 border-sky-800 text-white font-bold"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Search className="w-3.5 h-3.5 text-sky-400" />
                  <span>Google Search</span>
                </div>
                <p className="text-[8px] text-slate-400 font-normal">Live web sources</p>
              </button>

              <button
                onClick={() => setGroundingMode("none")}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  groundingMode === "none"
                    ? "bg-sky-900 border-sky-800 text-white font-bold"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fast AI Mode</span>
                </div>
                <p className="text-[8px] text-slate-400 font-normal">No live connections</p>
              </button>
            </div>
          </div>

          {/* User GPS sharing module */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                My Transit Context
              </label>
              {userLocation && (
                <button 
                  onClick={handleClearLocation} 
                  className="text-[9px] text-red-500 hover:underline cursor-pointer"
                >
                  Clear GPS
                </button>
              )}
            </div>

            {userLocation ? (
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-[10px] text-emerald-700 dark:text-emerald-400 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                  Active Location Connected
                </p>
                <p className="font-mono text-[9px] text-slate-500">
                  Latitude: {userLocation.latitude.toFixed(5)}<br />
                  Longitude: {userLocation.longitude.toFixed(5)}
                </p>
                <p className="text-[8px] text-slate-400 font-sans italic leading-tight">
                  Passed automatically to compute school routes and distances.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleShareLocation}
                  disabled={gpsLoading}
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold py-2.5 px-4 rounded-xl text-xs transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {gpsLoading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                      Connecting GPS...
                    </>
                  ) : (
                    <>
                      <Crosshair className="w-3.5 h-3.5 text-sky-500" />
                      Share My GPS for Routes
                    </>
                  )}
                </button>
                {gpsError && (
                  <p className="text-[9px] text-amber-600 bg-amber-500/5 border border-amber-500/10 p-2 rounded-lg leading-relaxed">
                    {gpsError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Security Indicator */}
        <div className="p-3 bg-sky-900/10 dark:bg-sky-950/20 rounded-2xl border border-sky-900/20 space-y-1.5 text-center">
          <p className="text-[10px] font-bold text-sky-900 dark:text-sky-400 uppercase tracking-wide">
            ✓ Double-Grounding Active
          </p>
          <p className="text-[8px] text-slate-500 leading-normal">
            Your location and queries are processed securely on the MHC server-side proxy keeping credentials strictly hidden.
          </p>
        </div>
      </div>

      {/* Chat Conversation Thread - Right (8 cols) */}
      <div className="lg:col-span-8 flex flex-col justify-between min-h-[450px] lg:min-h-[580px] bg-slate-50/30 dark:bg-slate-950/40">
        
        {/* Chat Stream Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[460px] lg:max-h-[500px]">
          {messages.map((m, index) => {
            const isModel = m.role === "model";
            return (
              <div 
                key={index}
                className={`flex gap-3 max-w-[85%] ${isModel ? "self-start" : "ml-auto flex-row-reverse"}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border overflow-hidden ${
                  isModel 
                    ? "bg-white border-yellow-500 shadow-sm" 
                    : "bg-slate-200 border-slate-300 dark:bg-slate-850 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                }`}>
                  {isModel ? (
                    <img src={schoolLogo} alt="MHC AI" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className={`p-4 rounded-2xl border text-slate-800 dark:text-slate-100 ${
                    isModel 
                      ? "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 rounded-tl-none shadow-sm" 
                      : "bg-sky-900/5 dark:bg-sky-900/10 border-sky-900/10 dark:border-sky-900/20 rounded-tr-none"
                  }`}>
                    {renderMessageText(m.text)}
                  </div>

                  {/* Render Sources from Grounding */}
                  {isModel && m.sources && m.sources.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {m.sources.map((src, idx) => (
                        <a
                          key={idx}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sky-600 dark:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors"
                        >
                          {src.type === "maps" ? <MapPin className="w-2.5 h-2.5 text-emerald-500" /> : <Search className="w-2.5 h-2.5 text-sky-500" />}
                          <span className="truncate max-w-[150px]">{src.title}</span>
                          <ExternalLink className="w-2 h-2 text-slate-400" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[85%] self-start">
              <div className="w-8 h-8 rounded-xl bg-white border border-yellow-500 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                <img src={schoolLogo} alt="MHC AI" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 rounded-tl-none shadow-sm flex items-center gap-2">
                <div className="flex space-x-1">
                  <span className="w-2 h-2 bg-sky-900 dark:bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-sky-900 dark:bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-sky-900 dark:bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
                <span className="text-xs text-slate-400 font-mono">Formulating grounded response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800/60 space-y-4 bg-white/40 dark:bg-slate-950/20">
          
          {/* Quick Template Suggestion Chips (only show when conversation is short) */}
          {messages.length <= 2 && !loading && (
            <div className="space-y-1.5">
              <p className="text-[9px] font-mono text-slate-400 uppercase font-bold tracking-wider px-1">
                Frequently Asked Campus Questions
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TEMPLATE_QUESTIONS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSend(item.text)}
                      className="text-left p-2.5 rounded-xl border bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800/80 transition-all flex items-start gap-2.5 cursor-pointer text-xs group"
                    >
                      <div className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/10 group-hover:bg-sky-500/20 transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-400 text-[8px] uppercase tracking-wider">{item.category}</p>
                        <p className="text-slate-600 dark:text-slate-300 font-normal truncate">{item.text}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chat Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Ask anything about campus, news, coordinates, directions in Liberia..."
              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-sky-900 hover:bg-sky-950 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
