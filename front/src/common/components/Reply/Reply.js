import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';

import profile from '../../../assets/images/profile.png';
import up from '../../../assets/images/up.png';
import down from '../../../assets/images/down.png';
import { timeAgo } from '../../../utils/date';
import Avatar from '../Avatar/Avatar';
import Vote from '../Vote/Vote';

export default function Reply({
  isAuthorized,
  openMMlogin,
  hasAccess,
  data,
  data: {
    address,
    tokens,
    topic,
    timestamp,
    created_at,
    header,
    reply = 0,
    attached_img = '',
    current_vote,
    body = '',
    downvotes = 0,
    nft_contract = '',
    creator,
    title = '',
    upvotes = 0,

    post_id = 0,
    reply_id = 27,
    reply_img = '',
    reply_text = 'test',
    votes = null,
  } = {},
}) {
  const router = useRouter();
  const [showText, setShowText] = useState(false);
  const [isError, setError] = useState(false);
  const queryClient = useQueryClient();

  const vote = async count => {
    setError(false);
    try {
      // Make API request to server to create a new message
      const response = await fetch(
        `/api/contracts/posts/replies/${post_id}/${reply_id}/vote`,
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
        queryClient.invalidateQueries(['replies', post_id.toString()], {
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
    <div className="w-full  bg-white border border-gray-200 dark:border-zinc-700 dark:bg-neutral-800">
      <div className="p-4 ">
        <div className="flex flex-row">
          <div className="rounded-full h-8 w-8  overflow-hidden">
            <Avatar
              imageStyle="h-8 w-8 rounded-full"
              image={attached_img}
              address={creator}
              size={5}
            />
          </div>
          <div className="px-2 flex flex-col  justify-center">
            <div className="text-sm  text-black dark:text-white">{creator}</div>
            <div className="text-xs text-gray-400">
              {[
                tokens ? `${tokens} tokens` : null,
                topic ? topic : null,
                created_at ? timeAgo(created_at) : null,
              ]
                .filter(Boolean)
                .join('•')}
            </div>
          </div>
        </div>
        <div className="mt-2">
          <div className="text-base text-black dark:text-white">{header}</div>
          <div className="">
            {showText ? (
              <p className="pt-2 text-start text-black dark:text-white">
                {reply_text.slice(0, 400)}{' '}
              </p>
            ) : (
              <p className="pt-2 text-start text-black dark:text-white">
                {reply_text}{' '}
              </p>
            )}
            {reply_text.length > 401 ? (
              <div
                onClick={() => setShowText(!showText)}
                className="text-gray-300  dark:text-gray-500">
                (more)
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex flex-row items-center content-center mt-4">
          <div className="">
            <Vote
              onClickUp={() => {
                isAuthorized && hasAccess
                  ? mutate(1)
                  : isAuthorized
                  ? null
                  : openMMlogin();
              }}
              onClickDown={() => {
                isAuthorized && hasAccess
                  ? mutate(-1)
                  : isAuthorized
                  ? null
                  : openMMlogin();
              }}
              hasAccess={hasAccess}
              currentVote={current_vote}
              votes={votes}
            />
          </div>
          {/* <div className="mx-3 text-gray-500">|</div>
          <div
            onClick={() => {}}
            className="flex text-gray-400  cursor-pointer">
            {reply > 0 ? `+ ${reply} replies` : 'Reply'}
          </div> */}
        </div>
      </div>
    </div>
  );
}

// Oxb987b8c5.6315
// 77 tokens • General Discussion • 24 min ago
// Duis eu pulvinar tellus. Mauris suscipit purus tellus, vita sodales augue
// lobortis eget. Morbi aliquam tortor et sollicitudin feugiat. Nullam pulvinar
// aliquet auctor.
// Aenean imperdiet tortor et metus convallis suscipit. Fusce eu posuere urna. Ut congue,
// arcu a feugiat scelerisque, dui enim ultrices enim, id molestie est odio nec sapien. Ut
// rutrum laoreet venenatis. Donec porta varius lectus, ut posuere lectus faucibus at.
// Pellentesque tristique enim ut tellus ultricies, vita fringilla neque suscipit. Ut id... (more)
