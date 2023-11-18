import React from 'react';
import Image from 'next/image';

import UpBlue from '../../../assets/svg/UpBlue.svg';
import GreyArrow from '../../../assets/svg/GreyArrow.svg';
import DownRed from '../../../assets/svg/DownRed.svg';

export default function Vote({
  currentVote,
  onClickUp,
  onClickDown,
  votes,
  hasAccess,
}) {
  return (
    <div className="flex flex-row">
      {currentVote > 0 ? (
        <Image
          alt=""
          className="w-5 h-6 cursor-pointer"
          src={UpBlue}
          onClick={() => {}}
        />
      ) : (
        <Image
          alt=""
          className={`w-5 h-6 rotate-180 cursor-pointer ${
            currentVote < 0 && 'opacity-20'
          } ${!hasAccess && 'cursor-default'}`}
          src={GreyArrow}
          onClick={onClickUp}
        />
      )}
      <p
        className={`mx-4 ${
          votes > 0
            ? 'text-blue-500'
            : votes < 0
            ? 'text-red-500'
            : 'text-gray-400'
        }`}>{`${votes > 0 ? '+' : ''}${votes}`}</p>
      {currentVote < 0 ? (
        <Image
          alt=""
          className="w-5 h-6 cursor-pointer"
          src={DownRed}
          onClick={() => {}}
        />
      ) : (
        <Image
          alt=""
          className={`w-5 h-6 cursor-pointer ${
            currentVote > 0 && 'opacity-20'
          } ${!hasAccess && 'cursor-default'}`}
          src={GreyArrow}
          onClick={onClickDown}
        />
      )}
    </div>
  );
}
