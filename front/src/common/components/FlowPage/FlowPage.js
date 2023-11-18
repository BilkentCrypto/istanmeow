import React, { useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import Message from '../Message';
import Layout from '../Layout/Layout';

import { getContract } from '../../../../data/contracts';
import { getPosts } from '../../../../data/posts';

import etherscan from '../../../assets/svg/etherscan.svg';
import etherscanDark from '../../../assets/svg/etherscandark.svg';
import CreatePostBanner from '../CreatePostBanner';
import SortPostsBunner from '../SortPostsBunner/SortPostsBunner';
import Avatar from '../Avatar/Avatar';
import { MMContext } from '../../contexts/mm';
import Spinner from '../Spinner';

import protobuf from "protobufjs";
import {
  createLightNode,
  waitForRemotePeer,
  createDecoder,
  bytesToUtf8,
} from "@waku/sdk";

const ProtoChatMessage = new protobuf.Type("ChatMessage")
  .add(new protobuf.Field("timestamp", 1, "uint64"))
  .add(new protobuf.Field("nick", 2, "string"))
  .add(new protobuf.Field("text", 3, "bytes"));

export default function Flow({
  initialDataContract,
  initialDataPosts,
  address,
}) {
  const ContentTopic = "/toy-chat/" + address + "/huilong/proto";
  const decoder = createDecoder(ContentTopic);
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
  const {isAuthorized, openMMlogin } = useContext(MMContext);
  const queryClient = useQueryClient();
  const [currentTheme, setCurrentTheme] = React.useState();
  const { theme, systemTheme } = useTheme();

  const [waku, setWaku] = React.useState(undefined);
  const [wakuStatus, setWakuStatus] = React.useState("None");
  const [messages, setMessages] = React.useState([]);
  const [lastMessages, setlastMessages] = React.useState(false);

  useEffect(() => {
    if (wakuStatus !== "None") return;

    setWakuStatus("Starting");

    createLightNode({ defaultBootstrap: true }).then((waku) => {
      waku.start().then(() => {
        setWaku(waku);
        setWakuStatus("Connecting");
      });
    });
  }, [waku, wakuStatus]);

  useEffect(() => {
    if (!waku) return;

    // We do not handle disconnection/re-connection in this example
    if (wakuStatus === "Connected") return;

    waitForRemotePeer(waku, ["store"]).then(() => {
      // We are now connected to a store node
      setWakuStatus("Connected");
    });
  }, [waku, wakuStatus]);

  useEffect(() => {
    if (wakuStatus !== "Connected") return;
    console.log("yo1o", messages);
    if (lastMessages == true) return;
    (async () => { 
      const startTime = new Date();
      // 7 days/week, 24 hours/day, 60min/hour, 60secs/min, 100ms/sec
      startTime.setTime(startTime.getTime() - 7 * 24 * 60 * 60 * 1000);

      // TODO: Remove this timeout once https://github.com/status-im/js-waku/issues/913 is done
      await new Promise((resolve) => setTimeout(resolve, 200));

      try {
        for await (const messagesPromises of waku.store.queryGenerator(
          [decoder],
          {
            timeFilter: { startTime, endTime: new Date() },
            pageDirection: "forward",
          }
        )) {
          const messages = await Promise.all(
            messagesPromises.map(async (p) => {
              const msg = await p;
              return decodeMessage(msg);
            })
          );
          console.log("yoo", messages);
          setMessages((currentMessages) => {
            return currentMessages.concat(messages.filter(Boolean).reverse());
          });
        }

        setlastMessages(true);
      } catch (e) {
        console.log("Failed to retrieve messages", e);
        setWakuStatus("Error Encountered");
      }
    })();
  }, [waku, wakuStatus]);

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

  function Messages(props) {
    return props.messages.map(({ text, timestamp, nick, timestampInt }) => {
      return (
        <div className="w-full rounded-md bg-white border border-gray-200 my-4 dark:border-zinc-700 dark:bg-neutral-800">
          <div className="p-4 ">
            <div className="mt-2">
              <div className="text-base text-black font-gtBold dark:text-white">
                {text}
              </div>
              <li key={timestampInt}>
                ({formatDate(timestamp)}) {nick}
              </li>
            </div>
          </div>
        </div>
      );
    });
  }

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
                {/* {posts?.length ? (
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
                )} */}
                <h2>{wakuStatus}</h2>
                <h3>{ContentTopic}</h3>
                <Messages messages={messages} />
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

function decodeMessage(wakuMessage) {
  if (!wakuMessage.payload) return;

  const { timestamp, nick, text } = ProtoChatMessage.decode(
    wakuMessage.payload
  );

  if (!timestamp || !text || !nick) return;

  const time = new Date();
  time.setTime(Number(timestamp));

  const utf8Text = bytesToUtf8(text);

  return {
    text: utf8Text,
    timestamp: time,
    nick,
    timestampInt: wakuMessage.timestamp,
  };
}

function formatDate(timestamp) {
  return timestamp.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}