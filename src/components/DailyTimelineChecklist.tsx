import React from 'react';
import {
  CheckSquare,
  Square,
  ExternalLink,
  Droplets,
  Plus,
  Minus,
  Headphones,
  Flame,
  Sparkles,
  FileText,
} from 'lucide-react';
import {
  ChecklistTaskDef,
  DailyMissionDetails,
  DayProgressState,
  PodcastLevel,
  SelfEvalScores,
  VoiceRecordingMeta,
  getChecklistTasksForDay,
} from '../utils/bootcampEngine';
import { VoiceRecorderWidget } from './VoiceRecorderWidget';
import { ExaminerQuestionWidget } from './ExaminerQuestionWidget';

interface DailyTimelineChecklistProps {
  mission: DailyMissionDetails;
  dayProgress: DayProgressState;
  recordings: VoiceRecordingMeta[];
  onToggleTask: (taskId: string) => void;
  onUpdateAnkiCards: (count: number) => void;
  onUpdatePodcastLevel: (level: PodcastLevel) => void;
  onUpdateWaterGlasses: (glasses: number) => void;
  onUpdateNotes: (notes: string) => void;
  onUpdateSelfEval: (scores: SelfEvalScores) => void;
  onSaveRecordingMeta: (meta: VoiceRecordingMeta) => void;
  onDeleteRecordingMeta: (id: string) => void;
}

