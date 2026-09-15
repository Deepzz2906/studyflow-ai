import { ToolCallRequest, ToolCallResponse } from '../../../types/agent';
import { ActionLogger } from '../audit/ActionLogger';
import { MemoryService } from '../memory/MemoryService';
import { AIService } from '../../ai/AIService';
import {
  Assignment,
  Homework,
  TestExam,
  Subject,
  TimetableEvent,
  StudySessionLog,
  Note,
  StudentProfile,
  DailyGoal,
} from '../../../types';

export interface AcademicContextData {
  student: StudentProfile;
  subjects: Subject[];
  assignments: Assignment[];
  homework: Homework[];
  tests: TestExam[];
  timetable: TimetableEvent[];
  studyLogs: StudySessionLog[];
  notes: Note[];
  dailyGoal: DailyGoal;
  // State Mutators
  mutators: {
    addAssignment: (a: any) => void;
    updateAssignment: (id: string, a: any) => void;
    addHomework: (h: any) => void;
    updateHomework: (id: string, h: any) => void;
    addTest: (t: any) => void;
    addTimetableEvent: (e: any) => void;
    updateTimetableEvent: (id: string, e: any) => void;
    deleteTimetableEvent: (id: string) => void;
    logStudySession: (s: any) => void;
  };
}

export class ToolRegistry {
  private static contextData: AcademicContextData | null = null;

  static setContext(context: AcademicContextData) {
    ToolRegistry.contextData = context;
  }

