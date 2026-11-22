import assert from 'node:assert/strict';
import test from 'node:test';

const baseUrl = process.env.CSP_TEST_URL;

if (!baseUrl) {
  throw new Error('CSP_TEST_URL environment variable must be set.');
}

test('production server emits per-request nonce CSP without unsafe script directives', async () => {
  const firstRes = await fetch(baseUrl, { redirect: 'manual' });
  const secondRes = await fetch(baseUrl, { redirect: 'manual' });

  const cspOne = firstRes.headers.get('content-security-policy');
  const cspTwo = secondRes.headers.get('content-security-policy');

  assert.ok(cspOne, 'First response must include Content-Security-Policy');
  assert.ok(cspTwo, 'Second response must include Content-Security-Policy');

  const scriptDirective = cspOne
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('script-src'));

  assert.ok(scriptDirective, 'CSP must define script-src');
  assert.ok(
    !scriptDirective.includes("'unsafe-inline'"),
    'Production script-src must not allow unsafe-inline',
  );
  assert.ok(
    !scriptDirective.includes("'unsafe-eval'"),
    'Production script-src must not allow unsafe-eval',
  );

  const nonceOne = cspOne.match(/'nonce-([^']+)'/)?.[1];
  const nonceTwo = cspTwo.match(/'nonce-([^']+)'/)?.[1];
  assert.ok(nonceOne, 'CSP must include a script nonce');
  assert.ok(nonceTwo, 'Second CSP must include a script nonce');
  assert.notEqual(nonceOne, nonceTwo, 'CSP nonce must rotate per request');
});
