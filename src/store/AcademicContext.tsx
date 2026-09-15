import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudentProfile,
  Subject,
  Assignment,
  Homework,
  TestExam,
  SubjectSyllabus,
  TimetableEvent,
  StudySessionLog,
  Note,
  GamificationBadge,
  AppNotification,
  DailyGoal,
  Quiz,
  AIMessage,
  AIActionPayload,
} from '../types';
import {
  AcademicIntegrationStatus,
  IntegrationProvider,
  AgentActionLogEntry,
  AgentMemory,
} from '../types/agent';
import {
  INITIAL_STUDENT,
  INITIAL_SUBJECTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_HOMEWORK,
  INITIAL_TESTS,
  INITIAL_SYLLABUS,
  INITIAL_TIMETABLE,
  INITIAL_STUDY_LOGS,
  INITIAL_NOTES,
  INITIAL_NOTIFICATIONS,
  INITIAL_BADGES,
  INITIAL_DAILY_GOAL,
} from '../data/mockData';
import { AIService } from '../services/ai/AIService';
import { ToolRegistry } from '../services/agent/tools/ToolRegistry';
import { MemoryService } from '../services/agent/memory/MemoryService';
import { ActionLogger } from '../services/agent/audit/ActionLogger';
import { ApiClient } from '../services/api/apiClient';
import { IntegrationService } from '../services/integrations/IntegrationService';
import { DataNormalizer } from '../services/integrations/dataNormalizer';

interface AcademicContextType {
  student: StudentProfile;
  subjects: Subject[];
  assignments: Assignment[];
  homework: Homework[];
  tests: TestExam[];
  syllabus: SubjectSyllabus[];
  timetable: TimetableEvent[];
  studyLogs: StudySessionLog[];
  notes: Note[];
  notifications: AppNotification[];
  badges: GamificationBadge[];
  dailyGoal: DailyGoal;
  quizzes: Quiz[];
  activeQuiz: Quiz | null;
  activeView: string;
  setActiveView: (view: string) => void;
  
  // UI states
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  quickAddDefaultTab: string;
  openQuickAdd: (tab?: string) => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFocusModeActive: boolean;
  setIsFocusModeActive: (active: boolean) => void;
  focusSessionContext: { subjectId: string; topic: string; duration: number } | null;
  startFocusSession: (subjectId: string, topic: string, durationMinutes: number) => void;

  // Actions
  updateStudent: (updates: Partial<StudentProfile>) => void;
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt' | 'calculatedPriorityScore'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  toggleAssignmentSubtask: (assignmentId: string, subtaskId: string) => void;
  
  addHomework: (hw: Omit<Homework, 'id' | 'createdAt'>) => void;
  updateHomework: (id: string, updates: Partial<Homework>) => void;
  deleteHomework: (id: string) => void;
  
  addTest: (test: Omit<TestExam, 'id'>) => void;
  updateTest: (id: string, updates: Partial<TestExam>) => void;
  deleteTest: (id: string) => void;
  saveTestPrepPlan: (testId: string) => void;
  
  updateTopicStatus: (subjectId: string, topicId: string, status: 'Not Started' | 'Learning' | 'Revised' | 'Mastered') => void;
  
  addTimetableEvent: (event: Omit<TimetableEvent, 'id'>) => void;
  updateTimetableEvent: (id: string, updates: Partial<TimetableEvent>) => void;
  deleteTimetableEvent: (id: string) => void;
  
  logStudySession: (log: Omit<StudySessionLog, 'id'>) => void;
  
  addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Agent Chat & Action Dispatcher
  chatMessages: AIMessage[];
  sendChatMessage: (text: string) => void;
  executeAIAction: (payload: AIActionPayload) => void;
  agentMemory: AgentMemory;
  actionLogs: AgentActionLogEntry[];
  
  // Academic Integrations
  integrations: AcademicIntegrationStatus[];
  toggleIntegrationConnection: (provider: IntegrationProvider) => Promise<void>;
  syncIntegrationFeed: (provider: IntegrationProvider) => Promise<string>;

  // Quiz Actions
  startNewQuiz: (subjectId: string, topic: string) => void;
  submitQuiz: (quizId: string, answers: { [qId: string]: number }) => void;
  closeQuiz: () => void;

