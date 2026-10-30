import { GoogleGenAI } from "@google/genai";

// Cache initialized client
let genAIClient: GoogleGenAI | null = null;

function getApiKey(): string {
  // Check process.env (injected by Vite define) or import.meta.env
  const key = 
    process.env.GEMINI_API_KEY || 
    (typeof window !== "undefined" ? localStorage.getItem("mhc_gemini_api_key") : "") ||
    "";
  return key.trim();
}

export function isGeminiAvailable(): boolean {
  const key = getApiKey();
  return Boolean(key && key !== "MY_GEMINI_API_KEY" && key.length > 5);
}

export function saveGeminiApiKey(key: string): void {
  localStorage.setItem("mhc_gemini_api_key", key.trim());
  genAIClient = null;
}

function getGeminiClient(): GoogleGenAI | null {
  const key = getApiKey();
  if (!key || key === "MY_GEMINI_API_KEY") return null;

  if (genAIClient) return genAIClient;

  try {
    genAIClient = new GoogleGenAI({
      apiKey: key,
    });
    return genAIClient;
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI client:", err);
    return null;
  }
}

export interface LiturgyPackage {
  scripture: string;
  saintOfTheDay: string;
  dailyPrayer: string;
  chaplainMessage: string;
  liturgicalColor: "green" | "violet" | "rose" | "white" | "red";
}

const HIGH_FIDELITY_LITURGIES: LiturgyPackage[] = [
  {
    scripture: "John 15:5 - 'I am the vine, you are the branches. He who abides in Me, and I in him, bears much fruit; for without Me you can do nothing.'",
    saintOfTheDay: "Saint John Bosco (1815-1888) - Patron saint of youth and educators, who founded the Salesians and dedicated his entire life to teaching, loving, and sheltering young people.",
    dailyPrayer: "Lord Jesus, bless our studies at Mary Help of Christians High School today. Guide our teachers, protect our families in Monrovia, and help us to grow in faith, wisdom, and loving charity. Amen.",
    chaplainMessage: "Dear Auxilium Family, in the midst of your homework and exam preparations, remember that your worth lies not just in grades, but in the love you share and your devotion to the Lord. Mary Help of Christians, pray for us!",
    liturgicalColor: "white",
  },
  {
    scripture: "Proverbs 3:5-6 - 'Trust in the Lord with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He shall direct your paths.'",
    saintOfTheDay: "Saint Dominic Savio (1842-1857) - A teenage student under St. John Bosco who lived a pure life of prayer, famously declaring, 'Death rather than sin!'",
    dailyPrayer: "Holy Mother Mary, Help of Christians, wrap your protective mantle around Liberia and our beautiful school today. Keep us pure of heart and eager to do good. Amen.",
    chaplainMessage: "Brothers and sisters, saintliness is not for a select few; it is for all of us. Start by doing your ordinary duties extraordinarily well, with joy and peace in your hearts. God bless you.",
    liturgicalColor: "green",
  },
  {
    scripture: "Philippians 4:13 - 'I can do all things through Christ who strengthens me.'",
    saintOfTheDay: "Saint Teresa of Calcutta (1910-1997) - Dedicated her life to serving the poorest of the poor on the streets, teaching us that we can do 'no great things, only small things with great love.'",
    dailyPrayer: "Almighty Father, give us the grace to see Christ in each of our classmates today. May our speech be kind, our hearts humble, and our hands ready to serve. Amen.",
    chaplainMessage: "When things get heavy, remember you never walk alone. Christ is your strength, and our school community is here to hold you up. Have a blessed and fruitful day!",
    liturgicalColor: "green",
  },
];

