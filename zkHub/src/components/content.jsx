import React from 'react'
import CardAbout from './cardAbout';
import scroll from '../assets/scroll.png';
import waku from '../assets/waku.jpeg';
import wallet from '../assets/wallet.png';


export const Content = () => {
    return (
        <div className="container mx-auto mb-16 h-full px-12">
            <div className=' '>
                <div className='text-3xl mb-10 text-center text-gray-700 font-sans font-bold'>
                Technologies used in the development of zkHub                </div>
                <div className='text-1xl mt-10 text-center text-gray-400 font-sans mr-10 font-normal'>

                </div>

            </div>
            <div className=" mb-10 mt-16 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-7 h-full">
                <CardAbout imageSrc={waku} sponsor={"WAKU"} text={"Off-chain and decentralized communication"} text1={"John Carter"} />
                <CardAbout imageSrc={scroll} sponsor={"SCROLL"} text={"ZK information verification with Semaphore that we developed on Scroll."} text1={"John Carter"} />
                <CardAbout imageSrc={wallet} sponsor={"CONNECTWALLET"} text={"Thousands of users can quickly connect to zkHub with walletconnect."} text1={"John Carter"} />


            </div>
        </div>
    )
}

export default Content