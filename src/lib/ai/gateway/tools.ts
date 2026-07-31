import { bashTool, bashBatchTool } from '../tools/shell';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: any;
  execute: (args: any) => Promise<any>;
}

/**
 * Registry of all available tools in the system.
 * Easily extendable by adding new entries.
 */
const TOOL_REGISTRY: Record<string, ToolDefinition> = {
  bash: {
    name: 'bash',
    description: bashTool.description,
    parameters: bashTool.parameters,
    execute: async (args) => {
      // Direct call to executeSecureCommand under sandbox
      const { executeSecureCommand } = require('../sandbox');
      return await executeSecureCommand(args.command);
    }
  },
  bash_batch: {
    name: 'bash_batch',
    description: bashBatchTool.description,
    parameters: bashBatchTool.parameters,
    execute: async (args) => {
      const { executeSecureCommand } = require('../sandbox');
      const outputs = [];
      for (const cmd of args.commands) {
        const out = await executeSecureCommand(cmd);
        outputs.push(out);
      }
      return outputs;
    }
  }
};

export class ToolSelector {
  /**
   * Retrieves tools relevant for the classified user intent.
   */
  public static getToolsForIntent(intent: string): Record<string, any> {
    const selectedTools: Record<string, any> = {};

    switch (intent) {
      case 'product_consulting':
      case 'pdf_analysis':
        // Product lookup and RAG needs the sandbox shell query tools
        selectedTools.bash = bashTool;
        selectedTools.bash_batch = bashBatchTool;
        break;

      case 'cad_analysis':
      case 'bim_analysis':
        // CAD analysis can inspect files
        selectedTools.bash = bashTool;
        break;

      case 'house_design':
      case 'rendering':
      case 'pricing':
        // Expose CAD layout/BOM tools (simulated in mcpToolBroker)
        // Can add procedural CAD triggers here in the future
        break;

      default:
        break;
    }

    return selectedTools;
  }

  /**
   * Executes a registered tool by name.
   */
  public static async executeTool(name: string, args: any): Promise<any> {
    const tool = TOOL_REGISTRY[name];
    if (!tool) {
      throw new Error(`Tool "${name}" is not registered in ToolSelector.`);
    }
    return await tool.execute(args);
  }
}
