import { NormalizedExternalItem, IntegrationProvider } from '../../types/agent';
import { Assignment, TimetableEvent } from '../../types';

export class DataNormalizer {
  /**
   * Normalizes external payload into internal StudyFlow Assignment
   */
  static normalizeAssignment(item: NormalizedExternalItem, subjectId: string): Omit<Assignment, 'id' | 'createdAt' | 'calculatedPriorityScore'> {
    return {
      title: item.title,
      subjectId,
      description: `[Imported from ${item.sourceProvider.toUpperCase()}] ${item.description}`,
      teacher: item.sourceProvider === 'lms' ? 'LMS Course Instructor' : 'Teams Channel',
      dueDate: item.dueDate || '2026-09-18',
      dueTime: item.dueTime || '23:59',
      estimatedDurationMinutes: item.estimatedMinutes || 120,
      difficulty: item.difficulty || 'Medium',
      priority: item.priority || 'HIGH',
      status: 'Not Started',
      submissionLink: item.submissionUrl,
      subtasks: [
        { id: `st-norm-${Date.now()}-1`, title: 'Review rubric from external portal', estimatedMinutes: 20, isCompleted: false, order: 1 },
        { id: `st-norm-${Date.now()}-2`, title: 'Draft implementation', estimatedMinutes: 60, isCompleted: false, order: 2 },
        { id: `st-norm-${Date.now()}-3`, title: 'Upload submission', estimatedMinutes: 30, isCompleted: false, order: 3 },
      ],
    };
  }

  /**
   * Normalizes external schedule item into internal Timetable event
   */
  static normalizeCalendarEvent(item: NormalizedExternalItem, subjectId: string): Omit<TimetableEvent, 'id'> {
    return {
      title: item.title,
      subjectId,
      type: item.itemType === 'lecture' ? 'class' : 'study',
      dayOfWeek: 3, // Thursday sample
      startTime: '10:00',
      endTime: '11:30',
      room: 'Online Meeting / Room 101',
      isRecurring: false,
      notes: `Synced via ${item.sourceProvider.toUpperCase()}`,
    };
  }
}
