const { default: Moralis } = require("moralis");
const CHAIN = "0x5";

module.exports = {
  fetchNftByAddressOpenSea: async (address, mainnet) => {
    if (mainnet) {
      const res = await fetch(
        `https://api.opensea.io/api/v1/assets?owner=${address}`,
        {
          headers: {
            "x-api-key": process.env.OPENSEA_API_KEY,
          },
        }
      );
      const data = await res.json();
      return data;
    } else {
      const res = await fetch(
        `https://testnets-api.opensea.io/api/v1/assets?owner=${address}`
      );
      const data = await res.json();
      return data;
    }
  },
  fetchNftCollections: async (offset = 0) => {
    const res = await fetch(
      `https://api.opensea.io/api/v1/collections?offset=${offset}&limit=300`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );

    const data = await res.json();

    return data;
  },
  fetchNftMoralis: async (address, chain) => {
    try {
      const response = await Moralis.EvmApi.nft.getWalletNFTCollections({
        chain: chain, // goerli, 1 for mainnet
        // address,
        address: address,
      });

      return response.raw;
    } catch (e) {
      console.error(e);
    }
  },
  fetchNFTMetadata: async (address, chain) => {
    try {
      const response = await Moralis.EvmApi.nft.getContractNFTs({
        chain: chain,
        format: "decimal",
        limit: 1,
        totalRanges: 1,
        range: 1,
        mediaItems: true,
        address: address,
      });
      return response.raw;
    } catch (e) {
      console.error(e);
    }
  },
};
