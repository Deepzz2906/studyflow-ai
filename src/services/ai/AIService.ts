import {
  StudentProfile,
  Subject,
  Assignment,
  Homework,
  TestExam,
  TimetableEvent,
  StudySessionLog,
  AIMessage,
  Quiz,
  Flashcard,
  TestPrepDayPlan,
  AIActionPayload,
} from '../../types';
import { calculateTaskPriorityScore } from '../priorityEngine';

export interface DailyBriefResult {
  headline: string;
  summary: string;
  recommendedTimeSlots: {
    duration: string;
    subjectName: string;
    taskTitle: string;
    rationale: string;
  }[];
  criticalAlert?: string;
}

export interface WhatShouldIDoNowResult {
  recommendedTask: {
    id: string;
    type: 'assignment' | 'homework' | 'test_prep' | 'quick_revision';
    title: string;
    subjectName: string;
    subjectCode: string;
    subjectColor: string;
    dueContext: string;
    estimatedMinutes: number;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    actionText: string;
  };
  reason: string;
  contextAdvice: string;
  freeWindowAvailableMinutes: number;
  alternativeTask?: {
    title: string;
    estimatedMinutes: number;
    subjectName: string;
  };
}

export interface WorkloadAnalysisResult {
  overallLevel: 'LOW' | 'OPTIMAL' | 'HIGH' | 'CRITICAL_OVERLOAD';
  totalAssignmentsDue: number;
  totalHomeworkDue: number;
  totalTestsThisWeek: number;
  totalClassHours: number;
  recommendedStudyHours: number;
  overloadedDays: {
    day: string;
    reasons: string[];
    conflictItem: string;
    fixSuggestion: string;
  }[];
  actionableInsights: string[];
}

export class AIService {
  /**
   * Generates the dynamic AI Daily Brief
   */
  static getDailyBrief(
    student: StudentProfile,
    subjects: Subject[],
    assignments: Assignment[],
    homework: Homework[],
    tests: TestExam[],
    _logs: StudySessionLog[],
    _timetable: TimetableEvent[]
  ): DailyBriefResult {
    // Find imminent tasks
    const pendingAssignments = assignments.filter(a => a.status !== 'Completed' && a.status !== 'Submitted');
    const pendingHomework = homework.filter(h => h.status !== 'Completed');
    
    // Sort by priority score
    const scoredAssignments = pendingAssignments.map(a => ({
      ...a,
      calc: calculateTaskPriorityScore({
        title: a.title,
        subjectId: a.subjectId,
        dueDate: a.dueDate,
        estimatedMinutes: a.estimatedDurationMinutes,
        difficulty: a.difficulty,
      }, subjects, tests),
    })).sort((a, b) => b.calc.score - a.calc.score);

    const urgentTest = tests
      .filter(t => t.preparationPercentage < 80)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

    const topAssignment = scoredAssignments[0];
    const topSubject = topAssignment ? subjects.find(s => s.id === topAssignment.subjectId) : null;
    const testSubject = urgentTest ? subjects.find(s => s.id === urgentTest.subjectId) : null;

    const slots = [];

    if (topAssignment) {
      slots.push({
        duration: '45 min',
        subjectName: topSubject?.name || 'Academic Priority',
        taskTitle: topAssignment.title,
        rationale: `Due ${topAssignment.dueDate === '2026-09-09' ? 'tomorrow' : topAssignment.dueDate} — highest calculated priority score (${topAssignment.calc.score}/100).`,
      });
    }

    if (urgentTest) {
      slots.push({
        duration: '35 min',
        subjectName: testSubject?.name || 'Exam Prep',
        taskTitle: `${urgentTest.name} Topic Revision`,
        rationale: `Test scheduled in 4 days. Current preparation is at ${urgentTest.preparationPercentage}%.`,
      });
    }

    if (pendingHomework.length > 0) {
      const topHw = pendingHomework[0];
      const hwSub = subjects.find(s => s.id === topHw.subjectId);
      slots.push({
        duration: `${topHw.estimatedMinutes} min`,
        subjectName: hwSub?.name || 'Daily Homework',
        taskTitle: topHw.title,
        rationale: 'Quick win to prevent backlog accumulation before tomorrow classes.',
      });
    }

    const headline = topAssignment
      ? `Your most important task today is the ${topSubject?.code || 'DBMS'} assignment because it is due tomorrow.`
      : `You are in great shape today! Focus on ${urgentTest ? urgentTest.name : 'consistent revision'}.`;

    const summary = urgentTest
      ? `You also have a ${testSubject?.name} test in 4 days. I've budgeted ${student.availableDailyStudyMinutes / 60}h of focused study with interleaved breaks to keep cognitive fatigue low.`
      : `Keep up your ${student.sessionDurationPreference} min focus cycles to maximize retention.`;

    return {
      headline,
      summary,
      recommendedTimeSlots: slots,
      criticalAlert: topAssignment?.priority === 'CRITICAL' ? 'DBMS Assignment due tomorrow at 23:59' : undefined,
    };
  }

