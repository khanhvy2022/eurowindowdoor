import fs from 'node:fs';
import path from 'node:path';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';
import { supabaseAdmin } from '@/lib/supabase';

// Root directory of the sandbox
const SANDBOX_ROOT = path.resolve(process.cwd(), 'sandbox');

// Set of allowed commands
export const ALLOWED_BASH_COMMANDS = new Set([
  'find', 'ls', 'tree', 'grep', 'egrep', 'fgrep',
  'cat', 'head', 'tail', 'less', 'more',
  'wc', 'sort', 'uniq', 'cut', 'awk', 'sed', 'tr',
  'echo', 'printf', 'basename', 'dirname', 'realpath',
  'file', 'stat', 'du', 'diff'
]);

export const BLOCKED_SHELL_PATTERNS = [
  /\$\(/,          // command substitution $(...)
  /`[^`]+`/,       // backtick substitution
  /\beval\b/,      // eval
  /\bexec\b/,      // exec
  /\bsource\b/,    // source
  /\bbash\b/,      // nested bash
  /\bsh\b/,        // nested sh
  /\bzsh\b/,       // nested zsh
  /\benv\b/,       // env
  />\s*[^\s|]/,    // write redirection (> file)
  /\bpython\b/,    // interpreter
  /\bnode\b/,      // interpreter
  /\bperl\b/,      // interpreter
  /\bruby\b/,      // interpreter
];

/**
 * Validates path traversal and containment within sandbox
 */
function isPathWithinDirectory(filePath: string, directory: string): boolean {
  const resolvedPath = path.resolve(filePath);
  const resolvedDir = path.resolve(directory);
  return resolvedPath.startsWith(`${resolvedDir}${path.sep}`) || resolvedPath === resolvedDir;
}

function extractPotentialPathTokens(command: string): string[] {
  const tokenRegex = /(?:^|\s)(\/[^\s|;&]+|\.{1,2}\/[^\s|;&]+)/g;
  const tokens: string[] = [];
  let match: RegExpExecArray | null = null;
  while ((match = tokenRegex.exec(command)) !== null) {
    const [, token] = match;
    if (token) {
      tokens.push(token.replace(/^['"]|['"]$/g, ''));
    }
  }
  return tokens;
}

function validatePaths(command: string, allowedBaseDirectory: string): { ok: boolean; reason?: string } {
  const tokens = extractPotentialPathTokens(command);
  for (const token of tokens) {
    if (token.includes('../') || token.includes('..\\')) {
      return { ok: false, reason: `Path traversal is not allowed: ${token}` };
    }
    if (token.startsWith('/')) {
      if (!isPathWithinDirectory(token, allowedBaseDirectory)) {
        return { ok: false, reason: `Path outside sandbox is not allowed: ${token}` };
      }
    }
  }
  return { ok: true };
}

export function validateShellCommand(command: string, allowedBaseDirectory: string): { ok: boolean; reason?: string } {
  for (const pattern of BLOCKED_SHELL_PATTERNS) {
    if (pattern.test(command)) {
      return { ok: false, reason: `Command contains blocked pattern` };
    }
  }

  const segments = command.split(/\s*(?:\|(?!\|)|\|\||&&|;)\s*/);
  for (const segment of segments) {
    const trimmed = segment.trim();
    if (!trimmed) continue;
    const words = trimmed.split(/\s+/);
    const cmdName = words.find(w => !w.includes('=')) || words[0];
    if (!cmdName || !ALLOWED_BASH_COMMANDS.has(cmdName)) {
      return { ok: false, reason: `Command not allowed: ${cmdName || 'unknown'}` };
    }
  }

  return validatePaths(command, allowedBaseDirectory);
}

/**
 * Helper to resolve paths safely within the sandbox
 */
function secureResolve(targetPath: string): string {
  // Normalize path separators and remove sandbox prefix if LLM passed it
  const cleanPath = targetPath.replace(/\\/g, '/').replace(/^sandbox\/?/, '');
  const resolved = path.resolve(SANDBOX_ROOT, cleanPath);
  if (!isPathWithinDirectory(resolved, SANDBOX_ROOT)) {
    throw new Error(`Access Denied: Path '${targetPath}' resolves outside sandbox.`);
  }
  return resolved;
}

/**
 * Safely parse command arguments (respects single/double quotes)
 */
function parseArgs(cmd: string): string[] {
  const args: string[] = [];
  let current = '';
  let inDoubleQuote = false;
  let inSingleQuote = false;

  for (let i = 0; i < cmd.length; i++) {
    const c = cmd[i];
    if (c === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
    } else if (c === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
    } else if (c === ' ' && !inDoubleQuote && !inSingleQuote) {
      if (current.length > 0) {
        args.push(current);
        current = '';
      }
    } else {
      current += c;
    }
  }
  if (current.length > 0) {
    args.push(current);
  }
  return args;
}

/**
 * Helper: wildcard matcher
 */
function wildcardToRegex(wildcard: string): RegExp {
  const esc = wildcard.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const regStr = '^' + esc.replace(/\*/g, '.*').replace(/\?/g, '.') + '$';
  return new RegExp(regStr, 'i');
}

// Global throttle variables for sync
let lastSyncedTime = 0;
const SYNC_COOLDOWN_MS = 60 * 1000; // 1 minute cooldown

/**
 * Synchronize existing documents from Database to Sandbox
 */
export async function syncDatabaseToSandbox(force = false) {
  const now = Date.now();
  if (!force && now - lastSyncedTime < SYNC_COOLDOWN_MS) {
    return; // Throttle
  }

  try {
    // Create folders
    if (!fs.existsSync(SANDBOX_ROOT)) {
      fs.mkdirSync(SANDBOX_ROOT, { recursive: true });
    }
    const filesDir = path.join(SANDBOX_ROOT, 'files');
    if (fs.existsSync(filesDir)) {
      fs.rmSync(filesDir, { recursive: true, force: true });
    }
    fs.mkdirSync(filesDir, { recursive: true });
    const dataDir = path.join(SANDBOX_ROOT, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 1. Sync local JSON and code files (blogs, projects, showrooms, pricing)
    const localDataPaths = [
      'data/blogs.json', 
      'data/projects.json', 
      'data/showrooms.json',
      'src/app/bao-gia/pricing.ts'
    ];
    for (const relativePath of localDataPaths) {
      const srcPath = path.resolve(process.cwd(), relativePath);
      if (fs.existsSync(srcPath)) {
        const destPath = path.join(dataDir, path.basename(relativePath));
        fs.copyFileSync(srcPath, destPath);
      }
    }

    // Ghi tài liệu hướng dẫn tính toán báo giá sơ bộ vào sandbox để AI đọc
    const guideContent = `# Hướng dẫn Tính Báo giá Sơ bộ Cửa Eurowindow

Tài liệu này hướng dẫn cách tính báo giá sơ bộ cho khách hàng dựa trên dữ liệu giá tại \`sandbox/data/pricing.ts\`.

## 1. Công thức tính giá chung
- **Diện tích cửa (m2)** = Chiều rộng (m) * Chiều cao (m)
- **Diện tích tối thiểu để tính giá** là 1.0 m2 (nếu diện tích cửa < 1.0 m2, vẫn tính là 1.0 m2).
- **Thành tiền 1 bộ cửa** = Diện tích cửa tính giá * (Đơn giá cửa cơ bản/m2 + Đơn giá kính phụ trội/m2 + Đơn giá phụ kiện cửa/m2)
- **Tổng chi phí** = Thành tiền 1 bộ * Số lượng bộ

## 2. Các hệ cửa và cách tính cụ thể

### A. Hệ nhôm EA55 (Nhôm cao cấp không cầu cách nhiệt)
- **Đơn giá cơ bản**: Xem đối tượng \`pricing.basePrice\` trong \`pricing.ts\` (ví dụ: \`mo_quay\` là 5,000,000đ/m2, \`truot\` là 4,500,000đ/m2).
- **Kính phụ trội**: Xem đối tượng \`pricing.glassExtra\` (ví dụ: kính hộp \`hop_5_9_5\` là +400,000đ/m2, kính \`low_e_6_9_6\` là +1,000,000đ/m2).
- **Phụ kiện phụ trội**: Xem đối tượng \`pricing.hardwareExtra\` theo hãng phụ kiện (ví dụ: hãng C-Mech \`cmech\` cho cửa mở quay \`mo_quay\` là +1,000,000đ/m2, phụ kiện hãng Roto \`roto\` là +1,500,000đ/m2, phụ kiện Eurowindow \`eurowindow\` mặc định là 0đ).

### B. Hệ nhôm EA60i (Nhôm có cầu cách nhiệt cao cấp)
- **Đơn giá cơ bản**: Xem đối tượng \`pricingEA60i.basePrice\` (ví dụ: \`mo_quay\` là 10,000,000đ/m2).
- **Kính phụ trội**: Xem đối tượng \`pricingEA60i.glassExtra\` (ví dụ: kính hộp \`hop_5_9_5\` là +400,000đ/m2, kính Low-E là +1,000,000đ/m2).
- **Phụ kiện**: Đã được tính gộp trong đơn giá cơ bản.

### C. Hệ nhựa Kommerling uPVC (Cao cấp tiêu chuẩn châu Âu)
- **Đơn giá cơ bản**: Xem đối tượng \`pricingKommerling.basePrice\` (ví dụ: \`cua_so_truot\` là 4,500,000đ/m2, \`cua_di_1_quay\` là 7,000,000đ/m2).
- **Kính phụ trội**: Xem đối tượng \`pricingKommerling.glassExtra\` (ví dụ: \`hop_5_9_5\` là +400,000đ/m2).
- **Phụ kiện**: Đã được tính gộp trong đơn giá cơ bản.

### D. Hệ nhựa Asia uPVC (Kinh tế)
- **Đơn giá cơ bản**: Xem đối tượng \`pricingAsia.basePrice\`.
- **Kính phụ trội**: Xem đối tượng \`pricingAsia.glassExtra\`.
- **Phụ kiện**: Đã được tính gộp trong đơn giá cơ bản.

## 3. Quy trình báo giá của AI
Khi khách hàng yêu cầu báo giá sơ bộ:
1. Hỏi khách hàng các thông tin cần thiết: Hệ nhôm/nhựa mong muốn, loại cửa (mở quay/lùa/trượt/hất), loại kính, kích thước (rộng x cao), số lượng bộ.
2. Tra cứu file \`sandbox/data/pricing.ts\` để lấy giá chính xác.
3. Thực hiện tính toán chi tiết từng bước (ghi rõ diện tích cửa, đơn giá cơ bản, phụ trội kính, phụ trội phụ kiện).
4. Định dạng báo giá thành một bảng rõ ràng và tổng hợp thành tiền để gửi khách hàng.
`;
    fs.writeFileSync(path.join(filesDir, 'huong_dan_tinh_gia.md'), guideContent, 'utf-8');

    // 2. Fetch from Supabase
    let docsSynced = false;
    if (supabaseAdmin) {
      try {
        const { data: documents } = await supabaseAdmin.from('documents').select('*');
        if (documents && documents.length > 0) {
          for (const doc of documents) {
            const { data: chunks } = await supabaseAdmin
              .from('document_chunks')
              .select('content, id')
              .eq('document_id', doc.id);
            
            if (chunks && chunks.length > 0) {
              const fullContent = chunks.map((c: any) => c.content).join('\n\n');
              const sanitizedName = doc.file_name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
              fs.writeFileSync(path.join(filesDir, sanitizedName), fullContent, 'utf-8');
            }
          }
          docsSynced = true;
        }
      } catch (err) {
        console.warn('[Sandbox Sync] Supabase sync failed, trying MongoDB fallback:', err);
      }
    }

    // 3. Fallback to MongoDB
    if (!docsSynced) {
      try {
        await connectToDatabase();
      const db = mongoose.connection.db;
      if (!db) { throw new Error('DB missing'); }
        const documents = await db.collection('documents').find({}).toArray();
        if (documents && documents.length > 0) {
          for (const doc of documents) {
            const chunks = await db.collection('document_chunks')
              .find({ document_id: doc.id })
              .toArray();
            
            if (chunks && chunks.length > 0) {
              const fullContent = chunks.map((c: any) => c.content).join('\n\n');
              const sanitizedName = doc.file_name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
              fs.writeFileSync(path.join(filesDir, sanitizedName), fullContent, 'utf-8');
            }
          }
        }
      } catch (err) {
        console.error('[Sandbox Sync] MongoDB fallback sync failed:', err);
      }
    }

    lastSyncedTime = now;
    console.log('[Sandbox Sync] Sync completed successfully.');
  } catch (error) {
    console.error('[Sandbox Sync] Error during database sync to sandbox:', error);
  }
}

