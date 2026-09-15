import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  ExternalLink,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  Play,
  Trash2,
} from 'lucide-react';
import { useAcademic } from '../store/AcademicContext';
import { AIService } from '../services/ai/AIService';

export const AssignmentsView: React.FC = () => {
  const {
    assignments,
    subjects,
    openQuickAdd,
    toggleAssignmentSubtask,
    updateAssignment,
    deleteAssignment,
    startFocusSession,
  } = useAcademic();

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('asg-01');

  const filteredAssignments = assignments.filter(a => {
    if (selectedSubject !== 'all' && a.subjectId !== selectedSubject) return false;
    return true;
  });

  const handleAiBreakdown = (asgId: string) => {
    const target = assignments.find(a => a.id === asgId);
    if (!target) return;
    const sub = subjects.find(s => s.id === target.subjectId);
    const result = AIService.analyzeAssignment(target.title, sub?.name || '', target.description);

    updateAssignment(asgId, {
      difficulty: result.difficulty,
      estimatedDurationMinutes: result.estimatedMinutes,
      subtasks: result.subtasks,
    });
    setExpandedId(asgId);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-text">Assignments</h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand">
              {filteredAssignments.length} Total
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-secondary mt-0.5">
            Manage course deliverables, subtask progress, and AI-estimated study sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-card border border-slate-border rounded-xl p-1 shadow-subtle">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-brand text-white' : 'text-slate-secondary hover:text-slate-text'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-brand text-white' : 'text-slate-secondary hover:text-slate-text'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => openQuickAdd('assignment')}
            className="px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Assignment</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
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

      {/* Assignments Display */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredAssignments.map(asg => {
            const sub = subjects.find(s => s.id === asg.subjectId);
            const isExpanded = expandedId === asg.id;
            const completedSubtasks = asg.subtasks.filter(st => st.isCompleted).length;
            const progress = asg.subtasks.length > 0 ? Math.round((completedSubtasks / asg.subtasks.length) * 100) : 0;

            return (
              <div
                key={asg.id}
                className="bg-card border border-slate-border rounded-2xl shadow-subtle overflow-hidden transition-all hover:border-brand-200"
              >
                {/* Main Card Header */}
                <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm"
                      style={{
                        backgroundColor: `${sub?.color}15`,
                        color: sub?.color,
                      }}
                    >
                      <FileText className="w-5 h-5" />
                    </div>

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
                            asg.priority === 'CRITICAL'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : asg.priority === 'HIGH'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-secondary'
                          }`}
                        >
                          {asg.priority}
                        </span>

                        <span className="text-xs text-slate-secondary">
                          • Due: <strong className="text-slate-text">{asg.dueDate} ({asg.dueTime})</strong>
                        </span>

                        <span className="text-xs text-slate-secondary">
                          • ~{Math.round(asg.estimatedDurationMinutes / 60)}h {asg.estimatedDurationMinutes % 60}m
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-text mt-1">{asg.title}</h3>
                      <p className="text-xs text-slate-secondary mt-0.5 leading-relaxed">{asg.description}</p>

                      {/* Progress Bar */}
                      {asg.subtasks.length > 0 && (
                        <div className="mt-3 flex items-center gap-3 max-w-md">
                          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-brand rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-brand">
                            {completedSubtasks}/{asg.subtasks.length} Subtasks ({progress}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <select
                      value={asg.status}
                      onChange={e => updateAssignment(asg.id, { status: e.target.value as any })}
                      className="px-2.5 py-1.5 rounded-xl bg-background border border-slate-border text-xs font-bold text-slate-text focus:outline-none"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Submitted">Submitted</option>
                    </select>

                    <button
                      onClick={() => startFocusSession(asg.subjectId, asg.title, 45)}
                      className="p-2 rounded-xl bg-brand-50 hover:bg-brand text-brand hover:text-white transition-colors"
                      title="Start 45m Focus Session"
                    >
                      <Play className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : asg.id)}
                      className="p-2 rounded-xl bg-background hover:bg-background-secondary border border-slate-border text-slate-secondary hover:text-slate-text transition-colors"
                      title={isExpanded ? 'Collapse subtasks' : 'View subtasks'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => deleteAssignment(asg.id)}
                      className="p-2 rounded-xl text-slate-subtle hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtasks Accordion Drawer */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 bg-background/50 border-t border-slate-border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-secondary">
                        Actionable Subtasks ({asg.subtasks.length})
                      </h4>

                      <button
                        onClick={() => handleAiBreakdown(asg.id)}
                        className="flex items-center gap-1.5 text-xs font-bold text-accent-cyan hover:underline"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Regenerate AI Subtasks</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {asg.subtasks.map((st, idx) => (
                        <div
                          key={st.id}
                          onClick={() => toggleAssignmentSubtask(asg.id, st.id)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            st.isCompleted
                              ? 'bg-card border-slate-border opacity-70'
                              : 'bg-card border-slate-border hover:border-brand-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button className="text-slate-secondary shrink-0">
                              {st.isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-status-success fill-status-success/10" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-subtle" />
                              )}
                            </button>
                            <span
                              className={`text-xs font-medium text-slate-text ${
                                st.isCompleted ? 'line-through text-slate-secondary' : ''
                              }`}
                            >
                              {idx + 1}. {st.title}
                            </span>
                          </div>

                          <span className="text-[11px] font-bold text-slate-secondary">
                            {st.estimatedMinutes}m
                          </span>
                        </div>
                      ))}
                    </div>

                    {asg.submissionLink && (
                      <div className="mt-3 pt-3 border-t border-slate-border flex items-center justify-between text-xs">
                        <span className="text-slate-secondary">Submission Portal:</span>
                        <a
                          href={asg.submissionLink}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-brand hover:underline flex items-center gap-1"
                        >
                          <span>Open Google Classroom</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssignments.map(asg => {
            const sub = subjects.find(s => s.id === asg.subjectId);
            const completedSubtasks = asg.subtasks.filter(st => st.isCompleted).length;
            const progress = asg.subtasks.length > 0 ? Math.round((completedSubtasks / asg.subtasks.length) * 100) : 0;

            return (
              <div
                key={asg.id}
                className="bg-card border border-slate-border rounded-2xl p-5 shadow-subtle flex flex-col justify-between hover:border-brand-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded"
                      style={{ backgroundColor: `${sub?.color}15`, color: sub?.color }}
                    >
                      {sub?.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-secondary">
                      {asg.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-text line-clamp-2">{asg.title}</h3>
                  <p className="text-xs text-slate-secondary mt-1 line-clamp-2">{asg.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-border space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-secondary">
                    <span>Due: {asg.dueDate}</span>
                    <span className="font-bold text-brand">{progress}% Done</span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-brand rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>

                  <button
                    onClick={() => startFocusSession(asg.subjectId, asg.title, 45)}
                    className="w-full mt-2 py-2 rounded-xl bg-brand-50 hover:bg-brand text-brand hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Focus Session</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
