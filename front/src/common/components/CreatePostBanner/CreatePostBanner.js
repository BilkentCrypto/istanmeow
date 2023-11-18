import Link from 'next/link';
import React from 'react';

import Avatar from '../Avatar';

export default function CreatePostBanner({ onClick, address }) {
  return (
    <Link
      href={onClick}
      className="rounded-md flex h-16 w-full content-center items-center justify-center  my-4 border border-gray-200 px-2 py-1 dark:border-zinc-700 dark:bg-neutral-800">
      <div className="flex row w-full items-center  ">
        <div className="w-12 h-12 flex-shrink-0  rounded-full bg-slate-600 overflow-hidden">
          <Avatar imageStyle="w-12 h-12" address={address} />
        </div>
        <div className="h-10 flex  p-2 ml-3 rounded-sm w-full  focus:ring-blue-300 focus:border-blue-300 bg-gray-100 dark:bg-zinc-700">
          <p className="text-gray-400 dark:text-gray-200">Create post</p>
        </div>
      </div>
    </Link>
  );
}
