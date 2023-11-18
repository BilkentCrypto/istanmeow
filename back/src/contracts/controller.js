require("dotenv").config();
const express = require("express");
const router = express.Router();
const handleAuth = require("../middlewares/authHandler");

// GET /contracts?filter=all|own
router.get("/", handleAuth(false), async (req, res) => {
  const { filter, limit, offset, own } = req.query;
  let fetchFinalIndex = Number(limit) + Number(offset) - 1; // range (0, 19) to return 20 elements

  try {
    if (own == "true") {
      if (!req.user) {
        return res.status(200).json({ contracts: [], count: 0 });
      }

      if (filter) {
        // search amoungst user's contracts
        let { data: contracts } = await req.supabase
          .from("u_holds_c")
          .eq("user_id", req.user.id)
          .ilike("contract_name", "%" + filter + "%")
          .order("imageURL", { ascending: true })
          .range(offset, fetchFinalIndex)
          .select("*");

        const { count } = await req.supabase
          .from("u_holds_c")
          .select("count", { count: "exact" })
          .ilike("contract_name", "%" + filter + "%")
          .eq("user_id", req.user.id);

        return res.status(200).json({ contracts, count, offset, limit });
      }

      // return all user's contracts
      const { data: contracts, error } = await req.supabase.rpc(
        "user_contracts",
        {
          user_id_arg: req.user?.id,
        }
      );
      console.log(contracts, "contracts");
      if (error) {
        return res.status(404).json({ error });
      }

      const { count } = await req.supabase
        .from("u_holds_c")
        .select("count", { count: "exact" })
        .eq("user_id", req.user.id);

      return res.status(200).json({ contracts, count, offset, limit });
    }

    if (filter) {
      // search amongst all contracts
      let match = "%" + filter + "%";
      let { data: contracts } = await req.supabase
        .from("Contracts")
        .select("*")
        .order("imageURL", { ascending: true })
        .range(offset, fetchFinalIndex)
        .ilike("name", match);

      const { count } = await req.supabase
        .from("Contracts")
        .select("count", { count: "exact" })
        .ilike("name", match);
      return res.status(200).json({ contracts, count, offset, limit });
    }

    // return all contracts

    const { data: contracts } = await req.supabase
      .from("Contracts")
      .select("*")
      .order("imageURL", { ascending: true })
      .range(offset, fetchFinalIndex);

    const { count } = await req.supabase
      .from("Contracts")
      .select("count", { count: "exact" });

    return res
      .status(200)
      .json({ contracts: contracts || [], count, offset, limit });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ err });
  }
});

// router.get("/search", [handleAuth(false),  vtoroy],  async (req, res) => {
//   const { address } = req.query;
//   try {
//     // should we have a range here?
//     // should it be case insensitive?
//     let {data: contracts} = await req.supabase
//       .from("Contracts")
//       .select("*")
//       .ilike('name', "%" + address.toLocaleLowerCase() + "%");
//     // .range(offset, fetchFinalIndex)
//     let {data: count} = await req.supabase
//       .from("Contracts")
//       .select("count")
//       .ilike('name', filter.toLocaleLowerCase());

//     return res.status(200).json({ contracts, count, offset, limit });
//   } catch (err) {
//     res.status(401).json({ err });
//   }
// });

// POST /contracts/search?address=0x1234123
router.get("/getById/:contractId", handleAuth(false), async (req, res) => {
  try {
    let { data: contract } = await req.supabase
      .from("Contracts")
      .select("*")
      .eq("address", req.params.contractId)
      .single();

    if (!contract) {
      return res.status(404).json({ message: "Contract not found." });
    }

    let hasAccess;
    if (req.user) {
      let { data: hasContract } = await req.supabase
        .from("u_holds_c")
        .select("*")
        .eq("user_id", req.user.id)
        .eq("contract_id", req.params.contractId)
        .single();

      hasAccess = !!hasContract;
    }

    return res.status(200).json({
      ...contract,
      hasAccess,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ err });
  }
});

// API route for adding a new contract
router.post("/", handleAuth(true), async (req, res) => {
  try {
    const { address, name } = req.body;

    // Check if address and name are provided
    if (!address || !name) {
      return res
        .status(400)
        .send({ message: "Address and name are required." });
    }

    // Insert the new contract into the database
    const { data, error } = await supabase
      .from("Contracts")
      .insert([{ address: address, name: name }]);

    if (error) {
      return res.status(500).send({ message: "Failed to add contract." });
    }

    return res.status(200).send({ message: "Contract added successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
});

// API route for updating a contract
router.put("/:address", async (req, res) => {
  try {
    const {
      name,
      holders,
      imageURL,
      about,
      guidelines,
      discord,
      website,
      twitter,
    } = req.body;
    const { address } = req.params;

    // Check if address and name are provided
    if (!address || !name) {
      return res
        .status(400)
        .send({ message: "Address and name are required." });
    }

    // Update the contract in the database
    const { data, error } = await req.supabase
      .from("Contracts")
      .update({
        name,
        holders,
        imageURL,
        about,
        guidelines,
        discord,
        website,
        twitter,
      })
      .eq("address", address);

    if (error) {
      return res.status(500).send({ message: "Failed to update contract." });
    }

    if (data.length === 0) {
      return res.status(404).send({ message: "Contract not found." });
    }

    return res.status(200).send({ message: "Contract updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
});

// API route for deleting a contract
router.delete("/:address", async (req, res) => {
  try {
    const { address } = req.params;

    // Delete the contract from the database
    const { data, error } = await req.supabase
      .from("Contracts")
      .delete()
      .eq("address", address);

    if (error) {
      return res.status(500).send({ message: "Failed to delete contract." });
    }

    if (data.length === 0) {
      return res.status(404).send({ message: "Contract not found." });
    }

    return res.status(200).send({ message: "Contract deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
});

module.exports = router;
