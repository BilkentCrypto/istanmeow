import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <div className="h-14 border-t dark:border-zinc-700 flex justify-center items-center bg-white dark:bg-neutral-800">
      <div className="flex justify-between items-center w-full max-w-5xl px-4 mx-auto">
        <p className="text-black text-sm font-gt dark:text-white">
          zkHub © 2023. All rights reserved.
        </p>
      </div>
    </div>
  );
}
