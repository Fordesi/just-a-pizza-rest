// Run: node test-i18n.js — every language must define exactly the same keys.
const assert = require('node:assert');
const I18N = require('./i18n.js');

const keys = l => Object.keys(I18N[l]).sort();
for (const l of ['en', 'ja']) assert.deepStrictEqual(keys(l), keys('th'), `${l} keys differ from th`);
for (const [l, d] of Object.entries(I18N))
  for (const [k, v] of Object.entries(d)) assert.ok(v.trim(), `${l}.${k} is empty`);
console.log('i18n ok:', keys('th').length, 'keys x', Object.keys(I18N).length, 'languages');
