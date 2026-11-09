import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';

interface PomodoroTimerCardProps {
  sessionsCompleted: number;
  onIncrementSession: () => void;
}

export const PomodoroTimerCard: React.FC<PomodoroTimerCardProps> = ({
  sessionsCompleted,
  onIncrementSession,
}) => {
  const [preset, setPreset] = useState<'50/10' | '25/5'>('50/10');
  const [phase, setPhase] = useState<'study' | 'break'>('study');
  const [secondsLeft, setSecondsLeft] = useState(50 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const getTotalSeconds = (currentPreset: '50/10' | '25/5', currentPhase: 'study' | 'break') => {
    if (currentPreset === '50/10') {
      return currentPhase === 'study' ? 50 * 60 : 10 * 60;
    }
    return currentPhase === 'study' ? 25 * 60 : 5 * 60;
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            soundEngine.playTimerChime();
            if (phase === 'study') {
              onIncrementSession();
              setPhase('break');
              return getTotalSeconds(preset, 'break');
            } else {
              setPhase('study');
              return getTotalSeconds(preset, 'study');
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isRunning, phase, preset, onIncrementSession]);

  const handleSelectPreset = (newPreset: '50/10' | '25/5') => {
    setIsRunning(false);
    setPreset(newPreset);
    setPhase('study');
    setSecondsLeft(getTotalSeconds(newPreset, 'study'));
  };

  const handleSwitchPhase = (newPhase: 'study' | 'break') => {
    setIsRunning(false);
    setPhase(newPhase);
    setSecondsLeft(getTotalSeconds(preset, newPhase));
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(getTotalSeconds(preset, phase));
  };

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (secondsLeft % 60).toString().padStart(2, '0');

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Timer className="w-4 h-4 text-amber-400 shrink-0" />
            <span>⏱️ مؤقت البومودورو والعمل العميق (Smart Pomodoro)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            نظام التركيز العميق مع تنبيه صوتي تلقائي عند انتهاء الجلسة
          </p>
        </div>

        <div className="text-xs font-mono-num text-emerald-400 font-semibold">
          الجلسات المنجزة: {sessionsCompleted}
        </div>
      </div>

      {/* Preset & Mode Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => handleSelectPreset('50/10')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              preset === '50/10'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            50 د دراسة / 10 د راحة
          </button>
          <button
            type="button"
            onClick={() => handleSelectPreset('25/5')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              preset === '25/5'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            25 د دراسة / 5 د راحة
          </button>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => handleSwitchPhase('study')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${
              phase === 'study'
                ? 'bg-slate-800 text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>وقت التركيز</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchPhase('break')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${
              phase === 'break'
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>وقت الاستراحة</span>
          </button>
        </div>
      </div>

      {/* Digital Clock Readout & Controls */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-right">
          <div className="text-xs text-slate-400 mb-1">
            {phase === 'study' ? 'جلسة دراسة مركزة جارية' : 'استراحة قصيرة لتجديد النشاط'}
          </div>
          <div className="text-4xl sm:text-5xl font-extrabold font-mono-num text-slate-100 tracking-tight">
            {minutes}:{seconds}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsRunning((r) => !r)}
            className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'إيقاف مؤقت' : 'بدء المؤقت'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط</span>
          </button>
        </div>
      </div>
    </div>
  );
};
