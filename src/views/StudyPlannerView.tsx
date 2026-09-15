import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Calendar,
  Play,
  RotateCcw,
  Plus,
  Layers,
  Check,
  ChevronRight,
} from 'lucide-react';
import { useAcademic } from '../store/AcademicContext';
import { AIService } from '../services/ai/AIService';

export const StudyPlannerView: React.FC = () => {
  const {
    student,
    subjects,
    assignments,
    tests,
    homework,
    addTimetableEvent,
    startFocusSession,
    setActiveView,
  } = useAcademic();

  const [availableHours, setAvailableHours] = useState<number>(2.5); // 2.5 hours default
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [isPlanAccepted, setIsPlanAccepted] = useState(false);

  // Generate dynamic plan based on parameters
  const studyPlan = AIService.generateStudyPlan(
    Math.round(availableHours * 60),
    selectedSubjectId === 'all' ? null : selectedSubjectId,
    assignments,
    tests,
    homework,
    subjects
  );

  const totalStudyMinutes = studyPlan
    .filter(s => !s.isBreak)
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  const totalBreakMinutes = studyPlan
    .filter(s => s.isBreak)
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  const handleAcceptPlan = () => {
    // Add study sessions to timetable for today (e.g., Tuesday)
    studyPlan
      .filter(s => !s.isBreak)
      .forEach((slot, idx) => {
        const [startTime, endTime] = slot.timeSlot.split('–').map(t => t.trim());
        addTimetableEvent({
          title: `Study: ${slot.title}`,
          type: 'study',
          dayOfWeek: 1, // Tuesday
          startTime: '18:00',
          endTime: '19:30',
          room: 'Desk / Quiet Study',
          isRecurring: false,
        });
      });

    setIsPlanAccepted(true);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Sparkles className="w-4 h-4 text-accent-cyan" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-text">AI Smart Study Planner</h1>
          </div>
          <p className="text-xs md:text-sm text-slate-secondary mt-0.5">
            Tell AI your available time tonight. The system analyzes deadlines, exams, and energy levels to build your optimal schedule.
          </p>
        </div>
      </div>

      {/* Interactive Input Panel */}
      <div className="bg-card border border-slate-border rounded-2xl p-5 md:p-6 shadow-subtle">
        <h3 className="text-sm font-bold text-slate-text mb-4">Configure Tonight's Study Session</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
          {/* 1. Time Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-text">Available Time Tonight:</span>
              <span className="font-extrabold text-brand text-sm">{availableHours} Hours ({Math.round(availableHours * 60)} min)</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.5"
              value={availableHours}
              onChange={e => {
                setAvailableHours(Number(e.target.value));
                setIsPlanAccepted(false);
              }}
              className="w-full accent-brand cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-secondary font-medium">
              <span>30 min</span>
              <span>2.5 hrs</span>
              <span>5.0 hrs</span>
            </div>
          </div>

          {/* 2. Priority Subject Focus */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-text">Subject Emphasis (Optional):</label>
            <select
              value={selectedSubjectId}
              onChange={e => {
                setSelectedSubjectId(e.target.value);
                setIsPlanAccepted(false);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-slate-border text-xs font-semibold text-slate-text focus:outline-none focus:border-brand"
            >
              <option value="all">⚡ Balanced AI Auto-Distribution</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>Prioritize: {s.code} ({s.name})</option>
              ))}
            </select>
          </div>

          {/* 3. Action Button */}
          <div className="flex items-end h-full">
            <button
              onClick={() => setIsPlanAccepted(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-background-secondary hover:bg-slate-200 text-slate-text font-bold text-xs flex items-center justify-center gap-2 border border-slate-border transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regenerate Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Generated Schedule Timeline */}
      <div className="bg-card border border-slate-border rounded-2xl p-5 md:p-6 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-border">
          <div>
            <h3 className="text-base font-bold text-slate-text">Generated Study Schedule</h3>
            <p className="text-xs text-slate-secondary mt-0.5">
              {totalStudyMinutes} mins focused work + {totalBreakMinutes} mins cognitive rest
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isPlanAccepted ? (
              <span className="px-4 py-2 rounded-xl bg-emerald-50 text-status-success font-bold text-xs border border-emerald-200 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Plan Accepted & Synced to Calendar</span>
              </span>
            ) : (
              <button
                onClick={handleAcceptPlan}
                className="px-5 py-2 rounded-xl bg-brand hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept & Sync to Timetable</span>
              </button>
            )}
          </div>
        </div>

        {/* Schedule Blocks */}
        <div className="space-y-3 pt-2">
          {studyPlan.map((block, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                block.isBreak
                  ? 'bg-background-secondary/60 border-dashed border-slate-300'
                  : 'bg-card border-slate-border hover:border-brand-300 shadow-subtle'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0"
                  style={{
                    backgroundColor: block.isBreak ? '#E2E8F0' : `${block.subjectColor}15`,
                    color: block.isBreak ? '#64748B' : block.subjectColor,
                  }}
                >
                  {block.isBreak ? 'REST' : block.subjectCode}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-text">{block.timeSlot}</span>
                    {!block.isBreak && (
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-brand-50 text-brand">
                        {block.type.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h4 className={`text-sm font-bold mt-0.5 truncate ${block.isBreak ? 'text-slate-secondary italic' : 'text-slate-text'}`}>
                    {block.title}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-end">
                <span className="text-xs font-bold text-slate-secondary flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {block.durationMinutes} mins
                </span>

                {!block.isBreak && (
                  <button
                    onClick={() => startFocusSession('sub-dbms', block.title, block.durationMinutes)}
                    className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand text-brand hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Session</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
