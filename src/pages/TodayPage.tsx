import { useState, useRef } from "react";

const CYCLE_LENGTH = 28;
const PERIOD_LENGTH = 5;

const MONTHS_RU = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
const WEEKDAYS_SHORT = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];
const WEEKDAYS_FULL = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];

function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function diffDays(a: Date, b: Date) { return Math.round((a.getTime() - b.getTime()) / 86400000); }

function getCycleDay(date: Date, lastPeriod: Date) {
  const d = diffDays(date, lastPeriod);
  if (d < 0) {
    // до следующего цикла — считаем от предыдущего
    const mod = ((d % CYCLE_LENGTH) + CYCLE_LENGTH) % CYCLE_LENGTH;
    return mod === 0 ? CYCLE_LENGTH : mod;
  }
  const mod = d % CYCLE_LENGTH;
  return mod + 1;
}

function getPhaseLabel(cycleDay: number): { title: string; subtitle: string } {
  if (cycleDay >= 1 && cycleDay <= PERIOD_LENGTH) {
    return { title: "Месячные:", subtitle: `${cycleDay}-й день` };
  }
  if (cycleDay >= 6 && cycleDay <= 13) {
    return { title: "До овуляции:", subtitle: `${14 - cycleDay} ${14 - cycleDay === 1 ? "день" : "дня"}` };
  }
  if (cycleDay === 14) {
    return { title: "Овуляция:", subtitle: "сегодня" };
  }
  if (cycleDay >= 15 && cycleDay <= 21) {
    return { title: "После овуляции:", subtitle: `${cycleDay - 14}-й день` };
  }
  const daysLeft = CYCLE_LENGTH - cycleDay + 1;
  return { title: "До месячных:", subtitle: `${daysLeft} ${daysLeft === 1 ? "день" : daysLeft < 5 ? "дня" : "дней"}` };
}

function getFertilityChance(cycleDay: number): string {
  if (cycleDay >= 11 && cycleDay <= 13) return "Высокая";
  if (cycleDay === 14) return "Очень высокая";
  if (cycleDay >= 10 && cycleDay <= 16) return "Средняя";
  if (cycleDay >= 1 && cycleDay <= 5) return "Очень низкая";
  return "Низкая";
}

function getDayType(cycleDay: number): "period" | "fertile" | "ovulation" | "pms" | "normal" {
  if (cycleDay >= 1 && cycleDay <= PERIOD_LENGTH) return "period";
  if (cycleDay === 14) return "ovulation";
  if (cycleDay >= 11 && cycleDay <= 16) return "fertile";
  if (cycleDay >= 22) return "pms";
  return "normal";
}

const TIPS = [
  { emoji: "💊", title: "Отметьте свои симптомы", action: true },
  { emoji: "🌡️", title: "Вероятность забеременеть сегодня", action: false },
  { emoji: "😴", title: "Качество сна", action: false },
  { emoji: "🧘", title: "Медитация для цикла", action: false },
];

const MY_CYCLES = [
  { start: "13 мая", length: 28, period: 5 },
  { start: "15 апр", length: 29, period: 5 },
  { start: "17 мар", length: 28, period: 6 },
];

