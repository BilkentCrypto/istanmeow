import React, { useState } from 'react';
import Link from 'next/link';

import Avatar from '../Avatar/Avatar';

export default function Card({
  data: { name = '', holder = '', icon = '', address = '', imageURL = '' } = {},
}) {
  return (
    <div className="h-64">
      <div className="flex h-64 flex-col justify-center items-center bg-white dark:border-zinc-700 dark:bg-neutral-800 rounded-md border-gray-200 border px-2">
        <div className="w-20 h-20 rounded-md overflow-hidden relative">
          <Avatar
            imageStyle="w-20 h-20 rounded-full object-cover"
            image={imageURL}
            address={address}
            sizes={'(max-width: 768px) 80px'}
          />
        </div>
        <div className="max-w-full">
          <p className="font-gtBold text-center text-black dark:text-white whitespace-nowrap overflow-hidden text-ellipsis mt-2 text-truncate">
            {name}
          </p>
        </div>
        {/* <div className="text-sm text-black dark:text-white">{holder}</div> */}
        <Link
          href={`/flow/${address}`}
          className="px-12 py-2 mt-4 rounded-full border border-grey-500 dark:border-zinc-700 cursor-pointer text-black dark:text-white">
          View
        </Link>
      </div>
    </div>
  );
}
