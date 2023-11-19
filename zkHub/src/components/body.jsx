import React from 'react';
import Card from './card';
import imageholder from '../assets/Placeholder.png';
import NFTS from '../assets/NFTs.png'
import social from '../assets/social.png'
import Poster from '../assets/Poster.png'


function Body() {
  return (
    <div className="container mx-auto  min-h-screen mt-16 px-12">
      <div className="grid rounded-3xl  grid-cols-1 md:grid-cols-1  justify-center items-center lg:grid-cols-2 gap-4 h-full">
        {/* left-side */}
        <div className='   ml-20 mb-20 '>
          <div className='text-4xl text-gray-800 font-sans font-bold'>
          Uninterrupted communication with 100% anonymity within your community.
          </div>
          
          <div className='text-1xl mt-8 text-gray-400 font-sans mr-10 font-normal'>
          While developing zkHub, we promise 100% anonymity among users with the zk technology we use on the Scroll, and thanks to WAKU, we offer fast communication between community members in an offchain and decentralized way.          </div>
          <button className=" mt-10 bg-[#D22FC6] text-white font-semibold hover:text-blue-700 py-3 px-16 border hover:border-blue-500 hover:bg-transparent rounded-xl">
            Let's start
          </button>
          <div className=' grid  justify-start items-start grid-cols-2'>
            <div>
              <div className='text-1xl mt-10 text-gray-500 font-sans  font-normal'>
                Community
              </div>
              <div className='text-4xl text-[#D22FC6] mt-3 font-sans  font-extrabold'>
                1.687+

              </div>
            </div>
            <div>
              <div className='text-1xl mt-10 text-gray-500 font-sans  font-normal'>
                User
              </div>
              <div className='text-4xl text-[#D22FC6] mt-3 font-sans  font-extrabold'>
                27.567+
              </div>
            </div>

          </div>

        </div>
        {/* right-side */}
        <div className='flex lg:justify-center  items-end  justify-end lg:items-center '>

          <div className="  mb-48 w-">
            <img src={Poster} alt="Logo" className="w-full h-full object-cover" />
          </div>

        </div>

      </div>

    </div>
  );
}

export default Body;
