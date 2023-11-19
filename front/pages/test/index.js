import React, { useEffect, useState } from 'react';
import { decryptMessage, encryptMessage } from '../../src/utils/encryption';
import { getTokens } from '../../src/utils/nftHooks';
import { useAccount } from 'wagmi'

export default function Test({params}) {

const [message, setMessage] = useState();
const [encrypted, setEncrypted] = useState();
const [tokens, setTokens] = useState();


const { address, isConnecting, isDisconnected } = useAccount()


useEffect( () => {
  fetchNfts()
}, [address] )

const fetchNfts = async () => {
  let newTokens = await getTokens(address);
  setTokens(newTokens);
}

const handleInputChange = (value) => {
  setMessage(value);
}
console.log("address: ", address);
console.log("tokens: ", tokens);


const handleEncrypt = async() => {
  setEncrypted( encryptMessage(message) );
}

const handleDecrypt = async( ) => {

  setEncrypted( decryptMessage( encrypted))
}
getTokens(address)
  return (
<>


</>
  );
}
