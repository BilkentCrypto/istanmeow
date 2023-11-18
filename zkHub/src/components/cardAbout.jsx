import React from 'react'

export const CardAbout = ({ sponsor, text, text1, imageSrc }) => {
    return (
        <div className="bg-transparent text-black-700 font-semibold py-10 px-8 border border-blue-800   rounded-xl">
            <div className='flex items-center justify-center'><img
                src={imageSrc}
                alt="Card"
                className=" w-20 h-20 md:w-20 md:h-20"
                style={{ minWidth: '160px', minHeight: '160px', maxWidth: '100%', height: 'auto' }}
            />
            </div>
            <div className=' mt-8 font-bold text-center text-blue-900'>{sponsor}</div>
            <div className=' mt-3 text-sm text-center text-gray-700'>{text}</div>
            <div className=' mt-8 text-center text-blue-900'></div>

        </div>

    )
}
export default CardAbout
