import React, { useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import magnifierW from '../../../assets/svg/magnifierW.svg';
import magnifierB from '../../../assets/svg/magnifierB.svg';
import Card from '../Card';
import Layout from '../Layout/Layout';
import { getContracts } from '../../../../data/contracts';
import Spinner from '../Spinner';

export default function MainPage({ initialData = null }) {
  const [contracts, setContracts] = React.useState(
    initialData?.contracts || [],
  );
  const [currentTheme, setCurrentTheme] = React.useState();
  const [fetchState, setFetchState] = React.useState({
    offset: 0,
    limit: 20,
  });
  const { theme, systemTheme } = useTheme();

  const { refetch, data, isFetching } = useQuery(
    ['contracts', fetchState.query, fetchState.offset],
    async ({ queryKey: [_, query_arg, offset_arg] }) => {
      const res = await getContracts(null, {
        query: query_arg,
        offset: offset_arg,
        limit: fetchState.limit,
        own: false,
      });

      setContracts(prevContracts => {
        const newContracts = res.contracts.filter(newContract => {
          // check if a contract with the same id already exists in prevContracts
          return !prevContracts.some(prevContract => prevContract.id === newContract.id);
        });
        return prevContracts.concat(newContracts);
      });
      return res;
    },
    {
      enabled: false,
      initialData: initialData,
    },
  );
  const hasNextPage = data?.count > fetchState.offset + fetchState.limit;

  useEffect(() => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    setCurrentTheme(currentTheme);
  }, [theme]);

  useEffect(() => {
    refetch();
  }, [fetchState]);

  const filteredContracts = contracts?.filter(e => ["Scroll - CryptoCats", "Andrew's Angels", "Harper's Inn", "Mind Your Stretch"].includes(e.name));
  const remainingContracts = contracts?.filter(e => !["Scroll - CryptoCats", "Andrew's Angels", "Harper's Inn", "Mind Your Stretch"].includes(e.name));

  return (
    <Layout headerText="Communities" showFooter>
      <div className="flex justify-center bg-white dark:border-zinc-700">
        <div className="min-h-full flex flex-col max-w-screen-lg px-4 bg-white dark:bg-neutral-800 w-full">
          <div className="w-full py-6 bg-white relative dark:bg-neutral-800 ">
            <Image
              alt="logo"
              className="h-4 w-auto ml-3 absolute bottom-9"
              src={currentTheme === 'dark' ? magnifierW : magnifierB}
              width="16"
              height="10"
            />
            <input
              className="w-full p-2 flex-1 mr-5 text-gray-400 dark:text-white focus:outline-none dark:bg-neutral-800 pl-10 rounded-full border dark:border-zinc-700"
              type="text"
              onKeyUp={e => {
                if (e.key === 'Enter') {
                  setContracts([]);
                  setFetchState(d => ({
                    ...d,
                    offset: 0,
                    query: e.target.value,
                  }));
                }
              }}
              placeholder="Find communities by contract address"
            />
          </div>
          {isFetching && !contracts.length ? (
            <div className="flex justify-center items-center pt-36 pb-36">
              <Spinner />
            </div>
          ) : contracts.length ? (
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white dark:bg-neutral-800">
              {filteredContracts.map((e, i) => (
                <Card data={e} key={i} />
              ))}
              {remainingContracts.map((e, i) => (
                <Card data={e} key={i} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center pt-36">Empty</div>
          )}
        </div>
      </div>
      {hasNextPage && (
        <div className="flex justify-center items-center pt-6 mb-6 px-4">
          <button
            disabled={isFetching}
            className="h-12 w-full border rounded-full dark:border-zinc-700 dark:bg-neutral-800 text-black dark:text-white max-w-990"
            onClick={() =>
              setFetchState(d => ({
                ...d,
                offset: d.offset + d.limit,
              }))
            }>
            Load more
          </button>
        </div>
      )}
    </Layout>
  );
}
