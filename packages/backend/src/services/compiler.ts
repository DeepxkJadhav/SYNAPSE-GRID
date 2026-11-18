import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export type SupportedLanguage = 'python' | 'javascript' | 'typescript' | 'java' | 'cpp' | 'go' | 'rust' | 'csharp';

export interface CompileResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime: number;
  language: SupportedLanguage;
}

export interface ExecuteResult extends CompileResult {
  stdout?: string;
  stderr?: string;
}

export class CompilerService {
  private tempDir = path.join(__dirname, '../../temp_files');

  constructor() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async compile(code: string, language: SupportedLanguage): Promise<CompileResult> {
    const startTime = Date.now();
    let filePath = '';

    try {
      const fileName = this.generateFileName(language);
      filePath = path.join(this.tempDir, fileName);

      fs.writeFileSync(filePath, code, 'utf-8');

      const result = this.executeCompile(filePath, language);
      const executionTime = Date.now() - startTime;

      return {
        ...result,
        executionTime,
        language,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime,
        language,
      };
    } finally {
      this.safeDelete(filePath);
    }
  }

  async execute(code: string, language: SupportedLanguage, input?: string): Promise<ExecuteResult> {
    const startTime = Date.now();
    let filePath = '';

    try {
      const fileName = this.generateFileName(language);
      filePath = path.join(this.tempDir, fileName);

      fs.writeFileSync(filePath, code, 'utf-8');

      const result = this.executeCode(filePath, language, input);
      const executionTime = Date.now() - startTime;

      return {
        ...result,
        executionTime,
        language,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime,
        language,
      };
    } finally {
      this.safeDelete(filePath);
    }
  }

  private generateFileName(language: SupportedLanguage): string {
    const extensions: Record<SupportedLanguage, string> = {
      python: 'py',
      javascript: 'js',
      typescript: 'ts',
      java: 'java',
      cpp: 'cpp',
      go: 'go',
      rust: 'rs',
      csharp: 'cs',
    };

    return `code_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${extensions[language]}`;
  }

  private executeCompile(filePath: string, language: SupportedLanguage): Omit<CompileResult, 'executionTime' | 'language'> {
    let command: string;

    switch (language) {
      case 'typescript':
        command = `npx tsc "${filePath}" --noEmit --skipLibCheck`;
        break;
      case 'java':
        command = `javac "${filePath}"`;
        break;
      case 'cpp':
        command = `g++ -c "${filePath}" -o "${filePath}.o"`;
        break;
      case 'csharp':
        command = `csc "${filePath}"`;
        break;
      default:
        return { success: true, output: `${language} does not require a pre-compilation step.` };
    }

    try {
      const output = execSync(command, { timeout: 15000, encoding: 'utf-8' });
      return { success: true, output };
    } catch (error: any) {
      return { success: false, error: error.stderr || error.stdout || error.message };
    }
  }

  private executeCode(filePath: string, language: SupportedLanguage, input?: string): Omit<ExecuteResult, 'executionTime' | 'language'> {
    let command: string;

    switch (language) {
      case 'python':
        command = `python "${filePath}"`;
        break;
      case 'javascript':
        command = `node "${filePath}"`;
        break;
      case 'typescript':
        command = `npx ts-node --transpile-only "${filePath}"`;
        break;
      case 'java':
        const className = path.basename(filePath, '.java');
        command = `java -cp "${path.dirname(filePath)}" ${className}`;
        break;
      case 'cpp':
        const cppOut = path.join(path.dirname(filePath), `cpp_${Date.now()}.exe`);
        execSync(`g++ "${filePath}" -o "${cppOut}"`, { timeout: 15000 });
        command = `"${cppOut}"`;
        break;
      case 'go':
        command = `go run "${filePath}"`;
        break;
      case 'rust':
        const rustOut = path.join(path.dirname(filePath), `rust_${Date.now()}.exe`);
        execSync(`rustc "${filePath}" -o "${rustOut}"`, { timeout: 30000 });
        command = `"${rustOut}"`;
        break;
      case 'csharp':
        const csOut = path.join(path.dirname(filePath), `cs_${Date.now()}.exe`);
        execSync(`csc /out:"${csOut}" "${filePath}"`, { timeout: 30000 });
        command = `"${csOut}"`;
        break;
      default:
        return { success: false, error: `Language ${language} is not supported for execution.` };
    }

    try {
      const stdout = execSync(command, {
        timeout: 15000,
        encoding: 'utf-8',
        input: input,
      });
      return { success: true, stdout };
    } catch (error: any) {
      return {
        success: false,
        stderr: error.stderr || error.stdout || error.message,
        stdout: error.stdout,
      };
    }
  }

  private safeDelete(filePath: string): void {
    try {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch {}
  }

  async cleanup(): Promise<void> {
    try {
      if (fs.existsSync(this.tempDir)) {
        const files = fs.readdirSync(this.tempDir);
        files.forEach((file) => {
          this.safeDelete(path.join(this.tempDir, file));
        });
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

export const compilerService = new CompilerService();
