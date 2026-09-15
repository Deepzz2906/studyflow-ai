import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Play,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useAcademic } from '../store/AcademicContext';

export const HomeworkView: React.FC = () => {
  const {
    homework,
    subjects,
    openQuickAdd,
    updateHomework,
    deleteHomework,
    startFocusSession,
  } = useAcademic();

  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const filteredHomework = homework.filter(h => {
    if (selectedSubject !== 'all' && h.subjectId !== selectedSubject) return false;
    return true;
  });

  const toggleStatus = (id: string, currentStatus: string) => {
    updateHomework(id, {
      status: currentStatus === 'Completed' ? 'In Progress' : 'Completed',
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-text">Homework</h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand">
              {filteredHomework.length} Items
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-secondary mt-0.5">
            Track daily practice worksheets, problem sets, and quick revision exercises.
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('homework')}
          className="px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Homework</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center gap-3">
        <select
          value={selectedSubject}
          onChange={e => setSelectedSubject(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-card border border-slate-border text-xs text-slate-text font-semibold focus:outline-none focus:border-brand shadow-subtle"
        >
          <option value="all">All Subjects</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
          ))}
        </select>
      </div>

      {/* Homework Stream */}
      <div className="space-y-3">
        {filteredHomework.length === 0 ? (
          <div className="bg-card border border-slate-border rounded-2xl p-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-bold text-base text-slate-text">No homework due!</h3>
            <p className="text-xs text-slate-secondary mt-1">You are all caught up with your daily coursework exercises.</p>
          </div>
        ) : (
          filteredHomework.map(hw => {
            const sub = subjects.find(s => s.id === hw.subjectId);
            const isDone = hw.status === 'Completed';

            return (
              <div
                key={hw.id}
                className={`p-4 rounded-2xl border transition-all bg-card shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isDone
                    ? 'border-slate-border opacity-70 bg-slate-50/50'
                    : 'border-slate-border hover:border-brand-300'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => toggleStatus(hw.id, hw.status)}
                    className="mt-0.5 text-slate-secondary hover:text-brand transition-colors shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-status-success fill-status-success/10" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-subtle" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${sub?.color}15`, color: sub?.color }}
                      >
                        {sub?.code}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          hw.priority === 'HIGH'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-secondary'
                        }`}
                      >
                        {hw.priority} Priority
                      </span>

                      <span className="text-xs text-slate-secondary">
                        • Due: <strong className="text-slate-text">{hw.dueDate} {hw.dueTime ? `(${hw.dueTime})` : ''}</strong>
                      </span>
                    </div>

                    <h3
                      className={`text-sm font-bold text-slate-text mt-1.5 ${
                        isDone ? 'line-through text-slate-secondary' : ''
                      }`}
                    >
                      {hw.title}
                    </h3>

                    {hw.notes && (
                      <p className="text-xs text-slate-secondary mt-0.5">{hw.notes}</p>
                    )}
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-xs font-bold text-slate-secondary flex items-center gap-1 mr-2">
                    <Clock className="w-3.5 h-3.5" />
                    {hw.estimatedMinutes} mins
                  </span>

                  {!isDone && (
                    <button
                      onClick={() => startFocusSession(hw.subjectId, hw.title, hw.estimatedMinutes)}
                      className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand text-brand hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-subtle"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Now</span>
                    </button>
                  )}

                  <button
                    onClick={() => deleteHomework(hw.id)}
                    className="p-2 rounded-xl text-slate-subtle hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete homework"
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
  );
};
