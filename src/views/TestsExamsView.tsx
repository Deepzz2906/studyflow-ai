import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  BookOpen,
  HelpCircle,
  Play,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useAcademic } from '../store/AcademicContext';
import { AIService } from '../services/ai/AIService';

export const TestsExamsView: React.FC = () => {
  const {
    tests,
    subjects,
    openQuickAdd,
    saveTestPrepPlan,
    startFocusSession,
    startNewQuiz,
    setActiveView,
  } = useAcademic();

  const [selectedTestId, setSelectedTestId] = useState<string>(tests[0]?.id || '');
  const activeTest = tests.find(t => t.id === selectedTestId) || tests[0];

  const sub = activeTest ? subjects.find(s => s.id === activeTest.subjectId) : null;

  // Calculate days remaining from reference 2026-09-08
  const getDaysRemaining = (dateStr: string) => {
    const d1 = new Date('2026-09-08');
    const d2 = new Date(dateStr);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : 0;
  };

  const handleGeneratePlan = (testId: string) => {
    saveTestPrepPlan(testId);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-text">Tests & Exams</h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {tests.length} Scheduled
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-secondary mt-0.5">
            AI-powered exam readiness tracking, topic confidence breakdowns, and multi-day study plans.
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('test')}
          className="px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Test / Exam</span>
        </button>
      </div>

      {/* Test Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tests.map(test => {
          const testSub = subjects.find(s => s.id === test.subjectId);
          const daysLeft = getDaysRemaining(test.date);
          const isSelected = test.id === selectedTestId;

          return (
            <div
              key={test.id}
              onClick={() => setSelectedTestId(test.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-subtle ${
                isSelected
                  ? 'bg-card border-brand shadow-card ring-2 ring-brand/10'
                  : 'bg-card border-slate-border hover:border-brand-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded"
                  style={{ backgroundColor: `${testSub?.color}15`, color: testSub?.color }}
                >
                  {testSub?.code} • {test.testType}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    daysLeft <= 4
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-slate-100 text-slate-secondary'
                  }`}
                >
                  {daysLeft} Days Left
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-text mt-2 line-clamp-1">{test.name}</h3>

              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-secondary">Preparation</span>
                  <span className="font-bold text-brand">{test.preparationPercentage}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-brand rounded-full transition-all"
                    style={{ width: `${test.preparationPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Test Detail Section */}
      {activeTest && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Topics & AI Preparation Plan */}
          <div className="lg:col-span-2 space-y-6">
            {/* Core Topics Breakdown */}
            <div className="bg-card border border-slate-border rounded-2xl p-5 shadow-subtle">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand" />
                  <h3 className="text-sm font-bold text-slate-text">Exam Syllabus & Topics</h3>
                </div>
                <button
                  onClick={() => startNewQuiz(activeTest.subjectId, activeTest.topics[0]?.name || 'Exam Prep')}
                  className="text-xs font-bold text-accent-cyan hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Practice Quiz</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {activeTest.topics.map((topic, idx) => (
                  <div
                    key={topic.id}
                    className="p-3 rounded-xl bg-background/50 border border-slate-border flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-secondary text-[11px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-text truncate">{topic.name}</p>
                        <p className="text-[10px] text-slate-secondary">{topic.unit} • ~{topic.estimatedHours}h estimated</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          topic.confidence === 'High'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : topic.confidence === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {topic.confidence} Confidence
                      </span>

                      <button
                        onClick={() => startFocusSession(activeTest.subjectId, topic.name, 45)}
                        className="p-1.5 rounded-lg bg-brand-50 hover:bg-brand text-brand hover:text-white transition-colors"
                        title="Study this topic now"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Test Preparation Plan (Day by Day) */}
            <div className="bg-card border border-slate-border rounded-2xl p-5 shadow-subtle">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-xs border border-cyan-200">
                    <Sparkles className="w-4 h-4 text-accent-cyan" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-text">AI 4-Day Test Preparation Plan</h3>
                    <p className="text-xs text-slate-secondary">Prioritized topic coverage before test day</p>
                  </div>
                </div>

                <button
                  onClick={() => handleGeneratePlan(activeTest.id)}
                  className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand text-brand hover:text-white text-xs font-bold transition-all shadow-subtle flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Regenerate Plan</span>
                </button>
              </div>

              {activeTest.generatedPrepPlan && activeTest.generatedPrepPlan.length > 0 ? (
                <div className="space-y-3">
                  {activeTest.generatedPrepPlan.map(day => (
                    <div
                      key={day.dayNumber}
                      className="p-3.5 rounded-xl bg-background/50 border border-slate-border"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                        <span className="text-xs font-bold text-brand">Day {day.dayNumber} ({day.dayDate})</span>
                        <span className="text-[10px] text-slate-secondary font-medium">
                          {day.sessions.reduce((acc, s) => acc + s.durationMinutes, 0)} mins study
                        </span>
                      </div>

                      <div className="space-y-2">
                        {day.sessions.map((sess, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-center justify-between text-xs bg-card p-2 rounded-lg border border-slate-border"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  sess.activityType === 'Mock Test'
                                    ? 'bg-purple-50 text-purple-700'
                                    : sess.activityType === 'Problem Solving'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-emerald-50 text-emerald-700'
                                }`}
                              >
                                {sess.activityType}
                              </span>
                              <span className="font-semibold text-slate-text">{sess.topic}</span>
                            </div>

                            <span className="font-bold text-slate-secondary">{sess.durationMinutes}m</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-background rounded-xl">
                  <p className="text-xs text-slate-secondary mb-3">No AI plan generated for this exam yet.</p>
                  <button
                    onClick={() => handleGeneratePlan(activeTest.id)}
                    className="px-4 py-2 bg-brand text-white font-bold text-xs rounded-xl shadow-sm"
                  >
                    Generate AI Study Schedule
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right 1 Col: Test Metadata & AI Recommendation */}
          <div className="space-y-6">
            <div className="bg-card border border-slate-border rounded-2xl p-5 shadow-subtle">
              <h3 className="text-sm font-bold text-slate-text mb-3">Exam Details</h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-secondary">Subject:</span>
                  <strong className="text-slate-text">{sub?.name}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-secondary">Date & Time:</span>
                  <strong className="text-slate-text">{activeTest.date} ({activeTest.time})</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-secondary">Total Marks:</span>
                  <strong className="text-slate-text">{activeTest.totalMarks} Marks</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-secondary">Duration:</span>
                  <strong className="text-slate-text">{activeTest.durationMinutes} Minutes</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-secondary">Difficulty:</span>
                  <strong className="text-brand">{activeTest.difficulty}</strong>
                </div>
              </div>

              {activeTest.notes && (
                <div className="mt-4 p-3 rounded-xl bg-background-secondary text-xs text-slate-secondary leading-relaxed">
                  <span className="font-bold text-slate-text">Faculty Note: </span>
                  {activeTest.notes}
                </div>
              )}
            </div>

            {/* AI Exam Strategy Recommendation */}
            <div className="bg-card border border-cyan-200 rounded-2xl p-5 shadow-subtle bg-gradient-to-b from-card to-cyan-50/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-accent-cyan" />
                <h3 className="text-sm font-bold text-slate-text">AI Exam Strategy</h3>
              </div>

              <p className="text-xs text-slate-secondary leading-relaxed">
                Prioritize <strong>AVL Trees & 4 Rotation Cases</strong> tonight. This topic currently has the lowest confidence score (1.5/5) and carries 35% of total test marks.
              </p>

              <button
                onClick={() => startFocusSession(activeTest.subjectId, 'AVL Trees & 4 Rotations', 45)}
                className="w-full mt-3 py-2.5 rounded-xl bg-brand hover:bg-brand-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start 45m AVL Trees Focus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