export const DailyTimelineChecklist: React.FC<DailyTimelineChecklistProps> = ({
  mission,
  dayProgress,
  recordings,
  onToggleTask,
  onUpdateAnkiCards,
  onUpdatePodcastLevel,
  onUpdateWaterGlasses,
  onUpdateNotes,
  onUpdateSelfEval,
  onSaveRecordingMeta,
  onDeleteRecordingMeta,
}) => {
  const allTasks = getChecklistTasksForDay(mission);
  const coreTasks = allTasks.filter((t) => t.section === 'core');
  const immersionTasks = allTasks.filter((t) => t.section === 'immersion');
  const lifeTasks = allTasks.filter((t) => t.section === 'life');

  const countCompleted = (list: ChecklistTaskDef[]) =>
    list.filter((t) => Boolean(dayProgress.completedTasks[t.id])).length;

  const coreDone = countCompleted(coreTasks);
  const immDone = countCompleted(immersionTasks);
  const lifeDone = countCompleted(lifeTasks);

  const renderTaskCard = (task: ChecklistTaskDef) => {
    const isChecked = Boolean(dayProgress.completedTasks[task.id]);

    return (
      <div
        key={task.id}
        className={`rounded-xl border p-4 transition-colors space-y-3 ${
          isChecked
            ? 'bg-emerald-950/25 border-emerald-500/40'
            : 'bg-slate-950/85 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <button
              type="button"
              role="checkbox"
              aria-checked={isChecked}
              aria-label={task.title}
              onClick={() => onToggleTask(task.id)}
              className={`mt-0.5 p-1 rounded-lg transition-colors shrink-0 ${
                isChecked
                  ? 'text-emerald-400 hover:text-emerald-300'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              {isChecked ? (
                <CheckSquare className="w-6 h-6" />
              ) : (
                <Square className="w-6 h-6" />
              )}
            </button>

            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                {task.timeSlot && (
                  <span className="font-mono-num text-amber-400 font-semibold">
                    {task.timeSlot}
                  </span>
                )}
                <span aria-hidden="true">·</span>
                <span className="font-mono-num text-emerald-400 font-bold">
                  +{task.xp} XP
                </span>
                {task.studyHours > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-num text-slate-300">
                      {task.studyHours} {task.studyHours === 1 ? 'ساعة دراسة' : 'ساعتان دراسة'}
                    </span>
                  </>
                )}
              </div>

              <h4
                onClick={() => onToggleTask(task.id)}
                className={`text-sm sm:text-base font-bold cursor-pointer leading-snug ${
                  isChecked ? 'line-through text-slate-400' : 'text-slate-100'
                }`}
              >
                {task.title}
              </h4>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {task.subtitle}
              </p>

              {/* Extra curriculum details for Core tasks */}
              {task.id === 'core_1' && (
                <div className="text-xs text-slate-400 pt-1">
                  <span className="text-amber-300 font-semibold">التركيز اليومي: </span>
                  {mission.muendlichMorning.details} ({mission.muendlichMorning.redemittelFocus})
                </div>
              )}

              {task.id === 'core_2' && (
                <div className="text-xs text-slate-400 pt-1 space-y-1">
                  <div>
                    <span className="text-amber-300 font-semibold">خطة القراءة: </span>
                    {mission.lesenTarget.details}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-300 font-semibold">
                    <span>أوضاع التدريب المطلوبة:</span>
                    {mission.lesenTarget.modeFlags.map((flag, i) => (
                      <React.Fragment key={flag}>
                        {i > 0 && <span aria-hidden="true">·</span>}
                        <span>{flag}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {task.id === 'core_3' && (
                <div className="text-xs text-slate-400 pt-1">
                  <span className="text-amber-300 font-semibold">خطة الاستماع والكتابة: </span>
                  {mission.hoerenSchreibenTarget.details} — [{mission.hoerenSchreibenTarget.schreibenFocusDe}]
                </div>
              )}

              {task.id === 'core_4' && (
                <div className="text-xs text-slate-400 pt-1">
                  <span className="text-amber-300 font-semibold">خطة المحاكاة المسائية: </span>
                  {mission.muendlichEvening.details}
                </div>
              )}
            </div>
          </div>

          {/* Direct External Platform Launch Buttons */}
          {task.externalLinks && task.externalLinks.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 shrink-0 mr-9 sm:mr-0">
              {task.externalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-amber-500 hover:text-slate-950 border border-slate-700 hover:border-amber-400 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Built-In Interactive Widgets per Task */}
        {task.hasVoiceRecorder && (
          <div className="pt-2 mr-0 sm:mr-9">
            <VoiceRecorderWidget
              day={mission.day}
              taskLabel="عرض الفترة الصباحية (Teil 1 + Redemittel)"
              selfEval={dayProgress.selfEval}
              recordings={recordings}
              onUpdateSelfEval={onUpdateSelfEval}
              onSaveRecordingMeta={onSaveRecordingMeta}
              onDeleteRecordingMeta={onDeleteRecordingMeta}
            />
          </div>
        )}

        {task.hasExaminerGenerator && (
          <div className="pt-2 mr-0 sm:mr-9">
            <ExaminerQuestionWidget />
          </div>
        )}

        {task.hasAnkiCounter && (
          <div className="pt-2 mr-0 sm:mr-9 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-200 font-semibold">
              عدد البطاقات الجديدة المضافة اليوم في Anki:
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="إنقاص بطاقات Anki"
                onClick={() => onUpdateAnkiCards(Math.max(0, dayProgress.ankiNewCards - 5))}
                className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 py-1 rounded bg-slate-950 border border-slate-800 font-mono-num text-sm font-bold text-amber-400">
                {dayProgress.ankiNewCards} بطاقة
              </span>
              <button
                type="button"
                aria-label="زيادة بطاقات Anki"
                onClick={() => onUpdateAnkiCards(dayProgress.ankiNewCards + 5)}
                className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {task.hasPodcastSelector && (
          <div className="pt-2 mr-0 sm:mr-9 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
              <Headphones className="w-4 h-4 text-amber-400 shrink-0" />
              <span>مستوى البودكاست الألماني المختار اليوم (Shadowing):</span>
            </div>
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
              {(['A1', 'A2', 'B1', 'B2'] as PodcastLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onUpdatePodcastLevel(lvl)}
                  className={`px-3 py-1 rounded text-xs font-mono-num font-bold transition-colors ${
                    dayProgress.podcastLevel === lvl
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        )}

        {task.hasWaterTracker && (
          <div className="pt-2 mr-0 sm:mr-9 bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-400" />
                <span>متتبع شرب الماء اليومي (الهدف: 8 كؤوس = 2 لتر):</span>
              </span>
              <span className="font-mono-num font-bold text-sky-400">
                {dayProgress.waterGlasses} / 8 كؤوس ({(dayProgress.waterGlasses * 0.25).toFixed(2)} لتر)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((glassNum) => {
                const filled = glassNum <= dayProgress.waterGlasses;
                return (
                  <button
                    key={glassNum}
                    type="button"
                    aria-label={`كأس ماء ${glassNum}`}
                    onClick={() =>
                      onUpdateWaterGlasses(
                        dayProgress.waterGlasses === glassNum ? glassNum - 1 : glassNum
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono-num font-bold flex items-center gap-1 transition-colors ${
                      filled
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span>💧</span>
                    <span>{glassNum}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: 8 Hours Core Exam Mastery */}
      <section aria-label="القسم الأول: الساعات الـ 8 للدراسة الامتحانية المركزة" className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-100 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400 shrink-0" />
              <span>🔥 القسم الأول: الساعات الـ 8 للدراسة الامتحانية المركزة (8 Hours Core Exam Mastery)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              4 فترات أساسية (ساعتان لكل فترة) تغطي التحدث الشفوي، القراءة والقواعد، الاستماع والكتابة، ومحاكاة الحوار
            </p>
          </div>
          <div className="text-xs font-mono-num font-bold text-amber-400 shrink-0">
            منجز: {coreDone} / {coreTasks.length} فترات ({coreDone * 2} / 8 ساعات)
          </div>
        </div>

        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-transform duration-200 origin-right"
            style={{ width: `${(coreDone / coreTasks.length) * 100}%` }}
          />
        </div>

        <div className="space-y-3">{coreTasks.map(renderTaskCard)}</div>
      </section>

      {/* SECTION 2: 4 Hours Immersion & Apps */}
      <section aria-label="القسم الثاني: الساعات الـ 4 للانغماس اللغوي الذكي" className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-100 flex items-center gap-2">
              <Headphones className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>🎧 القسم الثاني: الساعات الـ 4 للانغماس اللغوي الذكي (4 Hours Immersion & Apps)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              4 ساعات يومية لبناء السمع الطبيعي وتثبيت المفردات: Anki، Duolingo، البودكاست الألماني، والمسلسل الألماني
            </p>
          </div>
          <div className="text-xs font-mono-num font-bold text-emerald-400 shrink-0">
            منجز: {immDone} / {immersionTasks.length} مهام ({immDone} / 4 ساعات)
          </div>
        </div>

        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-transform duration-200 origin-right"
            style={{ width: `${(immDone / immersionTasks.length) * 100}%` }}
          />
        </div>

        <div className="space-y-3">{immersionTasks.map(renderTaskCard)}</div>
      </section>

      {/* SECTION 3: 12 Hours Life, Health & Sleep Balance */}
      <section aria-label="القسم الثالث: الساعات الـ 12 لتوازن الحياة والصحة" className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400 shrink-0" />
              <span>🌿 القسم الثالث: الساعات الـ 12 لتوازن الحياة والصحة (12 Hours Life, Health & Sleep Balance)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              سر الاستمرارية لمدة 60 يوماً دون احتراق نفسي: الصلاة، الرياضة، التغذية والماء، الراحة العائلية، والنوم العميق
            </p>
          </div>
          <div className="text-xs font-mono-num font-bold text-sky-400 shrink-0">
            منجز: {lifeDone} / {lifeTasks.length} عادات صحية
          </div>
        </div>

        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-500 transition-transform duration-200 origin-right"
            style={{ width: `${(lifeDone / lifeTasks.length) * 100}%` }}
          />
        </div>

        <div className="space-y-3">{lifeTasks.map(renderTaskCard)}</div>
      </section>

      {/* Daily Reflection & 5 Extracted German Phrases Note Pad */}
      <section aria-label="مذكرة اليوم والعبارات المستخرجة" className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="daily-notes-textarea" className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400 shrink-0" />
            <span>📝 دفتر ملاحظات اليوم {mission.day} (العبارات الـ 5 المستخرجة من المسلسل وأهم الكودات):</span>
          </label>
          <span className="text-xs text-slate-400">حفظ تلقائي في المتصفح</span>
        </div>
        <textarea
          id="daily-notes-textarea"
          rows={3}
          value={dayProgress.notes}
          onChange={(e) => onUpdateNotes(e.target.value)}
          placeholder="اكتب هنا العبارات الـ 5 التي استخرجتها اليوم من المسلسل الألماني أو الأخطاء التي تريد مراجعتها..."
          className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none p-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 leading-relaxed"
        />
      </section>
    </div>
  );
};
