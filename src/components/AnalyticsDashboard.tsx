import React, { useRef, useState } from 'react';
import { BarChart3, Download, Upload, ShieldCheck, CheckCircle2, Flame } from 'lucide-react';
import {
  BootcampMetrics,
  BootcampStoreState,
  RANKS,
  calculateDayStudyHours,
  isStudyDayComplete,
} from '../utils/bootcampEngine';

interface AnalyticsDashboardProps {
  store: BootcampStoreState;
  metrics: BootcampMetrics;
  onImportState: (newState: BootcampStoreState) => void;
  onSelectDay: (day: number) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  store,
  metrics,
  onImportState,
  onSelectDay,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importStatus, setImportStatus] = useState<string>('');

  const handleExportJson = () => {
    const dataStr = JSON.stringify(store, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simo-b2-life-os-backup-day-${store.selectedDay}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(String(event.target?.result));
        if (parsed && typeof parsed.selectedDay === 'number' && parsed.days) {
          onImportState(parsed);
          setImportStatus('تم استيراد نسخة التقدم الاحتياطية بنجاح!');
        } else {
          setImportStatus('ملف النسخة الاحتياطية غير صالح.');
        }
      } catch {
        setImportStatus('تعذر قراءة ملف JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <section aria-label="لوحة الإحصائيات والالتزام لـ 60 يوماً" className="space-y-6">
      {/* Top Overview & Backup Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>📊 لوحة الإحصائيات والالتزام (60-Day Heatmap & 720h Analytics)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تتبع بصري شامل لـ 720 ساعة تدريب، مؤشر الثقة الشفوية (0% إلى 200%)، والرتب الـ 7
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportJson}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير نسخة احتياطية (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>استيراد التقدم</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportJson}
            className="hidden"
          />
        </div>
      </div>

      {importStatus && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl px-4 py-3 text-xs text-emerald-300">
          {importStatus}
        </div>
      )}

      {/* 720 Hours & 200% Mündlich Confidence Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-100">
              إجمالي ساعات المعسكر المنجزة (من أصل 720 ساعة)
            </span>
            <span className="text-lg font-extrabold font-mono-num text-emerald-400">
              {metrics.totalStudyHours} / 720 ساعة
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-transform duration-200 origin-right"
              style={{ width: `${Math.min(100, (metrics.totalStudyHours / 720) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-400">
            كل يوم دراسي كامل يضيف 12 ساعة (8 ساعات دراسة امتحانية مركزة + 4 ساعات انغماس لغوي).
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-100">
              مؤشر الجاهزية والثقة في الشفوي (Mündlich Confidence Meter)
            </span>
            <span className="text-lg font-extrabold font-mono-num text-amber-400">
              {metrics.muendlichConfidencePercent}% / 200%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-transform duration-200 origin-right"
              style={{ width: `${Math.min(100, metrics.muendlichConfidencePercent / 2)}%` }}
            />
          </div>
          <p className="text-xs text-slate-400">
            يرتفع المؤشر حتى 200% بناءً على التزامك بفترات الشفوي والتسجيلات الصوتية وتقييمك الذاتي.
          </p>
        </div>
      </div>

      {/* GitHub-Style 60-Day Green Contribution Heatmap */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100">
              🟩 شبكة الالتزام اليومي (60-Day Contribution Heatmap)
            </h3>
            <p className="text-xs text-slate-400">
              كل مربع يمثل يوماً من خطة الـ 60 يوماً — كلما زاد عدد ساعات الدراسة زادت شدة اللون الأخضر
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>0 س</span>
            <span className="w-3.5 h-3.5 rounded bg-slate-950 border border-slate-800 inline-block" />
            <span className="w-3.5 h-3.5 rounded bg-emerald-900/70 inline-block" />
            <span className="w-3.5 h-3.5 rounded bg-emerald-600/80 inline-block" />
            <span className="w-3.5 h-3.5 rounded bg-emerald-400 inline-block" />
            <span>12 س كاملة</span>
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2">
          {Array.from({ length: 60 }, (_, idx) => {
            const d = idx + 1;
            const dp = store.days[d];
            const hours = calculateDayStudyHours(dp);
            const complete = isStudyDayComplete(dp);

            let cellColor = 'bg-slate-950 border-slate-800 text-slate-400';
            if (complete || hours >= 12) {
              cellColor = 'bg-emerald-500 border-emerald-400 text-slate-950 font-extrabold';
            } else if (hours >= 8) {
              cellColor = 'bg-emerald-600/80 border-emerald-500 text-white font-bold';
            } else if (hours >= 4) {
              cellColor = 'bg-emerald-800/80 border-emerald-700 text-emerald-100';
            } else if (hours > 0) {
              cellColor = 'bg-emerald-950 border-emerald-800 text-emerald-300';
            }

            return (
              <button
                key={d}
                type="button"
                onClick={() => onSelectDay(d)}
                title={`اليوم ${d}: ${hours} ساعات دراسة`}
                className={`h-11 rounded-lg border text-xs font-mono-num flex flex-col items-center justify-center transition-transform hover:scale-105 ${cellColor}`}
              >
                <span>{d}</span>
                <span className="text-[10px] opacity-80">{hours}س</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* All 7 Progressive Ranks Ladder */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <span>🏆 سلم الرتب التدريبية السبعة (The 7 Progressive Ranks)</span>
          </h3>
          <span className="text-xs font-mono-num text-amber-400 font-semibold">
            رتبتك الحالية: #{metrics.currentRank.id}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {RANKS.map((rank) => {
            const isUnlocked = rank.id <= metrics.currentRank.id;
            const isCurrent = rank.id === metrics.currentRank.id;
            return (
              <div
                key={rank.id}
                className={`rounded-xl border p-4 flex flex-col justify-between gap-2 ${
                  rank.id === 7 ? 'md:col-span-2 lg:col-span-3' : ''
                } ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-400'
                    : isUnlocked
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-slate-950/70 border-slate-800 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-mono-num">
                      الأيام {rank.minDay}–{rank.maxDay}
                    </span>
                    <span className="font-mono-num text-amber-400">
                      {rank.minXp.toLocaleString('en-US')} XP
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">{rank.titleAr}</h4>
                  <div className="text-xs font-latin text-emerald-400 font-medium" dir="ltr">
                    {rank.titleDe}
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {rank.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{rank.badgeText}</span>
                  {isCurrent ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> الرتبة الحالية
                    </span>
                  ) : isUnlocked ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> مكتسبة
                    </span>
                  ) : (
                    <span className="text-slate-500">قيد الفتح</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
