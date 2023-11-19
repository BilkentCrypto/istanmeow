

import React from 'react';

const VerificationBox = ({ value }) => {
  const verified = value === '1';

  return (
    <div className={`bg-${verified ? 'green' : 'red'}-500 text-white p-4 rounded-md shadow-md`}>
      {verified ? 'Verified' : "Don't be verified"}
    </div>
  );
};

export default VerificationBox;
