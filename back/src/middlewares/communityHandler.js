const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");

module.exports = () =>
  async function handleCommunityPosts(req, res, next) {
    try {
      const contract_id = req.params.nft_contract;

      if (contract_id && req.user) {
        let { data: contains } = await req.supabase
          .from("u_holds_c")
          .select("*")
          .eq("user_id", req.user.id)
          .eq("contract_id", contract_id)
          .single();

        if (!contains) {
          return res.status(403).json({
            error: "not authorized to post or vote on this community",
          });
        }
      } else {
        return res.status(403).json({
          error: "not authorized to post or vote on this community",
        });
      }

      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({ error: "Not authorized to post or vote" });
    }
  };
