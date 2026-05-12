import { useState } from "react";
import Icon from "@/components/ui/icon";

const phases = [
  { name: "Менструация", days: "1–5", color: "#f48fb1", bg: "#fce4ec", emoji: "🌹", desc: "Период отдыха" },
  { name: "Фолликулярная", days: "6–13", color: "#ce93d8", bg: "#f3e5f5", emoji: "🌱", desc: "Рост и энергия" },
  { name: "Овуляция", days: "14", color: "#e06090", bg: "#fce4ec", emoji: "✨", desc: "Пик фертильности" },
  { name: "Лютеиновая", days: "15–28", color: "#9c6db4", bg: "#ede7f6", emoji: "🌙", desc: "Подготовка к отдыху" },
];

export default function CyclePage() {
  const [currentDay, setCurrentDay] = useState(14);
  const cycleLength = 28;
  const progress = (currentDay / cycleLength) * 100;

  const currentPhase = currentDay <= 5 ? phases[0]
    : currentDay <= 13 ? phases[1]
    : currentDay === 14 ? phases[2]
    : phases[3];

  const daysToNext = currentDay <= 5 ? 5 - currentDay + 1
    : currentDay <= 13 ? 13 - currentDay + 1
    : currentDay === 14 ? 1
    : 28 - currentDay + 1;

  return (
    <div className="space-y-4">
      {/* Current phase card */}
      <div className="glass-card rounded-3xl p-6 text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl animate-float"
          style={{ background: currentPhase.bg, border: `2px solid ${currentPhase.color}40` }}>
          {currentPhase.emoji}
        </div>
        <h2 className="font-display text-2xl font-medium mb-1" style={{ color: currentPhase.color }}>
          {currentPhase.name}
        </h2>
        <p className="text-sm font-body" style={{ color: "#b088b0" }}>{currentPhase.desc}</p>

        {/* Day counter */}
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentDay(d => Math.max(1, d - 1))}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "#fce4ec", color: "#e06090" }}>
            <Icon name="ChevronLeft" size={16} />
          </button>
          <div className="text-center">
            <div className="font-display text-5xl font-light" style={{ color: "#e06090" }}>{currentDay}</div>
            <div className="text-xs font-body mt-1" style={{ color: "#b088b0" }}>день цикла</div>
          </div>
          <button
            onClick={() => setCurrentDay(d => Math.min(28, d + 1))}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "#fce4ec", color: "#e06090" }}>
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-5 h-2 rounded-full overflow-hidden" style={{ background: "#fce4ec" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #f48fb1, #ce93d8)" }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs font-body" style={{ color: "#c4a0c0" }}>День 1</span>
          <span className="text-xs font-body" style={{ color: "#c4a0c0" }}>День 28</span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="text-2xl font-display font-light" style={{ color: "#e06090" }}>{daysToNext}</div>
          <div className="text-xs font-body mt-1" style={{ color: "#b088b0" }}>дней до след. фазы</div>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="text-2xl font-display font-light" style={{ color: "#ce93d8" }}>28</div>
          <div className="text-xs font-body mt-1" style={{ color: "#b088b0" }}>длина цикла</div>
        </div>
      </div>

      {/* Phases overview */}
      <div className="glass-card rounded-3xl p-5">
        <h3 className="font-display text-xl font-medium mb-4" style={{ color: "#d080a0" }}>Фазы цикла</h3>
        <div className="space-y-3">
          {phases.map((phase, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl transition-all"
              style={{ background: currentPhase.name === phase.name ? phase.bg : "transparent" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: phase.bg }}>
                {phase.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-body font-medium text-sm" style={{ color: phase.color }}>{phase.name}</div>
                <div className="font-body text-xs mt-0.5" style={{ color: "#c4a0c0" }}>{phase.desc}</div>
              </div>
              <div className="text-xs font-body flex-shrink-0" style={{ color: "#b088b0" }}>
                д. {phase.days}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="glass-card rounded-3xl p-5" style={{ background: "linear-gradient(135deg, rgba(252,228,236,0.6), rgba(243,229,245,0.6))" }}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-body font-medium text-sm mb-1" style={{ color: "#d080a0" }}>Совет дня</h4>
            <p className="font-body text-xs leading-relaxed" style={{ color: "#9070a0" }}>
              {currentPhase.name === "Менструация" && "Уделите время отдыху, тёплые напитки и лёгкий массаж живота помогут снять спазмы."}
              {currentPhase.name === "Фолликулярная" && "Отличное время для новых проектов и физических нагрузок — уровень эстрогена растёт!"}
              {currentPhase.name === "Овуляция" && "Пик фертильности! Если планируете беременность — это лучший момент."}
              {currentPhase.name === "Лютеиновая" && "Могут появиться перепады настроения. Магний и омега-3 помогут поддержать баланс."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
