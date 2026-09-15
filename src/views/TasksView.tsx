import React, { useState } from 'react';
import {
  CheckSquare,
  Filter,
  Plus,
  FileText,
  BookOpen,
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  AlertCircle,
  Play,
} from 'lucide-react';
import { useAcademic } from '../store/AcademicContext';
import { calculateTaskPriorityScore } from '../services/priorityEngine';

export const TasksView: React.FC = () => {
  const {
    assignments,
    homework,
    tests,
    subjects,
    updateAssignment,
    updateHomework,
    openQuickAdd,
    startFocusSession,
  } = useAcademic();

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Consolidate all tasks into a unified smart list
  const allTasks = [
    ...assignments.map(a => ({
      id: a.id,
      title: a.title,
      type: 'assignment' as const,
      subjectId: a.subjectId,
      dueDate: a.dueDate,
      estimatedMinutes: a.estimatedDurationMinutes,
      status: a.status,
      difficulty: a.difficulty,
      priority: a.priority,
      calc: calculateTaskPriorityScore({
        title: a.title,
        subjectId: a.subjectId,
        dueDate: a.dueDate,
        estimatedMinutes: a.estimatedDurationMinutes,
        difficulty: a.difficulty,
      }, subjects, tests),
    })),
    ...homework.map(h => ({
      id: h.id,
      title: h.title,
      type: 'homework' as const,
      subjectId: h.subjectId,
      dueDate: h.dueDate,
      estimatedMinutes: h.estimatedMinutes,
      status: h.status,
      difficulty: 'Easy' as const,
      priority: h.priority,
      subtasks: [],
      calc: calculateTaskPriorityScore(h, subjects, tests),
    })),
  ];

  // Apply filters
  const filteredTasks = allTasks.filter(task => {
    if (selectedSubject !== 'all' && task.subjectId !== selectedSubject) return false;
    if (selectedType !== 'all' && task.type !== selectedType) return false;
    if (selectedStatus === 'pending' && task.status === 'Completed') return false;
    if (selectedStatus === 'completed' && task.status !== 'Completed') return false;
    return true;
  }).sort((a, b) => b.calc.score - a.calc.score); // Highest priority first

  const toggleTaskStatus = (task: typeof allTasks[0]) => {
    const nextStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
    if (task.type === 'assignment') {
      updateAssignment(task.id, { status: nextStatus as any });
    } else {
      updateHomework(task.id, { status: nextStatus as any });
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-text">My Tasks</h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand">
              {filteredTasks.length} Total
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-secondary mt-0.5">
            Unified priority stream of assignments, homework, and test preparation tasks.
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('assignment')}
          className="px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-card border border-slate-border rounded-2xl p-4 shadow-subtle flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-secondary">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Subject Filter */}
        <select
          value={selectedSubject}
          onChange={e => setSelectedSubject(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-background border border-slate-border text-xs text-slate-text font-medium focus:outline-none focus:border-brand"
        >
          <option value="all">All Subjects</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
          ))}
        </select>

        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-background border border-slate-border text-xs text-slate-text font-medium focus:outline-none focus:border-brand"
        >
          <option value="all">All Types</option>
          <option value="assignment">Assignments</option>
          <option value="homework">Homework</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-background border border-slate-border text-xs text-slate-text font-medium focus:outline-none focus:border-brand"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending Only</option>
          <option value="completed">Completed Only</option>
        </select>
      </div>

      {/* Tasks Stream List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-card border border-slate-border rounded-2xl p-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-bold text-base text-slate-text">All tasks completed!</h3>
            <p className="text-xs text-slate-secondary mt-1">No tasks match your selected filters.</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const sub = subjects.find(s => s.id === task.subjectId);
            const isCompleted = task.status === 'Completed';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all bg-card shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'border-slate-border opacity-70 bg-slate-50/50'
                    : task.calc.urgencyLabel === 'CRITICAL'
                    ? 'border-red-200 hover:border-red-300'
                    : 'border-slate-border hover:border-brand-300'
                }`}
              >
                {/* Left Task Info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTaskStatus(task)}
                    className="mt-0.5 text-slate-secondary hover:text-brand transition-colors shrink-0"
                  >
                    {isCompleted ? (
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

                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-secondary">
                        {task.type}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          task.calc.urgencyLabel === 'CRITICAL'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : task.calc.urgencyLabel === 'HIGH'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-secondary'
                        }`}
                      >
                        Score: {task.calc.score}/100 • {task.calc.urgencyLabel}
                      </span>
                    </div>

                    <h3
                      className={`text-sm font-bold text-slate-text mt-1.5 ${
                        isCompleted ? 'line-through text-slate-secondary' : ''
                      }`}
                    >
                      {task.title}
                    </h3>

                    {/* Metadata & Priority Reasons */}
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-secondary flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Due {task.dueDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        ~{task.estimatedMinutes} mins
                      </span>
                      {task.calc.reasons.length > 0 && (
                        <span className="text-brand font-medium">
                          • {task.calc.reasons[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action Controls */}
                <div className="flex items-center gap-2 justify-end">
                  {!isCompleted && (
                    <button
                      onClick={() => startFocusSession(task.subjectId, task.title, 45)}
                      className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand text-brand hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-subtle"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Focus Session</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
