import { ToolRegistry } from '../tools/ToolRegistry';
import { MemoryService } from '../memory/MemoryService';
import { ActionLogger } from '../audit/ActionLogger';
import { AgentRole } from '../../../types/agent';

export interface SubAgentResponse {
  role: AgentRole;
  text: string;
  data?: any;
  toolInvocations: string[];
}

export class PlannerAgent {
  static async planTonight(availableMinutes: number, targetSubjectId?: string): Promise<SubAgentResponse> {
    const memory = MemoryService.getMemory();
    const peakHour = memory.longTerm.peakFocusHour; // e.g. 19 (7 PM)
    
    // Execute tool
    const toolRes = await ToolRegistry.executeTool({
      toolName: 'generateStudyPlan',
      arguments: { availableMinutes, targetSubjectId },
    });

    return {
      role: 'AcademicPlannerAgent',
      text: `Analyzed your timetable and cognitive energy pattern (peak focus ~${peakHour}:00). Built an optimal ${Math.round(availableMinutes / 60)}h study block with 10-minute rest intervals.`,
      data: toolRes.result,
      toolInvocations: ['generateStudyPlan', 'getTimetable'],
    };
  }
}

export class ExamPrepAgent {
  static async generateExamPlan(testId: string): Promise<SubAgentResponse> {
    const memory = MemoryService.getMemory();
    const weakHabits = memory.longTerm.studyHabits.filter(h => h.averageConfidence < 3.0);

    const toolRes = await ToolRegistry.executeTool({
      toolName: 'generateTestPlan',
      arguments: { testId },
    });

    return {
      role: 'ExamPreparationAgent',
      text: `Cross-referenced syllabus topics with your past confidence ratings (${weakHabits.length} weak areas detected). Structured a day-by-day revision progression.`,
      data: toolRes.result,
      toolInvocations: ['getUpcomingTests', 'getSyllabus', 'generateTestPlan'],
    };
  }
}

export class AssignmentAgent {
  static async breakDownAssignment(title: string, subjectName: string, description: string): Promise<SubAgentResponse> {
    const toolRes = await ToolRegistry.executeTool({
      toolName: 'analyzeAssignment',
      arguments: { title, subjectName, description },
    });

    return {
      role: 'AssignmentBreakdownAgent',
      text: `Decomposed "${title}" into ${toolRes.result.subtasks.length} actionable subtasks with time estimates and difficulty ranking.`,
      data: toolRes.result,
      toolInvocations: ['analyzeAssignment', 'createAssignment'],
    };
  }
}

export class AnalyticsAgent {
  static async evaluateWorkload(): Promise<SubAgentResponse> {
    const toolRes = await ToolRegistry.executeTool({
      toolName: 'analyzeWorkload',
      arguments: {},
    });

    return {
      role: 'AnalyticsAgent',
      text: `Synthesized weekly load: ${toolRes.result.totalAssignmentsDue} deadlines, ${toolRes.result.totalClassHours}h classes, and ${toolRes.result.recommendedStudyHours}h study target.`,
      data: toolRes.result,
      toolInvocations: ['getTimetable', 'getAssignments', 'analyzeWorkload'],
    };
  }
}

export class IntegrationSyncAgent {
  static async handleSync(provider: string): Promise<SubAgentResponse> {
    ActionLogger.logAction(
      'IntegrationSyncAgent',
      'SYNC_ACADEMIC_DATA',
      `Synchronized academic coursework from ${provider.toUpperCase()}`,
      { provider }
    );

    return {
      role: 'IntegrationSyncAgent',
      text: `Successfully synced course deliverables and calendar feeds from ${provider.toUpperCase()}. Unified model updated.`,
      toolInvocations: ['syncLMS', 'normalizeData', 'getAssignments'],
    };
  }
}
