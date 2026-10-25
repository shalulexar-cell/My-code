const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function getJsonLd(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
}

test('newborn guide retains canonical and publishes dated step-by-step guidance', () => {
  const html = read('articles/newborn-residency-visa-dubai.html');
  assert.match(html, /rel="canonical" href="https:\/\/quickdocsuae\.com\/articles\/newborn-residency-visa-dubai\.html"/);
  assert.match(html, /120 days from birth/);
  assert.match(html, /up to 30 days to register a birth/);
  for (const id of ['register-birth', 'newborn-birth-certificate', 'newborn-passport', 'newborn-residence-id', 'newborn-checklist']) {
    assert.ok(html.includes('id="' + id + '"'), 'Missing step: ' + id);
  }
  assert.match(html, /https:\/\/u\.ae\/en\/information-and-services\/social-affairs\/having-a-baby/);
  const article = getJsonLd(html).flatMap((entry) => entry['@graph'] || [entry]).find((entry) => entry['@type'] === 'Article');
  assert.equal(article.dateModified, '2026-10-25');
});

test('family documents guide separates new spouse application from renewal', () => {
  const html = read('articles/family-visa-requirements-dubai.html');
  assert.match(html, /Spouse &amp; Child Documents/);
  assert.match(html, /step by step/);
  assert.match(html, /A <strong>renewal<\/strong> is different/);
  assert.match(html, /family-visa-renewal-dubai\.html/);
  assert.match(html, /Get the spouse visa checklist on WhatsApp/);
  const article = getJsonLd(html).flatMap((entry) => entry['@graph'] || [entry]).find((entry) => entry['@type'] === 'Article');
  assert.equal(article.dateModified, '2026-10-25');
});

test('hub, homepage and newborn service link to the enriched guides', () => {
  assert.match(read('articles/index.html'), /Baby Born in Dubai\? Newborn Visa Steps/);
  assert.match(read('index.html'), /Newborn Visa Dubai: 2026 Steps/);
  assert.match(read('services/newborn-residency-visa-dubai.html'), /Read the newborn residence visa guide/);
  assert.match(read('services/newborn-residency-visa-dubai.html'), /Birth certificate documentation/);
});
