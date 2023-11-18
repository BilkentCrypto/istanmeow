import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from 'react-query';
import Image from 'next/image';

import { getContracts } from '../../../../data/contracts';
import { MMContext } from '../../contexts/mm';
import Avatar from '../Avatar/Avatar';

export default function Sidenav({ initialData = [] }) {
  const { data, refetch } = useQuery(
    'ownContracts',
    () =>
      getContracts(null, {
        own: true,
      }),
    {
      initialData,
      staleTime: Infinity,
      refetchOnMount: false,
    },
  );
  const { isAuthorized } = useContext(MMContext);

  useEffect(() => {
    refetch();
  }, [isAuthorized]);

  return (
    <aside className="flex  max-h-full rounded-3xl border-grey-500 bg-green-500">
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
          <Link href="/about" className='flex mt-10 items-center'>
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
          <Link href="/" className='flex mt-10 items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white" class="w-6 ml-5 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium text-left ml-2 text-lg text-white font-gt">Settings</span>
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
        {data ? (
          <>
            {data?.contracts?.map((e, i) => (
              <Link
                key={i}
                href={`/flow/${e.address}`}
                className=" text-gray-500 py-0  rounded-full border border-grey-500">
                {/* {e.imageURL ? (
                  <Image
                    alt="logo"
                    className="w-12 h-12 object-cover rounded-full"
                    width="12"
                    height="12"
                    src={e.imageURL}
                  />
                ) : ( */}
                <div className="w-12 h-12 object-cover rounded-full overflow-hidden">
                  <Avatar image={e.imageURL} address={e.address} />
                </div>
                {/* )} */}
              </Link>
            ))}
          </>
        ) : null}
      </div>
    </aside>
  );
}
