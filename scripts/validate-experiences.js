const KINDS = new Set(['release-access', 'commission-receipt', 'workspace-states', 'discord-roles', 'audience-lens', 'mcb-version-tour']);
const text = (value, limit = 1200) => typeof value === 'string' && value.trim().length > 0 && value.length <= limit;
function validateExperiences(content) {
    const errors = [];
    for (const match of content.matchAll(/^```orbiters\s*\r?\n([\s\S]*?)^```\s*$/gm)) {
        try {
            if (match[1].length > 10000) throw new Error('Example is too large');
            const spec = JSON.parse(match[1]);
            if (!spec || typeof spec !== 'object' || Array.isArray(spec)) throw new Error('Expected an object');
            if (KINDS.has(spec.kind)) continue;
            if (spec.kind !== 'challenge') throw new Error(`Unknown example kind: ${spec.kind}`);
            if (!text(spec.title, 180) || !text(spec.question) || !Array.isArray(spec.options)
                || spec.options.length < 2 || spec.options.length > 4 || spec.options.filter(item => item.correct === true).length !== 1
                || !spec.options.every(item => item && text(item.label, 180) && text(item.explanation) && typeof item.correct === 'boolean')) throw new Error('Challenge needs a title, question and 2–4 explained choices with one correct answer');
        } catch (error) { errors.push(`Invalid interactive example: ${error.message}`); }
    }
    return errors;
}
module.exports = { validateExperiences, KINDS };