/**
 * Save newly uploaded document directly to Sandbox
 */
export async function saveDocumentToSandbox(fileName: string, text: string) {
  try {
    const filesDir = path.join(SANDBOX_ROOT, 'files');
    if (!fs.existsSync(filesDir)) {
      fs.mkdirSync(filesDir, { recursive: true });
    }
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    fs.writeFileSync(path.join(filesDir, sanitizedName), text, 'utf-8');
    console.log(`[Sandbox Save] Saved new document: ${sanitizedName}`);
  } catch (err) {
    console.error('[Sandbox Save] Error saving document directly:', err);
  }
}

/**
 * Secure Command Executor simulating shell commands
 */
export async function executeSecureCommand(commandLine: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  try {
    const trimmedCmd = commandLine.trim();
    if (!trimmedCmd) {
      return { stdout: '', stderr: 'Empty command', exitCode: 1 };
    }

    // Support pipes '|'
    if (trimmedCmd.includes('|')) {
      const parts = trimmedCmd.split('|').map(p => p.trim());
      let currentInput = '';
      for (const part of parts) {
        const result = await executeSingleCommand(part, currentInput);
        if (result.exitCode !== 0) {
          return result;
        }
        currentInput = result.stdout;
      }
      return { stdout: currentInput, stderr: '', exitCode: 0 };
    }

    return await executeSingleCommand(trimmedCmd, '');
  } catch (err: any) {
    return { stdout: '', stderr: err.message || String(err), exitCode: 1 };
  }
}

