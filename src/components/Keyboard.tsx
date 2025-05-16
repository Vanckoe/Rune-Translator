'use client';
import React, { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Paper from '@/assets/Paper';

interface CustomKeyboardProps {
  onValueChange?: (value: string) => void;
}

/* ---------- раскладки клавиатуры ---------- */
const LATIN_LAYOUT = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'c', 'v', 'b'],
  ['n', 'm', 'o‘', 'ə', 'ç', 'ğ'],
  ['ı', 'ö', 'ş', 'ü', 'g‘', 'sh', 'ch'],
];

const CYRILLIC_LAYOUT = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з'],
  ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д'],
  ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'ә', 'ғ'],
  ['қ', 'ң', 'ө', 'ұ', 'ү', 'і', 'ї', 'һ'],
];

const RUNIC_LAYOUT = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['𐰀', '𐰁', '𐰂', '𐰃', '𐰄', '𐰅', '𐰆', '𐰇', '𐰈', '𐰉'],
  ['𐰊', '𐰋', '𐰌', '𐰍', '𐰏', '𐰐', '𐰑', '𐰒', '𐰓', '𐰔'],
  ['𐰕', '𐰖', '𐰗', '𐰘', '𐰙', '𐰚', '𐰛', '𐰜', '𐰝', '𐰞'],
  ['𐰟', '𐰠', '𐰡', '𐰢', '𐰣', '𐰤', '𐰥', '𐰦', '𐰧', '𐰨'],
  ['𐰩', '𐰪', '𐰫', '𐰬', '𐰭', '𐰮', '𐰯', '𐰰', '𐰱', '𐰲'],
  ['𐰳', '𐰴', '𐰵', '𐰶', '𐰷', '𐰸', '𐰹', '𐰺', '𐰻', '𐰼'],
  ['𐰽', '𐰾', '𐰿', '𐱀', '𐱁', '𐱂', '𐱃', '𐱄', '𐱅', '𐱆'],
  ['𐱇', '𐱈', '𐱉', '𐱊', '𐱋', '𐱌', '𐱍', '𐱎', '𐱏', '𐱐'],
];

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
const transliterateToRunic = (str: string): string =>
  str
    .split('')
    .map((ch) => runicMap[ch.toLowerCase()] ?? ch)
    .join('');

const transliterateFromRunic = (
  str: string,
  layout: 'LATIN' | 'CYRILLIC'
): string =>
  str
    .split('')
    .map((ch) => {
      const map = reverseRunicMap[ch];
      if (!map) return ch;
      return layout === 'LATIN' ? map.latin : map.cyrillic;
    })
    .join('');

