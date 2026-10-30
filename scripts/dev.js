import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const node = process.execPath;
const backend = spawn(node, [path.join(root, 'server/index.js')], { cwd: root, stdio: 'inherit', env: process.env });
let frontend;
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  backend.kill('SIGTERM');
  frontend?.kill('SIGTERM');
  setTimeout(() => process.exit(code), 100).unref();
}
backend.on('exit', code => { if (!stopping) { console.error('Backend stopped unexpectedly.'); stop(code || 1); } });
process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));

try {
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    if (backend.exitCode !== null) throw new Error('Backend failed to start.');
    try { const response = await fetch('http://127.0.0.1:8787/api/health'); if (response.ok) { ready = true; break; } }
    catch { /* wait for API socket */ }
    await delay(250);
  }
  if (!ready) throw new Error('Backend did not become ready. Check whether port 8787 is already in use.');
  frontend = spawn(node, [path.join(root, 'node_modules/vite/bin/vite.js'), '--host', '127.0.0.1'], { cwd: root, stdio: 'inherit', env: process.env });
  frontend.on('exit', code => { if (!stopping) stop(code || 0); });
} catch (error) {
  console.error(error.message);
  stop(1);
}
