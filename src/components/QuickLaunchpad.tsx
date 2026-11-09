import React from 'react';
import { ExternalLink, Lightbulb, Sparkles } from 'lucide-react';
import { FOUR_PLATFORMS, DailyMissionDetails } from '../utils/bootcampEngine';

interface QuickLaunchpadProps {
  mission: DailyMissionDetails;
}

export const QuickLaunchpad: React.FC<QuickLaunchpadProps> = ({ mission }) => {
  return (
    <section aria-label="بوابة المواقع الأربعة السريعة ونصيحة اليوم" className="space-y-4">
      {/* 4 TELC B2 Platforms Quick Launchpad */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
          <div>
            <h2 className="text-base font-bold text-slate-100">
              🔗 بوابة المواقع الأربعة السريعة (Quick Launchpad)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              وصول فوري بنقرة واحدة إلى منصات التدريب الرسمية الخاصة بك لامتحان TELC B2
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono-num">
            <span>اليوم {mission.day} من 60</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="text-amber-400 font-semibold">المرحلة {mission.phaseNumber}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FOUR_PLATFORMS.map((platform) => (
            <a
              key={platform.id}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between p-4 rounded-lg bg-slate-950/80 border border-slate-800/90 hover:border-amber-500/60 hover:bg-slate-900 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                    {platform.nameAr}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0 transition-colors" />
                </div>
                <p className="text-xs font-latin text-amber-300/90 font-medium mb-1.5" dir="ltr">
                  {platform.nameDe}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {platform.description}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span>فتح المنصة مباشرة</span>
                <span className="font-latin text-slate-500">{platform.tag}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Automated Daily Quick Tip Widget */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
              <Lightbulb className="w-4 h-4 shrink-0" />
              <span>💡 نصيحة وكود اليوم ({mission.quickTip.category})</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400 font-normal">تتغير تلقائياً حسب اليوم التدريبي</span>
            </div>
            <p
              className="text-sm sm:text-base font-latin font-semibold text-emerald-300 bg-slate-950/90 border border-slate-800 rounded-lg px-3.5 py-2"
              dir="ltr"
            >
              “{mission.quickTip.germanPhrase}”
            </p>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {mission.quickTip.arabicExplanation}
            </p>
          </div>

          <div className="lg:w-80 shrink-0 bg-slate-950/80 border border-slate-800 rounded-lg p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-1">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>تنبيه الأخطاء الشائعة في B2:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {mission.quickTip.commonMistakeWarning}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
