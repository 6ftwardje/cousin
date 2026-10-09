import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { build, dist, loadContent } from './build.mjs';
import { routes } from '../src/render.mjs';

await build();
const failures = [];
const pages = new Map();
for (const route of routes) {
  const html = await readFile(join(dist, route.href, 'index.html'), 'utf8');
  pages.set(route.href, html);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) failures.push(`${route.href}: verwacht één h1`);
  if (!html.includes('noindex, nofollow')) failures.push(`${route.href}: preview moet noindex blijven`);
  if (!/<title>[^<]+<\/title>/.test(html)) failures.push(`${route.href}: title ontbreekt`);
  if (!/<meta name="description" content="[^"]+">/.test(html)) failures.push(`${route.href}: description ontbreekt`);
  if (/href="#"|undefined|\[object Object\]/.test(html)) failures.push(`${route.href}: ongeldige content of lege link`);
}

for (const [path, html] of pages) {
  for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const [file, anchor] = match[1].split('#');
    let target = join(dist, file);
    if (file.endsWith('/')) target = join(target, 'index.html');
    try { await stat(target); } catch { failures.push(`${path}: ontbrekende bestemming ${match[1]}`); }
    if (anchor && pages.has(file) && !pages.get(file).includes(`id="${anchor}"`)) failures.push(`${path}: ontbrekend anker ${match[1]}`);
  }
}

const content = await loadContent();
for (const field of ['bookingUrl', 'instagramUrl']) {
  const value = content.brand[field];
  if (value !== null) {
    try { if (new URL(value).protocol !== 'https:') failures.push(`${field}: verwacht HTTPS`); }
    catch { failures.push(`${field}: ongeldige URL`); }
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log('OK: 6 pagina’s, metadata, preview-indexatie, interne links, ankers en lokale assets.');
