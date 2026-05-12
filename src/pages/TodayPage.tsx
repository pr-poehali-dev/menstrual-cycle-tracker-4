import { useState, useRef, useEffect } from "react";

const CYCLE_LENGTH = 28;
const PERIOD_LENGTH = 5;

const MONTHS_RU = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
const MONTHS_SHORT = ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"];
const WEEKDAYS = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];
const WEEKDAYS_FULL = ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"];

function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function diffDays(a: Date, b: Date) { return Math.round((a.getTime() - b.getTime()) / 86400000); }
function sameDay(a: Date, b: Date) { return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function daysInMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth()+1, 0).getDate(); }

function getCycleDay(date: Date, lastPeriod: Date) {
  const d = diffDays(date, lastPeriod);
  if (d < 0) {
    const mod = ((d % CYCLE_LENGTH) + CYCLE_LENGTH) % CYCLE_LENGTH;
    return mod === 0 ? CYCLE_LENGTH : mod;
  }
  return (d % CYCLE_LENGTH) + 1;
}

function getPhaseLabel(cycleDay: number, periodDates: Set<string>, date: Date): { title: string; subtitle: string; color: string } {
  const key = dateKey(date);
  if (periodDates.has(key)) {
    return { title: "Месячные:", subtitle: `${cycleDay}-й день`, color: "#e05080" };
  }
  if (cycleDay >= 1 && cycleDay <= PERIOD_LENGTH) {
    return { title: "Месячные:", subtitle: `${cycleDay}-й день`, color: "#e05080" };
  }
  if (cycleDay >= 6 && cycleDay <= 13) {
    const d = 14 - cycleDay;
    return { title: "До овуляции:", subtitle: `${d} ${d===1?"день":d<5?"дня":"дней"}`, color: "#9b59b6" };
  }
  if (cycleDay === 14) return { title: "Овуляция:", subtitle: "сегодня ✨", color: "#e05080" };
  if (cycleDay >= 15 && cycleDay <= 21) {
    return { title: "После овуляции:", subtitle: `${cycleDay-14}-й день`, color: "#8b5bb5" };
  }
  const daysLeft = CYCLE_LENGTH - cycleDay + 1;
  return { title: "До месячных:", subtitle: `${daysLeft} ${daysLeft===1?"день":daysLeft<5?"дня":"дней"}`, color: "#c060a0" };
}

function getDayType(cycleDay: number, periodDates: Set<string>, date: Date): "period"|"fertile"|"ovulation"|"pms"|"normal" {
  if (periodDates.has(dateKey(date))) return "period";
  if (cycleDay >= 1 && cycleDay <= PERIOD_LENGTH) return "period";
  if (cycleDay === 14) return "ovulation";
  if (cycleDay >= 11 && cycleDay <= 16) return "fertile";
  if (cycleDay >= 22) return "pms";
  return "normal";
}

function dateKey(d: Date) { return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }

function getFertilityText(cycleDay: number): { label: string; color: string } {
  if (cycleDay === 14) return { label: "Очень высокая", color: "#e05080" };
  if (cycleDay >= 11 && cycleDay <= 13) return { label: "Высокая", color: "#ff7096" };
  if (cycleDay >= 9 && cycleDay <= 16) return { label: "Средняя", color: "#f0a030" };
  if (cycleDay >= 1 && cycleDay <= 5) return { label: "Очень низкая", color: "#aaa" };
  return { label: "Низкая", color: "#ccc" };
}

// Генерируем 90 дней вперёд и назад для скролл-полосы
const DAYS_RANGE = 120;

