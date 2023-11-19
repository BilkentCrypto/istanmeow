import React, { useState } from 'react';
import InputBox from '../InputBox/InputBox';
import VerificationBox from '../VerificationBox/VerificationBox';

const ProveContent = () => {
    const [inputValue, setInputValue] = useState('');

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