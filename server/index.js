import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { mkdir, readFile, rename, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, scrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, '.data');
const dataFile = path.join(dataDir, 'enquiries.json');
const accountsFile = path.join(dataDir, 'customers.json');
const scryptAsync = promisify(scrypt);
const sessions = new Map();
let accountQueue = Promise.resolve();
const host = process.env.API_HOST || '127.0.0.1';
const port = Number(process.env.API_PORT || 8787);
const maxBody = 32 * 1024;
const products = {
  'rgb-running-board': { name: 'RGB Running Display Board', price: 1150, unit: 'piece' },
  'running-display': { name: 'LED Running Display', price: 650, unit: 'sq ft' },
  'event-led-display': { name: 'Event LED Display', price: 5000, unit: 'sq ft' },
  'outdoor-video-wall': { name: 'Outdoor LED Video Wall', price: 4500, unit: 'sq ft' },
  'birthday-neon': { name: 'Happy Birthday Neon Sign', price: null, unit: 'custom quote' },
  'night-glow-nameplate': { name: 'Night Glow Nameplate', price: null, unit: 'custom quote' }
};
const requests = new Map();
let writeQueue = Promise.resolve();

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...headers });
  res.end(JSON.stringify(body));
}

function rateLimit(req) {
  const ip = req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = requests.get(ip) || { count: 0, start: now };
  if (now - record.start > 10 * 60 * 1000) { record.count = 0; record.start = now; }
  record.count += 1;
  requests.set(ip, record);
  return record.count <= 12;
}

async function bodyJson(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > maxBody) throw Object.assign(new Error('Request is too large.'), { status: 413 });
  }
  try { return JSON.parse(raw || '{}'); }
  catch { throw Object.assign(new Error('Request body must be valid JSON.'), { status: 400 }); }
}

function cleanText(value, max = 1000) {
  return typeof value === 'string' ? value.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, max) : '';
}

