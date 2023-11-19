import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';


const Navbar = () => {
  return (
    <aside className="flex  max-h-full rounded-3xl border-grey-500 bg-transparent">
      <div className="flex flex-col w-48 h-screen  rounded-tr-2xl rounded-br-2xl py-4 space-y-4  bg-[#132D46] ">
        <div className="mt-3 text-center">
          <Link
            href="/"
            className='mt-10'
          >
            <span className=" font-extrabold   text-2xl text-pink-500">zk</span>
            <span className="font-extrabold text-2xl text-white">Hub</span>
          </Link>
        </div>
        <div className="flex items-center">
          <Link href="/" className='flex mt-16 items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="white" className="ml-5  w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
            </svg>
            <span className="font-medium text-left ml-2 text-lg text-white">Community</span>
          </Link>
        </div>
        <div className="flex items-center">
          <Link href="/locknft" className='flex mt-10 items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white" class="ml-5  w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>

            <span className="font-medium text-left ml-2 text-lg text-white">Lock NFT</span>
          </Link>
        </div>
        <div className="flex items-center">
          <Link href="/" className='flex mt-10 items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white" class="w-6 ml-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>

            <span className="font-medium text-left ml-2 text-lg font-gt text-white">Unlock NFT</span>
          </Link>
        </div>
        <div className="flex items-center">
          <Link href="/prove" className='flex mt-10 items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white" class="w-6 ml-5 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <span className="font-medium text-left ml-2 text-lg text-white font-gt">Prove</span>
          </Link>
        </div>
        <div className="flex items-center">
          <Link href="/about" className='flex mt-10 items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white" class="w-6 ml-5 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>

            <span className="font-medium text-left ml-2 text-lg text-white">About zkHub</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}

export default Navbar