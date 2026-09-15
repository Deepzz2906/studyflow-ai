import React, { useState, useEffect } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Sparkles,
  CheckCircle2,
  Volume2,
  VolumeX,
  Star,
  ArrowLeft,
} from 'lucide-react';
import { useAcademic } from '../store/AcademicContext';
import confetti from 'canvas-confetti';

export const FocusModeView: React.FC = () => {
  const {
    subjects,
    focusSessionContext,
    logStudySession,
    setActiveView,
  } = useAcademic();

  const initialMinutes = focusSessionContext?.duration || 45;
  const initialSubject = focusSessionContext?.subjectId || 'sub-ds';
  const initialTopic = focusSessionContext?.topic || 'Data Structures Tree Traversals';

  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubject);
  const [topicName, setTopicName] = useState(initialTopic);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isAmbientSoundOn, setIsAmbientSoundOn] = useState(false);
  const [isFinishedModalOpen, setIsFinishedModalOpen] = useState(false);
  const [confidenceRating, setConfidenceRating] = useState(4);
  const [sessionNotes, setSessionNotes] = useState('');

  // Countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds(prev => prev - 1);
      }, 1000);
    } else if (timeLeftSeconds === 0 && isRunning) {
      setIsRunning(false);
      handleFinishSession();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeftSeconds]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishSession = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}
    setIsFinishedModalOpen(true);
  };

  const handleSaveAndExit = () => {
    const plannedMins = initialMinutes;
    const actualMins = Math.max(1, Math.round((initialMinutes * 60 - timeLeftSeconds) / 60));

    logStudySession({
      subjectId: selectedSubjectId,
      topic: topicName,
      plannedMinutes: plannedMins,
      actualMinutes: actualMins > 0 ? actualMins : plannedMins,
      date: new Date().toISOString().split('T')[0],
      startTime: '18:00',
      confidenceRating,
      notes: sessionNotes || 'Focused uninterrupted deep study session.',
      status: 'completed',
    });

    setIsFinishedModalOpen(false);
    setActiveView('dashboard');
  };

  const sub = subjects.find(s => s.id === selectedSubjectId);

  return (
    <div className="min-h-[80vh] flex flex-col justify-between py-6 max-w-3xl mx-auto animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-secondary hover:text-slate-text p-2 rounded-xl hover:bg-card transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAmbientSoundOn(!isAmbientSoundOn)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isAmbientSoundOn
                ? 'bg-cyan-50 text-cyan-800 border-cyan-300'
                : 'bg-card text-slate-secondary border-slate-border'
            }`}
          >
            {isAmbientSoundOn ? <Volume2 className="w-4 h-4 text-accent-cyan" /> : <VolumeX className="w-4 h-4" />}
            <span>{isAmbientSoundOn ? 'Lo-Fi Focus Tone: Active' : 'Sound: Off'}</span>
          </button>
        </div>
      </div>

      {/* Focus Timer Main Stage */}
      <div className="my-auto text-center space-y-6">
        {/* Subject and Topic Badge */}
        <div className="inline-flex flex-col items-center gap-1">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
            style={{ backgroundColor: `${sub?.color}15`, color: sub?.color }}
          >
            {sub?.code} • {sub?.name}
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-text mt-1 max-w-lg">
            {topicName}
          </h2>
        </div>

        {/* Large Digital Display */}
        <div className="relative inline-flex items-center justify-center p-8">
          <div className="w-64 h-64 md:w-72 md:h-72 rounded-full border-4 border-brand/20 bg-card flex flex-col items-center justify-center shadow-card">
            <span className="text-5xl md:text-6xl font-black text-slate-text tracking-tight font-mono">
              {formatTime(timeLeftSeconds)}
            </span>
            <span className="text-xs font-bold text-slate-secondary uppercase tracking-widest mt-2">
              {isRunning ? 'Deep Work In Progress' : 'Paused / Ready'}
            </span>
          </div>
        </div>

        {/* Main Control Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3.5 rounded-2xl font-extrabold text-sm flex items-center gap-2 shadow-card transition-all active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-brand hover:bg-brand-700 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
            <span>{isRunning ? 'Pause Focus' : 'Start Focus'}</span>
          </button>

          <button
            onClick={() => {
              setTimeLeftSeconds(prev => prev + 300); // +5 min
            }}
            className="p-3.5 rounded-2xl bg-card border border-slate-border hover:border-brand-300 text-slate-text text-xs font-bold transition-all"
            title="Extend by 5 minutes"
          >
            +5m
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeftSeconds(initialMinutes * 60);
            }}
            className="p-3.5 rounded-2xl bg-card border border-slate-border hover:border-brand-300 text-slate-secondary hover:text-slate-text transition-all"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Finish Early Button */}
        <div>
          <button
            onClick={handleFinishSession}
            className="text-xs font-bold text-slate-secondary hover:text-brand underline"
          >
            Finish & Log Session Now
          </button>
        </div>
      </div>

      {/* Post-Session Feedback & Personalization Rating Modal */}
      {isFinishedModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-text/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-slate-border rounded-2xl shadow-elevated p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-status-success mx-auto flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-extrabold text-slate-text">Great Session, Alex! 🎉</h3>
            <p className="text-xs text-slate-secondary mt-1">
              You just logged focused study on <strong>{topicName}</strong>.
            </p>

            {/* Confidence Rating 1 to 5 */}
            <div className="my-5 p-4 rounded-xl bg-background border border-slate-border text-left">
              <label className="block text-xs font-bold text-slate-text mb-2">
                How confident are you with this topic? (1–5)
              </label>
              <div className="flex items-center justify-between px-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setConfidenceRating(rating)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                      confidenceRating >= rating ? 'text-amber-500 scale-105' : 'text-slate-300'
                    }`}
                  >
                    <Star className={`w-6 h-6 ${confidenceRating >= rating ? 'fill-amber-400' : ''}`} />
                    <span className="text-[10px] font-bold text-slate-secondary">{rating}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-secondary mt-2 text-center">
                AI uses this rating to adapt future revision intervals.
              </p>
            </div>

            <div className="text-left mb-4">
              <label className="block text-xs font-bold text-slate-text mb-1">Session Takeaways (Optional):</label>
              <input
                type="text"
                placeholder="e.g., Understood LL and RR rotations, need to practice LR double rotation."
                value={sessionNotes}
                onChange={e => setSessionNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-slate-border text-xs text-slate-text focus:outline-none focus:border-brand"
              />
            </div>

            <button
              onClick={handleSaveAndExit}
              className="w-full py-2.5 bg-brand hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Save to Study History & Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
