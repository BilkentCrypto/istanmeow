import React from 'react'

export const Card = ({sponsor}) => {
    return (
        <div className="bg-transparent flex justify-center items-center  text-black-700 font-semibold py-8 px-14 border border-blue-800   rounded-xl">
            {sponsor}
            
        </div>
        
    )
}
export default Card