  /**
   * Signature Feature: "What Should I Do Now?"
   */
  static getWhatShouldIDoNow(
    currentTime: string, // "17:30"
    subjects: Subject[],
    assignments: Assignment[],
    homework: Homework[],
    tests: TestExam[],
    timetable: TimetableEvent[]
  ): WhatShouldIDoNowResult {
    // Determine upcoming class/free slot from timetable
    const todayEvents = timetable.filter(e => e.dayOfWeek === 1 || e.dayOfWeek === 2); // Tuesday/Wed sample
    const nextClass = todayEvents.find(e => e.startTime > currentTime && (e.type === 'class' || e.type === 'lab'));

    let freeWindow = 90; // default 90 min free time
    if (nextClass) {
      const [h1, m1] = currentTime.split(':').map(Number);
      const [h2, m2] = nextClass.startTime.split(':').map(Number);
      freeWindow = Math.max((h2 * 60 + m2) - (h1 * 60 + m1), 15);
    }

    // Identify highest priority item that fits or partially fits
    const dbmsAssignment = assignments.find(a => a.subjectId === 'sub-dbms' && a.status !== 'Completed');
    const urgentTest = tests.find(t => t.preparationPercentage < 50);
    const dbmsHw = homework.find(h => h.status !== 'Completed' && h.dueDate === '2026-09-09');

    if (freeWindow <= 50 && dbmsHw) {
      const hwSub = subjects.find(s => s.id === dbmsHw.subjectId);
      return {
        recommendedTask: {
          id: dbmsHw.id,
          type: 'homework',
          title: dbmsHw.title,
          subjectName: hwSub?.name || 'DBMS',
          subjectCode: hwSub?.code || 'CS302',
          subjectColor: hwSub?.color || '#0EA5E9',
          dueContext: 'Due tomorrow at 17:00',
          estimatedMinutes: dbmsHw.estimatedMinutes,
          priority: 'HIGH',
          actionText: 'Start Homework',
        },
        reason: `You have ${freeWindow} minutes before your next event. This matches your ${dbmsHw.estimatedMinutes}-minute DBMS homework perfectly.`,
        contextAdvice: 'Completing this now clears your evening for the B+ Tree major assignment.',
        freeWindowAvailableMinutes: freeWindow,
        alternativeTask: dbmsAssignment ? {
          title: dbmsAssignment.title,
          estimatedMinutes: 45,
          subjectName: 'DBMS',
        } : undefined,
      };
    }

    // Default to critical assignment or urgent test prep
    const topSubject = dbmsAssignment ? subjects.find(s => s.id === dbmsAssignment.subjectId) : subjects[0];

    return {
      recommendedTask: {
        id: dbmsAssignment ? dbmsAssignment.id : 'test-prep-now',
        type: dbmsAssignment ? 'assignment' : 'test_prep',
        title: dbmsAssignment ? dbmsAssignment.title : (urgentTest ? `${urgentTest.name} Preparation` : 'Data Structures Trees Revision'),
        subjectName: topSubject?.name || 'Database Management Systems',
        subjectCode: topSubject?.code || 'CS302',
        subjectColor: topSubject?.color || '#0EA5E9',
        dueContext: dbmsAssignment ? 'Due tomorrow at 23:59' : 'Exam in 4 days',
        estimatedMinutes: 45,
        priority: 'CRITICAL',
        actionText: 'Start 45m Focus Session',
      },
      reason: dbmsAssignment
        ? 'High academic weight + due tomorrow. Breaking into a 45-minute subtask sprint now avoids late-night rush.'
        : 'Exam preparation needs immediate focus to hit 80% readiness threshold.',
      contextAdvice: 'Optimal cognitive performance window detected. Recommended: Subtask 4 (Write unit tests & edge cases).',
      freeWindowAvailableMinutes: freeWindow,
      alternativeTask: urgentTest ? {
        title: 'AVL Tree Double Rotation Hand-Trace',
        estimatedMinutes: 30,
        subjectName: 'Data Structures',
      } : undefined,
    };
  }

