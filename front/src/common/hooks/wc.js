import { useCallback, useEffect, useMemo, useState } from 'react';
import WalletConnectProvider from '@walletconnect/web3-provider';

export default function useWC({ address = null }) {
  const [currentAccount, setCurrentAccount] = useState(address);
  const [currentChainId, setCurrentChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const ethereum = useMemo(() => {
    if (typeof window !== 'undefined') {
      const provider = new WalletConnectProvider({
        infuraId: 'INFURA_PROJECT_ID', // Your Infura project ID
      });
      return provider;
    }
  }, []);
  const connect = useCallback(cb => {
    setIsConnecting(true);
    ethereum
      .enable()
      .then(async accounts => {
        const address = accounts?.[0];
        setCurrentAccount(address);
        setCurrentChainId(1); // Set default chainId to Ethereum mainnet
        cb();

        try {
          const res = await fetch('/api/auth/request-message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address, chain: 1 || currentChainId }),
          });
          const data = await res.json();
          ethereum.sendAsync(
            {
              method: 'personal_sign',
              params: [
                `0x${Buffer.from(data.message, 'utf8').toString('hex')}`,
                address,
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

  const openWClogin = useCallback(() => {
    setOpenModal(true);
  }, []);

  const closeWClogin = useCallback(() => {
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
    openModal:
