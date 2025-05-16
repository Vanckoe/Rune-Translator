'use client';
import React, { useState, useEffect, useRef } from 'react';

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
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const newValue = inputValue + pastedText;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onValueChange?.(newValue);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
        <div className="flex flex-row justify-between w-full">
          <div className="w-full p-2 mb-4 text-end pr-10">wefewfwef</div>
          <div className="w-full border-l pl-10">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              placeholder='Type here...'
              onChange={handleChange}
              onPaste={handlePaste}
              className="w-full p-2 bg-transparent text-white rounded-lg mb-4 focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-10 gap-2 mt-4">
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
