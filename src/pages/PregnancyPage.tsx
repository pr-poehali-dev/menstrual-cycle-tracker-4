import { useState, useRef, useEffect } from "react";

const MONTHS_RU = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
const MONTHS_FULL = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const WEEKDAYS_SHORT = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function diffDays(a: Date, b: Date) { return Math.round((a.getTime() - b.getTime()) / 86400000); }
function sameDay(a: Date, b: Date) { return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }

const EMBRYO_IMAGES = [
  "https://cdn.poehali.dev/projects/03969689-5c29-4313-b9a6-d49bd0d2ebbf/files/24fba075-41e9-421a-a47e-ed6e7897aed9.jpg",
  "https://cdn.poehali.dev/projects/03969689-5c29-4313-b9a6-d49bd0d2ebbf/files/15189c2b-9b00-4b12-aa4a-549c1be85b59.jpg",
  "https://cdn.poehali.dev/projects/03969689-5c29-4313-b9a6-d49bd0d2ebbf/files/a4eaca25-f77b-4c04-98c9-3eb824bb8481.jpg",
  "https://cdn.poehali.dev/projects/03969689-5c29-4313-b9a6-d49bd0d2ebbf/files/68cf906c-0cc8-4a7c-962a-9e938ddbad41.jpg",
];

function getEmbryoImage(week: number): string {
  if (week <= 8) return EMBRYO_IMAGES[0];
  if (week <= 16) return EMBRYO_IMAGES[1];
  if (week <= 28) return EMBRYO_IMAGES[2];
  return EMBRYO_IMAGES[3];
}

const BABY_SIZES: Record<number, { size: string; emoji: string; weight: string }> = {
  4:  { size: "маковое зёрнышко", emoji: "🌱", weight: "< 1 г" },
  6:  { size: "горошина", emoji: "🫛", weight: "< 1 г" },
  8:  { size: "малина", emoji: "🍓", weight: "1 г" },
  10: { size: "клубника", emoji: "🍓", weight: "4 г" },
  12: { size: "лайм", emoji: "🍋", weight: "14 г" },
  14: { size: "лимон", emoji: "🍋", weight: "43 г" },
  16: { size: "авокадо", emoji: "🥑", weight: "100 г" },
  18: { size: "перец", emoji: "🫑", weight: "190 г" },
  20: { size: "банан", emoji: "🍌", weight: "300 г" },
  22: { size: "кукуруза", emoji: "🌽", weight: "430 г" },
  24: { size: "кабачок", emoji: "🥒", weight: "600 г" },
  26: { size: "баклажан", emoji: "🍆", weight: "760 г" },
  28: { size: "кокос", emoji: "🥥", weight: "1 кг" },
  30: { size: "большая капуста", emoji: "🥬", weight: "1.3 кг" },
  32: { size: "дыня", emoji: "🍈", weight: "1.7 кг" },
  34: { size: "ананас", emoji: "🍍", weight: "2.1 кг" },
  36: { size: "папайя", emoji: "🍈", weight: "2.6 кг" },
  38: { size: "тыква", emoji: "🎃", weight: "3 кг" },
  40: { size: "арбуз", emoji: "🍉", weight: "3.4 кг" },
};

function getBabySize(week: number) {
  const keys = Object.keys(BABY_SIZES).map(Number).sort((a,b) => a-b);
  let closest = keys[0];
  for (const k of keys) { if (week >= k) closest = k; else break; }
  return BABY_SIZES[closest];
}

function getWeekInfo(week: number): { title: string; desc: string } {
  if (week <= 4)  return { title: "Начало пути", desc: "Оплодотворённая яйцеклетка имплантировалась в матку" };
  if (week <= 8)  return { title: "Формируется сердечко", desc: "Начинает биться сердце малыша — 150 ударов в минуту" };
  if (week <= 12) return { title: "Все органы заложены", desc: "Сформированы все жизненно важные органы" };
  if (week <= 16) return { title: "Малыш шевелится", desc: "Активные движения, хотя ещё почти не чувствуются" };
  if (week <= 20) return { title: "Можно узнать пол", desc: "УЗИ покажет пол вашего малыша" };
  if (week <= 24) return { title: "Открывает глазки", desc: "Малыш реагирует на свет и звук" };
  if (week <= 28) return { title: "Мозг активно растёт", desc: "Формируются борозды и извилины мозга" };
  if (week <= 32) return { title: "Набирает вес", desc: "Малыш интенсивно накапливает жировую ткань" };
  if (week <= 36) return { title: "Почти готов", desc: "Лёгкие созревают, малыш принимает позу для родов" };
  return { title: "Скоро встреча!", desc: "Малыш полностью готов к появлению на свет" };
}

