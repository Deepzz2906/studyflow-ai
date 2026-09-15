import React, { useState } from 'react';
import {
  Layers,
  Plus,
  BookOpen,
  Clock,
  Award,
  Sparkles,
  ChevronRight,
  Play,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { useAcademic } from '../store/AcademicContext';

export const SubjectsView: React.FC = () => {
  const {
    subjects,
    assignments,
    homework,
    tests,
    syllabus,
    openQuickAdd,
    startFocusSession,
    setActiveView,
    startNewQuiz,
  } = useAcademic();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  const subAssignments = assignments.filter(a => a.subjectId === activeSubject?.id);
  const subHomework = homework.filter(h => h.subjectId === activeSubject?.id);
  const subTests = tests.filter(t => t.subjectId === activeSubject?.id);
  const subSyllabus = syllabus.find(s => s.subjectId === activeSubject?.id);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-text">Course Subjects</h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand">
              {subjects.length} Enrolled
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-secondary mt-0.5">
            Subject-specific dashboards tracking syllabus mastery, assignments, study time, and AI recommendations.
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('assignment')}
          className="px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Add</span>
        </button>
      </div>

      {/* Subject Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {subjects.map(sub => {
          const isSelected = sub.id === selectedSubjectId;

          return (
            <div
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-subtle ${
                isSelected
                  ? 'bg-card border-brand shadow-card ring-2 ring-brand/10'
                  : 'bg-card border-slate-border hover:border-brand-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ backgroundColor: `${sub.color}15`, color: sub.color }}
                >
                  {sub.code}
                </span>
                <span className="text-xs font-bold text-slate-secondary">{sub.syllabusProgress}%</span>
              </div>

              <h3 className="text-xs font-bold text-slate-text mt-2 line-clamp-1">{sub.name}</h3>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-secondary">
                <span>{sub.studyHoursLogged}h logged</span>
                <span className="font-semibold text-brand">⭐ {sub.confidenceScore}/5</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Subject Command Center */}
      {activeSubject && (
        <div className="space-y-6">
          {/* Subject Banner */}
          <div
            className="p-6 rounded-2xl border border-slate-border bg-card shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6"
            style={{ borderLeftWidth: 6, borderLeftColor: activeSubject.color }}
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded"
                  style={{ backgroundColor: `${activeSubject.color}15`, color: activeSubject.color }}
                >
                  {activeSubject.code}
                </span>
                <span className="text-xs text-slate-secondary">
                  Instructor: <strong>{activeSubject.instructor}</strong> • {activeSubject.credits} Credits
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-extrabold text-slate-text mt-1.5">
                {activeSubject.name}
              </h2>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4">
              <div className="text-center p-3 rounded-xl bg-background border border-slate-border min-w-[90px]">
                <p className="text-xs text-slate-secondary font-semibold">Syllabus</p>
                <p className="text-lg font-black text-brand">{activeSubject.syllabusProgress}%</p>
              </div>

              <div className="text-center p-3 rounded-xl bg-background border border-slate-border min-w-[90px]">
                <p className="text-xs text-slate-secondary font-semibold">Study Time</p>
                <p className="text-lg font-black text-slate-text">{activeSubject.studyHoursLogged}h</p>
              </div>

              <div className="text-center p-3 rounded-xl bg-background border border-slate-border min-w-[90px]">
                <p className="text-xs text-slate-secondary font-semibold">Confidence</p>
                <p className="text-lg font-black text-emerald-600">{activeSubject.confidenceScore}/5</p>
              </div>
            </div>
          </div>

          {/* 3-Column Subject Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: AI Recommendation & Focus */}
            <div className="space-y-6">
              <div className="bg-card border border-cyan-200 rounded-2xl p-5 shadow-subtle bg-gradient-to-b from-card to-cyan-50/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-accent-cyan" />
                  <h3 className="text-sm font-bold text-slate-text">AI Subject Recommendation</h3>
                </div>

                <p className="text-xs text-slate-secondary leading-relaxed">
                  Focus on <strong>{activeSubject.name.includes('Database') ? 'Normalization & Transaction Concurrency' : 'AVL Trees & Traversals'}</strong> this week to improve confidence from {activeSubject.confidenceScore}/5 to 4.5/5.
                </p>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => startFocusSession(activeSubject.id, `${activeSubject.name} Deep Work`, 45)}
                    className="w-full py-2.5 px-3 rounded-xl bg-brand hover:bg-brand-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start 45m Focus Session</span>
                  </button>

                  <button
                    onClick={() => startNewQuiz(activeSubject.id, 'Core Concept Assessment')}
                    className="w-full py-2 px-3 rounded-xl bg-background hover:bg-background-secondary border border-slate-border text-slate-text font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
                    <span>Generate Practice Quiz</span>
                  </button>
                </div>
              </div>

              {/* Upcoming Tests in Subject */}
              <div className="bg-card border border-slate-border rounded-2xl p-5 shadow-subtle">
                <h3 className="text-sm font-bold text-slate-text mb-3">Upcoming Tests</h3>
                {subTests.length === 0 ? (
                  <p className="text-xs text-slate-secondary">No exams scheduled for this course yet.</p>
                ) : (
                  subTests.map(t => (
                    <div key={t.id} className="p-3 rounded-xl bg-background/50 border border-slate-border space-y-1">
                      <p className="text-xs font-bold text-slate-text">{t.name}</p>
                      <p className="text-[11px] text-slate-secondary">Date: {t.date} • {t.preparationPercentage}% prepared</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right 2 Cols: Course Deliverables & Syllabus Preview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Deliverables */}
              <div className="bg-card border border-slate-border rounded-2xl p-5 shadow-subtle">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-text">
                    Course Deliverables ({subAssignments.length} Assignments, {subHomework.length} Homework)
                  </h3>
                  <button
                    onClick={() => setActiveView('assignments')}
                    className="text-xs text-brand font-semibold hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2.5">
                  {subAssignments.map(a => (
                    <div
                      key={a.id}
                      className="p-3 rounded-xl border border-slate-border hover:border-brand-200 transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-text">{a.title}</p>
                        <p className="text-slate-secondary text-[11px]">Due: {a.dueDate} • {a.subtasks.filter(st => st.isCompleted).length}/{a.subtasks.length} subtasks done</p>
                      </div>
                      <span className="font-bold text-slate-secondary px-2 py-0.5 rounded bg-slate-100">
                        {a.status}
                      </span>
                    </div>
                  ))}

                  {subHomework.map(h => (
                    <div
                      key={h.id}
                      className="p-3 rounded-xl border border-slate-border hover:border-brand-200 transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-text">{h.title}</p>
                        <p className="text-slate-secondary text-[11px]">Due: {h.dueDate} • ~{h.estimatedMinutes}m</p>
                      </div>
                      <span className="font-bold text-slate-secondary px-2 py-0.5 rounded bg-slate-100">
                        {h.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Syllabus Units Preview */}
              {subSyllabus && (
                <div className="bg-card border border-slate-border rounded-2xl p-5 shadow-subtle">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-text">Syllabus Units</h3>
                    <button
                      onClick={() => setActiveView('syllabus')}
                      className="text-xs text-brand font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Full Syllabus Manager</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {subSyllabus.units.map(u => (
                      <div key={u.id} className="p-3.5 rounded-xl bg-background/50 border border-slate-border">
                        <p className="text-xs font-bold text-slate-text mb-2">
                          Unit {u.unitNumber}: {u.title}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {u.topics.map(top => (
                            <div key={top.id} className="p-2 rounded-lg bg-card border border-slate-border flex items-center justify-between text-xs">
                              <span className="truncate max-w-[170px] text-slate-text font-medium">{top.name}</span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                  top.status === 'Mastered'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : top.status === 'Revised'
                                    ? 'bg-blue-50 text-blue-700'
                                    : top.status === 'Learning'
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-slate-100 text-slate-secondary'
                                }`}
                              >
                                {top.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
