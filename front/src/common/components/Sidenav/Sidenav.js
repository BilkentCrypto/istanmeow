import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from 'react-query';
import Image from 'next/image';

import { getContracts } from '../../../../data/contracts';
import { MMContext } from '../../contexts/mm';
import Avatar from '../Avatar/Avatar';

export default function Sidenav({ initialData = [] }) {
  const { data, refetch } = useQuery(
    'ownContracts',
    () =>
      getContracts(null, {
        own: true,
      }),
    {
      initialData,
      staleTime: Infinity,
      refetchOnMount: false,
    },
  );
  const { isAuthorized } = useContext(MMContext);

  useEffect(() => {
    refetch();
  }, [isAuthorized]);

  return (
    <aside className="flex  max-h-full border-r  border-grey-500 dark:border-zinc-700">
      <div className="flex flex-col items-center w-16 h-screen py-4 space-y-4 bg-white dark:bg-neutral-800 ">
        <div className="">
          <Link
            href="/"
            className="text-lg font-gtBold text-black dark:text-white">
            nftQ
          </Link>
        </div>
        {data ? (
          <>
            {data?.contracts?.map((e, i) => (
              <Link
                key={i}
                href={`/flow/${e.address}`}
                className=" text-gray-500 py-0  rounded-full border border-grey-500">
                {/* {e.imageURL ? (
                  <Image
                    alt="logo"
                    className="w-12 h-12 object-cover rounded-full"
                    width="12"
                    height="12"
                    src={e.imageURL}
                  />
                ) : ( */}
                <div className="w-12 h-12 object-cover rounded-full overflow-hidden">
                  <Avatar image={e.imageURL} address={e.address} />
                </div>
                {/* )} */}
              </Link>
            ))}
          </>
        ) : null}
      </div>
    </aside>
  );
}
