import { useState } from "react";
import Icon from "@/components/ui/icon";

const DAYS_OF_WEEK = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

type DayType = "period" | "fertile" | "ovulation" | "pms" | null;

function getDayInfo(day: number, month: number): DayType {
  const periodDays = [1, 2, 3, 4, 5];
  const fertileDays = [11, 12, 13, 15, 16];
  const ovulationDays = [14];
  const pmsDays = [23, 24, 25, 26, 27, 28];
  if (periodDays.includes(day)) return "period";
  if (ovulationDays.includes(day)) return "ovulation";
  if (fertileDays.includes(day)) return "fertile";
  if (pmsDays.includes(day)) return "pms";
  return null;
}

const dayStyles: Record<string, { bg: string; color: string; label: string }> = {
  period: { bg: "#f48fb1", color: "white", label: "Менструация" },
  fertile: { bg: "#c8e6c9", color: "#388e3c", label: "Фертильные дни" },
  ovulation: { bg: "#e06090", color: "white", label: "Овуляция" },
  pms: { bg: "#ede7f6", color: "#9c6db4", label: "ПМС период" },
};

export default function CalendarPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [selected, setSelected] = useState<number | null>(now.getDate());

  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const selectedType = selected ? getDayInfo(selected, month) : null;

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-3xl p-5">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={prevMonth} className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "#fce4ec", color: "#e06090" }}>
            <Icon name="ChevronLeft" size={16} />
          </button>
          <h2 className="font-display text-xl font-medium" style={{ color: "#d080a0" }}>
            {MONTHS[month]} {year}
          </h2>
          <button onClick={nextMonth} className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "#fce4ec", color: "#e06090" }}>
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS_OF_WEEK.map(d => (
            <div key={d} className="text-center text-xs font-body font-medium py-1" style={{ color: "#c4a0c0" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const type = getDayInfo(day, month);
            const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
            const isSelected = day === selected;
            const style = type ? dayStyles[type] : null;

            return (
              <button
                key={day}
                onClick={() => setSelected(day)}
                className="day-cell aspect-square rounded-full flex items-center justify-center text-sm font-body relative"
                style={{
                  background: isSelected && !style ? "#fce4ec"
                    : style ? style.bg
                    : "transparent",
                  color: style ? style.color
                    : isSelected ? "#e06090"
                    : isToday ? "#e06090"
                    : "#9070a0",
                  fontWeight: isToday || isSelected ? "600" : "400",
                  boxShadow: isSelected ? "0 2px 10px rgba(224,96,144,0.3)" : "none",
                }}
              >
                {day}
                {isToday && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: style ? "white" : "#e06090" }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="glass-card rounded-3xl p-5">
        <h3 className="font-display text-lg font-medium mb-3" style={{ color: "#d080a0" }}>Легенда</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(dayStyles).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: val.bg }} />
              <span className="font-body text-xs" style={{ color: "#9070a0" }}>{val.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected day info */}
      {selected && (
        <div className="glass-card rounded-3xl p-5" style={{ background: selectedType ? `${dayStyles[selectedType].bg}30` : undefined }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: selectedType ? dayStyles[selectedType].bg : "#fce4ec" }}>
              {selectedType === "period" ? "🌹" : selectedType === "ovulation" ? "✨" : selectedType === "fertile" ? "🌱" : selectedType === "pms" ? "🌙" : "💜"}
            </div>
            <div>
              <div className="font-body font-medium text-sm" style={{ color: "#d080a0" }}>
                {selected} {MONTHS[month]}
              </div>
              <div className="font-body text-xs mt-0.5" style={{ color: "#9070a0" }}>
                {selectedType ? dayStyles[selectedType].label : "Обычный день"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
