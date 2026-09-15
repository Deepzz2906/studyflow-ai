import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { useAcademic } from '../store/AcademicContext';

export const TimetableWeeklyView: React.FC = () => {
  const {
    timetable,
    subjects,
    openQuickAdd,
    deleteTimetableEvent,
    startFocusSession,
  } = useAcademic();

  const [activeDayTab, setActiveDayTab] = useState<number>(1); // 1 = Tuesday demo

  const days = [
    { index: 0, label: 'Mon', full: 'Monday' },
    { index: 1, label: 'Tue', full: 'Tuesday' },
    { index: 2, label: 'Wed', full: 'Wednesday' },
    { index: 3, label: 'Thu', full: 'Thursday' },
    { index: 4, label: 'Fri', full: 'Friday' },
    { index: 5, label: 'Sat', full: 'Saturday' },
    { index: 6, label: 'Sun', full: 'Sunday' },
  ];

  // Hours to show in grid: 8 AM to 8 PM
  const hours = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-text">Weekly Timetable</h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand">
              Fall 2026
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-secondary mt-0.5">
            Interactive schedule for classes, laboratory practicals, and AI study sessions (6 AM – 11 PM).
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('timetable')}
          className="px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Class / Event</span>
        </button>
      </div>

      {/* Day Selector Tabs (Especially great for mobile & tablet) */}
      <div className="flex items-center gap-2 bg-card border border-slate-border rounded-2xl p-1.5 shadow-subtle overflow-x-auto">
        {days.map(d => {
          const isActive = activeDayTab === d.index;
          const dayEventsCount = timetable.filter(e => e.dayOfWeek === d.index).length;

          return (
            <button
              key={d.index}
              onClick={() => setActiveDayTab(d.index)}
              className={`flex-1 min-w-[70px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                isActive
                  ? 'bg-brand text-white shadow-sm'
                  : 'text-slate-secondary hover:text-slate-text hover:bg-background-secondary'
              }`}
            >
              <span>{d.label}</span>
              <span className={`text-[10px] font-semibold ${isActive ? 'text-white/80' : 'text-slate-subtle'}`}>
                {dayEventsCount} {dayEventsCount === 1 ? 'event' : 'events'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Detailed Schedule Stream */}
      <div className="bg-card border border-slate-border rounded-2xl p-5 md:p-6 shadow-subtle">
        <div className="flex items-center justify-between pb-4 border-b border-slate-border mb-4">
          <h3 className="text-base font-bold text-slate-text">
            {days.find(d => d.index === activeDayTab)?.full} Schedule
          </h3>
          <span className="text-xs font-bold text-slate-secondary">
            AI Clash Avoidance Active
          </span>
        </div>

        <div className="space-y-3">
          {timetable.filter(e => e.dayOfWeek === activeDayTab).length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-secondary">
              No classes or study sessions scheduled for this day. Perfect open day for deep self-study!
            </div>
          ) : (
            timetable
              .filter(e => e.dayOfWeek === activeDayTab)
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map(evt => {
                const sub = subjects.find(s => s.id === evt.subjectId);
                const isStudy = evt.type === 'study';

                return (
                  <div
                    key={evt.id}
                    className="p-4 rounded-2xl border border-slate-border hover:border-brand-200 transition-all bg-background/40 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0"
                        style={{
                          backgroundColor: `${sub?.color || '#4F46E5'}15`,
                          color: sub?.color || '#4F46E5',
                        }}
                      >
                        {isStudy ? 'STUDY' : evt.type.toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-text">
                            {evt.startTime} – {evt.endTime}
                          </span>
                          {sub && (
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded"
                              style={{ backgroundColor: `${sub.color}15`, color: sub.color }}
                            >
                              {sub.code} • {sub.name}
                            </span>
                          )}
                          {isStudy && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-accent-cyan border border-cyan-200">
                              AI Study Block
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-text mt-1 truncate">{evt.title}</h4>

                        {evt.room && (
                          <p className="text-xs text-slate-secondary mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {evt.room}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                      {isStudy && (
                        <button
                          onClick={() => startFocusSession(evt.subjectId || 'sub-ds', evt.title, 45)}
                          className="px-3 py-1.5 rounded-xl bg-brand hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-subtle"
                        >
                          Start Session
                        </button>
                      )}

                      <button
                        onClick={() => deleteTimetableEvent(evt.id)}
                        className="p-2 rounded-xl text-slate-subtle hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>

      {/* Full 7-Day Grid View (Desktop) */}
      <div className="hidden lg:block bg-card border border-slate-border rounded-2xl p-5 shadow-subtle overflow-x-auto">
        <h3 className="text-sm font-bold text-slate-text mb-4">Weekly Visual Matrix</h3>

        <div className="grid grid-cols-7 gap-3 min-w-[750px]">
          {days.map(d => {
            const dayEvents = timetable
              .filter(e => e.dayOfWeek === d.index)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div key={d.index} className="space-y-2">
                <div className="p-2 text-center rounded-xl bg-background border border-slate-border">
                  <p className="text-xs font-bold text-slate-text">{d.full}</p>
                  <p className="text-[10px] text-slate-secondary">{dayEvents.length} items</p>
                </div>

                <div className="space-y-2 min-h-[300px]">
                  {dayEvents.map(evt => {
                    const sub = subjects.find(s => s.id === evt.subjectId);
                    return (
                      <div
                        key={evt.id}
                        className="p-2.5 rounded-xl border border-slate-border hover:border-brand-300 transition-colors text-xs space-y-1 bg-white shadow-subtle"
                        style={{ borderLeftWidth: 4, borderLeftColor: sub?.color || '#4F46E5' }}
                      >
                        <p className="font-bold text-slate-text truncate">{evt.title}</p>
                        <p className="text-[11px] text-slate-secondary font-medium">{evt.startTime} - {evt.endTime}</p>
                        {evt.room && <p className="text-[10px] text-slate-subtle truncate">{evt.room}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
