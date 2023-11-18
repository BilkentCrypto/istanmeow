import React, { useEffect, useState } from 'react';
import MetaMaskSDK from '@metamask/sdk';

const useConnectWallet = options => {
  const MMSDK = new MetaMaskSDK(options);

  const wallet = MMSDK.getProvider();

  return wallet;
};

export default useConnectWallet;



// import WalletConnectProvider from '@walletconnect/web3-provider';

// const useConnectWallet = () => {
//   const [wallet, setWallet] = useState(null);

//   useEffect(() => {
//     const provider = new WalletConnectProvider({
//       infuraId: 'INFURA_PROJECT_ID', // Your Infura project ID
//     });

//     setWallet(provider);
//   }, []);

//   return wallet;
// };

// export default useConnectWallet;