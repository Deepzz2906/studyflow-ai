import { OpenClawAdapter } from '../agent/OpenClawAdapter';
import { IntegrationService } from '../integrations/IntegrationService';
import { MemoryService } from '../agent/memory/MemoryService';
import { ToolRegistry } from '../agent/tools/ToolRegistry';
import { IntegrationProvider } from '../../types/agent';

export class ApiClient {
  /**
   * GET /api/ai/context
   */
  static async getAIContext() {
    return {
      memory: MemoryService.getMemory(),
      status: 'ONLINE',
      agentVersion: 'OpenClaw v2.4.0',
    };
  }

  /**
   * POST /api/ai/chat
   */
  static async postAIChat(message: string, activePage: string, contextData: any) {
    const adapter = OpenClawAdapter.getService();
    return adapter.chat(message, activePage, contextData);
  }

  /**
   * POST /api/ai/action
   */
  static async postAIAction(actionType: string, payload: any) {
    return ToolRegistry.executeTool({
      toolName: actionType,
      arguments: payload,
    });
  }

  /**
   * GET /api/integrations
   */
  static async getIntegrations() {
    return IntegrationService.getIntegrations();
  }

  /**
   * POST /api/integrations/:provider/connect
   */
  static async connectIntegration(provider: IntegrationProvider) {
    return IntegrationService.toggleConnection(provider);
  }

  /**
   * POST /api/integrations/:provider/sync
   */
  static async syncIntegration(provider: IntegrationProvider, subjectId: string) {
    return IntegrationService.syncProvider(provider, subjectId);
  }
}
