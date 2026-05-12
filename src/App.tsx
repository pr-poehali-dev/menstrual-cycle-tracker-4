import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CyclePage from "@/pages/CyclePage";
import CalendarPage from "@/pages/CalendarPage";
import PregnancyPage from "@/pages/PregnancyPage";
import SymptomsPage from "@/pages/SymptomsPage";
import StatsPage from "@/pages/StatsPage";
import RemindersPage from "@/pages/RemindersPage";

const queryClient = new QueryClient();

type Tab = "cycle" | "calendar" | "pregnancy" | "symptoms" | "stats" | "reminders";

const tabs: { id: Tab; label: string; emoji: string }[] = [
  { id: "cycle", label: "Цикл", emoji: "🌸" },
  { id: "calendar", label: "Календарь", emoji: "📅" },
  { id: "pregnancy", label: "Беременность", emoji: "🤰" },
  { id: "symptoms", label: "Симптомы", emoji: "💊" },
  { id: "stats", label: "Статистика", emoji: "📊" },
  { id: "reminders", label: "Напоминания", emoji: "🔔" },
];

function AppInner() {
  const [activeTab, setActiveTab] = useState<Tab>("cycle");

  const renderPage = () => {
    switch (activeTab) {
      case "cycle": return <CyclePage />;
      case "calendar": return <CalendarPage />;
      case "pregnancy": return <PregnancyPage />;
      case "symptoms": return <SymptomsPage />;
      case "stats": return <StatsPage />;
      case "reminders": return <RemindersPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(244,143,177,0.18) 0%, transparent 70%)" }} />
        <div className="absolute top-1/3 -left-16 w-56 h-56 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(206,147,216,0.15) 0%, transparent 70%)" }} />
        <div className="absolute bottom-32 -right-10 w-48 h-48 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(244,143,177,0.18) 0%, transparent 70%)" }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 px-5 pt-6 pb-3"
        style={{ background: "rgba(253, 240, 245, 0.85)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-light" style={{ color: "#e06090", letterSpacing: "0.02em" }}>
              Луна
            </h1>
            <p className="text-xs font-body mt-0.5" style={{ color: "#b088b0" }}>
              твой личный трекер
            </p>
          </div>
          <div className="w-11 h-11 rounded-full flex items-center justify-center animate-float"
            style={{ background: "linear-gradient(135deg, #f48fb1, #ce93d8)" }}>
            <span className="text-xl">🌙</span>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 px-4 pb-28 pt-3 animate-fade-in" key={activeTab}>
        {renderPage()}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-3 pb-4">
        <div className="glass-card rounded-2xl px-2 py-2">
          <div className="grid grid-cols-6 gap-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-tab flex flex-col items-center gap-0.5 py-2 px-0.5 rounded-xl ${activeTab === tab.id ? "active" : ""}`}
              >
                <span className="text-base leading-none">{tab.emoji}</span>
                <span className={`text-[9px] font-body font-medium leading-none mt-0.5 ${
                  activeTab === tab.id ? "text-white" : "text-rose-300"
                }`}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AppInner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
