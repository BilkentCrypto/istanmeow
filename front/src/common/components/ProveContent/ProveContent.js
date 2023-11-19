import React from 'react'
import InputBox from '../InputBox/InputBox';

const ProveContent = () => {
    const handleFormSubmit = (data) => {
        console.log('send data', data);

    };
    return (

        <div>
            <div className=' mt-60 items-center justify-center'>

            <div className=" flex items-center justify-center">
                <InputBox onSubmit={handleFormSubmit} />
            </div>
        </div></div>
    )
}

export default ProveContent