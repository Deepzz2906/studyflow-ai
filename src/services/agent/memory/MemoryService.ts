import { AgentMemory, AgentMemoryShortTerm, AgentMemoryLongTerm, StudentStudyHabit } from '../../../types/agent';
import { StudentProfile, StudySessionLog, Subject } from '../../../types';

const SHORT_TERM_KEY = 'studyflow_agent_memory_short_term';
const LONG_TERM_KEY = 'studyflow_agent_memory_long_term';

export class MemoryService {
  private static shortTerm: AgentMemoryShortTerm = MemoryService.loadShortTerm();
  private static longTerm: AgentMemoryLongTerm = MemoryService.loadLongTerm();

  private static loadShortTerm(): AgentMemoryShortTerm {
    try {
      const saved = localStorage.getItem(SHORT_TERM_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return {
      currentConversationId: `conv-${Date.now()}`,
      activePage: 'dashboard',
      recentUserIntents: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  private static loadLongTerm(): AgentMemoryLongTerm {
    try {
      const saved = localStorage.getItem(LONG_TERM_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return {
      studentId: 'student-alex-01',
      preferredStudyTime: 'evening',
      preferredSessionDurationMinutes: 45,
      peakFocusHour: 19, // 7:00 PM
      habitualSessionCompletionRate: 94,
      weakSubjectIds: ['sub-os', 'sub-cn'],
      strongSubjectIds: ['sub-ai', 'sub-ds'],
      studyHabits: [
        {
          topic: 'Self-Balancing AVL Trees',
          subjectId: 'sub-ds',
          averageConfidence: 2.2,
          totalMinutesLogged: 45,
          lastStudiedDate: '2026-09-06',
          struggledConcepts: ['RL Double Rotation', 'Balance Factor Calculation'],
        },
        {
          topic: 'B+ Tree Indexing',
          subjectId: 'sub-dbms',
          averageConfidence: 4.0,
          totalMinutesLogged: 120,
          lastStudiedDate: '2026-09-07',
          struggledConcepts: [],
        },
      ],
      missedDeadlinesCount: 0,
      recurringBehaviorPatterns: [
        'Prefers 45-minute focus cycles over 90-minute blocks',
        'Highest cognitive energy between 18:30 and 21:30',
        'Consistently completes homework when scheduled before dinner',
      ],
    };
  }

  // Short Term Memory Updates
  static updateActivePage(page: string, activeTaskContext?: AgentMemoryShortTerm['activeTaskContext']) {
    MemoryService.shortTerm.activePage = page;
    MemoryService.shortTerm.activeTaskContext = activeTaskContext;
    MemoryService.shortTerm.lastUpdated = new Date().toISOString();
    MemoryService.persistShortTerm();
  }

  static recordUserIntent(intent: string) {
    MemoryService.shortTerm.recentUserIntents = [
      intent,
      ...MemoryService.shortTerm.recentUserIntents.slice(0, 9),
    ];
    MemoryService.shortTerm.lastUpdated = new Date().toISOString();
    MemoryService.persistShortTerm();
  }

  static recordLastAction(actionName: string) {
    MemoryService.shortTerm.lastActionExecuted = actionName;
    MemoryService.shortTerm.lastUpdated = new Date().toISOString();
    MemoryService.persistShortTerm();
  }

  // Long Term Memory Learning Loop
  static learnFromSession(log: StudySessionLog) {
    const existingIndex = MemoryService.longTerm.studyHabits.findIndex(
      h => h.topic.toLowerCase() === log.topic.toLowerCase()
    );

    if (existingIndex >= 0) {
      const existing = MemoryService.longTerm.studyHabits[existingIndex];
      const newConfidence = Number(((existing.averageConfidence * 2 + log.confidenceRating) / 3).toFixed(1));
      MemoryService.longTerm.studyHabits[existingIndex] = {
        ...existing,
        averageConfidence: newConfidence,
        totalMinutesLogged: existing.totalMinutesLogged + log.actualMinutes,
        lastStudiedDate: log.date,
      };
    } else {
      MemoryService.longTerm.studyHabits.push({
        topic: log.topic,
        subjectId: log.subjectId,
        averageConfidence: log.confidenceRating,
        totalMinutesLogged: log.actualMinutes,
        lastStudiedDate: log.date,
        struggledConcepts: log.confidenceRating <= 2 ? [log.topic] : [],
      });
    }

    // Adapt preference if low confidence
    if (log.confidenceRating <= 2 && !MemoryService.longTerm.weakSubjectIds.includes(log.subjectId)) {
      MemoryService.longTerm.weakSubjectIds.push(log.subjectId);
    }

    MemoryService.persistLongTerm();
  }

  static syncWithStudentProfile(student: StudentProfile, subjects: Subject[]) {
    MemoryService.longTerm.studentId = student.id;
    MemoryService.longTerm.preferredStudyTime = student.preferredStudyTime;
    MemoryService.longTerm.preferredSessionDurationMinutes = student.sessionDurationPreference;

    // Identify weak subjects based on confidence score < 3.5
    MemoryService.longTerm.weakSubjectIds = subjects
      .filter(s => s.confidenceScore < 3.5)
      .map(s => s.id);
    MemoryService.longTerm.strongSubjectIds = subjects
      .filter(s => s.confidenceScore >= 4.0)
      .map(s => s.id);

    MemoryService.persistLongTerm();
  }

  static getMemory(): AgentMemory {
    return {
      shortTerm: MemoryService.shortTerm,
      longTerm: MemoryService.longTerm,
    };
  }

  private static persistShortTerm() {
    try {
      localStorage.setItem(SHORT_TERM_KEY, JSON.stringify(MemoryService.shortTerm));
    } catch (e) {}
  }

  private static persistLongTerm() {
    try {
      localStorage.setItem(LONG_TERM_KEY, JSON.stringify(MemoryService.longTerm));
    } catch (e) {}
  }
}
