import React, { FC, RefObject, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head';
import Image from 'next/image';
import qs from 'qs';

import { MMProvider } from '../../../src/common/contexts/mm';
import { getContract } from '../../../data/contracts';
import { getPost } from '../../../data/posts';
import PostPage from '../../../src/common/components/PostPage';
import { getReplies } from '../../../data/replies';

export async function getServerSideProps({ req, query }) {
  const cookie = qs.parse(req.cookies);

  return {
    props: {
      initialDataContract: await getContract(cookie?.token, query.flow),
      initialDataPost: await getPost(cookie?.token, query.flow, query.post),
      initialDataReplies: await getReplies(cookie?.token, query.post),
      address: cookie.address || '',
      contract: query.flow,
      post: query.post,
    },
  };
}

export default function Flow({
  initialDataContract,
  initialDataPost,
  initialDataReplies,
  address,
  contract,
  post,
}) {
  return (
    <MMProvider address={address}>
      <Head>
        <title>nftQ | post</title>
        <meta
          name="description"
          content={`NFTQ - discussion for ${contract}`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PostPage
        initialDataContract={initialDataContract}
        initialDataPost={initialDataPost}
        initialDataReplies={initialDataReplies}
        address={contract}
        post={post}
      />
    </MMProvider>
  );
}
