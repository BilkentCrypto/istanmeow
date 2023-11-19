import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from 'react-query';
import { useRouter } from 'next/router';

import Layout from '../Layout/Layout';

import { getContract } from '../../../../data/contracts';
import Avatar from '../Avatar';
import { MMContext } from '../../contexts/mm';

import {
  waitForRemotePeer,
  createEncoder,
  createLightNode,
} from '@waku/sdk';
import protobuf from "protobufjs";
import { generate } from "server-name-generator";

export const usePersistentNick = () => {
  const [nick, setNick] = useState(() => {
    const persistedNick = window.localStorage.getItem("nick");
    return persistedNick !== null ? persistedNick : generate();
  });
  useEffect(() => {
    localStorage.setItem("nick", nick);
  }, [nick]);
  return [nick, setNick];
};

export default function CreatePost({ initialData, address, contract }) {

  const [waku, setWaku] = useState(undefined);
  const [wakuStatus, setWakuStatus] = useState("None");
  const [nick, setNick] = usePersistentNick();
  const ContentTopic = "/1testtokengated/" + address + "/huilong/proto";
  const Encoder = createEncoder({ contentTopic: ContentTopic });

  const SimpleChatMessage = new protobuf.Type("ChatMessage")
    .add(new protobuf.Field("timestamp", 1, "uint32"))
    .add(new protobuf.Field("nick", 2, "string"))
    .add(new protobuf.Field("text", 3, "string"));

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
  


export default function CreatePost({ initialData, address, contract }) {

  const router = useRouter();
  const { data: { name, imageURL } = {}, refetch } = useQuery(
    ['contract', address],
    () => getContract(null, address),
    {
      initialData: initialData,
    },
  );

  const [formValues, setFormValues] = useState({});
  const [isError, setError] = useState(false);
  const [fieldsError, setFieldsError] = useState({});

  const {
    connect,
    isConnecting,
    isAuthorized,
    address: userAddress,
    disconnect,
    openMMlogin,
  } = useContext(MMContext);

  useEffect(() => {
    refetch();
  }, [isAuthorized]);

  const createMessage = async () => {
    setError(false);
    if (!formValues.title) {
      setFieldsError({ title: 'Input post title' });
    } else if (!formValues.body) {
      setFieldsError({ body: 'Input post note' });
    }
    console.log("outside");
    if (formValues.title && formValues.body) {
      
      try {
        const sendAsJson = `{ "title": "${formValues.title}", "body": "${formValues.body}" }`;
        console.log("inside", sendAsJson);
        if (wakuStatus !== "Connected") return;
        console.log("still going strong");
        sendMessage(sendAsJson, waku, new Date()).then(() => {
          console.log("message sent");
          router.back();
        });
      } catch (error) {
        console.error(error);
        setError(true);
      }
    }
  };

  async function sendMessage(message, waku, timestamp) {
    const time = timestamp.getTime();
  
    // Encode to protobuf
    const protoMsg = SimpleChatMessage.create({
      timestamp: time,
      nick: nick,
      text: message,
    });
    const payload = SimpleChatMessage.encode(protoMsg).finish();
  
    // Send over Waku Relay
    await waku.lightPush.send(Encoder, {
        payload: payload,
    });
  }
  const { mutate, isLoading, error } = useMutation(createMessage);

  return (
    <Layout>
      <div className="flex flex-col  items-center bg-white border-t dark:bg-neutral-800 dark:border-zinc-700">
        <div className="flex flex-row w-3/4">
          <h1>{wakuStatus}</h1>
          <div className="flex flex-col w-full mt-4">
            {isAuthorized ? (
              <div className="flex flex-row  h-16 items-center bg-white mb-4 rounded-md border border-gray-300 dark:border-zinc-700 dark:bg-neutral-800">
                <div className="w-12 h-12  rounded-sm mx-3 overflow-hidden flex justify-center items-center">
                  <Avatar
                    address={userAddress}
                    //  image={imageURL}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-black dark:text-white">{`${address.slice(
                    0,
                    19,
                  )}...${address.slice(-3)}`}</p>
                  <p className="text-gray-400 text-xs">{userAddress}</p>
                </div>
              </div>
            ) : null}
            <textarea
              className="rounded-md h-12 mb-4  dark:bg-neutral-800 align-middle	py-3 px-3 border border-gray-300 dark:border-zinc-700 text-black dark:text-white"
              placeholder="Title"
              rows="1"
              required
              onChange={evt => {
                setFieldsError({});
                setFormValues({
                  ...formValues,
                  title: evt.target.value,
                });
              }}></textarea>
            {fieldsError ? (
              <span className="text-red-600 -mt-3 mb-1 px-2">
                {fieldsError.title}
              </span>
            ) : null}
            {/* <textarea
              className="bg-blue-200"
              required
              onChange={evt => {
                setFormValues({
                  ...formValues,
                  body: evt.target.value,
                });
              }}></textarea> */}
            <div className="flex-1 w-full">
              <form>
                <div className="w-full  rounded-md border border-gray-300 dark:border-zinc-700">
                  <div className="flex items-center justify-between px-3 py-2 border-b dark:border-zinc-700">
                    <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-200">
                      <div className="flex items-center space-x-1 sm:pr-4">
                        <button
                          type="button"
                          className="p-2 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-400">
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              fillRule="evenodd"
                              d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                              clipRule="evenodd"></path>
                          </svg>
                          <span className="sr-only">Attach file</span>
                        </button>
                        <button
                          type="button"
                          className="p-2 text-gray-400 rounded hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-400">
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"></path>
                          </svg>
                          <span className="sr-only">Embed map</span>
                        </button>
                        <button
                          type="button"
                          className="p-2 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-400">
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"></path>
                          </svg>
                          <span className="sr-only">Upload image</span>
                        </button>
                        <button
                          type="button"
                          className="p-2 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-400">
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              fillRule="evenodd"
                              d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"></path>
                          </svg>
                          <span className="sr-only">Format code</span>
                        </button>
                        <button
                          type="button"
                          className="p-2 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-400">
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                              clipRule="evenodd"></path>
                          </svg>
                          <span className="sr-only">Add emoji</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center space-x-1 sm:pl-4">
                        <button
                          type="button"
                          className="p-2 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-400">
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              fillRule="evenodd"
                              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                              clipRule="evenodd"></path>
                          </svg>
                          <span className="sr-only">Add list</span>
                        </button>
                        <button
                          type="button"
                          className="p-2 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-400">
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              fillRule="evenodd"
                              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                              clipRule="evenodd"></path>
                          </svg>
                          <span className="sr-only">Settings</span>
                        </button>
                        <button
                          type="button"
                          className="p-2 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-400">
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"></path>
                          </svg>
                          <span className="sr-only">Timeline</span>
                        </button>
                        <button
                          type="button"
                          className="p-2 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-400">
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              fillRule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                              clipRule="evenodd"></path>
                          </svg>
                          <span className="sr-only">Download</span>
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      data-tooltip-target="tooltip-fullscreen"
                      className="p-2 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-400">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                          clipRule="evenodd"></path>
                      </svg>
                      <span className="sr-only">Full screen</span>
                    </button>
                  </div>
                  <div className="rounded-md">
                    <textarea
                      onChange={evt => {
                        setFieldsError({});
                        setFormValues({
                          ...formValues,
                          body: evt.target.value,
                        });
                      }}
                      id="editor"
                      rows="8"
                      className="block w-full py-3 px-3 text-sm text-gray-800 border-0  focus:ring-0 dark:bg-neutral-800 dark:text-gray-300 "
                      placeholder="Body text (required by this community)"
                      required></textarea>
                  </div>
                </div>
                {fieldsError ? (
                  <span className="text-red-600 px-2 mt-2">
                    {fieldsError.body}
                  </span>
                ) : null}
              </form>
              {isError ? (
                <div className="bg-red-500 py-2 px-4 rounded-lg text-white flex justify-between">
                  <p>Oops! Something went wrong.</p>
                  <button
                    className="ml-2 focus:outline-none"
                    onClick={() => setError(false)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col w-3/6 ">
            <div className="rounded-md   m-4 border border-gray-300 dark:border-zinc-700">
              <div className="flex flex-col p-4">
                <button
                  className=" hover:bg-gray-100-100 text-gray-800 dark:text-white border border-gray-300  dark:border-zinc-700 py-2 px-4 rounded-full"
                  // onClick={() => mutate()}
                  onClick={() => (isAuthorized ? mutate() : openMMlogin())}>
                  Preview
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white mt-4  py-2 px-4 rounded-full "
                  disabled={isLoading}
                  onClick={() => (isAuthorized ? mutate() : openMMlogin())}
                  // onClick={() => mutate()}
                >
                  Create
                </button>
              </div>
            </div>
            <div className="rounded-md  m-4 border border-gray-300 flex dark:border-zinc-700">
              <div className="p-4">
                <p className="text-base text-gray-700 dark:text-white">
                  Community Guidelines
                </p>
                <ul className="my-4 text-base text-gray-700 dark:text-gray-300">
                  <li>1. Be respectful and civil.</li>
                  <li>2. Post relevant and valuable content.</li>
                  <li>3. Share original work or credit sources.</li>
                  <li>4. Avoid spam and excessive self-promotion.</li>
                  <li>5. Follow all applicable laws and regulations.</li>
                </ul>
                <p className="text-base text-gray-700 dark:text-gray-300">
                  By following these guidelines, you contribute to a positive
                  and inclusive community experience on zkHub. Violations may
                  lead to content removal or account suspension.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
