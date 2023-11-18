import React, { useEffect, useState } from 'react';
import { decryptMessage, encryptMessage } from '../../src/utils/encryption';


export default function Test({params}) {

const [message, setMessage] = useState();
const [encrypted, setEncrypted] = useState();


const handleInputChange = (value) => {
  setMessage(value);
}


const handleEncrypt = async() => {
  setEncrypted( encryptMessage(message) );
}

const handleDecrypt = async( ) => {

  setEncrypted( decryptMessage( encrypted))
}

  return (
<>
<input onChange={(e) => handleInputChange(e.target.value)}/>
<button title='test button' onClick={handleEncrypt}>Test button</button>


Test22222
<h1>Key: {encrypted}</h1>
<button  onClick={handleDecrypt}>Decyrpt button</button>

</>
  );
}
