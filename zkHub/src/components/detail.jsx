import React from 'react'
import Flash from '../assets/Flash.png'
import Link from '../assets/Link.png'
import Shield from '../assets/Shield.png'

const Detail = () => {
    return (
        <div className="container mx-auto mt-10 mb-20 h-full px-12">
            <div className=' grid grid-cols-1 lg:grid-cols-2 '>
                {/* left-side */}
                <div className='gap-4 mr-5'>
                    <div className='text-5xl  mb-2 text-left text-gray-700 font-sans font-bold'>
                        Buy and hold NFTs.
                    </div>
                    <div className='text-5xl mb-2 text-left text-gray-700  font-bold relative'>
                        Communicate <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                            privately
                        </span>
                    </div>
                    <div className='text-5xl mb-4 text-left text-gray-700 font-sans font-bold'>
                        with NFT holders.
                    </div>
                    <div className=' bg-gray-100  flex  items-center w-full h-44 rounded-2xl'>
                        <div className='text-2xl text-left ml-10 mb-4  text-gray-600 font-sans font-bold'>
                            Fast Communication
                        </div>
                        <div className=" w-14 ml-48 items-end flex justify-end">
                            <img src={Flash} alt="Logo" className="w-full h-full items-end flex justify-end object-cover" />
                        </div>
                    </div>
                    <div className=' mt-8  bg-gray-100 flex  items-center  w-full h-44 rounded-2xl'>
                        <div className='text-2xl text-left ml-10 mb-4  text-gray-600 font-sans font-bold'>
                            Stay Engaged
                            with the Community
                        </div>
                        <div className=" w-10 ml-12">
                            <img src={Link} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
                {/* right-side */}
                <div className='gap-4 mt-5  lg:mt-0 lg:ml-5'>
                    <div className='text-1xl ml-5 lg:text-right text-left text-transparent font-sans  font-normal'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, libero vitae consequat ultricies, justo ante ultrices risus, at molestie metus mi non ex. Nulla vitae odio quis neque volutpat condimentum.  Lorem ipsum dolor sit amet, consectetur adipiscing elit.

                    </div>
                    <div className='mt-20 bg-gray-100 w-full  gap-0 grid h-96 rounded-2xl'>
                        <div className='text-2xl text-left mt-10 ml-10 text-gray-600 font-sans font-bold'>
                            100% Anonymity
                        </div>
                        <div className='text-1xl ml-10 mt-10 text-left mr-10 mb-40  text-gray-400 font-sans  font-normal'>
                        With Semaphore, a privacy layer we run in the scroll, we can determine whether users own an asset or not without sharing any of the user's data.                            <div className="w-24 h-24 mt-5 ml-48 mb-50 ">
                            <img src={Shield} alt="Logo" className="w-full h-full flex items-center justify-center object-cover" />
                        </div>

                        </div>
                        
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Detail