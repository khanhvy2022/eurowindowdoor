export interface RouteTarget {
  name: string;
  type: 'local_rag' | 'notebook_lm' | 'liteparse' | 'cad_engine' | 'bim_engine' | 'ai_designer' | 'web_search';
  handler: (payload: any) => Promise<any>;
}

const ROUTE_REGISTRY = new Map<string, RouteTarget>();

// Register core plugins
ROUTE_REGISTRY.set('local_rag', {
  name: 'Local RAG Database',
  type: 'local_rag',
  handler: async (payload) => {
    const { retrieveRelevantContext } = await import('@/lib/rag');
    return await retrieveRelevantContext(payload.query, 10);
  }
});

ROUTE_REGISTRY.set('liteparse', {
  name: 'LlamaParse Ingestion Engine',
  type: 'liteparse',
  handler: async (payload) => {
    const { LlamaParseService } = await import('@/services/llamaparse');
    return await LlamaParseService.parsePdf(payload.fileName, payload.buffer);
  }
});

ROUTE_REGISTRY.set('cad_engine', {
  name: 'AutoCAD Geometry Parser',
  type: 'cad_engine',
  handler: async (payload) => {
    const AutoCADImporter = await import('@/engine/cad/AutoCADImporter');
    // Call CAD entity renderer/importer dynamically
    return AutoCADImporter;
  }
});

export class RequestRouter {
  /**
   * Routes intent payload to target microservices or engines.
   */
  public static async route(type: RouteTarget['type'], payload: any): Promise<any> {
    const target = Array.from(ROUTE_REGISTRY.values()).find(t => t.type === type);
    if (!target) {
      console.warn(`[RequestRouter] Target handler for type "${type}" not registered. Falling back to mockup.`);
      return this.mockupResponse(type, payload);
    }
    
    console.log(`[RequestRouter] Routing request to plugin: "${target.name}"`);
    return await target.handler(payload);
  }

  /**
   * Mockup responses for items not fully integrated yet (preventing system crashes).
   */
  private static mockupResponse(type: string, payload: any): any {
    switch (type) {
      case 'notebook_lm':
        return `[NotebookLM MCP Mockup] Synced and processed context notes for topic "${payload.query || 'General'}"`;
      case 'bim_engine':
        return `[BIM/IFC Engine Mockup] Parsed 3D coordinates for element ID "${payload.id || 'N/A'}"`;
      case 'web_search':
        return `[Web Search Mockup] Searched indices for "${payload.query}"`;
      default:
        return null;
    }
  }

  /**
   * Registers a new custom route plugin dynamically.
   */
  public static registerPlugin(key: string, target: RouteTarget) {
    ROUTE_REGISTRY.set(key, target);
    console.log(`[RequestRouter] Registered custom plugin: "${target.name}"`);
  }
}
