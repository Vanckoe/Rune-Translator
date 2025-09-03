'use client';
import Image from 'next/image';
import CustomKeyboard from '@/components/Keyboard';
import { useState } from 'react';
import Flag from '@/components/flags';

export default function Home() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex flex-col mt-10 items-center justify-items-center min-h-screen md:p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex w-full container mx-auto md:border md:bg-black md:rounded-[1rem] md:p-10 flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <CustomKeyboard
          onValueChange={(value) => {
            setInputValue(value);
          }}
        />
        <div className="mt-5 flex flex-col-reverse gap-5 md:flex-row items-center justify-between w-full">
          <p className="">Currently under development</p>
          <div className="flex flex-row items-center gap-3 w-fit">
            Alphabets
            <Flag code="az" />
            <Flag code="kz" />
            <Flag code="kg" />
            <Flag code="tr" />
            <Flag code="uz" />
          </div>
        </div>
      </main>
    </div>
  );
}
