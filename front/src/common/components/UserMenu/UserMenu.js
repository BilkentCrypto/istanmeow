import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

import moon from '../../../assets/svg/moon.svg';
import sun from '../../../assets/svg/sun.svg';

export default function UserMenu({ onClick, address }) {
  const [themeW, setThemeW] = useState('light');
  const { systemTheme, theme, setTheme } = useTheme();

  useEffect(() => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    setTheme('light');
    setThemeW('light');
  }, [theme]);
  return (
    <div className="bg-white p-4  border border-gray-200 rounded-2xl shadow-2xl dark:shadow-2xl dark:shadow-neutral-900 sm:p-2 dark:bg-neutral-800 dark:border-zinc-700 z-0">
      <div
        onClick={() => (theme == 'dark' ? setTheme('light') : setTheme('dark'))}
        className=" ml-2 mt-2 flex rounded-full h-10 w-10 border border-grey-500 dark:border-zinc-700 justify-center items-center content-center">
        <Image
          alt="thm"
          className="w-5 h-5"
          src={themeW === 'dark' ? sun : moon}
        />
      </div>
      {/* <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
        User menu
      </h5> */}
          <span
            onClick={onClick}
            className="flex items-center py-1 text-base text-gray-900 rounded-lg group hover:text-gray-600 dark:hover:text-gray-200 dark:text-white cursor-pointer">
            {address ? (
              <span className="flex-1 ml-3 whitespace-nowrap text-xl">
                Disconnect
              </span>
            ) : null}
          </span>
    </div>
  );
}