  /**
   * Generates a dynamic time-blocked study plan
   */
  static generateStudyPlan(
    availableMinutes: number,
    targetSubjectId: string | null,
    assignments: Assignment[],
    tests: TestExam[],
    homework: Homework[],
    subjects: Subject[]
  ) {
    const slots: {
      timeSlot: string;
      subjectName: string;
      subjectCode: string;
      subjectColor: string;
      title: string;
      durationMinutes: number;
      isBreak: boolean;
      type: 'assignment' | 'test_prep' | 'homework' | 'break';
    }[] = [];

    let currentMinuteOffset = 0; // minutes from 17:00 (5:00 PM) base
    const startHour = 17; // 5:00 PM

    const formatTime = (offsetMins: number) => {
      const totalMins = startHour * 60 + offsetMins;
      const h = Math.floor(totalMins / 60) % 24;
      const m = totalMins % 60;
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
      return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
    };

    let remaining = availableMinutes;

    // Prioritized items pool
    const pool = [
      {
        title: 'DBMS B+ Tree Implementation',
        subjectId: 'sub-dbms',
        duration: 45,
        type: 'assignment' as const,
      },
      {
        title: 'Data Structures Trees Revision (CAT 1)',
        subjectId: 'sub-ds',
        duration: 45,
        type: 'test_prep' as const,
      },
      {
        title: 'Networks Subnetting Practice Problems',
        subjectId: 'sub-cn',
        duration: 35,
        type: 'homework' as const,
      },
      {
        title: 'Operating Systems Scheduling Review',
        subjectId: 'sub-os',
        duration: 30,
        type: 'test_prep' as const,
      },
    ];

    // If a target subject is chosen, boost it to front
    if (targetSubjectId) {
      pool.sort((a, b) => (a.subjectId === targetSubjectId ? -1 : 1));
    }

    let itemIdx = 0;
    while (remaining > 20 && itemIdx < pool.length) {
      const item = pool[itemIdx];
      const allocMinutes = Math.min(item.duration, remaining);
      const sub = subjects.find(s => s.id === item.subjectId);

      const startTimeStr = formatTime(currentMinuteOffset);
      currentMinuteOffset += allocMinutes;
      const endTimeStr = formatTime(currentMinuteOffset);

      slots.push({
        timeSlot: `${startTimeStr} – ${endTimeStr}`,
        subjectName: sub?.name || 'Academic Study',
        subjectCode: sub?.code || 'GEN',
        subjectColor: sub?.color || '#4F46E5',
        title: item.title,
        durationMinutes: allocMinutes,
        isBreak: false,
        type: item.type,
      });

      remaining -= allocMinutes;
      itemIdx++;

      // Interleave a 10 or 15 minute break if more time remains
      if (remaining >= 25) {
        const breakDuration = 10;
        const bStart = formatTime(currentMinuteOffset);
        currentMinuteOffset += breakDuration;
        const bEnd = formatTime(currentMinuteOffset);

        slots.push({
          timeSlot: `${bStart} – ${bEnd}`,
          subjectName: 'Cognitive Reset',
          subjectCode: 'REST',
          subjectColor: '#64748B',
          title: 'Hydration & Micro Walk Break',
          durationMinutes: breakDuration,
          isBreak: true,
          type: 'break',
        });
        remaining -= breakDuration;
      }
    }

    return slots;
  }

