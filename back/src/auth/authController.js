const { requestMessage, verifyMessage } = require("./authService");

async function request(req, res, next) {
  try {
    const { address, chain, networkType } = req.body;

    const message = await requestMessage({
      address,
      chain,
      networkType,
    });

    res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
}

async function verify(req, res, next) {
  try {
    const { networkType, message, signature, chain } = req.body;

    const user = await verifyMessage({
      networkType,
      message,
      signature,
      chain
    });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { request, verify };
