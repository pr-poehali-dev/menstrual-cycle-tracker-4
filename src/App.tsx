import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TodayPage from "@/pages/TodayPage";
import TipsPage from "@/pages/TipsPage";
import MessagesPage from "@/pages/MessagesPage";
import PartnerPage from "@/pages/PartnerPage";

const queryClient = new QueryClient();

type Tab = "today" | "tips" | "messages" | "partner";

function AppInner() {
  const [activeTab, setActiveTab] = useState<Tab>("today");

  const renderPage = () => {
    switch (activeTab) {
      case "today": return <TodayPage />;
      case "tips": return <TipsPage />;
      case "messages": return <MessagesPage />;
      case "partner": return <PartnerPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto" style={{ background: "#fff5f7" }}>
      <main className="flex-1 pb-24">
        {renderPage()}
      </main>

      {/* Bottom nav — точно как на картинке */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white border-t"
        style={{ borderColor: "#f0e0e8" }}>
        <div className="flex items-center justify-around py-2 px-2">
          <NavBtn id="today" active={activeTab} onClick={setActiveTab}
            icon={
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3 9h18" stroke="currentColor" strokeWidth="1.8" />
                <rect x="7" y="13" width="2" height="2" rx="0.5" fill="currentColor" />
                <rect x="11" y="13" width="2" height="2" rx="0.5" fill="currentColor" />
                <rect x="15" y="13" width="2" height="2" rx="0.5" fill="currentColor" />
                <rect x="7" y="17" width="2" height="2" rx="0.5" fill="currentColor" />
                <rect x="11" y="17" width="2" height="2" rx="0.5" fill="currentColor" />
              </svg>
            }
            label="Сегодня" />
          <NavBtn id="tips" active={activeTab} onClick={setActiveTab}
            icon={
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="17" cy="17" r="4" stroke="currentColor" strokeWidth="1.8" />
                <path d="M17 15v2l1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
            label="Советы" />
          <NavBtn id="messages" active={activeTab} onClick={setActiveTab}
            icon={
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <circle cx="9" cy="10" r="1" fill="currentColor" />
                <circle cx="12" cy="10" r="1" fill="currentColor" />
                <circle cx="15" cy="10" r="1" fill="currentColor" />
              </svg>
            }
            label="Сообщения" />
          <NavBtn id="partner" active={activeTab} onClick={setActiveTab}
            icon={
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3 20c0-3.314 2.686-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="17" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" />
                <path d="M21 20c0-3.314-2.686-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
  return (
    <button onClick={() => onClick(id)}
      className="flex flex-col items-center gap-0.5 px-3 py-1 transition-all"
      style={{ color: isActive ? "#e05080" : "#bbb" }}>
      {icon}
      <span className="text-[11px] font-body font-medium">{label}</span>
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
