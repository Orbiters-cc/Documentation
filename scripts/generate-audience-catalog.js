#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../docs');
const destination = path.join(root, 'reference/documentation-audience-catalog.md');
const frontmatter = `---
title: Documentation Audience Catalog
section: Reference
order: 70
audience: admin, dev
stage: stable
id: orbiters.reference.documentation-audience-catalog
domain: website
type: reference
owner: orbiters-docs
lastVerified: 2026-09-06
---
`;
const profiles = [['public'], ['public', 'user'], ['public', 'user', 'creator'], ['public', 'user', 'mod'],
    ['public', 'user', 'mod', 'admin'], ['public', 'user', 'creator', 'mod', 'admin', 'dev']];
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : file.endsWith('.md') ? [file] : [];
});
const parse = text => Object.fromEntries((text.split('---')[1] || '').trim().split(/\r?\n/).map(line => {
    const colon = line.indexOf(':'); return [line.slice(0, colon), line.slice(colon + 1).trim()];
}));
const documents = walk(root).filter(file => file !== destination).map(file => parse(fs.readFileSync(file, 'utf8')));
documents.push(parse(frontmatter));
const groups = [...new Set(documents.map(doc => doc.section))].sort();
let content = `${frontmatter}
# Every page's audience, in one place

Use this catalog to audit the documentation split. A check means the base profile matches at least one page audience. The selected release mode must also include the page's stage.

Admin and moderator profiles here have no creator flag; adding that flag grants creator-audience access. Developer and owner share the final column. Source and token restrictions can reduce access. Page titles appear here for auditing; listing a title does not make its body readable.

For inline boundaries and application resources, read [Who sees what](/documentation/orbiters.reference.visibility-atlas). Open an allowed page and enable its inspection switch to see the boundaries inside the content.

Regenerate this catalog with \`node scripts/generate-audience-catalog.js\` after changing page metadata. Do not edit its tables by hand.
`;
for (const section of groups) {
    content += `\n## ${section}\n\n| Page | Audience tags | Stage | Visitor | Member | Creator | Mod | Admin | Dev / owner |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n`;
    for (const doc of documents.filter(entry => entry.section === section).sort((a, b) => Number(a.order) - Number(b.order) || a.title.localeCompare(b.title))) {
        const tags = doc.audience.split(',').map(tag => tag.trim());
        content += `| ${doc.title.replace(/\|/g, '/')} | ${tags.join(', ')} | ${doc.stage} | ${profiles.map(profile => tags.some(tag => profile.includes(tag)) ? '✓' : '—').join(' | ')} |\n`;
    }
}
fs.writeFileSync(destination, content);
console.log(`Wrote visibility catalog for ${documents.length} pages.`);
