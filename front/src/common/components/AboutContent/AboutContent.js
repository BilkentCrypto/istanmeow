import React, { useEffect, useState } from 'react'

import Test from '../Test/Test';
import Navbar from '../Navbar/Navbar';
import { readContract, writeContract } from '@wagmi/core'
import { useAccount, useContractRead, useContractReads } from 'wagmi'
import addresses from '../../../utils/abis/addresses.json'
import erc721ABI from '../../../utils/abis/erc721E.json'
import zkHubAbi from '../../../utils/abis/ZKHub.json'
import axios from 'axios';
import { signMessage } from '@wagmi/core'
import { Identity } from "@semaphore-protocol/identity"

const AboutContent = () => {
    const [selectedCard, setSelectedCard] = useState(null);

    const collectionAddress = "0xe42fA2774A5502faCf1AB83Bc22eD6C2d9Aa583E"
    const { address, isConnecting, isDisconnected } = useAccount()

const [nfts, setNfts] = useState();

    useEffect(() => {
        readyNfts();
    }, [address]);





    const readyNfts = async () => {
        const nfts = [];
        for (let i = 0; i < 3; i++) {
            let id = await readContract({
                address: collectionAddress,
                abi: erc721ABI,
                functionName: 'tokenOfOwnerByIndex',
                args: [address, i],
            })
            let metadataUrl = await readContract({
                address: collectionAddress,
                abi: erc721ABI,
                functionName: 'tokenURI',
                args: [id],
            })
            metadataUrl = metadataUrl.split("//")[1]
            let data = await axios.get(`https://gateway.ipfs.io/ipfs/${metadataUrl}`)
            console.log("metadata", data)
            //data.data.description
            //data.data.image
            //data.data.name
            data.data.image = data.data.image.split("//")[1]
console.log(data.data.image)

            nfts.push(                
            <Test
                key={id}
                title={data.data.name}
                imageUrl={`https://gateway.ipfs.io/ipfs/${data.data.image}`}
                selected={selectedCard === id}
                onClick={() => setSelectedCard(id)}
            />)
            
        }
        setNfts(nfts)
    }

    const handleApprove = async () => {
        try{
        let tx = await writeContract({
            address: collectionAddress,
            abi: erc721ABI,
            functionName: 'setApprovalForAll',
            args: [addresses.ZKHub, true],
        });
    } catch(e) {

    }
    }


    const handleLock = async () => {

        const messageToSign = address+"semaphoreZkHub";
        let signedMessage = await signMessage({message: messageToSign});
        const identity = new Identity(signedMessage);
        console.log("identity", identity)


        try{
        let tx = await writeContract({
            address: addresses.ZKHub,
            abi: zkHubAbi,
            functionName: 'lockNft',
            args: [collectionAddress, 2, identity.commitment],
        });
    } catch(e) {
        
    }
    }

    return (
        <div className='mt-5'>
            <div className='ml-5  font-bold text-2xl text-black'>
                Choose NFT for Locking


            </div>
            <div className='grid mt-5 justify-center gap-24   grid-cols-1  sm:grid-cols-2 md:grid-cols-3 items-center lg:grid-cols-4'>
                {nfts}

            </div>
            <div className='flex mt-5 items-center justify-center'>
                <button onClick={handleApprove} className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800  rounded-lg font-bold px-12 text- py-4 text-center me-2 mb-2">Approve</button>
                <button onClick={handleLock} className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800  rounded-lg font-bold px-12 text- py-4 text-center me-2 mb-2">Lock</button>

            </div>
        </div>






    )
}

export default AboutContent;