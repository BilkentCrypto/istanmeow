import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import LatestIcon from '../../../assets/images/LatestIcon.png';
import MostDiscussedIcon from '../../../assets/images/MostDiscussedIcon.png';
import MostUpvotedIcon from '../../../assets/images/MostUpvotedIcon.png';
import RandomIcon from '../../../assets/images/RandomIcon.png';
import LatestIconW from '../../../assets/svg/LatestIcon.svg';
import MostDiscussedIconW from '../../../assets/svg/MostDiscussedIcon.svg';
import MostUpvotedIconW from '../../../assets/svg/MostUpvotedIcon.svg';
import RandomIconW from '../../../assets/svg/RandomIcon.svg';

export default function SortPostsBunner({}) {
  const [themeW, setThemeW] = useState('light');
  const { systemTheme, theme, setTheme } = useTheme();

  useEffect(() => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    setTheme('light');
    setThemeW('light');
  }, [theme]);

  return (
    <div className="rounded-md flex h-16  content-center items-center  my-4 border border-gray-200 px-2 py-1 dark:border-zinc-700 dark:bg-neutral-800">
      <div className="flex row w-full justify-between">
        <div className="h-12 mr-6 content-center items-center flex rounded-full bg-gray-200  dark:bg-neutral-700">
          <div className="flex row items-center px-4">
            <Image
              alt=""
              className="w-6 h-6 hidden xl:block"
              src={themeW === 'dark' ? LatestIconW : LatestIcon}
            />
            <p className="px-2 text-black dark:text-white">Forum</p>
          </div>
        </div>
        <div className="h-12 mr-6 content-center items-center flex rounded-full bg-white  dark:bg-neutral-800">
          <div className="flex row items-center px-4">
            <Image
              alt=""
              className="w-6 h-6 opacity-50 hidden xl:block"
              src={themeW === 'dark' ? RandomIconW : RandomIcon}
            />
            <p className="px-2 text-gray-400 dark:text-white">Events</p>
          </div>
        </div>
        <div className="h-12 mr-6 content-center items-center flex rounded-full bg-white  dark:bg-neutral-800">
          <div className="flex row items-center px-4">
            <Image
              alt=""
              className="w-6 h-6 opacity-50 hidden xl:block"
              src={themeW === 'dark' ? MostDiscussedIconW : MostDiscussedIcon}
            />
            <p className="px-2 text-gray-400 dark:text-white">Updates</p>
          </div>
        </div>
        <div className="h-12 mr-6 content-center items-center flex rounded-full bg-white  dark:bg-neutral-800">
          <div className="flex row items-center px-4">
            <Image
              alt=""
              className="w-6 h-6 opacity-50 hidden xl:block"
              src={themeW === 'dark' ? MostUpvotedIconW : MostUpvotedIcon}
            />
            <p className="px-2 text-gray-400 dark:text-white">Stats</p>
          </div>
        </div>
      </div>
    </div>
  );
}
