import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const CYCLE_LENGTH = 28;
const PERIOD_LENGTH = 5;

const WEEK_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const MONTHS_RU = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function diffDays(a: Date, b: Date) {
  return Math.round((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

function getDayOfWeek(date: Date) {
  const d = date.getDay();
  return d === 0 ? 6 : d - 1;
}

type DayMark = "period" | "fertile" | "ovulation" | "pms" | null;

function getDayMark(cycleDay: number): DayMark {
  if (cycleDay >= 1 && cycleDay <= PERIOD_LENGTH) return "period";
  if (cycleDay >= 11 && cycleDay <= 13) return "fertile";
  if (cycleDay === 14) return "ovulation";
  if (cycleDay >= 22 && cycleDay <= 28) return "pms";
  return null;
}

function getPhaseInfo(cycleDay: number) {
  if (cycleDay >= 1 && cycleDay <= PERIOD_LENGTH) {
    return {
      label: "Месячные",
      dayLabel: `${cycleDay}-й день`,
      sub: "период менструации",
      color: "#e05080",
      bgTop: "linear-gradient(180deg, #ff9eb5 0%, #ff7096 45%, #ffb8cc 100%)",
      tip: "Время отдыха. Тёплые напитки и грелка помогут снять дискомфорт.",
    };
  }
  if (cycleDay >= 6 && cycleDay <= 13) {
    const days = 14 - cycleDay;
    return {
      label: "До овуляции",
      dayLabel: `${days} ${days === 1 ? "день" : "дня"}`,
      sub: "фолликулярная фаза",
      color: "#9b59b6",
      bgTop: "linear-gradient(180deg, #e8a0f0 0%, #ce93d8 45%, #f0d0f8 100%)",
      tip: "Уровень энергии растёт. Отличное время для новых начинаний!",
    };
  }
  if (cycleDay === 14) {
    return {
      label: "Овуляция",
      dayLabel: "сегодня",
      sub: "пик фертильности",
      color: "#e06090",
      bgTop: "linear-gradient(180deg, #ff9eb5 0%, #ff5585 45%, #ffb8cc 100%)",
      tip: "Пик фертильности! Самый высокий шанс зачатия.",
    };
  }
  if (cycleDay >= 15 && cycleDay <= 21) {
    return {
      label: "Лютеиновая фаза",
      dayLabel: `день ${cycleDay}`,
      sub: "после овуляции",
      color: "#8b5bb5",
      bgTop: "linear-gradient(180deg, #d4a0e8 0%, #b07ad0 45%, #e8c8f8 100%)",
      tip: "Уровень прогестерона высокий. Возможна лёгкая отёчность.",
    };
  }
  // ПМС 22-28
  const daysLeft = CYCLE_LENGTH - cycleDay + 1;
  return {
    label: "До месячных",
    dayLabel: `${daysLeft} ${daysLeft === 1 ? "день" : daysLeft < 5 ? "дня" : "дней"}`,
    sub: "период ПМС",
    color: "#c060a0",
    bgTop: "linear-gradient(180deg, #ffb8cc 0%, #ff9eb5 45%, #ffd0e0 100%)",
    tip: "Возможны перепады настроения. Магний и отдых помогут.",
  };
}

function getNextEvents(cycleDay: number, lastPeriodStart: Date) {
  const events: { label: string; days: number; emoji: string }[] = [];
  const nextPeriod = addDays(lastPeriodStart, CYCLE_LENGTH);
  const daysToNextPeriod = diffDays(nextPeriod, new Date());
  const daysToOvulation = diffDays(addDays(lastPeriodStart, 13), new Date());
  const daysToFertile = diffDays(addDays(lastPeriodStart, 10), new Date());

  if (daysToFertile > 0) events.push({ label: "Фертильные дни", days: daysToFertile, emoji: "🌱" });
  if (daysToOvulation > 0) events.push({ label: "Овуляция", days: daysToOvulation, emoji: "✨" });
  if (daysToNextPeriod > 0) events.push({ label: "Следующие месячные", days: daysToNextPeriod, emoji: "🌹" });

  return events.slice(0, 3);
}

export default function CyclePage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // lastPeriodStart — дата начала последних месячных (по умолчанию 13 мая)
  const [lastPeriodStart, setLastPeriodStart] = useState(() => {
    const d = new Date(2026, 4, 13); // 13 мая 2026
    return d;
  });

  const [selectedDate, setSelectedDate] = useState(today);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDateStr, setEditDateStr] = useState(
    `${lastPeriodStart.getFullYear()}-${String(lastPeriodStart.getMonth() + 1).padStart(2, "0")}-${String(lastPeriodStart.getDate()).padStart(2, "0")}`
  );

  // Скользящая неделя: 7 дней от -2 до +4 относительно выбранного
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i - 2));

  // Свайп по горизонтали
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      setSelectedDate(d => addDays(d, dx < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  // Вычисляем день цикла для выбранной даты
  const cycleDay = Math.max(1, Math.min(CYCLE_LENGTH, diffDays(selectedDate, lastPeriodStart) + 1));
  const phase = getPhaseInfo(cycleDay);
  const nextEvents = getNextEvents(cycleDay, lastPeriodStart);

  const saveEdit = () => {
    const d = new Date(editDateStr);
    if (!isNaN(d.getTime())) {
      setLastPeriodStart(d);
    }
    setShowEditModal(false);
  };

  const dayLabel = `${selectedDate.getDate()} ${MONTHS_RU[selectedDate.getMonth()]}`;
  const isToday = diffDays(selectedDate, today) === 0;

  return (
    <div className="-mx-4 -mt-3" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* === ВЕРХНИЙ БЛОК с градиентом === */}
      <div className="relative overflow-hidden" style={{ background: phase.bgTop, minHeight: 340, paddingBottom: 40 }}>
        {/* Декоративный круг */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[500px] h-[180px] rounded-full"
          style={{ background: "rgba(255,255,255,0.18)", transform: "translate(-50%, 50%)" }} />

        {/* Заголовок */}
        <div className="flex items-center justify-between px-5 pt-3 pb-2">
          <span className="font-body font-semibold text-base text-white">
            {isToday ? "Сегодня, " : ""}{dayLabel}
          </span>
          <button
            onClick={() => setSelectedDate(today)}
            className="text-white opacity-70 hover:opacity-100 transition-opacity">
            <Icon name="CalendarDays" size={22} />
          </button>
        </div>

        {/* Полоса дней недели */}
        <div className="px-3 mb-1">
          <div className="grid grid-cols-7">
            {weekDays.map((d, i) => {
              const dow = getDayOfWeek(d);
              const isSelected = diffDays(d, selectedDate) === 0;
              const isTd = diffDays(d, today) === 0;
              const cDay = Math.max(1, Math.min(CYCLE_LENGTH, diffDays(d, lastPeriodStart) + 1));
              const mark = getDayMark(cDay);
              const isPast = diffDays(d, today) < 0;
              return (
                <button key={i} onClick={() => setSelectedDate(d)} className="flex flex-col items-center gap-1 py-1">
                  <span className="font-body text-xs font-medium"
                    style={{ color: isSelected ? "white" : "rgba(255,255,255,0.7)" }}>
                    {WEEK_DAYS[dow]}
                  </span>
                  <div className="relative flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{
                        background: isSelected ? "white" : "transparent",
                        border: !isSelected && !isPast ? "2px dashed rgba(255,255,255,0.6)" : "none",
                      }}>
                      <span className="font-body font-bold text-sm"
                        style={{
                          color: isSelected ? phase.color : isPast ? "rgba(255,255,255,0.5)" : "white",
                        }}>
                        {d.getDate()}
                      </span>
                    </div>
                    {mark && (
                      <div className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full"
                        style={{
                          background: mark === "period" ? "#ff3366"
                            : mark === "ovulation" ? "#fff"
                            : mark === "fertile" ? "#90ee90"
                            : "#e0b0e0"
                        }} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Центральный текст */}
        <div className="text-center mt-6 mb-3 px-5">
          <p className="font-body text-white text-base font-medium opacity-90 mb-1">{phase.label}:</p>
          <h2 className="font-display text-white font-bold" style={{ fontSize: 52, lineHeight: 1.05, letterSpacing: "-0.5px" }}>
            {phase.dayLabel}
          </h2>
          <p className="font-body text-white opacity-70 text-sm mt-1">{phase.sub}</p>
        </div>

        {/* Кнопка изменить даты */}
        <div className="flex justify-center px-5">
          <button onClick={() => setShowEditModal(true)}
            className="font-body text-sm font-medium px-6 py-3 rounded-full transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.85)", color: phase.color }}>
            Изменить даты месячных
          </button>
        </div>
      </div>

      {/* === НИЖНИЙ БЕЛЫЙ БЛОК === */}
      <div className="px-4 pt-5 space-y-4" style={{ background: "transparent" }}>

        {/* Ближайшие события */}
        {nextEvents.length > 0 && (
          <div>
            <h3 className="font-body font-semibold text-base mb-3" style={{ color: "#2d1a2e" }}>
              Что впереди
            </h3>
            <div className="space-y-2">
              {nextEvents.map((ev, i) => (
                <div key={i} className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3">
                  <span className="text-xl">{ev.emoji}</span>
                  <div className="flex-1">
                    <div className="font-body font-medium text-sm" style={{ color: "#6a3a6a" }}>{ev.label}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-xl font-semibold" style={{ color: phase.color }}>
                      {ev.days}
                    </span>
                    <span className="font-body text-xs ml-1" style={{ color: "#b088b0" }}>
                      {ev.days === 1 ? "день" : ev.days < 5 ? "дня" : "дней"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Совет дня */}
        <div>
          <h3 className="font-body font-semibold text-base mb-3" style={{ color: "#2d1a2e" }}>
            Совет на сегодня
          </h3>
          <div className="glass-card rounded-2xl p-4 flex items-start gap-3"
            style={{ background: "linear-gradient(135deg, rgba(255,200,220,0.4), rgba(220,180,255,0.3))" }}>
            <span className="text-2xl">💡</span>
            <p className="font-body text-sm leading-relaxed" style={{ color: "#7a3a7a" }}>{phase.tip}</p>
          </div>
        </div>

        {/* День цикла и длина */}
        <div className="grid grid-cols-2 gap-3 pb-4">
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-display text-3xl font-bold" style={{ color: phase.color }}>{cycleDay}</div>
            <div className="font-body text-xs mt-1" style={{ color: "#b088b0" }}>день цикла</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="font-display text-3xl font-bold" style={{ color: "#ce93d8" }}>{CYCLE_LENGTH}</div>
            <div className="font-body text-xs mt-1" style={{ color: "#b088b0" }}>длина цикла</div>
          </div>
        </div>
      </div>

      {/* === МОДАЛКА изменения даты === */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowEditModal(false); }}>
          <div className="w-full max-w-md rounded-t-3xl p-6 pb-8 animate-fade-in"
            style={{ background: "white" }}>
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "#e0c0d8" }} />
            <h3 className="font-display text-2xl font-medium mb-2 text-center" style={{ color: "#d080a0" }}>
              Дата начала месячных
            </h3>
            <p className="font-body text-xs text-center mb-5" style={{ color: "#b088b0" }}>
              Укажите первый день последних месячных
            </p>
            <input
              type="date"
              value={editDateStr}
              onChange={e => setEditDateStr(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl font-body text-base outline-none mb-4"
              style={{ background: "#faf0f8", border: "1.5px solid #f0d0e8", color: "#8a4a8a" }}
            />
            <button onClick={saveEdit}
              className="w-full py-4 rounded-2xl font-body font-semibold text-base text-white transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #f48fb1, #ce93d8)" }}>
              Сохранить
            </button>
            <button onClick={() => setShowEditModal(false)}
              className="w-full py-3 mt-2 font-body text-sm"
              style={{ color: "#b088b0" }}>
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
