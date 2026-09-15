import { AcademicIntegrationStatus, IntegrationProvider, NormalizedExternalItem } from '../../types/agent';
import { DataNormalizer } from './dataNormalizer';
import { ActionLogger } from '../agent/audit/ActionLogger';

const INTEGRATIONS_KEY = 'studyflow_academic_integrations_v1';

export class IntegrationService {
  private static integrations: AcademicIntegrationStatus[] = IntegrationService.loadIntegrations();

  private static loadIntegrations(): AcademicIntegrationStatus[] {
    try {
      const saved = localStorage.getItem(INTEGRATIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return [
      {
        id: 'lms',
        name: 'Canvas / Moodle LMS',
        description: 'Sync course syllabi, assignments, due dates, and grading rubrics.',
        icon: '🎓',
        status: 'connected',
        lastSyncedAt: '2026-09-08 19:30',
        autoSyncEnabled: true,
        endpointUrl: 'https://canvas.instructure.com/api/v1',
        itemCount: { assignments: 4, announcements: 6, calendarEvents: 12 },
      },
      {
        id: 'teams',
        name: 'Microsoft Teams for Education',
        description: 'Sync classroom channels, faculty announcements, and lab group chats.',
        icon: '💬',
        status: 'connected',
        lastSyncedAt: '2026-09-08 18:00',
        autoSyncEnabled: true,
        itemCount: { assignments: 2, announcements: 8, calendarEvents: 4 },
      },
      {
        id: 'google_calendar',
        name: 'Google Calendar (University Account)',
        description: 'Two-way sync with class timetable, exam blocks, and study sessions.',
        icon: '📅',
        status: 'connected',
        lastSyncedAt: '2026-09-08 20:00',
        autoSyncEnabled: true,
        itemCount: { assignments: 0, announcements: 0, calendarEvents: 24 },
      },
      {
        id: 'college_portal',
        name: 'University Student ERP Portal',
        description: 'Direct integration for CAT exams, attendance records, and GPA transcript.',
        icon: '🏛️',
        status: 'disconnected',
        autoSyncEnabled: false,
        itemCount: { assignments: 0, announcements: 0, calendarEvents: 0 },
      },
    ];
  }

  static getIntegrations(): AcademicIntegrationStatus[] {
    return IntegrationService.integrations;
  }

  static async toggleConnection(provider: IntegrationProvider): Promise<AcademicIntegrationStatus> {
    const target = IntegrationService.integrations.find(i => i.id === provider);
    if (!target) throw new Error('Provider not found');

    const nextStatus = target.status === 'connected' ? 'disconnected' : 'connected';
    target.status = nextStatus;
    if (nextStatus === 'connected') {
      target.lastSyncedAt = new Date().toLocaleString();
    }

    ActionLogger.logAction(
      'IntegrationSyncAgent',
      'TOGGLE_INTEGRATION',
      `${nextStatus === 'connected' ? 'Connected' : 'Disconnected'} ${target.name}`,
      { provider, status: nextStatus }
    );

    IntegrationService.persist();
    return target;
  }

  static async syncProvider(provider: IntegrationProvider, subjectId: string): Promise<{
    itemsSynced: NormalizedExternalItem[];
    summary: string;
  }> {
    const target = IntegrationService.integrations.find(i => i.id === provider);
    if (!target) throw new Error('Provider not found');

    target.status = 'syncing';
    IntegrationService.persist();

    // Simulate realistic network latency
    await new Promise(r => setTimeout(r, 600));

    target.status = 'connected';
    target.lastSyncedAt = new Date().toLocaleString();

    // Mock incoming external items from that provider
    const sampleItems: NormalizedExternalItem[] = [
      {
        id: `ext-${provider}-01`,
        sourceProvider: provider,
        sourceId: 'canvas-item-88392',
        title: `${provider === 'lms' ? 'Database Normalization Decomposition Lab' : 'Operating Systems Kernel IPC Problem'}`,
        description: 'Coursework assignment imported from institution learning management portal.',
        subjectCode: 'CS302',
        subjectName: 'Database Management Systems',
        itemType: 'assignment',
        dueDate: '2026-09-18',
        dueTime: '23:59',
        priority: 'HIGH',
        difficulty: 'Medium',
        estimatedMinutes: 120,
        submissionUrl: 'https://canvas.instructure.com/assignments/88392',
        syncedAt: new Date().toISOString(),
      },
    ];

    ActionLogger.logAction(
      'IntegrationSyncAgent',
      'SYNC_PROVIDER',
      `Synced ${sampleItems.length} items from ${target.name}`,
      { provider, itemsCount: sampleItems.length },
      'SUCCESS',
      subjectId
    );

    IntegrationService.persist();
    return {
      itemsSynced: sampleItems,
      summary: `Synced ${sampleItems.length} new assignments from ${target.name}.`,
    };
  }

  private static persist() {
    try {
      localStorage.setItem(INTEGRATIONS_KEY, JSON.stringify(IntegrationService.integrations));
    } catch (e) {}
  }
}
