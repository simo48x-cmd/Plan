import React, { useState, useEffect, useRef } from 'react';
import { Dices, Timer, Play, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { EXAMINER_QUESTIONS } from '../utils/bootcampEngine';
import { soundEngine } from '../utils/soundEffects';

export const ExaminerQuestionWidget: React.FC = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [showRedemittel, setShowRedemittel] = useState(true);
  const intervalRef = useRef<number | null>(null);

  const currentQ = EXAMINER_QUESTIONS[questionIndex % EXAMINER_QUESTIONS.length];

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            soundEngine.playTimerChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const rollRandomQuestion = () => {
    const nextIdx = (questionIndex + 1 + Math.floor(Math.random() * (EXAMINER_QUESTIONS.length - 1))) % EXAMINER_QUESTIONS.length;
    setQuestionIndex(nextIdx);
    setSecondsLeft(60);
    setIsRunning(true);
    soundEngine.playTaskComplete();
  };

  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Dices className="w-4 h-4 text-amber-400 shrink-0" />
            <span>🎲 مولد أسئلة الممتحن العشوائي (Random Examiner Question Generator)</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            تدرّب على الرد التلقائي السريع أمام الممتحن خلال 60 ثانية باستخدام روابط B2 المتقدمة
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div
            className={`px-3 py-1.5 rounded-lg border font-mono-num text-sm font-bold flex items-center gap-1.5 ${
              secondsLeft <= 10 && isRunning
                ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                : 'bg-slate-900 border-slate-800 text-emerald-400'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>{secondsLeft} ثانية</span>
          </div>

          <button
            type="button"
            onClick={rollRandomQuestion}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Dices className="w-3.5 h-3.5" />
            <span>سؤال ممتحن جديد (60 ث)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRunning((r) => !r)}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isRunning ? 'إيقاف مؤقت' : 'بدء العد'}</span>
          </button>

          <button
            type="button"
            aria-label="إعادة ضبط مؤقت الـ 60 ثانية"
            onClick={() => {
              setIsRunning(false);
              setSecondsLeft(60);
            }}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-latin text-amber-400 font-semibold">{currentQ.category}</span>
          <span className="font-mono-num">سؤال #{currentQ.id} من {EXAMINER_QUESTIONS.length}</span>
        </div>

        <p className="text-sm sm:text-base font-latin font-bold text-slate-100 leading-relaxed" dir="ltr">
          “{currentQ.questionDe}”
        </p>

        <p className="text-xs sm:text-sm text-slate-300">
          {currentQ.questionAr}
        </p>

        <div className="pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setShowRedemittel((s) => !s)}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5"
          >
            {showRedemittel ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showRedemittel ? 'إخفاء قالب الإجابة المقترح (Redemittel)' : 'إظهار قالب الإجابة المقترح (Redemittel)'}</span>
          </button>

          {showRedemittel && (
            <div className="mt-2 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-latin text-emerald-300" dir="ltr">
              <span className="text-slate-400 font-semibold block mb-1">Empfohlenes B2-Redemittel:</span>
              {currentQ.suggestedRedemittel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
