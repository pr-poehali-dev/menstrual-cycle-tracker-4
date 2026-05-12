const tips = [
  { emoji: "🌿", title: "Фолиевая кислота", text: "400 мкг в день — особенно важно при планировании беременности", tag: "Питание" },
  { emoji: "🧘", title: "Йога при ПМС", text: "Позы «Ребёнка» и «Кошки» снимают боль в спине и спазмы", tag: "Движение" },
  { emoji: "😴", title: "Сон и цикл", text: "Недосып влияет на уровень гормонов и нерегулярность цикла", tag: "Здоровье" },
  { emoji: "🍫", title: "Тяга к сладкому", text: "Во лютеиновую фазу уровень серотонина падает — отсюда желание шоколада", tag: "Питание" },
  { emoji: "💧", title: "Водный баланс", text: "В дни менструации пейте больше воды — это снизит спазмы", tag: "Здоровье" },
  { emoji: "🌡️", title: "Базальная температура", text: "Измеряйте каждое утро — это поможет точнее определить овуляцию", tag: "Трекинг" },
];

const tagColors: Record<string, string> = {
  "Питание": "#ff9eb5",
  "Движение": "#a0d4a0",
  "Здоровье": "#a0c4f8",
  "Трекинг": "#f0c0e0",
};

export default function TipsPage() {
  return (
    <div style={{ background: "#fff5f7", minHeight: "100vh" }}>
      <div className="px-4 pt-8 pb-6">
        <h1 className="font-body font-black text-2xl mb-1" style={{ color: "#1a0510" }}>Советы</h1>
        <p className="font-body text-sm mb-6" style={{ color: "#b088b0" }}>Полезная информация о цикле</p>

        <div className="space-y-3">
          {tips.map((t, i) => (
            <div key={i} className="rounded-2xl p-4 flex items-start gap-3"
              style={{ background: "white", boxShadow: "0 2px 10px rgba(255,80,120,0.07)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "#fff0f5" }}>
                {t.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-body font-bold text-sm" style={{ color: "#1a0510" }}>{t.title}</span>
                  <span className="text-[10px] font-body font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: tagColors[t.tag] || "#f0e0f0", color: "white" }}>
                    {t.tag}
                  </span>
                </div>
                <p className="font-body text-xs leading-relaxed" style={{ color: "#888" }}>{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
