#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const REPOSITORY_ROOT = path.resolve(__dirname, '..');
const DOCS_ROOT = path.join(REPOSITORY_ROOT, 'docs');
const REQUIRED_FIELDS = [
    'title', 'section', 'order', 'audience', 'stage',
    'id', 'domain', 'type', 'owner', 'lastVerified',
];
const AUDIENCES = new Set(['public', 'user', 'creator', 'mod', 'admin', 'dev']);
const STAGES = new Set(['stable', 'beta', 'alpha']);
const DOMAINS = new Set(['general', 'website', 'mcb', 'refit', 'unitgit', 'xraygizmos', 'operations']);
const TYPES = new Set(['tutorial', 'how-to', 'reference', 'explanation', 'decision', 'runbook', 'invariant']);
const STALE_AFTER_DAYS = 180;

const walkMarkdown = (directory) => fs.readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) return walkMarkdown(fullPath);
        return entry.isFile() && entry.name.toLowerCase().endsWith('.md') ? [fullPath] : [];
    });

const unquote = (value) => String(value || '').trim().replace(/^['"]|['"]$/g, '');
const scalarList = (value) => unquote(value)
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .split(',')
    .map((item) => unquote(item).toLowerCase())
    .filter(Boolean);

const parsePage = (filePath) => {
    const markdown = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(REPOSITORY_ROOT, filePath).replace(/\\/g, '/');
    const errors = [];
    if (!markdown.startsWith('---')) {
        return { filePath, relativePath, metadata: {}, content: markdown, errors: ['Missing frontmatter'] };
    }
    const end = markdown.indexOf('\n---', 3);
    if (end === -1) {
        return { filePath, relativePath, metadata: {}, content: markdown, errors: ['Unclosed frontmatter'] };
    }
    const metadata = {};
    const raw = markdown.slice(3, end).trim();
    for (const [index, line] of raw.split(/\r?\n/).entries()) {
        if (!line.trim()) continue;
        const separator = line.indexOf(':');
        if (separator < 1) {
            errors.push(`Invalid frontmatter line ${index + 1}`);
            continue;
        }
        const key = line.slice(0, separator).trim();
        if (Object.prototype.hasOwnProperty.call(metadata, key)) errors.push(`Duplicate frontmatter field: ${key}`);
        metadata[key] = unquote(line.slice(separator + 1));
    }
    return {
        filePath,
        relativePath,
        metadata,
        content: markdown.slice(end + 4).replace(/^\r?\n/, ''),
        errors,
    };
};

const defaultSlug = (filePath) => path.basename(filePath, path.extname(filePath))
    .replace(/^\d+[-_]/, '')
    .toLowerCase();

const isInsideDocs = (candidate) => {
    const relative = path.relative(DOCS_ROOT, candidate);
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
};

const validateRelativeLinks = (page) => {
    const failures = [];
    const pattern = /\[[^\]]*\]\(([^)]+)\)/g;
    let match;
    while ((match = pattern.exec(page.content)) !== null) {
        const rawTarget = match[1].trim().replace(/^<|>$/g, '');
        if (!rawTarget || /^(?:https?:|mailto:|orbiters:|#|\/)/i.test(rawTarget)) continue;
        const target = decodeURIComponent(rawTarget.split('#')[0]);
        if (!target.toLowerCase().endsWith('.md')) continue;
        const resolved = path.resolve(path.dirname(page.filePath), target);
        if (!isInsideDocs(resolved) || !fs.existsSync(resolved)) failures.push(`Broken relative link: ${rawTarget}`);
    }
    return failures;
};

const validatePage = (page) => {
    const { metadata, content } = page;
    const prose = content.replace(/```[\s\S]*?```/g, '');
    for (const field of REQUIRED_FIELDS) {
        if (!String(metadata[field] || '').trim()) page.errors.push(`Missing required field: ${field}`);
    }
    const audiences = scalarList(metadata.audience);
    if (audiences.length === 0) page.errors.push('At least one audience is required');
    const unknownAudiences = audiences.filter((value) => !AUDIENCES.has(value));
    if (unknownAudiences.length) page.errors.push(`Unknown audience: ${unknownAudiences.join(', ')}`);
    if (metadata.stage && !STAGES.has(metadata.stage.toLowerCase())) page.errors.push(`Unknown stage: ${metadata.stage}`);
    if (metadata.domain && !DOMAINS.has(metadata.domain.toLowerCase())) page.errors.push(`Unknown domain: ${metadata.domain}`);
    if (metadata.type && !TYPES.has(metadata.type.toLowerCase())) page.errors.push(`Unknown type: ${metadata.type}`);
    if (metadata.id && !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(metadata.id)) page.errors.push(`Invalid stable ID: ${metadata.id}`);
    if (metadata.owner && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.owner)) page.errors.push(`Invalid owner key: ${metadata.owner}`);
    if (metadata.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.slug)) page.errors.push(`Invalid slug: ${metadata.slug}`);
    if (metadata.order && (!Number.isInteger(Number(metadata.order)) || Number(metadata.order) < 0)) page.errors.push(`Invalid order: ${metadata.order}`);
    if (metadata.lastVerified) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(metadata.lastVerified) || Number.isNaN(Date.parse(`${metadata.lastVerified}T00:00:00Z`))) {
            page.errors.push(`Invalid lastVerified date: ${metadata.lastVerified}`);
        } else if (new Date(`${metadata.lastVerified}T00:00:00Z`) > new Date()) {
            page.errors.push(`lastVerified is in the future: ${metadata.lastVerified}`);
        }
    }
    if (!/^#\s+\S/m.test(content)) page.errors.push('Page needs a level-one heading');
    if (/\b(?:TODO|TBD)\b/.test(prose)) page.errors.push('Placeholder marker found (TODO or TBD)');
    const audienceOpens = (prose.match(/^\s*<audience\b[^>]*>\s*$/gim) || []).length;
    const audienceCloses = (prose.match(/^\s*<\/audience>\s*$/gim) || []).length;
    if (audienceOpens !== audienceCloses) page.errors.push('Malformed audience block');
    for (const stage of ['alpha', 'beta']) {
        const opens = (prose.match(new RegExp(`^\\s*<${stage}(?:\\s[^>]*)?>\\s*$`, 'gim')) || []).length;
        const closes = (prose.match(new RegExp(`^\\s*</${stage}>\\s*$`, 'gim')) || []).length;
        if (opens !== closes) page.errors.push(`Malformed ${stage} block`);
    }
    page.errors.push(...validateRelativeLinks(page));
};

