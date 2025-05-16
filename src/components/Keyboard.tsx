'use client';
import React, { useState, useEffect } from 'react';

interface CustomKeyboardProps {
  onValueChange?: (value: string) => void;
}

const EN_LAYOUT = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'space'],
];

const RU_LAYOUT = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з'],
  ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д'],
  ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'space'],
];

const CustomKeyboard: React.FC<CustomKeyboardProps> = ({ onValueChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [layout, setLayout] = useState('EN');

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

  const handleKeyboardEvent = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (key === 'backspace') {
      handleKeyPress('bksp');
    } else if (key === ' ') {
      handleKeyPress(' ');
    } else if (/^[a-zа-я0-9]$/i.test(key)) {
      handleKeyPress(key);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyboardEvent);
    };
  }, [inputValue]);

  const toggleLayout = () => {
    setLayout(layout === 'EN' ? 'RU' : 'EN');
  };

  const currentLayout = layout === 'EN' ? EN_LAYOUT : RU_LAYOUT;

  return (
    <>
      <input
        value={inputValue}
        readOnly
        className="w-full p-2 text-white rounded-lg mb-4 border border-gray-700 focus:outline-none"
      />
      <button
        onClick={toggleLayout}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
      >
        Switch to {layout === 'EN' ? 'RU' : 'EN'}
      </button>
      <div className="grid grid-cols-10 gap-2 mt-4">
        {currentLayout.flat().map((key, idx) => (
          <button
            key={idx}
            className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </button>
        ))}
        <button
          className="col-span-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
          onClick={() => handleKeyPress('bksp')}
        >
          ⌫
        </button>
      </div>
    </>
  );
};

export default CustomKeyboard;
