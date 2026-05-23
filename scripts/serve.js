import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PORT = Number(process.env.PORT) || 4173;
const HOST = process.env.HOST || '127.0.0.1';

const MIME_TYPES = new Map([
    ['.html', 'text/html; charset=utf-8'],
    ['.js', 'text/javascript; charset=utf-8'],
    ['.css', 'text/css; charset=utf-8'],
    ['.json', 'application/json; charset=utf-8'],
    ['.png', 'image/png'],
    ['.jpg', 'image/jpeg'],
    ['.jpeg', 'image/jpeg'],
    ['.svg', 'image/svg+xml'],
    ['.ico', 'image/x-icon'],
]);

const server = http.createServer((request, response) => {
    const url = new URL(request.url ?? '/', `http://${request.headers.host ?? `${HOST}:${PORT}`}`);
    const requestedPath = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
    const filePath = safeResolve(requestedPath);

    if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
        response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
        response.end('Not found');
        return;
    }

    response.writeHead(200, {
        'content-type': MIME_TYPES.get(extname(filePath).toLowerCase()) ?? 'application/octet-stream',
        'cache-control': 'no-store',
    });
    createReadStream(filePath).pipe(response);
});

server.listen(PORT, HOST, () => {
    console.log(`FFXI Text RPG dev server running at http://${HOST}:${PORT}/`);
});

function safeResolve(requestedPath) {
    const normalized = normalize(requestedPath).replace(/^([/\\])+/, '');
    const filePath = resolve(join(ROOT, normalized));
    return filePath === ROOT || filePath.startsWith(`${ROOT}${sep}`) ? filePath : null;
}
