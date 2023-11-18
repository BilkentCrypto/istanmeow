const express = require("express");

const { requestMessage, verifyMessage } = require("./authService");

const authRouter = express.Router();

authRouter.get("/test", (req, res) => {
  console.log("Hello world");
  return res.status(200).send("Hello the world");
});

authRouter.post("/request-message", async (req, res, next) => {
  try {
    const { address, chain, networkType = "evm" } = req.body;

    const message = await requestMessage({
      address,
      chain,
      networkType,
    });

    res.status(200).json({ message });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

authRouter.post("/sign-message", async (req, res, next) => {
  try {
    const { networkType = "evm", message, signature, chain } = req.body;

    const user = await verifyMessage({
      networkType,
      message,
      signature,
      chain,
    });

    res.cookie("token", user.token, { httpOnly: true });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

authRouter.get("/logout", async (req, res, next) => {
  try {
    // remove ssr cookie(even though it should be removed on client side)
    res.clearCookie("address");
    // remove httpOnly cookie
    res.clearCookie("token");
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
});

module.exports = authRouter;
