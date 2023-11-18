import React from 'react'
import CardAbout from './cardAbout';
import imageholder from '../assets/Placeholder.png';

export const Content = () => {
    return (
        <div className="container mx-auto mb-16 h-full px-12">
            <div className=' '>
                <div className='text-3xl mb-10 text-center text-gray-700 font-sans font-bold'>
                    What our clients say
                </div>
                <div className='text-1xl mt-10 text-center text-gray-400 font-sans mr-10 font-normal'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, libero vitae consequat ultricies, justo ante ultrices risus, at molestie metus mi non ex. Nulla vitae odio quis neque volutpat condimentum.  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat, libero vitae consequat ultricies, justo ante ultrices risus, at molestie metus mi non ex.

                </div>

            </div>
            <div className=" mb-10 mt-16 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-7 h-full">
                <CardAbout imageSrc={imageholder} sponsor={"An amazing service"} text={"Lorem ipsum dolor sit ametolil col consectetur adipiscing lectus a nunc mauris scelerisque sed egestas."} text1={"John Carter"} />
                <CardAbout imageSrc={imageholder} sponsor={"An amazing service"} text={"Lorem ipsum dolor sit ametolil col consectetur adipiscing lectus a nunc mauris scelerisque sed egestas."} text1={"John Carter"} />
                <CardAbout imageSrc={imageholder} sponsor={"An amazing service"} text={"Lorem ipsum dolor sit ametolil col consectetur adipiscing lectus a nunc mauris scelerisque sed egestas."} text1={"John Carter"} />


            </div>
        </div>
    )
}

export default Content