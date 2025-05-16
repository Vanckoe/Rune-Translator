'use client';
import Image from 'next/image';
import CustomKeyboard from '@/components/Keyboard';
import { useState } from 'react';
import Flag from '@/components/flags';

export default function Home() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex flex-col mt-10 items-center justify-items-center min-h-screen md:p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex w-full container mx-auto md:border md:rounded-[1rem] md:p-10 flex-col gap-[32px] row-start-2 items-center sm:items-start">
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
      {/* <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer> */}
    </div>
  );
}
