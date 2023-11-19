// components/InputBox.js

import React from 'react';

import { useAccount } from 'wagmi'
import addresses from '../../../utils/abis/addresses.json'
import semaphoreAbi from '../../../utils/abis/Semaphore.json'
import { signMessage, writeContract, fetchBlockNumber  } from '@wagmi/core'
import { Identity } from "@semaphore-protocol/identity"
import { generateProof } from "@semaphore-protocol/proof"

import { SemaphoreEthers } from "@semaphore-protocol/data"

const InputBox = ({ onSubmit }) => {
  const [input1, setInput1] = React.useState('');
  const [input2, setInput2] = React.useState('');


  const handleGenerateProof = async () => {
    let block = await fetchBlockNumber();
    const semaphore = new SemaphoreEthers("https://sepolia-rpc.scroll.io", {
      address: addresses.Semaphore,
      startBlock: b - 10
      
  });
  

    let members = await semaphore.getGroupMembers("0")
    console.log("members", members);
    const messageToSign = address+"zkHub";
    let signedMessage = await signMessage({message: messageToSign});
    const identity = new Identity(signedMessage);
    console.log("identity", identity)
  
    const fullProof = await generateProof(identity, group, externalNullifier, signal)

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ input1, input2 });
    setInput1('');
    setInput2('');
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md shadow-md">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
          placeholder="Input 1"
          className="border border-gray-300 rounded-md px-3 py-2"
        />
        <input
          type="text"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
          placeholder="Input 2"
          className="border border-gray-300 rounded-md px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          onClick={handleGenerateProof}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default InputBox;
