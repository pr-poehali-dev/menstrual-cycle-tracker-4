export default function MessagesPage() {
  return (
    <div style={{ background: "#fff5f7", minHeight: "100vh" }}>
      <div className="px-4 pt-8">
        <h1 className="font-body font-black text-2xl mb-1" style={{ color: "#1a0510" }}>Сообщения</h1>
        <p className="font-body text-sm mb-8" style={{ color: "#b088b0" }}>Уведомления и напоминания</p>

        <div className="flex flex-col items-center justify-center pt-16 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 text-4xl"
            style={{ background: "#ffe0ea" }}>
            💬
          </div>
          <h2 className="font-body font-bold text-lg mb-2" style={{ color: "#3a1a2a" }}>
            Пока нет сообщений
          </h2>
          <p className="font-body text-sm" style={{ color: "#c0a0b0" }}>
            Здесь будут появляться напоминания<br />о вашем цикле
          </p>
        </div>

        {/* Предстоящие напоминания */}
        <div className="mt-10">
          <h3 className="font-body font-bold text-base mb-3" style={{ color: "#1a0510" }}>Предстоящие напоминания</h3>
          {[
            { emoji: "🌹", text: "Ожидаемое начало месячных", days: "через 14 дней" },
            { emoji: "✨", text: "Фертильный период", days: "через 25 дней" },
          ].map((r, i) => (
            <div key={i} className="rounded-2xl px-4 py-3 flex items-center gap-3 mb-2"
              style={{ background: "white", boxShadow: "0 2px 8px rgba(255,80,120,0.07)" }}>
              <span className="text-xl">{r.emoji}</span>
              <div className="flex-1">
                <div className="font-body font-medium text-sm" style={{ color: "#2a0a1a" }}>{r.text}</div>
                <div className="font-body text-xs" style={{ color: "#e05080" }}>{r.days}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
