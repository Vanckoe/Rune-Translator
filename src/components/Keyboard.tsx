'use client';
import React, { useState, useEffect, useRef } from 'react';

interface CustomKeyboardProps {
  onValueChange?: (value: string) => void;
}

const EN_LAYOUT = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b'],
  ['n', 'm', 'ə', 'ç', 'ğ'],
  ['ı', 'ö', 'ş', 'ü', 'o‘', 'g‘', 'sh', 'ch'],
];

const RU_LAYOUT = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з'],
  ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д'],
  ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'ә', 'ғ'],
  ['қ', 'ң', 'ө', 'ұ', 'ү', 'і', 'ї', 'һ'],
];

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
  b: '𐰉',
  v: '𐰉',
  p: '𐰯',
  t: '𐱅',
  d: '𐱅',
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
  ŋ: '𐰭',
  ŋg: '𐰭𐰍',
  dž: '𐰲',
  nd: '𐰤𐱅',
  nt: '𐰤𐱅',
  ld: '𐰠𐱅',
  lt: '𐰠𐱅',
  ny: '𐰭𐰖',
  nç: '𐰭𐰲',
};
const transliterateToRunic = (input: string): string => {
  return input
    .split('')
    .map((char) => runicMap[char.toLowerCase()] || char)
    .join('');
};

const reverseRunicMap: Record<string, { en: string; ru: string }> = {
  '𐰀': { en: 'a', ru: 'а' },
  '𐰃': { en: 'i', ru: 'и' },
  '𐰆': { en: 'o', ru: 'о' },
  '𐰇': { en: 'ö', ru: 'ө' },
  '𐰉': { en: 'b', ru: 'б' },
  '𐰯': { en: 'p', ru: 'п' },
  '𐱅': { en: 't', ru: 'т' },
  '𐰴': { en: 'k', ru: 'к' },
  '𐰍': { en: 'g', ru: 'г' },
  '𐰢': { en: 'm', ru: 'м' },
  '𐰤': { en: 'n', ru: 'н' },
  '𐰭': { en: 'ñ', ru: 'ң' },
  '𐰠': { en: 'l', ru: 'л' },
  '𐰼': { en: 'r', ru: 'р' },
  '𐰽': { en: 's', ru: 'с' },
  '𐰔': { en: 'z', ru: 'з' },
  '𐰲': { en: 'ch', ru: 'ч' },
  '𐰳': { en: 'sh', ru: 'ш' },
  '𐰖': { en: 'y', ru: 'й' },
};

const transliterateFromRunic = (input: string, layout: string): string => {
  return input
    .split('')
    .map((char) => {
      const mapping = reverseRunicMap[char];
      if (!mapping) return char;
      return layout === 'EN' ? mapping.en : mapping.ru;
    })
    .join('');
};

const CustomKeyboard: React.FC<CustomKeyboardProps> = ({ onValueChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [layout, setLayout] = useState('EN');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const newValue = inputValue + pastedText;
    setInputValue(newValue);
    onValueChange?.(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onValueChange?.(newValue);
  };

  const handleKeyPress = (key: string) => {
    let newValue = inputValue;
    if (key === 'bksp') {
      newValue = inputValue.slice(0, -1);
    } else if (key === 'space') {
      newValue = inputValue + ' ';
    } else {
      newValue = inputValue + key;
    }
    setInputValue(newValue);
    onValueChange?.(newValue);
  };

  const toggleLayout = () => {
    setLayout(layout === 'EN' ? 'RU' : 'EN');
  };

  const currentLayout = layout === 'EN' ? EN_LAYOUT : RU_LAYOUT;

  return (
    <>
      <div className="relative w-full flex flex-col gap-5">
        <button
          onClick={toggleLayout}
          className="px-4 py-2 w-fit bg-blue-600 text-white rounded-lg hover:bg-blue-500"
        >
          Switch to {layout === 'EN' ? 'Cirilic' : 'Latinic'}
        </button>
        <div className="flex flex-col gap-5 md:flex-row justify-between w-full">
          <div className="w-full md:pr-10">
            <textarea
              ref={inputRef}
              value={transliterateFromRunic(
                transliterateToRunic(inputValue),
                layout
              )}
              placeholder="...𐰢𐰆𐰤𐱅𐰀 𐱅𐰀𐰼𐰃𐰭𐰃𐰔"
              onChange={handleChange}
              onPaste={handlePaste}
              rows={4}
              className="w-full p-2 bg-transparent text-2xl text-end text-white rounded-lg md:mb-4 focus:outline-none"
            />
          </div>

          <div className="w-full border-t md:border-t-0 pt-5 md:pt-0 md:border-l md:pl-10">
            <textarea
              ref={inputRef}
              value={inputValue}
              placeholder="Type here..."
              onChange={handleChange}
              onPaste={handlePaste}
              rows={4}
              className="w-full p-2 bg-transparent text-2xl text-white rounded-lg mb-4 focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-6 md:grid-cols-10 w-full gap-2 mt-4">
        {currentLayout.flat().map((key: string, idx: number) => (
          <button
            key={idx}
            className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </button>
        ))}
        <button
          className="col-span-4 md:col-span-7 p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          onClick={() => handleKeyPress('space')}
        >
          space
        </button>
        <button
          className="col-span-2 md:col-span-3 p-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
          onClick={() => handleKeyPress('bksp')}
        >
          ⌫
        </button>
      </div>
    </>
  );
};

export default CustomKeyboard;
