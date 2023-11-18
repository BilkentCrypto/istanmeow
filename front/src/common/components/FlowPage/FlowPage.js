import React, { useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import Message from '../Message';
import Layout from '../Layout/Layout';

import { getContract } from '../../../../data/contracts';
import { getPosts } from '../../../../data/posts';

import link from '../../../assets/svg/link.svg';
import etherscan from '../../../assets/svg/etherscan.svg';
import etherscanDark from '../../../assets/svg/etherscandark.svg';
import twitter from '../../../assets/svg/twitter.svg';
import discord from '../../../assets/svg/discord.svg';
import eth from '../../../assets/svg/eth.svg';
import CreatePostBanner from '../CreatePostBanner';
import SortPostsBunner from '../SortPostsBunner/SortPostsBunner';
import Avatar from '../Avatar/Avatar';
import { MMContext } from '../../contexts/mm';
import Spinner from '../Spinner';

export default function Flow({
  initialDataContract,
  initialDataPosts,
  address,
}) {
  const { isLoading, data: contract } = useQuery(
    ['contract', address],
    () => getContract(null, address),
    {
      initialData: initialDataContract,
    },
  );
  const { data: posts, isLoading: isPostLoading } = useQuery(
    ['posts', address],
    () => getPosts(null, address),
    {
      cacheTime: 0,
    },
  );
  const [err, setErr] = useState(false);
  const { isAuthorized, openMMlogin } = useContext(MMContext);
  const queryClient = useQueryClient();
  const [currentTheme, setCurrentTheme] = React.useState();
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    setCurrentTheme(currentTheme);
  }, [theme]);

  useEffect(() => {
    queryClient.invalidateQueries(['contract', address], {
      forceRefetch: true,
    });
    queryClient.invalidateQueries(['posts', address], {
      forceRefetch: true,
    });
  }, [isAuthorized]);

  return (
    <Layout headerText="">
      <div className="flexflex-col border-grey-500  dark:border-zinc-700">
        <div className="h-32 relative flex grow justify-center bg-neutral-700">
          {!err && contract?.bannerURL ? (
            <Image
              alt=""
              onError={e => {
                setErr(!err);
              }}
              className="object-cover"
              fill
              src={contract?.bannerURL}
            />
          ) : null}
        </div>
        <div className="flex grow flex-row justify-center">
          <div className="w-3/4 flex flex-row">
            <div className="w-24 h-24 -mt-6 bg-white rounded-full relative border-white dark:border-neutral-800 border-4">
              <Avatar
                imageStyle="rounded-full object-cover"
                key={address}
                image={contract?.imageURL}
                address={address}
                w={96}
                h={96}
              />
            </div>
            <div className="flex flex-col mt-2.5 ml-3">
              <p className="text-2xl font-gtBold text-black dark:text-white">
                {contract.name}
              </p>
              <p className="text-sm text-gray-400">{`nftQ/${contract.address}`}</p>
            </div>
          </div>
        </div>
        <div className="flex grow justify-center">
          <div className=" w-3/4">
            <div className="flex flex-row">
              <div className="basis-2/3">
                {contract?.hasAccess ? (
                  <CreatePostBanner
                    address={address}
                    contract={contract}
                    onClick={`/flow/${address}/create`}
                  />
                ) : null}
                <SortPostsBunner />
                {posts?.length ? (
                  posts?.map((e, i) => (
                    <Message
                      key={i}
                      data={e}
                      isAuthorized={isAuthorized}
                      openMMlogin={openMMlogin}
                      hasAccess={contract?.hasAccess}
                    />
                  ))
                ) : (
                  <div className="py-12 flex justify-center align-center">
                    {isPostLoading ? (
                      <Spinner />
                    ) : (
                      <p className="text-center">
                        There are no discussions yet. Be the first to post in
                        this community.
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="basis-1/3">
                <div className="rounded-md flex bg-white my-4 ml-4 border dark:border-zinc-700 dark:bg-neutral-800 ">
                  <div className="p-4">
                    <p className="text-base font-gtBold text-gray-700 dark:text-white">
                      About Community
                    </p>
                    <p className="text-base text-gray-700  dark:text-white pt-2">
                      {contract?.description ||
                        'There is no description for this community yet.'}
                    </p>
                    <div className="flex flex-row mt-4">
                      <a
                        href={`https://etherscan.io/address/${address}`}
                        target="_blank">
                        <Image
                          alt=""
                          className="w-6 h-6 mr-2"
                          src={
                            currentTheme === 'dark' ? etherscanDark : etherscan
                          }
                        />
                      </a>
                      {/* <Image alt="" className="w-6 h-6 mr-2" src={twitter} />
                      <Image alt="" className="w-6 h-6 mr-2" src={discord} />
                      <Image alt="" className="w-6 h-6 mr-2" src={eth} /> */}
                    </div>
                  </div>
                </div>
                <div className="rounded-md bg-white mt-4 mb-16 ml-4 border flex dark:border-zinc-700 dark:bg-neutral-800">
                  <div className="p-4">
                    <p className="text-base font-gtBold text-gray-700 dark:text-white">
                      Community Guidelines
                    </p>
                    <ul className="my-4 text-base text-gray-700 dark:text-gray-300">
                      <li>1. Be respectful and civil.</li>
                      <li>2. Post relevant and valuable content.</li>
                      <li>3. Share original work or credit sources.</li>
                      <li>4. Avoid spam and excessive self-promotion.</li>
                      <li>5. Follow all applicable laws and regulations.</li>
                    </ul>
                    <p className="text-base text-gray-700 dark:text-white">
                      Violations may lead to content removal or account
                      suspension.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