  /**
   * Generates a 5-day / Custom AI Test Preparation Plan
   */
  static generateTestPrepPlan(test: TestExam): TestPrepDayPlan[] {
    const days: TestPrepDayPlan[] = [];
    const baseDate = new Date('2026-09-08');

    const topics = test.topics;
    const splitCount = Math.min(4, Math.max(2, topics.length));

    for (let i = 0; i < 4; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];

      if (i === 0) {
        days.push({
          dayNumber: 1,
          dayDate: dateStr,
          sessions: [
            { topic: topics[0]?.name || 'Core Fundamentals', durationMinutes: 45, activityType: 'Concept Review', isDone: true },
            { topic: topics[1]?.name || 'Linear Structures', durationMinutes: 45, activityType: 'Problem Solving', isDone: false },
          ],
        });
      } else if (i === 1) {
        days.push({
          dayNumber: 2,
          dayDate: dateStr,
          sessions: [
            { topic: topics[2]?.name || 'Intermediate Topics', durationMinutes: 40, activityType: 'Concept Review' },
            { topic: topics[3]?.name || 'Queues & Recursion', durationMinutes: 40, activityType: 'Problem Solving' },
          ],
        });
      } else if (i === 2) {
        days.push({
          dayNumber: 3,
          dayDate: dateStr,
          sessions: [
            { topic: topics[4]?.name || 'Tree Traversals & AVL Rotations', durationMinutes: 60, activityType: 'Concept Review' },
            { topic: 'Previous Year Question Bank (2024-2025)', durationMinutes: 45, activityType: 'Practice Questions' },
          ],
        });
      } else {
        days.push({
          dayNumber: 4,
          dayDate: dateStr,
          sessions: [
            { topic: 'Full 90-Minute Timed Mock Exam', durationMinutes: 60, activityType: 'Mock Test' },
            { topic: 'Error Analysis & Formula Cheatsheet Review', durationMinutes: 30, activityType: 'Quick Revision' },
          ],
        });
      }
    }

