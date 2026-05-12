import { useState } from "react";
import Icon from "@/components/ui/icon";

type Reminder = {
  id: string;
  emoji: string;
  title: string;
  time: string;
  days: string;
  enabled: boolean;
  color: string;
};

const defaultReminders: Reminder[] = [
  { id: "period", emoji: "🌹", title: "Начало менструации", time: "09:00", days: "По дням цикла", enabled: true, color: "#f48fb1" },
  { id: "fertile", emoji: "✨", title: "Фертильные дни", time: "08:00", days: "По дням цикла", enabled: true, color: "#ce93d8" },
  { id: "ovulation", emoji: "💫", title: "День овуляции", time: "08:00", days: "По дням цикла", enabled: false, color: "#e06090" },
  { id: "pill", emoji: "💊", title: "Принять витамины", time: "10:00", days: "Каждый день", enabled: true, color: "#9c6db4" },
  { id: "water", emoji: "💧", title: "Выпить воду", time: "12:00", days: "Каждый день", enabled: false, color: "#80cbc4" },
  { id: "symptoms", emoji: "📝", title: "Записать симптомы", time: "21:00", days: "Каждый день", enabled: true, color: "#f48fb1" },
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(defaultReminders);
  const [showNew, setShowNew] = useState(false);

  const toggle = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const activeCount = reminders.filter(r => r.enabled).length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="glass-card rounded-2xl px-5 py-4 flex items-center justify-between">
        <div>
          <div className="font-display text-2xl font-light" style={{ color: "#e06090" }}>{activeCount}</div>
          <div className="font-body text-xs" style={{ color: "#b088b0" }}>активных напоминаний</div>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-body text-sm font-medium transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #f48fb1, #ce93d8)", color: "white" }}>
          <Icon name="Plus" size={14} />
          Добавить
        </button>
      </div>

      {/* New reminder form */}
      {showNew && (
        <div className="glass-card rounded-3xl p-5 animate-fade-in"
          style={{ border: "1.5px solid #f48fb130" }}>
          <h3 className="font-display text-xl font-medium mb-4" style={{ color: "#d080a0" }}>Новое напоминание</h3>
          <div className="space-y-3">
            <div>
              <label className="font-body text-xs mb-1 block" style={{ color: "#c4a0c0" }}>Название</label>
              <input
                type="text"
                placeholder="Введите текст..."
                className="w-full px-4 py-2.5 rounded-xl font-body text-sm outline-none"
                style={{
                  background: "#faf0f8",
                  border: "1.5px solid #f0d8f0",
                  color: "#9070a0",
                }}
              />
            </div>
            <div>
              <label className="font-body text-xs mb-1 block" style={{ color: "#c4a0c0" }}>Время</label>
              <input
                type="time"
                defaultValue="09:00"
                className="w-full px-4 py-2.5 rounded-xl font-body text-sm outline-none"
                style={{
                  background: "#faf0f8",
                  border: "1.5px solid #f0d8f0",
                  color: "#9070a0",
                }}
              />
            </div>
            <button
              onClick={() => setShowNew(false)}
              className="w-full py-3 rounded-xl font-body text-sm font-medium"
              style={{ background: "linear-gradient(135deg, #f48fb1, #ce93d8)", color: "white" }}>
              Сохранить
            </button>
          </div>
        </div>
      )}

      {/* Reminders list */}
      <div className="glass-card rounded-3xl p-5">
        <h3 className="font-display text-xl font-medium mb-4" style={{ color: "#d080a0" }}>Мои напоминания</h3>
        <div className="space-y-3">
          {reminders.map(r => (
            <div key={r.id}
              className="flex items-center gap-3 p-3 rounded-2xl transition-all"
              style={{ background: r.enabled ? `${r.color}15` : "#faf8fc" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: r.enabled ? `${r.color}30` : "#f0e8f8" }}>
                {r.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-body font-medium text-sm" style={{ color: r.enabled ? "#9070a0" : "#c4a0c0" }}>
                  {r.title}
                </div>
                <div className="font-body text-xs mt-0.5 flex items-center gap-1" style={{ color: "#c4a0c0" }}>
                  <Icon name="Clock" size={10} />
                  {r.time} · {r.days}
                </div>
              </div>
              {/* Toggle */}
              <button
                onClick={() => toggle(r.id)}
                className="w-11 h-6 rounded-full relative transition-all flex-shrink-0"
                style={{
                  background: r.enabled ? `linear-gradient(135deg, #f48fb1, #ce93d8)` : "#e8d8f0",
                }}>
                <div
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all"
                  style={{ left: r.enabled ? "calc(100% - 22px)" : "2px" }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="glass-card rounded-3xl p-4"
        style={{ background: "linear-gradient(135deg, rgba(252,228,236,0.5), rgba(237,231,246,0.5))" }}>
        <div className="flex items-start gap-3">
          <span className="text-xl">🔔</span>
          <p className="font-body text-xs leading-relaxed" style={{ color: "#9070a0" }}>
            Напоминания помогают не пропустить важные дни цикла и вовремя принять витамины. Разрешите уведомления в настройках браузера.
          </p>
        </div>
      </div>
    </div>
  );
}
