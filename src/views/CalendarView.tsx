import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  X,
  FileText,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useAcademic } from '../store/AcademicContext';

export const CalendarView: React.FC = () => {
  const {
    assignments,
    homework,
    tests,
    timetable,
    subjects,
    openQuickAdd,
    startFocusSession,
  } = useAcademic();

  const [currentMonth, setCurrentMonth] = useState('September 2026');
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // Build calendar days for September 2026 (Starts on Tuesday Sep 1, 30 days)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  // Gather calendar items mapped by day of September
  const getEventsForDay = (day: number) => {
    const dateStr = `2026-09-${day.toString().padStart(2, '0')}`;
    const items: any[] = [];

    // Assignments
    assignments.forEach(a => {
      if (a.dueDate === dateStr) {
        const sub = subjects.find(s => s.id === a.subjectId);
        items.push({
          id: a.id,
          title: a.title,
          type: 'assignment',
          time: a.dueTime || '23:59',
          color: sub?.color || '#0EA5E9',
          subName: sub?.name || 'DBMS',
          details: a.description,
          priority: a.priority,
          subjectId: a.subjectId,
        });
      }
    });

    // Homework
    homework.forEach(h => {
      if (h.dueDate === dateStr) {
        const sub = subjects.find(s => s.id === h.subjectId);
        items.push({
          id: h.id,
          title: h.title,
          type: 'homework',
          time: h.dueTime || '17:00',
          color: sub?.color || '#D97706',
          subName: sub?.name || 'Coursework',
          details: h.notes || 'Daily homework set',
          priority: h.priority,
          subjectId: h.subjectId,
        });
      }
    });

    // Tests & Exams
    tests.forEach(t => {
      if (t.date === dateStr) {
        const sub = subjects.find(s => s.id === t.subjectId);
        items.push({
          id: t.id,
          title: t.name,
          type: 'test',
          time: t.time || '10:00',
          color: '#EF4444',
          subName: sub?.name || 'Exam',
          details: t.notes || 'Scheduled academic examination',
          priority: 'CRITICAL',
          subjectId: t.subjectId,
        });
      }
    });

    return items;
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-text">Academic Calendar</h1>
          <p className="text-xs md:text-sm text-slate-secondary mt-0.5">
            Integrated view of all classes, assignment deadlines, homework, exams, and study blocks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-card border border-slate-border rounded-xl px-3 py-1.5 shadow-subtle gap-3">
            <button className="text-slate-secondary hover:text-slate-text">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-text">{currentMonth}</span>
            <button className="text-slate-secondary hover:text-slate-text">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => openQuickAdd('assignment')}
            className="px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Calendar Matrix */}
      <div className="bg-card border border-slate-border rounded-2xl shadow-subtle overflow-hidden">
        {/* Day of week labels */}
        <div className="grid grid-cols-7 border-b border-slate-border bg-background text-center py-2.5 text-xs font-bold text-slate-secondary">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* 30 Day Grid for September 2026 */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 min-h-[560px]">
          {/* Pad 2 days for September 1 starting on Tuesday */}
          <div className="bg-slate-50/40 p-2 min-h-[90px] opacity-40"></div>
          <div className="bg-slate-50/40 p-2 min-h-[90px] opacity-40"></div>

          {daysInMonth.map(day => {
            const events = getEventsForDay(day);
            const isToday = day === 8; // Sep 8

            return (
              <div
                key={day}
                className={`p-2 min-h-[95px] flex flex-col justify-between transition-colors hover:bg-slate-50/70 ${
                  isToday ? 'bg-brand-50/30 font-bold' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday ? 'bg-brand text-white' : 'text-slate-text'
                    }`}
                  >
                    {day}
                  </span>
                  {isToday && (
                    <span className="text-[10px] font-bold text-brand uppercase">Today</span>
                  )}
                </div>

                {/* Events list */}
                <div className="space-y-1 flex-1 overflow-hidden">
                  {events.map((evt, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedEvent(evt)}
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold truncate cursor-pointer transition-transform hover:scale-[1.02] shadow-subtle"
                      style={{
                        backgroundColor: `${evt.color}18`,
                        color: evt.color,
                        borderLeft: `2.5px solid ${evt.color}`,
                      }}
                    >
                      {evt.time} {evt.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* End padding */}
          <div className="bg-slate-50/40 p-2 min-h-[90px] opacity-40"></div>
          <div className="bg-slate-50/40 p-2 min-h-[90px] opacity-40"></div>
          <div className="bg-slate-50/40 p-2 min-h-[90px] opacity-40"></div>
        </div>
      </div>

      {/* Event Details Inspection Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-text/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-slate-border rounded-2xl shadow-elevated p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                  style={{ backgroundColor: `${selectedEvent.color}15`, color: selectedEvent.color }}
                >
                  {selectedEvent.type} • {selectedEvent.subName}
                </span>
                <h3 className="font-bold text-base text-slate-text mt-1">{selectedEvent.title}</h3>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 text-slate-secondary hover:text-slate-text rounded-lg hover:bg-background-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-secondary">
              <p className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand" />
                <span>Time: {selectedEvent.time}</span>
              </p>
              <p className="leading-relaxed bg-background p-3 rounded-xl border border-slate-border text-slate-text">
                {selectedEvent.details}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  startFocusSession(selectedEvent.subjectId, selectedEvent.title, 45);
                  setSelectedEvent(null);
                }}
                className="px-4 py-2 bg-brand hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Start Focus Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
