'use client';
import React, { useState } from 'react';
import { transliterateFromRunic, transliterateToRunic, type TextAlphabet } from '@/lib/transliteration';
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
  ['қ', 'ң', 'ө', 'ұ', 'ү', 'і', 'ї', 'һ', 'б'],
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

/* ---------- сам компонент ---------- */
const CustomKeyboard: React.FC<CustomKeyboardProps> = ({ onValueChange }) => {
  /** текст нижнего поля (латиница/кириллица) */
  const [inputValue, setInputValue] = useState('');
  /** текст верхнего поля (руны) */
  const [inputRunic, setInputRunic] = useState('');

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied!');
    } catch {
      toast.error('Could not copy. Select and copy the text manually.');
    }
  };

  const [direction, setDirection] = useState<'TO_RUNIC' | 'FROM_RUNIC'>('TO_RUNIC');
  const [targetLayout, setTargetLayout] = useState<TextAlphabet>('LATIN');
  const layout = direction === 'FROM_RUNIC' ? 'RUNIC' : targetLayout;

  const changeDirection = (next: 'TO_RUNIC' | 'FROM_RUNIC') => {
    setDirection(next);
    if (next === 'FROM_RUNIC') {
      const converted = transliterateFromRunic(inputRunic, targetLayout);
      setInputValue(converted);
      onValueChange?.(converted);
    } else {
      setInputRunic(transliterateToRunic(inputValue));
    }
  };

  const changeAlphabet = (next: TextAlphabet) => {
    setTargetLayout(next);
    if (direction === 'FROM_RUNIC') {
      const converted = transliterateFromRunic(inputRunic, next);
      setInputValue(converted);
      onValueChange?.(converted);
    }
  };

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

  const handleKeyPress = (key: string) => {
    if (layout === 'RUNIC') {
      let val = inputRunic;
      if (key === 'bksp') val = Array.from(val).slice(0, -1).join('');
      else if (key === 'space') val += ' ';
      else val += key;
      handleRunicChange(val);
    } else {
      let val = inputValue;
      if (key === 'bksp') val = Array.from(val).slice(0, -1).join('');
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
        <div className="flex flex-wrap items-end gap-4">
          <button
            type="button"
            onClick={() => changeDirection(direction === 'TO_RUNIC' ? 'FROM_RUNIC' : 'TO_RUNIC')}
            aria-label="Switch translation direction"
            aria-pressed={direction === 'FROM_RUNIC'}
            title={direction === 'TO_RUNIC' ? 'Switch to Runes → Text' : 'Switch to Text → Runes'}
            className="group flex size-12 min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-neutral-900 text-neutral-300 shadow-sm transition-[background-color,border-color,color,box-shadow,transform] duration-200 hover:border-white/30 hover:bg-neutral-800 hover:text-white hover:shadow-md active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-300 motion-reduce:transition-none motion-reduce:transform-none"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={`transition-transform duration-300 ease-in-out motion-reduce:transition-none ${direction === 'FROM_RUNIC' ? 'rotate-180' : 'rotate-0'}`}
            >
              <path d="M4 7h16m-4-4 4 4-4 4" />
              <path d="M20 17H4m4-4-4 4 4 4" />
            </svg>
          </button>
          <label className="flex flex-col gap-2">
            <span>{direction === 'FROM_RUNIC' ? 'Output alphabet' : 'Input alphabet'}</span>
            <select
              value={targetLayout}
              onChange={(event) => changeAlphabet(event.target.value as TextAlphabet)}
              className="rounded-lg border bg-gray-900 px-4 py-2 text-white focus-visible:outline-2"
            >
              <option value="LATIN">Latin</option>
              <option value="CYRILLIC">Cyrillic</option>
            </select>
          </label>
        </div>
        {direction === 'FROM_RUNIC' && (
          <p className="text-sm" id="reverse-note">
            Transliteration is approximate: one rune can represent several letters.
            Unmapped symbols are kept unchanged.
          </p>
        )}
        <div className="flex flex-col gap-5 md:flex-row justify-between w-full">
          {/* верхнее поле (руны) */}
          <div className="w-full flex flex-col md:pr-10">
            <textarea
              aria-label="Runes"
              aria-describedby={direction === 'FROM_RUNIC' ? 'reverse-note' : undefined}
              readOnly={direction !== 'FROM_RUNIC'}
              value={inputRunic}
              placeholder="...𐰢𐰆𐰤𐱅𐰀 𐱅𐰀𐰼𐰃𐰭𐰃𐰔"
              onChange={(e) =>
                layout === 'RUNIC' && handleRunicChange(e.target.value)
              }
              rows={4}
              className="w-full p-2 bg-transparent text-2xl text-end rounded-lg md:mb-4 focus-visible:outline-2"
            />
            <div className="flex flex-row gap-4 items-center ">
              <button
                onClick={() => handleCopy(direction === 'FROM_RUNIC' ? inputValue : inputRunic)}
                className="px-4 py-2 flex flex-row items-center gap-3 w-fit rounded-lg border hover:scale-95 transition-transform"
                title="Copy translation"
              >
                <Paper color="white" /> Copy translation
              </button>
            </div>
          </div>

          {/* нижнее поле (латиница/кириллица) */}
          <div className="w-full border-t md:border-t-0 pt-5 md:pt-0 md:border-l md:pl-10">
            <div className="relative">
              <textarea
                aria-label={targetLayout === 'LATIN' ? 'Latin text' : 'Cyrillic text'}
                readOnly={direction === 'FROM_RUNIC'}
                value={inputValue}
                placeholder="Type here..."
                onChange={(e) =>
                  layout !== 'RUNIC' && handleLatinCyrChange(e.target.value)
                }
                rows={4}
                className="w-full p-2 bg-transparent text-2xl rounded-lg md:mb-4 focus-visible:outline-2"
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
          aria-label="Backspace"
          onClick={() => handleKeyPress('bksp')}
        >
          ⌫
        </button>
      </div>
    </>
  );
};

export default CustomKeyboard;
