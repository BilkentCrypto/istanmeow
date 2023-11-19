import React, { FC, RefObject, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head';
import qs from 'qs';

import { MMProvider } from '../../../src/common/contexts/mm';
import { getContract } from '../../../data/contracts';
import CreatePost from '../../../src/common/components/CreatePost';

export async function getServerSideProps({ req, query }) {
  const cookie = qs.parse(req.cookies);

  return {
    props: {
      initialData: await getContract(cookie?.token, query.flow),
      address: cookie.address || '',
      name: cookie.name || '',
      contract: query.flow,
    },
  };
}

export default function Flow({ initialData, address, contract }) {
  return (
    <MMProvider address={address}>
      <Head>
        <title>zkHub | new post</title>
        <meta
          name="description"
          content={`zkHub - create a discussion for ${contract}`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CreatePost initialData={initialData} address={contract} />
    </MMProvider>
  );
}
