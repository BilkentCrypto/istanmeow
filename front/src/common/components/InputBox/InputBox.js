// components/InputBox.js

import React from 'react';

const InputBox = ({ onSubmit }) => {
  const [input1, setInput1] = React.useState('');
  const [input2, setInput2] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ input1, input2 });
    setInput1('');
    setInput2('');
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md shadow-md">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
          placeholder="Input 1"
          className="border border-gray-300 rounded-md px-3 py-2"
        />
        <input
          type="text"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
          placeholder="Input 2"
          className="border border-gray-300 rounded-md px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default InputBox;
