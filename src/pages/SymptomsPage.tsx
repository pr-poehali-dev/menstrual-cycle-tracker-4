import { useState } from "react";

type Symptom = {
  id: string;
  emoji: string;
  label: string;
  category: string;
};

const symptoms: Symptom[] = [
  { id: "cramps", emoji: "😣", label: "Спазмы", category: "боль" },
  { id: "headache", emoji: "🤕", label: "Головная боль", category: "боль" },
  { id: "backpain", emoji: "😓", label: "Боль в спине", category: "боль" },
  { id: "bloating", emoji: "🫃", label: "Вздутие", category: "ЖКТ" },
  { id: "nausea", emoji: "🤢", label: "Тошнота", category: "ЖКТ" },
  { id: "fatigue", emoji: "😴", label: "Усталость", category: "энергия" },
  { id: "mood_swings", emoji: "🎭", label: "Перепады настроения", category: "эмоции" },
  { id: "irritability", emoji: "😤", label: "Раздражительность", category: "эмоции" },
  { id: "anxiety", emoji: "😰", label: "Тревожность", category: "эмоции" },
  { id: "tender_breasts", emoji: "🌸", label: "Чувствительность груди", category: "физическое" },
  { id: "acne", emoji: "😕", label: "Высыпания", category: "физическое" },
  { id: "insomnia", emoji: "🌙", label: "Бессонница", category: "сон" },
  { id: "libido_low", emoji: "💔", label: "Снижение либидо", category: "физическое" },
  { id: "cravings", emoji: "🍫", label: "Тяга к еде", category: "ЖКТ" },
  { id: "happy", emoji: "😊", label: "Хорошее настроение", category: "эмоции" },
  { id: "energy", emoji: "⚡", label: "Высокая энергия", category: "энергия" },
];

const moods = ["😊", "😌", "😐", "😔", "😢", "😤", "🥰"];

const flowLevels = [
  { label: "Нет", color: "#f3e5f5", dot: "#ce93d8" },
  { label: "Лёгкие", color: "#fce4ec", dot: "#f48fb1" },
  { label: "Средние", color: "#f48fb1", dot: "white" },
  { label: "Обильные", color: "#e06090", dot: "white" },
];

export default function SymptomsPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["fatigue", "cramps"]));
  const [mood, setMood] = useState(0);
  const [flow, setFlow] = useState(1);
  const [energy, setEnergy] = useState(3);
  const [saved, setSaved] = useState(false);

  const toggleSymptom = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Date */}
      <div className="glass-card rounded-2xl px-5 py-3 flex items-center justify-between">
        <span className="font-body text-sm font-medium" style={{ color: "#d080a0" }}>Сегодня, 13 мая</span>
        <span className="font-body text-xs" style={{ color: "#c4a0c0" }}>День 14 цикла</span>
      </div>

      {/* Mood */}
      <div className="glass-card rounded-3xl p-5">
        <h3 className="font-display text-xl font-medium mb-4" style={{ color: "#d080a0" }}>Настроение</h3>
        <div className="flex justify-between">
          {moods.map((m, i) => (
            <button
              key={i}
              onClick={() => setMood(i)}
              className="text-2xl transition-all"
              style={{
                transform: mood === i ? "scale(1.4)" : "scale(1)",
                filter: mood === i ? "none" : "grayscale(50%) opacity(0.6)",
              }}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Flow */}
      <div className="glass-card rounded-3xl p-5">
        <h3 className="font-display text-xl font-medium mb-4" style={{ color: "#d080a0" }}>Менструация</h3>
        <div className="flex gap-2">
          {flowLevels.map((f, i) => (
            <button
              key={i}
              onClick={() => setFlow(i)}
              className="flex-1 py-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all"
              style={{
                background: flow === i ? f.color : "#faf0f8",
                border: flow === i ? `2px solid ${f.dot === "white" ? f.color : f.dot}` : "2px solid transparent",
                transform: flow === i ? "scale(1.05)" : "scale(1)",
              }}>
              <div className="w-4 h-4 rounded-full" style={{ background: f.dot === "white" ? f.color : f.dot }} />
              <span className="font-body text-[10px]" style={{ color: flow === i ? (f.dot === "white" ? "#e06090" : f.dot) : "#c4a0c0" }}>
                {f.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Energy */}
      <div className="glass-card rounded-3xl p-5">
        <h3 className="font-display text-xl font-medium mb-4" style={{ color: "#d080a0" }}>Уровень энергии</h3>
        <div className="flex items-center gap-3">
          <span className="text-lg">🪫</span>
          <div className="flex-1 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setEnergy(i + 1)}
                className="flex-1 h-4 rounded-full transition-all"
                style={{
                  background: i < energy
                    ? `linear-gradient(90deg, #f48fb1, #ce93d8)`
                    : "#fce4ec",
                  transform: i < energy ? "scaleY(1)" : "scaleY(0.7)",
                }}
              />
            ))}
          </div>
          <span className="text-lg">⚡</span>
        </div>
      </div>

      {/* Symptoms grid */}
      <div className="glass-card rounded-3xl p-5">
        <h3 className="font-display text-xl font-medium mb-4" style={{ color: "#d080a0" }}>Симптомы</h3>
        <div className="flex flex-wrap gap-2">
          {symptoms.map(s => {
            const isOn = selected.has(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleSymptom(s.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-xs transition-all"
                style={{
                  background: isOn ? "linear-gradient(135deg, #fce4ec, #f3e5f5)" : "#faf0f8",
                  border: isOn ? "1.5px solid #f48fb1" : "1.5px solid #f0e0f0",
                  color: isOn ? "#d060a0" : "#c4a0c0",
                  transform: isOn ? "scale(1.05)" : "scale(1)",
                }}>
                <span className="text-sm">{s.emoji}</span>
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="w-full py-4 rounded-2xl font-body font-medium text-sm transition-all active:scale-95"
        style={{
          background: saved ? "linear-gradient(135deg, #a5d6a7, #80cbc4)" : "linear-gradient(135deg, #f48fb1, #ce93d8)",
          color: "white",
          boxShadow: "0 4px 20px rgba(244,143,177,0.35)",
        }}>
        {saved ? "✓ Сохранено!" : "Сохранить запись"}
      </button>
    </div>
  );
}
