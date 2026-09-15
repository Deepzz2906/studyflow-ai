import { AgentActionLogEntry, AgentRole } from '../../../types/agent';

const ACTION_LOGS_KEY = 'studyflow_agent_action_logs_v1';

export class ActionLogger {
  private static logs: AgentActionLogEntry[] = ActionLogger.loadLogs();

  private static loadLogs(): AgentActionLogEntry[] {
    try {
      const saved = localStorage.getItem(ACTION_LOGS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read agent action logs from storage:', e);
    }
    
    // Initial sample logs
    return [
      {
        id: 'log-act-1',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        agentRole: 'AcademicPlannerAgent',
        actionType: 'GENERATE_STUDY_PLAN',
        targetSubject: 'Database Management Systems',
        status: 'SUCCESS',
        description: 'Generated 2.5h balanced study schedule with Pomodoro breaks.',
        payload: { availableMinutes: 150, targetSubject: 'sub-dbms' },
        resultSummary: '3 study blocks + 2 cognitive rest intervals scheduled.',
      },
      {
        id: 'log-act-2',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        agentRole: 'ExamPreparationAgent',
        actionType: 'GENERATE_TEST_PLAN',
        targetSubject: 'Data Structures & Algorithms',
        status: 'SUCCESS',
        description: 'Created 4-day syllabus revision breakdown for CAT 1 exam.',
        payload: { testId: 'test-ds-cat1', daysRemaining: 4 },
        resultSummary: 'Prioritized AVL Trees (Low Confidence) on Day 3.',
      },
    ];
  }

  static logAction(
    agentRole: AgentRole,
    actionType: string,
    description: string,
    payload: Record<string, any>,
    status: 'SUCCESS' | 'FAILED' | 'CONFIRMATION_REQUIRED' | 'CANCELLED' = 'SUCCESS',
    targetSubject?: string,
    resultSummary?: string
  ): AgentActionLogEntry {
    const entry: AgentActionLogEntry = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      agentRole,
      actionType,
      targetSubject,
      status,
      description,
      payload,
      resultSummary,
    };

    ActionLogger.logs = [entry, ...ActionLogger.logs.slice(0, 49)]; // keep latest 50 entries
    try {
      localStorage.setItem(ACTION_LOGS_KEY, JSON.stringify(ActionLogger.logs));
    } catch (e) {}

    return entry;
  }

  static getLogs(): AgentActionLogEntry[] {
    return ActionLogger.logs;
  }

  static clearLogs(): void {
    ActionLogger.logs = [];
    localStorage.removeItem(ACTION_LOGS_KEY);
  }
}
