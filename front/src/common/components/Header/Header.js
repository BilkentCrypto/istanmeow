import React, { useContext, useRef, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

import Wallet from '../Wallet/Wallet';
import { MMContext } from '../../contexts/mm';
import Spinner from '../Spinner';
import UserMenu from '../UserMenu';
import Avatar from '../Avatar';
import moon from '../../../assets/svg/moon.svg';
import sun from '../../../assets/svg/sun.svg';
import Image from 'next/image';

export default function Header({ headerText }) {
  const [visible, setVisible] = useState('null');
  const [themeW, setThemeW] = useState('light');
  const {
    connect,
    address,
    isConnecting,
    isAuthorized,
    disconnect,
    openMMlogin,
    closeMMlogin,
    openModal,
  } = useContext(MMContext);
  const { systemTheme, theme, setTheme } = useTheme();

  const walletRef = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const connectButtonRef = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    if (openModal) {
      setVisible('connect');
    }
  }, [openModal]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        walletRef.current &&
        !walletRef.current.contains(event.target) &&
        connectButtonRef.current &&
        !connectButtonRef.current.contains(event.target) &&
        visible === 'connect'
      ) {
        setVisible(null);
        closeMMlogin();
      }

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target) &&
        visible === 'menu'
      ) {
        setVisible(null);
        closeMMlogin();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [visible]);

  useEffect(() => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    setTheme('light');
    setThemeW('light');
  }, [theme]);

  return (
    <nav
      className="mx-auto sticky top-0 flex flex-row h-16 items-center justify-end sm:justify-center w-full dark:border-zinc-700 bg-white dark:bg-neutral-800 z-50 border-b"
      aria-label="Global">
        {/* TODO: fix padding for smaller screens, was sm:px-6 b4 but it lags somehow */}
      <div className="flex-row flex flex-grow max-w-990 justify-between items-center self-center">
        <div className="hidden sm:block">
          <a href="/" className="">
            <span className="text-black font-gtBold dark:text-white">
              {headerText}
            </span>
          </a>
        </div>
        <div className="flex flex-row justify-center items-center">
          {address ? (
            <>
              {isConnecting ? <Spinner className="w-4 h-4" /> : null}
              <div className="rounded-full border border-grey-500 dark:border-zinc-700 p-2 flex flex-row align-center">
                <div
                  className="mr-2"
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                  }}>
                  <Avatar address={address} />
                  {/* <canvas ref={canvas} /> */}
                </div>
                <span className="dark:text-white text-black">{`${address.slice(
                  0,
                  9,
                )}...${address.slice(-3)}`}</span>
              </div>
            </>
          ) : (
            <div
              ref={connectButtonRef}
              onClick={() => setVisible('connect')}
              className="py-2 px-4 rounded-full border border-grey-500 dark:border-zinc-700">
              <span className="text-base dark:text-white leading-6 text-gray-900 cursor-pointer">
                Connect Wallet <span aria-hidden="true"></span>
              </span>
            </div>
          )}
          <div
            ref={menuButtonRef}
            className="p-2 ml-3 flex rounded-full h-10 w-10 border border-grey-500 dark:border-zinc-700 justify-center items-center content-center cursor-pointer"
            onClick={() => setVisible('menu')}>
            <div className="flex flex-row">
              <div className="w-1 h-1 mx-0.5 rounded-full bg-black dark:bg-white"></div>
              <div className="w-1 h-1 mx-0.5 rounded-full bg-black dark:bg-white"></div>
              <div className="w-1 h-1 mx-0.5 rounded-full bg-black dark:bg-white"></div>
            </div>
          </div>
          {visible === 'menu' ? (
            <div className="absolute top-16 w-80 z-50" ref={menuRef}>
              <UserMenu
                address={address}
                onClick={() => {
                  disconnect();
                  setVisible(null);
                }}
              />
            </div>
          ) : null}
          {visible === 'connect' ? (
            <div className="absolute top-16   z-50" ref={walletRef}>
              <Wallet
                onClick={() => {
                  connect(() => setVisible(null));
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
