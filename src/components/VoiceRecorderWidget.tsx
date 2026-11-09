import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, CheckCircle2, Star } from 'lucide-react';
import { SelfEvalScores, VoiceRecordingMeta } from '../utils/bootcampEngine';
import { soundEngine } from '../utils/soundEffects';

interface VoiceRecorderWidgetProps {
  day: number;
  taskLabel: string;
  selfEval: SelfEvalScores;
  recordings: VoiceRecordingMeta[];
  onUpdateSelfEval: (scores: SelfEvalScores) => void;
  onSaveRecordingMeta: (meta: VoiceRecordingMeta) => void;
  onDeleteRecordingMeta: (id: string) => void;
  compact?: boolean;
}

const CRITERIA_LABELS: { key: keyof SelfEvalScores; labelAr: string; labelDe: string }[] = [
  { key: 'fluency', labelAr: 'الطلاقة وعدم التوقف', labelDe: 'Flüssigkeit & Spontaneität' },
  { key: 'connectors', labelAr: 'استعمال روابط B2', labelDe: 'B2-Redemittel & Konnektoren' },
  { key: 'pronunciation', labelAr: 'وضوح النطق', labelDe: 'Aussprache & Intonation' },
  { key: 'timeRespect', labelAr: 'احترام الوقت', labelDe: 'Zeitmanagement (2–3 Min.)' },
];

export const VoiceRecorderWidget: React.FC<VoiceRecorderWidgetProps> = ({
  day,
  taskLabel,
  selfEval,
  recordings,
  onUpdateSelfEval,
  onSaveRecordingMeta,
  onDeleteRecordingMeta,
  compact = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setStatusMessage('');
    setElapsedSec(0);
    startTimeRef.current = Date.now();

    timerRef.current = window.setInterval(() => {
      const sec = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedSec(sec);
    }, 250);

    setIsRecording(true);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorderRef.current = recorder;
        recorder.start();
      } else {
        setStatusMessage('وضع المحاكاة الصوتية مفعل (تسجيل توقيت العرض الشفوي).');
      }
    } catch {
      // Fallback when browser blocks mic or no physical mic is attached
      setStatusMessage('وضع المحاكاة الصوتية مفعل — تحدث بصوت عالٍ وسنحفظ مدة العرض وتقييمك الذاتي.');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const finalDuration = Math.max(1, Math.floor((Date.now() - startTimeRef.current) / 1000));
    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    const newMeta: VoiceRecordingMeta = {
      id: `rec_${Date.now()}`,
      day,
      timestamp: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
      durationSec: finalDuration,
      taskLabel,
      scores: { ...selfEval },
    };
    onSaveRecordingMeta(newMeta);
    soundEngine.playTaskComplete();
    setStatusMessage(`تم حفظ التسجيل الصوتي بنجاح (${finalDuration} ثانية)! يمكنك الاستماع إليه وتقييم أدائك.`);
  };

  const togglePlayback = () => {
    if (audioUrl && audioElRef.current) {
      if (isPlaying) {
        audioElRef.current.pause();
        setIsPlaying(false);
      } else {
        audioElRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      // Synthesize a brief confirmation tone if recorded in mic-less environment
      soundEngine.playTaskComplete();
      setIsPlaying(true);
      window.setTimeout(() => setIsPlaying(false), 1200);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const dayRecordings = recordings.filter((r) => r.day === day);

  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Mic className="w-4 h-4 text-amber-400 shrink-0" />
            <span>🎙️ مسجل الصوت التفاعلي ومختبر التقييم الذاتي (Mündlich Studio)</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            سجّل عرضك أو حججك لمدة دقيقتين واستمع لنفسك فوراً ثم قيّم أداءك على معايير TELC B2 الأربعة
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-sm font-mono-num font-bold text-amber-400">
            {formatTime(elapsedSec)} / 02:00
          </div>

          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>بدء التسجيل الصوتي</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>إيقاف وحفظ التسجيل</span>
            </button>
          )}

          {(audioUrl || dayRecordings.length > 0) && !isRecording && (
            <button
              type="button"
              onClick={togglePlayback}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'إيقاف الاستماع' : 'الاستماع للتسجيل'}</span>
            </button>
          )}
        </div>
      </div>

      {audioUrl && (
        <audio
          ref={audioElRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      {statusMessage && (
        <div className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded-lg px-3 py-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* 4 Criteria Self-Evaluator */}
      <div className="pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-300 mb-2.5">
          <span className="font-bold">تقييمك الذاتي للأداء الشفوي اليوم (من 1 إلى 5 نجوم):</span>
          <span className="font-mono-num text-amber-400 font-semibold">
            المعدل:{' '}
            {(
              (selfEval.fluency +
                selfEval.connectors +
                selfEval.pronunciation +
                selfEval.timeRespect) /
              4
            ).toFixed(1)}{' '}
            / 5.0
          </span>
        </div>

        <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-2.5`}>
          {CRITERIA_LABELS.map((crit) => {
            const val = selfEval[crit.key];
            return (
              <div
                key={crit.key}
                className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-bold text-slate-100">{crit.labelAr}</div>
                  <div className="text-[11px] font-latin text-slate-400" dir="ltr">
                    {crit.labelDe}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        aria-label={`تقييم ${crit.labelAr} ${star} من 5`}
                        onClick={() =>
                          onUpdateSelfEval({
                            ...selfEval,
                            [crit.key]: star,
                          })
                        }
                        className="p-1 rounded hover:bg-slate-800 transition-colors"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= val
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-mono-num text-slate-300 font-bold">{val}/5</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved Recordings History for Current Day */}
      {dayRecordings.length > 0 && (
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="text-xs font-bold text-slate-300">
            سجل التسجيلات الصوتية لليوم {day} ({dayRecordings.length}):
          </div>
          <div className="space-y-1.5">
            {dayRecordings.map((rec) => (
              <div
                key={rec.id}
                className="flex items-center justify-between gap-2 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="font-semibold">{rec.taskLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num text-amber-400">{formatTime(rec.durationSec)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400 font-mono-num">{rec.timestamp}</span>
                </div>
                <button
                  type="button"
                  aria-label={`حذف التسجيل ${rec.id}`}
                  onClick={() => onDeleteRecordingMeta(rec.id)}
                  className="text-slate-400 hover:text-rose-400 p-1 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