  static async executeTool(toolCall: ToolCallRequest): Promise<ToolCallResponse> {
    const { toolName, arguments: args } = toolCall;
    const ctx = ToolRegistry.contextData;

    if (!ctx) {
      return {
        toolName,
        success: false,
        result: null,
        error: 'Tool execution failed: AcademicContext is not initialized.',
      };
    }

    try {
      switch (toolName) {
        // ================= READ TOOLS =================
        case 'getAssignments': {
          const filter = args?.status;
          const res = filter
            ? ctx.assignments.filter(a => a.status === filter)
            : ctx.assignments;
          return { toolName, success: true, result: res };
        }

        case 'getUpcomingAssignments': {
          const res = ctx.assignments.filter(a => a.status !== 'Completed' && a.status !== 'Submitted');
          return { toolName, success: true, result: res };
        }

        case 'getHomework': {
          return { toolName, success: true, result: ctx.homework };
        }

        case 'getUpcomingTests': {
          return { toolName, success: true, result: ctx.tests };
        }

        case 'getSubjects': {
          return { toolName, success: true, result: ctx.subjects };
        }

        case 'getTimetable': {
          const day = args?.dayOfWeek;
          const res = day !== undefined ? ctx.timetable.filter(e => e.dayOfWeek === day) : ctx.timetable;
          return { toolName, success: true, result: res };
        }

        case 'getStudySessions': {
          return { toolName, success: true, result: ctx.studyLogs };
        }

        case 'getNotes': {
          return { toolName, success: true, result: ctx.notes };
        }

        case 'getProgress': {
          return {
            toolName,
            success: true,
            result: {
              completedAssignments: ctx.assignments.filter(a => a.status === 'Completed').length,
              completedHomework: ctx.homework.filter(h => h.status === 'Completed').length,
              totalStudyHours: ctx.subjects.reduce((a, s) => a + s.studyHoursLogged, 0),
              gpa: ctx.student.currentGpa,
            },
          };
        }

        // ================= ACTION TOOLS =================
        case 'createAssignment': {
          const newAsg = {
            title: args.title || 'New Course Assignment',
            subjectId: args.subjectId || ctx.subjects[0]?.id || 'sub-dbms',
            description: args.description || 'Deliverable created by OpenClaw Agent.',
            teacher: args.teacher || 'Faculty',
            dueDate: args.dueDate || '2026-09-15',
            dueTime: args.dueTime || '23:59',
            estimatedDurationMinutes: args.estimatedDurationMinutes || 120,
            difficulty: args.difficulty || 'Medium',
            priority: args.priority || 'HIGH',
            status: 'Not Started' as const,
            subtasks: args.subtasks || [
              { id: `st-${Date.now()}-1`, title: 'Review specifications', estimatedMinutes: 25, isCompleted: false, order: 1 },
              { id: `st-${Date.now()}-2`, title: 'Implementation & tests', estimatedMinutes: 60, isCompleted: false, order: 2 },
              { id: `st-${Date.now()}-3`, title: 'Final write-up & submit', estimatedMinutes: 35, isCompleted: false, order: 3 },
            ],
          };
          ctx.mutators.addAssignment(newAsg);
          ActionLogger.logAction(
            'AssignmentBreakdownAgent',
            'CREATE_ASSIGNMENT',
            `Created assignment: ${newAsg.title}`,
            newAsg,
            'SUCCESS',
            newAsg.subjectId
          );
          MemoryService.recordLastAction(`Created assignment ${newAsg.title}`);
          return { toolName, success: true, result: newAsg };
        }

        case 'completeAssignment': {
          const asgId = args.assignmentId || ctx.assignments[0]?.id;
          if (asgId) {
            ctx.mutators.updateAssignment(asgId, { status: 'Completed' });
            ActionLogger.logAction(
              'MainCoordinator',
              'COMPLETE_ASSIGNMENT',
              `Marked assignment complete: ID ${asgId}`,
              { assignmentId: asgId },
              'SUCCESS'
            );
            return { toolName, success: true, result: { assignmentId: asgId, status: 'Completed' } };
          }
          return { toolName, success: false, error: 'Assignment not found' };
        }

        case 'createHomework': {
          const newHw = {
            title: args.title || 'Daily Practice Problem Set',
            subjectId: args.subjectId || ctx.subjects[0]?.id,
            dueDate: args.dueDate || '2026-09-10',
            estimatedMinutes: args.estimatedMinutes || 30,
            priority: args.priority || 'HIGH',
            status: 'Not Started' as const,
            notes: args.notes || 'Auto-generated homework item',
          };
          ctx.mutators.addHomework(newHw);
          ActionLogger.logAction(
            'MainCoordinator',
            'CREATE_HOMEWORK',
            `Created homework: ${newHw.title}`,
            newHw,
            'SUCCESS'
          );
          return { toolName, success: true, result: newHw };
        }

        case 'createStudySession': {
          const newSession = {
            title: args.title || 'AI Scheduled Study Session',
            subjectId: args.subjectId || ctx.subjects[0]?.id,
            type: 'study' as const,
            dayOfWeek: args.dayOfWeek ?? 1,
            startTime: args.startTime || '18:00',
            endTime: args.endTime || '19:00',
            room: args.room || 'Study Desk / Quiet Area',
            isRecurring: false,
          };
          ctx.mutators.addTimetableEvent(newSession);
          ActionLogger.logAction(
            'AcademicPlannerAgent',
            'CREATE_STUDY_SESSION',
            `Scheduled study session: ${newSession.title} at ${newSession.startTime}`,
            newSession,
            'SUCCESS',
            newSession.subjectId
          );
          MemoryService.recordLastAction(`Scheduled study block for ${newSession.title}`);
          return { toolName, success: true, result: newSession };
        }

        case 'moveStudySession': {
          const { sessionId, newDayOfWeek, newStartTime, newEndTime } = args;
          ctx.mutators.updateTimetableEvent(sessionId, {
            dayOfWeek: newDayOfWeek,
            startTime: newStartTime,
            endTime: newEndTime,
          });
          ActionLogger.logAction(
            'AcademicPlannerAgent',
            'MOVE_STUDY_SESSION',
            `Moved study session ID ${sessionId} to Day ${newDayOfWeek}`,
            args,
            'SUCCESS'
          );
          return { toolName, success: true, result: { sessionId, newDayOfWeek, newStartTime } };
        }

        // ================= AI REASONING TOOLS =================
        case 'generateStudyPlan': {
          const availableMinutes = args.availableMinutes || 150;
          const plan = AIService.generateStudyPlan(
            availableMinutes,
            args.targetSubjectId || null,
            ctx.assignments,
            ctx.tests,
            ctx.homework,
            ctx.subjects
          );
          ActionLogger.logAction(
            'AcademicPlannerAgent',
            'GENERATE_STUDY_PLAN',
            `Generated ${availableMinutes}m study schedule`,
            { availableMinutes, blocksCount: plan.length }
          );
          return { toolName, success: true, result: plan };
        }

        case 'generateTestPlan': {
          const test = ctx.tests.find(t => t.id === args.testId) || ctx.tests[0];
          const plan = AIService.generateTestPrepPlan(test);
          ActionLogger.logAction(
            'ExamPreparationAgent',
            'GENERATE_TEST_PLAN',
            `Generated test plan for ${test.name}`,
            { testName: test.name, daysCount: plan.length }
          );
          return { toolName, success: true, result: plan };
        }

        case 'analyzeAssignment': {
          const breakdown = AIService.analyzeAssignment(
            args.title || 'Course Project',
            args.subjectName || 'Computer Science',
            args.description || ''
          );
          return { toolName, success: true, result: breakdown };
        }

        case 'analyzeWorkload': {
          const analysis = AIService.analyzeWorkload(
            ctx.timetable,
            ctx.assignments,
            ctx.homework,
            ctx.tests
          );
          return { toolName, success: true, result: analysis };
        }

        case 'recommendNextTask': {
          const recommendation = AIService.getWhatShouldIDoNow(
            args.currentTime || '17:30',
            ctx.subjects,
            ctx.assignments,
            ctx.homework,
            ctx.tests,
            ctx.timetable
          );
          return { toolName, success: true, result: recommendation };
        }

        case 'generateQuiz': {
          const quiz = AIService.generateQuiz(
            args.subjectName || 'Data Structures',
            args.topic || 'Core Concept Assessment'
          );
          return { toolName, success: true, result: quiz };
        }

        default:
          return {
            toolName,
            success: false,
            error: `Unknown tool "${toolName}". Available tools: getAssignments, getUpcomingTests, createAssignment, createStudySession, generateStudyPlan, analyzeWorkload.`,
          };
      }
    } catch (err: any) {
      return {
        toolName,
        success: false,
        error: err?.message || 'Error executing tool.',
      };
    }
  }
}
