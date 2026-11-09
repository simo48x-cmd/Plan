import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  BootcampStoreState,
  DayProgressState,
  PodcastLevel,
  SelfEvalScores,
  VoiceRecordingMeta,
  createDefaultDayProgress,
  generateDayCurriculum,
  getChecklistTasksForDay,
  calculateBootcampMetrics,
  isStudyDayComplete,
} from './utils/bootcampEngine';
import { soundEngine } from './utils/soundEffects';
import { QuickLaunchpad } from './components/QuickLaunchpad';
import { GamificationBanner } from './components/GamificationBanner';
import { DailyTimelineChecklist } from './components/DailyTimelineChecklist';
import { CalendarGrid60 } from './components/CalendarGrid60';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PomodoroTimerCard } from './components/PomodoroTimerCard';
import { VoiceRecorderWidget } from './components/VoiceRecorderWidget';
import { ExaminerQuestionWidget } from './components/ExaminerQuestionWidget';

const STORAGE_KEY = 'simo_b2_life_os_v1';

type ActiveTab = 'daily' | 'curriculum' | 'studio' | 'analytics';

function loadInitialStore(): BootcampStoreState {
  if (typeof window === 'undefined') {
    return {
      selectedDay: 1,
      days: { 1: createDefaultDayProgress(1) },
      recordings: [],
      pomodoroSessionsCompleted: 0,
    };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as BootcampStoreState;
      if (parsed && typeof parsed.selectedDay === 'number' && parsed.days) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage read errors
  }
  return {
    selectedDay: 1,
    days: { 1: createDefaultDayProgress(1) },
    recordings: [],
    pomodoroSessionsCompleted: 0,
  };
}

