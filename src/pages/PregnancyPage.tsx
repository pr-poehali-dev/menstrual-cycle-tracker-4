import { useState } from "react";
import Icon from "@/components/ui/icon";

const weekInfo: Record<number, { size: string; emoji: string; development: string }> = {
  4: { size: "маковое зёрнышко", emoji: "🌱", development: "Формируются нервная трубка и сердце" },
  8: { size: "малина", emoji: "🍓", development: "Появляются пальчики рук и ног" },
  12: { size: "лимон", emoji: "🍋", development: "Сформированы все основные органы" },
  16: { size: "авокадо", emoji: "🥑", development: "Малыш начинает слышать" },
  20: { size: "банан", emoji: "🍌", development: "Можно узнать пол на УЗИ" },
  24: { size: "кукуруза", emoji: "🌽", development: "Открываются глаза" },
  28: { size: "баклажан", emoji: "🍆", development: "Активно двигается, реагирует на свет" },
  32: { size: "дыня", emoji: "🍈", development: "Готовится занять позицию для родов" },
  36: { size: "папайя", emoji: "🫐", development: "Лёгкие почти готовы к дыханию" },
  40: { size: "арбуз", emoji: "🍉", development: "Малыш готов появиться на свет!" },
};

function getWeekInfo(week: number) {
  const keys = Object.keys(weekInfo).map(Number).sort((a, b) => a - b);
  let closest = keys[0];
  for (const k of keys) {
    if (week >= k) closest = k;
    else break;
  }
  return weekInfo[closest];
}

const TRIMESTERS = [
  { label: "I триместр", weeks: "1–13 нед.", color: "#f48fb1", desc: "Формирование всех органов" },
  { label: "II триместр", weeks: "14–26 нед.", color: "#ce93d8", desc: "Активный рост малыша" },
  { label: "III триместр", weeks: "27–40 нед.", color: "#9c6db4", desc: "Подготовка к рождению" },
];

export default function PregnancyPage() {
  const [mode, setMode] = useState<"tracking" | "planning">("tracking");
  const [week, setWeek] = useState(20);

  const info = getWeekInfo(week);
  const trimester = week <= 13 ? 0 : week <= 26 ? 1 : 2;
  const daysLeft = (40 - week) * 7;
  const progress = Math.min((week / 40) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="glass-card rounded-2xl p-1 flex">
        <button
          onClick={() => setMode("tracking")}
          className="flex-1 py-2.5 rounded-xl text-sm font-body font-medium transition-all"
          style={{
            background: mode === "tracking" ? "linear-gradient(135deg, #f48fb1, #ce93d8)" : "transparent",
            color: mode === "tracking" ? "white" : "#b088b0",
          }}>
          🤰 Беременность
        </button>
        <button
          onClick={() => setMode("planning")}
          className="flex-1 py-2.5 rounded-xl text-sm font-body font-medium transition-all"
          style={{
            background: mode === "planning" ? "linear-gradient(135deg, #ce93d8, #9c6db4)" : "transparent",
            color: mode === "planning" ? "white" : "#b088b0",
          }}>
          💫 Планирование
        </button>
      </div>

      {mode === "tracking" ? (
        <>
          {/* Week card */}
          <div className="glass-card rounded-3xl p-6 text-center">
            <div className="text-5xl mb-3 animate-float inline-block">{info.emoji}</div>
            <h2 className="font-display text-2xl font-medium mb-1" style={{ color: "#d080a0" }}>
              Неделя {week}
            </h2>
            <p className="font-body text-sm mb-1" style={{ color: "#b088b0" }}>
              Малыш размером с {info.size}
            </p>
            <p className="font-body text-xs" style={{ color: "#c4a0c0" }}>
              {info.development}
            </p>

            {/* Week slider */}
            <div className="mt-5 flex items-center gap-3">
              <button onClick={() => setWeek(w => Math.max(1, w - 1))}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "#fce4ec", color: "#e06090" }}>
                <Icon name="ChevronLeft" size={16} />
              </button>
              <div className="flex-1">
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "#fce4ec" }}>
                  <div className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%`, background: "linear-gradient(90deg, #f48fb1, #ce93d8)" }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs font-body" style={{ color: "#c4a0c0" }}>1 нед</span>
                  <span className="text-xs font-body" style={{ color: "#c4a0c0" }}>40 нед</span>
                </div>
              </div>
              <button onClick={() => setWeek(w => Math.min(40, w + 1))}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "#fce4ec", color: "#e06090" }}>
                <Icon name="ChevronRight" size={16} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card rounded-2xl p-4 text-center">
              <div className="font-display text-2xl font-light" style={{ color: "#e06090" }}>
                {daysLeft}
              </div>
              <div className="font-body text-xs mt-1" style={{ color: "#b088b0" }}>дней до встречи</div>
            </div>
            <div className="glass-card rounded-2xl p-4 text-center">
              <div className="font-display text-2xl font-light capitalize" style={{ color: "#ce93d8" }}>
                {trimester + 1}
              </div>
              <div className="font-body text-xs mt-1" style={{ color: "#b088b0" }}>триместр</div>
            </div>
          </div>

          {/* Trimester info */}
          <div className="glass-card rounded-3xl p-5">
            <h3 className="font-display text-xl font-medium mb-3" style={{ color: "#d080a0" }}>Триместры</h3>
            <div className="space-y-3">
              {TRIMESTERS.map((t, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl transition-all"
                  style={{ background: trimester === i ? `${t.color}20` : "transparent" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-body font-bold text-white flex-shrink-0"
                    style={{ background: t.color }}>
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-body font-medium text-sm" style={{ color: t.color }}>{t.label}</div>
                    <div className="font-body text-xs" style={{ color: "#c4a0c0" }}>{t.weeks} · {t.desc}</div>
                  </div>
                  {trimester === i && <Icon name="Check" size={16} className="ml-auto" style={{ color: t.color }} />}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Planning mode */
        <div className="space-y-4">
          <div className="glass-card rounded-3xl p-6 text-center">
            <div className="text-4xl mb-3 animate-float inline-block">💫</div>
            <h2 className="font-display text-2xl font-medium mb-2" style={{ color: "#d080a0" }}>
              Планирование беременности
            </h2>
            <p className="font-body text-sm" style={{ color: "#b088b0" }}>
              Следите за фертильными днями в разделе Календарь
            </p>
          </div>

          {[
            { emoji: "🌿", title: "Примите фолиевую кислоту", desc: "400 мкг в день за 3 месяца до зачатия" },
            { emoji: "💊", title: "Посетите врача", desc: "Комплексное обследование перед беременностью" },
            { emoji: "🥗", title: "Правильное питание", desc: "Больше овощей, меньше алкоголя и кофеина" },
            { emoji: "🧘", title: "Снижайте стресс", desc: "Медитация и йога улучшают фертильность" },
          ].map((item, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 flex items-start gap-3">
              <span className="text-2xl">{item.emoji}</span>
              <div>
                <div className="font-body font-medium text-sm" style={{ color: "#d080a0" }}>{item.title}</div>
                <div className="font-body text-xs mt-0.5" style={{ color: "#b088b0" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
