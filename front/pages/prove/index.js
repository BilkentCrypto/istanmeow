import React from 'react'
import ProveContent from '../../src/common/components/ProveContent/ProveContent'
import Navbar from '../../src/common/components/Navbar/Navbar'

const Prove = () => {
    return (
        <div className=' flex min-h-screen grid-2'>
            <Navbar />
            <div className='flex-1 ml-8 justify-center items-center bg-white h-full mt-8 md:mt-20'>
                <ProveContent />
            </div>
        </div>
    )
}

export default Prove