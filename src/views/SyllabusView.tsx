import React, { useState } from 'react';
import {
  ListOrdered,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Play,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAcademic } from '../store/AcademicContext';

export const SyllabusView: React.FC = () => {
  const {
    syllabus,
    subjects,
    updateTopicStatus,
    startFocusSession,
    setActiveView,
    startNewQuiz,
  } = useAcademic();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const activeSyllabus = syllabus.find(s => s.subjectId === selectedSubjectId) || syllabus[0];
  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-text">Syllabus Management</h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand">
              {activeSubject?.syllabusProgress}% Mastered
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-secondary mt-0.5">
            Track units, chapters, and topics across Not Started, Learning, Revised, and Mastered levels.
          </p>
        </div>

        {/* Subject Selector */}
        <select
          value={selectedSubjectId}
          onChange={e => setSelectedSubjectId(e.target.value)}
          className="px-4 py-2 rounded-xl bg-card border border-slate-border text-xs font-bold text-slate-text focus:outline-none focus:border-brand shadow-subtle"
        >
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
          ))}
        </select>
      </div>

      {/* AI Syllabus Weakness & Recommended Order Banner */}
      <div className="bg-card border border-cyan-200 rounded-2xl p-5 md:p-6 shadow-subtle bg-gradient-to-r from-card via-card to-cyan-50/20">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-xs border border-cyan-200">
            <Sparkles className="w-4 h-4 text-accent-cyan" />
          </div>
          <h3 className="text-sm font-bold text-slate-text">AI Syllabus Analysis & Recommended Study Order</h3>
        </div>

        <p className="text-xs text-slate-secondary leading-relaxed mb-4">
          You have completed <strong>{activeSubject?.syllabusProgress}%</strong> of the syllabus. To maximize readiness for upcoming assessments, study the following topics in order:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-white rounded-xl border border-red-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-red-600 uppercase">1. Priority #1 (Not Started)</span>
              <p className="text-xs font-bold text-slate-text mt-0.5">Self-Balancing AVL Trees</p>
            </div>
            <button
              onClick={() => startFocusSession(activeSubject.id, 'AVL Trees Rotations', 45)}
              className="p-1.5 rounded-lg bg-brand-50 hover:bg-brand text-brand hover:text-white transition-colors"
              title="Study now"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-600 uppercase">2. Priority #2 (Low Confidence)</span>
              <p className="text-xs font-bold text-slate-text mt-0.5">Binary Search Trees Deletion</p>
            </div>
            <button
              onClick={() => startFocusSession(activeSubject.id, 'BST Deletion Logic', 40)}
              className="p-1.5 rounded-lg bg-brand-50 hover:bg-brand text-brand hover:text-white transition-colors"
              title="Study now"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3 bg-white rounded-xl border border-blue-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase">3. Priority #3 (Needs Revision)</span>
              <p className="text-xs font-bold text-slate-text mt-0.5">Priority Queues & Binary Heap</p>
            </div>
            <button
              onClick={() => startFocusSession(activeSubject.id, 'Binary Heap Queues', 30)}
              className="p-1.5 rounded-lg bg-brand-50 hover:bg-brand text-brand hover:text-white transition-colors"
              title="Study now"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hierarchical Units & Topics */}
      {activeSyllabus && (
        <div className="space-y-4">
          {activeSyllabus.units.map(unit => (
            <div
              key={unit.id}
              className="bg-card border border-slate-border rounded-2xl shadow-subtle overflow-hidden"
            >
              <div className="p-4 bg-background border-b border-slate-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-brand text-white font-bold text-xs flex items-center justify-center">
                    U{unit.unitNumber}
                  </span>
                  <h3 className="text-sm font-bold text-slate-text">Unit {unit.unitNumber}: {unit.title}</h3>
                </div>

                <span className="text-xs text-slate-secondary font-medium">
                  {unit.topics.length} Key Topics
                </span>
              </div>

              <div className="p-4 space-y-3">
                {unit.topics.map(topic => (
                  <div
                    key={topic.id}
                    className="p-3.5 rounded-xl border border-slate-border bg-white hover:border-brand-200 transition-all space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            topic.importance === 'High' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-secondary'
                          }`}
                        >
                          {topic.importance} Weight
                        </span>
                        <h4 className="text-xs md:text-sm font-bold text-slate-text">{topic.name}</h4>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <select
                          value={topic.status}
                          onChange={e => updateTopicStatus(selectedSubjectId, topic.id, e.target.value as any)}
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none transition-colors ${
                            topic.status === 'Mastered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : topic.status === 'Revised'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : topic.status === 'Learning'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-slate-100 text-slate-secondary border-slate-300'
                          }`}
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="Learning">Learning</option>
                          <option value="Revised">Revised</option>
                          <option value="Mastered">Mastered</option>
                        </select>

                        <button
                          onClick={() => startFocusSession(selectedSubjectId, topic.name, 45)}
                          className="p-1.5 rounded-lg bg-brand-50 hover:bg-brand text-brand hover:text-white transition-colors"
                          title="Start focus on this topic"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Subtopics Checklist */}
                    {topic.subtopics.length > 0 && (
                      <div className="pt-2 pl-4 border-l-2 border-slate-200 space-y-1 text-xs text-slate-secondary">
                        {topic.subtopics.map(sub => (
                          <div key={sub.id} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            <span className={sub.completed ? 'line-through text-slate-subtle' : 'text-slate-text'}>
                              {sub.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
