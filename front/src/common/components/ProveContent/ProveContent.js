import React, { useState } from 'react';
import InputBox from '../InputBox/InputBox';
import VerificationBox from '../VerificationBox/VerificationBox';
import { useEffect } from 'react';
import { useAccount } from 'wagmi'
import addresses from '../../../utils/abis/addresses.json'
import semaphoreAbi from '../../../utils/abis/Semaphore.json'
import { signMessage, writeContract } from '@wagmi/core'
import { Identity } from "@semaphore-protocol/identity"


const ProveContent = () => {
    const [inputValue, setInputValue] = useState('');
console.log("addresses", addresses)



    const handleFormSubmit = (data) => {
      setInputValue(data.input1);
    };
    return (

        <div>
            <div className=' mt-60 items-center justify-center'>

            <div className=" flex items-center justify-center">
                <InputBox onSubmit={handleFormSubmit} />
                

            </div>
            <div className='flex mt-10 items-center justify-center'>
            <VerificationBox value={inputValue} />
            </div>
        </div></div>
    )
}

export default ProveContent