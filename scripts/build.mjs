import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { renderPage, routes } from '../src/render.mjs';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const dist = join(root, 'dist');

// This is the content boundary. A later CMS adapter can return the same schema.
export async function loadContent() {
  return JSON.parse(await readFile(join(root, 'content/site.json'), 'utf8'));
}

export async function build() {
  const content = await loadContent();
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await cp(join(root, 'public'), dist, { recursive: true });
  await cp(join(root, 'src/styles.css'), join(dist, 'styles.css'));
  await cp(join(root, 'src/main.js'), join(dist, 'main.js'));
  for (const route of routes) {
    const directory = join(dist, route.href);
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, 'index.html'), renderPage(route.id, content));
  }
  await writeFile(join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  console.log(`Cousin: ${routes.length} pagina's gebouwd in ${dist}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await build();