function validateCustomer(value) {
  const customer = value && typeof value === 'object' ? value : {};
  const name = cleanText(customer.name, 80);
  const phone = cleanText(customer.phone, 30);
  const email = cleanText(customer.email, 160);
  const city = cleanText(customer.city, 100);
  if (name.length < 2) throw Object.assign(new Error('Please enter your name.'), { status: 400 });
  if (!/^[+\d][\d\s().-]{6,28}$/.test(phone)) throw Object.assign(new Error('Please enter a valid phone number.'), { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Object.assign(new Error('Please enter a valid email address.'), { status: 400 });
  return { name, phone, email, city };
}

function normalizeItems(items) {
  if (!Array.isArray(items) || items.length < 1 || items.length > 20) throw Object.assign(new Error('Add at least one product to your enquiry.'), { status: 400 });
  return items.map(item => {
    const product = products[item?.productId];
    const quantity = Number(item?.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw Object.assign(new Error('One of the selected products or quantities is invalid.'), { status: 400 });
    return { productId: item.productId, name: product.name, quantity, unitPrice: product.price, unit: product.unit, lineTotal: product.price === null ? null : product.price * quantity };
  });
}

async function save(record) {
  await mkdir(dataDir, { recursive: true });
  writeQueue = writeQueue.then(async () => {
    let records = [];
    try { records = JSON.parse(await readFile(dataFile, 'utf8')); if (!Array.isArray(records)) records = []; }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    records.unshift(record);
    const temp = `${dataFile}.${process.pid}.tmp`;
    await writeFile(temp, `${JSON.stringify(records, null, 2)}\n`, { mode: 0o600 });
    await rename(temp, dataFile);
  });
  return writeQueue;
}


async function readAccounts() {
  try { const rows = JSON.parse(await readFile(accountsFile, 'utf8')); return Array.isArray(rows) ? rows : []; }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
}
function updateAccounts(mutator) {
  const operation = accountQueue.then(async () => {
    await mkdir(dataDir, { recursive: true });
    const accounts = await readAccounts();
    const result = await mutator(accounts);
    if (result?.save) {
      const temp = `${accountsFile}.${process.pid}.tmp`;
      await writeFile(temp, `${JSON.stringify(accounts, null, 2)}\n`, { mode: 0o600 });
      await rename(temp, accountsFile);
    }
    return result?.value;
  });
  accountQueue = operation.then(() => undefined, () => undefined);
  return operation;
}
function publicAccount(account) {
  const { passwordHash, passwordSalt, ...profile } = account;
  return profile;
}
function validateAccountInput(body, { requirePassword = true } = {}) {
  const name = cleanText(body.name, 80);
  const email = cleanText(body.email, 160).toLowerCase();
  const phone = cleanText(body.phone, 30);
  const password = typeof body.password === 'string' ? body.password : '';
  if (requirePassword && name.length < 2) throw Object.assign(new Error('Enter your name.'), { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Object.assign(new Error('Enter a valid email address.'), { status: 400 });
  if (phone && !/^[+\d][\d\s().-]{6,28}$/.test(phone)) throw Object.assign(new Error('Enter a valid phone number.'), { status: 400 });
  if (requirePassword && (password.length < 10 || password.length > 128)) throw Object.assign(new Error('Use a password between 10 and 128 characters.'), { status: 400 });
  return { name, email, phone, password };
}
function sessionCookie(token, maxAge) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `tw_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}
function sessionToken(req) {
  const match = (req.headers.cookie || '').match(/(?:^|;\s*)tw_session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}
function sessionDigest(token) { return createHash('sha256').update(token).digest('hex'); }
async function currentAccount(req) {
  const token = sessionToken(req);
  if (!token) return null;
  const key = sessionDigest(token), session = sessions.get(key);
  if (!session || session.expiresAt < Date.now()) { sessions.delete(key); return null; }
  const accounts = await readAccounts();
  return accounts.find(account => account.id === session.accountId) || null;
}
function createSession(account, res) {
  const token = randomBytes(32).toString('base64url');
  const maxAge = 30 * 24 * 60 * 60;
  sessions.set(sessionDigest(token), { accountId: account.id, expiresAt: Date.now() + maxAge * 1000 });
  send(res, 200, { ok: true, customer: publicAccount(account) }, { 'set-cookie': sessionCookie(token, maxAge) });
}
async function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const hash = await scryptAsync(password, salt, 64, { N: 1 << 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return { salt, hash: hash.toString('hex') };
}
async function passwordMatches(password, account) {
  const candidate = await hashPassword(password, account.passwordSalt);
  const stored = Buffer.from(account.passwordHash, 'hex');
  const actual = Buffer.from(candidate.hash, 'hex');
  return stored.length === actual.length && timingSafeEqual(stored, actual);
}

const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon' };
async function serveBuiltFile(req, res, pathname) {
  const dist = path.join(root, 'dist');
  let file = path.resolve(dist, `.${decodeURIComponent(pathname)}`);
  if (file === dist) file = path.join(dist, 'index.html');
  if (!file.startsWith(`${dist}${path.sep}`)) return false;
  try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html'); }
  catch { file = path.join(dist, 'index.html'); }
  try {
    const info = await stat(file);
    res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream', 'content-length': info.size, 'x-content-type-options': 'nosniff' });
    createReadStream(file).pipe(res);
    return true;
  } catch { return false; }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'GET' && url.pathname === '/api/health') return send(res, 200, { status: 'ok' });
  if (req.method === 'GET' && url.pathname === '/api/auth/me') {
    try { const account = await currentAccount(req); return account ? send(res, 200, { ok: true, customer: publicAccount(account) }) : send(res, 401, { error: 'Please log in to view your profile.' }); }
    catch { return send(res, 500, { error: 'We could not load your profile.' }); }
  }
  if (req.method === 'POST' && url.pathname === '/api/auth/register') {
    if (!rateLimit(req)) return send(res, 429, { error: 'Too many attempts. Please try again in a few minutes.' });
    try {
      const input = validateAccountInput(await bodyJson(req));
      const account = await updateAccounts(async accounts => {
        if (accounts.some(row => row.email === input.email)) throw Object.assign(new Error('An account with this email already exists. Log in instead.'), { status: 409 });
        const password = await hashPassword(input.password);
        const customer = { id: randomBytes(16).toString('hex'), name: input.name, email: input.email, phone: input.phone, city: '', address: '', postalCode: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), passwordHash: password.hash, passwordSalt: password.salt };
        accounts.push(customer);
        return { save: true, value: customer };
      });
      return createSession(account, res);
    } catch (error) { return send(res, error.status || 500, { error: error.status ? error.message : 'We could not create your account right now.' }); }
  }
  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    if (!rateLimit(req)) return send(res, 429, { error: 'Too many attempts. Please try again in a few minutes.' });
    try {
      const body = await bodyJson(req), email = cleanText(body.email, 160).toLowerCase(), password = typeof body.password === 'string' ? body.password : '';
      const accounts = await readAccounts(), account = accounts.find(row => row.email === email);
      if (!account || !password || password.length > 128 || !await passwordMatches(password, account)) return send(res, 401, { error: 'Email or password is incorrect.' });
      return createSession(account, res);
    } catch (error) { return send(res, error.status || 500, { error: error.status ? error.message : 'We could not log you in right now.' }); }
  }
  if (req.method === 'PUT' && url.pathname === '/api/auth/profile') {
    const current = await currentAccount(req);
    if (!current) return send(res, 401, { error: 'Please log in to update your profile.' });
    try {
      const body = await bodyJson(req), name = cleanText(body.name, 80), phone = cleanText(body.phone, 30), city = cleanText(body.city, 100), address = cleanText(body.address, 180), postalCode = cleanText(body.postalCode, 20);
      if (name.length < 2) throw Object.assign(new Error('Enter your name.'), { status: 400 });
      if (phone && !/^[+\d][\d\s().-]{6,28}$/.test(phone)) throw Object.assign(new Error('Enter a valid phone number.'), { status: 400 });
      const account = await updateAccounts(accounts => {
        const row = accounts.find(entry => entry.id === current.id);
        if (!row) throw Object.assign(new Error('Account not found.'), { status: 404 });
        Object.assign(row, { name, phone, city, address, postalCode, updatedAt: new Date().toISOString() });
        return { save: true, value: row };
      });
      return send(res, 200, { ok: true, customer: publicAccount(account) });
    } catch (error) { return send(res, error.status || 500, { error: error.status ? error.message : 'We could not save your profile.' }); }
  }
  if (req.method === 'POST' && url.pathname === '/api/auth/logout') {
    const token = sessionToken(req); if (token) sessions.delete(sessionDigest(token));
    return send(res, 200, { ok: true }, { 'set-cookie': sessionCookie('', 0) });
  }

  if (req.method === 'POST' && ['/api/enquiries', '/api/orders'].includes(url.pathname)) {
    if (!rateLimit(req)) return send(res, 429, { error: 'Too many requests. Please try again in a few minutes.' });
    try {
      const body = await bodyJson(req);
      const customer = validateCustomer(body.customer);
      const isOrder = url.pathname === '/api/orders';
      const items = isOrder ? normalizeItems(body.items) : [];
      const record = {
        reference: `RR-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`,
        type: isOrder ? 'order-enquiry' : 'product-enquiry',
        status: 'new',
        createdAt: new Date().toISOString(),
        customer,
        product: cleanText(body.product, 120),
        message: cleanText(body.message, 1500),
        notes: cleanText(body.notes, 1500),
        items
      };
      if (!isOrder && !record.product && !record.message) return send(res, 400, { error: 'Tell us which product or project you are asking about.' });
      await save(record);
      return send(res, 201, { ok: true, reference: record.reference, message: 'Your enquiry has been recorded.' });
    } catch (error) {
      return send(res, error.status || 500, { error: error.status ? error.message : 'We could not save your enquiry right now.' });
    }
  }
  if (url.pathname.startsWith('/api/')) return send(res, 404, { error: 'API endpoint not found.' });
  if (req.method === 'GET' || req.method === 'HEAD') {
    if (await serveBuiltFile(req, res, url.pathname)) return;
  }
  send(res, 404, { error: 'Page not found. Build the storefront first with npm run build.' });
});

server.listen(port, host, () => console.log(`TechnoWorld API ready at http://${host}:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
