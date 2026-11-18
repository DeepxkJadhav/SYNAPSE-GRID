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
export declare class CompilerService {
    private tempDir;
    constructor();
    compile(code: string, language: SupportedLanguage): Promise<CompileResult>;
    execute(code: string, language: SupportedLanguage, input?: string): Promise<ExecuteResult>;
    private generateFileName;
    private executeCompile;
    private executeCode;
    private safeDelete;
    cleanup(): Promise<void>;
}
export declare const compilerService: CompilerService;
//# sourceMappingURL=compiler.d.ts.map