export default function TodayPage() {
  const today = useRef((() => { const d = new Date(); d.setHours(0,0,0,0); return d; })()).current;

  const [lastPeriod, setLastPeriod] = useState(() => {
    const d = new Date(2026, 4, 13); d.setHours(0,0,0,0); return d;
  });
  // Отмеченные дни месячных вручную
  const [periodDates, setPeriodDates] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState(today);
  const [showModal, setShowModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [editDate, setEditDate] = useState("2026-05-13");
  const [calMonth, setCalMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [activeTab, setActiveTab] = useState<"today"|"period">("today");

  // Список всех дней для горизонтальной полосы
  const allDays = Array.from({ length: DAYS_RANGE * 2 + 1 }, (_, i) => addDays(today, i - DAYS_RANGE));
  const todayIndex = DAYS_RANGE;

  // Ref на скролл-контейнер
  const scrollRef = useRef<HTMLDivElement>(null);
  const dayWidth = 52; // px на один день

  // При монтировании — скроллим к сегодня
  useEffect(() => {
    if (scrollRef.current) {
      const targetScroll = todayIndex * dayWidth - scrollRef.current.clientWidth / 2 + dayWidth / 2;
      scrollRef.current.scrollLeft = Math.max(0, targetScroll);
    }
  }, []);

  // При смене selectedDate — скроллим к нему
  useEffect(() => {
    if (scrollRef.current) {
      const idx = allDays.findIndex(d => sameDay(d, selectedDate));
      if (idx >= 0) {
        const targetScroll = idx * dayWidth - scrollRef.current.clientWidth / 2 + dayWidth / 2;
        scrollRef.current.scrollTo({ left: Math.max(0, targetScroll), behavior: "smooth" });
      }
    }
  }, [selectedDate]);

  // Свайп на главном блоке
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) setSelectedDate(d => addDays(d, dx < 0 ? 1 : -1));
    touchX.current = null;
  };

  const cycleDay = getCycleDay(selectedDate, lastPeriod);
  const phase = getPhaseLabel(cycleDay, periodDates, selectedDate);
  const dayType = getDayType(cycleDay, periodDates, selectedDate);
  const fertility = getFertilityText(cycleDay);
  const isToday = sameDay(selectedDate, today);
  const formattedDate = `${selectedDate.getDate()} ${MONTHS_RU[selectedDate.getMonth()]}`;
  const isPeriodDay = periodDates.has(dateKey(selectedDate));

  const togglePeriod = () => {
    const key = dateKey(selectedDate);
    setPeriodDates(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const saveModal = () => {
    const d = new Date(editDate);
    if (!isNaN(d.getTime())) { d.setHours(0,0,0,0); setLastPeriod(d); }
    setShowModal(false);
  };

  // Цвет фона в зависимости от фазы
  const bgGradient = dayType === "period"
    ? "linear-gradient(180deg, #ffb8c8 0%, #ff6090 40%, #ff9eb8 68%, #ffcdd8 85%, #fff5f7 100%)"
    : dayType === "ovulation"
    ? "linear-gradient(180deg, #ffb8c8 0%, #e05080 40%, #ff9eb8 68%, #ffd8e8 85%, #fff5f7 100%)"
    : dayType === "fertile"
    ? "linear-gradient(180deg, #e0d0f8 0%, #b090e0 40%, #d0c0f0 68%, #ede0ff 85%, #fff5f7 100%)"
    : dayType === "pms"
    ? "linear-gradient(180deg, #f0c8e0 0%, #c070a8 40%, #e0a8cc 68%, #f5d8ec 85%, #fff5f7 100%)"
    : "linear-gradient(180deg, #ffd8e8 0%, #ff9eb8 40%, #ffc0d4 68%, #ffe0ea 85%, #fff5f7 100%)";

  // Календарь: дни месяца
  const calFirstDay = (() => { const d = calMonth.getDay(); return d === 0 ? 6 : d - 1; })();
  const calDaysCount = daysInMonth(calMonth);

  return (
    <div style={{ background: "#fff5f7", minHeight: "100%" }}>

      {/* ====== ВЕРХНИЙ ГРАДИЕНТНЫЙ БЛОК ====== */}
      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
        style={{ background: bgGradient, position: "relative", paddingBottom: 56, transition: "background 0.4s ease" }}>

        {/* Шапка */}
        <div className="flex items-center justify-between px-4" style={{ paddingTop: "env(safe-area-inset-top, 12px)", paddingBottom: 10, paddingLeft: 16, paddingRight: 16 }}>
          <div className="relative">
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-2xl"
              style={{ background: "#ffcc99" }}>🐱</div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full"
              style={{ background: "#ff5080", border: "2px solid white" }} />
          </div>
          <span className="font-body font-semibold text-base" style={{ color: "#2a0a1a" }}>{formattedDate}</span>
          <button onClick={() => setShowCalendar(true)}
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.35)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="17" rx="2.5" stroke="#2a0a1a" strokeWidth="1.8"/>
              <path d="M3 9h18" stroke="#2a0a1a" strokeWidth="1.8"/>
              <path d="M8 2v3M16 2v3" stroke="#2a0a1a" strokeWidth="1.8" strokeLinecap="round"/>
              <rect x="7" y="12" width="2.5" height="2.5" rx="0.5" fill="#2a0a1a"/>
              <rect x="11" y="12" width="2.5" height="2.5" rx="0.5" fill="#2a0a1a"/>
              <rect x="15" y="12" width="2.5" height="2.5" rx="0.5" fill="#2a0a1a"/>
              <rect x="7" y="16" width="2.5" height="2.5" rx="0.5" fill="#2a0a1a"/>
              <rect x="11" y="16" width="2.5" height="2.5" rx="0.5" fill="#2a0a1a"/>
            </svg>
          </button>
        </div>

        {/* ====== ГОРИЗОНТАЛЬНАЯ ПРОКРУЧИВАЕМАЯ ПОЛОСА ДНЕЙ ====== */}
        <div className="mb-1 px-0">
          {/* Дни недели над числами — статичные */}
          <div className="grid grid-cols-7 px-3 mb-0.5">
            {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map(d => (
              <div key={d} className="text-center">
                <span className="text-[10px] font-body font-semibold" style={{ color: "rgba(42,10,26,0.45)" }}>{d}</span>
              </div>
            ))}
          </div>

          {/* Прокручиваемая полоса */}
          <div
            ref={scrollRef}
            className="overflow-x-auto"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch", overflowY: "hidden" }}
          >
            <div className="flex" style={{ width: allDays.length * dayWidth, paddingBottom: 2 }}>
              {allDays.map((d, i) => {
                const isSel = sameDay(d, selectedDate);
                const isTd = sameDay(d, today);
                const isPast = diffDays(d, today) < 0;
                const isFuture = diffDays(d, today) > 0;
                const cDay = getCycleDay(d, lastPeriod);
                const dType = getDayType(cDay, periodDates, d);
                const hasPeriod = periodDates.has(dateKey(d)) || (cDay >= 1 && cDay <= PERIOD_LENGTH);

                return (
                  <button key={i} onClick={() => setSelectedDate(d)}
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{ width: dayWidth, height: 46 }}>
                    {isSel ? (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: "white", boxShadow: "0 2px 14px rgba(255,80,120,0.3)" }}>
                        <span className="font-body font-black text-base" style={{ color: "#e05080" }}>{d.getDate()}</span>
                      </div>
                    ) : isFuture ? (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center relative">
                        <svg className="absolute inset-0" width="40" height="40" viewBox="0 0 40 40">
                          <circle cx="20" cy="20" r="17" fill="none" stroke={hasPeriod ? "#e05080" : "rgba(224,80,128,0.4)"}
                            strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round"/>
                        </svg>
                        <span className="font-body font-semibold text-sm relative z-10"
                          style={{ color: hasPeriod ? "#e05080" : "rgba(224,80,128,0.65)" }}>{d.getDate()}</span>
                      </div>
                    ) : (
                      <div className="relative flex items-center justify-center w-10 h-10">
                        {hasPeriod && dType === "period" && (
                          <div className="absolute inset-0 rounded-full opacity-30" style={{ background: "#ff6090" }} />
                        )}
                        <span className="font-body font-semibold text-sm relative z-10"
                          style={{ color: isPast ? "rgba(42,10,26,0.4)" : "#2a0a1a" }}>{d.getDate()}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Большой текст фазы */}
        <div className="text-center px-6 mt-2 mb-5" style={{ userSelect: "none" }}>
          <p className="font-body font-semibold text-lg mb-1" style={{ color: "rgba(42,10,26,0.85)" }}>
            {phase.title}
          </p>
          <h1 className="font-body font-black" style={{ fontSize: 54, lineHeight: 1, color: "#1a0510", letterSpacing: "-1.5px" }}>
            {phase.subtitle}
          </h1>
        </div>

        {/* Кнопка "Изменить даты" */}
        <div className="flex justify-center px-6 mb-1">
          <button onClick={() => setShowModal(true)}
            className="font-body font-semibold text-sm px-7 py-3 rounded-full transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.88)", color: "#e05080" }}>
            Изменить даты месячных
          </button>
        </div>

        {/* Волна */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: 56 }}>
          <svg viewBox="0 0 390 56" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
            <path d="M0,28 Q97,0 195,28 Q292,56 390,28 L390,56 L0,56 Z" fill="#fff5f7"/>
          </svg>
        </div>
      </div>

      {/* ====== СВЕТЛАЯ ЗОНА ====== */}
      <div className="px-4 pt-3 space-y-5" style={{ paddingBottom: 100 }}>

        {/* Кнопка отметить месячные */}
        <button onClick={togglePeriod}
          className="w-full py-4 rounded-2xl font-body font-bold text-base transition-all active:scale-95 flex items-center justify-center gap-2"
          style={{
            background: isPeriodDay
              ? "linear-gradient(135deg, #ff6090, #e05080)"
              : "white",
            color: isPeriodDay ? "white" : "#e05080",
            border: isPeriodDay ? "none" : "2px solid #ffb0cc",
            boxShadow: isPeriodDay ? "0 4px 20px rgba(224,80,128,0.35)" : "0 2px 10px rgba(255,80,120,0.08)",
          }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            {isPeriodDay
              ? <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              : <path d="M12 5v14M5 12h14" stroke="#e05080" strokeWidth="2.5" strokeLinecap="round"/>}
          </svg>
          {isPeriodDay ? "Месячные отмечены" : "Отметить месячные сегодня"}
        </button>

        {/* Советы на каждый день */}
        <div>
          <h2 className="font-body font-bold text-xl mb-3" style={{ color: "#1a0510" }}>Советы на каждый день</h2>
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>

            {/* Карточка симптомы */}
            <div className="flex-shrink-0 w-36 rounded-2xl p-4 flex flex-col"
              style={{ background: "white", minHeight: 148, boxShadow: "0 2px 12px rgba(255,80,120,0.08)" }}>
              <p className="font-body font-bold text-sm leading-snug" style={{ color: "#1a0510" }}>
                Отметьте<br />свои<br />симптомы
              </p>
              <div className="mt-auto pt-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "#e05080" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Карточка фертильность */}
            <div className="flex-shrink-0 w-36 rounded-2xl p-4 flex flex-col"
              style={{ background: "white", minHeight: 148, border: "2px solid #ffe0ea", boxShadow: "0 2px 10px rgba(255,80,120,0.06)" }}>
              <p className="font-body text-xs text-center mb-3 leading-snug" style={{ color: "#999" }}>
                Вероятность<br />забеременеть<br />сегодня
              </p>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-center"
                  style={{ background: "#f8f0f5", border: `2px solid ${fertility.color}30` }}>
                  <span className="font-body font-bold text-[11px]" style={{ color: fertility.color }}>
                    {fertility.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Карточка фаза */}
            <div className="flex-shrink-0 w-36 rounded-2xl p-4 flex flex-col items-center justify-center"
              style={{ background: "white", minHeight: 148, border: "2px solid #ffe8f0" }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2"
                style={{ background: "#fff0f5" }}>
                <span className="text-2xl">
                  {dayType==="period"?"🌹":dayType==="ovulation"?"✨":dayType==="fertile"?"🌱":dayType==="pms"?"🌙":"💜"}
                </span>
              </div>
              <p className="font-body text-xs text-center" style={{ color: "#bbb" }}>
                День {cycleDay} из {CYCLE_LENGTH}
              </p>
            </div>

            {/* Карточка совет */}
            <div className="flex-shrink-0 w-36 rounded-2xl p-4 flex flex-col"
              style={{ background: "white", minHeight: 148, border: "2px solid #ffe8f0" }}>
              <p className="font-body text-xs font-semibold mb-2" style={{ color: "#e05080" }}>Совет дня</p>
              <p className="font-body text-xs leading-snug" style={{ color: "#888" }}>
                {dayType==="period" && "Тепло и отдых — лучшие помощники в эти дни"}
                {dayType==="fertile" && "Пик энергии! Время для важных дел"}
                {dayType==="ovulation" && "Лучший день для зачатия"}
                {dayType==="pms" && "Магний и омега-3 помогут с настроением"}
                {dayType==="normal" && "Прислушайтесь к своему телу"}
              </p>
            </div>
          </div>
        </div>

        {/* Мои циклы */}
        <div>
          <h2 className="font-body font-bold text-xl mb-3" style={{ color: "#1a0510" }}>Мои циклы</h2>
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "white", boxShadow: "0 2px 12px rgba(255,80,120,0.07)" }}>
            <div className="grid grid-cols-3 px-4 py-2.5 border-b" style={{ borderColor: "#f5e0ea" }}>
              {["Начало","Длина","Менструация"].map((h,i) => (
                <span key={h} className={`font-body text-xs font-semibold ${i===1?"text-center":i===2?"text-right":""}`}
                  style={{ color: "#ccc" }}>{h}</span>
              ))}
            </div>
            {[
              { start: "13 мая 2026", length: 28, period: 5 },
              { start: "15 апр 2026", length: 29, period: 5 },
              { start: "17 мар 2026", length: 28, period: 6 },
              { start: "18 фев 2026", length: 27, period: 5 },
            ].map((c, i) => (
              <div key={i} className="grid grid-cols-3 px-4 py-3 border-b last:border-0"
                style={{ borderColor: "#f8f0f5" }}>
                <span className="font-body text-sm" style={{ color: "#2a0a1a" }}>{c.start}</span>
                <span className="font-body text-sm text-center" style={{ color: "#2a0a1a" }}>{c.length} дн</span>
                <span className="font-body text-sm text-right" style={{ color: "#e05080" }}>{c.period} дн</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ====== МОДАЛКА: изменить даты ====== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={e => { if (e.currentTarget===e.target) setShowModal(false); }}>
          <div className="w-full max-w-md rounded-t-3xl px-5 pt-5 pb-10 animate-fade-in"
            style={{ background: "white" }}>
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "#e8d0dc" }} />
            <h3 className="font-body font-black text-xl text-center mb-1" style={{ color: "#1a0510" }}>
              Даты месячных
            </h3>
            <p className="font-body text-sm text-center mb-5" style={{ color: "#b088b0" }}>
              Первый день последних месячных
            </p>
            <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl font-body text-base outline-none mb-4"
              style={{ background: "#fff0f5", border: "1.5px solid #ffd0e0", color: "#3a1a2a" }}/>
            <button onClick={saveModal}
              className="w-full py-4 rounded-full font-body font-black text-base text-white mb-2 active:scale-95 transition-all"
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

      {/* ====== ПОЛНОЭКРАННЫЙ КАЛЕНДАРЬ ====== */}
      {showCalendar && (
        <div className="fixed inset-0 z-50 flex flex-col"
          style={{ background: "#fff5f7" }}>
          {/* Шапка календаря */}
          <div className="flex items-center justify-between px-4 py-4 border-b"
            style={{ borderColor: "#ffe0ea", paddingTop: "calc(env(safe-area-inset-top, 12px) + 12px)" }}>
            <button onClick={() => setShowCalendar(false)}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "#ffe0ea" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="#e05080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => setCalMonth(m => new Date(m.getFullYear(), m.getMonth()-1, 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#ffe8f0" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="#e05080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h2 className="font-body font-bold text-base" style={{ color: "#1a0510", minWidth: 140, textAlign: "center" }}>
                {MONTHS_SHORT[calMonth.getMonth()]} {calMonth.getFullYear()}
              </h2>
              <button onClick={() => setCalMonth(m => new Date(m.getFullYear(), m.getMonth()+1, 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#ffe8f0" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="#e05080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div style={{ width: 40 }} />
          </div>

          {/* Дни недели */}
          <div className="grid grid-cols-7 px-4 pt-3 pb-1">
            {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map(d => (
              <div key={d} className="text-center py-1">
                <span className="font-body text-xs font-semibold" style={{ color: "#ccc" }}>{d}</span>
              </div>
            ))}
          </div>

          {/* Сетка дней */}
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <div className="grid grid-cols-7 gap-y-1">
              {/* Пустые ячейки до первого дня */}
              {Array.from({ length: calFirstDay }).map((_,i) => <div key={`e${i}`} />)}
              {Array.from({ length: calDaysCount }).map((_, i) => {
                const day = i + 1;
                const d = new Date(calMonth.getFullYear(), calMonth.getMonth(), day);
                d.setHours(0,0,0,0);
                const isSel = sameDay(d, selectedDate);
                const isTd = sameDay(d, today);
                const isPast = diffDays(d, today) < 0;
                const isFut = diffDays(d, today) > 0;
                const cDay = getCycleDay(d, lastPeriod);
                const dType = getDayType(cDay, periodDates, d);
                const isPeriod = dType === "period";
                const isOvul = dType === "ovulation";
                const isFertile = dType === "fertile";
                const isPms = dType === "pms";

                const bgColor = isPeriod ? "#ff6090"
                  : isOvul ? "#e05080"
                  : isFertile ? "#c8a0e8"
                  : isPms ? "#e8c0e0"
                  : "transparent";
                const textColor = isPeriod || isOvul ? "white"
                  : isFertile ? "#6030a0"
                  : isPms ? "#a05080"
                  : isSel ? "#e05080"
                  : isTd ? "#e05080"
                  : isPast ? "#aaa"
                  : "#2a0a1a";

                return (
                  <button key={day}
                    onClick={() => { setSelectedDate(d); setShowCalendar(false); }}
                    className="flex items-center justify-center relative"
                    style={{ height: 46 }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center relative"
                      style={{
                        background: isSel ? "white" : bgColor,
                        border: isSel ? "2.5px solid #e05080" : isTd && !isSel ? "2px solid #ffb0cc" : "none",
                        boxShadow: isSel ? "0 2px 12px rgba(224,80,128,0.25)" : "none",
                      }}>
                      <span className="font-body font-semibold text-sm"
                        style={{ color: isSel ? "#e05080" : textColor }}>
                        {day}
                      </span>
                    </div>
                    {/* Точка — отмеченный вручную день */}
                    {periodDates.has(dateKey(d)) && !isPeriod && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                        style={{ background: "#e05080" }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Легенда */}
            <div className="mt-5 rounded-2xl p-4" style={{ background: "white", boxShadow: "0 2px 10px rgba(255,80,120,0.07)" }}>
              <p className="font-body font-bold text-sm mb-3" style={{ color: "#1a0510" }}>Обозначения</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { color: "#ff6090", label: "Менструация" },
                  { color: "#c8a0e8", label: "Фертильные дни" },
                  { color: "#e05080", label: "Овуляция" },
                  { color: "#e8c0e0", label: "ПМС" },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: l.color }} />
                    <span className="font-body text-xs" style={{ color: "#888" }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
