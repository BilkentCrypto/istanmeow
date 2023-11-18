const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");

module.exports = (strict = true) =>
  async function handleAuth(req, res, next) {
    try {
      const token = req.header("token");

      if (!token && strict) {
        // remove ssr cookie on server side
        res.clearCookie("address");
        res.clearCookie("token");
        return res.status(401).json({ error: "Not authorized" });
      }

      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
      );
      // console.log("token", token);
      if (token) {
        const data = jwt.verify(token, process.env.SUPABASE_JWT);
        // console.log(token, "token", data);
        // console.log("data", data);
        if (data.id) {
          // console.log("hey", data.id);
          const { data: user } = await supabase
            .from("users")
            .select("*")
            .eq("moralis_provider_id", data.id)
            .single();
          // console.log("user", user);
          req.user = user;
        }
      }

      req.supabase = supabase;

      next();
    } catch (err) {
      console.log(err);
      // remove ssr cookie on server side
      res.clearCookie("address");
      res.clearCookie("token");
      return res.status(401).json({ error: "Not authorized" });
    }
  };
