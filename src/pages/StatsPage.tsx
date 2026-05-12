const cycleData = [
  { month: "Окт", length: 27, period: 5 },
  { month: "Ноя", length: 29, period: 6 },
  { month: "Дек", length: 28, period: 5 },
  { month: "Янв", length: 26, period: 4 },
  { month: "Фев", length: 28, period: 5 },
  { month: "Мар", length: 30, period: 6 },
  { month: "Апр", length: 28, period: 5 },
  { month: "Май", length: 28, period: 5 },
];

const maxLength = Math.max(...cycleData.map(d => d.length));

const topSymptoms = [
  { label: "Усталость", emoji: "😴", count: 14, color: "#f48fb1" },
  { label: "Спазмы", emoji: "😣", count: 10, color: "#ce93d8" },
  { label: "Вздутие", emoji: "🫃", count: 8, color: "#9c6db4" },
  { label: "Головная боль", emoji: "🤕", count: 6, color: "#f48fb1" },
  { label: "Перепады настроения", emoji: "🎭", count: 5, color: "#ce93d8" },
];

export default function StatsPage() {
  const avgCycle = Math.round(cycleData.reduce((a, b) => a + b.length, 0) / cycleData.length);
  const avgPeriod = Math.round(cycleData.reduce((a, b) => a + b.period, 0) / cycleData.length);

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="font-display text-4xl font-light" style={{ color: "#e06090" }}>{avgCycle}</div>
          <div className="font-body text-xs mt-1" style={{ color: "#b088b0" }}>средний цикл (дни)</div>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="font-display text-4xl font-light" style={{ color: "#ce93d8" }}>{avgPeriod}</div>
          <div className="font-body text-xs mt-1" style={{ color: "#b088b0" }}>средняя менструация (дни)</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="font-display text-4xl font-light" style={{ color: "#9c6db4" }}>8</div>
          <div className="font-body text-xs mt-1" style={{ color: "#b088b0" }}>циклов отслежено</div>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="font-display text-4xl font-light" style={{ color: "#e06090" }}>91%</div>
          <div className="font-body text-xs mt-1" style={{ color: "#b088b0" }}>регулярность цикла</div>
        </div>
      </div>

      {/* Cycle length chart */}
      <div className="glass-card rounded-3xl p-5">
        <h3 className="font-display text-xl font-medium mb-1" style={{ color: "#d080a0" }}>Длина цикла</h3>
        <p className="font-body text-xs mb-4" style={{ color: "#c4a0c0" }}>за последние 8 месяцев</p>
        <div className="flex items-end gap-1.5 h-28">
          {cycleData.map((d, i) => {
            const h = (d.length / maxLength) * 100;
            const isLast = i === cycleData.length - 1;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="font-body text-[10px] font-medium" style={{ color: "#d080a0" }}>
                  {d.length}
                </span>
                <div className="w-full rounded-t-lg relative overflow-hidden"
                  style={{
                    height: `${h}%`,
                    background: isLast
                      ? "linear-gradient(180deg, #f48fb1, #ce93d8)"
                      : "linear-gradient(180deg, #fce4ec, #f3e5f5)",
                    border: isLast ? "none" : "1px solid #f0d8f0",
                  }}>
                </div>
                <span className="font-body text-[9px]" style={{ color: "#c4a0c0" }}>{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top symptoms */}
      <div className="glass-card rounded-3xl p-5">
        <h3 className="font-display text-xl font-medium mb-1" style={{ color: "#d080a0" }}>Частые симптомы</h3>
        <p className="font-body text-xs mb-4" style={{ color: "#c4a0c0" }}>за последние 3 месяца</p>
        <div className="space-y-3">
          {topSymptoms.map((s, i) => {
            const pct = (s.count / topSymptoms[0].count) * 100;
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="text-lg w-7 text-center">{s.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-body text-xs font-medium" style={{ color: "#9070a0" }}>{s.label}</span>
                    <span className="font-body text-xs" style={{ color: "#c4a0c0" }}>{s.count} дн</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#fce4ec" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: s.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="glass-card rounded-3xl p-5"
        style={{ background: "linear-gradient(135deg, rgba(252,228,236,0.6), rgba(237,231,246,0.6))" }}>
        <h3 className="font-display text-xl font-medium mb-3" style={{ color: "#d080a0" }}>Наблюдения</h3>
        <div className="space-y-2.5">
          {[
            { emoji: "✨", text: "Ваш цикл стабилен — отличная регулярность!" },
            { emoji: "📈", text: "В феврале цикл был самым коротким (26 дней)" },
            { emoji: "🌙", text: "Усталость чаще всего в лютеиновую фазу" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-base">{item.emoji}</span>
              <span className="font-body text-xs leading-relaxed" style={{ color: "#9070a0" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
