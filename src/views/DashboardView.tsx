import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Flame,
  BookOpen,
  FileText,
  GraduationCap,
  Play,
  HelpCircle,
  TrendingUp,
  BarChart3,
  ListTodo,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useAcademic } from '../store/AcademicContext';
import { AIService } from '../services/ai/AIService';

export const DashboardView: React.FC = () => {
  const {
    student,
    subjects,
    assignments,
    homework,
    tests,
    timetable,
    studyLogs,
    dailyGoal,
    setActiveView,
    startFocusSession,
    setIsAiDrawerOpen,
    openQuickAdd,
    sendChatMessage,
    toggleAssignmentSubtask,
  } = useAcademic();

  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);

  // Real-time AI daily brief and "What should I do now?" calculation
  const dailyBrief = AIService.getDailyBrief(student, subjects, assignments, homework, tests, studyLogs, timetable);
  const whatNow = AIService.getWhatShouldIDoNow('17:30', subjects, assignments, homework, tests, timetable);
  const workload = AIService.analyzeWorkload(timetable, assignments, homework, tests);

  // Today's classes snapshot
  const todayDayIndex = 1; // Tuesday demo
  const todaysClasses = timetable
    .filter(t => t.dayOfWeek === todayDayIndex)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Urgent deadlines
  const upcomingAssignments = assignments
    .filter(a => a.status !== 'Completed' && a.status !== 'Submitted')
    .slice(0, 3);

  // Next Test
  const nextTest = tests[0];

  // Daily goal progress %
  const goalPercent = Math.round(
    ((dailyGoal.tasksCompleted / dailyGoal.tasksTarget) * 0.5 +
      (dailyGoal.studyMinutesCompleted / dailyGoal.studyMinutesTarget) * 0.5) * 100
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. TOP GREETING & ACADEMIC LOAD SUMMARY */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-text tracking-tight">
            Good Evening, {student.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-secondary mt-0.5">
            Here's what needs your attention today across your {subjects.length} active courses.
          </p>
        </div>

        {/* Academic Load Badge Pill */}
        <div className="flex items-center gap-3 bg-card border border-slate-border px-4 py-2 rounded-2xl shadow-subtle">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-status-warning animate-pulse"></span>
            <span className="text-xs font-bold text-slate-text">Today's Academic Load:</span>
          </div>
          <span className="text-xs font-extrabold text-brand px-2 py-0.5 rounded-lg bg-brand-50 border border-brand-200">
            {assignments.filter(a => a.dueDate === '2026-09-09').length} Due Soon • 2.5h Planned
          </span>
        </div>
      </div>

      {/* 2. SUMMARY KPI STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Remaining Tasks */}
        <div
          onClick={() => setActiveView('tasks')}
          className="bg-card p-4 rounded-2xl border border-slate-border hover:border-brand-300 transition-all cursor-pointer shadow-subtle group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-secondary">Tasks Remaining</span>
            <div className="p-2 rounded-xl bg-blue-50 text-brand">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-text">
              {assignments.filter(a => a.status !== 'Completed').length + homework.filter(h => h.status !== 'Completed').length}
            </span>
            <span className="text-xs text-status-warning font-semibold">1 due tomorrow</span>
          </div>
        </div>

        {/* Study Time Planned */}
        <div
          onClick={() => setActiveView('planner')}
          className="bg-card p-4 rounded-2xl border border-slate-border hover:border-brand-300 transition-all cursor-pointer shadow-subtle group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-secondary">Planned Study</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-accent-cyan">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-text">2h 30m</span>
            <span className="text-xs text-status-success font-semibold">45m completed</span>
          </div>
        </div>

        {/* Next Test Countdown */}
        <div
          onClick={() => setActiveView('tests')}
          className="bg-card p-4 rounded-2xl border border-slate-border hover:border-amber-300 transition-all cursor-pointer shadow-subtle group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-secondary">Next Exam</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-text">4 Days</span>
            <span className="text-xs text-amber-600 font-semibold truncate max-w-[110px]">DS CAT 1</span>
          </div>
        </div>

        {/* Daily Goal Streak */}
        <div
          onClick={() => setActiveView('progress')}
          className="bg-card p-4 rounded-2xl border border-slate-border hover:border-emerald-300 transition-all cursor-pointer shadow-subtle group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-secondary">Study Streak</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Flame className="w-4 h-4 fill-emerald-500 text-emerald-500" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-text">6 Days</span>
            <span className="text-xs text-emerald-600 font-semibold">Goal {goalPercent}%</span>
          </div>
        </div>
      </div>

      {/* 3. SIGNATURE SECTION: "WHAT SHOULD I DO NOW?" */}
      <div className="relative overflow-hidden bg-gradient-to-r from-card via-card to-cyan-50/30 border-2 border-brand/20 rounded-2xl p-5 md:p-6 shadow-card">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <Play className="w-3.5 h-3.5 fill-white" />
            </div>
            <h2 className="text-base md:text-lg font-bold text-slate-text">
              What Should I Do Now?
            </h2>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-accent-cyan" />
            AI Dynamic Recommendation
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-center">
          {/* Main Recommended Task */}
          <div className="lg:col-span-2 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-xs font-bold px-2.5 py-0.5 rounded-md"
                style={{
                  backgroundColor: `${whatNow.recommendedTask.subjectColor}15`,
                  color: whatNow.recommendedTask.subjectColor,
                }}
              >
                {whatNow.recommendedTask.subjectCode} • {whatNow.recommendedTask.subjectName}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-status-danger/10 text-status-danger">
                Priority: {whatNow.recommendedTask.priority}
              </span>
              <span className="text-xs text-slate-secondary font-medium">
                • {whatNow.recommendedTask.dueContext}
              </span>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-slate-text">
              {whatNow.recommendedTask.title}
            </h3>

            <p className="text-xs md:text-sm text-slate-secondary leading-relaxed">
              {whatNow.reason} <span className="text-brand font-medium">{whatNow.contextAdvice}</span>
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-end">
            <button
              onClick={() => {
                startFocusSession(
                  'sub-dbms',
                  whatNow.recommendedTask.title,
                  whatNow.recommendedTask.estimatedMinutes
                );
              }}
              className="w-full py-3 px-4 rounded-xl bg-brand hover:bg-brand-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{whatNow.recommendedTask.actionText}</span>
            </button>

            <button
              onClick={() => setIsWhyModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-background hover:bg-background-secondary border border-slate-border text-slate-text font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Ask AI Why</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. AI DAILY BRIEF SECTION */}
      <div className="bg-card border border-slate-border rounded-2xl p-5 md:p-6 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-sm border border-cyan-200">
              <Sparkles className="w-4 h-4 text-accent-cyan" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-text">AI Daily Brief</h2>
              <p className="text-xs text-slate-secondary">Intelligent workload synthesis & schedule guidance</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('planner')}
              className="px-3 py-1.5 rounded-xl bg-brand hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-subtle flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create My Plan</span>
            </button>
            <button
              onClick={() => {
                sendChatMessage('Give me a detailed breakdown of my tasks for today.');
                setIsAiDrawerOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-background hover:bg-background-secondary border border-slate-border text-slate-text text-xs font-semibold transition-colors"
            >
              Ask AI
            </button>
          </div>
        </div>

        {/* Synthesis Text */}
        <div className="mt-4 p-4 rounded-xl bg-background-secondary/60 border border-slate-border">
          <p className="text-sm font-semibold text-slate-text leading-relaxed">
            "{dailyBrief.headline}"
          </p>
          <p className="text-xs text-slate-secondary mt-1 leading-relaxed">
            {dailyBrief.summary}
          </p>
        </div>

        {/* Recommended Chunks Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {dailyBrief.recommendedTimeSlots.map((slot, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-card border border-slate-border hover:border-brand-200 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-bold text-brand">
                <span>{slot.duration}</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-brand-50 text-brand">
                  Slot #{idx + 1}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-text mt-1 truncate">{slot.taskTitle}</p>
              <p className="text-[11px] text-slate-secondary mt-1 line-clamp-2 leading-relaxed">
                {slot.rationale}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. MAIN 2-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Deadlines & Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Deadlines & Homework */}
          <div className="bg-card border border-slate-border rounded-2xl p-5 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand" />
                <h3 className="text-sm font-bold text-slate-text">Upcoming Deadlines</h3>
              </div>
              <button
                onClick={() => setActiveView('assignments')}
                className="text-xs text-brand font-semibold hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingAssignments.map(asg => {
                const sub = subjects.find(s => s.id === asg.subjectId);
                const isDueTomorrow = asg.dueDate === '2026-09-09';
                const completedSubtasks = asg.subtasks.filter(st => st.isCompleted).length;

                return (
                  <div
                    key={asg.id}
                    className="p-3.5 rounded-xl border border-slate-border hover:border-brand-200 transition-all bg-background/40 hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded"
                            style={{ backgroundColor: `${sub?.color}15`, color: sub?.color }}
                          >
                            {sub?.code}
                          </span>
                          {isDueTomorrow && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                              Due Tomorrow
                            </span>
                          )}
                          <span className="text-xs font-semibold text-slate-secondary">
                            Score: {asg.calculatedPriorityScore}/100
                          </span>
                        </div>

                        <h4 className="text-xs md:text-sm font-bold text-slate-text mt-1 truncate">
                          {asg.title}
                        </h4>

                        <p className="text-[11px] text-slate-secondary mt-0.5 line-clamp-1">
                          {asg.description}
                        </p>

                        {/* Subtasks Progress */}
                        {asg.subtasks.length > 0 && (
                          <div className="mt-2.5 flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-brand rounded-full transition-all"
                                style={{
                                  width: `${(completedSubtasks / asg.subtasks.length) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-secondary">
                              {completedSubtasks}/{asg.subtasks.length} subtasks
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          startFocusSession(asg.subjectId, asg.title, 45);
                        }}
                        className="p-2 rounded-xl bg-brand-50 hover:bg-brand text-brand hover:text-white transition-colors"
                        title="Start focus session"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Timetable Snapshot */}
          <div className="bg-card border border-slate-border rounded-2xl p-5 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand" />
                <h3 className="text-sm font-bold text-slate-text">Today's Class Schedule</h3>
              </div>
              <button
                onClick={() => setActiveView('timetable')}
                className="text-xs text-brand font-semibold hover:underline flex items-center gap-1"
              >
                <span>Full Timetable</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {todaysClasses.length === 0 ? (
                <p className="text-xs text-slate-secondary py-4">No scheduled lectures today.</p>
              ) : (
                todaysClasses.map(evt => {
                  const sub = subjects.find(s => s.id === evt.subjectId);
                  return (
                    <div key={evt.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-10 rounded-full" style={{ backgroundColor: sub?.color || '#4F46E5' }}></div>
                        <div>
                          <p className="text-xs font-bold text-slate-text">{evt.title}</p>
                          <p className="text-[11px] text-slate-secondary">
                            {evt.room || 'Main Hall'} • {evt.type.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-text">{evt.startTime} – {evt.endTime}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Exam Countdown, Weekly Workload & Goals */}
        <div className="space-y-6">
          {/* Upcoming Test Card */}
          {nextTest && (
            <div className="bg-card border border-slate-border rounded-2xl p-5 shadow-subtle">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-text">Upcoming Exam</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  In 4 Days
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200">
                <p className="text-xs font-bold text-slate-text">{nextTest.name}</p>
                <p className="text-[11px] text-slate-secondary mt-0.5">
                  Date: Sep 12, 2026 • 50 Marks
                </p>

                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-secondary">Exam Readiness</span>
                    <span className="font-bold text-amber-700">{nextTest.preparationPercentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-amber-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${nextTest.preparationPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveView('tests')}
                  className="w-full mt-3 py-2 px-3 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>View 4-Day Prep Plan</span>
                </button>
              </div>
            </div>
          )}

          {/* Weekly Workload Optimizer */}
          <div className="bg-card border border-slate-border rounded-2xl p-5 shadow-subtle">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand" />
                <h3 className="text-sm font-bold text-slate-text">Weekly Workload</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-status-danger border border-red-200">
                HIGH LOAD
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-secondary">Active Deadlines:</span>
                <span className="font-bold text-slate-text">{workload.totalAssignmentsDue} Assignments</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-secondary">Lecture Hours:</span>
                <span className="font-bold text-slate-text">{workload.totalClassHours}h this week</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-secondary">Recommended Study:</span>
                <span className="font-bold text-brand">{workload.recommendedStudyHours}h</span>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-red-50/40 border border-red-100 text-[11px] text-slate-secondary leading-relaxed">
              <p className="font-bold text-slate-text text-xs mb-0.5">⚠️ Conflict Alert on Thursday</p>
              Two lab sessions clash with test prep. Moving 1h study to Wednesday evening is recommended.
            </div>

            <button
              onClick={() => {
                sendChatMessage('Optimize my weekly schedule to balance Thursday workload.');
                setIsAiDrawerOpen(true);
              }}
              className="w-full mt-3 py-2 rounded-xl bg-brand-50 hover:bg-brand text-brand hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimize My Week</span>
            </button>
          </div>

          {/* Daily Goals Progress */}
          <div className="bg-card border border-slate-border rounded-2xl p-5 shadow-subtle">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-text">Today's Goals</h3>
              <span className="text-xs font-bold text-brand">{goalPercent}%</span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-3">
              <div
                className="h-full bg-brand rounded-full transition-all"
                style={{ width: `${goalPercent}%` }}
              ></div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-secondary">Tasks Completed</span>
                <span className="font-bold text-slate-text">
                  {dailyGoal.tasksCompleted} / {dailyGoal.tasksTarget}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-secondary">Study Time</span>
                <span className="font-bold text-slate-text">
                  {dailyGoal.studyMinutesCompleted}m / {dailyGoal.studyMinutesTarget}m
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "Ask AI Why" Modal */}
      {isWhyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-text/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-slate-border rounded-2xl shadow-elevated p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-sm">
                <Sparkles className="w-4 h-4 text-accent-cyan" />
              </div>
              <h3 className="font-bold text-base text-slate-text">Why this recommendation?</h3>
            </div>

            <div className="space-y-3 text-xs md:text-sm text-slate-secondary leading-relaxed">
              <p>
                The Smart Priority Engine analyzed your schedule and calculated a <strong>Priority Score of 95/100</strong> for the <strong>DBMS B+ Tree Assignment</strong> due to the following reasons:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-text">
                <li>Due tomorrow at 23:59 (imminent deadline).</li>
                <li>Estimated time remaining is ~1h 20m across subtasks 4 and 5.</li>
                <li>Your current time window is clear of lecture clashes.</li>
                <li>Completing this eliminates late-night panic before tomorrow's DBMS class.</li>
              </ul>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setIsWhyModalOpen(false)}
                className="px-4 py-2 bg-brand hover:bg-brand-700 text-white font-bold text-xs rounded-xl"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
