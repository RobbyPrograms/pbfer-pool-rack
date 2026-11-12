// Run against the local dev server. Browser dependency can be installed separately:
// npm install --prefix node_modules/.support-test --no-package-lock @playwright/test
const { chromium } = require('../node_modules/.support-test/node_modules/@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const baseURL = process.env.SUPPORT_TEST_URL || 'http://localhost:3000';

(async () => {
  const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
  const browser = await chromium.launch({ headless: true, ...(fs.existsSync(edge) ? { executablePath: edge } : {}) });
  let count = 0;
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport });
      // Avoid unrelated 3D/video downloads while verifying Support.
      await page.route('**/*.{glb,mp4}', (route) => route.abort());
      await page.route('**/api/support-chat', async (route) => route.fulfill({ json: { available: false } }));
      await page.goto(baseURL + '/#support', { waitUntil: 'domcontentloaded' });
      const support = page.locator('#support');
      for (const category of ['Orders & Shipping', 'Product Support', 'Returns & Replacements', 'General Questions']) {
        await support.getByRole('button', { name: category, exact: false }).click();
        const dialog = page.getByRole('dialog', { name: category, exact: true });
        await dialog.waitFor();
        await dialog.getByText('AI support is unavailable right now.', { exact: false }).waitFor();
        assert.equal(await dialog.getByRole('button', { name: 'Send', exact: true }).isDisabled(), true);
        const box = await dialog.boundingBox();
        assert.ok(box.x >= 0 && box.y >= 0 && box.x + box.width <= viewport.width + 1 && box.y + box.height <= viewport.height + 1, 'Popup must fit viewport');
        assert.equal(await dialog.getByText('AI support assistant', { exact: true }).count(), 2);
        await dialog.getByRole('button', { name: 'Close support chat' }).click();
        await dialog.waitFor({ state: 'detached' });
        count++;
      }

      await page.unroute('**/api/support-chat');
      const requests = [];
      let requestCount = 0;
      await page.route('**/api/support-chat', async (route) => {
        if (route.request().method() === 'GET') return route.fulfill({ json: { available: true } });
        requests.push(route.request().postDataJSON());
        requestCount++;
        await new Promise((resolve) => setTimeout(resolve, 250));
        if (requestCount === 3) return route.fulfill({ status: 429, json: { error: 'Please wait a minute, or contact Payton.', contactPayton: true } });
        return route.fulfill({ json: { reply: requestCount === 1 ? 'TrueRack works with 8-ball, 9-ball, and 10-ball.' : 'For order-specific assistance, contact Payton.', contactPayton: requestCount === 2 } });
      });
      await support.getByRole('button', { name: 'Product Support', exact: false }).click();
      const chat = page.getByRole('dialog', { name: 'Product Support', exact: true });
      const question = chat.getByRole('textbox', { name: 'Your question' });
      await question.waitFor();
      await page.waitForFunction(() => !document.getElementById('support-question').disabled);
      assert.equal(await question.getAttribute('maxlength'), '1000');
      await question.fill('Which games work?');
      await chat.getByRole('button', { name: 'Send', exact: true }).click();
      await chat.getByText('Checking approved information…').waitFor();
      assert.equal(await chat.getByRole('button', { name: 'Sending…' }).isDisabled(), true);
      await chat.getByText('TrueRack works with 8-ball, 9-ball, and 10-ball.', { exact: true }).waitFor();
      await question.fill('What about my order?');
      await chat.getByRole('button', { name: 'Send', exact: true }).click();
      await chat.getByText('For order-specific assistance, contact Payton.', { exact: true }).waitFor();
      assert.equal(requests[1].messages.length, 3);
      assert.equal(requests[1].messages[0].content, 'Which games work?');
      assert.equal(requests[1].category, 'product');
      await question.fill('One more question');
      await chat.getByRole('button', { name: 'Send', exact: true }).click();
      await chat.getByRole('alert').waitFor();
      assert.equal(await question.inputValue(), 'One more question');
      await chat.getByRole('button', { name: 'Contact Payton', exact: true }).click();
      await chat.waitFor({ state: 'detached' });
      const contact = page.locator('#support-contact');
      assert.equal(await contact.locator('select[name="topic"]').inputValue(), 'Product Support');
      const transcript = await contact.locator('textarea[name="message"]').inputValue();
      assert.ok(transcript.includes('Support category: Product Support'));
      assert.ok(transcript.includes('Customer: Which games work?'));
      assert.ok(transcript.includes('AI support assistant: TrueRack works with'));
      assert.ok(transcript.includes('Customer: One more question'));
      count += 4;
      await support.getByRole('button', { name: 'General Questions', exact: false }).click();
      await page.getByRole('dialog', { name: 'General Questions' }).waitFor();
      await page.keyboard.press('Escape');
      await page.getByRole('dialog').waitFor({ state: 'detached' });
      count++;
      await support.getByRole('button', { name: 'Product Support', exact: false }).click();
      const fresh = page.getByRole('dialog', { name: 'Product Support' });
      await fresh.waitFor();
      assert.equal(await fresh.getByText('Which games work?', { exact: true }).count(), 0);
      const artifact = path.resolve('node_modules/.support-test', `support-${viewport.width}.png`);
      await page.screenshot({ path: artifact });
      count++;
      await page.close();
    }
    console.log(`Passed ${count} desktop/mobile chat checks. Screenshots: node_modules/.support-test/support-{1440,390}.png`);
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
