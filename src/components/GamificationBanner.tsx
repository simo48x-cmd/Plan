import React from 'react';
import { Award, Flame, Crown, Film, CheckCircle2, Lock, TrendingUp } from 'lucide-react';
import {
  BootcampMetrics,
  DailyMissionDetails,
  DayProgressState,
  isEveningEntertainmentUnlocked,
  isStudyDayComplete,
  calculateDayXp,
  calculateDayStudyHours,
} from '../utils/bootcampEngine';

interface GamificationBannerProps {
  mission: DailyMissionDetails;
  dayProgress: DayProgressState;
  metrics: BootcampMetrics;
  onSelectRankModal?: () => void;
}

export const GamificationBanner: React.FC<GamificationBannerProps> = ({
  mission,
  dayProgress,
  metrics,
  onSelectRankModal,
}) => {
  const eveningUnlocked = isEveningEntertainmentUnlocked(dayProgress);
  const studyComplete = isStudyDayComplete(dayProgress);
  const dayXp = calculateDayXp(dayProgress);
  const dayHours = calculateDayStudyHours(dayProgress);

  return (
    <section aria-label="لوحة الرتبة التدريبية والمكافآت اليومية" className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
      {/* Top Row: Current Rank & Global KPI Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Rank Progression Box */}
        <div className="lg:col-span-5 bg-slate-950/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
              <span className="font-semibold text-amber-400">{metrics.currentRank.badgeText}</span>
              <span className="font-mono-num">
                الرتبة {metrics.currentRank.id} من 7
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-100 leading-snug">
              {metrics.currentRank.titleAr}
            </h2>
            <p className="text-xs font-latin text-emerald-400 font-semibold mt-0.5" dir="ltr">
              {metrics.currentRank.titleDe}
            </p>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {metrics.currentRank.description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">
                {metrics.nextRank
                  ? `التقدم نحو ${metrics.nextRank.titleAr}`
                  : 'تم الوصول إلى أعلى رتبة أسطورية (200%)'}
              </span>
              <span className="font-mono-num text-amber-400 font-bold">
                {metrics.totalXp.toLocaleString('en-US')} XP
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-transform duration-200 origin-right"
                style={{ width: `${metrics.rankProgressPercent}%` }}
              />
            </div>
            {onSelectRankModal && (
              <button
                type="button"
                onClick={onSelectRankModal}
                className="mt-2.5 text-xs text-amber-400 hover:text-amber-300 underline underline-offset-4 transition-colors"
              >
                عرض سلم الرتب التدريبية الـ 7 بالكامل
              </button>
            )}
          </div>
        </div>

        {/* 4 Core KPI Stat Blocks */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>نقاط اليوم</span>
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-extrabold text-slate-100 font-mono-num">
                +{dayXp}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {studyComplete ? 'شامل مكافأة +1000 XP' : 'أكمل 12 ساعة لربح +1000 XP'}
              </div>
            </div>
            <div className="text-xs text-emerald-400 font-mono-num">
              الإجمالي: {metrics.totalXp.toLocaleString('en-US')} XP
            </div>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>شعلة الالتزام</span>
              <Flame className="w-4 h-4 text-orange-400 shrink-0" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-extrabold text-slate-100 font-mono-num">
                {metrics.currentStreak} {metrics.currentStreak === 1 ? 'يوم' : 'أيام'}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                أطول سلسلة: {metrics.longestStreak} أيام
              </div>
            </div>
            <div className="text-xs text-orange-400 font-mono-num">
              {metrics.completedStudyDaysCount} / 60 يوماً مكتملاً
            </div>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>ساعات الدراسة</span>
              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-extrabold text-slate-100 font-mono-num">
                {dayHours} / 12 س
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                ساعات اليوم المنجزة
              </div>
            </div>
            <div className="text-xs text-emerald-400 font-mono-num">
              المجموع: {metrics.totalStudyHours} / 720 ساعة
            </div>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>مؤشر الثقة بالشفوي</span>
              <Crown className="w-4 h-4 text-amber-400 shrink-0" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-extrabold text-amber-400 font-mono-num">
                {metrics.muendlichConfidencePercent}%
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                الهدف النهائي: 200%
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${Math.min(100, metrics.muendlichConfidencePercent / 2)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Unlockable Daily & Weekly Privileges Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
        {/* Daily Evening Entertainment Privilege */}
        <div
          className={`rounded-xl p-4 border transition-colors ${
            eveningUnlocked
              ? 'bg-emerald-950/30 border-emerald-500/50'
              : 'bg-slate-950/70 border-slate-800'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Film className={`w-4 h-4 shrink-0 ${eveningUnlocked ? 'text-emerald-400' : 'text-slate-500'}`} />
                <h3 className="text-sm font-bold text-slate-100">
                  🎬 امتياز المساء: مشاهدة حلقتين من المسلسل الألماني بلا تأنيب ضمير
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {eveningUnlocked
                  ? 'مفتوح الآن! لقد أتممت الفترات الصباحية وبعد الظهر بنجاح (الفترة 1 + 2 + 3). استمتع بوقتك المسائي!'
                  : 'يُفتح تلقائياً فور إتمام الفترات الثلاث الأولى من الدراسة المركزة (الفترة 1 و 2 و 3).'}
              </p>
            </div>
            <div className="shrink-0 text-xs font-bold flex items-center gap-1">
              {eveningUnlocked ? (
                <span className="text-emerald-400 flex items-center gap-1 whitespace-nowrap">
                  <CheckCircle2 className="w-4 h-4" /> مفتوح
                </span>
              ) : (
                <span className="text-slate-500 flex items-center gap-1 whitespace-nowrap">
                  <Lock className="w-4 h-4" /> قيد الإنجاز
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Crown Privilege */}
        <div
          className={`rounded-xl p-4 border transition-colors ${
            metrics.weeklyCrownUnlocked
              ? 'bg-amber-950/30 border-amber-500/50'
              : 'bg-slate-950/70 border-slate-800'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Crown className={`w-4 h-4 shrink-0 ${metrics.weeklyCrownUnlocked ? 'text-amber-400' : 'text-slate-500'}`} />
                <h3 className="text-sm font-bold text-slate-100">
                  👑 امتياز نهاية الأسبوع: نصف يوم راحة حرة أو خرجة مع الأصدقاء
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {metrics.weeklyCrownUnlocked
                  ? 'مبارك يا بطل! أتممت 6 أيام دراسية متتالية واستحققت تاج الأسبوع ونصف يوم راحة حرة بجدارة!'
                  : `أكمل 6 أيام دراسية متتالية لفتح التاج الأسبوعي (سلسلتك الحالية: ${metrics.longestStreak} من 6 أيام).`}
              </p>
            </div>
            <div className="shrink-0 text-xs font-bold flex items-center gap-1">
              {metrics.weeklyCrownUnlocked ? (
                <span className="text-amber-400 flex items-center gap-1 whitespace-nowrap">
                  <CheckCircle2 className="w-4 h-4" /> مفتوح
                </span>
              ) : (
                <span className="text-slate-500 flex items-center gap-1 whitespace-nowrap font-mono-num">
                  <Lock className="w-4 h-4" /> {Math.min(6, metrics.longestStreak)}/6
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active Phase Summary Bar */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="font-bold text-amber-400">
          {mission.phaseTitle}
        </div>
        <div className="text-slate-300">
          {mission.phaseSubtitle}
        </div>
      </div>
    </section>
  );
};
