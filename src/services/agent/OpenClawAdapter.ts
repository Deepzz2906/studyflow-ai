import { ToolCallRequest, ToolCallResponse, AgentRole, AgentMemory } from '../../types/agent';
import { MemoryService } from './memory/MemoryService';
import { ToolRegistry } from './tools/ToolRegistry';
import { ActionLogger } from './audit/ActionLogger';
import {
  PlannerAgent,
  ExamPrepAgent,
  AssignmentAgent,
  AnalyticsAgent,
  IntegrationSyncAgent,
} from './subagents/SubAgents';
import { AIMessage, AIActionPayload } from '../../types';

export interface OpenClawAgentResponse {
  message: AIMessage;
  delegatedAgent?: AgentRole;
  toolInvocations: string[];
  memoryUpdated: boolean;
}

export interface IOpenClawService {
  chat(userMessage: string, activePage: string, contextData: any): Promise<OpenClawAgentResponse>;
  executeTool(toolCall: ToolCallRequest): Promise<ToolCallResponse>;
  getMemory(): AgentMemory;
  delegateTask(role: AgentRole, payload: any): Promise<any>;
}

export class MockOpenClawService implements IOpenClawService {
  async chat(userMessage: string, activePage: string, _contextData: any): Promise<OpenClawAgentResponse> {
    const lower = userMessage.toLowerCase().trim();
    const id = `msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Record short term intent
    MemoryService.recordUserIntent(userMessage);
    MemoryService.updateActivePage(activePage);

    // 1. Delegation: Planning Agent
    if (lower.includes('study plan') || lower.includes('hours tonight') || lower.includes('plan for tonight')) {
      const planRes = await PlannerAgent.planTonight(150);
      const actionPayload: AIActionPayload = {
        actionType: 'CREATE_STUDY_SESSION',
        data: {
          title: 'Tonight\'s Focus Block',
          dayOfWeek: 1,
          startTime: '18:00',
          endTime: '20:30',
        },
      };

      return {
        delegatedAgent: 'AcademicPlannerAgent',
        toolInvocations: planRes.toolInvocations,
        memoryUpdated: true,
        message: {
          id,
          sender: 'assistant',
          timestamp,
          text: `[Academic Planner Agent]\n\n${planRes.text}`,
          structuredCard: {
            type: 'study_plan',
            title: "Tonight's Optimized Schedule",
            data: {
              blocks: planRes.data,
              totalStudyMinutes: 125,
              totalBreakMinutes: 25,
            },
          },
          actionPayload,
          suggestedPrompts: [
            'Accept Plan & Sync to Timetable',
            'Swap Data Structures with Networks',
            'Make a 1-hour quick session instead',
          ],
        },
      };
    }

    // 2. Delegation: Exam Prep Agent
    if (lower.includes('next test') || lower.includes('exam') || lower.includes('cat 1')) {
      const examRes = await ExamPrepAgent.generateExamPlan('test-ds-cat1');
      return {
        delegatedAgent: 'ExamPreparationAgent',
        toolInvocations: examRes.toolInvocations,
        memoryUpdated: true,
        message: {
          id,
          sender: 'assistant',
          timestamp,
          text: `[Exam Preparation Agent]\n\n${examRes.text}`,
          structuredCard: {
            type: 'test_plan',
            title: 'CAT 1 Preparation Status',
            data: {
              test: 'Data Structures CAT 1 (In 4 Days)',
              date: 'Sep 12, 2026 (10:00 AM)',
              weakestTopics: ['Self-Balancing AVL Trees (Not Started)', 'BST Node Deletion (Low Confidence)'],
              readiness: '42% Prepared',
            },
          },
          suggestedPrompts: [
            'Generate full 4-day revision plan',
            'Quiz me on AVL Trees',
            'Show my AVL Tree notes',
          ],
        },
      };
    }

    // 3. Delegation: Assignment Breakdown Agent
    if (lower.includes('break') && lower.includes('assignment')) {
      const asgRes = await AssignmentAgent.breakDownAssignment(
        'B+ Tree & Indexing Implementation and Benchmark',
        'Database Management Systems',
        'In-memory B+ Tree with node splitting, merging, and range queries.'
      );

      return {
        delegatedAgent: 'AssignmentBreakdownAgent',
        toolInvocations: asgRes.toolInvocations,
        memoryUpdated: true,
        message: {
          id,
          sender: 'assistant',
          timestamp,
          text: `[Assignment Breakdown Agent]\n\n${asgRes.text}`,
          structuredCard: {
            type: 'assignment_breakdown',
            title: 'Subtask Implementation Plan',
            data: {
              subtasks: asgRes.data.subtasks,
              difficulty: asgRes.data.difficulty,
              estimatedTime: `${Math.round(asgRes.data.estimatedMinutes / 60)}h ${asgRes.data.estimatedMinutes % 60}m`,
            },
          },
          suggestedPrompts: [
            'Schedule 45m for subtask 1 today',
            'What is due before this assignment?',
          ],
        },
      };
    }

    // 4. Action Command: "Schedule 1 hour of DBMS tomorrow"
    if (lower.includes('schedule') || lower.includes('fit 1 hour') || lower.includes('study session')) {
      const actionPayload: AIActionPayload = {
        actionType: 'CREATE_STUDY_SESSION',
        data: {
          title: 'Database Management Systems Revision',
          subjectId: 'sub-dbms',
          dayOfWeek: 2, // Wednesday
          startTime: '17:30',
          endTime: '18:30',
          type: 'study',
        },
      };

      return {
        delegatedAgent: 'AcademicPlannerAgent',
        toolInvocations: ['getTimetable', 'createStudySession'],
        memoryUpdated: true,
        message: {
          id,
          sender: 'assistant',
          timestamp,
          text: `[OpenClaw Runtime] Checked your weekly timetable for free windows without lecture clashes. Tomorrow (Wednesday) from **5:30 PM to 6:30 PM** is completely clear right after your Operating Systems lecture!`,
          structuredCard: {
            type: 'study_plan',
            title: 'Recommended Study Slot',
            data: {
              slot: 'Wednesday, 5:30 PM – 6:30 PM',
              subject: 'Database Management Systems',
              focusTopic: 'B+ Tree Splitting & Insertion Logic',
              duration: '60 minutes',
              conflictCheck: 'Zero clashes with classes or labs',
            },
          },
          actionPayload,
          suggestedPrompts: [
            'Confirm & Add to Timetable',
            'Give me 5 quiz questions on DBMS',
            'What should I prioritize before Wednesday?',
          ],
        },
      };
    }

    // 5. Action Command: "Add DBMS assignment due Friday"
    if (lower.includes('add assignment') || lower.includes('create assignment')) {
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
        delegatedAgent: 'AssignmentBreakdownAgent',
        toolInvocations: ['createAssignment', 'analyzeAssignment'],
        memoryUpdated: true,
        message: {
          id,
          sender: 'assistant',
          timestamp,
          text: `[OpenClaw Agent] Formatted new assignment with automatic priority scoring and 3 initial subtasks.`,
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
            'Confirm & Save Assignment',
            'Break this assignment into subtasks',
            'Schedule 1 hour for it tomorrow',
          ],
        },
      };
    }

    // 6. Action Command: "Mark task complete"
    if (lower.includes('mark') && (lower.includes('complete') || lower.includes('done'))) {
      const actionPayload: AIActionPayload = {
        actionType: 'MARK_TASK_COMPLETE',
        data: { assignmentId: 'asg-01' },
      };

      return {
        delegatedAgent: 'MainCoordinator',
        toolInvocations: ['completeAssignment'],
        memoryUpdated: true,
        message: {
          id,
          sender: 'assistant',
          timestamp,
          text: `[OpenClaw Agent] Awesome progress, Alex! 🎉 Updating your task status, logging study streak, and updating your weekly goals.`,
          actionPayload,
          suggestedPrompts: [
            'What should I work on next?',
            'How is my daily goal progress?',
            'Show my updated study streak',
          ],
        },
      };
    }

    // Default Intelligence response
    const whatNowRes = await ToolRegistry.executeTool({
      toolName: 'recommendNextTask',
      arguments: { currentTime: '17:30' },
    });
    const whatNow = whatNowRes.result;

    return {
      delegatedAgent: 'MainCoordinator',
      toolInvocations: ['recommendNextTask', 'getUpcomingAssignments', 'getTimetable'],
      memoryUpdated: false,
      message: {
        id,
        sender: 'assistant',
        timestamp,
        text: `Based on your academic profile and timetable, your #1 priority right now is **${whatNow.recommendedTask.title}**.`,
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
      },
    };
  }

  async executeTool(toolCall: ToolCallRequest): Promise<ToolCallResponse> {
    return ToolRegistry.executeTool(toolCall);
  }

  getMemory(): AgentMemory {
    return MemoryService.getMemory();
  }

  async delegateTask(role: AgentRole, payload: any): Promise<any> {
    switch (role) {
      case 'AcademicPlannerAgent':
        return PlannerAgent.planTonight(payload.availableMinutes || 150);
      case 'ExamPreparationAgent':
        return ExamPrepAgent.generateExamPlan(payload.testId || 'test-ds-cat1');
      case 'AssignmentBreakdownAgent':
        return AssignmentAgent.breakDownAssignment(payload.title, payload.subjectName, payload.description);
      case 'AnalyticsAgent':
        return AnalyticsAgent.evaluateWorkload();
      case 'IntegrationSyncAgent':
        return IntegrationSyncAgent.handleSync(payload.provider || 'lms');
      default:
        return { success: true, message: 'Main coordinator processed task.' };
    }
  }
}

