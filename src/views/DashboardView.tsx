import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Bell,
  Plus,
  CheckSquare,
  FileText,
  GraduationCap,
  Clock,
  Sparkles,
  Check,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Send,
  X,
  ExternalLink,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useAcademic } from '../store/AcademicContext';
import { AIService } from '../services/ai/AIService';

interface TodayActivity {
  id: string;
  time: string;
  title: string;
  subject: string;
  duration: string;
  color: string;
}

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
    openQuickAdd,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setIsAiDrawerOpen,
    sendChatMessage,
  } = useAcademic();

  // Local UI states
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isQuickAddMenuOpen, setIsQuickAddMenuOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Today's activities completion state persisted in localStorage
  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('studyflow_today_plan_completed');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleActivity = (id: string) => {
    setCompletedActivities(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('studyflow_today_plan_completed', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // 1. Current Date String
  const formattedDate = useMemo(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };
    return today.toLocaleDateString('en-US', options);
  }, []);

  // 2. Summary KPI Calculations
  const pendingAssignments = useMemo(
    () => assignments.filter(a => a.status !== 'Completed' && a.status !== 'Submitted'),
    [assignments]
  );

  const pendingHomework = useMemo(
    () => homework.filter(h => h.status !== 'Completed'),
    [homework]
  );

  const pendingTasksCount = pendingAssignments.length + pendingHomework.length;

  const urgentTasksCount = useMemo(() => {
    return pendingAssignments.filter(
      a => a.calculatedPriorityScore >= 80 || a.dueDate === '2026-09-09' || a.dueDate === '2026-09-10'
    ).length;
  }, [pendingAssignments]);

  const nextTest = tests[0];

  const studyHoursPlanned = (dailyGoal.studyMinutesTarget / 60).toFixed(1);
  const studyHoursCompleted = (dailyGoal.studyMinutesCompleted / 60).toFixed(1);

  // 3. Chronological Today's Plan items
  const todaysActivities: TodayActivity[] = [
    {
      id: 'act-1',
      time: '9:00 AM',
      title: 'Computer Networks class',
      subject: 'CS302 • Room 402',
      duration: '1h 30m',
      color: '#3563E9', // Primary blue
    },
    {
      id: 'act-2',
      time: '11:00 AM',
      title: 'DBMS assignment',
      subject: 'CS401 • ER Diagrams & SQL',
      duration: '1h 00m',
      color: '#38BDF8', // Secondary blue
    },
    {
      id: 'act-3',
      time: '2:00 PM',
      title: 'Operating Systems Lab',
      subject: 'CS201 • Kernel Threads',
      duration: '2h 00m',
      color: '#F59E0B', // Warning amber
    },
    {
      id: 'act-4',
      time: '5:00 PM',
      title: 'Data Structures revision',
      subject: 'CS102 • AVL Trees',
      duration: '45m',
      color: '#16A34A', // Success green
    },
    {
      id: 'act-5',
      time: '7:00 PM',
      title: 'Practice questions',
      subject: 'CS102 • CAT 1 Prep',
      duration: '30m',
      color: '#64748B', // Neutral slate
    },
  ];

  // 4. Upcoming Deadlines (Next 3)
  const upcomingDeadlines = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      subject: string;
      dueDate: string;
      status: 'Overdue' | 'Due Soon' | 'Pending';
    }> = [];

    // Sort assignments by due date
    const sortedAssignments = [...pendingAssignments].sort((a, b) =>
      a.dueDate.localeCompare(b.dueDate)
    );

    for (const a of sortedAssignments.slice(0, 3)) {
      const isDueTomorrow = a.dueDate === '2026-09-09';
      const isOverdue = a.dueDate < '2026-09-08';
      let status: 'Overdue' | 'Due Soon' | 'Pending' = 'Pending';
      if (isOverdue) status = 'Overdue';
      else if (isDueTomorrow || a.calculatedPriorityScore >= 80) status = 'Due Soon';

      const subj = subjects.find(s => s.id === a.subjectId);

      list.push({
        id: a.id,
        name: a.title,
        subject: subj ? `${subj.code} • ${subj.name}` : a.subjectId,
        dueDate: isDueTomorrow ? 'Tomorrow, Sep 9' : a.dueDate,
        status,
      });
    }

    return list;
  }, [pendingAssignments, subjects]);

  // 5. Handle AI Assistant queries
  const handleAskAI = (promptText: string) => {
    const query = promptText.trim();
    if (!query) return;

    setIsAiLoading(true);
    setAiInput(query);

    setTimeout(() => {
      const lower = query.toLowerCase();

      if (lower.includes('what should i study now') || lower.includes('what now')) {
        const topAssignment = pendingAssignments[0];
        setAiAnswer(
          `Based on your deadlines and timetable, you should prioritize **${topAssignment ? topAssignment.title : 'DBMS ER-Diagrams'}** (due tomorrow). You currently have an open study window until 6:30 PM.`
        );
      } else if (lower.includes('due this week') || lower.includes('upcoming')) {
        setAiAnswer(
          `You have **${pendingAssignments.length} assignments** and **${pendingHomework.length} homework items** due this week:\n• DBMS B+ Tree Normalization (Due Tomorrow)\n• Computer Networks Socket Lab (Due Thursday)\n• Discrete Math Exercise #4 (Due Friday)`
        );
      } else if (lower.includes('prepare me') || lower.includes('test') || lower.includes('exam')) {
        const testSubj = subjects.find(s => s.id === nextTest?.subjectId);
        const testName = nextTest ? `${nextTest.name} (${testSubj?.code || 'CS102'})` : 'Data Structures CAT 1';
        setAiAnswer(
          `Your next exam is **${testName}** in **3 days**. Focus your revision on:\n1. AVL Tree balance factor rotations\n2. Graph BFS / DFS Traversals\n3. Big-O Complexity proofs`
        );
      } else {
        // Fallback intelligent context responder
        const response = AIService.processAIChat(query, 'dashboard', {
          student,
          subjects,
          assignments,
          homework,
          tests,
          timetable,
          logs: studyLogs,
        });
        setAiAnswer(response.text);
      }

      setIsAiLoading(false);
    }, 280);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* =========================================================================
          AREA A: SIMPLE HEADER
          ========================================================================= */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172B4D] tracking-tight">
            Good morning, {student.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Here's your plan for today.
          </p>
        </div>

        {/* Right side controls: Date, Quick Add, Notifications, Profile */}
        <div className="flex items-center gap-2.5">
          {/* Current Date */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-medium text-[#64748B] shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
            <span>{formattedDate}</span>
          </div>

          {/* Quick Add Button */}
          <div className="relative">
            <button
              onClick={() => setIsQuickAddMenuOpen(!isQuickAddMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3563E9] hover:bg-[#254EDB] text-white text-xs font-medium transition-colors shadow-xs"
              title="Quick Add"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Add</span>
            </button>

            {/* Quick Add Dropdown Menu */}
            {isQuickAddMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsQuickAddMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-md py-1 z-40 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      openQuickAdd('assignment');
                      setIsQuickAddMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#172B4D] hover:bg-[#F5F7FB] flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#3563E9]" />
                    <span>New Assignment</span>
                  </button>
                  <button
                    onClick={() => {
                      openQuickAdd('homework');
                      setIsQuickAddMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#172B4D] hover:bg-[#F5F7FB] flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>New Homework</span>
                  </button>
                  <button
                    onClick={() => {
                      openQuickAdd('test');
                      setIsQuickAddMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#172B4D] hover:bg-[#F5F7FB] flex items-center gap-2"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>New Test / Exam</span>
                  </button>
                  <button
                    onClick={() => {
                      openQuickAdd('reminder');
                      setIsQuickAddMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#172B4D] hover:bg-[#F5F7FB] flex items-center gap-2"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Study Reminder</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Notifications Icon with popover */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-lg bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#172B4D] hover:bg-[#F5F7FB] transition-colors relative shadow-xs"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444]" />
              )}
            </button>

            {/* Notifications Popover */}
            {isNotifOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsNotifOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-2 z-40 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-[#E2E8F0]">
                    <span className="text-xs font-semibold text-[#172B4D]">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => clearAllNotifications()}
                        className="text-[11px] text-[#3563E9] hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-[#E2E8F0]">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-xs text-[#64748B]">No notifications</p>
                    ) : (
                      notifications.slice(0, 4).map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 text-xs cursor-pointer hover:bg-[#F5F7FB] transition-colors ${
                            !n.isRead ? 'bg-[#F8FAFC]' : ''
                          }`}
                        >
                          <p className="font-medium text-[#172B4D] truncate">{n.title}</p>
                          <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="pt-2 px-3 border-t border-[#E2E8F0] text-center">
                    <button
                      onClick={() => {
                        setActiveView('notifications');
                        setIsNotifOpen(false);
                      }}
                      className="text-[11px] text-[#3563E9] hover:underline font-medium"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Avatar */}
          <button
            onClick={() => setActiveView('settings')}
            className="w-8 h-8 rounded-lg bg-[#EFF4FF] border border-[#BFD6FE] text-[#3563E9] font-bold text-xs flex items-center justify-center hover:bg-[#DBEAFE] transition-colors"
            title="Profile & Settings"
          >
            {student.name
              .split(' ')
              .map(n => n[0])
              .slice(0, 2)
              .join('')}
          </button>
        </div>
      </header>

      {/* =========================================================================
          AREA B: COMPACT SUMMARY (4 CARDS IN ONE ROW)
          ========================================================================= */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Tasks Remaining */}
        <div
          onClick={() => setActiveView('tasks')}
          className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1] transition-all cursor-pointer select-none"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#64748B]">Tasks remaining</span>
            <CheckSquare className="w-4 h-4 text-[#64748B]" />
          </div>
          <div className="text-2xl font-bold text-[#172B4D] tracking-tight">
            {pendingTasksCount}
          </div>
          <p className="text-[11px] text-[#64748B] mt-1 truncate">
            {urgentTasksCount > 0 ? `${urgentTasksCount} due soon` : 'All tasks on track'}
          </p>
        </div>

        {/* 2. Upcoming Assignments */}
        <div
          onClick={() => setActiveView('assignments')}
          className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1] transition-all cursor-pointer select-none"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#64748B]">Upcoming assignments</span>
            <FileText className="w-4 h-4 text-[#64748B]" />
          </div>
          <div className="text-2xl font-bold text-[#172B4D] tracking-tight">
            {pendingAssignments.length}
          </div>
          <p className="text-[11px] text-[#64748B] mt-1 truncate">
            {pendingAssignments[0] ? `Next due tomorrow` : 'None pending'}
          </p>
        </div>

        {/* 3. Upcoming Tests */}
        <div
          onClick={() => setActiveView('tests')}
          className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1] transition-all cursor-pointer select-none"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#64748B]">Upcoming tests</span>
            <GraduationCap className="w-4 h-4 text-[#64748B]" />
          </div>
          <div className="text-2xl font-bold text-[#172B4D] tracking-tight">
            {tests.length}
          </div>
          <p className="text-[11px] text-[#64748B] mt-1 truncate">
            {nextTest
              ? `Next in 3 days (${subjects.find(s => s.id === nextTest.subjectId)?.code || 'Exam'})`
              : 'No upcoming tests'}
          </p>
        </div>

        {/* 4. Study Time Planned */}
        <div
          onClick={() => setActiveView('planner')}
          className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1] transition-all cursor-pointer select-none"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#64748B]">Study time planned</span>
            <Clock className="w-4 h-4 text-[#64748B]" />
          </div>
          <div className="text-2xl font-bold text-[#172B4D] tracking-tight">
            {studyHoursPlanned}h
          </div>
          <p className="text-[11px] text-[#64748B] mt-1 truncate">
            {studyHoursCompleted}h completed today
          </p>
        </div>
      </section>

      {/* =========================================================================
          MAIN 2-COLUMN SECTION:
          Left: Area C (Today's Plan)
          Right: Area D (AI Academic Assistant) + Area E (Upcoming Deadlines)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =======================================================================
            AREA C: TODAY'S PLAN (MAIN SECTION)
            ======================================================================= */}
        <section className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#172B4D]">Today's Plan</h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                {todaysActivities.length} scheduled sessions
              </p>
            </div>

            {/* Simple View Timetable link */}
            <button
              onClick={() => setActiveView('timetable')}
              className="text-xs font-medium text-[#3563E9] hover:underline flex items-center gap-1"
            >
              <span>View Timetable</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Chronological Activities List */}
          <div className="divide-y divide-[#E2E8F0]">
            {todaysActivities.map(item => {
              const isDone = !!completedActivities[item.id];

              return (
                <div
                  key={item.id}
                  className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3 group transition-colors"
                >
                  {/* Left: Checkbox + Small colored dot indicator + Time + Subject */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Completion status checkbox */}
                    <button
                      onClick={() => toggleActivity(item.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                        isDone
                          ? 'bg-[#3563E9] border-[#3563E9] text-white'
                          : 'border-[#CBD5E1] bg-white hover:border-[#3563E9]'
                      }`}
                      title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isDone && <Check className="w-3 h-3 stroke-[2.5]" />}
                    </button>

                    {/* Small colored indicator dot */}
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />

                    {/* Time */}
                    <span className="text-xs font-semibold text-[#172B4D] w-18 shrink-0">
                      {item.time}
                    </span>

                    {/* Subject / Activity Title */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-medium truncate ${
                          isDone ? 'line-through text-[#64748B]' : 'text-[#172B4D]'
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[#64748B] truncate mt-0.2">
                        {item.subject}
                      </p>
                    </div>
                  </div>

                  {/* Right: Duration & Completion status pill */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-[#64748B] font-medium hidden sm:inline">
                      {item.duration}
                    </span>

                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        isDone
                          ? 'bg-[#DCFCE7] text-[#16A34A]'
                          : 'bg-[#F1F5F9] text-[#64748B]'
                      }`}
                    >
                      {isDone ? 'Completed' : item.duration}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =======================================================================
            RIGHT COLUMN: AREA D & AREA E
            ======================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* =====================================================================
              AREA D: AI ACADEMIC ASSISTANT
              ===================================================================== */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#3563E9]" />
                <h2 className="text-base font-semibold text-[#172B4D]">
                  Your AI Study Assistant
                </h2>
              </div>
              <p className="text-xs text-[#64748B] mt-1">
                Need help deciding what to study? Ask your personal academic assistant.
              </p>
            </div>

            {/* Input Box with Ask AI button */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleAskAI(aiInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                placeholder="Ask anything about your schedule or tests..."
                className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#3563E9] focus:bg-white text-xs text-[#172B4D] placeholder-[#94A3B8] px-3 py-2 rounded-lg outline-none transition-all"
              />
              <button
                type="submit"
                disabled={isAiLoading || !aiInput.trim()}
                className="bg-[#3563E9] hover:bg-[#254EDB] disabled:opacity-50 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-colors shrink-0 flex items-center gap-1.5"
              >
                <span>Ask AI</span>
              </button>
            </form>

            {/* Max 3 Suggested Prompts */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <button
                onClick={() => handleAskAI('What should I study now?')}
                className="text-[11px] font-medium bg-[#F5F7FB] hover:bg-[#EFF4FF] hover:text-[#3563E9] text-[#64748B] px-2.5 py-1 rounded-md border border-[#E2E8F0] transition-colors"
              >
                What should I study now?
              </button>
              <button
                onClick={() => handleAskAI("What's due this week?")}
                className="text-[11px] font-medium bg-[#F5F7FB] hover:bg-[#EFF4FF] hover:text-[#3563E9] text-[#64748B] px-2.5 py-1 rounded-md border border-[#E2E8F0] transition-colors"
              >
                What's due this week?
              </button>
              <button
                onClick={() => handleAskAI('Prepare me for my next test.')}
                className="text-[11px] font-medium bg-[#F5F7FB] hover:bg-[#EFF4FF] hover:text-[#3563E9] text-[#64748B] px-2.5 py-1 rounded-md border border-[#E2E8F0] transition-colors"
              >
                Prepare me for my next test.
              </button>
            </div>

            {/* Inline AI Response Box */}
            {aiAnswer && (
              <div className="mt-3 p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#172B4D] leading-relaxed relative animate-in fade-in duration-150">
                <button
                  onClick={() => setAiAnswer(null)}
                  className="absolute top-2.5 right-2.5 text-[#64748B] hover:text-[#172B4D]"
                  title="Close answer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="whitespace-pre-line pr-4">
                  {aiAnswer}
                </div>
                <div className="mt-2.5 pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px]">
                  <span className="text-[#64748B]">Connected to live academic record</span>
                  <button
                    onClick={() => {
                      sendChatMessage(aiInput || 'What should I study now?');
                      setActiveView('ai-assistant');
                    }}
                    className="text-[#3563E9] hover:underline font-medium flex items-center gap-1"
                  >
                    <span>Open full assistant</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* =====================================================================
              AREA E: UPCOMING DEADLINES
              ===================================================================== */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-base font-semibold text-[#172B4D]">Upcoming Deadlines</h2>
              <button
                onClick={() => setActiveView('assignments')}
                className="text-xs font-medium text-[#3563E9] hover:underline"
              >
                View all
              </button>
            </div>

            {/* List of next 3 deadlines */}
            <div className="divide-y divide-[#E2E8F0]">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-xs text-[#64748B] py-3">No upcoming deadlines.</p>
              ) : (
                upcomingDeadlines.map(item => (
                  <div
                    key={item.id}
                    className="py-3 first:pt-0.5 last:pb-0.5 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#172B4D] truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                        {item.subject}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[11px] text-[#64748B] font-medium hidden sm:inline">
                        {item.dueDate}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.status === 'Overdue'
                            ? 'bg-[#FEE2E2] text-[#EF4444]'
                            : item.status === 'Due Soon'
                            ? 'bg-[#FEF3C7] text-[#D97706]'
                            : 'bg-[#EFF4FF] text-[#3563E9]'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
