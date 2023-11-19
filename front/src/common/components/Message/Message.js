import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';

import { timeAgo } from '../../../utils/date';
import Avatar from '../Avatar/Avatar';
import Vote from '../Vote/Vote';

export default function Message({
  openMMlogin,
  isAuthorized,
  hasAccess,
  data: {
    address,
    post_id,
    tokens,
    topic,
    timestamp,
    created_at,
    header,
    reply_count = 0,
    attached_img = '',
    body = '',
    votes = 0,
    nft_contract = '',
    user_address,
    post_theme = 'General Discussion',
    current_vote,
    title = '',
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
        queryClient.invalidateQueries(['posts', nft_contract], {
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
    <div className="w-full rounded-md bg-white border border-gray-200 my-4 dark:border-zinc-700 dark:bg-neutral-800">
      <div className="p-4 ">
        <div
          className="flex flex-row cursor-pointer"
          onClick={() => router.push(`${router.asPath}/${post_id}`)}>
          <div className="rounded-full overflow-hidden h-9 w-9">
            <Avatar image={attached_img} address={user_address} />
          </div>
          <div className="px-2 flex flex-col  justify-center">
            <div className="text-sm text-black dark:text-white">
              {user_address}
            </div>
            <div className="text-xs text-gray-400">
              {[
                tokens ? `${tokens} tokens` : null,
                post_theme ? post_theme : null,
                created_at ? timeAgo(created_at) : null,
              ]
                .filter(Boolean)
                .join(' • ')}
            </div>
          </div>
        </div>
        <div
          className="mt-2"
          // onClick={() => router.push(`${router.asPath}/${post_id}`)}
        >
          <div className="text-base text-black font-gtBold dark:text-white">
            {title}
          </div>
          <div className="dark:text-gray-300">
            {!showText ? (
              <p className="pt-2 text-start">{body.slice(0, 400)} </p>
            ) : (
              <p className="pt-2 text-start">{body} </p>
            )}
            {body.length > 401 ? (
              <div
                onClick={() => setShowText(!showText)}
                className="text-gray-300">
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
          <div className="mx-3 dark:text-gray-400">|</div>
          <div
            onClick={() => router.push(`${router.asPath}/${post_id}`)}
            className="flex text-gray-400 cursor-pointer">
            {reply_count > 0 ? `+ ${reply_count} replies` : 'Reply'}
          </div>
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
