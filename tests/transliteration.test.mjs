import assert from 'node:assert/strict';
import test from 'node:test';
import { transliterateFromRunic, transliterateToRunic } from '../src/lib/transliteration.ts';

test('decodes full Unicode runes into either alphabet', () => {
  assert.equal(transliterateFromRunic('𐰉𐰀𐰠𐰀', 'LATIN'), 'bala');
  assert.equal(transliterateFromRunic('𐰉𐰀𐰠𐰀', 'CYRILLIC'), 'бала');
  assert.equal(transliterateFromRunic('𐰇𐰭 𐰲𐰳', 'LATIN'), 'öñ chsh');
  assert.equal(transliterateFromRunic('𐰇𐰭 𐰲𐰳', 'CYRILLIC'), 'өң чш');
});

test('preserves punctuation, line breaks, numbers, and unmapped Unicode', () => {
  assert.equal(transliterateFromRunic('𐰀!\n42 🙂𐰁', 'LATIN'), 'a!\n42 🙂𐰁');
  assert.equal(transliterateFromRunic('', 'CYRILLIC'), '');
});

test('converts text to runes including digraphs and Cyrillic б', () => {
  assert.equal(transliterateToRunic('BALA бала'), '𐰉𐰀𐰠𐰀 𐰉𐰀𐰠𐰀');
  assert.equal(transliterateToRunic('SH CH o‘ g‘'), '𐰳 𐰲 𐰆 𐰍');
  assert.equal(transliterateToRunic('Ö o\u0308!\n42 🙂'), '𐰇 𐰇!\n42 🙂');
});

test('canonical reverse output can be converted back to the same runes', () => {
  const runes = '𐰀𐰃𐰆𐰇𐰉𐰯𐱅𐰴𐰍𐰢𐰤𐰭𐰠𐰼𐰽𐰔𐰲𐰳𐰖';
  for (const alphabet of ['LATIN', 'CYRILLIC']) {
    assert.equal(transliterateToRunic(transliterateFromRunic(runes, alphabet)), runes);
  }
});
