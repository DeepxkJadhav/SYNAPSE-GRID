"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const codeAssistant_1 = require("../services/codeAssistant");
const router = (0, express_1.Router)();
/**
 * Review code for issues and suggestions
 * POST /api/assistant/review
 * Body: { code: string, language: string }
 */
router.post('/review', async (req, res) => {
    try {
        const { code, language } = req.body;
        if (!code || !language) {
            return res.status(400).json({ error: 'Code and language are required' });
        }
        const review = await codeAssistant_1.codeAssistantBot.reviewCode(code, language);
        res.json(review);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Get code completion suggestions
 * POST /api/assistant/complete
 * Body: { code: string, language: string, context?: string }
 */
router.post('/complete', async (req, res) => {
    try {
        const { code, language, context } = req.body;
        if (!code || !language) {
            return res.status(400).json({ error: 'Code and language are required' });
        }
        const completion = await codeAssistant_1.codeAssistantBot.suggestCompletion(code, language, context);
        res.json(completion);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Analyze and fix bugs
 * POST /api/assistant/debug
 * Body: { errorMessage: string, code: string, language: string }
 */
router.post('/debug', async (req, res) => {
    try {
        const { errorMessage, code, language } = req.body;
        if (!errorMessage || !code || !language) {
            return res.status(400).json({ error: 'Error message, code, and language are required' });
        }
        const bugFix = await codeAssistant_1.codeAssistantBot.analyzeBug(errorMessage, code, language);
        res.json(bugFix);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Generate code from description
 * POST /api/assistant/generate
 * Body: { description: string, language: string }
 */
router.post('/generate', async (req, res) => {
    try {
        const { description, language } = req.body;
        if (!description || !language) {
            return res.status(400).json({ error: 'Description and language are required' });
        }
        const generated = await codeAssistant_1.codeAssistantBot.generateCode(description, language);
        res.json(generated);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Explain code
 * POST /api/assistant/explain
 * Body: { code: string, language: string }
 */
router.post('/explain', async (req, res) => {
    try {
        const { code, language } = req.body;
        if (!code || !language) {
            return res.status(400).json({ error: 'Code and language are required' });
        }
        const explanation = await codeAssistant_1.codeAssistantBot.explainCode(code, language);
        res.json({ explanation });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=assistant.js.map