  // Reset demo data
  resetAllData: () => void;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

const STORAGE_KEY = 'studyflow_academic_data_v1';

export const AcademicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_student`);
    return saved ? JSON.parse(saved) : INITIAL_STUDENT;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_subjects`);
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_assignments`);
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [homework, setHomework] = useState<Homework[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_homework`);
    return saved ? JSON.parse(saved) : INITIAL_HOMEWORK;
  });

  const [tests, setTests] = useState<TestExam[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tests`);
    return saved ? JSON.parse(saved) : INITIAL_TESTS;
  });

  const [syllabus, setSyllabus] = useState<SubjectSyllabus[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_syllabus`);
    return saved ? JSON.parse(saved) : INITIAL_SYLLABUS;
  });

  const [timetable, setTimetable] = useState<TimetableEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_timetable`);
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
  });

  const [studyLogs, setStudyLogs] = useState<StudySessionLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
    return saved ? JSON.parse(saved) : INITIAL_STUDY_LOGS;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notes`);
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifs`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [badges, setBadges] = useState<GamificationBadge[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_badges`);
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [dailyGoal, setDailyGoal] = useState<DailyGoal>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_goal`);
    return saved ? JSON.parse(saved) : INITIAL_DAILY_GOAL;
  });

  const [integrations, setIntegrations] = useState<AcademicIntegrationStatus[]>(() => {
    return IntegrationService.getIntegrations();
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddDefaultTab, setQuickAddDefaultTab] = useState('assignment');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Focus Mode
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [focusSessionContext, setFocusSessionContext] = useState<{ subjectId: string; topic: string; duration: number } | null>(null);

  // AI Chat Messages
  const [chatMessages, setChatMessages] = useState<AIMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'assistant',
      timestamp: '9:00 AM',
      text: "Good morning Alex! 👋 I'm **StudyFlow AI**, powered by the OpenClaw Agent runtime. I've synced your timetable, assignments, and test preparation schedules.\n\nHow can I assist your study flow today?",
      suggestedPrompts: [
        'What should I study right now?',
        'Make me a study plan for tonight',
        'Break down my DBMS assignment',
        'When is my next test?',
      ],
    },
  ]);

  // Synchronize Tool Registry Context with live React state
  useEffect(() => {
    ToolRegistry.setContext({
      student,
      subjects,
      assignments,
      homework,
      tests,
      timetable,
      studyLogs,
      notes,
      dailyGoal,
      mutators: {
        addAssignment,
        updateAssignment,
        addHomework,
        updateHomework,
        addTest,
        addTimetableEvent,
        updateTimetableEvent,
        deleteTimetableEvent,
        logStudySession,
      },
    });

    MemoryService.syncWithStudentProfile(student, subjects);
    MemoryService.updateActivePage(activeView);
  }, [student, subjects, assignments, homework, tests, timetable, studyLogs, notes, dailyGoal, activeView]);

  // Sync to LocalStorage on state changes
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_student`, JSON.stringify(student));
    localStorage.setItem(`${STORAGE_KEY}_subjects`, JSON.stringify(subjects));
    localStorage.setItem(`${STORAGE_KEY}_assignments`, JSON.stringify(assignments));
    localStorage.setItem(`${STORAGE_KEY}_homework`, JSON.stringify(homework));
    localStorage.setItem(`${STORAGE_KEY}_tests`, JSON.stringify(tests));
    localStorage.setItem(`${STORAGE_KEY}_syllabus`, JSON.stringify(syllabus));
    localStorage.setItem(`${STORAGE_KEY}_timetable`, JSON.stringify(timetable));
    localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(studyLogs));
    localStorage.setItem(`${STORAGE_KEY}_notes`, JSON.stringify(notes));
    localStorage.setItem(`${STORAGE_KEY}_notifs`, JSON.stringify(notifications));
    localStorage.setItem(`${STORAGE_KEY}_badges`, JSON.stringify(badges));
    localStorage.setItem(`${STORAGE_KEY}_goal`, JSON.stringify(dailyGoal));
  }, [student, subjects, assignments, homework, tests, syllabus, timetable, studyLogs, notes, notifications, badges, dailyGoal]);

  const openQuickAdd = (tab = 'assignment') => {
    setQuickAddDefaultTab(tab);
    setIsQuickAddOpen(true);
  };

  const updateStudent = (updates: Partial<StudentProfile>) => {
    setStudent(prev => ({ ...prev, ...updates }));
  };

  const addAssignment = (asgData: Omit<Assignment, 'id' | 'createdAt' | 'calculatedPriorityScore'>) => {
    const newAsg: Assignment = {
      ...asgData,
      id: `asg-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      calculatedPriorityScore: 75,
    };
    setAssignments(prev => [newAsg, ...prev]);
    
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Assignment Added',
        message: `${newAsg.title} added to your schedule. Due ${newAsg.dueDate}.`,
        type: 'deadline',
        timestamp: new Date().toISOString(),
        isRead: false,
        actionUrl: '/assignments',
      },
      ...prev,
    ]);
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const toggleAssignmentSubtask = (assignmentId: string, subtaskId: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id !== assignmentId) return a;
      const updatedSubtasks = a.subtasks.map(st => st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st);
      const allDone = updatedSubtasks.every(st => st.isCompleted);
      return {
        ...a,
        subtasks: updatedSubtasks,
        status: allDone ? 'Completed' : (updatedSubtasks.some(st => st.isCompleted) ? 'In Progress' : a.status),
      };
    }));
  };

  const addHomework = (hwData: Omit<Homework, 'id' | 'createdAt'>) => {
    const newHw: Homework = {
      ...hwData,
      id: `hw-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setHomework(prev => [newHw, ...prev]);
  };

  const updateHomework = (id: string, updates: Partial<Homework>) => {
    setHomework(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const deleteHomework = (id: string) => {
    setHomework(prev => prev.filter(h => h.id !== id));
  };

  const addTest = (testData: Omit<TestExam, 'id'>) => {
    const newTest: TestExam = {
      ...testData,
      id: `test-${Date.now()}`,
    };
    setTests(prev => [newTest, ...prev]);
  };

  const updateTest = (id: string, updates: Partial<TestExam>) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTest = (id: string) => {
    setTests(prev => prev.filter(t => t.id !== id));
  };

  const saveTestPrepPlan = (testId: string) => {
    const targetTest = tests.find(t => t.id === testId);
    if (!targetTest) return;
    const generated = AIService.generateTestPrepPlan(targetTest);
    updateTest(testId, { generatedPrepPlan: generated });
  };

  const updateTopicStatus = (subjectId: string, topicId: string, status: 'Not Started' | 'Learning' | 'Revised' | 'Mastered') => {
    setSyllabus(prev => prev.map(subSyllabus => {
      if (subSyllabus.subjectId !== subjectId) return subSyllabus;
      const updatedUnits = subSyllabus.units.map(unit => ({
        ...unit,
        topics: unit.topics.map(topic => topic.id === topicId ? { ...topic, status } : topic),
      }));

      let total = 0;
      let masteredCount = 0;
      updatedUnits.forEach(u => {
        u.topics.forEach(t => {
          total += 1;
          if (t.status === 'Mastered') masteredCount += 1;
          else if (t.status === 'Revised') masteredCount += 0.75;
          else if (t.status === 'Learning') masteredCount += 0.4;
        });
      });
      const newProgress = total > 0 ? Math.round((masteredCount / total) * 100) : 0;
      setSubjects(subs => subs.map(s => s.id === subjectId ? { ...s, syllabusProgress: newProgress } : s));

      return {
        ...subSyllabus,
        units: updatedUnits,
      };
    }));
  };

  const addTimetableEvent = (evtData: Omit<TimetableEvent, 'id'>) => {
    const newEvt: TimetableEvent = {
      ...evtData,
      id: `tt-${Date.now()}`,
    };
    setTimetable(prev => [...prev, newEvt]);
  };

  const updateTimetableEvent = (id: string, updates: Partial<TimetableEvent>) => {
    setTimetable(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteTimetableEvent = (id: string) => {
    setTimetable(prev => prev.filter(e => e.id !== id));
  };

  const logStudySession = (logData: Omit<StudySessionLog, 'id'>) => {
    const newLog: StudySessionLog = {
      ...logData,
      id: `log-${Date.now()}`,
    };
    setStudyLogs(prev => [newLog, ...prev]);

    // Feed session result into agent long-term memory learning loop
    MemoryService.learnFromSession(newLog);

    setSubjects(prev => prev.map(s => {
      if (s.id !== logData.subjectId) return s;
      const addedHours = Number((logData.actualMinutes / 60).toFixed(1));
      const updatedHours = Number((s.studyHoursLogged + addedHours).toFixed(1));
      const updatedConfidence = Number(((s.confidenceScore * 4 + logData.confidenceRating) / 5).toFixed(1));
      return {
        ...s,
        studyHoursLogged: updatedHours,
        confidenceScore: Math.min(5, Math.max(1, updatedConfidence)),
      };
    }));

    setDailyGoal(prev => ({
      ...prev,
      studyMinutesCompleted: prev.studyMinutesCompleted + logData.actualMinutes,
      testPrepMinutesCompleted: logData.topic.includes('CAT') || logData.topic.includes('Exam')
        ? prev.testPrepMinutesCompleted + logData.actualMinutes
        : prev.testPrepMinutesCompleted,
    }));
  };

  const addNote = (noteData: Omit<Note, 'id' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: `note-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const startFocusSession = (subjectId: string, topic: string, durationMinutes: number) => {
    setFocusSessionContext({ subjectId, topic, duration: durationMinutes });
    setIsFocusModeActive(true);
    setActiveView('focus');
  };

  const startNewQuiz = (subjectId: string, topic: string) => {
    const sub = subjects.find(s => s.id === subjectId);
    const quiz = AIService.generateQuiz(sub?.name || 'Computer Science', topic);
    setQuizzes(prev => [quiz, ...prev]);
    setActiveQuiz(quiz);
  };

  const submitQuiz = (quizId: string, answers: { [qId: string]: number }) => {
    let correctCount = 0;
    const targetQuiz = quizzes.find(q => q.id === quizId) || activeQuiz;
    if (!targetQuiz) return;

    const scoredQuestions = targetQuiz.questions.map(q => {
      const studentAns = answers[q.id];
      if (studentAns === q.correctIndex) correctCount += 1;
      return { ...q, studentAnswer: studentAns };
    });

    const updatedQuiz: Quiz = {
      ...targetQuiz,
      questions: scoredQuestions,
      score: correctCount,
      completedAt: new Date().toISOString(),
      status: 'completed',
    };

    setActiveQuiz(updatedQuiz);
    setQuizzes(prev => prev.map(q => q.id === quizId ? updatedQuiz : q));
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
  };

  // Academic Integrations Actions
  const toggleIntegrationConnection = async (provider: IntegrationProvider) => {
    const updated = await ApiClient.connectIntegration(provider);
    setIntegrations(prev => prev.map(i => i.id === provider ? updated : i));
  };

  const syncIntegrationFeed = async (provider: IntegrationProvider): Promise<string> => {
    const targetSub = subjects[0]?.id || 'sub-dbms';
    const result = await ApiClient.syncIntegration(provider, targetSub);
    
    // Ingest normalized items into assignments
    result.itemsSynced.forEach(item => {
      const normalizedAsg = DataNormalizer.normalizeAssignment(item, targetSub);
      addAssignment(normalizedAsg);
    });

    setIntegrations(IntegrationService.getIntegrations());
    return result.summary;
  };

  const executeAIAction = (payload: AIActionPayload) => {
    switch (payload.actionType) {
      case 'CREATE_ASSIGNMENT': {
        addAssignment({
          title: payload.data.title || 'New AI Assigned Project',
          subjectId: payload.data.subjectId || 'sub-dbms',
          description: payload.data.description || 'Auto-generated assignment from AI Assistant.',
          teacher: 'Prof. Michael Torres',
          dueDate: payload.data.dueDate || '2026-09-15',
          dueTime: payload.data.dueTime || '23:59',
          estimatedDurationMinutes: payload.data.estimatedDurationMinutes || 120,
          difficulty: payload.data.difficulty || 'Medium',
          priority: payload.data.priority || 'HIGH',
          status: 'Not Started',
          subtasks: [
            { id: `st-${Date.now()}-1`, title: 'Review specifications & requirements', estimatedMinutes: 30, isCompleted: false, order: 1 },
            { id: `st-${Date.now()}-2`, title: 'Implementation & experimentation', estimatedMinutes: 60, isCompleted: false, order: 2 },
            { id: `st-${Date.now()}-3`, title: 'Final testing and submission write-up', estimatedMinutes: 30, isCompleted: false, order: 3 },
          ],
        });
        break;
      }
      case 'CREATE_STUDY_SESSION': {
        addTimetableEvent({
          title: payload.data.title || 'AI Scheduled Study Session',
          subjectId: payload.data.subjectId || 'sub-cn',
          type: 'study',
          dayOfWeek: payload.data.dayOfWeek ?? 2,
          startTime: payload.data.startTime || '17:30',
          endTime: payload.data.endTime || '18:30',
          room: 'Study Zone / Dorm',
          isRecurring: false,
        });
        break;
      }
      case 'MARK_TASK_COMPLETE': {
        if (assignments.length > 0) {
          updateAssignment(assignments[0].id, { status: 'Completed' });
        }
        if (homework.length > 0) {
          updateHomework(homework[0].id, { status: 'Completed' });
        }
        setDailyGoal(prev => ({ ...prev, tasksCompleted: prev.tasksCompleted + 1 }));
        break;
      }
      case 'OPTIMIZE_WEEK': {
        addTimetableEvent({
          title: 'Rebalanced Networks Study Session',
          subjectId: 'sub-cn',
          type: 'study',
          dayOfWeek: 4,
          startTime: '16:45',
          endTime: '18:00',
          room: 'Library Quiet Zone',
          isRecurring: false,
        });
        break;
      }
    }

    setChatMessages(prev => prev.map(m => m.actionPayload === payload ? { ...m, actionExecuted: true } : m));
  };

  const sendChatMessage = async (userText: string) => {
    const userMsg: AIMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: userText,
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Send through OpenClaw Agent API Gateway
    const response = await ApiClient.postAIChat(userText, activeView, {
      student,
      subjects,
      assignments,
      homework,
      tests,
      timetable,
      logs: studyLogs,
    });

    setChatMessages(prev => [...prev, response.message]);
  };

  const resetAllData = () => {
    localStorage.clear();
    setStudent(INITIAL_STUDENT);
    setSubjects(INITIAL_SUBJECTS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setHomework(INITIAL_HOMEWORK);
    setTests(INITIAL_TESTS);
    setSyllabus(INITIAL_SYLLABUS);
    setTimetable(INITIAL_TIMETABLE);
    setStudyLogs(INITIAL_STUDY_LOGS);
    setNotes(INITIAL_NOTES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setBadges(INITIAL_BADGES);
    setDailyGoal(INITIAL_DAILY_GOAL);
  };

  return (
    <AcademicContext.Provider
      value={{
        student,
        subjects,
        assignments,
        homework,
        tests,
        syllabus,
        timetable,
        studyLogs,
        notes,
        notifications,
        badges,
        dailyGoal,
        quizzes,
        activeQuiz,
        activeView,
        setActiveView,
        isQuickAddOpen,
        setIsQuickAddOpen,
        quickAddDefaultTab,
        openQuickAdd,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        searchQuery,
        setSearchQuery,
        isFocusModeActive,
        setIsFocusModeActive,
        focusSessionContext,
        startFocusSession,
        updateStudent,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        toggleAssignmentSubtask,
        addHomework,
        updateHomework,
        deleteHomework,
        addTest,
        updateTest,
        deleteTest,
        saveTestPrepPlan,
        updateTopicStatus,
        addTimetableEvent,
        updateTimetableEvent,
        deleteTimetableEvent,
        logStudySession,
        addNote,
        updateNote,
        deleteNote,
        markNotificationRead,
        clearAllNotifications,
        chatMessages,
        sendChatMessage,
        executeAIAction,
        agentMemory: MemoryService.getMemory(),
        actionLogs: ActionLogger.getLogs(),
        integrations,
        toggleIntegrationConnection,
        syncIntegrationFeed,
        startNewQuiz,
        submitQuiz,
        closeQuiz,
        resetAllData,
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = () => {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademic must be used within an AcademicProvider');
  }
  return context;
};