async function executeSingleCommand(commandLine: string, stdin: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const validation = validateShellCommand(commandLine, SANDBOX_ROOT);
  if (!validation.ok) {
    return { stdout: '', stderr: validation.reason || 'Blocked command', exitCode: 1 };
  }

  const args = parseArgs(commandLine);
  const cmd = args[0];
  const cmdArgs = args.slice(1);

  switch (cmd) {
    case 'find':
      return runFind(cmdArgs);
    case 'grep':
    case 'egrep':
    case 'fgrep':
      return runGrep(cmdArgs, stdin);
    case 'cat':
      return runCat(cmdArgs);
    case 'head':
      return runHead(cmdArgs, stdin);
    case 'tail':
      return runTail(cmdArgs, stdin);
    case 'ls':
      return runLs(cmdArgs);
    default:
      return { stdout: '', stderr: `Command not implemented in JS emulator: ${cmd}`, exitCode: 1 };
  }
}

/* =============================================================================
   Command implementations
   ============================================================================= */

function runLs(args: string[]): { stdout: string; stderr: string; exitCode: number } {
  // Parse options and path
  let targetPath = '.';
  for (const arg of args) {
    if (!arg.startsWith('-')) {
      targetPath = arg;
      break;
    }
  }

  try {
    const fullPath = secureResolve(targetPath);
    if (!fs.existsSync(fullPath)) {
      return { stdout: '', stderr: `ls: ${targetPath}: No such file or directory`, exitCode: 1 };
    }

    const stat = fs.statSync(fullPath);
    if (!stat.isDirectory()) {
      return { stdout: path.basename(targetPath), stderr: '', exitCode: 0 };
    }

    const files = fs.readdirSync(fullPath);
    return { stdout: files.join('\n'), stderr: '', exitCode: 0 };
  } catch (err: any) {
    return { stdout: '', stderr: err.message || String(err), exitCode: 1 };
  }
}

