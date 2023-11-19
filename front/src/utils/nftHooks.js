import { CovalentClient } from "@covalenthq/client-sdk";

const getTokens = async (address) => {
    const client = new CovalentClient("cqt_rQD77vf9jBXmvwPDxfjkrQxHkVW8");
    const resp = await client.NftService.getNftsForAddress("scroll-sepolia-testnet", address);
    return resp.data;
}

export {getTokens}