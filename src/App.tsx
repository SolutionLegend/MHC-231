import React, { useState } from "react";
import Website from "./components/Website.tsx";
import Portal from "./components/Portal.tsx";
import FloatingAssistant from "./components/FloatingAssistant.tsx";

export default function App() {
  const [currentView, setCurrentView] = useState<"website" | "portal">("website");

  return (
    <div className="font-sans antialiased">
      {currentView === "website" ? (
        <Website onLoginClick={() => setCurrentView("portal")} />
      ) : (
        <Portal onBackToWebsite={() => setCurrentView("website")} />
      )}
      
      {/* Persistent Floating AI Assistant for all site visitors, students, and staff */}
      <FloatingAssistant />
    </div>
  );
}