function runCat(args: string[]): { stdout: string; stderr: string; exitCode: number } {
  const files = args.filter(a => !a.startsWith('-'));
  if (files.length === 0) {
    return { stdout: '', stderr: 'cat: Missing operand', exitCode: 1 };
  }

  let stdout = '';
  try {
    for (const file of files) {
      const fullPath = secureResolve(file);
      if (!fs.existsSync(fullPath)) {
        return { stdout: '', stderr: `cat: ${file}: No such file or directory`, exitCode: 1 };
      }
      stdout += fs.readFileSync(fullPath, 'utf-8');
    }
    return { stdout, stderr: '', exitCode: 0 };
  } catch (err: any) {
    return { stdout: '', stderr: err.message || String(err), exitCode: 1 };
  }
}

function runHead(args: string[], stdin: string): { stdout: string; stderr: string; exitCode: number } {
  let linesLimit = 10;
  let fileArg = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-n' && i + 1 < args.length) {
      linesLimit = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i].startsWith('-n')) {
      linesLimit = parseInt(args[i].slice(2), 10);
    } else if (!args[i].startsWith('-')) {
      fileArg = args[i];
    }
  }

  let content = '';
  if (fileArg) {
    try {
      const fullPath = secureResolve(fileArg);
      if (!fs.existsSync(fullPath)) {
        return { stdout: '', stderr: `head: ${fileArg}: No such file or directory`, exitCode: 1 };
      }
      content = fs.readFileSync(fullPath, 'utf-8');
    } catch (err: any) {
      return { stdout: '', stderr: err.message || String(err), exitCode: 1 };
    }
  } else {
    content = stdin;
  }

  const lines = content.split('\n').slice(0, linesLimit).join('\n');
  return { stdout: lines, stderr: '', exitCode: 0 };
}

