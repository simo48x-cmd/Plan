import React, { useState } from 'react';
import { Calendar, CheckCircle2, Flame, Clock } from 'lucide-react';
import {
  DayProgressState,
  generateDayCurriculum,
  isStudyDayComplete,
  calculateDayStudyHours,
} from '../utils/bootcampEngine';

interface CalendarGrid60Props {
  selectedDay: number;
  days: Record<number, DayProgressState>;
  onSelectDay: (day: number) => void;
}

const PHASES = [
  {
    phase: 1,
    rangeLabel: 'الأيام 1 – 15',
    title: 'المرحلة 1: مرحلة التأسيس وكسر حاجز الخوف في الشفوي',
    subtitle: 'العروض الـ 7 (Teil 1) + 30 رابطاً ذهبياً + الحزم 1..17 في القراءة + عائلات الكودات الـ 11',
    days: Array.from({ length: 15 }, (_, i) => i + 1),
  },
  {
    phase: 2,
    rangeLabel: 'الأيام 16 – 30',
    title: 'المرحلة 2: مرحلة التوسع والطلاقة في المناقشة (Teil 2)',
    subtitle: '20 موضوع مناقشة (Teil 2) + الحزم 18..34 والنصوص المستقلة + 56 موضوع استماع بقاعدة الـ 15',
    days: Array.from({ length: 15 }, (_, i) => i + 16),
  },
  {
    phase: 3,
    rangeLabel: 'الأيام 31 – 45',
    title: 'المرحلة 3: مرحلة الاحتراف والرد التلقائي السريع (Teil 3 & المعدل)',
    subtitle: '25 سيناريو تخطيط (Teil 3) + الدورة الثانية الشاملة مع Shuffle والمعدل 1 & 2 + سرعة < 3 ثوانٍ',
    days: Array.from({ length: 15 }, (_, i) => i + 31),
  },
  {
    phase: 4,
    rangeLabel: 'الأيام 46 – 60',
    title: 'المرحلة 4: مرحلة المحاكاة النهائية والجاهزية 200%',
    subtitle: 'امتحان شفوي تجريبي كامل (15 دقيقة) يومياً + محاكاة كتابية كاملة بالوقت + تصفية بنك أخطائي',
    days: Array.from({ length: 15 }, (_, i) => i + 46),
  },
];

export const CalendarGrid60: React.FC<CalendarGrid60Props> = ({
  selectedDay,
  days,
  onSelectDay,
}) => {
  const [phaseFilter, setPhaseFilter] = useState<number | 'all'>('all');

  const visiblePhases =
    phaseFilter === 'all' ? PHASES : PHASES.filter((p) => p.phase === phaseFilter);

  return (
    <section aria-label="خريطة ومنهج الـ 60 يوماً التفاعلي" className="space-y-6">
      {/* Header & Phase Filter */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
            <span>📅 محرك منهج الـ 60 يوماً التفاعلي (The 60-Day Interactive Curriculum)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            اضغط على أي يوم (اليوم 1 إلى اليوم 60) لتحميل مهامه المبرمجة مسبقاً عبر المواقع الأربعة وساعات الانغماس
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => setPhaseFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              phaseFilter === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            كل المراحل (60 يوماً)
          </button>
          {[1, 2, 3, 4].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPhaseFilter(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                phaseFilter === p
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              المرحلة {p}
            </button>
          ))}
        </div>
      </div>

      {/* Phases & 60 Day Cards */}
      <div className="space-y-6">
        {visiblePhases.map((phaseGroup) => (
          <div
            key={phaseGroup.phase}
            className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-amber-400">
                  {phaseGroup.title}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">{phaseGroup.subtitle}</p>
              </div>
              <span className="text-xs font-mono-num text-slate-400 shrink-0">
                {phaseGroup.rangeLabel}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {phaseGroup.days.map((dayNum) => {
                const dp = days[dayNum];
                const isSelected = dayNum === selectedDay;
                const isComplete = isStudyDayComplete(dp);
                const studyHours = calculateDayStudyHours(dp);
                const preview = generateDayCurriculum(dayNum);

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => onSelectDay(dayNum)}
                    className={`text-right p-3.5 rounded-xl border transition-colors flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400'
                        : isComplete
                        ? 'bg-emerald-950/35 border-emerald-500/50 hover:border-emerald-400'
                        : 'bg-slate-950/85 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between gap-1">
                      <span
                        className={`text-sm font-extrabold font-mono-num ${
                          isSelected ? 'text-amber-300' : 'text-slate-100'
                        }`}
                      >
                        اليوم {dayNum}
                      </span>
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : studyHours > 0 ? (
                        <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      )}
                    </div>

                    <div className="text-[11px] font-latin text-slate-300 line-clamp-2 leading-snug" dir="ltr">
                      {preview.lesenTarget.examPackageDe.split('(')[0]}
                    </div>

                    <div className="w-full pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono-num text-slate-400">
                      <span>{studyHours}/12 س</span>
                      <span className={isComplete ? 'text-emerald-400 font-bold' : ''}>
                        {isComplete ? 'مكتمل 100%' : studyHours > 0 ? 'جارٍ' : 'لم يبدأ'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
