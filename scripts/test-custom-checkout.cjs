const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(path, dependencies = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports, require: name => dependencies[name] || require(name),
    process, Request, Response, File, Uint8Array, URL, Number, FormData,
  });
  return exports;
}

const customization = load('src/lib/customization.ts');
const colors = load('src/lib/shop-colors.ts');
const calls = [], uploads = [], removed = [];
let storageReady = true, paymentFails = false;
const storage = {
  getBucket: async () => ({ data: { public: false } }),
  from: () => ({
    upload: async (path, bytes) => { uploads.push({ path, bytes }); return { error: null }; },
    remove: async paths => { removed.push(...paths); return { error: null }; },
  }),
};
const route = load('src/app/api/checkout/route.ts', {
  '@/lib/brand': { BRAND: { priceCents: 4999 } },
  '@/lib/shop-colors': colors,
  '@/lib/customization': customization,
  '@/lib/rate-limit': { clientKey: () => 'test', rateLimit: () => true },
  '@/lib/supabase/admin': { getSupabaseAdmin: () => storageReady ? { storage } : null },
  '@/lib/square': {
    getSquareConfig: () => ({ ready: true, locationId: 'test-location' }),
    squareFetch: async (_, init) => {
      calls.push(JSON.parse(init.body));
      if (paymentFails) throw new Error('payment failed');
      return { payment_link: { url: 'https://example.test/checkout' } };
    },
  },
});
function json(body) {
  return new Request('http://localhost/api/checkout', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
}
function logo(file) {
  const data = new FormData();
  for (const [key, value] of Object.entries({ variant: 'custom', kind: 'logo', quantity: '1', color: 'Green' })) data.set(key, value);
  if (file) data.set('logo', file);
  return new Request('http://localhost/api/checkout', { method: 'POST', body: data });
}

test('standard checkout uses server price, quantity, and selected color', async () => {
  assert.equal((await route.POST(json({ quantity: 2, color: 'Blue', price: 1 }))).status, 200);
  const item = calls.at(-1).order.line_items[0];
  assert.equal(item.base_price_money.amount, 4999);
  assert.equal(item.quantity, '2');
  assert.match(item.name, /Standard.*Blue/);
});
test('custom name stores name/font and charges 59.99', async () => {
  const result = await route.POST(json({ variant: 'custom', kind: 'name', name: ' Maverick ', font: 'industry-bold', quantity: 1, color: 'Black' }));
  assert.equal(result.status, 200);
  const item = calls.at(-1).order.line_items[0];
  assert.equal(item.base_price_money.amount, 5999);
  assert.match(item.note, /Maverick.*Industry Bold/);
});
test('custom checkout rejects missing choice, blank name, unknown font, and missing logo', async () => {
  for (const body of [
    { variant: 'custom' },
    { variant: 'custom', kind: 'name', name: ' ', font: 'industry-bold' },
    { variant: 'custom', kind: 'name', name: 'Test', font: 'fake' },
    { variant: 'custom', kind: 'logo' },
  ]) assert.equal((await route.POST(json(body))).status, 400);
});
test('checkout rejects invalid variants, quantities, and colors', async () => {
  for (const body of [{ variant: 'fake' }, { quantity: 1.5 }, { quantity: 0 }, { quantity: 5 }, { color: 'invalid' }]) {
    assert.equal((await route.POST(json(body))).status, 400);
  }
});
test('logo checkout rejects disguised and oversized files', async () => {
  assert.equal((await route.POST(logo(new File(['not a png'], 'logo.png', { type: 'image/png' })))).status, 400);
  assert.equal((await route.POST(logo(new File([new Uint8Array(customization.MAX_LOGO_BYTES + 1)], 'logo.pdf')))).status, 400);
});
test('logo upload saves artwork and attaches its private storage path', async () => {
  assert.equal((await route.POST(logo(new File(['%PDF-1.7 test'], 'logo.pdf', { type: 'application/pdf' })))).status, 200);
  assert.match(uploads.at(-1).path, /^[a-f0-9-]+\.pdf$/);
  const item = calls.at(-1).order.line_items[0];
  assert.match(item.note, /custom-logos/);
  assert.equal(item.base_price_money.amount, 5999);
  assert.ok(item.metadata.artwork_path);
});
test('logo checkout stops when storage is unavailable', async () => {
  storageReady = false;
  const before = calls.length;
  const result = await route.POST(logo(new File(['%PDF-1.7 test'], 'logo.pdf')));
  storageReady = true;
  assert.equal(result.status, 503);
  assert.equal(calls.length, before);
});
test('failed payment link creation removes the newly uploaded logo', async () => {
  paymentFails = true;
  const result = await route.POST(logo(new File(['%PDF-1.7 test'], 'logo.pdf')));
  paymentFails = false;
  assert.equal(result.status, 502);
  assert.equal(removed.at(-1), uploads.at(-1).path);
});