const pages = walkMarkdown(DOCS_ROOT).map(parsePage);
for (const page of pages) validatePage(page);

const duplicateErrors = (field, valueFor) => {
    const seen = new Map();
    for (const page of pages) {
        const value = valueFor(page);
        if (!value) continue;
        if (seen.has(value)) {
            page.errors.push(`Duplicate ${field}: ${value} (also in ${seen.get(value)})`);
        } else {
            seen.set(value, page.relativePath);
        }
    }
};
duplicateErrors('ID', (page) => page.metadata.id);
duplicateErrors('slug', (page) => page.metadata.slug || defaultSlug(page.filePath));

const knownIds = new Set(pages.map((page) => page.metadata.id).filter(Boolean));
for (const page of pages) {
    for (const relation of scalarList(page.metadata.relations || page.metadata.related)) {
        if (!knownIds.has(relation)) page.errors.push(`Unknown relation ID: ${relation}`);
    }
}

let failureCount = 0;
for (const page of pages) {
    if (page.errors.length === 0) continue;
    failureCount += page.errors.length;
    console.error(`\n${page.relativePath}`);
    for (const error of page.errors) console.error(`  - ${error}`);
}

const staleBefore = Date.now() - STALE_AFTER_DAYS * 86400000;
const stale = pages.filter((page) => {
    const value = page.metadata.lastVerified;
    return value && Date.parse(`${value}T00:00:00Z`) < staleBefore;
});
for (const page of stale) console.warn(`Warning: ${page.relativePath} was last verified on ${page.metadata.lastVerified}`);

if (failureCount > 0) {
    console.error(`\nDocumentation validation failed with ${failureCount} error(s) across ${pages.length} page(s).`);
    process.exit(1);
}

console.log(`Documentation validation passed: ${pages.length} page(s), ${stale.length} stale warning(s).`);