function runTail(args: string[], stdin: string): { stdout: string; stderr: string; exitCode: number } {
  let linesLimit = 10;
  let fileArg = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-n' && i + 1 < args.length) {
      linesLimit = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i].startsWith('-n')) {
      linesLimit = parseInt(args[i].slice(2), 10);
    } else if (!args[i].startsWith('-')) {
      fileArg = args[i];
    }
  }

  let content = '';
  if (fileArg) {
    try {
      const fullPath = secureResolve(fileArg);
      if (!fs.existsSync(fullPath)) {
        return { stdout: '', stderr: `tail: ${fileArg}: No such file or directory`, exitCode: 1 };
      }
      content = fs.readFileSync(fullPath, 'utf-8');
    } catch (err: any) {
      return { stdout: '', stderr: err.message || String(err), exitCode: 1 };
    }
  } else {
    content = stdin;
  }

  const allLines = content.split('\n');
  const lines = allLines.slice(Math.max(0, allLines.length - linesLimit)).join('\n');
  return { stdout: lines, stderr: '', exitCode: 0 };
}

function runFind(args: string[]): { stdout: string; stderr: string; exitCode: number } {
  let targetPath = '.';
  let namePattern = '';
  let typeFilter = ''; // 'f' or 'd'

  // Extract path and options
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-name' && i + 1 < args.length) {
      namePattern = args[i + 1].replace(/^['"]|['"]$/g, '');
      i++;
    } else if (arg === '-type' && i + 1 < args.length) {
      typeFilter = args[i + 1];
      i++;
    } else if (!arg.startsWith('-')) {
      targetPath = arg;
    }
  }

  const results: string[] = [];
  const nameRegex = namePattern ? wildcardToRegex(namePattern) : null;

  function traverse(currentDir: string) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      const relative = path.relative(SANDBOX_ROOT, fullPath).replace(/\\/g, '/');
      const stat = fs.statSync(fullPath);

      const matchesType = !typeFilter || 
        (typeFilter === 'f' && stat.isFile()) || 
        (typeFilter === 'd' && stat.isDirectory());
      
      const matchesName = !nameRegex || nameRegex.test(file);

      if (matchesType && matchesName) {
        results.push(relative);
      }

      if (stat.isDirectory()) {
        traverse(fullPath);
      }
    }
  }

  try {
    const fullStartPath = secureResolve(targetPath);
    if (!fs.existsSync(fullStartPath)) {
      return { stdout: '', stderr: `find: ${targetPath}: No such file or directory`, exitCode: 1 };
    }
    const rootStat = fs.statSync(fullStartPath);
    if (rootStat.isDirectory()) {
      traverse(fullStartPath);
    } else {
      const relative = path.relative(SANDBOX_ROOT, fullStartPath).replace(/\\/g, '/');
      if (!nameRegex || nameRegex.test(path.basename(fullStartPath))) {
        results.push(relative);
      }
    }
    return { stdout: results.join('\n'), stderr: '', exitCode: 0 };
  } catch (err: any) {
    return { stdout: '', stderr: err.message || String(err), exitCode: 1 };
  }
}

