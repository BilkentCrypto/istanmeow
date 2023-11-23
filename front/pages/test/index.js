import React, { useEffect, useState } from 'react';
import { decryptMessage, encryptMessage } from '../../src/utils/encryption';
import { getTokens } from '../../src/utils/nftHooks';
import { useAccount } from 'wagmi'
import addresses from '../../src/utils/abis/addresses.json'
import semaphoreAbi from '../../src/utils/abis/Semaphore.json'
import { signMessage, writeContract } from '@wagmi/core'
import { Identity } from "@semaphore-protocol/identity"
import { semaphore } from '../../src/utils/semaphore';

export default function Test({params}) {

const [message, setMessage] = useState();
const [encrypted, setEncrypted] = useState();
const [tokens, setTokens] = useState();
const [text, setText] = useState();


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

const handleClick = async () => {
  const messageToSign = address+"semaphoreZkHub";
  let signedMessage = await signMessage({message: messageToSign});
  const identity = new Identity(signedMessage);
  console.log("identity", identity)

  const { hash } = await writeContract({
    address: addresses.Semaphore,
    abi: semaphoreAbi,
    functionName: 'addMember',
    args: [0, identity.commitment],
  });
  console.log("hash", hash)
  
}

const handleCreate = async () => {

  const { hash } = await writeContract({
    address: addresses.Semaphore,
    abi: semaphoreAbi,
    functionName: 'createGroup',
    args: [0, 20, address],
  });
  console.log("hash", hash)
  
}

getTokens(address)
  return (
<>
<button onClick={handleClick}>Test</button>
<button onClick={handleCreate}>Create</button>
<h1>{text}</h1>
</>
  );
}
