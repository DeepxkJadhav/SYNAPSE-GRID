export interface CodeReview {
    issues: string[];
    suggestions: string[];
    overallScore: number;
}
export interface CodeCompletion {
    suggestion: string;
    confidence: number;
}
export interface BugFix {
    problem: string;
    solution: string;
    explanation: string;
}
export interface GeneratedCode {
    code: string;
    explanation: string;
}
export declare class CodeAssistantBot {
    private client;
    constructor(apiKey?: string);
    reviewCode(code: string, language: string): Promise<CodeReview>;
    suggestCompletion(code: string, language: string, context?: string): Promise<CodeCompletion>;
    analyzeBug(errorMessage: string, code: string, language: string): Promise<BugFix>;
    generateCode(description: string, language: string): Promise<GeneratedCode>;
    explainCode(code: string, language: string): Promise<string>;
    private extractJSON;
}
export declare const codeAssistantBot: CodeAssistantBot;
//# sourceMappingURL=codeAssistant.d.ts.map