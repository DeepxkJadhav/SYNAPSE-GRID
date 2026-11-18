"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeAssistantBot = exports.CodeAssistantBot = void 0;
const openai_1 = __importDefault(require("openai"));
class CodeAssistantBot {
    constructor(apiKey) {
        const key = apiKey || process.env.OPENAI_API_KEY || '';
        this.hasApiKey = !!key && !key.startsWith('sk-synapse');
        this.client = new openai_1.default({
            apiKey: key || 'sk-synapse-offline-key',
        });
    }
    async reviewCode(code, language) {
        try {
            const response = await this.client.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert code reviewer. Analyze the following ${language} code and provide a JSON response with:
            {
              "issues": [list of bugs or potential issues],
              "suggestions": [list of improvement suggestions],
              "overallScore": number from 0-100
            }`,
                    },
                    {
                        role: 'user',
                        content: code,
                    },
                ],
                temperature: 0.7,
            });
            const content = response.choices[0]?.message?.content || '{}';
            const result = JSON.parse(this.extractJSON(content));
            return {
                issues: result.issues || [],
                suggestions: result.suggestions || [],
                overallScore: result.overallScore || 0,
            };
        }
        catch (error) {
            console.error('Code review error:', error);
            return {
                issues: ['Error during code review'],
                suggestions: [],
                overallScore: 0,
            };
        }
    }
    async suggestCompletion(code, language, context) {
        try {
            const prompt = context
                ? `${context}\n\nComplete this ${language} code:\n${code}`
                : `Complete this ${language} code:\n${code}`;
            const response = await this.client.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are an intelligent code completion assistant for ${language}. Provide only the code completion without explanation.`,
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.5,
                max_tokens: 150,
            });
            const suggestion = response.choices[0]?.message?.content || '';
            return {
                suggestion: suggestion.trim(),
                confidence: 0.85,
            };
        }
        catch (error) {
            console.error('Completion suggestion error:', error);
            return {
                suggestion: '// Unable to generate suggestion',
                confidence: 0,
            };
        }
    }
    async analyzeBug(errorMessage, code, language) {
        try {
            const response = await this.client.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert debugger. Analyze the error and provide a JSON response with:
            {
              "problem": "description of the problem",
              "solution": "the fixed code",
              "explanation": "why this fixes the issue"
            }`,
                    },
                    {
                        role: 'user',
                        content: `Error: ${errorMessage}\n\nCode in ${language}:\n${code}`,
                    },
                ],
                temperature: 0.7,
            });
            const content = response.choices[0]?.message?.content || '{}';
            const result = JSON.parse(this.extractJSON(content));
            return {
                problem: result.problem || errorMessage,
                solution: result.solution || code,
                explanation: result.explanation || 'Unable to analyze this bug',
            };
        }
        catch (error) {
            console.error('Bug analysis error:', error);
            return {
                problem: errorMessage,
                solution: code,
                explanation: 'Error during analysis',
            };
        }
    }
    async generateCode(description, language) {
        try {
            const response = await this.client.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert ${language} code generator. Generate clean, well-commented code. Respond with a JSON object:
            {
              "code": "the generated code",
              "explanation": "brief explanation of what the code does"
            }`,
                    },
                    {
                        role: 'user',
                        content: `Generate ${language} code for: ${description}`,
                    },
                ],
                temperature: 0.8,
                max_tokens: 500,
            });
            const content = response.choices[0]?.message?.content || '{}';
            const result = JSON.parse(this.extractJSON(content));
            return {
                code: result.code || '',
                explanation: result.explanation || 'Generated code for your request',
            };
        }
        catch (error) {
            console.error('Code generation error:', error);
            return {
                code: '// Unable to generate code',
                explanation: 'Error during code generation',
            };
        }
    }
    async explainCode(code, language) {
        try {
            const response = await this.client.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert code educator. Explain ${language} code clearly and concisely.`,
                    },
                    {
                        role: 'user',
                        content: `Explain this ${language} code:\n${code}`,
                    },
                ],
                temperature: 0.7,
                max_tokens: 300,
            });
            return response.choices[0]?.message?.content || 'Unable to explain code';
        }
        catch (error) {
            console.error('Code explanation error:', error);
            return 'Error during explanation';
        }
    }
    extractJSON(content) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        return jsonMatch ? jsonMatch[0] : content;
    }
}
exports.CodeAssistantBot = CodeAssistantBot;
exports.codeAssistantBot = new CodeAssistantBot();
//# sourceMappingURL=codeAssistant.js.map