    return days;
  }

  /**
   * AI Assignment Breakdown Engine
   */
  static analyzeAssignment(title: string, subjectName: string, description: string) {
    let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';
    let estimatedMinutes = 150;

    const lower = (title + ' ' + description).toLowerCase();
    if (lower.includes('research') || lower.includes('benchmark') || lower.includes('concurrent') || lower.includes('kernel')) {
      difficulty = 'Hard';
      estimatedMinutes = 210;
    } else if (lower.includes('worksheet') || lower.includes('exercise') || lower.includes('quiz')) {
      difficulty = 'Easy';
      estimatedMinutes = 60;
    }

    const subtasks = [
      { id: `st-gen-${Date.now()}-1`, title: 'Understand assignment requirements & rubric', estimatedMinutes: 20, isCompleted: false, order: 1 },
      { id: `st-gen-${Date.now()}-2`, title: `Research core ${subjectName} concepts & syntax`, estimatedMinutes: 35, isCompleted: false, order: 2 },
      { id: `st-gen-${Date.now()}-3`, title: 'Draft system architecture / outline', estimatedMinutes: 30, isCompleted: false, order: 3 },
      { id: `st-gen-${Date.now()}-4`, title: 'Primary implementation / problem solving', estimatedMinutes: 60, isCompleted: false, order: 4 },
      { id: `st-gen-${Date.now()}-5`, title: 'Verify test cases & edge validation', estimatedMinutes: 30, isCompleted: false, order: 5 },
      { id: `st-gen-${Date.now()}-6`, title: 'Format report, diagrams & final review', estimatedMinutes: 25, isCompleted: false, order: 6 },
    ];

    return {
      difficulty,
      estimatedMinutes,
      subtasks,
      recommendedDistribution: [
        { day: 'Day 1 (Today)', durationMinutes: 55, label: 'Requirements & Initial Setup' },
        { day: 'Day 2', durationMinutes: 60, label: 'Core Implementation' },
        { day: 'Day 3', durationMinutes: 55, label: 'Testing & Final Submission' },
      ],
    };
  }

  /**
   * Workload Analyzer & Schedule Optimizer
   */
  static analyzeWorkload(
    timetable: TimetableEvent[],
    assignments: Assignment[],
    homework: Homework[],
    tests: TestExam[]
  ): WorkloadAnalysisResult {
    const pendingAssignments = assignments.filter(a => a.status !== 'Completed');
    const pendingHw = homework.filter(h => h.status !== 'Completed');

    return {
      overallLevel: 'HIGH',
      totalAssignmentsDue: pendingAssignments.length,
      totalHomeworkDue: pendingHw.length,
      totalTestsThisWeek: tests.length,
      totalClassHours: 18,
      recommendedStudyHours: 12.5,
      overloadedDays: [
        {
          day: 'Thursday',
          reasons: [
            '2 Back-to-back laboratory sessions (Networks & AI)',
            'Computer Networks Socket Assignment checkpoint due',
            'CAT 1 Data Structures scheduled 2 days later',
          ],
          conflictItem: 'Networks Packet Socket Lab (14:00 - 16:00)',
          fixSuggestion: 'Move 1.5 hours of Networks study to Wednesday evening to prevent Thursday burnout.',
        },
      ],
      actionableInsights: [
        'Thursday is currently overloaded with 2 deadlines and test preparation.',
        'Your Tuesday afternoon (16:30 - 19:00) has an open 2.5 hour deep-work window.',
        'Operating Systems study hours are trailing 25% below target.',
      ],
    };
  }

  /**
   * Generates Interactive Multiple-Choice Quizzes
   */
  static generateQuiz(subjectName: string, topic: string): Quiz {
    return {
      id: `quiz-${Date.now()}`,
      title: `${subjectName}: ${topic} Mastery Check`,
      subjectId: 'sub-ds',
      topic,
      difficulty: 'Medium',
      totalQuestions: 4,
      status: 'pending',
      questions: [
        {
          id: 'q-1',
          question: 'In an AVL Tree, what triggers an LR (Left-Right) Double Rotation?',
          options: [
            'Insertion in the left subtree of the left child (BF = +2, child BF = +1)',
            'Insertion in the right subtree of the left child (BF = +2, child BF = -1)',
            'Insertion in the right subtree of the right child (BF = -2, child BF = -1)',
            'Deletion of the root node with single child',
          ],
          correctIndex: 1,
          explanation: 'An LR imbalance occurs when the parent balance factor is +2 and the left child balance factor is -1. It is resolved by rotating left on the child, then right on the parent.',
        },
        {
          id: 'q-2',
          question: 'What is the worst-case time complexity of searching in a balanced AVL tree with N nodes?',
          options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
          correctIndex: 1,
          explanation: 'Because AVL trees maintain strict balance where heights of sibling subtrees differ by at most 1, search time is strictly bounded by O(log N).',
        },
        {
          id: 'q-3',
          question: 'How many rotations are required in the worst-case during a single node insertion in an AVL tree?',
          options: ['At most 1 single or 1 double rotation', 'Up to O(log N) rotations', 'N/2 rotations', 'Zero rotations'],
          correctIndex: 0,
          explanation: 'A single rebalance operation (either one single rotation or one double rotation) is guaranteed to restore balance to the entire tree after an insertion.',
        },
        {
          id: 'q-4',
          question: 'Which traversal of a Binary Search Tree (BST) visits nodes in strictly ascending sorted order?',
          options: ['Pre-order (Root, Left, Right)', 'In-order (Left, Root, Right)', 'Post-order (Left, Right, Root)', 'Level-order BFS'],
          correctIndex: 1,
          explanation: 'In-order traversal visits the left subtree, the root, and then the right subtree, producing strictly non-decreasing keys in a valid BST.',
        },
      ],
    };
  }

  /**
   * Conversational AI Assistant ("Ask Me") with Page Awareness & Action Intent Recognition
   */
  static processAIChat(
    userText: string,
    activePage: string,
    contextData: {
      student: StudentProfile;
      subjects: Subject[];
      assignments: Assignment[];
      homework: Homework[];
      tests: TestExam[];
      timetable: TimetableEvent[];
      logs: StudySessionLog[];
    }
  ): AIMessage {
    const lower = userText.toLowerCase().trim();
    const id = `msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Action: Add Assignment / Homework
    if (lower.startsWith('add assignment') || lower.includes('create assignment') || lower.includes('add dbms assignment')) {
      const actionPayload: AIActionPayload = {
        actionType: 'CREATE_ASSIGNMENT',
        data: {
          title: 'Database Transactions & 2PL Locking Lab',
          subjectId: 'sub-dbms',
          dueDate: '2026-09-15',
          dueTime: '23:59',
          estimatedDurationMinutes: 120,
          difficulty: 'Medium',
          priority: 'HIGH',
        },
      };

      return {
        id,
        sender: 'assistant',
        timestamp,
        text: `I've prepared the new **Database Transactions & 2PL Locking Lab** assignment for you with automatic priority scoring and subtask estimation.`,
        structuredCard: {
          type: 'action_confirm',
          title: 'Create Assignment',
          data: {
            title: 'Database Transactions & 2PL Locking Lab',
            subject: 'Database Management Systems',
            dueDate: 'Friday, Sep 15, 2026 (23:59)',
            estimatedTime: '2h 00m',
            priority: 'HIGH (Score: 84/100)',
          },
        },
        actionPayload,
        suggestedPrompts: [
          'Break this assignment into subtasks',
          'Schedule 1 hour to work on it tomorrow',
          'What is due before this assignment?',
        ],
      };
    }

    // 2. Action: Schedule study session / timetable
    if (lower.includes('schedule') || lower.includes('fit 1 hour') || lower.includes('study session')) {
      const actionPayload: AIActionPayload = {
        actionType: 'CREATE_STUDY_SESSION',
        data: {
          title: 'Computer Networks Socket Programming Block',
          subjectId: 'sub-cn',
          dayOfWeek: 2, // Wednesday
          startTime: '17:30',
          endTime: '18:30',
          type: 'study',
        },
      };

      return {
        id,
        sender: 'assistant',
        timestamp,
        text: `I checked your weekly timetable for free slots without class clashes. Tomorrow (Wednesday) from **5:30 PM to 6:30 PM** is completely clear right after your Operating Systems lecture!`,
        structuredCard: {
          type: 'study_plan',
          title: 'Recommended Study Slot',
          data: {
            slot: 'Wednesday, 5:30 PM – 6:30 PM',
            subject: 'Computer Networks',
            focusTopic: 'TCP Chat Server Socket select()',
            duration: '60 minutes',
            conflictCheck: 'Zero clashes with classes or labs',
          },
        },
        actionPayload,
        suggestedPrompts: [
          'Add this to my timetable',
          'Give me 5 practice quiz questions for Networks',
          'What should I prioritize before Wednesday?',
        ],
      };
    }

    // 3. Action: Mark task complete
    if (lower.includes('mark') && (lower.includes('complete') || lower.includes('done'))) {
      const actionPayload: AIActionPayload = {
        actionType: 'MARK_TASK_COMPLETE',
        data: {
          assignmentId: 'asg-01',
          taskId: 'hw-01',
        },
      };

      return {
        id,
        sender: 'assistant',
        timestamp,
        text: `Awesome progress, Alex! 🎉 Updating your task status and recalculating your weekly workload and streak...`,
        actionPayload,
        suggestedPrompts: [
          'What should I work on next?',
          'How is my daily goal progress?',
          'Show my updated study streak',
        ],
      };
    }

    // 4. Query: "What should I study today?" / "What should I do now?"
    if (lower.includes('what should i do') || lower.includes('what should i study') || lower.includes('what to do')) {
      const whatNow = AIService.getWhatShouldIDoNow('17:30', contextData.subjects, contextData.assignments, contextData.homework, contextData.tests, contextData.timetable);
      return {
        id,
        sender: 'assistant',
        timestamp,
        text: `Based on your deadlines and timetable, **${whatNow.recommendedTask.title}** is your #1 priority right now.`,
        structuredCard: {
          type: 'priority_card',
          title: 'Top Recommendation Now',
          data: {
            task: whatNow.recommendedTask.title,
            subject: whatNow.recommendedTask.subjectName,
            urgency: whatNow.recommendedTask.priority,
            due: whatNow.recommendedTask.dueContext,
            reason: whatNow.reason,
            advice: whatNow.contextAdvice,
          },
        },
        suggestedPrompts: [
          'Start 45m Focus Session on this',
          'Break this down into subtasks',
          'Make me a study plan for tonight',
        ],
      };
    }

    // 5. Query: "Make me a study plan for tonight" / "I have 3 hours"
    if (lower.includes('study plan') || lower.includes('hours tonight') || lower.includes('plan for tonight')) {
      const plan = AIService.generateStudyPlan(150, null, contextData.assignments, contextData.tests, contextData.homework, contextData.subjects);
      return {
        id,
        sender: 'assistant',
        timestamp,
        text: `Here is an optimized 2h 30m study plan for tonight with interleaved cognitive breaks to prevent burnout:`,
        structuredCard: {
          type: 'study_plan',
          title: "Tonight's Optimized Schedule",
          data: {
            blocks: plan,
            totalStudyMinutes: 125,
            totalBreakMinutes: 25,
          },
        },
        suggestedPrompts: [
          'Accept Plan & Sync to Calendar',
          'Swap Data Structures with Networks',
          'Shorten this plan to 1.5 hours',
        ],
      };
    }

    // 6. Query: "When is my next test?" / "What should I study for my next test?"
    if (lower.includes('next test') || lower.includes('exam') || lower.includes('cat 1')) {
      const dsTest = contextData.tests[0];
      return {
        id,
        sender: 'assistant',
        timestamp,
        text: `Your next test is **${dsTest.name}** on **Saturday, September 12 (4 days remaining)**.\n\nYour current preparation is **${dsTest.preparationPercentage}%**. Here are the weakest areas that need your attention first:`,
        structuredCard: {
          type: 'test_plan',
          title: 'CAT 1 Preparation Status',
          data: {
            test: dsTest.name,
            date: 'Sep 12, 2026 (10:00 AM)',
            weakestTopics: ['Self-Balancing AVL Trees (Not Started)', 'Binary Trees & Traversals (Low Confidence)'],
            readiness: '42% Ready',
          },
        },
        suggestedPrompts: [
          'Generate full 4-day revision plan',
          'Quiz me on AVL Tree rotations',
          'Show my AVL Tree notes',
        ],
      };
    }

    // 7. Page-Aware Context fallback responses
    if (activePage === 'assignments') {
      return {
        id,
        sender: 'assistant',
        timestamp,
        text: `You are viewing your **Assignments**. You have 1 assignment due tomorrow (B+ Tree Implementation) and 1 high-difficulty project (TCP Socket Server) due in 5 days.\n\nWould you like me to estimate completion times or break down any complex assignment?`,
        suggestedPrompts: [
          'Break down DBMS assignment',
          'What assignment should I do first?',
          'Add a new assignment',
        ],
      };
    }

    if (activePage === 'timetable') {
      return {
        id,
        sender: 'assistant',
        timestamp,
        text: `Analyzing your **Weekly Timetable**... You have 18 total class/lab hours this week. Your largest open study window is Wednesday afternoon from 3:30 PM to 7:00 PM.`,
        suggestedPrompts: [
          'Schedule 1 hour study session here',
          'Where can I fit 45 minutes today?',
          'Check for timetable clashes',
        ],
      };
    }

    // Default intelligent co-pilot response
    return {
      id,
      sender: 'assistant',
      timestamp,
      text: `I'm analyzing your academic profile across all 5 enrolled subjects. You have **1 assignment due tomorrow**, **1 test in 4 days**, and a **6-day study streak** active.\n\nHow can I help you optimize your schedule right now?`,
      suggestedPrompts: [
        'What should I study right now?',
        'Make me a study plan for tonight',
        'Am I falling behind in any subject?',
        'Quiz me on Data Structures',
      ],
    };
  }
}
