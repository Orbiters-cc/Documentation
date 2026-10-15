// Validates the tool screenshot galleries under media/tools/<tool>/: one
// gallery.json manifest per tool and the WebP files it lists. See the
// "Tool screenshot galleries" section of AGENTS.md for the contract.

const fs = require('fs');
const path = require('path');
const { webpInfo } = require('./webp-info');

const GALLERY = Object.freeze({
    tools: ['refit', 'myavatar', 'mcb', 'logger', 'unitgit', 'xraygizmos', 'toolkit'],
    locales: ['ja', 'fr', 'es', 'pt-BR'],
    stages: ['stable', 'beta', 'alpha'],
    manifest: 'gallery.json',
    maxEntries: 24,
    maxBytes: 600 * 1024,
    maxEdge: 1920,
    minEdge: 240,
    captionMax: 120,
    translatedCaptionMax: 160,
    altMax: 300,
    labelMax: 60,
    staleAfterDays: 180,
});
const FILE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*\.webp$/;
const VERSION_PATTERN = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
const ENTRY_KEYS = new Set(['file', 'caption', 'alt', 'window', 'feature', 'toolVersion', 'capturedAt', 'stage', 'translations']);
const TRANSLATION_KEYS = new Set(['caption', 'alt']);
const MANIFEST_KEYS = new Set(['schema', 'tool', 'screenshots']);

const isText = (value) => typeof value === 'string' && value.trim().length > 0;
// Case-sensitive: "todo" is an ordinary word in Spanish and Portuguese.
const hasPlaceholder = (value) => /\b(?:TODO|TBD|FIXME)\b/.test(value) || /lorem ipsum/i.test(value);

function checkText(errors, label, value, max, required = true) {
    if (value === undefined && !required) return;
    if (!isText(value)) return errors.push(`${label} must be a non-empty string`);
    if (value !== value.trim()) errors.push(`${label} has leading or trailing spaces`);
    if (/[\r\n]/.test(value)) errors.push(`${label} must be one line`);
    if (value.length > max) errors.push(`${label} is ${value.length} characters (max ${max})`);
    if (hasPlaceholder(value)) errors.push(`${label} contains a placeholder marker`);
}

function checkDate(errors, label, value, now) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
        return errors.push(`${label} must be a YYYY-MM-DD date`);
    }
    if (Date.parse(`${value}T00:00:00Z`) > now) errors.push(`${label} is in the future: ${value}`);
}

function checkImage(errors, label, filePath) {
    const stat = fs.lstatSync(filePath);
    if (!stat.isFile()) return errors.push(`${label} is not a regular file`);
    if (stat.size > GALLERY.maxBytes) errors.push(`${label} is ${Math.round(stat.size / 1024)} KB (max ${GALLERY.maxBytes / 1024} KB)`);
    const info = webpInfo(fs.readFileSync(filePath), stat.size);
    if (!info) return errors.push(`${label} is not a complete still WebP image`);
    const longest = Math.max(info.width, info.height), shortest = Math.min(info.width, info.height);
    if (longest > GALLERY.maxEdge) errors.push(`${label} is ${info.width}x${info.height} (longest edge max ${GALLERY.maxEdge}px)`);
    if (shortest < GALLERY.minEdge) errors.push(`${label} is ${info.width}x${info.height} (shortest edge min ${GALLERY.minEdge}px)`);
}

function checkTranslations(errors, label, translations) {
    if (translations === undefined) return;
    if (!translations || typeof translations !== 'object' || Array.isArray(translations)) return errors.push(`${label}.translations must be an object`);
    for (const [locale, values] of Object.entries(translations)) {
        if (!GALLERY.locales.includes(locale)) {
            errors.push(`${label}.translations has an unknown language "${locale}" (use ${GALLERY.locales.join(', ')})`);
            continue;
        }
        if (!values || typeof values !== 'object' || Array.isArray(values)) {
            errors.push(`${label}.translations.${locale} must be an object`);
            continue;
        }
        for (const key of Object.keys(values)) if (!TRANSLATION_KEYS.has(key)) errors.push(`${label}.translations.${locale} has an unknown field "${key}"`);
        checkText(errors, `${label}.translations.${locale}.caption`, values.caption, GALLERY.translatedCaptionMax, false);
        checkText(errors, `${label}.translations.${locale}.alt`, values.alt, GALLERY.altMax, false);
    }
}

