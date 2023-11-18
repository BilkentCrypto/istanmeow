import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import qs from 'qs';

import MainPage from '../src/common/components/MainPage';
import { MMProvider } from '../src/common/contexts/mm';
import { getContracts } from '../data/contracts';

export async function getServerSideProps({ req }) {
  const cookie = qs.parse(req.cookies);

  return {
    props: {
      initialData: await getContracts(cookie?.token),
      address: cookie.address || null,
    },
  };
}

export default function Home({ initialData, address }) {
  return (
    <MMProvider address={address}>
      <Head>
        <title>nftQ</title>
        <meta name="description" content="NFTQ - find your ntf community" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainPage initialData={initialData} />
    </MMProvider>
  );
}
