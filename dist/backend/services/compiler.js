"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.compilerService = exports.CompilerService = void 0;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class CompilerService {
    constructor() {
        this.tempDir = path.join(__dirname, '../../temp_files');
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }
    async compile(code, language) {
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
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                executionTime: Date.now() - startTime,
                language,
            };
        }
        finally {
            this.safeDelete(filePath);
        }
    }
    async execute(code, language, input) {
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
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                executionTime: Date.now() - startTime,
                language,
            };
        }
        finally {
            this.safeDelete(filePath);
        }
    }
    generateFileName(language) {
        const extensions = {
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
    executeCompile(filePath, language) {
        let command;
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
            const output = (0, child_process_1.execSync)(command, { timeout: 15000, encoding: 'utf-8' });
            return { success: true, output };
        }
        catch (error) {
            return { success: false, error: error.stderr || error.stdout || error.message };
        }
    }
    executeCode(filePath, language, input) {
        let command;
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
                (0, child_process_1.execSync)(`g++ "${filePath}" -o "${cppOut}"`, { timeout: 15000 });
                command = `"${cppOut}"`;
                break;
            case 'go':
                command = `go run "${filePath}"`;
                break;
            case 'rust':
                const rustOut = path.join(path.dirname(filePath), `rust_${Date.now()}.exe`);
                (0, child_process_1.execSync)(`rustc "${filePath}" -o "${rustOut}"`, { timeout: 30000 });
                command = `"${rustOut}"`;
                break;
            case 'csharp':
                const csOut = path.join(path.dirname(filePath), `cs_${Date.now()}.exe`);
                (0, child_process_1.execSync)(`csc /out:"${csOut}" "${filePath}"`, { timeout: 30000 });
                command = `"${csOut}"`;
                break;
            default:
                return { success: false, error: `Language ${language} is not supported for execution.` };
        }
        try {
            const stdout = (0, child_process_1.execSync)(command, {
                timeout: 15000,
                encoding: 'utf-8',
                input: input,
            });
            return { success: true, stdout };
        }
        catch (error) {
            return {
                success: false,
                stderr: error.stderr || error.stdout || error.message,
                stdout: error.stdout,
            };
        }
    }
    safeDelete(filePath) {
        try {
            if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        catch { }
    }
    async cleanup() {
        try {
            if (fs.existsSync(this.tempDir)) {
                const files = fs.readdirSync(this.tempDir);
                files.forEach((file) => {
                    this.safeDelete(path.join(this.tempDir, file));
                });
            }
        }
        catch (error) {
            console.error('Cleanup error:', error);
        }
    }
}
exports.CompilerService = CompilerService;
exports.compilerService = new CompilerService();
//# sourceMappingURL=compiler.js.map