/* ---------- соответствия символов ---------- */
const runicMap: Record<string, string> = {
  a: '𐰀',
  e: '𐰀',
  ä: '𐰀',
  o: '𐰆',
  u: '𐰆',
  ö: '𐰇',
  ü: '𐰇',
  ı: '𐰃',
  i: '𐰃',
  w: '𐰉',
  b: '𐰉',
  c: '𐰽',
  v: '𐰉',
  p: '𐰯',
  t: '𐱅',
  d: '𐱅',
  f: '𐰯',
  k: '𐰴',
  q: '𐰴',
  g: '𐰍',
  ğ: '𐰍',
  m: '𐰢',
  n: '𐰤',
  ñ: '𐰭',
  l: '𐰠',
  r: '𐰼',
  s: '𐰽',
  z: '𐰔',
  ç: '𐰲',
  ş: '𐰳',
  y: '𐰖',
  h: '𐰴',
  ə: '𐰀',
  'o‘': '𐰆',
  'g‘': '𐰍',
  sh: '𐰳',
  ch: '𐰲',
  ŋ: '𐰭',
  ŋg: '𐰭𐰍',
  dž: '𐰲',
  nd: '𐰤𐱅',
  nt: '𐰤𐱅',
  ld: '𐰠𐱅',
  lt: '𐰠𐱅',
  ny: '𐰭𐰖',
  nç: '𐰭𐰲',
  б: '𐰉',
  ә: '𐰀',
  ғ: '𐰍',
  қ: '𐰴',
  ң: '𐰭',
  ө: '𐰇',
  ұ: '𐰆',
  ү: '𐰇',
  і: '𐰃',
  й: '𐰖',
  ц: '𐰲',
  у: '𐰆',
  к: '𐰴',
  е: '𐰀',
  н: '𐰤',
  г: '𐰍',
  х: '𐰴',
  ш: '𐰳',
  щ: '𐰳',
  з: '𐰔',
  ф: '𐰯',
  ы: '𐰃',
  в: '𐰉',
  а: '𐰀',
  п: '𐰯',
  р: '𐰼',
  о: '𐰆',
  л: '𐰠',
  д: '𐱅',
  ж: '𐰲',
  э: '𐰀',
  я: '𐰀𐰖',
  ч: '𐰲',
  с: '𐰽',
  м: '𐰢',
  и: '𐰃',
  т: '𐱅',
  ь: '',
  ҳ: '𐰴',
  ї: '𐰃',
};

const reverseRunicMap: Record<string, { latin: string; cyrillic: string }> = {
  '𐰀': { latin: 'a', cyrillic: 'а' },
  '𐰃': { latin: 'i', cyrillic: 'и' },
  '𐰆': { latin: 'o', cyrillic: 'о' },
  '𐰇': { latin: 'ö', cyrillic: 'ө' },
  '𐰉': { latin: 'b', cyrillic: 'б' },
  '𐰯': { latin: 'p', cyrillic: 'п' },
  '𐱅': { latin: 't', cyrillic: 'т' },
  '𐰴': { latin: 'k', cyrillic: 'к' },
  '𐰍': { latin: 'g', cyrillic: 'г' },
  '𐰢': { latin: 'm', cyrillic: 'м' },
  '𐰤': { latin: 'n', cyrillic: 'н' },
  '𐰭': { latin: 'ñ', cyrillic: 'ң' },
  '𐰠': { latin: 'l', cyrillic: 'л' },
  '𐰼': { latin: 'r', cyrillic: 'р' },
  '𐰽': { latin: 's', cyrillic: 'с' },
  '𐰔': { latin: 'z', cyrillic: 'з' },
  '𐰲': { latin: 'ch', cyrillic: 'ч' },
  '𐰳': { latin: 'sh', cyrillic: 'ш' },
  '𐰖': { latin: 'y', cyrillic: 'й' },
};

/* ---------- функции транслитерации ---------- */
export type TextAlphabet = 'LATIN' | 'CYRILLIC';

// Match digraphs before individual letters; iterate runes as Unicode code points.
const latinDigraphs = Object.keys(runicMap).filter((key) => [...key].length > 1);

export function transliterateToRunic(text: string): string {
  const characters = Array.from(text.normalize('NFC'));
  let result = '';
  for (let index = 0; index < characters.length; index++) {
    const pair = characters.slice(index, index + 2).join('').toLowerCase();
    if (latinDigraphs.includes(pair)) {
      result += runicMap[pair];
      index++;
    } else {
      result += runicMap[characters[index].toLowerCase()] ?? characters[index];
    }
  }
  return result;
}

export function transliterateFromRunic(text: string, alphabet: TextAlphabet): string {
  return Array.from(text, (character) => {
    const mapped = reverseRunicMap[character];
    return mapped ? (alphabet === 'LATIN' ? mapped.latin : mapped.cyrillic) : character;
  }).join('');
}
