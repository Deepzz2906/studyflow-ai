import React, { useState } from 'react';
import {
  X,
  FileText,
  BookOpen,
  GraduationCap,
  CalendarDays,
  Timer,
  StickyNote,
  Sparkles,
  Plus,
} from 'lucide-react';
import { useAcademic } from '../../store/AcademicContext';
import { AIService } from '../../services/ai/AIService';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'assignment',
}) => {
  const {
    subjects,
    addAssignment,
    addHomework,
    addTest,
    addTimetableEvent,
    addNote,
  } = useAcademic();

  const [activeTab, setActiveTab] = useState(defaultTab);

  // Assignment Form State
  const [asgTitle, setAsgTitle] = useState('');
  const [asgSubjectId, setAsgSubjectId] = useState(subjects[0]?.id || '');
  const [asgDescription, setAsgDescription] = useState('');
  const [asgTeacher, setAsgTeacher] = useState('');
  const [asgDueDate, setAsgDueDate] = useState('2026-09-15');
  const [asgDueTime, setAsgDueTime] = useState('23:59');
  const [asgDuration, setAsgDuration] = useState(120);
  const [asgDifficulty, setAsgDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [asgPriority, setAsgPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [isAiBreakingDown, setIsAiBreakingDown] = useState(false);

  // Homework Form State
  const [hwTitle, setHwTitle] = useState('');
  const [hwSubjectId, setHwSubjectId] = useState(subjects[0]?.id || '');
  const [hwDueDate, setHwDueDate] = useState('2026-09-10');
  const [hwDuration, setHwDuration] = useState(30);
  const [hwPriority, setHwPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');

  // Test Form State
  const [testName, setTestName] = useState('');
  const [testSubjectId, setTestSubjectId] = useState(subjects[0]?.id || '');
  const [testType, setTestType] = useState<'CAT 1' | 'CAT 2' | 'Midterm' | 'Final Exam' | 'Surprise Quiz'>('CAT 1');
  const [testDate, setTestDate] = useState('2026-09-22');
  const [testMarks, setTestMarks] = useState(50);
  const [testTopics, setTestTopics] = useState('Unit 1 & Unit 2 Core Topics');

  // Timetable Form State
  const [ttTitle, setTtTitle] = useState('');
  const [ttSubjectId, setTtSubjectId] = useState(subjects[0]?.id || '');
  const [ttDay, setTtDay] = useState(1);
  const [ttStart, setTtStart] = useState('14:00');
  const [ttEnd, setTtEnd] = useState('15:30');
  const [ttType, setTtType] = useState<'class' | 'lab' | 'study' | 'personal'>('class');

  // Note Form State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubjectId, setNoteSubjectId] = useState(subjects[0]?.id || '');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('Concepts, Cheatsheet');

  if (!isOpen) return null;

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle.trim()) return;

    const sub = subjects.find(s => s.id === asgSubjectId);
    const aiAnalysis = AIService.analyzeAssignment(asgTitle, sub?.name || '', asgDescription);

    addAssignment({
      title: asgTitle,
      subjectId: asgSubjectId,
      description: asgDescription || 'Course assignment with auto-generated subtasks.',
      teacher: asgTeacher || sub?.instructor || 'Faculty',
      dueDate: asgDueDate,
      dueTime: asgDueTime,
      estimatedDurationMinutes: asgDuration,
      difficulty: asgDifficulty,
      priority: asgPriority,
      status: 'Not Started',
      subtasks: aiAnalysis.subtasks,
    });

    onClose();
  };

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle.trim()) return;

    addHomework({
      title: hwTitle,
      subjectId: hwSubjectId,
      dueDate: hwDueDate,
      estimatedMinutes: hwDuration,
      priority: hwPriority,
      status: 'Not Started',
      notes: 'Daily homework item',
    });

    onClose();
  };

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) return;

    const splitTopics = testTopics.split(',').map((t, idx) => ({
      id: `tt-${Date.now()}-${idx}`,
      name: t.trim(),
      unit: 'Unit 1',
      confidence: 'Medium' as const,
      estimatedHours: 1.5,
      isRevised: false,
    }));

    addTest({
      name: testName,
      subjectId: testSubjectId,
      testType: testType as any,
      date: testDate,
      time: '10:00',
      durationMinutes: 90,
      totalMarks: Number(testMarks),
      difficulty: 'Medium',
      preparationPercentage: 20,
      topics: splitTopics.length > 0 ? splitTopics : [{ id: 'tt-1', name: 'General Syllabus', unit: 'Unit 1', confidence: 'Medium', estimatedHours: 2, isRevised: false }],
      notes: 'Scheduled exam',
    });

    onClose();
  };

  const handleCreateTimetable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ttTitle.trim()) return;

    addTimetableEvent({
      title: ttTitle,
      subjectId: ttSubjectId,
      dayOfWeek: Number(ttDay),
      startTime: ttStart,
      endTime: ttEnd,
      type: ttType,
      isRecurring: true,
      room: 'Lecture Hall',
    });

    onClose();
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    addNote({
      title: noteTitle,
      subjectId: noteSubjectId,
      content: noteContent || 'Note contents and key formulas...',
      tags: noteTags.split(',').map(t => t.trim()),
      isPinned: false,
      isArchived: false,
      aiSummary: 'Summary generated by StudyFlow AI assistant.',
    });

    onClose();
  };

  const tabs = [
    { id: 'assignment', label: 'Assignment', icon: FileText },
    { id: 'homework', label: 'Homework', icon: BookOpen },
    { id: 'test', label: 'Test / Exam', icon: GraduationCap },
    { id: 'timetable', label: 'Class / Event', icon: CalendarDays },
    { id: 'note', label: 'Note', icon: StickyNote },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-text/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-card border border-slate-border rounded-2xl shadow-elevated overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-border flex items-center justify-between bg-background">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand text-white flex items-center justify-center font-bold text-xs">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-text">Quick Add to StudyFlow</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-secondary hover:text-slate-text rounded-lg hover:bg-background-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center px-4 pt-3 border-b border-slate-border gap-1 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
                  isActive
                    ? 'border-brand text-brand bg-brand-50/50'
                    : 'border-transparent text-slate-secondary hover:text-slate-text'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {/* 1. ASSIGNMENT TAB */}
          {activeTab === 'assignment' && (
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-text mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., B+ Tree Indexing Implementation & Benchmark"
                  value={asgTitle}
                  onChange={e => setAsgTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Subject</label>
                  <select
                    value={asgSubjectId}
                    onChange={e => setAsgSubjectId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Instructor</label>
                  <input
                    type="text"
                    placeholder="e.g., Prof. Michael Torres"
                    value={asgTeacher}
                    onChange={e => setAsgTeacher(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Due Date</label>
                  <input
                    type="date"
                    value={asgDueDate}
                    onChange={e => setAsgDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Due Time</label>
                  <input
                    type="time"
                    value={asgDueTime}
                    onChange={e => setAsgDueTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-text mb-1">Estimated Duration</label>
                  <select
                    value={asgDuration}
                    onChange={e => setAsgDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  >
                    <option value={45}>45 mins</option>
                    <option value={90}>1.5 hours</option>
                    <option value={150}>2.5 hours</option>
                    <option value={240}>4 hours</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Difficulty</label>
                  <select
                    value={asgDifficulty}
                    onChange={e => setAsgDifficulty(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Priority</label>
                  <select
                    value={asgPriority}
                    onChange={e => setAsgPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-text mb-1">Description / Requirements</label>
                <textarea
                  rows={2}
                  placeholder="Details, submission specifications, or rubric notes..."
                  value={asgDescription}
                  onChange={e => setAsgDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                />
              </div>

              <div className="p-3 bg-cyan-50/50 rounded-xl border border-cyan-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-cyan-900 font-medium">
                  <Sparkles className="w-4 h-4 text-accent-cyan" />
                  <span>AI will automatically generate 6 subtasks & calculate priority score.</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-secondary hover:text-slate-text rounded-xl hover:bg-background-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          )}

          {/* 2. HOMEWORK TAB */}
          {activeTab === 'homework' && (
            <form onSubmit={handleCreateHomework} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-text mb-1">Homework Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., SQL Joins & Subqueries Worksheet Q1-15"
                  value={hwTitle}
                  onChange={e => setHwTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Subject</label>
                  <select
                    value={hwSubjectId}
                    onChange={e => setHwSubjectId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Due Date</label>
                  <input
                    type="date"
                    value={hwDueDate}
                    onChange={e => setHwDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Estimated Time (mins)</label>
                  <input
                    type="number"
                    value={hwDuration}
                    onChange={e => setHwDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Priority</label>
                  <select
                    value={hwPriority}
                    onChange={e => setHwPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-secondary hover:text-slate-text rounded-xl hover:bg-background-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  Add Homework
                </button>
              </div>
            </form>
          )}

          {/* 3. TEST / EXAM TAB */}
          {activeTab === 'test' && (
            <form onSubmit={handleCreateTest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-text mb-1">Test Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Operating Systems Midterm Exam"
                  value={testName}
                  onChange={e => setTestName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Subject</label>
                  <select
                    value={testSubjectId}
                    onChange={e => setTestSubjectId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Test Type</label>
                  <select
                    value={testType}
                    onChange={e => setTestType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  >
                    <option value="CAT 1">CAT 1</option>
                    <option value="CAT 2">CAT 2</option>
                    <option value="Midterm">Midterm</option>
                    <option value="Final Exam">Final Exam</option>
                    <option value="Surprise Quiz">Surprise Quiz</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={testDate}
                    onChange={e => setTestDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={testMarks}
                    onChange={e => setTestMarks(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-text mb-1">Topics (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g., Process Scheduling, Semaphores, Deadlocks"
                  value={testTopics}
                  onChange={e => setTestTopics(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-secondary hover:text-slate-text rounded-xl hover:bg-background-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  Schedule Test
                </button>
              </div>
            </form>
          )}

          {/* 4. TIMETABLE CLASS TAB */}
          {activeTab === 'timetable' && (
            <form onSubmit={handleCreateTimetable} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-text mb-1">Event / Class Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Computer Networks Lab"
                  value={ttTitle}
                  onChange={e => setTtTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Subject</label>
                  <select
                    value={ttSubjectId}
                    onChange={e => setTtSubjectId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Day of Week</label>
                  <select
                    value={ttDay}
                    onChange={e => setTtDay(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  >
                    <option value={0}>Monday</option>
                    <option value={1}>Tuesday</option>
                    <option value={2}>Wednesday</option>
                    <option value={3}>Thursday</option>
                    <option value={4}>Friday</option>
                    <option value={5}>Saturday</option>
                    <option value={6}>Sunday</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Start Time</label>
                  <input
                    type="time"
                    value={ttStart}
                    onChange={e => setTtStart(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">End Time</label>
                  <input
                    type="time"
                    value={ttEnd}
                    onChange={e => setTtEnd(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Event Type</label>
                  <select
                    value={ttType}
                    onChange={e => setTtType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  >
                    <option value="class">Lecture</option>
                    <option value="lab">Lab Session</option>
                    <option value="study">Study Slot</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-secondary hover:text-slate-text rounded-xl hover:bg-background-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  Save Timetable Slot
                </button>
              </div>
            </form>
          )}

          {/* 5. NOTE TAB */}
          {activeTab === 'note' && (
            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-text mb-1">Note Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Computer Networks Subnetting Rules"
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Subject</label>
                  <select
                    value={noteSubjectId}
                    onChange={e => setNoteSubjectId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-text mb-1">Tags</label>
                  <input
                    type="text"
                    placeholder="e.g., Formula, Exam, Cheatsheet"
                    value={noteTags}
                    onChange={e => setNoteTags(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-text mb-1">Content (Markdown supported)</label>
                <textarea
                  rows={4}
                  placeholder="Write formulas, key points, concepts, or code snippets..."
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand font-mono text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-secondary hover:text-slate-text rounded-xl hover:bg-background-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  Save Note
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
