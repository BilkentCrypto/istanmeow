import React, { FC, RefObject, useRef, useState } from 'react';

import Head from 'next/head';
import qs from 'qs';

import { MMProvider } from '../src/common/contexts/mm';
import Layout from '../src/common/components/Layout/Layout';

export async function getServerSideProps({ req, query }) {
  const cookie = qs.parse(req.cookies);

  return {
    props: {
      address: cookie.address || '',
    },
  };
}

export default function Flow({ address }) {
  return (
    <MMProvider address={address}>
      <Head>
        <title>{address}</title>
        <meta name="description" content={`NFTQ - page is not found`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout headerText="">
        <div className="flex mx-auto py-24">
          The requested page is not found
        </div>
      </Layout>
    </MMProvider>
  );
}
