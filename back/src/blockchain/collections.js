const { ethers, id } = require("ethers");
const { InfuraProvider } = require("@ethersproject/providers");
const express = require("express");
const blockchainRouter = express.Router();
const {
  fetchNFTMetadata,
  fetchNftCollections,
  fetchNftByAddressOpenSea,
} = require("../blockchain/opensea");

const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
const infuraKey = "122b19790bda494e99d4789f667ef1eb";
const provider = new InfuraProvider("goerli", infuraKey);

blockchainRouter.get("/test", async (req, res, next) => {
  fetchNftByAddressOpenSea("0x8C18a8fdD2F870C47138af1D75f4910a6D8f3C51")
    .then(async (data) => {
      if (data.assets?.length) {
        console.log(JSON.stringify(data), "WWWW");
        // const metadata = JSON.parse(data.result[0].metadata);
        // let image = metadata.image;
        // const { name } = data.result[0] || {};
        // let httpImage = image.replace("ipfs://", "https://ipfs.io/ipfs/");
        // const result = await supabase.from("Contracts").upsert([
        //   {
        //     address: "0x91ba8A14D2CC851aBb69212c09f59e06e1e7f0a5",
        //     name: name || "",
        //     imageURL: httpImage || "",
        //     description: metadata.description || "",
        //   },
        // ]);
        return res.status(200).json({ result });
      }
      return res.status(404).json({ error: "data not found" });
    })
    .catch((e) => {
      console.log(e);
      res.status(401).json({ e });
    });
});

blockchainRouter.get("/", async (req, res, next) => {
  if (req.query.t === "133") {
    for (let i = 0; i < 500; i++) {
      const { collections = [] } = await fetchNftCollections(i * 300);
      console.log("DONE OFFSET ", i * 300);
      await Promise.all(
        collections.map(async (d) => {
          if (
            d.image_url &&
            d.primary_asset_contracts.length > 0 &&
            d.primary_asset_contracts[0].schema_name === "ERC721"
          ) {
            const result = await supabase.from("Contracts").upsert([
              {
                address: d.primary_asset_contracts[0].address,
                name: d.name,
                imageURL: d.image_url,
                bannerURL: d.banner_image_url,
                description: d.description || "",
              },
            ]);
          }
        })
      );
      i++;
    }

    return res.status(200).json({ success: true });
    // Print out current block
    let blockToSearch = await provider.getBlockNumber();
    // ERC-165 ABI
    const erc165Abi = [
      "function supportsInterface(bytes4 interfaceId) external view returns (bool)",
    ];
    // ERC-721 ID
    const erc721Id = "0x80ac58cd";

    // Search in blocks
    while (blockToSearch > 0) {
      console.log("Searching block " + blockToSearch);

      // Check if we already processed this block
      let { data: processedBlock } = await supabase
        .from("processed_blocks")
        .select("*")
        .eq("block", blockToSearch)
        .single();

      if (processedBlock) {
        console.log("Block already processed");
        blockToSearch--;
        break;
      }

      // Get all transfer logs in this block, sleep one second for rate limit
      const logs = await provider.getLogs({
        fromBlock: blockToSearch,
        toBlock: blockToSearch,
        address: null,
        topics: [id("Transfer(address,address,uint256)")],
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get distinct contract addresses
      const contractAddresses = logs
        .map((log) => log.address)
        .filter((value, index, self) => self.indexOf(value) === index);

      // Check if any of these contracts are ERC-721
      for (const contractAddress of contractAddresses) {
        // Check if we already processed this contract
        let { data: processedContract } = await supabase
          .from("processed_contracts")
          .select("*")
          .eq("address", contractAddress)
          .single();

        if (processedContract) {
          console.log("Contract " + contractAddress + " already checked");
          continue;
        }

        // Use ERC-165 to check if contract is ERC-721, try/catch in case contract does not support ERC-165
        const contract = new ethers.Contract(
          contractAddress,
          erc165Abi,
          provider
        );
        let isErc721 = 0;
        try {
          isErc721 = (await contract.supportsInterface(erc721Id)) ? 1 : 0;
        } catch (error) {
          // Contract does not support ERC-165
        }

        // Save to database
        await supabase
          .from("processed_contracts")
          .insert({ address: contractAddress, isNFT: isErc721 })
          .single();
        console.log(
          "Contract " + contractAddress + " " + (isErc721 ? "✅" : "❌")
        );

        if (isErc721) {
          fetchNFTMetadata(contractAddress)
            .then(async (data) => {
              if (data.result) {
                console.log("why", data.result);
                const metadata = JSON.parse(data.result[0].metadata);

                const { image, icon } = metadata || {};
                const name = data.result[0].name;
                let httpImage = image
                  ? image.replace("ipfs://", "https://ipfs.io/ipfs/")
                  : null;
                const result = await supabase.from("Contracts").upsert([
                  {
                    address: contractAddress,
                    name: name || "",
                    imageURL: httpImage
                      ? httpImage.includes("https://")
                        ? httpImage
                        : ""
                      : null,
                    iconURL: icon,
                    description: metadata?.description || "",
                  },
                ]);
              }
            })
            .catch((e) => console.log(e));
        }
      }

      // Save block to database
      await supabase
        .from("processed_blocks")
        .insert({ block: blockToSearch })
        .single();
      console.log("Block " + blockToSearch + " processed\n");
      // Go to next block
      blockToSearch--;
    }
  }
});

module.exports = blockchainRouter;