function checkEntry(errors, warnings, entry, index, directory, now) {
    const label = `screenshots[${index}]`;
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return errors.push(`${label} must be an object`);
    for (const key of Object.keys(entry)) if (!ENTRY_KEYS.has(key)) errors.push(`${label} has an unknown field "${key}"`);
    if (!FILE_PATTERN.test(String(entry.file || ''))) {
        errors.push(`${label}.file must be a lowercase kebab-case .webp name in this folder`);
    } else if (!fs.existsSync(path.join(directory, entry.file))) {
        errors.push(`${label}.file ${entry.file} does not exist`);
    } else {
        checkImage(errors, entry.file, path.join(directory, entry.file));
    }
    checkText(errors, `${label}.caption`, entry.caption, GALLERY.captionMax);
    checkText(errors, `${label}.alt`, entry.alt, GALLERY.altMax);
    checkText(errors, `${label}.window`, entry.window, GALLERY.labelMax);
    checkText(errors, `${label}.feature`, entry.feature, GALLERY.labelMax);
    if (!VERSION_PATTERN.test(String(entry.toolVersion || ''))) errors.push(`${label}.toolVersion must be the package version, such as 1.2.3`);
    checkDate(errors, `${label}.capturedAt`, entry.capturedAt, now);
    if (entry.stage !== undefined && !GALLERY.stages.includes(entry.stage)) errors.push(`${label}.stage must be one of ${GALLERY.stages.join(', ')}`);
    checkTranslations(errors, label, entry.translations);
    const captured = Date.parse(`${entry.capturedAt}T00:00:00Z`);
    if (captured < now - GALLERY.staleAfterDays * 86400000) warnings.push(`${entry.file} was captured on ${entry.capturedAt}: check it still shows the current tool`);
}

function validateTool(tool, directory, now) {
    const errors = [], warnings = [];
    const manifestPath = path.join(directory, GALLERY.manifest);
    if (!fs.existsSync(manifestPath)) return { errors: [`Missing ${GALLERY.manifest}`], warnings, count: 0 };
    let manifest;
    try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (error) {
        return { errors: [`${GALLERY.manifest} is not valid JSON: ${error.message}`], warnings, count: 0 };
    }
    for (const key of Object.keys(manifest || {})) if (!MANIFEST_KEYS.has(key)) errors.push(`Unknown manifest field "${key}"`);
    if (manifest.schema !== 1) errors.push('schema must be 1');
    if (manifest.tool !== tool) errors.push(`tool must be "${tool}" (the folder name)`);
    const screenshots = Array.isArray(manifest.screenshots) ? manifest.screenshots : null;
    if (!screenshots || screenshots.length === 0) errors.push('screenshots must list at least one screenshot (delete the folder to remove a gallery)');
    else if (screenshots.length > GALLERY.maxEntries) errors.push(`${screenshots.length} screenshots (max ${GALLERY.maxEntries}): replace outdated shots instead of adding more`);
    const listed = new Set();
    for (const [index, entry] of (screenshots || []).entries()) {
        checkEntry(errors, warnings, entry, index, directory, now);
        if (entry && entry.file) {
            if (listed.has(entry.file)) errors.push(`${entry.file} is listed twice`);
            listed.add(entry.file);
        }
    }
    for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
        if (item.name === GALLERY.manifest) continue;
        if (!item.isFile()) errors.push(`Unexpected entry ${item.name}: a gallery folder holds only ${GALLERY.manifest} and WebP files`);
        else if (!listed.has(item.name)) errors.push(`Orphan file ${item.name} is not listed in ${GALLERY.manifest}`);
    }
    return { errors, warnings, count: listed.size };
}

/** Validates every gallery under `<repositoryRoot>/media/tools`. */
function validateGalleries(repositoryRoot, now = Date.now()) {
    const root = path.join(repositoryRoot, 'media', 'tools');
    const results = [];
    if (!fs.existsSync(root)) return results;
    for (const item of fs.readdirSync(root, { withFileTypes: true })) {
        const relativePath = `media/tools/${item.name}`;
        if (!item.isDirectory()) {
            results.push({ relativePath, errors: ['Only tool folders belong in media/tools'], warnings: [], count: 0 });
        } else if (!GALLERY.tools.includes(item.name)) {
            results.push({ relativePath, errors: [`Unknown tool folder (use ${GALLERY.tools.join(', ')})`], warnings: [], count: 0 });
        } else {
            results.push({ relativePath, ...validateTool(item.name, path.join(root, item.name), now) });
        }
    }
    return results;
}

module.exports = { GALLERY, FILE_PATTERN, validateGalleries };