function runGrep(args: string[], stdin: string): { stdout: string; stderr: string; exitCode: number } {
  let isRecursive = false;
  let showLineNum = false;
  let ignoreCase = false;
  let pattern = '';
  const targetPath = '';

  // Simple parsing of grep args
  const fileArgs: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('-')) {
      // Handle combined short flags like -rn or -rnI
      if (arg.includes('r') || arg.includes('R')) isRecursive = true;
      if (arg.includes('n')) showLineNum = true;
      if (arg.includes('i')) ignoreCase = true;
    } else {
      if (!pattern) {
        pattern = arg.replace(/^['"]|['"]$/g, '');
      } else {
        fileArgs.push(arg);
      }
    }
  }

  if (!pattern) {
    return { stdout: '', stderr: 'grep: Pattern missing', exitCode: 1 };
  }

  // Compile search regex
  const searchRegex = new RegExp(pattern.replace(/[.+*?^${}()|[\]\\]/g, '\\$&'), ignoreCase ? 'i' : '');

  // Case 1: Searching stdin
  if (fileArgs.length === 0 && !isRecursive) {
    const lines = stdin.split('\n');
    const matches: string[] = [];
    lines.forEach((line, index) => {
      if (searchRegex.test(line)) {
        matches.push(showLineNum ? `${index + 1}:${line}` : line);
      }
    });
    return { stdout: matches.join('\n'), stderr: '', exitCode: 0 };
  }

  // Case 2: Searching files/directory
  const results: string[] = [];
  const startPaths = fileArgs.length > 0 ? fileArgs : ['.'];

  function grepFile(filePath: string) {
    try {
      const fullPath = secureResolve(filePath);
      const relative = path.relative(SANDBOX_ROOT, fullPath).replace(/\\/g, '/');
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (searchRegex.test(line)) {
          const prefix = showLineNum ? `${relative}:${idx + 1}:` : `${relative}:`;
          results.push(`${prefix}${line}`);
        }
      });
    } catch (e) {
      // Ignore reading errors for directories or binary files
    }
  }

  function grepDir(dirPath: string) {
    try {
      const fullPath = secureResolve(dirPath);
      const items = fs.readdirSync(fullPath);
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const fullItemPath = secureResolve(itemPath);
        const stat = fs.statSync(fullItemPath);
        if (stat.isDirectory()) {
          if (isRecursive) {
            grepDir(itemPath);
          }
        } else {
          grepFile(itemPath);
        }
      }
    } catch (e) {}
  }

  try {
    for (const startPath of startPaths) {
      const fullPath = secureResolve(startPath);
      if (!fs.existsSync(fullPath)) {
        return { stdout: '', stderr: `grep: ${startPath}: No such file or directory`, exitCode: 1 };
      }
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        grepDir(startPath);
      } else {
        grepFile(startPath);
      }
    }
    return { stdout: results.join('\n'), stderr: '', exitCode: 0 };
  } catch (err: any) {
    return { stdout: '', stderr: err.message || String(err), exitCode: 1 };
  }
}
