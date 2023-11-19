import React from 'react'

import Test from '../Test/Test';
import Navbar from '../Navbar/Navbar';
import { useState } from 'react';



const AboutContent = () => {
    const [selectedCard, setSelectedCard] = useState(null);

    


   

    return (
        <div className='mt-5'>
            <div className='ml-5  font-bold text-2xl text-black'>
                Choose NFT for Locking


            </div>
            <div className='grid mt-5 justify-center gap-24   grid-cols-1  sm:grid-cols-2 md:grid-cols-3 items-center lg:grid-cols-4'>
                <Test
                    key={4}
                    title={`NFT ${4 + 1}`}
                    imageUrl={`https://via.placeholder.com/200x200?text=NFT${4 + 1}`}
                    selected={selectedCard === 4}
                    onClick={() => handleCardClick(4)}
                />
                <Test
                    key={4}
                    title={`NFT ${45 + 1}`}
                    imageUrl={`https://via.placeholder.com/200x200?text=NFT${45 + 1}`}
                    selected={selectedCard === 45}
                    onClick={() => handleCardClick(45)}
                />
                <Test
                    key={4}
                    title={`NFT ${4 + 1}`}
                    imageUrl={`https://via.placeholder.com/200x200?text=NFT${4 + 1}`}
                    selected={selectedCard === 4}
                    onClick={() => handleCardClick(4)}
                />
                <Test
                    key={4}
                    title={`NFT ${4 + 1}`}
                    imageUrl={`https://via.placeholder.com/200x200?text=NFT${4 + 1}`}
                    selected={selectedCard === 4}
                    onClick={() => handleCardClick(4)}
                />
                <Test
                    key={4}
                    title={`NFT ${4 + 1}`}
                    imageUrl={`https://via.placeholder.com/200x200?text=NFT${4 + 1}`}
                    selected={selectedCard === 4}
                    onClick={() => handleCardClick(4)}
                />
                <Test
                    key={4}
                    title={`NFT ${45 + 1}`}
                    imageUrl={`https://via.placeholder.com/200x200?text=NFT${45 + 1}`}
                    selected={selectedCard === 45}
                    onClick={() => handleCardClick(45)}
                />
                <Test
                    key={4}
                    title={`NFT ${4 + 1}`}
                    imageUrl={`https://via.placeholder.com/200x200?text=NFT${4 + 1}`}
                    selected={selectedCard === 4}
                    onClick={() => handleCardClick(4)}
                />
                <Test
                    key={4}
                    title={`NFT ${4 + 1}`}
                    imageUrl={`https://via.placeholder.com/200x200?text=NFT${4 + 1}`}
                    selected={selectedCard === 4}
                    onClick={() => handleCardClick(4)}
                />

            </div>
            <div className='flex mt-5 items-center justify-center'>
                <button className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800  rounded-lg font-bold px-12 text- py-4 text-center me-2 mb-2">Approve</button>

                
            </div>
        </div>






    )
}

export default AboutContent;