/* ---------- сам компонент ---------- */
const CustomKeyboard: React.FC<CustomKeyboardProps> = ({ onValueChange }) => {
  /** текст нижнего поля (латиница/кириллица) */
  const [inputValue, setInputValue] = useState('');
  /** текст верхнего поля (руны) */
  const [inputRunic, setInputRunic] = useState('');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  type Layout = 'LATIN' | 'CYRILLIC' | 'RUNIC';
  const [layout, setLayout] = useState<Layout>('LATIN');
  /** последняя не-рунная раскладка (для перевода) */
  const [targetLayout, setTargetLayout] =
    useState<Exclude<Layout, 'RUNIC'>>('LATIN');

  const inputRef = useRef<HTMLTextAreaElement>(null);

  /* ---------- переключатель раскладок ---------- */
  const toggleLayout = () => {
    if (layout === 'LATIN') {
      setLayout('CYRILLIC');
      setTargetLayout('CYRILLIC');
    } else if (layout === 'CYRILLIC') {
      setLayout('RUNIC');
    } else if (layout === 'RUNIC') {
      setLayout('LATIN');
      setTargetLayout('LATIN');
    }
  };

  /* ---------- синхронизация при смене раскладки ---------- */
  useEffect(() => {
    if (layout === 'RUNIC') {
      setInputValue(transliterateFromRunic(inputRunic, targetLayout));
    } else {
      setInputRunic(transliterateToRunic(inputValue));
    }
  }, [layout]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- обработчики ввода ---------- */
  const handleLatinCyrChange = (val: string) => {
    setInputValue(val);
    setInputRunic(transliterateToRunic(val));
    onValueChange?.(val);
  };

  const handleRunicChange = (val: string) => {
    setInputRunic(val);
    const converted = transliterateFromRunic(val, targetLayout);
    setInputValue(converted);
    onValueChange?.(converted);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    if (layout === 'RUNIC') {
      handleRunicChange(inputRunic + pasted);
    } else {
      handleLatinCyrChange(inputValue + pasted);
    }
  };

  const handleKeyPress = (key: string) => {
    if (layout === 'RUNIC') {
      let val = inputRunic;
      if (key === 'bksp') val = val.slice(0, -1);
      else if (key === 'space') val += ' ';
      else val += key;
      handleRunicChange(val);
    } else {
      let val = inputValue;
      if (key === 'bksp') val = val.slice(0, -1);
      else if (key === 'space') val += ' ';
      else val += key;
      handleLatinCyrChange(val);
    }
  };

  /* ---------- текущий набор кнопок ---------- */
  const currentLayout =
    layout === 'LATIN'
      ? LATIN_LAYOUT
      : layout === 'CYRILLIC'
      ? CYRILLIC_LAYOUT
      : RUNIC_LAYOUT;

  /* ---------- JSX ---------- */
  return (
    <>
      <Toaster position="top-center" />
      <div className="relative w-full flex flex-col gap-5">
        <div className="flex flex-col gap-5 md:flex-row justify-between w-full">
          {/* верхнее поле (руны) */}
          <div className="w-full flex flex-col md:pr-10">
            <textarea
              ref={inputRef}
              value={
                layout === 'RUNIC'
                  ? inputRunic
                  : transliterateToRunic(inputValue)
              }
              placeholder="...𐰢𐰆𐰤𐱅𐰀 𐱅𐰀𐰼𐰃𐰭𐰃𐰔"
              onChange={(e) =>
                layout === 'RUNIC' && handleRunicChange(e.target.value)
              }
              onPaste={handlePaste}
              rows={4}
              className="w-full p-2 bg-transparent text-2xl text-end rounded-lg md:mb-4 focus:outline-none"
              readOnly={layout !== 'RUNIC'}
            />
            <div className="flex flex-row gap-5 items-center ">
              <button
                onClick={toggleLayout}
                className="px-4 py-2 w-fit rounded-lg border  hover:scale-95 transition-transform"
              >
                {layout === 'LATIN'
                  ? 'Latin'
                  : layout === 'CYRILLIC'
                  ? 'Cyrillic'
                  : targetLayout === 'LATIN'
                  ? 'Latin'
                  : 'Runic'}
              </button>
              <button
                onClick={() =>
                  handleCopy(
                    layout === 'RUNIC'
                      ? inputRunic
                      : transliterateToRunic(inputValue)
                  )
                }
                className="px-4 py-2 flex flex-row items-center gap-3 w-fit rounded-lg border hover:scale-95 transition-transform"
                title="Копировать текст"
              >
                <Paper color="white" /> Copy
              </button>
            </div>
          </div>

          {/* нижнее поле (латиница/кириллица) */}
          <div className="w-full border-t md:border-t-0 pt-5 md:pt-0 md:border-l md:pl-10">
            <div className="relative">
              <textarea
                value={inputValue}
                placeholder="Type here..."
                onChange={(e) =>
                  layout !== 'RUNIC' && handleLatinCyrChange(e.target.value)
                }
                onPaste={handlePaste}
                rows={4}
                className="w-full p-2 bg-transparent text-2xl rounded-lg md:mb-4 focus:outline-none"
                readOnly={layout === 'RUNIC'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* виртуальная клавиатура */}
      <div className="grid grid-cols-6 md:grid-cols-10 w-full gap-2 md:mt-4">
        {currentLayout.flat().map((key, idx) => (
          <button
            key={idx}
            className={`p-2 ${
              layout === 'RUNIC'
                ? 'bg-gray-700 hover:bg-gray-800'
                : 'bg-gray-800 hover:bg-gray-700'
            } text-white rounded-lg`}
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </button>
        ))}

        <button
          className={`col-span-4 md:col-span-2 p-2 ${
            layout === 'RUNIC'
              ? 'bg-gray-700 hover:bg-gray-800'
              : 'bg-gray-800 hover:bg-gray-700'
          } text-white rounded-lg`}
          onClick={() => handleKeyPress('space')}
        >
          space
        </button>
        <button
          className="col-span-2 md:col-span-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
          onClick={() => handleKeyPress('bksp')}
        >
          ⌫
        </button>
      </div>
    </>
  );
};

export default CustomKeyboard;