export class RealOpenClawService implements IOpenClawService {
  private apiUrl: string;
  private apiKey: string;
  private fallbackService: MockOpenClawService;

  constructor(apiUrl?: string, apiKey?: string) {
    this.apiUrl = apiUrl || import.meta.env.VITE_OPENCLAW_URL || 'http://localhost:8000/api/v1/agent';
    this.apiKey = apiKey || import.meta.env.VITE_OPENCLAW_API_KEY || '';
    this.fallbackService = new MockOpenClawService();
  }

  async chat(userMessage: string, activePage: string, contextData: any): Promise<OpenClawAgentResponse> {
    // If no API key is provided, gracefully fallback to mock agent
    if (!this.apiKey) {
      return this.fallbackService.chat(userMessage, activePage, contextData);
    }

    try {
      const response = await fetch(`${this.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          message: userMessage,
          activePage,
          memory: MemoryService.getMemory(),
        }),
      });

      if (!response.ok) throw new Error(`OpenClaw API responded with status ${response.status}`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn('OpenClaw API unavailable, falling back to local agent runtime:', err);
      return this.fallbackService.chat(userMessage, activePage, contextData);
    }
  }

  async executeTool(toolCall: ToolCallRequest): Promise<ToolCallResponse> {
    return ToolRegistry.executeTool(toolCall);
  }

  getMemory(): AgentMemory {
    return MemoryService.getMemory();
  }

  async delegateTask(role: AgentRole, payload: any): Promise<any> {
    return this.fallbackService.delegateTask(role, payload);
  }
}

export class OpenClawAdapter {
  private static service: IOpenClawService = new RealOpenClawService();

  static getService(): IOpenClawService {
    return OpenClawAdapter.service;
  }

  static setCustomConfig(apiKey?: string, apiUrl?: string) {
    OpenClawAdapter.service = new RealOpenClawService(apiUrl, apiKey);
  }
}
