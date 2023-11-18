const express = require("express");
const app = express();

const handleAuth = require("../middlewares/authHandler");
const communityHandler = require("../middlewares/communityHandler");

const router = express.Router();

// API route for retrieving all posts for a given contract
// should be available to public
router.get("/:nft_contract", handleAuth(false), async (req, res) => {
  try {
    const { nft_contract } = req.params;

    // Retrieve all posts for the given contract
    const { data, error } = await req.supabase.rpc("posts_with_reply_count", {
      nft_contract_arg: nft_contract,
      user_id_arg: req.user ? req.user.id : null,
    });

    if (error) {
      return res.status(500).json({ message: "Failed to retrieve posts." });
    }

    res.setHeader("Cache-Control", "no-cache");

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
});

// API route for retrieving a specific post by ID for a given contract
// should be available to public
router.get("/:nft_contract/:id", handleAuth(false), async (req, res) => {
  try {
    const { nft_contract, id } = req.params;

    // Retrieve all posts for the given contract
    const { data, error } = await req.supabase.rpc("post_with_reply_count", {
      post_id_arg: id,
      user_id_arg: req.user?.id,
    });

    if (error) {
      return res
        .status(500)
        .send({ message: "Failed to retrieve post.", error });
    }

    if (data.length === 0) {
      return res.status(404).send({ message: "Post not found." });
    }

    res.setHeader("Cache-Control", "no-cache");

    return res.status(200).send(data[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
});

// API route for creating a new post for a given contract
router.post("/:nft_contract", handleAuth(), async (req, res) => {
  try {
    const { nft_contract } = req.params;
    const { title, body, attached_img } = req.body;

    // Check if required fields are provided
    if (!title || !body) {
      return res.status(400).send({ message: "Title and body are required." });
    }

    // Insert the new post into the database
    const { data, error } = await req.supabase.from("Posts").insert([
      {
        nft_contract: nft_contract,
        title: title,
        body: body,
        attached_img: attached_img || "",
        votes: 0,
        timestamp: new Date(),
        creator: req.user.id,
      },
    ]);

    if (error) {
      console.error(error);
      return res.status(500).send({ message: "Failed to create post." });
    }

    return res.status(200).send({ message: "Post created successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
});

// API route for voting a post by ID for a given contract
router.post(
  "/:nft_contract/:post_id/vote",
  [handleAuth(), communityHandler()],
  async (req, res) => {
    try {
      const { nft_contract, post_id } = req.params;
      const count = Number(req.body.count);

      // Check if required fields are provided
      if (!count || (count !== 1 && count !== -1)) {
        return res.status(400).send({ message: "Count is incorrect." });
      }

      const { data: post, error: postError } = await req.supabase
        .from("Posts")
        .select("*")
        .eq("nft_contract", nft_contract)
        .eq("post_id", post_id)
        .single();

      if (postError || !post) {
        return res.status(404).send({ message: "Post not found" });
      }

      const { data: vote, error: voteError } = await req.supabase
        .from("post_votes")
        .select("*")
        .eq("post_id", post_id)
        .eq("user_id", req.user.id);

      if (voteError) {
        console.error(voteError);
        return res.status(400).send({ message: "Failed to vote post." });
      }

      if (vote.length && vote[0].vote === count) {
        return res.status(400).send({ message: "Already voted." });
      }

      const { error: updateError } = await req.supabase
        .from("Posts")
        .update({
          votes: post.votes + count || count,
        })
        .eq("nft_contract", nft_contract)
        .eq("post_id", post_id);

      if (updateError) {
        return res.status(400).send({ message: "Failed to vote post." });
      }

      await req.supabase.from("post_votes").upsert({
        user_id: req.user.id,
        post_id: post_id,
        vote: count,
      });

      return res.status(200).send({ message: "Post voted successfully." });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Server error." });
    }
  }
);

// API route for updating a post by ID for a given contract
router.put("/:nft_contract/:id", handleAuth(), async (req, res) => {
  try {
    const { nft_contract, id } = req.params;
    const { title, body, attached_img, upvotes, downvotes } = req.body;

    // Check if the post exists
    const { data: postData, error: postError } = await req.supabase
      .from("Posts")
      .select("*")
      .eq("nft_contract", nft_contract)
      .eq("post_id", id);

    if (postData.length === 0) {
      return res.status(404).send({ message: "Post not found." });
    }

    // Update the post
    const { data, error } = await supabase
      .from("Posts")
      .update({
        title: title,
        body: body,
        attached_img: attached_img,
        upvotes: upvotes,
        downvotes: downvotes,
      })
      .eq("nft_contract", nft_contract)
      .eq("post_id", id);

    console.log("eror", error);
    if (error) {
      return res.status(500).send({ message: "Failed to update post." });
    }
    return res.status(200).send({ message: "Post updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
});

// API route for deleting a post by ID for a given contract
router.delete("/:nft_contract/:id", handleAuth(), async (req, res) => {
  try {
    const { nft_contract, id } = req.params;
    // Check if the post exists
    const { data: postData, error: postError } = await req.supabase
      .from("Posts")
      .select("*")
      .eq("nft_contract", nft_contract)
      .eq("post_id", id)
      .single();

    if (postData.length === 0) {
      return res.status(404).send({ message: "Post not found." });
    }
    // Delete the post
    const deletePost = await supabase
      .from("Posts")
      .delete()
      .eq("nft_contract", nft_contract)
      .eq("post_id", id);

    return res.status(200).send({ message: deletePost });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
});

module.exports = router;