const DAYS_RANGE = 120;
const DAY_WIDTH = 52;

export default function PregnancyPage() {
  const today = useRef((() => { const d = new Date(); d.setHours(0,0,0,0); return d; })()).current;

  const [conception, setConception] = useState(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - 28 * 7);
    d.setHours(0,0,0,0);
    return d;
  });

  const [selectedDate, setSelectedDate] = useState(today);
  const [showSettings, setShowSettings] = useState(false);
  const [editDate, setEditDate] = useState(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - 28 * 7);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const allDays = Array.from({ length: DAYS_RANGE * 2 + 1 }, (_, i) => addDays(today, i - DAYS_RANGE));

  useEffect(() => {
    if (scrollRef.current) {
      const s = DAYS_RANGE * DAY_WIDTH - scrollRef.current.clientWidth / 2 + DAY_WIDTH / 2;
      scrollRef.current.scrollLeft = Math.max(0, s);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const idx = allDays.findIndex(d => sameDay(d, selectedDate));
      if (idx >= 0) {
        const s = idx * DAY_WIDTH - scrollRef.current.clientWidth / 2 + DAY_WIDTH / 2;
        scrollRef.current.scrollTo({ left: Math.max(0, s), behavior: "smooth" });
      }
    }
  }, [selectedDate]);

  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) setSelectedDate(d => addDays(d, dx < 0 ? 1 : -1));
    touchX.current = null;
  };

  const totalDays = diffDays(selectedDate, conception);
  const totalWeeks = Math.max(0, Math.floor(totalDays / 7));
  const dayInWeek = Math.max(0, totalDays % 7);
  const isPregnant = totalDays >= 0 && totalDays <= 280;
  const pregnancyProgress = Math.min(Math.max(totalDays / 280, 0), 1);

  const embryoImg = getEmbryoImage(totalWeeks);
  const babySize = getBabySize(Math.max(1, totalWeeks));
  const weekInfo = getWeekInfo(Math.max(1, totalWeeks));

  const dow = selectedDate.getDay();
  const dowLabel = ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"][dow];
  const dateLabel = `${dowLabel}, ${String(selectedDate.getDate()).padStart(2,"0")} ${["Января","Февраля","Марта","Апреля","Мая","Июня","Июля","Августа","Сентября","Октября","Ноября","Декабря"][selectedDate.getMonth()]}`;

  const pdr = addDays(conception, 280);
  const daysLeft = Math.max(0, diffDays(pdr, today));

  const saveSettings = () => {
    const d = new Date(editDate);
    if (!isNaN(d.getTime())) { d.setHours(0,0,0,0); setConception(d); }
    setShowSettings(false);
  };

  return (
    <div style={{ background: "linear-gradient(160deg, #dff0ea 0%, #f5ede0 60%, #faf0e8 100%)", minHeight: "100%" }}>

      {/* Шапка */}
      <div className="px-4" style={{ paddingTop: "env(safe-area-inset-top, 16px)" }}>
        <div className="flex items-end justify-between pt-5 pb-3">
          <h1 className="font-body font-black text-3xl" style={{ color: "#1a2810", letterSpacing: "-0.5px" }}>
            {MONTHS_FULL[selectedDate.getMonth()]}
          </h1>
          <span className="font-body text-sm mb-1" style={{ color: "#90a880" }}>
            {selectedDate.getFullYear()}
          </span>
        </div>

        {/* Заголовки дней недели */}
        <div className="grid grid-cols-7 mb-1 px-0">
          {WEEKDAYS_SHORT.map(d => (
            <div key={d} className="text-center py-0.5">
              <span className="text-[11px] font-body font-semibold" style={{ color: "#b8a888" }}>{d}</span>
            </div>
          ))}
        </div>

        {/* Прокручиваемая полоса дней */}
        <div ref={scrollRef} className="overflow-x-auto mb-5"
          style={{ scrollbarWidth: "none", overflowY: "hidden", margin: "0 -16px", padding: "0 0" }}>
          <div className="flex" style={{ width: allDays.length * DAY_WIDTH }}>
            {allDays.map((d, i) => {
              const isSel = sameDay(d, selectedDate);
              const isTd = sameDay(d, today);
              const isPast = diffDays(d, today) < 0;
              const totalD = diffDays(d, conception);
              const isInPreg = totalD >= 0 && totalD <= 280;

              return (
                <button key={i} onClick={() => setSelectedDate(d)}
                  className="flex-shrink-0 flex flex-col items-center justify-end pb-1"
                  style={{ width: DAY_WIDTH, height: 52 }}>
                  <span className="text-[10px] font-body font-bold mb-0.5"
                    style={{ color: isInPreg ? "#d4904a" : "transparent" }}>
                    {isInPreg ? totalD + 1 : "."}
                  </span>
                  {isSel ? (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: "white", boxShadow: "0 2px 14px rgba(212,144,74,0.4)" }}>
                      <span className="font-body font-black text-base" style={{ color: "#d4904a" }}>{d.getDate()}</span>
                    </div>
                  ) : isTd ? (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ border: "2px solid #d4904a" }}>
                      <span className="font-body font-bold text-base" style={{ color: "#d4904a" }}>{d.getDate()}</span>
                    </div>
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center">
                      <span className="font-body font-semibold text-base"
                        style={{ color: isPast ? "#c0b090" : "#3a2810" }}>{d.getDate()}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Большой круг с эмбрионом */}
      <div className="flex flex-col items-center px-4"
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="relative flex items-center justify-center"
          style={{ width: "86vw", maxWidth: 330, height: "86vw", maxHeight: 330 }}>

          {/* Внешняя тень-ореол */}
          <div className="absolute rounded-full"
            style={{
              inset: -8,
              background: "radial-gradient(circle, rgba(230,160,70,0.25) 0%, transparent 70%)",
              filter: "blur(12px)",
            }} />

          {/* Основной круг */}
          <div className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: "radial-gradient(circle at 38% 32%, #f5c86a 0%, #e89040 45%, #c06820 100%)",
              boxShadow: "0 10px 50px rgba(190,110,30,0.45), inset 0 -4px 20px rgba(0,0,0,0.15)",
            }}>
            <img
              key={embryoImg}
              src={embryoImg}
              alt=""
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "90%",
                height: "80%",
                objectFit: "cover",
                objectPosition: "top center",
                mixBlendMode: "multiply",
                opacity: 0.85,
                transition: "all 0.8s ease",
              }}
            />
            {/* Световой блик сверху */}
            <div className="absolute top-0 left-0 right-0 rounded-full"
              style={{ height: "45%", background: "radial-gradient(ellipse at 40% 20%, rgba(255,240,200,0.45) 0%, transparent 70%)" }} />
          </div>

          {/* Текст поверх */}
          <div className="relative z-10 text-center w-full px-5" style={{ paddingBottom: 70, paddingTop: 20 }}>
            <p className="font-body text-xs mb-1.5"
              style={{ color: "rgba(255,255,255,0.8)", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
              {dateLabel}
            </p>
            {isPregnant ? (
              <>
                <p className="font-body font-semibold text-base"
                  style={{ color: "rgba(255,255,255,0.95)", textShadow: "0 1px 6px rgba(0,0,0,0.35)" }}>
                  Беременность:
                </p>
                <p className="font-body font-black text-2xl leading-tight"
                  style={{ color: "white", textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>
                  {totalWeeks}-я неделя, {dayInWeek + 1}-й день
                </p>
              </>
            ) : (
              <p className="font-body font-black text-xl"
                style={{ color: "white", textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>
                {totalDays < 0 ? "Введите дату начала" : "🎉 Малыш родился!"}
              </p>
            )}
          </div>

          {/* Кнопка настройки */}
          <button onClick={() => setShowSettings(true)}
            className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 px-8 py-2.5 rounded-full font-body font-semibold text-sm active:scale-95 transition-all"
            style={{ background: "rgba(255,255,255,0.93)", color: "#d4904a", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
            Настройки
          </button>

          {/* FAB кнопка + */}
          <button className="absolute -bottom-5 -right-2 z-20 w-14 h-14 rounded-full flex items-center justify-center active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg, #40c8c0, #2aaa98)", boxShadow: "0 4px 20px rgba(40,170,150,0.45)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Инфо ниже */}
      {isPregnant && (
        <div className="px-4 mt-8 space-y-3" style={{ paddingBottom: 100 }}>

          {/* Прогресс */}
          <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(12px)" }}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-body font-semibold text-sm" style={{ color: "#2a1800" }}>Прогресс беременности</span>
              <span className="font-body font-black text-sm" style={{ color: "#d4904a" }}>
                {Math.round(pregnancyProgress * 100)}%
              </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: "#f0e0c0" }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pregnancyProgress * 100}%`, background: "linear-gradient(90deg, #f5c060, #d4804a)" }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs font-body" style={{ color: "#c8a880" }}>1 нед</span>
              <span className="text-xs font-body" style={{ color: "#c8a880" }}>40 нед</span>
            </div>
          </div>

          {/* Размер и дни до ПДР */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-4 text-center"
              style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(12px)" }}>
              <div className="text-3xl mb-1">{babySize.emoji}</div>
              <div className="font-body font-bold text-sm" style={{ color: "#2a1800" }}>Размер</div>
              <div className="font-body text-xs mt-0.5 leading-snug" style={{ color: "#a08060" }}>{babySize.size}</div>
            </div>
            <div className="rounded-2xl p-4 text-center"
              style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(12px)" }}>
              <div className="font-body font-black text-3xl" style={{ color: "#d4904a" }}>{daysLeft}</div>
              <div className="font-body font-bold text-sm" style={{ color: "#2a1800" }}>Дней до ПДР</div>
              <div className="font-body text-xs mt-0.5" style={{ color: "#a08060" }}>
                {pdr.getDate()} {MONTHS_RU[pdr.getMonth()]}
              </div>
            </div>
          </div>

          {/* Факт недели */}
          <div className="rounded-2xl p-4 flex items-start gap-3"
            style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(12px)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: "rgba(240,190,100,0.25)" }}>🌟</div>
            <div>
              <div className="font-body font-bold text-sm mb-0.5" style={{ color: "#2a1800" }}>{weekInfo.title}</div>
              <div className="font-body text-xs leading-relaxed" style={{ color: "#8a7050" }}>{weekInfo.desc}</div>
            </div>
          </div>

          {/* Вес */}
          <div className="rounded-2xl p-4 flex items-center gap-4"
            style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(12px)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: "rgba(240,190,100,0.25)" }}>⚖️</div>
            <div>
              <div className="font-body text-xs" style={{ color: "#a08060" }}>Примерный вес</div>
              <div className="font-body font-black text-2xl" style={{ color: "#d4904a" }}>{babySize.weight}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="font-body text-xs" style={{ color: "#a08060" }}>Неделя</div>
              <div className="font-body font-black text-2xl" style={{ color: "#d4904a" }}>{totalWeeks}</div>
            </div>
          </div>
        </div>
      )}

      {/* Модалка настроек */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={e => { if (e.currentTarget===e.target) setShowSettings(false); }}>
          <div className="w-full max-w-md rounded-t-3xl px-5 pt-5 pb-10"
            style={{ background: "white" }}>
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "#e0d0b0" }} />
            <h3 className="font-body font-black text-xl text-center mb-1" style={{ color: "#1a0a00" }}>
              Начало беременности
            </h3>
            <p className="font-body text-sm text-center mb-5" style={{ color: "#b09060" }}>
              Первый день последней менструации
            </p>
            <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl font-body text-base outline-none mb-4"
              style={{ background: "#fff8ee", border: "1.5px solid #f0d090", color: "#3a2000" }}/>
            <button onClick={saveSettings}
              className="w-full py-4 rounded-full font-body font-black text-base text-white mb-2 active:scale-95 transition-all"
              style={{ background: "linear-gradient(135deg, #f5c060, #d4804a)" }}>
              Сохранить
            </button>
            <button onClick={() => setShowSettings(false)}
              className="w-full py-2 font-body text-sm" style={{ color: "#ccc" }}>
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