export default function TodayPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [lastPeriod, setLastPeriod] = useState(() => {
    const d = new Date(2026, 4, 13);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState(today);
  const [showModal, setShowModal] = useState(false);
  const [editDate, setEditDate] = useState("2026-05-13");

  // Неделя: 3 дня до selectedDate и 3 после (итого 7)
  const weekStart = -3;
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(selectedDate, weekStart + i));

  // Свайп
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) setSelectedDate(d => addDays(d, dx < 0 ? 1 : -1));
    touchX.current = null;
  };

  const cycleDay = getCycleDay(selectedDate, lastPeriod);
  const phase = getPhaseLabel(cycleDay);
  const dayType = getDayType(cycleDay);
  const fertilityChance = getFertilityChance(cycleDay);
  const isToday = diffDays(selectedDate, today) === 0;

  const formattedDate = `${selectedDate.getDate()} ${MONTHS_RU[selectedDate.getMonth()]}`;

  const saveModal = () => {
    const d = new Date(editDate);
    if (!isNaN(d.getTime())) {
      d.setHours(0, 0, 0, 0);
      setLastPeriod(d);
    }
    setShowModal(false);
  };

  return (
    <div style={{ background: "#fff5f7", minHeight: "100vh" }}>

      {/* ===== ВЕРХНЯЯ РОЗОВАЯ ЗОНА ===== */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          background: "linear-gradient(180deg, #ffb8c8 0%, #ff7096 38%, #ff9eb8 65%, #ffcdd8 85%, #fff5f7 100%)",
          position: "relative",
          paddingBottom: 60,
        }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3">
          {/* Аватар */}
          <div className="relative">
            <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center text-2xl"
              style={{ background: "#ffcc99" }}>
              🐱
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full"
              style={{ background: "#ff5080", border: "2px solid white" }} />
          </div>
          {/* Дата по центру */}
          <span className="font-body font-semibold text-base" style={{ color: "#3a1a2a" }}>
            {formattedDate}
          </span>
          {/* Иконка календаря */}
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.35)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="17" rx="2.5" stroke="#3a1a2a" strokeWidth="1.8"/>
              <path d="M3 9h18" stroke="#3a1a2a" strokeWidth="1.8"/>
              <path d="M8 2v3M16 2v3" stroke="#3a1a2a" strokeWidth="1.8" strokeLinecap="round"/>
              <rect x="7" y="12" width="2.5" height="2.5" rx="0.5" fill="#3a1a2a"/>
              <rect x="11" y="12" width="2.5" height="2.5" rx="0.5" fill="#3a1a2a"/>
              <rect x="15" y="12" width="2.5" height="2.5" rx="0.5" fill="#3a1a2a"/>
              <rect x="7" y="16" width="2.5" height="2.5" rx="0.5" fill="#3a1a2a"/>
              <rect x="11" y="16" width="2.5" height="2.5" rx="0.5" fill="#3a1a2a"/>
            </svg>
          </div>
        </div>

        {/* Дни недели — заголовки */}
        <div className="grid grid-cols-7 px-2 mb-1">
          {weekDays.map((d, i) => {
            const wd = WEEKDAYS_SHORT[d.getDay()];
            const isSel = diffDays(d, selectedDate) === 0;
            const isTd = diffDays(d, today) === 0;
            return (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[11px] font-body font-semibold mb-1"
                  style={{ color: isSel ? "#3a1a2a" : "rgba(58,26,42,0.5)" }}>
                  {isTd ? "СЕГОДНЯ" : wd}
                </span>
              </div>
            );
          })}
        </div>

        {/* Дни — цифры */}
        <div className="grid grid-cols-7 px-2 mb-4">
          {weekDays.map((d, i) => {
            const isSel = diffDays(d, selectedDate) === 0;
            const isFuture = diffDays(d, today) > 0;
            const isPast = diffDays(d, today) < 0;
            const isTd = diffDays(d, today) === 0;
            const cDay = getCycleDay(d, lastPeriod);
            const dType = getDayType(cDay);

            return (
              <button key={i} onClick={() => setSelectedDate(d)}
                className="flex items-center justify-center"
                style={{ height: 44 }}>
                {isSel ? (
                  /* Сегодня / выбранный — заполненный белый круг с розовым текстом */
                  <div className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: "white", boxShadow: "0 2px 12px rgba(255,80,120,0.25)" }}>
                    <span className="font-body font-bold text-base" style={{ color: "#e05080" }}>
                      {d.getDate()}
                    </span>
                  </div>
                ) : isFuture ? (
                  /* Будущие — пунктирный кружок */
                  <div className="w-9 h-9 rounded-full flex items-center justify-center relative">
                    <svg className="absolute inset-0" width="36" height="36" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="#e05080" strokeWidth="1.5"
                        strokeDasharray="4 3" strokeLinecap="round" opacity="0.6"/>
                    </svg>
                    <span className="font-body font-medium text-base" style={{ color: "rgba(224,80,128,0.75)" }}>
                      {d.getDate()}
                    </span>
                  </div>
                ) : (
                  /* Прошедшие — просто цифра */
                  <span className="font-body font-medium text-base" style={{ color: "rgba(58,26,42,0.45)" }}>
                    {d.getDate()}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Большой текст фазы */}
        <div className="text-center px-6 mb-6">
          <p className="font-body font-semibold text-lg mb-1" style={{ color: "#2a0a1a" }}>
            {phase.title}
          </p>
          <h1 className="font-body font-black" style={{ fontSize: 52, lineHeight: 1, color: "#1a0510", letterSpacing: "-1px" }}>
            {phase.subtitle}
          </h1>
        </div>

        {/* Кнопка */}
        <div className="flex justify-center px-6">
          <button onClick={() => setShowModal(true)}
            className="font-body font-semibold text-sm px-8 py-3.5 rounded-full transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.88)", color: "#e05080", letterSpacing: "0.01em" }}>
            Изменить даты месячных
          </button>
        </div>

        {/* Волнистый разделитель */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: 60 }}>
          <svg viewBox="0 0 390 60" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <path d="M0,30 Q97,0 195,30 Q292,60 390,30 L390,60 L0,60 Z" fill="#fff5f7"/>
          </svg>
        </div>
      </div>

      {/* ===== НИЖНЯЯ СВЕТЛАЯ ЗОНА ===== */}
      <div className="px-4 pt-2 space-y-6">

        {/* Советы на каждый день */}
        <div>
          <h2 className="font-body font-bold text-xl mb-3" style={{ color: "#1a0510" }}>
            Советы на каждый день
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {/* Карточка отметить симптомы */}
            <div className="flex-shrink-0 w-36 rounded-2xl p-4 flex flex-col justify-between"
              style={{ background: "white", minHeight: 150, boxShadow: "0 2px 12px rgba(255,80,120,0.08)" }}>
              <p className="font-body font-bold text-sm leading-tight" style={{ color: "#1a0510" }}>
                Отметьте<br />свои<br />симптомы
              </p>
              <div className="mt-3 self-start">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "#e05080" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Карточка вероятность */}
            <div className="flex-shrink-0 w-36 rounded-2xl p-4 flex flex-col"
              style={{ background: "white", minHeight: 150, border: "2px solid #ffccd8", boxShadow: "0 2px 12px rgba(255,80,120,0.06)" }}>
              <p className="font-body text-sm text-center leading-tight mb-3" style={{ color: "#888" }}>
                Вероятность<br />забеременеть<br />сегодня
              </p>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: "#f0f0f0" }}>
                  <span className="font-body font-bold text-xs text-center" style={{ color: "#ccc" }}>
                    {fertilityChance}
                  </span>
                </div>
              </div>
            </div>

            {/* Карточка фаза */}
            <div className="flex-shrink-0 w-36 rounded-2xl p-4 flex flex-col items-center justify-center"
              style={{ background: "white", minHeight: 150, border: "2px solid #ffe0e8" }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2"
                style={{ background: "#f5f5f5" }}>
                <span className="text-2xl">
                  {dayType === "period" ? "🌹" : dayType === "ovulation" ? "✨" : dayType === "fertile" ? "🌱" : dayType === "pms" ? "🌙" : "💜"}
                </span>
              </div>
              <p className="font-body text-xs text-center" style={{ color: "#999" }}>День цикла {cycleDay}</p>
            </div>

            {/* Карточка совет */}
            <div className="flex-shrink-0 w-36 rounded-2xl p-4 flex flex-col items-center justify-center"
              style={{ background: "white", minHeight: 150, border: "2px solid #ffe0e8" }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2"
                style={{ background: "#f5f5f5" }}>
                <span className="text-2xl">💡</span>
              </div>
              <p className="font-body text-xs text-center" style={{ color: "#999" }}>Совет дня</p>
            </div>
          </div>
        </div>

        {/* Мои циклы */}
        <div>
          <h2 className="font-body font-bold text-xl mb-3" style={{ color: "#1a0510" }}>
            Мои циклы
          </h2>
          <div className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 2px 12px rgba(255,80,120,0.07)" }}>
            {/* Заголовок таблицы */}
            <div className="grid grid-cols-3 px-4 py-2 border-b" style={{ borderColor: "#f5e5ea" }}>
              <span className="font-body text-xs font-semibold" style={{ color: "#bbb" }}>Начало</span>
              <span className="font-body text-xs font-semibold text-center" style={{ color: "#bbb" }}>Длина</span>
              <span className="font-body text-xs font-semibold text-right" style={{ color: "#bbb" }}>Менструация</span>
            </div>
            {MY_CYCLES.map((c, i) => (
              <div key={i} className="grid grid-cols-3 px-4 py-3 border-b last:border-0"
                style={{ borderColor: "#f5e5ea" }}>
                <span className="font-body text-sm font-medium" style={{ color: "#2a0a1a" }}>{c.start}</span>
                <span className="font-body text-sm text-center" style={{ color: "#2a0a1a" }}>{c.length} дн</span>
                <span className="font-body text-sm text-right" style={{ color: "#e05080" }}>{c.period} дн</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 8 }} />
      </div>

      {/* ===== МОДАЛКА ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={e => { if (e.currentTarget === e.target) setShowModal(false); }}>
          <div className="w-full max-w-md rounded-t-3xl px-6 pt-5 pb-10 animate-fade-in"
            style={{ background: "white" }}>
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "#e0c0d0" }} />
            <h3 className="font-body font-bold text-xl text-center mb-1" style={{ color: "#1a0510" }}>
              Даты месячных
            </h3>
            <p className="font-body text-sm text-center mb-5" style={{ color: "#b088b0" }}>
              Укажите первый день последних месячных
            </p>
            <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl font-body text-base outline-none mb-4"
              style={{ background: "#fff0f5", border: "1.5px solid #ffd0e0", color: "#3a1a2a" }}
            />
            <button onClick={saveModal}
              className="w-full py-4 rounded-full font-body font-bold text-base text-white mb-2 transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #ff7096, #e05080)" }}>
              Сохранить
            </button>
            <button onClick={() => setShowModal(false)}
              className="w-full py-2 font-body text-sm" style={{ color: "#ccc" }}>
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
