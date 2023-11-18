import { useCallback, useEffect, useMemo, useState } from 'react';
import MetaMaskSDK from '@metamask/sdk';
import qs from 'qs';

export default function useMM({ address = null }) {
  const [currentAccount, setCurrentAccount] = useState(address);
  const [currentChainId, setCurrentChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const ethereum = useMemo(() => {
    if (typeof window !== 'undefined') {
      const MMSDK = new MetaMaskSDK({
        useDeeplink: false,
        communicationLayerPreference: 'socket',
      });
      return MMSDK.getProvider();
    }
  }, []);
  const connect = useCallback(cb => {
    setIsConnecting(true);
    Promise.all([
      ethereum.request({
        method: 'eth_requestAccounts',
        params: [],
      }),
      ethereum.request({ method: 'eth_chainId' }),
    ])
      .then(async ([addresses, chain]) => {
        const address = addresses?.[0];
        setCurrentAccount(address);
        setCurrentChainId(chain);
        cb();

        try {
          const res = await fetch('/api/auth/request-message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address, chain: chain }),
          });
          
          const data = await res.json();
          ethereum.sendAsync(
            {
              method: 'personal_sign',
              params: [
                address,
                `0x${Buffer.from(data.message, 'utf8').toString('hex')}`,
              ],
              from: address,
            },
            async (err, result) => {
              if (err) {
                console.log(err);

                return;
              }

              await fetch('/api/auth/sign-message', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  message: data.message,
                  signature: result.result,
                  chain: chain,
                }),
              });
              setIsConnecting(false);
              setIsAuthorized(true);
              // cookie to understand on SSR side that user already authorized
              document.cookie = `address=${address}; path=/`;
            },
          );
        } catch (error) {
          console.log(error);
          setIsConnecting(false);
        }
      })
      .catch(e => {
        console.log('request accounts ERR', e);
        setIsConnecting(false);
      });
  });
  const disconnect = useCallback(() => {
    fetch('/api/auth/logout').then(() => {
      document.cookie = 'address=; path=/';
      setCurrentAccount(null);
      setIsAuthorized(false);
      setCurrentAccount(null);
      setCurrentChainId(null);
    });
  }, []);

  const openMMlogin = useCallback(() => {
    setOpenModal(true);
  }, []);

  const closeMMlogin = useCallback(() => {
    setOpenModal(false);
  }, []);

  useEffect(() => {
    setOpenModal(false);
  }, [isAuthorized]);

  useEffect(() => {
    ethereum.on('accountsChanged', accounts => {
      if (accounts.length !== 0) {
        setCurrentAccount(accounts?.[0]);
      }
    });
    ethereum.on('chainChanged', chain => {
      setCurrentChainId(chain);
    });

    // read cookie isSetAuthorized
    const cookies = qs.parse(document.cookie, {
      ignoreQueryPrefix: true,
      delimiter: ';',
    });

    if (cookies.address) {
      setIsAuthorized(true);
    }
  }, []);

  return {
    address: currentAccount,
    chainId: currentChainId,
    connect,
    ethereum,
    isConnecting,
    // has token
    isAuthorized,
    openModal,
    disconnect,
    openMMlogin,
    closeMMlogin,
  };
}
