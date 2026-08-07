/*
 * Build guards (immersionmilestones.md I7, and the two that
 * performancemilestones.md P8 asked for and never got).
 *
 * Runs from `postbuild`, after next-sitemap. Exits non-zero on a breach, which
 * fails the Netlify build — the point is to stop a regression shipping, not to
 * print a warning nobody reads.
 *
 * These exist because both things they check have already gone wrong once:
 *
 *   - P3 found 6.6 MB of unoptimised PNGs on the homepage, two of them over
 *     1.7 MB each.
 *   - I7 found `airbus-a380.zip` (34 MB) and `A380.rar` (23 MB) committed into
 *     public/ and deploying to Netlify, referenced by nothing. 57 MB of dead
 *     weight that nobody noticed because nothing was looking.
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';

/**
 * Eagerly-loaded homepage JavaScript, gzipped.
 *
 * Deliberately *not* the "First Load JS" figure the Next CLI prints — that is
 * computed inside Next's build and cannot be read back afterwards. This counts
 * the chunks the served HTML actually asks for, gzipped, which is the number a
 * visitor pays. It reads lower than the CLI's because the CLI reports parsed
 * size.
 */
const JS_BUDGET_KB = 140;

/** No single file in public/ may exceed this. */
const ASSET_BUDGET_KB = 220;

/** Everything public/ serves, together. */
const PUBLIC_TOTAL_BUDGET_MB = 3;

const failures = [];
const notes = [];

/* ── 1. Homepage eager JavaScript ─────────────────────────────────────────── */

const html = '.next/server/app/index.html';
if (!existsSync(html)) {
  failures.push(`cannot find ${html} — did the build run?`);
} else {
  const markup = readFileSync(html, 'utf8');
  const chunks = [...new Set([...markup.matchAll(/\/_next\/(static\/chunks\/[^"]+\.js)/g)].map((m) => m[1]))];

  let bytes = 0;
  for (const chunk of chunks) {
    const file = path.join('.next', chunk);
    if (existsSync(file)) bytes += gzipSync(readFileSync(file)).length;
  }

  const kb = bytes / 1024;
  notes.push(`homepage eager JS: ${kb.toFixed(1)} kB gzipped across ${chunks.length} chunks (budget ${JS_BUDGET_KB})`);
  if (kb > JS_BUDGET_KB) {
    failures.push(
      `homepage eager JS is ${kb.toFixed(1)} kB gzipped, over the ${JS_BUDGET_KB} kB budget.\n` +
        `      Something is being imported eagerly that should be dynamic({ ssr: false }).\n` +
        `      Check components/demos/index.tsx and any new section that pulls a demo in directly.`
    );
  }
}

/* ── 2. public/ assets ────────────────────────────────────────────────────── */

/*
 * Only git-tracked files are checked. Untracked ones never reach Netlify, and
 * this repo deliberately keeps large sources on disk — the 107 MB A380 OBJ, the
 * browser icon PNGs — that are gitignored precisely so they cannot deploy.
 * Checking the working tree instead would fail on files that are already
 * handled correctly.
 */
let tracked = [];
try {
  tracked = execSync('git ls-files public/', { encoding: 'utf8' })
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
} catch {
  notes.push('git unavailable — skipped the public/ asset check');
}

let total = 0;
for (const file of tracked) {
  if (!existsSync(file)) continue;
  const size = statSync(file).size;
  total += size;
  const kb = size / 1024;
  if (kb > ASSET_BUDGET_KB) {
    failures.push(
      `${file} is ${kb.toFixed(0)} kB, over the ${ASSET_BUDGET_KB} kB per-file budget.\n` +
        `      Convert it to WebP and size it for how it is actually displayed, or\n` +
        `      gitignore it if it is a source file that should not deploy.`
    );
  }
}

if (tracked.length) {
  const mb = total / 1048576;
  notes.push(`public/ deploys ${mb.toFixed(2)} MB across ${tracked.length} files (budget ${PUBLIC_TOTAL_BUDGET_MB} MB)`);
  if (mb > PUBLIC_TOTAL_BUDGET_MB) {
    failures.push(`public/ totals ${mb.toFixed(2)} MB, over the ${PUBLIC_TOTAL_BUDGET_MB} MB budget.`);
  }
}

/* ── Report ───────────────────────────────────────────────────────────────── */

for (const note of notes) console.log(`  ✓ ${note}`);

if (failures.length) {
  console.error('\n  Build budget exceeded:\n');
  for (const f of failures) console.error(`    ✗ ${f}\n`);
  console.error('  These budgets exist because both have been breached before —');
  console.error('  see performancemilestones.md P3 and immersionmilestones.md I7.\n');
  process.exit(1);
}

console.log('  ✓ budgets OK\n');
