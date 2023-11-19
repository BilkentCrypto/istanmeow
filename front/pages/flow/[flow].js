import React, { useEffect } from 'react';

import Head from 'next/head';
import qs from 'qs';

import FlowPage from '../../src/common/components/FlowPage';
import { MMProvider } from '../../src/common/contexts/mm';
import { getContract } from '../../data/contracts';
import { getPosts } from '../../data/posts';

export async function getServerSideProps({ req, query }) {
  const cookie = qs.parse(req.cookies);

  const contract = await getContract(cookie?.token, query.flow);

  if (!contract?.address) {
    return {
      props: {
        initialDataContract: null,
      },
    };
  }

  return {
    props: {
      initialDataContract: contract,
      initialDataPosts: null, //await getPosts(cookie?.token, query.flow),
      address: cookie.address || '',
      contract: query.flow,
    },
  };
}

export default function Flow({
  initialDataContract,
  initialDataPosts,
  address,
  contract,
}) {
  useEffect(() => {
    if (!initialDataContract) {
      // The API response returned a 404 error, so redirect to /not-found
      import('next/router').then(router => router.default.push('/not-found'));
    }
  }, [initialDataContract]);

  if (!initialDataContract) {
    return null;
  }

  return (
    <MMProvider address={address}>
      <Head>
        <title>zkHub | community</title>
        <meta name="description" content={`zkHub - community for ${contract}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FlowPage
        initialDataContract={initialDataContract}
        initialDataPosts={initialDataPosts}
        address={contract}
      />
    </MMProvider>
  );
}
