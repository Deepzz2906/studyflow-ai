import { Assignment, Homework, TestExam, Subject, TimetableEvent, StudySessionLog, Note } from './index';

export type AgentRole = 
  | 'MainCoordinator'
  | 'AcademicPlannerAgent'
  | 'ExamPreparationAgent'
  | 'AssignmentBreakdownAgent'
  | 'AnalyticsAgent'
  | 'ReminderAgent'
  | 'IntegrationSyncAgent';

export interface AgentMemoryShortTerm {
  currentConversationId: string;
  activePage: string;
  activeTaskContext?: {
    id: string;
    type: 'assignment' | 'homework' | 'test' | 'subject';
    title: string;
  };
  recentUserIntents: string[];
  lastActionExecuted?: string;
  lastUpdated: string;
}

export interface StudentStudyHabit {
  topic: string;
  subjectId: string;
  averageConfidence: number; // 1-5
  totalMinutesLogged: number;
  lastStudiedDate: string;
  struggledConcepts: string[];
}

export interface AgentMemoryLongTerm {
  studentId: string;
  preferredStudyTime: 'morning' | 'afternoon' | 'evening' | 'night';
  preferredSessionDurationMinutes: number; // e.g., 45
  peakFocusHour: number; // e.g. 19 (7 PM)
  habitualSessionCompletionRate: number; // 0-100%
  weakSubjectIds: string[];
  strongSubjectIds: string[];
  studyHabits: StudentStudyHabit[];
  missedDeadlinesCount: number;
  recurringBehaviorPatterns: string[];
}

export interface AgentMemory {
  shortTerm: AgentMemoryShortTerm;
  longTerm: AgentMemoryLongTerm;
}

export interface ToolCallRequest {
  toolName: string;
  arguments: Record<string, any>;
  callId?: string;
}

export interface ToolCallResponse {
  toolName: string;
  success: boolean;
  result?: any;
  error?: string;
}

export interface AgentActionLogEntry {
  id: string;
  timestamp: string;
  agentRole: AgentRole;
  actionType: string;
  targetSubject?: string;
  status: 'SUCCESS' | 'FAILED' | 'CONFIRMATION_REQUIRED' | 'CANCELLED';
  description: string;
  payload: Record<string, any>;
  resultSummary?: string;
}

export type IntegrationProvider = 'lms' | 'teams' | 'google_calendar' | 'college_portal';

export interface AcademicIntegrationStatus {
  id: IntegrationProvider;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSyncedAt?: string;
  autoSyncEnabled: boolean;
  endpointUrl?: string;
  itemCount: {
    assignments: number;
    announcements: number;
    calendarEvents: number;
  };
  errorDetails?: string;
}

export interface NormalizedExternalItem {
  id: string;
  sourceProvider: IntegrationProvider;
  sourceId: string;
  title: string;
  description: string;
  subjectCode: string;
  subjectName: string;
  itemType: 'assignment' | 'announcement' | 'test' | 'lecture';
  dueDate?: string;
  dueTime?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  estimatedMinutes?: number;
  submissionUrl?: string;
  syncedAt: string;
}

export interface OpenClawAgentConfig {
  apiUrl?: string;
  apiKey?: string;
  modelProvider?: string;
  modelName?: string;
  isMockMode: boolean;
}
