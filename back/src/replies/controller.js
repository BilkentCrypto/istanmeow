require("dotenv").config();
const express = require("express");
const router = express.Router();
const handleAuth = require("../middlewares/authHandler");

// API route for creating a reply for a post with the given ID and contract
router.post("/:post_id", handleAuth(), async (req, res) => {
  try {
    const { post_id } = req.params;
    const { reply_text, reply_img } = req.body;

    // Check if the post exists
    const { data: postData, error: postError } = await req.supabase
      .from("Posts")
      .select("*")
      .eq("post_id", post_id);

    if (postError) {
      return res.status(400).send({ message: "Failed to create reply." });
    }

    // Create the reply
    const { data, error } = await req.supabase.from("Replies").insert([
      {
        post_id: post_id,
        reply_text: reply_text,
        reply_img: reply_img || "",
        timestamp: new Date(),
        creator: req.user.id,
      },
    ]);

    if (error) {
      return res.status(400).send({ message: error });
    }

    return res.status(201).send({ message: "Reply created successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
});

// API route for retrieving all replies for a post with the given ID and contract
router.get("/:post_id", handleAuth(false), async (req, res) => {
  try {
    const { post_id } = req.params;

    // Check if the post exists
    const { data: postData, error: postError } = await req.supabase
      .from("Posts")
      .select("*")
      .eq("post_id", post_id);

    if (postData?.length === 0) {
      console.error("post not found");
      return res.status(404).send({ message: "Post not found." });
    }

    // Retrieve all replies for the given contract
    const { data, error } = await req.supabase.rpc("replies_with_vote", {
      post_id_arg: post_id,
      user_id_arg: req.user ? req.user.id : null,
    });

    if (error) {
      console.error(error, "error");
      return res.status(400).send({ message: "Failed to retrieve replies." });
    }

    return res.status(200).send({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
});

// Delete a reply for a post
router.delete("/:post_id/:reply_id", handleAuth(), async (req, res) => {
  const { post_id, reply_id } = req.params;
  try {
    const { error } = await req.supabase
      .from("Replies")
      .delete()
      .eq("reply_id", reply_id)
      .eq("post_id", post_id);

    if (error) throw error;
    res.send(`Reply with ID ${reply_id} deleted.`);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// API route for voting a reply by ID for a given post
router.post("/:post_id/:reply_id/vote", handleAuth(), async (req, res) => {
  try {
    const { reply_id, post_id } = req.params;
    const count = Number(req.body.count);

    // Check if required fields are provided
    if (!count || (count !== 1 && count !== -1)) {
      return res.status(400).send({ message: "Count is incorrect." });
    }

    const { data: reply, error: replyError } = await req.supabase
      .from("Replies")
      .select("*")
      .eq("post_id", post_id)
      .eq("reply_id", reply_id)
      .single();

    if (replyError || !reply) {
      console.log(replyError, reply);
      return res.status(404).send({ message: "Something went wrong" });
    }

    const { data: vote, error: voteError } = await req.supabase
      .from("reply_votes")
      .select("*")
      .eq("reply_id", reply_id)
      .eq("user_id", req.user.id);

    if (voteError) {
      console.error(voteError);
      return res.status(400).send({ message: "Failed to vote reply." });
    }

    if (vote.length && vote[0].vote === count) {
      return res.status(400).send({ message: "Already voted." });
    }

    const { error: updateError } = await req.supabase
      .from("Replies")
      .update({
        votes: reply.votes + count || count,
      })
      .eq("post_id", post_id)
      .eq("reply_id", reply_id);

    if (updateError) {
      console.error(updateError);
      return res.status(500).send({ message: "Failed to vote post." });
    }

    if (updateError) {
      return res.status(400).send({ message: "Failed to vote post." });
    }

    await req.supabase.from("reply_votes").upsert({
      user_id: req.user.id,
      reply_id: reply_id,
      vote: count,
    });

    return res.status(200).send({ message: "Post voted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
});

module.exports = router;
