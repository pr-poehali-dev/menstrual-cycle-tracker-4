import { useState } from "react";

export default function PartnerPage() {
  const [connected, setConnected] = useState(false);
  const [code] = useState("LUN-4829");

  return (
    <div style={{ background: "#fff5f7", minHeight: "100vh" }}>
      <div className="px-4 pt-8">
        <h1 className="font-body font-black text-2xl mb-1" style={{ color: "#1a0510" }}>Партнёр</h1>
        <p className="font-body text-sm mb-6" style={{ color: "#b088b0" }}>Поделитесь циклом с близким человеком</p>

        {!connected ? (
          <div className="space-y-4">
            {/* Код приглашения */}
            <div className="rounded-2xl p-5 text-center"
              style={{ background: "white", boxShadow: "0 2px 12px rgba(255,80,120,0.08)" }}>
              <p className="font-body text-sm mb-3" style={{ color: "#888" }}>Ваш код приглашения</p>
              <div className="rounded-xl px-6 py-3 mb-3 inline-block"
                style={{ background: "#fff0f5", border: "2px dashed #ffb0cc" }}>
                <span className="font-body font-black text-2xl tracking-widest" style={{ color: "#e05080" }}>
                  {code}
                </span>
              </div>
              <p className="font-body text-xs" style={{ color: "#ccc" }}>
                Поделитесь кодом с партнёром
              </p>
            </div>

            <div className="text-center">
              <span className="font-body text-sm" style={{ color: "#ccc" }}>или</span>
            </div>

            {/* Ввести код партнёра */}
            <div className="rounded-2xl p-5"
              style={{ background: "white", boxShadow: "0 2px 12px rgba(255,80,120,0.08)" }}>
              <p className="font-body font-semibold text-sm mb-3" style={{ color: "#2a0a1a" }}>
                Введите код партнёра
              </p>
              <input type="text" placeholder="Например: LUN-1234"
                className="w-full px-4 py-3 rounded-xl font-body text-base outline-none mb-3"
                style={{ background: "#fff0f5", border: "1.5px solid #ffd0e0", color: "#3a1a2a" }}
              />
              <button onClick={() => setConnected(true)}
                className="w-full py-3.5 rounded-full font-body font-bold text-base text-white transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #ff7096, #e05080)" }}>
                Подключить
              </button>
            </div>

            {/* Что получит партнёр */}
            <div className="rounded-2xl p-5"
              style={{ background: "white", boxShadow: "0 2px 12px rgba(255,80,120,0.06)" }}>
              <h3 className="font-body font-bold text-sm mb-3" style={{ color: "#2a0a1a" }}>Партнёр увидит:</h3>
              {[
                { emoji: "📅", text: "Текущую фазу цикла" },
                { emoji: "🌡️", text: "Дни менструации" },
                { emoji: "💡", text: "Советы как поддержать" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 mb-2">
                  <span className="text-lg">{item.emoji}</span>
                  <span className="font-body text-sm" style={{ color: "#666" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl p-5 text-center"
              style={{ background: "white", boxShadow: "0 2px 12px rgba(255,80,120,0.08)" }}>
              <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl"
                style={{ background: "#ffebe8" }}>
                🥰
              </div>
              <h2 className="font-body font-bold text-lg mb-1" style={{ color: "#1a0510" }}>Партнёр подключён!</h2>
              <p className="font-body text-sm" style={{ color: "#b088b0" }}>Он видит ваш цикл и может поддержать вас</p>
            </div>
            <button onClick={() => setConnected(false)}
              className="w-full py-3 rounded-full font-body text-sm"
              style={{ color: "#ccc" }}>
              Отключить партнёра
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
