import React from 'react'
import Navbar from '../../src/common/components/Navbar/Navbar'

import AboutContent from '../../src/common/components/AboutContent/AboutContent'

const about = () => {
  return (
    <div className='bg-red  flex min-h-screen grid-2'>
    <Navbar />
    <div className='flex ml-8 justify-center items-center bg-white h-full mt-8 md:mt-20'>
        <AboutContent/>
    </div>
</div>
  )
}

export default about