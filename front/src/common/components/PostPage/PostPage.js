import React, { useEffect, useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Message from '../Message';
import Layout from '../Layout/Layout';

import { getContract } from '../../../../data/contracts';
import { getPost } from '../../../../data/posts';
import { getReplies } from '../../../../data/replies';
import CreateReply from '../CreateReply';
import Avatar from '../Avatar/Avatar';
import { timeAgo } from '../../../utils/date';
import Reply from '../Reply/Reply';
import up from '../../../assets/images/up.png';
import down from '../../../assets/images/down.png';
import ArrowBack from '../../../assets/svg/ArrowBackBlack.svg';
import { MMContext } from '../../contexts/mm';
import Vote from '../Vote/Vote';

export default function PostPage({
  initialDataContract,
  initialDataPost,
  initialDataReplies,
  address,
  post,
  upvotes = 0,
  downvotes = 0,
  description: {
    name = 'Opsec Corps Groep',
    type = 'General Discussion',
    // timestamp = '2023-04-24T11:09:35.962Z',
  } = {},
}) {
  const router = useRouter();
  const [isError, setError] = useState(false);
  const queryClient = useQueryClient();
  const { data: contract, refetch } = useQuery(
    ['contract', address],
    () => getContract(null, address),
    {
      initialData: initialDataContract,
    },
  );
  const {
    data,
    data: {
      attached_img,
      body = 'test',
      creator,
      nft_contract,
      current_vote,
      user_address,
      post_id,
      timestamp,
      title = 'No Title',
      votes = 0,
      reply_count,
    } = {},
  } = useQuery(['post', address, post], () => getPost(null, address, post), {
    initialData: initialDataPost,
  });


  const {
    data: { data: replies = [] },
  } = useQuery(['replies', post], () => getReplies(null, post), {
    initialData: initialDataReplies,
  });
  // initialData: initialDataReplies,
  const { connect, isConnecting, isAuthorized, disconnect, openMMlogin } =
    useContext(MMContext);

  useEffect(() => {
    refetch();
    queryClient.invalidateQueries(['contract', address], {
      forceRefetch: true,
    });
    queryClient.invalidateQueries(['post', address, post], {
      forceRefetch: true,
    });
  }, [isAuthorized]);

  const vote = async count => {
    setError(false);
    try {
      // Make API request to server to create a new message
      const response = await fetch(
        `/api/contracts/posts/${nft_contract}/${post_id}/vote`,
        {
          method: 'POST',
          body: JSON.stringify({
            count,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // Check if the response is successful
      if (response.ok) {
        queryClient.invalidateQueries(['contract', address], {
          forceRefetch: true,
        });
        queryClient.invalidateQueries(['post', address, post], {
          forceRefetch: true,
        });
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  const { mutate } = useMutation(vote);

  return (
    <Layout>
      <div className="flex flex-col border-grey-500 dark:border-zinc-700 justify-center items-center content-center pb-10">
        <div className="flex flex-row w-3/4 ">
          <div className="w-full">
            <div
              className="flex flex-row mt-6 cursor-pointer"
              onClick={() => router.back()}>
              <Image priority src={ArrowBack} alt="back" />
              <div className="text-gray-500 dark:text-gray-400 px-2">Back</div>
            </div>
            <div className="flex flex-col border-b dark:border-zinc-700">
              <div className="flex flex-row mt-6 items-center">
                <div className="w-12 h-12  bg-white rounded-full">
                  <div className="w-12 h-12 flex-shrink-0    rounded-full">
                    <Avatar
                      imageStyle="w-12 h-12 "
                      // image={contract?.imageURL}
                      address={nft_contract}
                    />
                  </div>
                </div>
                <div className="flex flex-col ml-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{`zkHub/${user_address}`}</p>
                  <div className="text-xs text-gray-400">
                    {[
                      // name ? `${name}` : null,
                      type ? type : null,
                      timestamp ? timeAgo(timestamp) : null,
                    ]
                      .filter(Boolean)
                      .join(' • ')}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-700 dark:text-gray-300">{title}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-4">{body}</p>
              </div>
              <div className="flex flex-row items-center content-center m-4">
                <div className="">
                  <Vote
                    onClickUp={() => {
                      isAuthorized && contract?.hasAccess
                        ? mutate(1)
                        : isAuthorized
                        ? null
                        : openMMlogin();
                    }}
                    onClickDown={() => {
                      isAuthorized && contract?.hasAccess
                        ? mutate(-1)
                        : isAuthorized
                        ? null
                        : openMMlogin();
                    }}
                    votes={votes}
                    currentVote={current_vote}
                  />
                </div>
                <div className="mx-3 text-gray-400">|</div>
                <div
                  onClick={() => {}}
                  className="flex text-gray-400 cursor-pointer">
                  + {reply_count} replies
                </div>
              </div>
            </div>
            <div className="flex w-full  justify-center  flex-col  mt-4 ">
              {contract?.hasAccess ? (
                <CreateReply
                  connect={connect}
                  isConnecting={isConnecting}
                  isAuthorized={isAuthorized}
                  openMMlogin={openMMlogin}
                  address={address}
                  postId={post}
                />
              ) : null}
              {replies.length ? (
                <div>
                  <div className="mb-2 text-gray-400">Replies</div>
                  {replies.map((e, idx) => (
                    <div className="flex flex-col w-full" key={idx}>
                      <Reply
                        address={address}
                        isAuthorized={isAuthorized}
                        openMMlogin={openMMlogin}
                        hasAccess={contract?.hasAccess}
                        data={e}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12">
                  <p className="text-center">
                    There are no replies yet. Be the first to reply in this
                    discussion.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col w-3/6 ml-8">
            <div className="mt-6 dark:border-zinc-700 dark:bg-neutral-800 h-64 border"></div>
            <div className="mt-6 dark:border-zinc-700 dark:bg-neutral-800 h-64 border"></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
