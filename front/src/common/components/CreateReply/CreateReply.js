import React, { useState, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { MMContext } from '../../contexts/mm';

export default function CreateReply({
  initialData,
  address,
  postId,
  connect,
  isConnecting,
  openMMlogin,
  isAuthorized,
}) {
  const [formValues, setFormValues] = useState({});
  const [isError, setError] = useState(false);
  const [fieldsError, setFieldsError] = useState({});
  const [visible, setVisible] = useState('null');
  const queryClient = useQueryClient();

  const createReply = async () => {
    setError(false);
    if (!formValues.reply_text) {
      setFieldsError({ reply_text: 'Reply is required' });
      return;
    }
    try {
      // Make API request to server to create a new message
      const response = await fetch(`/api/contracts/posts/replies/${postId}`, {
        method: 'POST',
        body: JSON.stringify({
          ...formValues,
          address,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if the response is successful
      if (response.ok) {
        queryClient.invalidateQueries(['replies', postId], {
          forceRefetch: true,
        });
        queryClient.invalidateQueries(['post', address], {
          forceRefetch: true,
        });
        setFormValues({ reply_text: '' });
      } else {
        setError(true);
        if (!response.ok && response.status === 401) {
          // 401
          setFieldsError({ reply_text: response.statusText });
          // else something wrong
        }
      }
    } catch (error) {
      setError(true);
    }
  };

  const deleteReply = async () => {
    setError(false);
    try {
      // Make API request to server to create a new message
      const response = await fetch(
        `/api/contracts/posts/replies/${address}/reply`,
        {
          method: 'DELETE',
          body: JSON.stringify({
            ...formValues,
            address,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // Check if the response is successful
      if (response.ok) {
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  const { mutate, isLoading, error } = useMutation(createReply);

  return (
    <div className="flex flex-col w-full">
      <div className="w-full mb-4 rounded-md">
        <div className="w-full">
          {/* <div className=" bg-white rounded-md   border-gray-300 ">
              <textarea
                onChange={evt => {
                  setFieldsError({});
                  setFormValues({
                    ...formValues,
                    reply_text: evt.target.value,
                  });
                }}
                id="editor"
                rows="8"
                className="block w-full py-3 px-3 text-sm text-gray-800 bg-white border rounded-md  focus:ring-0 resize-none"
                placeholder="Body text (required by this community)"></textarea>
            </div> */}
          <div className="flex-1 w-full ">
            <form>
              <div className="w-full bg-white rounded-md border border-gray-300 dark:border-zinc-700 dark:bg-neutral-800">
                <div className="flex items-center justify-between px-3 py-2 border-b dark:border-zinc-700 ">
                  <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-200">
                    <div className="flex items-center space-x-1 sm:pr-4">
                      <button
                        type="button"
                        className="p-2 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-200">
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
                        className="p-2 text-gray-400 rounded hover:text-gray-700 hover:bg-gray-200">
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
                        className="p-2 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-200">
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
                        className="p-2 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-200">
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
                        className="p-2 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-200">
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
                        className="p-2 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-200">
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
                        className="p-2 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-200">
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
                        className="p-2 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-200">
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
                        className="p-2 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-200">
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
                    onClick={() => (isAuthorized ? mutate() : openMMlogin())}
                    data-tooltip-target="tooltip-fullscreen"
                    className="p-2 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-200">
                    {/* <svg
                        aria-hidden="true"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                          clipRule="evenodd"></path>
                      </svg> */}
                    Reply
                    <span className="sr-only">Full screen</span>
                  </button>
                </div>
                <div className=" bg-white rounded-md">
                  <textarea
                    value={formValues.reply_text}
                    onChange={evt => {
                      setFieldsError({});
                      setFormValues({
                        ...formValues,
                        reply_text: evt.target.value,
                      });
                    }}
                    id="editor"
                    rows="8"
                    className="block w-full py-3 px-3 text-sm text-gray-800 dark:text-gray-300 bg-white dark:border-zinc-700 dark:bg-neutral-800 border-0  focus:ring-0 "
                    placeholder="Reply..."></textarea>
                </div>
              </div>
              {/* {fieldsError ? (
                  <span className="text-red-600 px-2 mt-2">
                    {fieldsError.body}
                  </span>
                ) : null} */}
            </form>

            {fieldsError ? (
              <span className="text-red-600 -mt-3 mb-1 px-2 ">
                {fieldsError.reply_text}
              </span>
            ) : null}
          </div>
          <div>
            {/* <button
                className="bg-blue-500 hover:bg-blue-600 text-white  py-2 px-4 rounded-full"
                disabled={isLoading}
                onClick={() => mutate()}>
                Create
              </button> */}
            {isError ? (
              <div className="bg-red-500 py-2 px-4 rounded-lg text-white flex justify-between">
                {response.status === 401 ? (
                  <p>{fieldsError.reply_text}</p>
                ) : (
                  <p>Oops! Something went wrong.</p>
                )}
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
      </div>
    </div>
  );
}