export async function fetchDailyLiturgy(): Promise<LiturgyPackage> {
  const ai = getGeminiClient();
  if (ai) {
    try {
      const todayString = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate a beautiful, inspiring Daily Catholic Spiritual Package for Mary Help of Christians Catholic High School, Liberia, for today: ${todayString}.
Since the school is managed in the Salesian spirit (Mary Help of Christians / Don Bosco), please weave in a warm Catholic atmosphere, referencing Liberia where appropriate.

Format the entire response as a single, valid JSON object with EXACTLY the following keys:
- "scripture": a meaningful daily bible verse (text and citation)
- "saintOfTheDay": name of the saint, active years, and a brief 1-2 sentence inspiring summary of their life and patronage
- "dailyPrayer": a warm, comforting prayer specifically tailored for students and staff at MHC
- "chaplainMessage": a 2-3 sentence spiritual message of encouragement from Father Joseph, the School Chaplain
- "liturgicalColor": one of these exact words: "green", "violet", "rose", "white", or "red"

Return ONLY the raw JSON string without markdown quotes.`,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text?.trim() || "";
      const parsed = JSON.parse(text);
      if (parsed.scripture && parsed.dailyPrayer) {
        return parsed as LiturgyPackage;
      }
    } catch (err) {
      console.warn("Failed to generate dynamic liturgy with Gemini, using Salesian liturgical calendar", err);
    }
  }

  const idx = new Date().getDate() % HIGH_FIDELITY_LITURGIES.length;
  return HIGH_FIDELITY_LITURGIES[idx];
}

export interface GroundedChatMessage {
  role: "user" | "model";
  text: string;
}

export interface GroundedChatResponse {
  text: string;
  sources?: Array<{
    title: string;
    url: string;
    type: "web" | "maps";
  }>;
}

export async function askCampusAssistant(
  message: string,
  history: GroundedChatMessage[] = [],
  groundingMode: "auto" | "search" | "maps" = "auto",
  latLng?: { latitude: number; longitude: number }
): Promise<GroundedChatResponse> {
  const ai = getGeminiClient();
  if (!ai) {
    return {
      text: "MHC Campus AI Assistant is ready. To enable live Google Search and Google Maps grounding, provide a GEMINI_API_KEY in your environment or secrets.",
      sources: [],
    };
  }

  const SYSTEM_INSTRUCTION = `You are the MHC Campus AI Assistant (Help of Christians Guide) for Mary Help of Christians Catholic High School in Monrovia, Montserrado County, Liberia.

Here is the VERIFIED school information you MUST use:
- Official Name: Mary Help of Christians Catholic High School
- Location: New Matadi Estate Drive, Sinkor, Monrovia, Montserrado County, Liberia
- Founded: 17 November 2003
- School Type: Private Catholic School
- Ownership/Management: Salesians of Don Bosco (SDB), under the Catholic Education Secretariat of the Archdiocese of Monrovia
- Motto: "To Serve God and Humanity"
- History: Mary Help of Christians Catholic High School was officially opened on 17 November 2003 by the Salesians of Don Bosco to provide quality Catholic education to children and youth in the communities of New Matadi, Old Matadi, Airfield, Lakpazee, Fiamah, and surrounding areas. Since its establishment, the school has expanded its facilities and academic programs, including the addition of a modern science laboratory.
- School Principal: Rev. Fr. Solomon Gbaki, SDB
- Parish Priest & Salesian Rector: Rev. Fr. Augustine Okeke, SDB
- Youth Coordinator: Br. Joseph Collins, SDB
- Mission: Provide quality Catholic education by promoting academic excellence, Christian values, discipline, leadership, character formation, and service to God and humanity.
- Educational Levels: Kindergarten, Elementary School, Junior High School, Senior High School.
- Facilities: Standard classrooms, Science laboratory, Library, Computer laboratory, Sports facilities, School chapel, Assembly hall, Administrative offices.
- Student Life: Debate Club, Quiz competitions, Basketball, Football, Music and choir, Religious formation, Community service, Cultural activities.
- Achievements: Winner of the 2024 Montserrado Regional Debate Championship, Winner of the 2025 Don Bosco Feast Day Celebration Sports Tournament (Basketball Category), Active participation in Don Bosco sports competitions, Strong academic and moral formation programs.
- Core Values: Faith, Discipline, Excellence, Respect, Integrity, Service, Leadership, Responsibility.
- School Philosophy: Educating young people according to the educational system of St. John Bosco by nurturing the whole person spiritually, morally, intellectually, socially, and physically.

CRITICAL INSTRUCTION FOR UNVERIFIED INFORMATION:
For any of the following fields, you MUST NOT guess or generate information. You must clearly state that they are "Not publicly available":
- Official Email Address
- Telephone Numbers
- Tuition Fees
- Admission Requirements
- School Calendar

Keep your tone warm, respectful, academic, and Catholic-oriented (faithful, polite, helpful). When asked about the School Principal, state with certainty that the Principal is Rev. Fr. Solomon Gbaki, SDB.`;

  try {
    let mode = groundingMode;
    if (mode === "auto") {
      const msgLower = message.toLowerCase();
      const needsMap = ["map", "route", "direction", "where", "landmark", "distance", "kilometers", "km", "reach", "travel", "located", "transit", "monrovia", "sinkor", "matadi", "bushrod", "airport", "way to"].some(keyword => msgLower.includes(keyword));
      mode = needsMap ? "maps" : "search";
    }

    let tools: any[] = [];
    let toolConfig: any = undefined;

    if (mode === "maps") {
      tools = [{ googleMaps: {} }];
      const lat = latLng?.latitude || 6.2907; // Monrovia New Matadi coordinates
      const lng = latLng?.longitude || -10.7788;
      toolConfig = {
        retrievalConfig: {
          latLng: { latitude: lat, longitude: lng },
        },
      };
    } else if (mode === "search") {
      tools = [{ googleSearch: {} }];
    }

    const contents = [
      ...history.map((msg) => ({
        role: msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: tools.length > 0 ? tools : undefined,
        toolConfig: toolConfig,
      },
    });

    const textOutput = response.text || "";
    const chunks = (response.candidates?.[0] as any)?.groundingMetadata?.groundingChunks || [];
    const sources = chunks.map((chunk: any) => {
      if (chunk.web) {
        return { title: chunk.web.title, url: chunk.web.uri, type: "web" as const };
      } else if (chunk.maps) {
        return { title: chunk.maps.title || "Google Maps Landmark", url: chunk.maps.uri, type: "maps" as const };
      }
      return null;
    }).filter(Boolean);

    return { text: textOutput, sources };
  } catch (err: any) {
    console.error("Campus Assistant error:", err);
    throw err;
  }
}