export default function App() {
  const [store, setStore] = useState<BootcampStoreState>(loadInitialStore);
  const [activeTab, setActiveTab] = useState<ActiveTab>('daily');
  const [confettiPieces, setConfettiPieces] = useState<
    { id: number; left: number; color: string; delay: number }[]
  >([]);
  const [celebrationBanner, setCelebrationBanner] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      // Ignore storage quota errors
    }
  }, [store]);

  const triggerConfetti = useCallback((message: string, isFullDay = false) => {
    const colors = ['#F59E0B', '#10B981', '#38BDF8', '#F43F5E', '#A855F7'];
    const count = isFullDay ? 36 : 16;
    const pieces = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      left: Math.floor(Math.random() * 96) + 2,
      color: colors[i % colors.length],
      delay: (i % 6) * 0.08,
    }));
    setConfettiPieces(pieces);
    setCelebrationBanner(message);

    const timer = window.setTimeout(() => {
      setConfettiPieces([]);
      setCelebrationBanner(null);
    }, 3200);
    return () => window.clearTimeout(timer);
  }, []);

  const selectedDay = store.selectedDay;
  const currentMission = generateDayCurriculum(selectedDay);
  const currentDayProgress: DayProgressState =
    store.days[selectedDay] || createDefaultDayProgress(selectedDay);
  const metrics = calculateBootcampMetrics(
    store.days,
    selectedDay,
    store.recordings.length
  );

  const updateCurrentDay = (updater: (prev: DayProgressState) => DayProgressState) => {
    setStore((prevStore) => {
      const existing =
        prevStore.days[prevStore.selectedDay] ||
        createDefaultDayProgress(prevStore.selectedDay);
      const updated = updater(existing);
      return {
        ...prevStore,
        days: {
          ...prevStore.days,
          [prevStore.selectedDay]: updated,
        },
      };
    });
  };

  const handleSelectDay = (day: number) => {
    const clamped = Math.max(1, Math.min(60, day));
    setStore((prev) => ({
      ...prev,
      selectedDay: clamped,
      days: {
        ...prev.days,
        [clamped]: prev.days[clamped] || createDefaultDayProgress(clamped),
      },
    }));
  };

  const handleToggleTask = (taskId: string) => {
    const wasDone = Boolean(currentDayProgress.completedTasks[taskId]);
    const wasStudyComplete = isStudyDayComplete(currentDayProgress);

    const nextCompletedTasks = {
      ...currentDayProgress.completedTasks,
      [taskId]: !wasDone,
    };
    const nextDayState: DayProgressState = {
      ...currentDayProgress,
      completedTasks: nextCompletedTasks,
    };
    const nowStudyComplete = isStudyDayComplete(nextDayState);

    updateCurrentDay(() => nextDayState);

    if (!wasDone) {
      if (!wasStudyComplete && nowStudyComplete) {
        soundEngine.playDayCompleteFanfare();
        triggerConfetti(
          `🔥 إنجاز أسطوري! أتممت 12 ساعة دراسية في اليوم ${selectedDay} وربحت مكافأة +1000 XP وشعلة الالتزام اليومية!`,
          true
        );
      } else {
        soundEngine.playTaskComplete();
        const morningAfternoonJustUnlocked =
          nextCompletedTasks['core_1'] &&
          nextCompletedTasks['core_2'] &&
          nextCompletedTasks['core_3'] &&
          !(
            currentDayProgress.completedTasks['core_1'] &&
            currentDayProgress.completedTasks['core_2'] &&
            currentDayProgress.completedTasks['core_3']
          );

        if (morningAfternoonJustUnlocked) {
          triggerConfetti(
            '🎬 مبارك! فتحت امتياز المساء: مشاهدة حلقتين من المسلسل الألماني بلا تأنيب ضمير!',
            false
          );
        }
      }
    }
  };

  const handleCompleteEntireDay = () => {
    const allTasks = getChecklistTasksForDay(currentMission);
    const completedMap: Record<string, boolean> = {};
    allTasks.forEach((t) => {
      completedMap[t.id] = true;
    });

    updateCurrentDay((prev) => ({
      ...prev,
      completedTasks: completedMap,
      waterGlasses: 8,
    }));

    soundEngine.playDayCompleteFanfare();
    triggerConfetti(
      `🏆 يوم مثالي مكتمل 100%! تم تسجيل جميع مهام اليوم ${selectedDay} وإضافة +1000 XP وشعلة الالتزام!`,
      true
    );
  };

  const handleResetCurrentDay = () => {
    updateCurrentDay(() => createDefaultDayProgress(selectedDay));
  };

  const handleUpdateAnkiCards = (count: number) => {
    updateCurrentDay((prev) => ({ ...prev, ankiNewCards: count }));
  };

  const handleUpdatePodcastLevel = (level: PodcastLevel) => {
    updateCurrentDay((prev) => ({ ...prev, podcastLevel: level }));
  };

  const handleUpdateWaterGlasses = (glasses: number) => {
    updateCurrentDay((prev) => ({ ...prev, waterGlasses: glasses }));
  };

  const handleUpdateNotes = (notes: string) => {
    updateCurrentDay((prev) => ({ ...prev, notes }));
  };

  const handleUpdateSelfEval = (scores: SelfEvalScores) => {
    updateCurrentDay((prev) => ({ ...prev, selfEval: scores }));
  };

  const handleSaveRecordingMeta = (meta: VoiceRecordingMeta) => {
    setStore((prev) => ({
      ...prev,
      recordings: [meta, ...prev.recordings],
    }));
  };

  const handleDeleteRecordingMeta = (id: string) => {
    setStore((prev) => ({
      ...prev,
      recordings: prev.recordings.filter((r) => r.id !== id),
    }));
  };

  const handleIncrementPomodoro = useCallback(() => {
    setStore((prev) => ({
      ...prev,
      pomodoroSessionsCompleted: prev.pomodoroSessionsCompleted + 1,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Confetti Overlay */}
      {confettiPieces.length > 0 && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
        >
          {confettiPieces.map((p) => (
            <div
              key={p.id}
              className="absolute top-0 w-3 h-3 rounded-sm animate-confetti"
              style={{
                left: `${p.left}%`,
                backgroundColor: p.color,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* strict 3-zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Title, single line */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('daily');
          }}
          className="text-base sm:text-lg font-extrabold tracking-tight text-amber-400 whitespace-nowrap shrink-0"
        >
          SIMO B2 LIFE OS
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300"
        >
          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'daily'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent hover:text-white'
            }`}
          >
            الجدول اليومي
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('curriculum')}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'curriculum'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent hover:text-white'
            }`}
          >
            خريطة الـ 60 يوماً
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'studio'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent hover:text-white'
            }`}
          >
            مختبر الشفوي والأدوات
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'analytics'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent hover:text-white'
            }`}
          >
            الإحصائيات والامتيازات
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleCompleteEntireDay}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-colors whitespace-nowrap shrink-0"
          >
            إكمال اليوم بالكامل
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main id="top" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Celebration Toast Banner */}
        {celebrationBanner && (
          <div
            role="status"
            className="bg-emerald-950/90 border border-emerald-400 rounded-xl p-4 text-sm font-bold text-emerald-200 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{celebrationBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setCelebrationBanner(null)}
              className="text-xs text-emerald-400 hover:text-white whitespace-nowrap shrink-0"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* Hero Title & Day Switcher Toolbar */}
        <section
          aria-label="اختيار اليوم التدريبي"
          className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="text-xs text-amber-400 font-semibold">
              معسكر الإتقان الشامل لامتحان اللغة الألمانية — TELC Deutsch B2
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 leading-snug">
              SIMO B2 LIFE OS — خطة الـ 60 يوماً نحو الإتقان الشامل (200%)
            </h1>
          </div>

          {/* Day Navigation Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={selectedDay <= 1}
              onClick={() => handleSelectDay(selectedDay - 1)}
              className="px-3 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
            >
              <ChevronRight className="w-4 h-4" />
              <span>اليوم السابق</span>
            </button>

            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5">
              <label htmlFor="day-select" className="text-xs text-slate-400 font-semibold whitespace-nowrap">
                اختر اليوم:
              </label>
              <select
                id="day-select"
                aria-label="اختر اليوم التدريبي"
                value={selectedDay}
                onChange={(e) => handleSelectDay(Number(e.target.value))}
                className="bg-transparent text-amber-400 font-mono-num text-sm font-extrabold focus:outline-none cursor-pointer"
              >
                {Array.from({ length: 60 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d} className="bg-slate-900 text-slate-100">
                    اليوم {d} {isStudyDayComplete(store.days[d]) ? '✓' : ''}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              disabled={selectedDay >= 60}
              onClick={() => handleSelectDay(selectedDay + 1)}
              className="px-3 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
            >
              <span>اليوم التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleResetCurrentDay}
              title="إعادة ضبط مهام هذا اليوم"
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
              aria-label="إعادة ضبط مهام اليوم الحالي"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'daily' ? 'bg-amber-500 text-slate-950' : 'text-slate-300'
            }`}
          >
            الجدول اليومي
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('curriculum')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'curriculum' ? 'bg-amber-500 text-slate-950' : 'text-slate-300'
            }`}
          >
            الـ 60 يوماً
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'studio' ? 'bg-amber-500 text-slate-950' : 'text-slate-300'
            }`}
          >
            مختبر الشفوي
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'analytics' ? 'bg-amber-500 text-slate-950' : 'text-slate-300'
            }`}
          >
            الإحصائيات
          </button>
        </div>

        {/* Quick Launchpad (4 TELC B2 Sites + Daily Quick Tip) */}
        <QuickLaunchpad mission={currentMission} />

        {/* Gamification, Rank, XP & Privileges Banner */}
        <GamificationBanner
          mission={currentMission}
          dayProgress={currentDayProgress}
          metrics={metrics}
          onSelectRankModal={() => setActiveTab('analytics')}
        />

        {/* Active View Content */}
        {activeTab === 'daily' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Main 24-Hour Daily Timeline & Interactive Checklist (8 cols) */}
            <div className="lg:col-span-8">
              <DailyTimelineChecklist
                mission={currentMission}
                dayProgress={currentDayProgress}
                recordings={store.recordings}
                onToggleTask={handleToggleTask}
                onUpdateAnkiCards={handleUpdateAnkiCards}
                onUpdatePodcastLevel={handleUpdatePodcastLevel}
                onUpdateWaterGlasses={handleUpdateWaterGlasses}
                onUpdateNotes={handleUpdateNotes}
                onUpdateSelfEval={handleUpdateSelfEval}
                onSaveRecordingMeta={handleSaveRecordingMeta}
                onDeleteRecordingMeta={handleDeleteRecordingMeta}
              />
            </div>

            {/* Right / Side Power Tools Column (4 cols): Pomodoro + Compact 60-Day Jump Grid */}
            <div className="lg:col-span-4 space-y-6">
              <PomodoroTimerCard
                sessionsCompleted={store.pomodoroSessionsCompleted}
                onIncrementSession={handleIncrementPomodoro}
              />

              {/* Quick 60-Day Mini Selector */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100">
                    📅 التنقل السريع بين الـ 60 يوماً
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('curriculum')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    عرض الخريطة الكاملة
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-1.5">
                  {Array.from({ length: 60 }, (_, idx) => {
                    const d = idx + 1;
                    const done = isStudyDayComplete(store.days[d]);
                    const isSelected = d === selectedDay;
                    return (
                      <button
                        key={d}
                        type="button"
                        aria-label={`انتقل إلى اليوم ${d}`}
                        onClick={() => handleSelectDay(d)}
                        className={`h-8 rounded-md text-xs font-mono-num font-bold border transition-colors flex items-center justify-center ${
                          isSelected
                            ? 'bg-amber-500 border-amber-400 text-slate-950'
                            : done
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-100'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <CalendarGrid60
            selectedDay={selectedDay}
            days={store.days}
            onSelectDay={(day) => {
              handleSelectDay(day);
              setActiveTab('daily');
            }}
          />
        )}

        {activeTab === 'studio' && (
          <section aria-label="مختبر التحدث السريع وأدوات التركيز" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PomodoroTimerCard
                sessionsCompleted={store.pomodoroSessionsCompleted}
                onIncrementSession={handleIncrementPomodoro}
              />
              <ExaminerQuestionWidget />
            </div>

            <VoiceRecorderWidget
              day={selectedDay}
              taskLabel={`تدريب حر في مختبر التحدث — اليوم ${selectedDay}`}
              selfEval={currentDayProgress.selfEval}
              recordings={store.recordings}
              onUpdateSelfEval={handleUpdateSelfEval}
              onSaveRecordingMeta={handleSaveRecordingMeta}
              onDeleteRecordingMeta={handleDeleteRecordingMeta}
            />
          </section>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            store={store}
            metrics={metrics}
            onImportState={(newState) => setStore(newState)}
            onSelectDay={(day) => {
              handleSelectDay(day);
              setActiveTab('daily');
            }}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-5 px-4 sm:px-8 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>SIMO B2 LIFE OS — خطة الـ 60 يوماً نحو الإتقان الشامل (200%)</span>
          </div>
          <div>
            يتم حفظ جميع بياناتك وتقدمك محلياً في متصفحك (100% Client-Side LocalStorage)
          </div>
        </div>
      </footer>
    </div>
  );
}
