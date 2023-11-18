const Moralis = require("moralis").default;
const { createClient } = require("@supabase/supabase-js");
const jwt = require("jsonwebtoken");
const {
  fetchNftMoralis,
  fetchNftByAddressOpenSea,
} = require("../blockchain/opensea");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const STATEMENT = "Please sign this message to confirm your identity.";
const EXPIRATION_TIME = 900000;
const TIMEOUT = 15;

async function requestMessage({ address, chain, networkType }) {
  const url = new URL(process.env.SUPABASE_URL);
  const now = new Date();
  const expirationTime = new Date(now.getTime() + EXPIRATION_TIME);

  try {
    const result = await Moralis.Auth.requestMessage({
      address: address,
      chain: chain,
      networkType: networkType,
      domain: process.env.SITE_URL.replace("https://", ""),
      statement: STATEMENT,
      uri: process.env.SITE_URL,
      notBefore: now.toISOString(),
      expirationTime: expirationTime.toISOString(),
      timeout: TIMEOUT,
    });

    const { message } = result.toJSON();
    return message;
  } catch (err) {
    console.log(err);
    const message = { fail: "fail" };
    return message;
  }
}

async function verifyMessage({ networkType, signature, message, chain }) {
  try {
    const result = await Moralis.Auth.verify({
      networkType,
      signature,
      message,
    });

    const authData = result.toJSON();

    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("moralis_provider_id", authData.profileId)
      .single();

    if (!user) {
      await supabase
        .from("users")
        .insert({
          moralis_provider_id: authData.profileId,
          metadata: authData,
          address: authData?.address,
        })
        .single();
    }

    let { data: created_user } = await supabase
      .from("users")
      .select("*")
      .eq("moralis_provider_id", authData.profileId)
      .single();

    // TODO user can be null
    try {
      let mainnet = chain == "0x1" ? true : false;
      const data = await fetchNftByAddressOpenSea(
        created_user.address, mainnet
      );

      await Promise.all(
        data.assets?.map(async (e) => {
          try {
            if (!e.asset_contract?.address) return;

            await supabase.from("Contracts").upsert([
              {
                address: e.asset_contract?.address,
                name: e.collection?.name,
                imageURL: e.image_url,
                bannerURL: e.collection?.banner_image_url,
                description: e.description || e.collection?.description,
              },
            ]);
            await supabase.from("u_holds_c").upsert([
              {
                user_id: created_user.id,
                contract_id: e.asset_contract?.address,
                contract_name: e.asset_contract?.name,
                img_url: e.image_url,
              },
            ]);
          } catch (e) {
            console.log(e, "ERR TO SAVE CONTRACTS");
          }
        })
      );
    } catch (err) {
      console.log(err, "ERR TO SAVE CONTRACTS");
    }

    const token = jwt.sign(
      {
        id: authData.profileId,
        aud: "authenticated",
        role: "authenticated",
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      },
      process.env.SUPABASE_JWT
    );

    return { user: authData.profileId, token };
  } catch (err) {
    console.log(err);
  }
}

module.exports = { requestMessage, verifyMessage };
