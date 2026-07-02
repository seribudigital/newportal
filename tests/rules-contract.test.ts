import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';

describe('Firestore Security Rules Contract & Assertion Tests (Final Evidence)', () => {
  const rulesContent = fs.readFileSync(path.resolve(__dirname, '../firestore.rules'), 'utf8');
  const storageRulesContent = fs.readFileSync(path.resolve(__dirname, '../storage.rules'), 'utf8');

  test('1. Guest Read Public & Create PPDB / PesanKontak Assertions', () => {
    assert.match(rulesContent, /match \/berita\/\{id\} \{\s*allow read: if true;/);
    assert.match(rulesContent, /match \/pendaftaranPPDB\/\{id\} \{\s*allow create: if true;/);
    assert.match(rulesContent, /match \/pesanKontak\/\{id\} \{\s*allow create: if true;/);
  });

  test('2. Unauthenticated Access Denied on Admin / User Collections', () => {
    assert.match(rulesContent, /match \/users\/\{userId\} \{\s*allow read: if isAuthenticated\(\) && \(request\.auth\.uid == userId \|\| isYayasan\(\)\);\s*allow write: if isYayasan\(\);/);
  });

  test('3. Scope Lock for admin_jenjang (tkit, sdit, mts, ma)', () => {
    assert.match(rulesContent, /function isJenjangAdmin\(jenjangId\)/);
    assert.match(rulesContent, /request\.auth\.token\.jenjangId == jenjangId/);
    assert.match(rulesContent, /hasJenjangId\(request\.resource\.data\) && isJenjangAdmin\(request\.resource\.data\.jenjangId\)/);
  });

  test('4. Global Privilege for admin_yayasan', () => {
    assert.match(rulesContent, /function isYayasan\(\)/);
    assert.match(rulesContent, /request\.auth\.token\.role == 'admin_yayasan'/);
  });

  test('5. Default-Deny Catch-All', () => {
    assert.match(rulesContent, /match \/\{document=\*\*\} \{\s*allow read, write: if false;\s*\}/);
    assert.match(storageRulesContent, /match \/\{allPaths=\*\*\} \{\s*allow read, write: if false;\s*\}/);
  });
});
