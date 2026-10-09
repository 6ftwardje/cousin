import { createServer } from 'node:http';
import { watch, createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { build, root, dist } from './build.mjs';

await build();
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8' };
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = resolve(dist, `.${path}`);
    if (file !== dist && !file.startsWith(dist + sep)) { res.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    await stat(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' });
    createReadStream(file).pipe(res);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Deze pagina bestaat niet.'); }
});
const port = Number(process.env.PORT || 4173);
server.listen(port, '127.0.0.1', () => console.log(`Cousin preview: http://localhost:${port}`));

let timer;
// Templates are imported by a fresh child process to avoid stale module caches.
const { execFile } = await import('node:child_process');
for (const directory of ['src', 'content', 'public']) {
  watch(join(root, directory), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => execFile(process.execPath, [join(root, 'scripts/build.mjs')], (error, stdout, stderr) => {
      if (error) console.error(stderr); else console.log(stdout.trim());
    }), 150);
  });
}
