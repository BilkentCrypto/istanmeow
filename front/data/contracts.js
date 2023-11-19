 const qs = require('qs');

module.exports = {
  getContracts: async (
    token,
    { query = '', offset = 0, limit = 20, own = false } = {},
  ) =>
    (
      await fetch(
        `${process.env.NEXT_PUBLIC_FRONT_URL}/api/contracts${qs.stringify(
          { filter: query, limit, offset, own },
          { addQueryPrefix: true, skipNulls: true },
        )}`,
        {
          credentials: 'include',
          headers: token
            ? {
                token: token,
              }
            : {},
        },
      )
    ).json(),
  getContract: async (token, address = '') =>
    (
      await fetch(
        `${process.env.NEXT_PUBLIC_FRONT_URL}/api/contracts/getById/${address}`,
        {
          credentials: 'include',
          headers: token
            ? {
                token: token,
              }
            : {},
        },
      )
    ).json(),
};
