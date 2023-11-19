var AES = require("crypto-js/aes");
var CryptoJS = require("crypto-js");

const AES_KEY = 'zkHubExampleKey'


function encryptMessage(message) {
    return AES.encrypt(message, AES_KEY).toString()
}

function decryptMessage(message) {
    let lastMessage = AES.decrypt(message, AES_KEY);
    lastMessage = lastMessage.toString(CryptoJS.enc.Utf8)
    return lastMessage;
}

export {encryptMessage, decryptMessage}