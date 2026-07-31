import { z } from 'zod';
import { executeSecureCommand } from '../sandbox';

export const bashTool = {
  description: 'Execute a bash command in the documentation sandbox. Use standard Unix commands like find, grep, cat, head, tail, ls to explore and read files.',
  parameters: z.object({
    command: z.string().describe('Bash command to execute (e.g. grep -rn "kính Low-E" sandbox/)'),
  }),
  execute: async ({ command }: any) => {
    const result = await executeSecureCommand(command);
    return {
      success: result.exitCode === 0,
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
    };
  },
};

export const bashBatchTool = {
  description: 'Execute multiple bash commands in the documentation sandbox in a single request. Combine search (grep) and read (head/cat) commands in a single batch. Maximum 10 commands per batch.',
  parameters: z.object({
    commands: z.array(z.string()).min(1).max(10).describe('Array of bash commands to execute'),
  }),
  execute: async ({ commands }: any) => {
    const results = [];
    let success = true;
    for (const command of commands) {
      const result = await executeSecureCommand(command);
      results.push({
        command,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
      });
      if (result.exitCode !== 0) {
        success = false;
      }
    }
    return {
      success,
      results,
    };
  },
};
