import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TodayPage from "@/pages/TodayPage";
import TipsPage from "@/pages/TipsPage";
import MessagesPage from "@/pages/MessagesPage";
import PartnerPage from "@/pages/PartnerPage";
import PregnancyPage from "@/pages/PregnancyPage";

const queryClient = new QueryClient();

type Tab = "today" | "pregnancy" | "tips" | "messages" | "partner";

function AppInner() {
  const [activeTab, setActiveTab] = useState<Tab>("today");

  const renderPage = () => {
    switch (activeTab) {
      case "today": return <TodayPage />;
      case "pregnancy": return <PregnancyPage />;
      case "tips": return <TipsPage />;
      case "messages": return <MessagesPage />;
      case "partner": return <PartnerPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto" style={{ background: "#fff5f7" }}>
      <main className="flex-1" style={{ paddingBottom: "calc(68px + env(safe-area-inset-bottom, 0px))" }}>
        {renderPage()}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white border-t"
        style={{ borderColor: "#f0e0e8", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="flex items-center justify-around py-2 px-1">
          <NavBtn id="today" active={activeTab} onClick={setActiveTab}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8"/>
                <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
              </svg>
            }
            label="Сегодня" />
          <NavBtn id="pregnancy" active={activeTab} onClick={setActiveTab}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <ellipse cx="12" cy="13" rx="5" ry="7" stroke="currentColor" strokeWidth="1.8"/>
                <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.8"/>
                <circle cx="10" cy="11" r="1.2" fill="currentColor" opacity="0.5"/>
              </svg>
            }
            label="Беременность" />
          <NavBtn id="tips" active={activeTab} onClick={setActiveTab}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="10" r="6" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M12 16v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M9 19h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M10 10h.01M14 10h.01M10 12a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }
            label="Советы" />
          <NavBtn id="messages" active={activeTab} onClick={setActiveTab}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
            }
            label="Сообщения" />
          <NavBtn id="partner" active={activeTab} onClick={setActiveTab}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M3 20c0-3.314 2.686-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="17" cy="7" r="3" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M21 20c0-3.314-2.686-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            }
            label="Партнёр" />
        </div>
      </nav>
    </div>
  );
}

function NavBtn({ id, active, onClick, icon, label }: {
  id: Tab; active: Tab; onClick: (t: Tab) => void; icon: React.ReactNode; label: string;
}) {
  const isActive = id === active;
  const isPreg = id === "pregnancy";
  return (
    <button onClick={() => onClick(id)}
      className="flex flex-col items-center gap-0.5 py-1 transition-all"
      style={{ color: isActive ? (isPreg ? "#d4904a" : "#e05080") : "#bbb", minWidth: 0, flex: 1 }}>
      {icon}
      <span className="font-body font-medium leading-tight text-center"
        style={{ fontSize: 9, maxWidth: 52 }}>{label}</span>
    </button>
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