#!/usr/bin/env node
// Converts a Unity capture (PNG from Library/OrbitersToolkit/Screenshots) into a
// gallery WebP under media/tools/<tool>/ and prints the manifest fields it can
// infer. Run `npm install` in the Documentation folder once to get sharp.
//
//   node scripts/gallery/import-screenshot.js --tool refit --name fit-preview --source <capture.png> [--overwrite]

const fs = require('fs');
const path = require('path');
const { GALLERY, FILE_PATTERN } = require('./validate-galleries');

const REPOSITORY_ROOT = path.resolve(__dirname, '..', '..');
const USAGE = 'Usage: node scripts/gallery/import-screenshot.js --tool <tool> --name <kebab-name> --source <capture.png> [--overwrite]';

function parseArguments(argv) {
    const options = { overwrite: false };
    for (let index = 0; index < argv.length; index += 1) {
        const flag = argv[index];
        if (flag === '--overwrite') options.overwrite = true;
        else if (['--tool', '--name', '--source'].includes(flag) && argv[index + 1]) options[flag.slice(2)] = argv[++index];
        else throw new Error(`Unknown or incomplete argument: ${flag}\n${USAGE}`);
    }
    for (const required of ['tool', 'name', 'source']) if (!options[required]) throw new Error(`Missing --${required}\n${USAGE}`);
    if (!GALLERY.tools.includes(options.tool)) throw new Error(`Unknown tool "${options.tool}" (use ${GALLERY.tools.join(', ')})`);
    options.file = options.name.toLowerCase().endsWith('.webp') ? options.name : `${options.name}.webp`;
    if (!FILE_PATTERN.test(options.file)) throw new Error(`--name must be lowercase kebab-case, such as "fit-preview" (got "${options.name}")`);
    if (!fs.existsSync(options.source)) throw new Error(`Capture not found: ${options.source}`);
    return options;
}

function loadSharp() {
    try {
        return require('sharp');
    } catch {
        throw new Error('sharp is not installed: run `npm install` in the Documentation folder first.');
    }
}

// Flat editor UI usually compresses best without loss (text stays pixel exact);
// 3D views compress far better lossy. Keep lossless unless it costs over 15% more.
async function encode(sharp, source) {
    const base = () => sharp(source, { failOn: 'error' }).rotate()
        .resize({ width: GALLERY.maxEdge, height: GALLERY.maxEdge, fit: 'inside', withoutEnlargement: true });
    const lossless = await base().webp({ lossless: true, effort: 6 }).toBuffer({ resolveWithObject: true });
    for (const quality of [90, 84, 78, 70, 62]) {
        const lossy = await base().webp({ quality, effort: 6, smartSubsample: true }).toBuffer({ resolveWithObject: true });
        const pick = quality === 90 && lossless.data.length <= lossy.data.length * 1.15 ? { ...lossless, mode: 'lossless' } : { ...lossy, mode: `lossy q${quality}` };
        if (pick.data.length <= GALLERY.maxBytes) return pick;
    }
    throw new Error(`The capture stays above ${GALLERY.maxBytes / 1024} KB even at low quality: capture a smaller window or region.`);
}

// Orbiters Toolkit names captures <Window>-<yyyyMMdd>-<HHmmss>-<ms>-<id>.png.
function inferFromCapture(source) {
    const match = path.basename(source).match(/^([A-Za-z][A-Za-z0-9]*)-(\d{4})(\d{2})(\d{2})-\d{6}/);
    if (match) return { window: match[1], capturedAt: `${match[2]}-${match[3]}-${match[4]}` };
    return { window: null, capturedAt: fs.statSync(source).mtime.toISOString().slice(0, 10) };
}

async function main() {
    const options = parseArguments(process.argv.slice(2));
    const sharp = loadSharp();
    const directory = path.join(REPOSITORY_ROOT, 'media', 'tools', options.tool);
    const target = path.join(directory, options.file);
    if (fs.existsSync(target) && !options.overwrite) throw new Error(`${path.relative(REPOSITORY_ROOT, target)} exists: pass --overwrite to replace it.`);
    const result = await encode(sharp, options.source);
    const { width, height } = result.info;
    if (Math.min(width, height) < GALLERY.minEdge) throw new Error(`The capture is ${width}x${height}: the shortest edge must be at least ${GALLERY.minEdge}px.`);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(target, result.data);
    const inferred = inferFromCapture(options.source);
    console.log(`Wrote ${path.relative(REPOSITORY_ROOT, target).replace(/\\/g, '/')}: ${width}x${height}, ${Math.round(result.data.length / 1024)} KB (${result.mode}).`);
    console.log('Manifest fields from the capture (add caption, alt, feature, toolVersion and translations yourself):');
    console.log(JSON.stringify({ file: options.file, window: inferred.window, capturedAt: inferred.capturedAt }, null, 2));
    console.log('Then run: node scripts/validate-docs.js');
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
